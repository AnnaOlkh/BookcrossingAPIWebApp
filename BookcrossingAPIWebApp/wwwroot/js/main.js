// js/main.js
const apiBase = '/api/bookcopies';

// Переходимо до сторінки деталей за кодом
function goToBookDetails(code) {
    if (!code) {
        code = document.getElementById('search-code')?.value?.trim();
    }
    if (!code) {
        alert("Please enter a book code.");
        return;
    }
    window.location.href = `/book.html?code=${encodeURIComponent(code)}`;
}

// Додаємо нову книгу
function addBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const description = document.getElementById('description').value.trim();
    const coverImageUrl = document.getElementById('cover-url').value.trim();
    const pageCount = parseInt(document.getElementById('pages').value.trim(), 10);
    const locationRaw = document.getElementById('location-id').value.trim();

    const dto = {
        title,
        author,
        description,
        coverImageUrl,
        pageCount,
        locationId: locationRaw ? parseInt(locationRaw, 10) : null
    };

    fetch(apiBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dto)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to create book copy.');
            return response.json();
        })
        .then(data => {
            // Показуємо код у модалці
            const modal = new bootstrap.Modal(document.getElementById('codeModal'));
            document.getElementById('generated-code').innerText = data.code;
            modal.show();
            // Очищаємо форму та ховаємо додавання книги
            document.getElementById('add-book-form').reset();
            bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
            // Перезавантажуємо сітку
            loadAllBooks();
        })
        .catch(err => {
            alert(err.message);
        });
}

// Після повного завантаження DOM запускаємо завантаження книг
document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks();
});

// Завантажуємо всі доступні книжки з API
function loadAllBooks() {
    fetch(apiBase)
        .then(res => res.json())
        .then(books => renderBooksGrid(books))
        .catch(err => console.error(err));
}

// Малюємо grid-картки
function renderBooksGrid(books) {
    const container = document.getElementById('books-list');
    if (!books.length) {
        container.innerHTML = '<div class="col"><em>Наразі книг немає.</em></div>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="col">
            <div class="card h-100 border-warning book-card"
                 role="button" tabindex="0"
                 onclick="goToBookDetails('${book.code}')"
                 style="cursor:pointer;">
                <div class="card-img-top d-flex align-items-center justify-content-center bg-light" 
                     style="height: 210px;">
                    ${book.coverImageUrl
            ? `<img src="${book.coverImageUrl}" alt="cover" class="img-fluid" 
                                 style="max-height:200px; max-width:100%;">`
            : `<div class="bg-warning d-flex align-items-center justify-content-center" 
                                style="width:120px; height:170px; border-radius:12px; 
                                       font-size:2rem; color:#fff;">
                               📚
                           </div>`
        }
                </div>
                <div class="card-body text-center">
                    <h6 class="card-title mb-2">${book.title}</h6>
                    <div class="text-muted">${book.author}</div>
                </div>
            </div>
        </div>
    `).join('');
}
