var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
let numberoftasklists = 0;
var ArrayOfTaskListsContent = new Array();
var ArrayOfTaskListsCompleted = new Array();
var ArrayOfTaskListNames = new Array();
var ArrayOfVisibility = new Array();

//Standard chosen todolist is the standard todolist
let chosentasklistindex = 0;
let chosentasklistname = "StandardToDoList";

//Make the standard todolist
ArrayOfTaskListsContent[0] = new Array();
ArrayOfTaskListsCompleted[0] = new Array();
ArrayOfTaskListNames[0] = "StandardToDoList"
ArrayOfVisibility[numberoftasklists] = "true";
numberoftasklists++;

var ArrayOfLocalVisibility = JSON.parse(localStorage.getItem("ArrayOfVisibility"))
if(ArrayOfLocalVisibility != null) {
if (ArrayOfLocalVisibility.length > 1) {
    ArrayOfVisibility = JSON.parse(localStorage.getItem("ArrayOfVisibility"))
}
}
if(ArrayOfLocalVisibility == null){
    updateTaskLists();
}


//Add name to choosetodolist
addToChooseTasks("StandardToDoList");

let addButton = document.getElementById("addbutton");
addButton.addEventListener("click", addTask);

let clearButton = document.getElementById("clearbutton");
clearButton.addEventListener("click", clearTasks);

let clearAllButton = document.getElementById("clearalltasklists");
clearAllButton.addEventListener("click", clearAllTaskLists)

let addTaskListButton = document.getElementById("addtasklist");
addTaskListButton.addEventListener("click", addTaskList)

let dropDownButtonElement = document.getElementById("dropdownbutton");
dropDownButtonElement.addEventListener("click", dropDownShow);

let commandButton = document.getElementById("commandbutton");
commandButton.addEventListener("click", commandExecution);

let input = document.getElementById("task");
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addTask();
    }
})

let commandBox = document.getElementById("commandline");
commandBox.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        commandExecution();
    }
})

function clearTasks(event) {
    if (confirm("Are you sure you want to clear all tasks in the chosen list?")) {
        let id = ArrayOfTaskListNames[chosentasklistindex]
        document.getElementById(id).firstElementChild.nextElementSibling.innerHTML = "";

        ArrayOfTaskListsContent[chosentasklistindex] = new Array();
        ArrayOfTaskListsCompleted[chosentasklistindex] = new Array();
        //Updates local storage
        localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
        localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
    }
}

function clearAllTaskLists(event) {
    if (confirm("Are you sure you want to clear ALL Tasks (from all Tasklist)?")) {
        ArrayOfTaskListsContent = new Array();
        ArrayOfTaskListsCompleted = new Array();
        ArrayOfTaskListNames = new Array();
        ArrayOfVisibility = new Array();

        //Standard chosen todolist is the standard todolist
        chosentasklistindex = 0;
        chosentasklistname = "StandardToDoList";
        numberoftasklists = 0;

        document.getElementById("TaskListList").innerHTML = "";

        var tasklistlist = document.getElementById("TaskListList");
        var divforcurrenttasklist = document.createElement("div");
        let tasklistname = "StandardToDoList";

        var headerfortasklist = document.createElement("header");
        headerfortasklist.setAttribute("class", "taskListHeader");
        headerfortasklist.textContent = tasklistname;
        divforcurrenttasklist.appendChild(headerfortasklist);
        divforcurrenttasklist.setAttribute("id", tasklistname)
        var currenttasklist = document.createElement("ul");
        currenttasklist.setAttribute("class", "ListOfTasks");
        divforcurrenttasklist.appendChild(currenttasklist);
        tasklistlist.appendChild(divforcurrenttasklist);
        ArrayOfTaskListsContent[numberoftasklists] = new Array();
        ArrayOfTaskListsCompleted[numberoftasklists] = new Array();
        ArrayOfTaskListNames[numberoftasklists] = tasklistname;
        //Deletetodlist knap IMPLEMENTER
        addToChooseTasks(tasklistname);
        numberoftasklists++;


        //Make the standard todolist
        ArrayOfTaskListsContent[0] = new Array();
        ArrayOfTaskListsCompleted[0] = new Array();
        ArrayOfTaskListNames[0] = "StandardToDoList"
        ArrayOfVisibility[0] = "true";

        clearChooseTasks();
        document.getElementById("dropdownbutton").textContent = "StandardToDoList"
        addToChooseTasks(tasklistname);

        updateTaskLists();
    }
}


