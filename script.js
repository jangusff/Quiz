'use strict';

var totalQuestions = 0;
var currentQuestion = 0;
var currentScore = 0;

const STORE = [
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
];


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    if (newItemName !== "") {
      $('.js-shopping-list-entry').val('');
      addItemToShoppingList(newItemName);
      renderShoppingList();
    }
  });
}


function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


function deleteListItem(itemIndex) {
  console.log("Deleting the item at index " + itemIndex);
  STORE.splice(itemIndex, 1);
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
   $('.js-shopping-list').on('click', `.js-item-delete`, event => {
      console.log('`handleDeleteItemClicked` ran');
      const itemIndex = getItemIndexFromElement(event.currentTarget);
      deleteListItem(itemIndex);
      renderShoppingList();
    });
}






function resetQuizCounters() {
  totalQuestions = 0;
  currentQuestion = 0;
  currentScore = 0;
}


function setActiveQuizPhase(targetPhase) {
  $('.quiz-phase').removeClass("toggle__active");
  targetPhase.addClass("toggle__active");
}

function handleBeginQuiz() {
  $('#quiz-start').on('click', `#btn-quiz-start`, event => {
    console.log('`handleBeginQuiz` ran');
    resetQuizCounters();
    setActiveQuizPhase($('#quiz-in-progress'));
    
  });
}

function handleRestartQuiz() {
  $('#quiz-complete').on('click', `#btn-quiz-restart`, event => {
    console.log('`handleRestartQuiz` ran');
    
    resetQuizCounters();
    setActiveQuizPhase($('#quiz-in-progress'));
    
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function launchQuiz() {

  
  console.log('Started.');
  handleBeginQuiz();
  handleRestartQuiz();

/*
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  */
}

// when the page loads, call `handleShoppingList`
$(launchQuiz);