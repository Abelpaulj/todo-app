const list = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(list));
}

function renderToDoList(filteredList =list ) {
  console.log('Rendering List:', list); 
  let todoListHtml = '';
  filteredList.forEach((task, index) => {
    const html = `
      <section class="tasks js-tasks" data-index="${index}">
        <p class="task">${task.task_name}</p>
        <p class="date">Created: ${task.task_createdAt}</p>
        <p class="due">Due: ${task.due_date}</p>
        <button class="edit js-edit"> <img src="images/edit.png" alt=""></button>
        <button class="delete js-delete">
        <img src="images/delete.png" alt=""></button>
      </section>
    `;
    todoListHtml += html;
  });

  document.querySelector('.js-tasks-container').innerHTML = todoListHtml;

  
  document.querySelectorAll('.js-delete').forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', () => {
      list.splice(index, 1);
      saveTasksToLocalStorage();
      renderToDoList();
    });
  });

  


  let isEditing = false;
  document.querySelectorAll('.js-edit').forEach((editButton, index) => {
    editButton.addEventListener('click', (event) => {
      event.preventDefault(); 
      if (isEditing) {
        alert('You are already editing a task. Please save or cancel the current edit before editing another task.');
        return; // Exit if an edit is already active
      }
  


      isEditing = true;
      const task = filteredList[index];
      
      const html = `
      
        <section class="edit-class">
        <input class="input-task js-input" type="text" value="${task.task_name}">
        <input class="input-due js-input-due" type="date" value="${task.due_date}">
          <div class="edit-button">
            <button class="save">Save</button>
            <button class="cancel">Cancel</button>
          </div>
        </section>
        
      `;
      
      const taskContainer = document.querySelector(`.js-tasks[data-index="${index}"]`);
      //console.log(`Editing task at index ${index}`, taskContainer);

      taskContainer.innerHTML = html;

      
      taskContainer.querySelector('.save').addEventListener('click', () => {
        saveTask(taskContainer, index);
        isEditing = false;
      })

      taskContainer.querySelector('.cancel').addEventListener('click', () => {
        renderToDoList();
        isEditing = false;

      });
      taskContainer.querySelector('.js-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          isEditing = false;
          event.preventDefault(); 
          saveTask(taskContainer, index);}

    });
  });
})



}
function saveTask(taskContainer, index) {
  const updatedTask = taskContainer.querySelector('.js-input').value.trim();
  const updatedDueDate = taskContainer.querySelector('.js-input-due').value;

  console.log('Updated Task Name:', updatedTask);
  console.log('Updated Due Date:', updatedDueDate);

  if (updatedTask === '') {
    alert("Task cannot be empty.");
    return;
  }
  if (updatedDueDate === '') {
    alert("Task cannot be empty.");
    return;
  }
  list[index].task_name = updatedTask;
  list[index].due_date = updatedDueDate;
  saveTasksToLocalStorage();
  renderToDoList();
}





renderToDoList();


document.querySelector('.js-add').addEventListener('click', () => {
  addTask();
});

document.querySelector('.js-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
    

  }
});


function addTask() {
  const input = document.querySelector('.js-input');
  const value = input.value.trim();
  const dueInput =document.querySelector('.js-due-input');
  const dueDate = dueInput.value;
if (value === '') {
    alert("Please enter a task.");
    return;
    
  }
  if (!dueDate) {
    alert("Please enter a due date.");
    return;
  }

const newTask={
  task_name:value,
  due_date:dueDate,
  task_createdAt:new Date().toLocaleDateString()//for real time dates
}


  list.push(newTask);
  input.value = '';
  dueInput.value = '';
  saveTasksToLocalStorage();
  renderToDoList();
}
//filter


document.querySelector('.js-filter').addEventListener('click', () => {
  const filterContainer = document.querySelector('.js-filter-container');
  if (filterContainer.innerHTML === '') {
    // Show filter inputs
    filterContainer.innerHTML = `
      <input class="filter-name js-filter-name" type="text" placeholder="Filter by task name">
      <input class="filter-date js-filter-date" type="date" placeholder="Filter by creation date">
      <button class="filter-button js-filter-button">Filter</button>
      <button class="filter-clear js-clear-filter">Clear Filters</button>
    `;

    // when filter button is clicked 
    document.querySelector('.js-filter-button').addEventListener('click', () => {
      const filterName = document.querySelector('.js-filter-name').value.trim().toLowerCase();
      const filterDate = document.querySelector('.js-filter-date').value;
    
      const filteredList = list.filter(task => {
        const matchesName = filterName === '' || task.task_name.toLowerCase().includes(filterName);
        const matchesDate = filterDate === '' || task.task_createdAt === filterDate;
        return matchesName && matchesDate;
      });
    
      renderToDoList(filteredList);
    });
    
    document.querySelector('.js-clear-filter').addEventListener('click', () => {
      document.querySelector('.js-filter-name').value = '';
      document.querySelector('.js-filter-date').value = '';
      renderToDoList();
    });

    //real time
    document.querySelector('.js-filter-name').addEventListener('input', () => { 
      const filterName = document.querySelector('.js-filter-name').value.trim().toLowerCase(); 
      const filteredList = list.filter(task =>task.task_name.toLowerCase().includes(filterName) 
      );
       renderToDoList(filteredList);
       });
       document.querySelector('.js-filter-date').addEventListener('change', () => { 
        const filterDate = document.querySelector('.js-filter-date').value; 
        
        const filteredList = list.filter(task => task.taskDate === filterDate );
         renderToDoList(filteredList);
         console.log('Filter Date:', filterDate);
         }); 
  }
   else {
    // Hide filter inputs
    filterContainer.innerHTML = '';
  }
});