function clearChooseTasks() {
    document.getElementById("TaskListDropdown").innerHTML = "";
}

function addTask(event) {
    if (document.getElementById("task").value == "") {
        return;
    }
    var inputtext = document.getElementById("task").value;
    document.getElementById("task").value = "";
    var tasklist = document.getElementById(chosentasklistname);
    var list = tasklist.firstElementChild.nextElementSibling;
    if (ArrayOfTaskListsContent[chosentasklistindex].includes(inputtext)) {
        alert("An element with the same name already exists in your chosen list!");
        return;
    }
    var ele = document.createElement("li");
    var span = document.createElement("SPAN");
    span.appendChild(document.createTextNode(inputtext))
    span.addEventListener("click", testfunc);
    ele.appendChild(span);
    ele.setAttribute("type", "text");
    ele.setAttribute("class", "listElement");
    list.appendChild(ele);
    if ($(span).width() > 300) {
        var stringToWorkOn = span;
        var endingString = "";
        var tempString = "";
        while ($(stringToWorkOn).width() > 300) {
            tempString = trimToMeasure(stringToWorkOn);
            if (endingString == "") {
                endingString = tempString.substring(0, tempString.indexOf(" "));
            }
            else { endingString = endingString + " " + tempString.substring(0, tempString.indexOf(" ")); }
            stringToWorkOn.textContent = tempString.substring(tempString.indexOf(" ") + 1);
        }
        endingString = endingString + " " + stringToWorkOn.textContent;
        ele.firstElementChild.textContent = endingString;
    }
    updateTasks(ele.textContent, chosentasklistindex);
    var taskButtons = document.getElementById("testButton").cloneNode(true);
    taskButtons.firstElementChild.addEventListener("click", editElement);
    taskButtons.firstElementChild.nextElementSibling.addEventListener("click", deleteElement);
    taskButtons.firstElementChild.nextElementSibling.nextElementSibling.addEventListener("click", moveElement);
    ele.appendChild(taskButtons);
    updateMoveButtons();
}

function trimToMeasure(span) {
    var deletedCharacters = "";
    while ($(span).width() > 300) {
        deletedCharacters = span.textContent.charAt(span.textContent.length - 1) + deletedCharacters;
        span.textContent = span.textContent.substring(0, span.textContent.length - 1);
    }
    return span.textContent + " " + deletedCharacters;
}

function updateTasks(tasktextcontent, index) {

    ArrayOfTaskListsContent[index].push(tasktextcontent);
    ArrayOfTaskListsCompleted[index].push("none");
    localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
}


