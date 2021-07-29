document.addEventListener('DOMContentLoaded', function () {
    // Selectors
    const todoInput = document.querySelector(".todo-input");
    const todoButton = document.querySelector(".todo-button");
    const editButton = document.querySelector(".edit-button");
    const todoList = document.querySelector(".todo-list");
    const main = document.querySelector(".main");
    const edit = document.querySelector(".edit");

    //Event Listeners 
    todoButton.addEventListener("click", addTodo);
    editButton.addEventListener("click", editTodo);
    todoList.addEventListener("click", deleteCheck);

    //loading data at first

    fetch('http://127.0.0.1:8000/todo_api/task-list/?format=json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                satadd(data[data.length - i - 1].id, data[data.length - i - 1].title, data[data.length - i - 1].completed)
            }
        });

    // Functions
    function editTodo() {
        var a = document.querySelector('.edit-input').dataset.completed;
        var b = document.querySelector('.edit-input').dataset.id;
        var c = document.querySelector('.edit-input').value;
        let _data = {
            id: b,
            title: c,
            completed: a
        }
        fetch('http://127.0.0.1:8000/todo_api/task-update/' + b + '/', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => {
                // console.log(json);
            });
        main.style.display = "block";
        edit.style.display = "none";

    }
    function satadd(id, content, completed) {
        // Event.preventDefault(); //Prevent form from submitting
        // todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        // Create li
        const newTodo = document.createElement('li');
        newTodo.dataset.id = id;
        newTodo.dataset.completed = completed;
        newTodo.innerText = content;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        // console.log(newTodo.dataset.completed);
        if (newTodo.dataset.completed == "true") {
            todoDiv.classList.add("completed");
        }
        //edit button
        const editButton = document.createElement('button');
        editButton.innerHTML = "<i class='fas fa-edit'></i>";
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);
        // Check Mark Button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = "<i class='fas fa-check'></i>";
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Check trash Button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        // Append to list 
        todoList.appendChild(todoDiv);
        // clear to do input value
        todoInput.value = " ";
    }

    function addTodo(Event) {

        Event.preventDefault(); //Prevent form from submitting
        // todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        // Create li
        const newTodo = document.createElement('li');
        newTodo.innerText = todoInput.value;
        //sending post request
        let _data = {
            id: 4,
            title: todoInput.value,
            completed: "false"
        }
        fetch('http://127.0.0.1:8000/todo_api/task-create/', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => {
                newTodo.dataset.id = json.id;
                newTodo.dataset.completed = json.completed;
            });
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        //edit button
        const editButton = document.createElement('button');
        editButton.innerHTML = "<i class='fas fa-edit'></i>";
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);
        // Check Mark Button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = "<i class='fas fa-check'></i>";
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //Check trash Button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        // Append to list 
        todoList.appendChild(todoDiv);
        // clear to do input value
        todoInput.value = " ";
    }

    function deleteCheck(e) {
        const item = e.target;
        // console.log(item);
        // todo delete
        if (item.classList[0] === "trash-btn") {
            const todo = item.parentElement;
            todo.classList.add("fall");
            todo.addEventListener("transitionend", function () {
                fetch('http://127.0.0.1:8000/todo_api/task-delete/' + todo.children[0].dataset.id, {
                    method: "DELETE",
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                })
                    .then(response => response.json())
                    .then(json => { console.log(json) });
                todo.remove();
            }
            );
        }
        // checkmark
        if (item.classList[0] === "complete-btn") {
            const todo = item.parentElement;
            var she = todo.children[0].dataset.completed;
            // console.log(she);
            if (she == "true") {
                she = false;
            }
            else {
                she = true;
            }
            todo.children[0].dataset.completed = she;
            //sending post request
            let _data = {
                id: todo.children[0].dataset.id,
                title: todo.children[0].innerHTML,
                completed: she
            }
            // console.log(she);
            fetch('http://127.0.0.1:8000/todo_api/task-update/' + todo.children[0].dataset.id + '/', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
                .then(response => response.json())
                .then(json => {
                    // console.log(json);
                });

            todo.classList.toggle("completed");
        }
        //update
        if (item.classList[0] === "edit-btn") {
            const todo = item.parentElement;
            var text = todo.children[0].innerHTML;
            main.style.display = "none";
            edit.style.display = "block";
            const re=document.querySelector('.edit-input');
            re.value = text;
            re.dataset.completed = todo.children[0].dataset.completed;
            re.dataset.id = todo.children[0].dataset.id;
        }

    }
})