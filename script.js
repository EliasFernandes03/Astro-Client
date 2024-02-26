
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
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${item.id}">Deletar</button>
                            </td>
                        </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

listarEventos(); 
