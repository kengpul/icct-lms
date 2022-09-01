const form = document.querySelector('.main-form');
const addQuestion = document.querySelector('.add-question');
const submit = document.querySelector('.submit');
let questionsLength = document.querySelectorAll('.card').length;

submit.addEventListener('click', () => {
    form.answer.value = Object.values(correctAnswers);
    form.submit();
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
})

const clicked = (id) => {
    let answerLength = document.querySelector(`#question${id.slice(-1)}`).children[1].children.length + 1;
    const cardBody = document.querySelector(`#${id}`);
    const span = document.createElement('span');
    span.classList.add('d-flex', 'mb-3', 'align-items-center');
    span.setAttribute('id', `${id}-choice${answerLength}`);
    span.innerHTML = `
    <input type="text" class="form-control" name="choices${id.slice(-1)}[]">
        <button class="btn btn-success btn-sm mx-3" id="${id}-correct${answerLength}"
            onclick="correct(this.id)">Correct</button>
    `
    cardBody.children[1].append(span);
}

const correctAnswers = {}
const correct = (id) => {
    const index = id.slice(8, 10).match(/\d/g).join('');
    const value = id.slice(-2).match(/\d/g).join('');
    correctAnswers[index] = value;
    const input = document.querySelector(`#${id}`).previousElementSibling;
    input.classList.add('border', 'border-2', 'border-success');
}

addQuestion.addEventListener('click', (e) => {
    e.preventDefault();
    const questionCounter = questionsLength + 1;
    const div = document.createElement('div');
    div.classList.add('mb-3', 'card', 'border', 'border-5');
    div.innerHTML = `
    <div class="card-body" id="question${questionCounter}">
        <input type="text" class="form-control" name="question${questionCounter}" value="Untitled question">
        <div class="choices w-75 mt-4">
            <span class="d-flex mb-3 align-items-center" id="${questionCounter}-choice1">
                <input type="text" class="form-control" name="choices${questionCounter}[]">
                <button class="btn btn-success btn-sm mx-3" id="question${questionCounter}-correct1"
                    onclick="correct(this.id)">Correct</button>
            </span>
        </div>
        <button id="question${questionCounter}" class="btn btn-sm btn-primary mt-2 add-choice w-25"
            onclick="clicked(this.id)">Add choice</button>
    </div>
    `
    form.append(div);
    questionsLength++;
    window.scrollTo(0, document.body.scrollHeight);
})