function addTaskList(event) {
    //Add new ul to the html
    let tasklistname = prompt("Enter name of TaskList", "My TaskList");
    if (tasklistname == "" || tasklistname == null) {
        alert("Enter a name for your TaskList")
        return;
    }
    var tasklistlist = document.getElementById("TaskListList");
    var divforcurrenttasklist = document.createElement("div");

    if (ArrayOfTaskListNames.includes(tasklistname)) {
        alert("A TaskList with this name already exists!");
        return;
    }

    divforcurrenttasklist.setAttribute("id", tasklistname);
    var headerfortasklist = document.createElement("header");
    headerfortasklist.setAttribute("class", "taskListHeader");
    headerfortasklist.textContent = tasklistname;
    divforcurrenttasklist.appendChild(headerfortasklist);
    var currenttasklist = document.createElement("ul");
    currenttasklist.setAttribute("class", "ListOfTasks");
    divforcurrenttasklist.appendChild(currenttasklist);
    tasklistlist.appendChild(divforcurrenttasklist);
    ArrayOfTaskListsContent[numberoftasklists] = new Array();
    ArrayOfTaskListsCompleted[numberoftasklists] = new Array();
    ArrayOfTaskListNames[numberoftasklists] = tasklistname;

    //Add DeleteTaskListButton
    var deleteListButton = document.getElementById("deleteTaskListButton").cloneNode(true);
    var divforbutton = document.createElement("div");
    deleteListButton.addEventListener("click", deleteTaskList);
    divforbutton.appendChild(deleteListButton);
    headerfortasklist.appendChild(divforbutton);


    addToChooseTasks(tasklistname);
    ArrayOfVisibility[numberoftasklists] = "true";
    var amountvisible = 1;
    for (let i = 0; i < numberoftasklists; i++) {
        if (ArrayOfVisibility[i] == "true") {
            amountvisible++;

        }
    }
    if (amountvisible > 3) {
        ArrayOfVisibility[numberoftasklists] = "false"
        divforcurrenttasklist.hidden = true;
        var childrenlist = document.getElementById("TaskListDropdown").children
        var standardchooselsit = childrenlist.item(numberoftasklists)
        standardchooselsit.firstElementChild.nextSibling.checked = false;
        alert("Can't show more than 3 task lists at once")

    }
    else {
        var childrenlist = document.getElementById("TaskListDropdown").children
        var standardchooselsit = childrenlist.item(numberoftasklists)
        standardchooselsit.firstElementChild.nextSibling.checked = true;
    }
    localStorage.setItem("ArrayOfVisibility", JSON.stringify(ArrayOfVisibility));
    numberoftasklists++;
    updateTaskLists();
    updateMoveButtons();
}

function deleteTaskList(event) {

    if (confirm("Are you sure you want to delete this TaskList?")) {
        var tasklistname = event.target.parentElement.parentElement.firstChild.textContent;
        var tasklistindex = ArrayOfTaskListNames.indexOf(tasklistname);

        event.target.parentElement.parentElement.parentElement.remove();
        var childrenlist = document.getElementById("TaskListDropdown").children
        childrenlist.item(tasklistindex).remove();


        ArrayOfTaskListsContent.splice(tasklistindex, 1)
        ArrayOfTaskListsCompleted.splice(tasklistindex, 1)
        ArrayOfTaskListNames.splice(tasklistindex, 1)
        ArrayOfVisibility.splice(tasklistindex, 1)
        numberoftasklists--;

        updateTaskLists();
        updateMoveButtons();
    }
}

function updateTaskLists() {
    localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
    localStorage.setItem("ArrayOfTaskListNames", JSON.stringify(ArrayOfTaskListNames));
    localStorage.setItem("numberoftasklists", numberoftasklists);
    localStorage.setItem("ArrayOfVisibility", JSON.stringify(ArrayOfVisibility));
}

//Nedenstående skal også bruges i reloadtasks
function addToChooseTasks(name) {
    let choosetasks = document.getElementById("TaskListDropdown");
    let choosetaskele = document.createElement("li")
    let choosespan = document.createElement("span");
    choosespan.appendChild(document.createTextNode(name))
    choosetaskele.appendChild(choosespan);
    choosetaskele.addEventListener("click", selectTaskList);

    var checkbox = document.getElementById("visibleCheck").cloneNode(true);
    checkbox.addEventListener("click", changevisibility)
    choosetaskele.appendChild(checkbox);
    choosetasks.appendChild(choosetaskele);
    updateMoveButtons();

    //Add buttons to them



}

    function updateMoveButtons() {
        let allMoveButtons = document.querySelectorAll("#moveButton");
        allMoveButtons.forEach(moveButton => {
            moveButton.nextElementSibling.innerHTML = "";
            ArrayOfTaskListNames.forEach(tasklist => {
                let li = document.createElement("li");
                let span = document.createElement("span");
                let text = document.createTextNode(tasklist);
                span.appendChild(text);
                li.appendChild(span);
                li.addEventListener("click", moveToList);
                moveButton.nextElementSibling.appendChild(li);
            })
        })
    }

function changevisibility(event) {
    var checked = event.target.checked
    if (!checked) {
        togglevisiblity(event, "hide")

    }
    else {
        togglevisiblity(event, "show")
        //Add to visibility array
    }

    //Update array in local storage
}

