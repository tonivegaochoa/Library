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
const form = document.querySelector('form');
const formContainer = document.querySelector('#formContainer');
const newBookBtn = document.querySelector('#newBook');
const cancelBtn = document.querySelector('#cancel');
const booksContainer = document.querySelector('#booksContainer');

library.on('value', snap => {
  displayBooks(snap);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  document.querySelector('#header').style.cssText = '';
  document.querySelector('#booksContainer').style.cssText = '';
  document.querySelector('#formContainer').classList.add('hidden');
  addBookToLibrary();
  form.reset();
});

newBookBtn.addEventListener('click', function() {
  document.querySelector('#header').style.cssText = 'filter: blur(6px)';
  document.querySelector('#booksContainer').style.cssText = 'filter: blur(6px)';
  formContainer.classList.remove('hidden');
});

cancelBtn.addEventListener('click', function() {
  document.querySelector('#header').style.cssText = '';
  document.querySelector('#booksContainer').style.cssText = '';
  document.querySelector('#formContainer').classList.add('hidden');
  form.reset();
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary() {
  const title = form.querySelector('#title').value;
  const author = form.querySelector('#author').value;
  const pages = form.querySelector('#pages').value;
  const read = form.querySelector('#yes').checked;
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
  let read = this.textContent === "Read";
  read = !read;
  let updates = {};
  updates['books/' + this.getAttribute('title') + '/read'] = read;
  firebase.database().ref().update(updates);
}