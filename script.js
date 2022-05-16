var todoItemTemplate = document.querySelector('.todo-item.template');
var todoList = document.querySelector('.todo-list');
var todoItemsAll;
var ser = 0;

const todoItemsArray = [];

function addListeners(){
    todoItemsAll = document.getElementsByClassName('todo-item');
    var checkboxContainers = document.getElementsByClassName('checkbox-container');
    for(var checkbox of checkboxContainers){
        checkbox.addEventListener('click', checkToggle);
    }

    var deleteBtns = document.getElementsByClassName('delete-btn');
    for(var delBtn of deleteBtns){
        delBtn.addEventListener('click', deleteEntry);
    }
}
function checkToggle(e){

    //Problem with inconsistent click detection on img and container
    //resolved by using ancestor closest method instead of parentNode
    const classListItem = e.target.closest(".todo-item");
    const selItemInd = todoItemsArray.findIndex((listItem, ind) => {
        return listItem['id'] == classListItem.id;    
    });

    //updates directly on dom and also saves in todoItemsArray

    if(classListItem.classList.contains('checked')){
        classListItem.classList.remove('checked');
        todoItemsArray[selItemInd]['checked'] = false;
    }
    else{
        classListItem.classList.add('checked');
        todoItemsArray[selItemInd]['checked'] = true;
    }
    itemCount();
}

function addTodoItem(todoText, checked = false){
    
    var newItem;
    var todoID = ser++;

    newItem = {
        "todoText": todoText,
        "checked": checked,
        "seqIndex": -1,
        "id": "item-"+todoID,
        "idNum": todoID
    }
    todoItemsArray.push(newItem);


    updateArraySeq();
    updateTodoDisplay(todoItemsArray);

}

function updateTodoDisplay(todoObjList) {
    //clearing the todo list from DOM
    while(todoList.children.length > 1){
        console.log(todoList.lastChild.remove());
    }

    for(todoObj of todoObjList){
        //Deep clone the template node and remove '.template' to display it
        var newItem = todoItemTemplate.cloneNode(true);
        newItem.classList.remove('template');

        if(todoObj.checked) newItem.classList.add('checked');
        newItem.querySelector('.todo-text').innerText = todoObj.todoText;
        newItem.id = `item-${todoObj.idNum}`;
        todoList.appendChild(newItem);
    }
    addListeners();
    itemCount();
    filterItems();
}

//update item count
function itemCount() {
    document.querySelector("#num-items").textContent = todoItemsArray.filter((item) =>{
        return !item.checked;
    }).length;

}

//update seqIndex of array
function updateArraySeq() {
    for(var i in todoItemsArray){
        todoItemsArray[i]["seqIndex"] = i;
    }
    console.log(todoItemsArray);
}

var newTodoItem = document.querySelector('#new-todo-item');
newTodoItem.addEventListener('keypress', (e) => {
    if(e.key == 'Enter' && e.target.value != ''){
           addTodoItem(e.target.value, e.target.parentElement.classList.contains('checked'));
           e.target.parentElement.classList.remove('checked');
           e.target.value = '';
    }
});

function deleteEntry(e){
    const clickedItemId = e.target.closest(".todo-item").id;
    for (const key in todoItemsArray) {
        const idVal = todoItemsArray[key]['id'].replace("/\D/g", "");
        console.log(`${idVal}, ${clickedItemId}`);
        if (clickedItemId == idVal){
            todoItemsArray.splice(key, 1);
            break;
        }
    }
    updateTodoDisplay(todoItemsArray);
}

//Filtering
const radioFilters = document.querySelectorAll("input[name='filter']");
Array.from(radioFilters).forEach(btn => {
    btn.addEventListener("change", filterItems)
});
function filterItems() {
    const idSelected = document.querySelector("input[type='radio']:checked").id;

    //reset filter - this will be show all items
    Array.from(document.querySelectorAll('.todo-list .todo-item')).forEach((item) => {
        item.classList.remove("filter-hide");
    });

    switch(idSelected){
        case "active-items":
            Array.from(document.querySelectorAll('.todo-list .todo-item')).forEach((item) => {
                if(item.classList.contains('checked'))
                    item.classList.add("filter-hide");
            });
        break;
        case "complete-items":
            Array.from(document.querySelectorAll('.todo-list .todo-item')).forEach((item) => {
                if(!item.classList.contains('checked'))
                    item.classList.add("filter-hide");
            });
        break;
    }
}

document.querySelector("#clear-complete").addEventListener('click', deleteCompleted);
function deleteCompleted() {
    for(const key in todoItemsArray){
        if(todoItemsArray[key].checked)
            todoItemsArray.splice(key,1);
    }
    updateTodoDisplay(todoItemsArray);
}

addListeners();

addTodoItem("Testing 1", true);
addTodoItem("Testing 2");

document.querySelector(".theme-toggle-dark").addEventListener('click', ()=>{
    document.querySelector('.page-container').classList.remove("dark-theme");
    document.querySelector('.page-container').classList.add("light-theme");
    console.log(document.querySelector('.page-container').classList);

});
document.querySelector(".theme-toggle-light").addEventListener('click', ()=>{
    document.querySelector('.page-container').classList.remove("light-theme");
    document.querySelector('.page-container').classList.add("dark-theme");
});