function togglevisiblity(event, option) {
    var tasklistname = (event.target.parentElement.firstChild.textContent)
    var tasklistindex = ArrayOfTaskListNames.indexOf(tasklistname)
    if (option == "hide") {
        if (tasklistindex == 0 && numberoftasklists == 1) {
            alert("Trying to hide your only ToDoList - that makes no sense!")
            var childrenlist = document.getElementById("TaskListDropdown").children
            var standardchooselsit = childrenlist.item(0)
            standardchooselsit.firstElementChild.nextSibling.checked = true;
            return;
        }
        document.getElementById(tasklistname).hidden = true;
        ArrayOfVisibility[tasklistindex] = "false"

    }
    else if (option == "show") {

        let listsvisible = 1;
        for (let i = 0; i < numberoftasklists; i++) {
            if (ArrayOfVisibility[i] == "true") {
                listsvisible++;
            }
        }
        if (listsvisible > 3) {
            alert("Cant show more than 3 TaskLists at once!")
            document.getElementById(tasklistname).hidden = true;
            var childrenlist = document.getElementById("TaskListDropdown").children
            var standardchooselsit = childrenlist.item(tasklistindex)
            standardchooselsit.firstElementChild.nextSibling.checked = false;
            ArrayOfVisibility[tasklistindex] = "false"
            return;
        }
        else {

            document.getElementById(tasklistname).hidden = false;
            ArrayOfVisibility[tasklistindex] = "true"
        }

    }


    localStorage.setItem("ArrayOfVisibility", JSON.stringify(ArrayOfVisibility));
}

function selectTaskList(event) {
    if (event.target.id != "visibleCheck") {
        chosentasklistname = event.target.textContent;
        chosentasklistindex = ArrayOfTaskListNames.indexOf(chosentasklistname);
        document.getElementById("dropdownbutton").textContent = chosentasklistname;
    }
}

function reloadTasks() {
    ArrayOfTaskListsContent = JSON.parse(localStorage.getItem("ArrayOfTaskListsContent"));
    ArrayOfTaskListNames = JSON.parse(localStorage.getItem("ArrayOfTaskListNames"));
    ArrayOfTaskListsCompleted = JSON.parse(localStorage.getItem("ArrayOfTaskListsCompleted"));
    numberoftasklists = localStorage.getItem("numberoftasklists");
    ArrayOfVisibility = JSON.parse(localStorage.getItem("ArrayOfVisibility"))

    //Hvis der er mere end én liste kan man også hide standardToDoList
    if (numberoftasklists > 1) {
        let standarddiv = document.getElementById("StandardToDoList")

        var shown = ArrayOfVisibility[0]
        if (shown == "false") {
            standarddiv.hidden = true
            var childrenlist = document.getElementById("TaskListDropdown").children
            var standardchooselsit = childrenlist.item(0)
            standardchooselsit.firstElementChild.nextSibling.checked = false;

        }

    }

    //Vi laver listerne og deres tasks
    for (let i = 0; i < numberoftasklists; i++) {
        let tasklistname = ArrayOfTaskListNames[i];
        //Vi skal ikke adde standard
        if (i != 0) {
            var tasklistlist = document.getElementById("TaskListList");
            var divforcurrenttasklist = document.createElement("div");

            var headerfortasklist = document.createElement("header");
            headerfortasklist.setAttribute("class", "taskListHeader");
            headerfortasklist.textContent = tasklistname;
            divforcurrenttasklist.appendChild(headerfortasklist);
            divforcurrenttasklist.setAttribute("id", tasklistname)
            var currenttasklist = document.createElement("ul");
            currenttasklist.setAttribute("class", "ListOfTasks");
            divforcurrenttasklist.appendChild(currenttasklist);
            tasklistlist.appendChild(divforcurrenttasklist);
            var deleteListButton = document.getElementById("deleteTaskListButton").cloneNode(true);
            var divforbutton = document.createElement("div");
            deleteListButton.addEventListener("click", deleteTaskList);
            divforbutton.appendChild(deleteListButton);
            headerfortasklist.appendChild(divforbutton);
            //Deletetodlist knap IMPLEMENTER
            addToChooseTasks(tasklistname);

            //Set visibility
            var shown = ArrayOfVisibility[i]

            if (shown == "false") {
                divforcurrenttasklist.hidden = true
                var childrenlist = document.getElementById("TaskListDropdown").children
                var li = childrenlist.item(i)
                li.firstChild.nextSibling.checked = false;

            }
            else if (shown == "true") {
                var childrenlist = document.getElementById("TaskListDropdown").children
                var li = childrenlist.item(i)
                li.firstChild.nextSibling.checked = true;
            }
        }

        //adder tasks til hver liste også
        for (let j = 0; j < ArrayOfTaskListsContent[i].length; j++) {
            var thistext = ArrayOfTaskListsContent[i][j]
            var thistasklistul = document.getElementById(tasklistname)
            var thistasklist = thistasklistul.firstElementChild.nextElementSibling;
            var ele = document.createElement("li");
            var span = document.createElement("SPAN");
            let checkCompleted = ArrayOfTaskListsCompleted[i][j]


            span.appendChild(document.createTextNode(thistext))
            span.addEventListener("click", testfunc);
            ele.appendChild(span);
            ele.setAttribute("type", "text");
            ele.setAttribute("class", "listElement");
            thistasklist.appendChild(ele);
            span.style.textDecoration = checkCompleted;

            var taskButtons = document.getElementById("testButton").cloneNode(true);
            taskButtons.firstElementChild.addEventListener("click", editElement);
            taskButtons.firstElementChild.nextElementSibling.addEventListener("click", deleteElement);
            taskButtons.firstElementChild.nextElementSibling.nextElementSibling.addEventListener("click", moveElement);
            ele.appendChild(taskButtons);
            updateMoveButtons();
            }
            }
            
        }    

