// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCtndhViPiHlMdYu3FWI48akBbqrWnTnNE",
    authDomain: "library-fafa3.firebaseapp.com",
    databaseURL: "https://library-fafa3-default-rtdb.firebaseio.com/",
    projectId: "library-fafa3",
    storageBucket: "library-fafa3.appspot.com",
    messagingSenderId: "465830388568",
    appId: "1:465830388568:web:c33c7128b52d4303fffb2d",
    measurementId: "G-GDKJTNNL45"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const library = firebase.database().ref().child('books');

library.on('value', snap => {
    displayBooks(snap);
});

const newBookBtn = document.querySelector('#newBook');
newBookBtn.addEventListener('click', addBookToLibrary);

const booksContainer = document.querySelector('#booksContainer');

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  const title = prompt("Enter title");
  const author = prompt("Enter author");
  const pages = prompt("Enter the amount of pages");
  const read = prompt("Have you read this book?").toLowerCase() === "yes" ? true : false;
  const newBook = new Book(title, author, pages, read);
  firebase.database().ref('books/' + title).set(newBook);
}

function displayBooks(snap) {
  while(booksContainer.lastChild && booksContainer.lastChild !== newBookBtn) {
    booksContainer.removeChild(booksContainer.lastChild);
  }
  
  snap.forEach(child => {
    const book = document.createElement('div');
    book.classList.add('book');
    
    const title = document.createElement('p');
    title.textContent = child.val().title;
    book.appendChild(title);
    
    const author = document.createElement('p');
    author.textContent = child.val().author;
    book.appendChild(author);

    const pages = document.createElement('p');
    pages.textContent = child.val().pages + ' pages';
    book.appendChild(pages);

    const removeBtn = document.createElement('button');
    removeBtn.setAttribute('title', child.val().title);
    removeBtn.addEventListener('click', removeBookFromLibrary);
    removeBtn.textContent = 'Remove';
    book.appendChild(removeBtn);
    
    const readBtn = document.createElement('button');
    readBtn.setAttribute('title', child.val().title);
    readBtn.addEventListener('click', toggleReadStatus);
    readBtn.textContent = child.val().read ? "Read" : "Not Read";
    book.appendChild(readBtn);

    booksContainer.appendChild(book);
  });
}

function removeBookFromLibrary() {
  firebase.database().ref('books/' + this.getAttribute('title')).remove();
}

function toggleReadStatus() {
  let read = this.textContent === "Read" ? true : false;
  read = !read;
  let updates = {};
  updates['books/' + this.getAttribute('title') + '/read'] = read;
  firebase.database().ref().update(updates);
}