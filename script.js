// =========================
// GET HTML ELEMENTS
// =========================

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const categoryFilter = document.getElementById("categoryFilter");
const sortInput = document.getElementById("sortInput");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const darkModeBtn = document.getElementById("darkModeBtn");


// =========================
// DASHBOARD ELEMENTS
// =========================

const completionPercentage =
    document.getElementById("completionPercentage");

const highPriorityCount =
    document.getElementById("highPriorityCount");

const overdueCount =
    document.getElementById("overdueCount");

const dueTodayCount =
    document.getElementById("dueTodayCount");

const studyCount =
    document.getElementById("studyCount");

const workCount =
    document.getElementById("workCount");

const personalCount =
    document.getElementById("personalCount");

const shoppingCount =
    document.getElementById("shoppingCount");

const otherCount =
    document.getElementById("otherCount");

const studyProgress =
    document.getElementById("studyProgress");

const workProgress =
    document.getElementById("workProgress");

const personalProgress =
    document.getElementById("personalProgress");

const shoppingProgress =
    document.getElementById("shoppingProgress");

const otherProgress =
    document.getElementById("otherProgress");


// =========================
// LOAD TASKS FROM LOCAL STORAGE
// =========================

let tasks =
    JSON.parse(localStorage.getItem("todoTasks")) || [];


// =========================
// NORMALIZE OLD TASKS
// =========================

tasks = tasks.map(function (task) {

    return {

        id: task.id || Date.now(),

        text: task.text || "",

        category: task.category || "Personal",

        priority: task.priority || "Medium",

        dueDate: task.dueDate || "",

        completed: Boolean(task.completed)

    };

});


// =========================
// CURRENT FILTER
// =========================

let currentFilter = "all";


// =========================
// SAVE TASKS
// =========================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


// =========================
// ADD TASK
// =========================