//Add til updatetasks samt

function testfunc(element) {
    // Check if both already line-through and if editable, if either is true, either turn style to none or keep none.
    var style = (element.target.style.textDecoration != "line-through" && element.target.contentEditable != "true") ? "line-through" : "none";
    element.target.style.textDecoration = style;

    var styletext = "" + style;
    var child = element.target.parentElement;
    var parent = child.parentNode;
    var indexOfText = Array.prototype.indexOf.call(parent.children, child);
    var belongingtotasklist = element.target.parentElement.parentElement.parentElement;
    var indexOfTaskList = ArrayOfTaskListNames.indexOf(belongingtotasklist.id);
    ArrayOfTaskListsCompleted[indexOfTaskList][indexOfText] = styletext;
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
}

function deleteElement(element) {
    // Simply remove list element
    var child = element.target.parentElement.parentElement;
    var parent = child.parentNode;
    var indexOfText = Array.prototype.indexOf.call(parent.children, child);
    var belongingtotasklist = parent.parentNode;
    var indexOfTaskList = ArrayOfTaskListNames.indexOf(belongingtotasklist.id);
    ArrayOfTaskListsContent[indexOfTaskList].splice(indexOfText, 1)
    localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    ArrayOfTaskListsCompleted[indexOfTaskList].splice(indexOfText, 1)
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
    element.target.parentElement.parentElement.remove();
}


function editElement(element) {
    // This check is important, since one could press edit again to make content no longer editable, instead of simply having the button press set it to true.
    let textSpan = element.target.parentNode.parentNode.firstElementChild
    let textcontent = textSpan.textContent;
    textSpan.contentEditable = (textSpan.contentEditable != "true") ? "true" : "false";
    textSpan.classList.toggle("editable");
    if (textSpan.contentEditable == "true") {
        textSpan.click();
    }
    // Set contenteditable to false when leaving list element.
    var child = element.target.parentNode.parentNode;
    var parent = child.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, child);


    element.target.parentNode.parentNode.onmouseleave = function () {
        if (textSpan.textContent == "") {
            textSpan.textContent = textcontent;
        }
        if ($(textSpan).width() > 300) {
            var stringToWorkOn = textSpan;
            var endingString = "";
            var tempString = "";
            while ($(stringToWorkOn).width() > 300) {
                tempString = trimToMeasure(stringToWorkOn);
                if (endingString == "") {
                    endingString = tempString.substring(0, tempString.indexOf(" "));
                }
                else { endingString = endingString + " " + tempString.substring(0, tempString.indexOf(" ")); }
                stringToWorkOn.textContent = tempString.substring(tempString.indexOf(" ") + 1);
            }
            endingString = endingString + " " + stringToWorkOn.textContent;
            textSpan.textContent = endingString;
        }
        textSpan.contentEditable = "false";
        textSpan.classList.remove("editable");

        let handlinglist = (element.target.parentNode.parentNode.parentNode.parentNode)
        var indexOfTaskList = ArrayOfTaskListNames.indexOf(handlinglist.id);
        ArrayOfTaskListsContent[indexOfTaskList][index] = textSpan.textContent;

        localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    }
}

