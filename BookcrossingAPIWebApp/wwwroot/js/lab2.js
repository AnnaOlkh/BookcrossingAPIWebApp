const uri = 'api/Locations';
let locations = [];

function getLocation() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayLocations(data))
        .catch(error => console.error('Unable to get locations.', error));
}

function addLocation() {
    const nameInput = document.getElementById('add-name');
    const countryInput = document.getElementById('add-country');
    const regionInput = document.getElementById('add-region');
    const cityInput = document.getElementById('add-city');

    const location = {
        name: nameInput.value.trim(),
        country: countryInput.value.trim(),
        region: regionInput.value.trim(),
        city: cityInput.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
    })
        .then(response => response.json())
        .then(() => {
            getLocation();
            nameInput.value = '';
            countryInput.value = '';
            regionInput.value = '';
            cityInput.value = '';
        })
        .catch(error => console.error('Unable to add location.', error));
}

function deleteLocation(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getLocation())
        .catch(error => console.error('Unable to delete location.', error));
}

function displayEditForm(id) {
    const location = locations.find(loc => loc.id === id);
    document.getElementById('edit-id').value = location.id;
    document.getElementById('edit-name').value = location.name;
    document.getElementById('edit-country').value = location.country;
    document.getElementById('edit-region').value = location.region ?? '';
    document.getElementById('edit-city').value = location.city ?? '';

    const modal = new bootstrap.Modal(document.getElementById('editLocationModal'));
    modal.show();
}


function updateLocation() {
    const id = document.getElementById('edit-id').value;
    const location = {
        id: parseInt(id, 10),
        name: document.getElementById('edit-name').value.trim(),
        country: document.getElementById('edit-country').value.trim(),
        region: document.getElementById('edit-region').value.trim(),
        city: document.getElementById('edit-city').value.trim()
    };

    fetch(`${uri}/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
    })
        .then(() => getLocation())
        .catch(error => console.error('Unable to update location.', error));

    closeInput();
    return false;
}
function closeInput() {
    const modalElement = document.getElementById('editLocationModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

function _displayLocations(data) {
    const tBody = document.getElementById('locations');
    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(location => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${location.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteLocation(${location.id})`);

        let tr = tBody.insertRow();

        tr.insertCell(0).appendChild(document.createTextNode(location.name));
        tr.insertCell(1).appendChild(document.createTextNode(location.country));
        tr.insertCell(2).appendChild(document.createTextNode(location.region ?? ''));
        tr.insertCell(3).appendChild(document.createTextNode(location.city ?? ''));
        tr.insertCell(4).appendChild(editButton);
        tr.insertCell(5).appendChild(deleteButton);
    });

    locations = data;
}