function addTask() {

    const taskText =
        taskInput.value.trim();


    if (taskText === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        text: taskText,

        category: categoryInput.value,

        priority: priorityInput.value,

        dueDate: dueDateInput.value,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    categoryInput.value = "Personal";

    priorityInput.value = "Medium";

    dueDateInput.value = "";


    displayTasks();

    taskInput.focus();

}


// =========================
// FORMAT DATE
// =========================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const parts = date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}


// =========================
// GET DUE DATE STATUS
// =========================

function getDueDateStatus(dueDate) {

    if (!dueDate) {
        return "";
    }


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const due =
        new Date(dueDate + "T00:00:00");

    due.setHours(0, 0, 0, 0);


    if (due < today) {
        return "overdue";
    }


    if (due.getTime() === today.getTime()) {
        return "today";
    }


    return "upcoming";

}


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =========================
// PRIORITY VALUE
// =========================

function getPriorityValue(priority) {

    if (priority === "High") {
        return 3;
    }


    if (priority === "Medium") {
        return 2;
    }


    return 1;

}


// =========================
// SORT TASKS
// =========================

function sortTasks(taskArray) {

    const sortType =
        sortInput.value;

    const sortedTasks =
        [...taskArray];


    // Newest first

    if (sortType === "newest") {

        sortedTasks.sort(function (a, b) {

            return b.id - a.id;

        });

    }


    // Oldest first

    else if (sortType === "oldest") {

        sortedTasks.sort(function (a, b) {

            return a.id - b.id;

        });

    }


    // Due date

    else if (sortType === "dueDate") {

        sortedTasks.sort(function (a, b) {

            if (!a.dueDate && !b.dueDate) {
                return 0;
            }


            if (!a.dueDate) {
                return 1;
            }


            if (!b.dueDate) {
                return -1;
            }


            return a.dueDate.localeCompare(
                b.dueDate
            );

        });

    }


    // Priority

    else if (sortType === "priority") {

        sortedTasks.sort(function (a, b) {

            return (
                getPriorityValue(b.priority) -
                getPriorityValue(a.priority)
            );

        });

    }


    return sortedTasks;

}


// =========================
// DISPLAY TASKS
// =========================

function displayTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    let filteredTasks =
        tasks.filter(function (task) {

            // Search

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchText);


            // Status

            let matchesStatus = true;


            if (currentFilter === "active") {

                matchesStatus =
                    !task.completed;

            }


            else if (
                currentFilter === "completed"
            ) {

                matchesStatus =
                    task.completed;

            }


            // Category

            let matchesCategory = true;


            if (selectedCategory !== "all") {

                matchesCategory =
                    task.category ===
                    selectedCategory;

            }


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });


    filteredTasks =
        sortTasks(filteredTasks);


    // Empty message

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }


    // Display each task

    filteredTasks.forEach(function (task) {

        const taskItem =
            document.createElement("div");


        taskItem.className = "task-item";


        if (task.completed) {

            taskItem.classList.add("completed");

        }


        // Priority class

        let priorityClass =
            "priority-medium";


        if (task.priority === "Low") {

            priorityClass =
                "priority-low";

        }

        else if (task.priority === "High") {

            priorityClass =
                "priority-high";

        }


        // Due date

        let dueDateHTML = "";


        if (task.dueDate) {

            const status =
                getDueDateStatus(
                    task.dueDate
                );


            let statusText =
                "Upcoming";


            if (status === "overdue") {

                statusText =
                    "Overdue";

            }

            else if (status === "today") {

                statusText =
                    "Due Today";

            }


            dueDateHTML = `

                <span class="due-date ${status}">

                    Due:
                    ${formatDate(task.dueDate)}
                    -
                    ${statusText}

                </span>

            `;

        }


        taskItem.innerHTML = `

            <div class="task-content">

                <div class="task-name">

                    ${escapeHTML(task.text)}

                </div>


                <div class="task-details">

                    <span class="category-badge">

                        ${escapeHTML(task.category)}

                    </span>


                    <span class="${priorityClass}">

                        ${escapeHTML(task.priority)}
                        Priority

                    </span>


                    ${dueDateHTML}

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${
                        task.completed
                            ? "Undo"
                            : "Complete"
                    }
                </button>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskItem);

    });


    // Update everything

    updateTaskCounts();

    updateProgress();

    updateDashboard();

}


// =========================
// COMPLETE / UNDO TASK
// =========================

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }


        return task;

    });


    saveTasks();

    displayTasks();

}


// =========================
// DELETE TASK
// =========================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


// =========================
// EDIT TASK
// =========================

function editTask(id) {

    const task =
        tasks.find(function (item) {

            return item.id === id;

        });


    if (!task) {
        return;
    }


    // Task name

    const newText =
        prompt(
            "Edit task:",
            task.text
        );


    if (newText === null) {
        return;
    }


    if (newText.trim() === "") {

        alert("Task cannot be empty.");

        return;

    }


    // Category

    const newCategory =
        prompt(
            "Enter category: Study, Work, Personal, Shopping, or Other",
            task.category
        );


    if (newCategory === null) {
        return;
    }


    const categoryValue =
        newCategory
            .trim()
            .toLowerCase();


    const validCategories = [
        "study",
        "work",
        "personal",
        "shopping",
        "other"
    ];


    if (
        !validCategories.includes(
            categoryValue
        )
    ) {

        alert(
            "Please enter: Study, Work, Personal, Shopping, or Other."
        );

        return;

    }


    const formattedCategory =
        categoryValue.charAt(0).toUpperCase() +
        categoryValue.slice(1);


    // Priority

    const newPriority =
        prompt(
            "Enter priority: Low, Medium, or High",
            task.priority
        );


    if (newPriority === null) {
        return;
    }


    const priorityValue =
        newPriority
            .trim()
            .toLowerCase();


    const validPriorities = [
        "low",
        "medium",
        "high"
    ];


    if (
        !validPriorities.includes(
            priorityValue
        )
    ) {

        alert(
            "Please enter Low, Medium, or High."
        );

        return;

    }


    const formattedPriority =
        priorityValue.charAt(0).toUpperCase() +
        priorityValue.slice(1);


    // Due date

    const newDueDate =
        prompt(
            "Enter due date in YYYY-MM-DD format. Leave empty to remove.",
            task.dueDate
        );


    if (newDueDate === null) {
        return;
    }


    // Update task

    task.text =
        newText.trim();

    task.category =
        formattedCategory;

    task.priority =
        formattedPriority;

    task.dueDate =
        newDueDate.trim();


    saveTasks();

    displayTasks();

}


// =========================
// UPDATE BASIC COUNTERS
// =========================

function updateTaskCounts() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const active =
        total - completed;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;

}


// =========================
// UPDATE PROGRESS
// =========================

function updateProgress() {

    const total =
        tasks.length;


    if (total === 0) {

        progressText.textContent =
            "0% Complete";

        progressFill.style.width =
            "0%";

        return;

    }


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    progressText.textContent =
        percentage + "% Complete";


    progressFill.style.width =
        percentage + "%";

}


// =========================
// UPDATE STATISTICS DASHBOARD
// =========================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    // -------------------------
    // Completion Percentage
    // -------------------------

    let completion = 0;


    if (total > 0) {

        completion =
            Math.round(
                (completed / total) * 100
            );

    }


    completionPercentage.textContent =
        completion + "%";


    // -------------------------
    // High Priority
    // -------------------------

    const highPriority =
        tasks.filter(function (task) {

            return task.priority === "High";

        }).length;


    highPriorityCount.textContent =
        highPriority;


    // -------------------------
    // Overdue
    // -------------------------

    const overdue =
        tasks.filter(function (task) {

            return (
                !task.completed &&
                getDueDateStatus(
                    task.dueDate
                ) === "overdue"
            );

        }).length;


    overdueCount.textContent =
        overdue;


    // -------------------------
    // Due Today
    // -------------------------

    const dueToday =
        tasks.filter(function (task) {

            return (
                !task.completed &&
                getDueDateStatus(
                    task.dueDate
                ) === "today"
            );

        }).length;


    dueTodayCount.textContent =
        dueToday;


    // -------------------------
    // Category Counts
    // -------------------------

    const study =
        tasks.filter(function (task) {

            return task.category === "Study";

        }).length;


    const work =
        tasks.filter(function (task) {

            return task.category === "Work";

        }).length;


    const personal =
        tasks.filter(function (task) {

            return task.category === "Personal";

        }).length;


    const shopping =
        tasks.filter(function (task) {

            return task.category === "Shopping";

        }).length;


    const other =
        tasks.filter(function (task) {

            return task.category === "Other";

        }).length;


    studyCount.textContent =
        study;


    workCount.textContent =
        work;


    personalCount.textContent =
        personal;


    shoppingCount.textContent =
        shopping;


    otherCount.textContent =
        other;


    // -------------------------
    // Category Progress
    // -------------------------

    function categoryPercentage(count) {

        if (total === 0) {
            return 0;
        }


        return Math.round(
            (count / total) * 100
        );

    }


    studyProgress.style.width =
        categoryPercentage(study) + "%";


    workProgress.style.width =
        categoryPercentage(work) + "%";


    personalProgress.style.width =
        categoryPercentage(personal) + "%";


    shoppingProgress.style.width =
        categoryPercentage(shopping) + "%";


    otherProgress.style.width =
        categoryPercentage(other) + "%";

}


// =========================
// CLEAR COMPLETED TASKS
// =========================

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    if (completedCount === 0) {

        alert(
            "There are no completed tasks."
        );

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all completed tasks?"
        );


    if (!confirmClear) {
        return;
    }


    tasks =
        tasks.filter(function (task) {

            return !task.completed;

        });


    saveTasks();

    displayTasks();

}


// =========================
// FILTER BUTTONS
// =========================

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add("active");


            currentFilter =
                button.getAttribute(
                    "data-filter"
                );


            displayTasks();

        }
    );

});


// =========================
// SEARCH
// =========================

searchInput.addEventListener(
    "input",
    function () {

        displayTasks();

    }
);


// =========================
// CATEGORY FILTER
// =========================

categoryFilter.addEventListener(
    "change",
    function () {

        displayTasks();

    }
);


// =========================
// SORT
// =========================

sortInput.addEventListener(
    "change",
    function () {

        displayTasks();

    }
);


// =========================
// ADD TASK BUTTON
// =========================

addTaskBtn.addEventListener(
    "click",
    addTask
);


// =========================
// ENTER KEY
// =========================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// =========================
// CLEAR COMPLETED BUTTON
// =========================

clearCompletedBtn.addEventListener(
    "click",
    clearCompletedTasks
);


// =========================
// DARK MODE
// =========================

function applyDarkMode() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (darkMode === "enabled") {

        document.body.classList.add(
            "dark-mode"
        );


        darkModeBtn.textContent =
            "☀️ Light Mode";

    }

    else {

        document.body.classList.remove(
            "dark-mode"
        );


        darkModeBtn.textContent =
            "🌙 Dark Mode";

    }

}


// =========================
// DARK MODE BUTTON
// =========================

darkModeBtn.addEventListener(
    "click",
    function () {

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            document.body.classList.remove(
                "dark-mode"
            );


            localStorage.setItem(
                "darkMode",
                "disabled"
            );


            darkModeBtn.textContent =
                "🌙 Dark Mode";

        }

        else {

            document.body.classList.add(
                "dark-mode"
            );


            localStorage.setItem(
                "darkMode",
                "enabled"
            );


            darkModeBtn.textContent =
                "☀️ Light Mode";

        }

    }
);


// =========================
// INITIAL LOAD
// =========================

applyDarkMode();

displayTasks();