function moveElement(element) {
    element.target.nextElementSibling.classList.toggle("showMoveList");
    element.target.parentNode.parentNode.onmouseleave = function() {
        element.target.nextElementSibling.classList.remove("showMoveList");
    }
}

function moveToList(element) {
    let toList = document.getElementById(element.target.textContent);
    let fromList;
    let li;
    if (element.target.tagName.toLowerCase() == "span") {
        li = element.target.parentElement.parentElement.parentElement.parentElement;
        fromList = element.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    }
    else {
        li = element.target.parentElement.parentElement.parentElement;
        fromList = fromList = element.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    }

    let toListIndex = ArrayOfTaskListNames.indexOf(toList.id);
    let fromListIndex = ArrayOfTaskListNames.indexOf(fromList.id);

    if (ArrayOfTaskListsContent[toListIndex].includes(li.firstElementChild.textContent) && toList != fromList) {
        alert("An element with the same name already exists in that list!");
        return;
    }
     //Update ArrayOfTaskListsContent and ArrayOfTaskListsCompleted
     // -1 here because there is a random text element in the array indexes because HTML is bad
    let elementToMoveindex = [...fromList.firstElementChild.nextElementSibling.childNodes].indexOf(li);
    let checkCompleteStatus = li.firstChild.style.textDecoration;
    ArrayOfTaskListsContent[fromListIndex].splice(elementToMoveindex,1)
    ArrayOfTaskListsContent[toListIndex].push(li.firstElementChild.textContent)
    localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    ArrayOfTaskListsCompleted[fromListIndex].splice(elementToMoveindex,1)
    ArrayOfTaskListsCompleted[toListIndex].push(checkCompleteStatus)
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
    toList.firstElementChild.nextElementSibling.appendChild(li);
}

