let createNewTask = document.querySelector('.create-new-task');
// let idCounter = localStorage.getItem('idCounter') || 0;
let taskTemplate = document.querySelector('#task-template');
let listToDo = document.querySelector('#ToDo ul');
let listDone = document.querySelector('#Done ul');
// let closeBtn = document.querySelector('.btn-close');
let url = new URL('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks?api_key=50d2199a-42dc-447d-81ed-d68a443b697e');

let titles = {
    create: 'Новая задача',
    edit: 'Редактирование',
    show: 'Просмотр задачи',
}

let titlesBtn = {
    create: 'Создать',
    edit: 'Сохранить',
    show: 'ОК',
}


//Функция создания задачи
// передаём в эту ф-ю значения name, desc и status
async function createTask(name, desc, status) {
    let taskCreateData = new FormData();
    taskCreateData.append('name', name);
    taskCreateData.append('desc', desc);
    taskCreateData.append('status', status);

    let response = await fetch(url, { method: 'POST', body: taskCreateData });
    let responsePars = await response.json();
    return responsePars;

    // let task = {
    //     name: name,
    //     desc: desc,
    //     status: status,
    //     id: idCounter++,
    // }
    // localStorage.setItem(`task-${task['id']}`, JSON.stringify(task)); //запись остаётся в коде, но не на странице
    // setItem - пара ключ/значение
    // localStorage.setItem(`idCounter`, idCounter);
    // return task;
}


async function loadTasks() {

    let response = await fetch(url);
    response = await response.json();
    // return response;
    for (let i = 0; i < response.tasks.length; i++) {
        let taskValue = response.tasks[i];
        let task = createElemTask(taskValue);
        taskValue.status == "to-do" ? listToDo.append(task) : listDone.append(task);
    }
}

// function loadTasks() {
//     for(let i=0; i<localStorage.length; i++) {
//         let key = localStorage.key(i);
//         let taskValue = JSON.parse(localStorage.getItem(key));
//         let task = createElemTask(taskValue);
//         taskValue['status'] == "to-do" ? listToDo.append(task) : listDone.append(task);
//     }
// }

// на основе шаблона генерирует элемент новой задачи и заполняет его содержимым
function createElemTask(task) {
    let taskLi = taskTemplate.content.firstElementChild.cloneNode(true);
    taskLi.id = task['id'];
    let name = taskLi.querySelector('.task-name');
    name.innerHTML = task['name'];
    return taskLi;
}

//добавление задачи в список + изм-е кнопок на ред-е + на просмотр
async function createNewTaskHandler(event) {
    // поиск среди потомков closest
    let modalWindow = event.target.closest('.modal');
    let formInputs = modalWindow.querySelector('form').elements;
    let name = formInputs['task-name'].value;
    let desc = formInputs['task-desc'].value;
    let status = formInputs['task-status'].value;
    let action = formInputs['action'].value;
    // event.target.querySelector('.btn-close').innerHTML = actionCloseBtn[action];

    //получаем значение id 
    let taskId = formInputs['task-id'].value;
    // let task = localStorage.getItem(`task-${taskId}`);
    // task = JSON.parse(task);
    // task = parseTask(taskId);

    // task.name = name;
    // task.desc = desc;
    if (action == 'create') {
        let task = createTask(name, desc, status);
        let taskLi = createElemTask(task);
        status == "to-do" ? listToDo.append(taskLi) : listDone.append(taskLi);
    } else
        if (action == 'edit') {
            // localStorage.setItem(`task-${taskId}`, JSON.stringify(task));
            let taskData = new FormData();
            taskData.append('name', name);
            taskData.append('desc', desc);

            url.pathname += '/' + taskId;
            let resp = await fetch(url, { method: 'PUT', body: taskData });
            url.pathname = '/api/tasks';

            // let taskElem = document.getElementById(taskId);
            document.getElementById(taskId).querySelector('.task-name').innerHTML = name;
            // formInputs['.task-status'].closest('.row').classList.remove('d-none');

        } else
            if (action == 'show') {
                // let taskId = formInputs['task-id'].value;
                // let  task = localStorage.getItem(`task-${taskId}`);
                // task = JSON.parse(task);
                // task.name = name;
                // task.desc = desc;
                // localStorage.setItem(`task-${taskId}`, JSON.stringify(task));
            }

    // formInputs['task-name'].removeAttribute('disabled');
    // formInputs['task-desc'].removeAttribute('disabled');
    formInputs['task-status'].closest('.row').classList.remove('d-none');


    modalWindow.querySelector('form').reset(); //обнуляем форму после создания новой задачи
}

//подсчёт кол-ва задач
function updateCounters(event) {
    let card = event.target.closest('.card');
    let counterTasks = card.querySelector('.counter-tasks');
    let count = event.target.children.length;
    counterTasks.innerHTML = count;
}

