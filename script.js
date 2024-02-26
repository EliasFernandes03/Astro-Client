
function listarEventos() {
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
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}"onclick="renderModalExcluir(${item.id})">Delete</button>
                            </td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

listarEventos(); 

function renderModalExcluir(id) {
    let modal = `
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Confirmar exclusão</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="fecharModal('confirmDeleteModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Tem certeza de que deseja excluir este evento?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="fecharModal('confirmDeleteModal')">Não</button>
                        <button type="button" class="btn btn-danger" onclick="DeleteEvento(${id})" data-dismiss="modal">Sim</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    let modalElement = document.getElementById('confirmDeleteModal');
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
}


function DeleteEvento(id) {
    fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Evento com ID ${id} deletado com sucesso.`);
            
        listarEventos();
        } else {
            console.error('Falha ao Delete o evento.');
        }
    })
    .catch(error => console.error('Erro:', error));
    fecharModal('confirmDeleteModal')
}


function renderModalEdit(id, name, description) {
    console.log(name,description)
    var modal = `
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">edit Evento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="fecharModal('editModal')">
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
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('editModal')">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="atualizarEvento(${id})">Atualizar</button>
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

function atualizarEvento(id) {
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
            listarEventos()
        } else {
            console.error('Falha ao atualizar o evento.');
        }
    })
    .catch(error => console.error('Erro:', error));

    var modalElement = document.getElementById('editModal');
    modalElement.remove();
}

function renderModalCriar() {
    var modal = `
        <div class="modal fade" id="criarModal" tabindex="-1" role="dialog" aria-labelledby="criarModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="criarModalLabel">Criar Novo Evento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="fecharModal('criarModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="criarForm">
                            <div class="form-group">
                                <label for="newEventName">Nome do Evento</label>
                                <input type="text" class="form-control" id="newEventName">
                            </div>
                            <div class="form-group">
                                <label for="newEventDescription">Descrição do Evento</label>
                                <textarea class="form-control" id="newEventDescription" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('criarModal')">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="criarNovoEvento()">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);

    var modalElement = document.getElementById('criarModal');
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
}


function criarNovoEvento() {
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
            console.log('Novo evento criado com sucesso.');
            listarEventos()
            fecharModal('criarModal');

        } else {
            console.error('Falha ao criar o novo evento.');
        }
    })
    .catch(error => console.error('Erro:', error));
}

function fecharModal(modalId) {
    var modalElement = document.getElementById(modalId);
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
}
