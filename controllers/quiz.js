const Quiz = require('../models/quiz');
const User = require('../models/user');
const Group = require('../models/group');
const Post = require('../models/posts');
const { format, formatDistanceToNow } = require('date-fns');

module.exports.index = async(req, res) => {
    const quizes = await Quiz.find({});
    const userQuizes = await User.findById(req.user._id).populate('quizes');
    quizes.reverse();
    res.render('quiz/index', {quizes, userQuizes, formatDistanceToNow});
}

module.exports.renderCreate = (req, res) => {
    res.render('quiz/create')
}

module.exports.create = async (req, res) => {
    const { title, description, answer, dueDate } = req.body;
    const user = await User.findById(req.user._id);

    const quiz = [];
    let questions = [];
    let answers = [];

    for (let i = 0; i < Object.entries(req.body).length; i++) {
        const question = req.body[`question${i}`];
        const answer = req.body[`choices${i}`];

        if (question) {
            questions.push(question);
            quiz.push({ question });
        }
        if (answer) {
            answers.push(answer);
        }
    }

    for (let [i, q] of quiz.entries()) {
        q.choices = [`${answers[i]}`];
    }

    const newQuiz = new Quiz({
        title,
        description,
        author: req.user._id,
        quiz: [...quiz],
        answer,
        dueDate
    })

    user.quizes.push(newQuiz._id);

    await newQuiz.save();
    await user.save();

    req.flash('success', 'Quiz created!');
    res.redirect(`/quiz/open/${newQuiz._id}`);
}

module.exports.edit = async (req, res) => {
    const { title, description } = req.body;

    const quiz = [];
    let questions = [];
    let answers = [];

    for (let i = 0; i < Object.entries(req.body).length; i++) {
        const question = req.body[`question${i}`];
        const answer = req.body[`choices${i}`];

        if (question) {
            questions.push(question);
            quiz.push({ question });
        }
        if (answer) {
            answers.push(answer);
        }
    }

    for (let [i, q] of quiz.entries()) {
        q.choices = [`${answers[i]}`];
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, {
        title,
        description,
        quiz: [...quiz],
    })

    await updatedQuiz.save();

    req.flash('success', 'Quiz updated!');
    res.redirect(`/quiz/open/${updatedQuiz._id}`);
}

module.exports.takeQuiz = async(req, res) => {
    const {quizId, groupId} = req.params;
    const quiz = await Quiz.findById(quizId);

    for (let i = 0; i < quiz.quiz.length; i++) {
        const choice = quiz.quiz[i].choices.toString();
        quiz.quiz[i].choices = choice.split(',');
    }

    res.render('quiz/take', {quiz, groupId});
}

module.exports.submitQuiz = async (req, res) => {
    const {quizId, groupId} = req.params;
    const quiz = await Quiz.findById(quizId).populate('author');
    const group = await Group.findById(groupId);
    const user = await User.findById(req.user);
    const answers = [];
    let score = 0;

    for (let answer of Object.values(req.body)) {
        answers.push(parseInt(answer)+1);
    }

    const answer = quiz.answer.toString();
    quiz.answer = answer.split(',');

    for (let i = 0; i < answers.length; i++) {
        if (quiz.answer[i] == answers[i]) {
            score++
        }
    }

    user.done.push({quizId, score, groupId});
    user.quizes.splice(user.quizes.indexOf(quizId), 1);
    user.save();

    res.render('quiz/finish', {score, quiz, group, format});
}

module.exports.renderEdit = async(req, res) => {
    const quiz = await Quiz.findById(req.params.id).populate('assignedTo');
    const user = await User.findById(req.user).populate('groups');
    let assigning = [];

    for (let group of user.groups) {
        if (!quiz.assignedTo.some((g) => g._id.equals(group._id))) {
            assigning.push(group);
        } 
    }

    for (let i = 0; i < quiz.quiz.length; i++) {
        const choice = quiz.quiz[i].choices.toString();
        quiz.quiz[i].choices = choice.split(',');
    }

    res.render('quiz/edit', {quiz, user, assigning, format});
}

module.exports.assign = async(req, res, next) => {
    const {id} = req.params;
    const {groups} = req.body;

    if (!groups) {
        req.flash('error', 'No group selected');
        return res.redirect(`/quiz/open/${id}`);
    }

    const quiz = await Quiz.findById(id);

    for (let group of groups) {
        quiz.assignedTo.push(group);
        
        const groupId = await Group.findById(group).populate('students');
        quiz.groupId = groupId._id;
        groupId.quizes.push(group);

        for (let student of groupId.students) {
            if (student.type === 'Student') {
                const user = await User.findById(student._id);
                user.quizes.push(id);
                await user.save();
            }
        }
        await groupId.save();

        const created = new Date();

        let post = new Post({
            text: `Quiz:  ${quiz.title}`,
            created,
            group: groupId._id,
            author: req.user._id,
            quizLink: quiz._id
        });

        await post.save();

    }

    await quiz.save();

    res.redirect(`/quiz/open/${id}`);
}

module.exports.unassign = async(req, res) => {
    const {id} = req.params;
    const quiz = await Quiz.findById(id);

    if (!req.body.groups) {
        req.flash('error', 'No group selected');
        return res.redirect(`/quiz/open/${id}`);
    }

    for (let group of req.body.groups) {
        const index = quiz.assignedTo.indexOf(group);
        quiz.assignedTo.splice(index, 1);

        const groupId = await Group.findById(group).populate('students');
        const groupIndex = groupId.quizes.indexOf(group);
        groupId.quizes.splice(groupIndex, 1);

        for (let student of groupId.students) {
            if (student.type === 'Student') {
                const user = await User.findById(student._id);
                const quizIndex = user.quizes.indexOf(id);
                user.quizes.splice(quizIndex, 1)
                await user.save();
            }
        }

        groupId.save();
    }

    await quiz.save();

    res.redirect(`/quiz/open/${id}`);
}

module.exports.delete = async (req, res) => {
    await Quiz.deleteOne({_id: req.params.id});

    req.flash('success', 'Quiz deleted!');
    res.redirect('/quiz');
}