//ОПЦИИ
//удаление - появление модального окна с именем задачи
async function deleteTaskHandler(event) {
    let modalWindow = event.target.closest('.modal');
    let taskId = event.relatedTarget.closest('.task').id; //ищем элемент li, внутри которого лежит интересующий id 
    // let task = localStorage.getItem(`task-${taskId}`);
    // task = JSON.parse(task);
    url.pathname += '/' + taskId;

    let response = await fetch(url);
    response = await response.json();
    url.pathname = '/api/tasks';

    let span = modalWindow.querySelector('.name-task');
    span.innerHTML = response.name;
    let form = modalWindow.querySelector('form');
    form.elements['task-id'].value = taskId;

}

async function deleteTaskBtnHandler(event) {
    //получаем значение id 
    let form = event.target.closest('.modal').querySelector('form');
    let taskId = form.elements['task-id'].value;
    url.pathname += '/' + taskId;
    let repsonseFromServer = await fetch(url, { method: 'DELETE' });
    repsonseFromServer = await repsonseFromServer.json();
    url.pathname = '/api/tasks';
    // // удаление данных из localStorage
    // localStorage.removeItem(`task-${taskId}`);
    let task = document.getElementById(taskId);
    task.remove();

}

// async function deleteTask(taskId) {
//     url.pathname += '/' + taskId;
//     let repsonseFromServer = await fetch(url, { method: 'DELETE' });
//     let deletedId = await repsonseFromServer.json();
//     url.pathname = '/api/tasks';
//     return deletedId;
// }

// перемещение задач по спискам
async function arrowHandler(event) {
    let taskId = event.target.closest('.task').id;
    // let task = localStorage.getItem(`task-${taskId}`);
    url.pathname += '/' + taskId;
    let task = await fetch(url);
    task = await task.json();

    task['status'] == "to-do" ? task['status'] = "done" : task['status'] = "to-do";
    let switchTask = document.getElementById(taskId);
    task['status'] == "to-do" ? listToDo.append(switchTask) : listDone.append(switchTask);

    // localStorage.setItem(`task-${taskId}`, JSON.stringify(task));
    let formData = new FormData();
    formData.append('status', task.status);
    // return task;
    let response = await fetch(url, { method: 'PUT', body: formData });

    url.pathname = '/api/tasks';
}

//редактирование
async function actionModalHandler(event) {
    let action = event.relatedTarget.dataset.action; //узнаём, какое действие сейчас выполняет пользователь
    let form = event.target.querySelector('form');
    form.elements['action'].value = action;
    event.target.querySelector('.modal-title').innerHTML = titles[action];
    event.target.querySelector('.create-new-task').innerHTML = titlesBtn[action];

    if (action != 'show') {
        form['task-name'].removeAttribute('disabled');
        form['task-desc'].removeAttribute('disabled');
    } else {
        form.elements['task-name'].setAttribute('disabled', 1);
        form.elements['task-desc'].setAttribute('disabled', 1);
    }

    if (action == 'edit' || action == 'show') {
        // let task = localStorage.getItem(`task-${taskId}`);
        // task = JSON.parse(task);
        let taskId = event.relatedTarget.closest('.task').id;
        form.elements['task-id'].value = taskId;

        url.pathname += '/' + taskId;
        let task = await fetch(url);
        task = await task.json();
        url.pathname = '/api/tasks';
        form.elements['task-name'].value = task.name;
        form.elements['task-desc'].value = task.desc;
        form.elements['task-status'].closest('.row').classList.add('d-none');

    } else
        if (action == 'create') {
            form.reset();
            form.elements['task-status'].closest('.row').classList.remove('d-none');

            // } else
            //     if (action == 'show') {
            //         // let taskId = event.relatedTarget.closest('.task').id;
            //         // form.elements['task-id'].value = taskId;
            //         // let task = localStorage.getItem(`task-${taskId}`);
            //         // task = JSON.parse(task);
            //         form.elements['task-name'].value = task.name;
            //         form.elements['task-desc'].value = task.desc;
            //         // task.name = form.elements['task-name'].setAttribute('disabled', 1);
            //         // task.desc = form.elements['task-desc'].setAttribute('disabled', 1);
            //         form.elements['task-status'].closest('.row').classList.add('d-none');

            //     }


        }
}

window.onload = async function () {
    createNewTask.addEventListener('click', createNewTaskHandler);
    // closeBtn.addEventListener('click', createNewTaskHandler);

    listToDo.addEventListener('DOMSubtreeModified', updateCounters);
    listDone.addEventListener('DOMSubtreeModified', updateCounters);

    await loadTasks();

    let modalDel = document.getElementById('del-task');
    modalDel.addEventListener('show.bs.modal', deleteTaskHandler); //show.bs.modal срабатывает сразу после нажатия на кнопку, но до того, как окно показывается пользователю

    let deleteBtn = document.getElementsByClassName('delete-task-btn')[0];
    deleteBtn.addEventListener('click', deleteTaskBtnHandler);

    let arrows = document.querySelectorAll('.arrow');
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].addEventListener('click', arrowHandler);
    }

    let actionModal = document.getElementById('new-task');
    actionModal.addEventListener('show.bs.modal', actionModalHandler);
}