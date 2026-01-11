lucide.createIcons();

// variables
const modal = document.querySelector("#book-modal");
const openModalBtn = document.querySelector("#add-book-btn");
const closeModalBtn = document.querySelector("#close-modal");
const bookForm = document.querySelector("#book-form");

// Show modal
openModalBtn.addEventListener("click", () => {
  modal.showModal();
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.close();
});

// Close if clicking outside the modal
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

// Handle Form Submission
bookForm.addEventListener("submit", (e) => {
  // Since method = "dialog", the form naturally closes the modal.
  // We just need to extract the data.
  const formData = new FormData(bookForm);
  const newBook = {
    title: formData.get("title"),
    author: formData.get("author"),
    pages: formData.get("pages"),
    isRead: document.querySelector("#isRead").checked,
  };

  console.log("New Book Captured:", newBook);
  // bookForm.reset();
});

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.id = crypto.randomUUID(); //Gives every book a unique ID for deleting/ editing
}

let myLibrary = [
  new Book("Deep Work", "Cal Newport", 280, false),
  new Book("Atomic Habits", "James Clear", 315, true),
  new Book("You Can Win", "Shiv Khera", 322, true),
  new Book("Think and Grow Rich", "Nepoleon Hill", 315, true),
];

console.log(myLibrary);

// Rendering the logic
const libraryDisplay = document.getElementById("library-display");

function displayBooks() {
  // console.table(myLibrary);
  // Clear the grid first to avoid duplicates
  libraryDisplay.innerHTML = "";

  myLibrary.forEach((book) => {
    const bookCard = document.createElement("article");
    bookCard.classList.add("card");

    // We use a Template Literal to keep the HTML readable
    bookCard.innerHTML = `
      <div class="card-content">
        <div class="card-header">
          ${
            book.isRead
              ? '<span class="badge">Finished</span>'
              : '<span class="badge" style="background: rgba(148, 163, 184, 0.1); color: var(--text-muted);">Unread</span>'
          }
          <button id="deleteBook" class="btn-delete" onclick="deleteBook('${
            book.id
          }')" title="Delete Book"> 
          <i data-lucide="trash-2"></i>
          </button>
        </div>
        <h2 class="book-title">${book.title}</h2>
        <p class="book-author">by ${book.author}</p>
        <div class="card-footer">
          <p class="pages">${book.pages} pages</p>
          <button class="status-toggle ${book.isRead ? "Reading" : "unread"}" 
                  onclick="toggleReadStatus('${book.id}')">
            ${book.isRead ? "Read" : "Unread"}
          </button>
        </div>
      </div>
    `;
    libraryDisplay.appendChild(bookCard);
    lucide.createIcons();
  });
}

// Connecting the Modal to the library
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Capture Data
  const titleVal = document.getElementById("title").value;
  const authorVal = document.getElementById("author").value;
  const pagesVal = document.getElementById("pages").value;
  const isReadVal = document.getElementById("isRead").value;

  //  2. Create new object and add to array
  const newBook = new Book(titleVal, authorVal, pagesVal, isReadVal);
  myLibrary.push(newBook);

  // 3. Update UI
  displayBooks();

  // 4. Cleanup
  bookForm.reset();
  modal.close();
});

// Adding Interaction (Toggle Status)
function toggleReadStatus(id) {
  const book = myLibrary.find((b) => b.id === id);
  if (book) {
    book.isRead = !book.isRead;
    displayBooks(); // Re-render to show changes
  }
}

//  Initial call to show default books
displayBooks();

window.deleteBook = function (id) {
  myLibrary = myLibrary.filter((book) => book.id !== id);

  displayBooks();
};
