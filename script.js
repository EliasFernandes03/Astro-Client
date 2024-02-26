
function listarEventos() {
    fetch('http://localhost:8000/api/events')
        .then(response => response.json())
        .then(data => {
            var tableBody = document.getElementById('data');
            tableBody.innerHTML = ""; 
            data.forEach(item => {
                var row = `<tr>
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.created_at}</td>
                            <td>
                                <button class="btn btn-primary btn-sm btn-edit" data-id="${item.id}">Editar</button>
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}"onclick="renderModal(${item.id})">Deletar</button>
                            </td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

listarEventos(); 
function renderModal(id) {
    var modal = `
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

    var modalElement = document.getElementById('confirmDeleteModal');
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
    var modalElement = document.getElementById('confirmDeleteModal');
    modalElement.remove();
}


