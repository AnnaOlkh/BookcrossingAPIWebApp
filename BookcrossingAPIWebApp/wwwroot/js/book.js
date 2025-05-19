const apiBase = '/api/bookcopies';

window.addEventListener('DOMContentLoaded', () => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
        document.getElementById('book-details').innerHTML = '<div class="alert alert-danger">No code provided in URL.</div>';
        return;
    }

    fetch(`${apiBase}/by-code/${code}`)
        .then(res => {
            if (!res.ok) throw new Error('Book not found.');
            return res.json();
        })
        .then(data => displayBook(data))
        .catch(err => {
            document.getElementById('book-details').innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
        });
});

function displayBook(data) {
    const container = document.getElementById('book-details');
    container.innerHTML = `
        <div class="card border-warning">
            <div class="card-body">
                <h5 class="card-title">${data.title} by ${data.author}</h5>
                <p class="card-text">${data.description || 'No description.'}</p>
                <p><strong>Pages:</strong> ${data.pageCount}</p>
                <p><strong>Code:</strong> ${data.code}</p>
                <p><strong>Available:</strong> ${data.isAvailable ? 'Yes' : 'No'}</p>
                <p><strong>Last Location:</strong> ${data.lastLocation || 'Unknown'}</p>
                ${data.coverImageUrl ? `<img src="${data.coverImageUrl}" class="img-fluid mt-3" style="max-height: 200px;">` : ''}
                <hr>
                <strong>Route:</strong>
                <ul>${data.route.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
        </div>
    `;

    const form = document.getElementById('action-form');
    const actionTitle = document.getElementById('action-title');

    if (data.isAvailable) {
        // Книга в локації — можна забрати
        actionTitle.innerText = 'Pick up this book (mark as taken)';
        form.classList.remove('d-none');
    } else {
        // Книга на руках — можна залишити
        actionTitle.innerText = 'Leave this book at a location';
        form.classList.remove('d-none');
    }
}

function submitLocationChange() {
    const locationId = parseInt(document.getElementById('location-id').value.trim(), 10);
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code || isNaN(locationId)) return;

    // Тут буде запит PUT або POST на зміну статусу/локації — реалізуємо пізніше
    alert(`(TODO) Send location update for ${code} with locationId ${locationId}`);
}
