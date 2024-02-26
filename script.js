
function listEvents() {
    fetch('http://localhost:8000/api/events')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('data');
            tableBody.innerHTML = ""; 
            data.forEach(item => {
                let row = `<tr>
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.created_at}</td>
                            <td>
                                <button class="btn btn-primary btn-sm btn-edit" data-id="${item.id}" onclick="renderModalEdit(${item.id}, '${item.name}', '${item.description}')">edit</button>
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}"onclick="renderDeleteModal(${item.id})">Delete</button>
                            </td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

listEvents(); 

let modalCount = 0;

function renderDeleteModal(id) {
    let modal = `
        <div class="modal fade" id="confirmDeleteModal_${modalCount}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Confirmar exclusão</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal('confirmDeleteModal_${modalCount}')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Tem certeza de que deseja excluir este evento?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal('confirmDeleteModal_${modalCount}')">Não</button>
                        <button type="button" class="btn btn-danger" onclick="DeleteEvent(${id}, 'confirmDeleteModal_${modalCount}')">Sim</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    let modalElement = document.getElementById(`confirmDeleteModal_${modalCount}`);
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');

    modalCount++; 
}

function DeleteEvent(id, modalId) {
    fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Evento com ID ${id} deletado com sucesso.`);
            listEvents();
        } else {
            console.error('Falha ao deletar o evento.');
        }
    })
    .catch(error => console.error('Erro:', error));

    closeModal(modalId);
}

function renderModalEdit(id, name, description) {
    console.log(name,description)
    var modal = `
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">edit Evento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal('editModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="editForm">
                            <div class="form-group">
                                <label for="eventName">Nome do Evento</label>
                                <input type="text" class="form-control" id="eventName" value="${name}">
                            </div>
                            <div class="form-group">
                                <label for="eventDescription">Descrição do Evento</label>
                                <textarea class="form-control" id="eventDescription" rows="3">${description}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('editModal')">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="updateEvent(${id})">Atualizar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);   
    let modalElement = document.getElementById('editModal');
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
}

function updateEvent(id) {
    var eventName = document.getElementById('eventName').value;
    var eventDescription = document.getElementById('eventDescription').value;

    fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: eventName,
            description: eventDescription
        })
    })
    .then(response => {
        if (response.ok) {
            console.log(`Evento com ID ${id} atualizado com sucesso.`);
            listEvents()
        } else {
            console.error('Falha ao atualizar o evento.');
        }
    })
    .catch(error => console.error('Erro:', error));

    var modalElement = document.getElementById('editModal');
    modalElement.remove();
}

function renderCreateModal() {
    var modal = `
        <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createModalLabel">Create New Event</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closeModal('createModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="createForm">
                            <div class="form-group">
                                <label for="newEventName">Event Name</label>
                                <input type="text" class="form-control" id="newEventName">
                            </div>
                            <div class="form-group">
                                <label for="newEventDescription">Event Description</label>
                                <textarea class="form-control" id="newEventDescription" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('createModal')">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="createNewEvent()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
    document.getElementById('newEventName').value = '';
    document.getElementById('newEventDescription').value = '';
    var modalElement = document.getElementById('createModal');
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
}

function createNewEvent() {
    var newEventName = document.getElementById('newEventName').value;
    var newEventDescription = document.getElementById('newEventDescription').value;

    fetch('http://localhost:8000/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newEventName,
            description: newEventDescription
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('New event created successfully.');
            listEvents();
            closeModal('createModal');

        } else {
            console.error('Failed to create new event.');
        }
    })
    .catch(error => console.error('Error:', error));
}


function closeModal(modalId) {
    var modalElement = document.getElementById(modalId);
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
}
