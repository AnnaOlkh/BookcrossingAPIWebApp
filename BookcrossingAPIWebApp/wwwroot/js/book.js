﻿const apiBase = '/api/bookcopies';

window.addEventListener('DOMContentLoaded', () => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
        document.getElementById('book-details').innerHTML = '<div class="alert alert-danger">Не вказано код у URL.</div>';
        return;
    }

    fetch(`${apiBase}/by-code/${code}`)
        .then(res => {
            if (!res.ok) throw new Error('Книгу не знайдено.');
            return res.json();
        })
        .then(data => displayBook(data))
        .catch(err => {
            document.getElementById('book-details').innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
        });
});

function displayBook(data) {
    const container = document.getElementById('book-details');
    let bookHtml = `
        <div class="card border-warning">
            <div class="card-body">
                <h5 class="card-title">${data.title} – ${data.author}</h5>
                <p class="card-text">${data.description || 'Опис відсутній.'}</p>
                <p><strong>Кількість сторінок:</strong> ${data.pageCount}</p>
                <p><strong>Код:</strong> ${data.code}</p>
                <p><strong>Доступна:</strong> ${data.isAvailable ? 'Так' : 'Ні'}</p>
                <p><strong>Місце зберігання:</strong> ${data.currentLocationName || 'Невідомо'}</p>
                ${data.coverImageUrl ? `<img src="${data.coverImageUrl}" class="img-fluid mt-3" style="max-height: 200px;">` : ''}
                <hr>
                <strong>Маршрут книги:</strong>
                <ul>${data.route.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
        </div>
    `;
    container.innerHTML = bookHtml;

    // Отримуємо DOM-елементи
    const form = document.getElementById('action-form');
    const actionTitle = document.getElementById('action-title');
    const locationSelectBlock = document.getElementById('location-select-block');

    // Книга у тебе "на руках" (не доступна, і останнє місце невідоме)
    if (!data.isAvailable && (!data.currentLocationName)) {
        form.classList.remove('d-none'); // ПОКАЗАТИ форму!
        actionTitle.innerText = 'Залишити цю книгу у локації';
        locationSelectBlock.classList.remove('d-none');
        showLocationSelect();
    }
    else if (data.isAvailable) {
        form.classList.add('d-none');
        container.innerHTML += `<div class="d-flex justify-content-center"><button id="pickup-btn" class="btn btn-success mt-4">Забрати книгу</button></div>`;
        document.getElementById('pickup-btn').onclick = () => pickupBook(data.code);
    }
    else {
        form.classList.add('d-none');
    }
}



async function loadLocations() {
    try {
        const res = await fetch('/api/Locations');
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        return [];
    }
}

async function showLocationSelect() {
    const select = document.getElementById('location-select');
    select.innerHTML = '<option value="">Виберіть локацію</option>';
    const locations = await loadLocations();
    if (!locations.length) {
        select.innerHTML = '<option value="">Локації не знайдено</option>';
        return;
    }
    locations.forEach(loc => {
        select.innerHTML += `<option value="${loc.id}">${loc.name}, ${loc.city}</option>`;
    });
}
function submitLocationChange() {
    const select = document.getElementById('location-select');
    const locationId = parseInt(select.value, 10);
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code || isNaN(locationId)) {
        showMessage('Оберіть локацію!', 'warning');
        return;
    }

    fetch('/api/bookcopies/change-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            locationId: locationId
        })
    })
        .then(res => {
            if (!res.ok) throw new Error('Помилка оновлення локації');
            return res.text();
        })
        .then(() => {
            showMessage('Книгу успішно залишено у вибраній локації!', 'success');
            fetch(`${apiBase}/by-code/${code}`)
                .then(res => res.json())
                .then(data => displayBook(data));
        })
        .catch(err => {
            showMessage(err.message, 'danger');
        });
}
function pickupBook(code) {
    fetch('/api/bookcopies/pickup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
        .then(res => {
            if (!res.ok) throw new Error('Не вдалося забрати книгу');
            return res.text();
        })
        .then(() => {
            showMessage('Книгу успішно забрано!', 'success');
            // Оновлюємо тільки деталі книги, не всю сторінку!
            fetch(`${apiBase}/by-code/${code}`)
                .then(res => res.json())
                .then(data => displayBook(data));
        })
        .catch(err => {
            showMessage(err.message, 'danger');
        });
}

function showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрити"></button>
        </div>
    `;

    setTimeout(() => {
        const alertElem = container.querySelector('.alert');
        if (alertElem) {
            alertElem.classList.remove('show');
            setTimeout(() => {
                alertElem.remove();
            }, 4000);
        }
    }, 2000);
}


