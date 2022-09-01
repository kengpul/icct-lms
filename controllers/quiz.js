const Quiz = require('../models/quiz');

module.exports.index = (req, res) => {
    res.render('quiz/index');
}

module.exports.renderCreate = (req, res) => {
    res.render('quiz/create')
}

module.exports.create = async (req, res) => {
    const { title, description, answer } = req.body;
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
        answer
    })
    await newQuiz.save();

    req.flash('success', 'Quiz created!');
    res.redirect('/quiz');
}
