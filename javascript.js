var taskArrayTextContent = new Array();
var checkTaskCompleted = new Array();
let addButton = document.getElementById("addbutton");

addButton.addEventListener("click", addTask);

let clearButton = document.getElementById("clearbutton");
clearButton.addEventListener("click", clearTasks);

let input =  document.getElementById("task");
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addTask();
    }
})

function clearTasks(event) {
   if(confirm("Are you sure you want to clear all tasks?")) {
    document.getElementById("TaskList").innerHTML = "";
   taskArrayTextContent = new Array();
   checkTaskCompleted = new Array();
   localStorage.setItem("taskTexts", JSON.stringify(taskArrayTextContent));
   }
}

function addTask(event) {
    if(document.getElementById("task").value == "") {
        return;
    }
    var inputtext = document.getElementById("task").value;
    document.getElementById("task").value = "";
    var list = document.getElementById("TaskList");
    var ele = document.createElement("li");
    var span = document.createElement("SPAN");
    span.appendChild(document.createTextNode(inputtext))
    span.setAttribute("onclick", "testfunc(this)");
    ele.appendChild(span);
    ele.setAttribute("type", "text");
    ele.setAttribute("class", "listElement");
    list.appendChild(ele);
    updateTasks(ele.textContent);
    var editButton = document.getElementById("testButton").cloneNode(true);
    ele.appendChild(editButton);
}

    function updateTasks(tasktextcontent) {
        taskArrayTextContent.push(tasktextcontent);
        localStorage.setItem("taskTexts", JSON.stringify(taskArrayTextContent))
        checkTaskCompleted.push("none");
        localStorage.setItem("checkCompleted", JSON.stringify(checkTaskCompleted));
        
    }

    function reloadTasks() {
        let retrivedTasks = JSON.parse(localStorage.getItem("taskTexts"))
        let retrievedCompleted = JSON.parse(localStorage.getItem("checkCompleted"));
        var list = document.getElementById("TaskList");
        
        for(let i = 0; i<retrivedTasks.length; i++) {
            let currenttext = retrivedTasks[i]
            let checkIfCompleted = retrievedCompleted[i]
            var ele = document.createElement("li");
            var span = document.createElement("SPAN");
            span.appendChild(document.createTextNode(currenttext));
            span.setAttribute("onclick", "testfunc(this)");
            ele.appendChild(span);
            ele.setAttribute("type", "text");
            ele.setAttribute("class", "listElement");
            list.appendChild(ele);
            span.style.textDecoration = checkIfCompleted;

            //add to local storage
            taskArrayTextContent.push(ele.textContent);
            localStorage.setItem("taskTexts", JSON.stringify(taskArrayTextContent))
            checkTaskCompleted.push(checkIfCompleted);
            localStorage.setItem("checkCompleted", JSON.stringify(checkTaskCompleted))

            var editButton = document.getElementById("testButton").cloneNode(true);
            ele.appendChild(editButton);
        }
    }

//Add til updatetasks samt

function testfunc(element) {
    // Check if both already line-through and if editable, if either is true, either turn style to none or keep none.
    var style = (element.style.textDecoration!="line-through" && element.contentEditable != "true")?"line-through":"none";
    element.style.textDecoration = style;
    
    var styletext = ""+style; 
    var child = element.parentElement;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);
    checkTaskCompleted[index]=styletext;
    localStorage.setItem("checkCompleted", JSON.stringify(checkTaskCompleted));
    
}

function deleteElement(element) {
    // Simply remove list element
    var child = element.parentElement;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);
    taskArrayTextContent.splice(index,1);
    localStorage.setItem("taskTexts", JSON.stringify(taskArrayTextContent))
    checkTaskCompleted.splice(index,1)
    localStorage.setItem("checkCompleted", JSON.stringify(checkTaskCompleted));
    element.parentElement.remove();
}

function editElement(element) {
    // This check is important, since one could press edit again to make content no longer editable, instead of simply having the button press set it to true.
    let textcontent = element.firstElementChild.textContent;
    element.firstElementChild.contentEditable = (element.firstElementChild.contentEditable != "true")?"true":"false";
    element.firstElementChild.classList.toggle("editable");
    if (element.firstElementChild.contentEditable == "true") {
        element.firstElementChild.click();
    }
    // Set contenteditable to false when leaving list element.
    var child = element;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);

    element.onmouseleave = function() {
        if (element.firstElementChild.textContent == "") {
            element.firstElementChild.textContent = textcontent;
        }
        element.firstElementChild.contentEditable = "false";
        element.firstElementChild.classList.remove("editable");
        taskArrayTextContent[index] = element.firstElementChild.textContent;
        localStorage.setItem("taskTexts", JSON.stringify(taskArrayTextContent))
    }
}