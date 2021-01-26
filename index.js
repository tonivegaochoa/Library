let myLibrary = [];
const newBookBtn = document.querySelector('#newBook');
newBookBtn.addEventListener('click', addBookToLibrary);

const booksContainer = document.querySelector('#booksContainer');

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function() {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
  };
}

Book.prototype.toggleReadStatus = function() {
  this.read = !(this.read);
  displayBooks();
};

function addBookToLibrary() {
  const title = prompt("Enter title");
  const author = prompt("Enter author");
  const pages = prompt("Enter the amount of pages");
  const read = prompt("Have you read this book?").toLowerCase() === "yes" ? true : false;
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  displayBooks();
}

function displayBooks() {
  while(booksContainer.firstChild) {
    booksContainer.removeChild(booksContainer.firstChild);
  }
  
  myLibrary.forEach((elem, index) => {
    const book = document.createElement('div');
    book.classList.add('book');
    book.setAttribute('index', index);
    
    const title = document.createElement('p');
    title.textContent = elem.title;
    book.appendChild(title);
    
    const author = document.createElement('p');
    author.textContent = elem.author;
    book.appendChild(author);

    const removeBtn = document.createElement('button');
    removeBtn.addEventListener('click', removeFromLibrary);
    removeBtn.textContent = 'Remove';
    book.appendChild(removeBtn);
    
    const readBtn = document.createElement('button');
    readBtn.addEventListener('click', function() { elem.toggleReadStatus() });
    readBtn.textContent = elem.read ? "Read" : "Not Read";
    book.appendChild(readBtn);

    booksContainer.appendChild(book);
  });
}

function removeFromLibrary() {
  myLibrary.splice(this.getAttribute('index'), 1);
  displayBooks();
}