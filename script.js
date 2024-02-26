
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
                                <button class="btn btn-primary btn-sm btn-edit" data-id="${item.id}" onclick="renderModalEditar(${item.id}, '${item.name}', '${item.description}')">Editar</button>
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}"onclick="renderModalExcluir(${item.id})">Deletar</button>
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
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Tem certeza de que deseja excluir este evento?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Não</button>
                        <button type="button" class="btn btn-danger" onclick="deletarEvento(${id})" data-dismiss="modal">Sim</button>
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


function deletarEvento(id) {
    fetch(`http://localhost:8000/api/events/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Evento com ID ${id} deletado com sucesso.`);
            
        listarEventos();
        } else {
            console.error('Falha ao deletar o evento.');
        }
    })
    .catch(error => console.error('Erro:', error));
    let modalElement = document.getElementById('confirmDeleteModal');
    modalElement.remove();
}


function renderModalEditar(id, name, description) {
    console.log(name,description)
    var modal = `
        <div class="modal fade" id="editarModal" tabindex="-1" role="dialog" aria-labelledby="editarModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarModalLabel">Editar Evento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="fecharModal('editarModal')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="editarForm">
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
                        <button type="button" class="btn btn-secondary" onclick="fecharModal('editarModal')">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="atualizarEvento(${id})">Atualizar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);   
    let modalElement = document.getElementById('editarModal');
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
    
    var modalElement = document.getElementById('editarModal');
    modalElement.remove();
}
