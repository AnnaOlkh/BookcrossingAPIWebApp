const apiBase = '/api/bookcopies';

function goToBookDetails() {
    const code = document.getElementById('search-code').value.trim();
    if (!code) {
        alert("Please enter a book code.");
        return;
    }
    // Redirect to book details page (to be implemented later)
    window.location.href = `/book.html?code=${encodeURIComponent(code)}`;
}

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
            if (!response.ok) {
                throw new Error('Failed to create book copy.');
            }
            return response.json();
        })
        .then(data => {
            const modal = new bootstrap.Modal(document.getElementById('codeModal'));
            document.getElementById('generated-code').innerText = data.code;
            modal.show();
            document.getElementById('add-book-form').reset();
            const addModal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
            addModal.hide();
        })
        .catch(err => {
            alert(err.message);
        });
}
