// MENU ELEMENTS
const menu = document.querySelector('.menu'); 
const cancelButton = document.querySelector('#cancel-button');
const addButton = document.querySelector('#add-project-button');
const addProjectText = document.querySelector('#add-project-text');
const addConfirmButton = document.querySelector('#add-confirm-button');
const removeButton = document.querySelector('#remove-button');
const removeConfirmButton = document.querySelector('#remove-confirm-button');
const menuProjectDropdown = document.querySelector('#menu-projects-dropdown'); 
const confirmButton = document.querySelector('#confirm-button'); 

// MAIN ELEMENTS
const main = document.querySelector('.main'); 
const backButton = document.querySelector('#back-button');
const headingLabel = document.querySelector('.heading-label');
const projectListInput = document.querySelector('#project-list-input');
const projectListButton = document.querySelector('#project-list-button');
const list = document.querySelector('.list');
const doneButton = document.querySelector('.done-button');
const editContainer = document.querySelector('.edit-container');
const editButton = document.querySelector('#edit-button');
const exitEditMenu = document.querySelector('#exit-edit-menu');

let projectsArray = JSON.parse(localStorage.getItem('projectsArray')) || [];
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let inEditMode = false; 

addButton.onclick = goToAddMenu;
removeButton.onclick = goToRemoveMenu;
cancelButton.onclick = backToMenu;
confirmButton.onclick = confirmProjectButton;
backButton.onclick = goToMenu;

addConfirmButton.onclick = addProjects;
removeConfirmButton.onclick = removeProjects;

projectListButton.onclick = addToDo;
projectListInput.onkeydown = enterInput;
addProjectText.onkeydown = enterDropDownInput;

if (projectsArray.length === 0){
  menuProjectDropdown.innerHTML = '<option value="">SELECT A PROJECT...</option>';
} else {
  displayProjects();
}


function confirmProjectButton(){
  if (menuProjectDropdown.value === ''){
    alert('Please select a project!');
  } else {
    menu.style.display = 'none';
    main.style.display = 'flex';
    projectListInput.select();
    
    headingLabel.innerHTML = projectsArray[menuProjectDropdown.value];
    displayToDo();
  };
}

function goToMenu(){
  main.style.display = 'none';
  menu.style.display = 'flex';

  projectListInput.value = null;
}

function addToDo() {
  if (projectListInput.value === ''){
    alert('To-do input must be filled in!');
  } else {
    for (let i = 0; i < projectsArray.length; i++){
      if (menuProjectDropdown.value === i.toString()){
        todoList[i].push(projectListInput.value.charAt(0).toUpperCase() + projectListInput.value.slice(1));
      }
    }
    projectListInput.value = null;
    displayToDo();
  }
}

function displayToDo(){
  let htmlList = '';
  for (let i = 0; i < projectsArray.length; i++){
    if (menuProjectDropdown.value === i.toString()){
      let html; 
      todoList[i].forEach((input, index) => {
        html = `
        <p class="values">
          <span class="values-span">
            <span class="values-span-bullet">•</span>
            <span class="input-span" ondblclick="editToDo(event, ${index});">${input}</span>
          </span> 
          <span class=values-button>
            <button id="delete-button" onclick="todoList[${i}].splice(${index}, 1); displayToDo();"><i class="fa fa-remove"></i></button>           
          </span>
        </p>`;
        htmlList += html; 
      }); 
    }
  }
  list.innerHTML = htmlList;
  localStorage.setItem('todoList', JSON.stringify(todoList)); 
}

function editToDo(event, index){
  html = `
    <input type="text" onkeydown="enterNewTask(event, event.target, this.value, ${index});" onblur="removeEditInput(event, ${index});"id="edit-task">
  `;
  event.target.innerHTML = html;
  event.target.children[0].select();
}

function enterNewTask(event, current, value, index) {
  if (event.key === 'Enter'){
    if (event.target.value === ''){
      alert('Please enter a text!');
    } else {
      event.target.removeEventListener('onblur', removeEditInput(event, index));
      current.replaceWith(value.charAt(0).toUpperCase() + value.slice(1));
      todoList[menuProjectDropdown.value][index] = current.value.charAt(0).toUpperCase() + current.value.slice(1);
      displayToDo();
    }
  } else if (event.key === 'Escape'){
    event.target.parentElement.innerHTML = todoList[menuProjectDropdown.value][index];
  } 
}

function removeEditInput(event, index){
  event.target.parentElement.innerHTML = todoList[menuProjectDropdown.value][index];
}

function enterInput(event) {
  if (event.key === 'Enter'){
    addToDo();
  } else if (event.key === 'Delete'){
    projectListInput.value = '';
  }
}

function enterDropDownInput(event){
  if (event.key === 'Enter'){
    addProjects();
  } 
}

function goToAddMenu(){
  menuProjectDropdown.style.display = 'none';
  confirmButton.style.display = 'none';
  addButton.style.display = 'none';
  removeButton.style.display = 'none';
  removeConfirmButton.style.display = 'none';
  addProjectText.style.display = 'inline'; 
  addConfirmButton.style.display = 'inline';
  cancelButton.style.display = 'inline';

  addProjectText.select();
}

function goToRemoveMenu(){
  if (projectsArray.length === 0){
    alert('No projects to delete!');
  } else {
    confirmButton.style.display = 'none';
    addProjectText.style.display = 'none'; 
    addButton.style.display = 'none';
    removeButton.style.display = 'none';
    menuProjectDropdown.style.display = 'inline';
    removeConfirmButton.style.display = 'inline';
    cancelButton.style.display = 'inline';
  }
}

function backToMenu(){
  menuProjectDropdown.style.display = 'inline';
  confirmButton.style.display = 'inline';
  addButton.style.display = 'inline';
  removeButton.style.display = 'inline';
  addProjectText.style.display = 'none'; 
  addConfirmButton.style.display = 'none';
  removeConfirmButton.style.display = 'none';
  cancelButton.style.display = 'none';
}

function addProjects(){
  if (addProjectText.value === ''){
    alert('Input must be filled in!');
  } else {
    projectsArray.push(addProjectText.value.toUpperCase());
    todoList.push([]);
    displayProjects();
    localStorage.setItem('projectsArray', JSON.stringify(projectsArray)); 
  }
}

function displayProjects(){
  let htmlList = '';
  let html;
  projectsArray.forEach((input, index) => {
    html = `
    <option value="${index}" selected="selected">${input}</option> 
  `;
  htmlList += html;
  })

  menuProjectDropdown.innerHTML = htmlList;
  addProjectText.value = null; 
  backToMenu();
}

function removeProjects(){
  projectsArray.splice(menuProjectDropdown.value, 1);
  todoList.splice(menuProjectDropdown.value, 1);
  localStorage.setItem('projectsArray', JSON.stringify(projectsArray)); 
  localStorage.setItem('todoList', JSON.stringify(todoList)); 
  displayProjects();
  if (projectsArray.length === 0){
    menuProjectDropdown.innerHTML = '<option value="">SELECT A PROJECT...</option>';
  }
  alert('Successfully removed!');
}
