document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Render todos
    renderTodos();
    
    // Add todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Filter todos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTodos();
        });
    });
    
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }
    
    function renderTodos() {
        const filter = document.querySelector('.filter-btn.active').dataset.filter;
        
        let filteredTodos = todos;
        if (filter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks found';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#888';
            todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.className = 'todo-item' + (todo.completed ? ' completed' : '');
                todoItem.dataset.id = todo.id;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', toggleTodo);
                
                const todoText = document.createElement('span');
                todoText.className = 'todo-text';
                todoText.textContent = todo.text;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', deleteTodo);
                
                todoItem.appendChild(checkbox);
                todoItem.appendChild(todoText);
                todoItem.appendChild(deleteBtn);
                
                todoList.appendChild(todoItem);
            });
        }
    }
    
    function toggleTodo(e) {
        const todoId = parseInt(e.target.parentElement.dataset.id);
        const todo = todos.find(todo => todo.id === todoId);
        if (todo) {
            todo.completed = e.target.checked;
            saveTodos();
            renderTodos();
        }
    }
    
    function deleteTodo(e) {
        const todoId = parseInt(e.target.parentElement.dataset.id);
        todos = todos.filter(todo => todo.id !== todoId);
        saveTodos();
        renderTodos();
    }
    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});

