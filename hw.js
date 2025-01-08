const ib = document.getElementById("i-b");
const lc = document.getElementById("listcontainer");

function addTask() {
    if (ib.value === '') {
        alert("You must enter your task!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = ib.value;
        li.setAttribute("draggable", "true"); // Enable dragging
        lc.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        addDragEvents(li); // Add drag events
    }
    ib.value = "";
    saveData();
}

lc.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", lc.innerHTML);
}

function showTask() {
    lc.innerHTML = localStorage.getItem("data");
    Array.from(lc.children).forEach((li) => addDragEvents(li)); // Re-attach drag events
}

function addDragEvents(li) {
    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("dragging");
    });

    li.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
    });

    lc.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(lc, e.clientY);
        if (afterElement == null) {
            lc.appendChild(dragging);
        } else {
            lc.insertBefore(dragging, afterElement);
        }
        saveData();
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Initial setup
showTask();
