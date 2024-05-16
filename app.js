// Book class: Represents a book
class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI tasks
class UI {
    static displayBooks () {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList (book) {
        const bookList = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" style="font-weight:900">X</a></td>
        `;

        bookList.appendChild(row);
    }

    static removeBookFromList (target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert (message, className) {
        const div = document.createElement('div');
        div.classList.add(`alert`, `alert-${className}`, `fs-6`, `fw-medium`);
        div.textContent = message;
        const container = document.querySelector('.container');
        const bookForm = document.querySelector('#book-form');
        container.insertBefore(div, bookForm);

        setTimeout(() => div.remove(), 2000);
    }

    static clearFields () {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // Functionality added by me: to un-focus all the inputs after the book-form has been submitted
    static blurInputs () {
        const formGroup = document.querySelectorAll('.form-group');

        formGroup.forEach((element, index) => {
            element.children[1].blur();
        });
    }
}

// Store class: Handles storage
class Store {
    static getBooks () {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook (book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook (isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: add a book
document.querySelector('#book-form').addEventListener('submit', e => {
    e.preventDefault();
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
        return;
    }

    const book = new Book(title, author, isbn);
    // Add the new book object to the book list-UI
    UI.addBookToList(book);
    // Add the new book to local storage
    Store.addBook(book);
    // Clear the fields of the add book form
    UI.clearFields();
    // Blur input fields
    UI.blurInputs();
    
    UI.showAlert('Book added', 'success');
})

// Event: remove a book using EVENT PROPAGATION
document.querySelector('#book-list').addEventListener('click', e => {
    e.preventDefault();
    // Remove the book from UI
    UI.removeBookFromList(e.target);
    // Remove the book from the local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book removed', 'success');
});
