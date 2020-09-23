const labels = document.querySelectorAll('.create__label');
const formInput = document.querySelector('.create__input');
const formTextarea = document.querySelector('.create__textarea');

function addLabelTransform(i){
  labels[i].classList.add('label-transform');
};

function removeLabelTransform(i){
  labels[i].classList.remove('label-transform');
};

formTextarea.addEventListener('change', function(){
  if (formTextarea.value !== '') {
    addLabelTransform(1);
  } else {
    removeLabelTransform(1);
  };
});

//
const casesList = document.querySelector('.cases__list');
const emptyList = document.querySelector('.cases__empty');
const casesBtns = document.querySelector('.cases__buttons');

function initialState() {
  if (localStorage.getItem('cases') == null) {
    emptyList.classList.remove('hidden');
    casesBtns.classList.add('hidden');
  } else {
    casesList.innerHTML = localStorage.getItem('cases');
    emptyList.classList.add('hidden');
    casesBtns.remove('hidden');
  };
};

initialState();

function addToStorage() {
  let content = casesList.innerHTML;
  localStorage.setItem('cases', content);
};

function addCase() {
  let title = formInput.value;
  let descr = formTextarea.value;

  if (title.length !== 0) {
    emptyList.classList.add('hidden');
    casesBtns.classList.remove('hidden');

    casesList.insertAdjacentHTML('beforeend', `
    <article class="cases__item">
    <h3 class="cases__subtitle subtitle">
      ${title}
    </h3>
    <p class="cases__descr">
      ${descr}
    </p>
    <span class="cases__item-buttons">
      <button class="cases__item-btn start-btn"></button>
      <button class="cases__item-btn complete-btn"></button>
      <button class="cases__item-btn delete-btn"></button>
    </span>
    </article>
    `);

    formInput.value = '';
    formTextarea.value = '';
    labels.forEach(label => label.classList.remove('label-transform'));

    addToStorage();
  };
};

const addCaseBtn = document.querySelector('.create__btn');

addCaseBtn.addEventListener('click', addCase);

// функции кнопок - начать выполнение, завершить, удалить
const startBtn = document.querySelectorAll('.start-btn');
const completeBtn = document.querySelectorAll('.complete-btn');
const deleteBtn = document.querySelectorAll('.delete-btn');

function startCase(elem){
  let item = elem.closest('.cases__item');
  item.classList.add('start-case');
  addToStorage();
};

function completeCase(elem){
  let item = elem.closest('.cases__item');
  item.classList.add('start-case');
  item.classList.toggle('complete-case');
  addToStorage();
};

function deleteCase(elem){
  let item = elem.closest('.cases__item');
  item.remove();
  addToStorage();
  const casesItems = document.querySelectorAll('.cases__item');

  if (casesItems.length === 0) {
    emptyList.classList.remove('hidden');
    casesBtns.classList.add('hidden');
    localStorage.removeItem('cases');
  };
};

document.body.addEventListener('click', function(event){
  let item = event.target;
  if (item.classList.contains('start-btn')) {
    startCase(item);
  };
  if (item.classList.contains('complete-btn')) {
    completeCase(item);
  };
  if (item.classList.contains('delete-btn')) {
    deleteCase(item);
  };
});

const casesStartAll = document.querySelector('.start-all');
const casesCompleteAll = document.querySelector('.complete-all');
const casesDeleteAll = document.querySelector('.delete-all');

casesStartAll.addEventListener('click', function(){
  const casesItems = document.querySelectorAll('.cases__item');
  casesItems.forEach(item => item.classList.add('start-case'));
  addToStorage();
});

casesCompleteAll.addEventListener('click', function(){
  const casesItems = document.querySelectorAll('.cases__item');
  for (i = 0; i < casesItems.length; i++) {
    casesItems[i].classList.add('complete-case');
    casesItems[i].classList.add('start-case');
  };
  addToStorage();
});

casesDeleteAll.addEventListener('click', function(){
  const casesItems = document.querySelectorAll('.cases__item');
  casesItems.forEach(item => item.remove());
  emptyList.classList.remove('hidden');
  casesBtns.classList.add('hidden');
  localStorage.removeItem('cases');
});