function dropDownShow() {
    document.getElementById("TaskListDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('#dropdownbutton')) {
        var dropdowns = document.getElementsByClassName("dropdowncontent");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
    if (!event.target.matches("#moveButton")) {
        var moveListDroppers = document.getElementsByClassName("movedropdown");
        var y;
        for (y = 0; y < moveListDroppers.length; y++) {
            var openDropdown = moveListDroppers[y];
            if (openDropdown.classList.contains('showMoveList')) {
                openDropdown.classList.remove('showMoveList');
            }
          }
    }
  }


function commandExecution() {
    var inputtext = document.getElementById("commandline").value;
    document.getElementById("commandline").value = "";
    let move1 = RegExp("move(.*,.*,.*)");
    let moveall = RegExp("moveAll(.*,.*)");
    if (move1.test(inputtext)) {
        moveOneCommand(inputtext.substring(5, inputtext.length - 1));
    }
    else if (moveall.test(inputtext)) {
        moveAllCommand(inputtext.substring(8, inputtext.length - 1));
    }
    else {
        alert("This command does not exist! The available commands are: \n move(from, item, to) \n moveAll(from, to");
    }
}

function moveOneCommand(stringInput) {
    let from = stringInput.substring(0, stringInput.indexOf(','));
    if (!ArrayOfTaskListNames.includes(from)) {
        alert("The list you have chosen to take from does not exist!");
        return;
    }

    stringInput = stringInput.substring(from.length + 1);
    if (stringInput.charAt(0) == " ") {
        stringInput = stringInput.substring(1);
    }

    let elementText = stringInput.substring(0, stringInput.indexOf(','));
    stringInput = stringInput.substring(elementText.length + 1);
    if (stringInput.charAt(0) == " ") {
        stringInput = stringInput.substring(1);
    }


    let to = stringInput;
    if (!ArrayOfTaskListNames.includes(to)) {
        alert("The list you have chosen to move the element to does not exist!");
        return;
    }

    let fromList = document.getElementById(from);
    let elements = fromList.getElementsByClassName("listElement");
    if (elements.length == 0) {
        alert(`The To-Do List ${from} is empty, so there are no elements to choose from!`);
        return;
    }

    let elementToMove;
    let toList = document.getElementById(to);
    for (i = 0; i < elements.length; i++) {
        if (elements[i].firstElementChild.textContent == elementText) {
            elementToMove = elements[i];
            //Localstorage
            //to = navn for listen vi rykker til
            //from = navn for listen vi rykker fra
            let toListIndex = ArrayOfTaskListNames.indexOf(to);
            let fromListIndex = ArrayOfTaskListNames.indexOf(from);

            if (ArrayOfTaskListsContent[toListIndex].includes(elementText)) {
                alert("An element with the same name already exists in that list!");
                return;
            }
            //Update ArrayOfTaskListsContent and ArrayOfTaskListsCompleted
            let elementToMoveindex = i;
            let checkCompleteStatus = elementToMove.firstChild.style.textDecoration;

            ArrayOfTaskListsContent[fromListIndex].splice(elementToMoveindex, 1)
            ArrayOfTaskListsContent[toListIndex].push(elementText)
            localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
            ArrayOfTaskListsCompleted[fromListIndex].splice(elementToMoveindex, 1)
            ArrayOfTaskListsCompleted[toListIndex].push(checkCompleteStatus)
            localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));

            break;
        }
        else if (i == elements.length - 1) {
            alert("The chosen element does not exist in the chosen list!");
            return;
        }
    }

    toList.firstElementChild.nextElementSibling.appendChild(elementToMove);
}

function moveAllCommand(stringInput) {
    let from = stringInput.substring(0, stringInput.indexOf(','));
    if (!ArrayOfTaskListNames.includes(from)) {
        alert("The list you have chosen to take from does not exist!");
        return;
    }
    stringInput = stringInput.substring(from.length + 1);
    if (stringInput.charAt(0) == " ") {
        stringInput = stringInput.substring(1);
    }
    let to = stringInput;
    if (!ArrayOfTaskListNames.includes(to)) {
        alert("The list you have chosen to deposit to does not exist!");
        return;
    }
    let fromList = document.getElementById(from);
    let elements = fromList.getElementsByClassName("listElement");
    let elementArr = Array.prototype.slice.call(elements);
    let toList = document.getElementById(to);

    let toListIndex = ArrayOfTaskListNames.indexOf(to);
    let fromListIndex = ArrayOfTaskListNames.indexOf(from);

    //Empty from list

    let currentindex = 0;
    let errorMsg = "";
    elementArr.forEach(element => {
        if (ArrayOfTaskListsContent[toListIndex].includes(element.firstChild.textContent)) {
            errorMsg += `The element ${element.firstChild.textContent} already exists in the list you are trying to move to. \n`;
            currentindex++;
        }
        else {
            let checkCompleteStatus = element.firstChild.style.textDecoration;
            let text = element.firstChild.textContent;
            ArrayOfTaskListsCompleted[toListIndex].push(checkCompleteStatus)
            ArrayOfTaskListsContent[toListIndex].push(text)
            ArrayOfTaskListsContent[fromListIndex].splice(currentindex, 1)
            ArrayOfTaskListsCompleted[fromListIndex].splice(currentindex, 1)
            toList.firstElementChild.nextElementSibling.appendChild(element);
            //We DO NOT update index here since we spliced one element from the list so all indexes are decremented
            //by 1
        }
    });

    localStorage.setItem("ArrayOfTaskListsContent", JSON.stringify(ArrayOfTaskListsContent));
    localStorage.setItem("ArrayOfTaskListsCompleted", JSON.stringify(ArrayOfTaskListsCompleted));
    if (errorMsg.length > 0) {
        alert(errorMsg);
        return;
    }
}
