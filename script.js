/*
Created by Colton Morley January 2024

Inventory tracking system for public library, created during completion of The Odin Project
*/


//Some default books for the library
const hobbit = new Book("The Hobbit", "Tolkien, J.R.R", "1997", false);
const harry = new Book(
  "Harry Potter and the Goblet of Fire",
  "Rowling, J.K.",
  "2000",
  true
);
const babylon = new Book(
  "The Richest Man in Babylon",
  "Clason, George S",
  "1926",
  true
);

//My library array will be used to store books
const myLibrary = [hobbit, harry, babylon];

function Book(title, author, year, read) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.read = read;
}

function displayBooks(book, num) {
  const icon = getIconDiv(book);
  const info = getInfoDiv(book);
  const buttons = getButtonDiv(book, num);

  const div = document.createElement("div");
  div.classList.add("card");
  const library = document.querySelector(".library");

  div.appendChild(icon);
  div.appendChild(info);
  div.appendChild(buttons);

  library.appendChild(div);
}


//Function to update left icon depeneding on if book is read
function getIconDiv(book) {
  const div = document.createElement("div");
  div.classList.add("material-symbols-outlined");
  book.read ? div.classList.add("true") : div.classList.add("false");
  div.innerText = book.read ? "done_all" : "unknown_med";
  return div;
}

//Function to add buttons to right of book when adding
function getButtonDiv(book, num) {
  const readButton = document.createElement("button");
  readButton.classList.add("book-buttons");
  readButton.innerText = book.read ? "Mark as unread" : "Mark as read";
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("book-buttons");
  deleteButton.innerText = "Delete";
  const div = document.createElement("div");
  readButton.onclick = function () {
    myLibrary[num].read = myLibrary[num].read ? false : true;
    updateLibrary(myLibrary);
  };

  //Function to delete book from book array and update display
  deleteButton.onclick = function () {
    if (confirm("Are you sure you want to delete " + book.title + "?")) {
      myLibrary.splice(num, 1);
      updateLibrary(myLibrary);
    }
  };

  div.appendChild(readButton);
  div.appendChild(deleteButton);
  return div;
}

function getInfoDiv(book) {
  const div = document.createElement("div");
  div.classList.add("info");
  let keys = Object.keys(book);
  for (let x in keys) {
    const tempDiv = document.createElement("div");
    if (keys[x] == "read") break;
    tempDiv.classList.add(keys[x]);
    tempDiv.innerText = book[keys[x]];
    div.appendChild(tempDiv);
  }
  return div;
}

function updateLibrary(arr) {
  const library = document.querySelector(".library");
  library.innerHTML = "";
  for (let book in arr) {
    displayBooks(arr[book], book);
  }
}

updateLibrary(myLibrary);

//Show the add book form
function openForm() {
  document.getElementById("bg-block").style.display = "block";
}

//Remove the add book form
function closeForm() {
  document.getElementById("bg-block").style.display = "none";
}

let form = document.getElementById("form-container");

//Retrieve values from add book form
const submitForm = function () {
  title = document.getElementById("title").value;
  author = document.getElementById("auth").value;
  year = document.getElementById("year").value;
  read = document.getElementById("read").value == "t";
  let book = new Book(title, author, year, read);
  myLibrary.push(book);
  updateLibrary(myLibrary);
  closeForm();
  form.reset();
};

let bg = document.getElementById("bg-block");
bg.addEventListener(
  "click",
  function (event) {
    if (bg !== event.target) return;
    closeForm();
  },
  false
);

//Sort functions
function compareYear(a, b) {
  if (a.year < b.year) return -1;
  if (a.year > b.year) return 1;
  return 0;
}

function compareTitle(a, b) {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
}

function compareAuthor(a, b) {
  if (a.author < b.author) return -1;
  if (a.author > b.author) return 1;
  return 0;
}

function sort(index) {
  switch (index) {
    case 0:
      myLibrary.sort(compareTitle);
      break;
    case 1:
      myLibrary.sort(compareAuthor);
      break;
    case 2:
      myLibrary.sort(compareYear);
      break;
    default:
      console.log("error");
  }
  updateLibrary(myLibrary);
}

//Module to validate user input for the add book form
const validationModule = (function () {
  const title = document.getElementById("title");
  const titleError = document.querySelector("#title + div.errorTxt");
  const auth = document.getElementById("auth");
  const authError = document.querySelector("#auth + div.errorTxt");
  const year = document.getElementById("year");
  const yearError = document.querySelector("#year + div.errorTxt");
  const form = document.getElementById("form-container");
  const authRegExp = /.,\s./;

  title.addEventListener("input", (event) => {
    if (title.validity.valid) {
      titleError.textContent = "";
      titleError.classname = "errorTxt";
    } else {
      showError(title, titleError);
    }
  });

  auth.addEventListener("input", (event) => {
    if (!authRegExp.test(auth.value)) {
      authError.textContent = 'Please use "LastName, FirstName " format';
    } else {
      authError.textContent = "";
    }
  });

  year.addEventListener("input", (event) => {
    if (year.validity.valid) {
      yearError.textContent = "";
      yearError.classname = "errorTxt";
    } else {
      showError(year, yearError);
    }
  });

  form.addEventListener("submit", (event) => {
    if (
      title.validity.valid &&
      year.validity.valid &&
      authRegExp.test(auth.value)
    ) {
      submitForm();
    } else {
      document.getElementById("submitError").textContent =
        "Please correct errors";
    }
  });

  form.addEventListener("input", (event) => {
    if (
      title.validity.valid &&
      year.validity.valid &&
      authRegExp.test(auth.value)
    ) {
      document.getElementById("submitError").textContent = "";
    }
  });

  const showError = function (field, fieldError) {
    if (field.validity.valueMissing) {
      fieldError.textContent = "Field cannot be blank";
      console.log("Put someting here!!!!!");
    } else if (field.validity.tooShort) {
      console.log("Too SHORT!!!!");
      fieldError.textContent = `Must be at least ${field.minLength} characters; Current: ${field.value.length}.`;
    } else if (field.validity.rangeOverflow) {
      fieldError.textContent = "Please enter a year between 0 and 2024";
    }
  };
})();

//Add description
//Add date added and sort by date added?  Maybe once get DB functioning
