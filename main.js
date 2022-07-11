const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis: ' + author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun: ' + year;

  const textContainer = document.createElement('div');
  // textContainer.classList.add('book_list');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('book_shelf', 'book_list', 'book_item');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isComplete) {
    const incompleteButton = document.createElement('button');
    incompleteButton.classList.add('incompleteButton');
    incompleteButton.innerText = 'Belum Selesai Dibaca';
    incompleteButton.addEventListener('click', function () {
      incompleteBook(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trashButton');
    trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    container.append(incompleteButton, trashButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.classList.add('completeButton');
    completeButton.innerText = 'Selesai Dibaca';
    completeButton.addEventListener('click', function () {
      completeBook(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trashButton');
    trashButton.innerText = 'Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    container.append(completeButton, trashButton);
  }

  return container;
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete');

  if (isComplete.checked == true) {
    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      bookTitle,
      bookAuthor,
      bookYear,
      true
    );
    books.push(bookObject);

    // document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      bookTitle,
      bookAuthor,
      bookYear,
      false
    );
    books.push(bookObject);

    // document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completeBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function incompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBooks = document.getElementById('incompleteBookshelfList');
  const completeBooks = document.getElementById('completeBookshelfList');

  incompleteBooks.innerHTML = '';
  completeBooks.innerHTML = '';

  for (const book of books) {
    const ebook = makeBook(book);
    if (book.isComplete) {
      completeBooks.append(ebook);
    } else {
      incompleteBooks.append(ebook);
    }
  }
});
