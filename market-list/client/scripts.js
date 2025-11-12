

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item da lista no servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = (oldName, name, quantity, price) => {
  const formData = new FormData();
  formData.append('nome_antigo', oldName); // nome antigo do item
  formData.append('nome', name);
  formData.append('quantidade', quantity);
  formData.append('valor', price);

  const url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'put',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Item atualizado:', data);
  })
  .catch(error => console.error('Erro ao atualizar item:', error));
};

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  insertEditButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement();
  enableEdit();
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de edição de um item da lista
  --------------------------------------------------------------------------------------
*/
const insertEditButton = (parent) => {
  let span = document.createElement("span");
  let img = document.createElement("img");
  img.src = "https://cdn-icons-png.flaticon.com/512/1159/1159633.png";
  img.width = 15;
  img.height = 15;
  img.style.cursor = "pointer";
  span.className = "edit";
  span.appendChild(img);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Habilita o modo de edição dos campos quantidade e valor
  --------------------------------------------------------------------------------------
*/
const enableEdit = () => {
  let editButtons = document.getElementsByClassName("edit");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = function () {
      let row = this.parentElement.parentElement;
      let nameCell = row.cells[0];
      let quantityCell = row.cells[1];
      let priceCell = row.cells[2];
      let editButton = this;

      if (quantityCell.querySelector('input')) return;

      let originalName = nameCell.textContent;
      let originalQuantity = quantityCell.textContent;
      let originalPrice = priceCell.textContent;

      quantityCell.innerHTML = `<input type="number" value="${originalQuantity}" class="edit-input highlight">`;
      priceCell.innerHTML = `<input type="number" step="0.01" value="${originalPrice}" class="edit-input highlight">`;

      editButton.innerHTML = "✓";
      editButton.className = "confirm";

      let cancelButton = document.createElement("span");
      cancelButton.textContent = "✖️";
      cancelButton.className = "cancel";
      cancelButton.style.marginLeft = "6px";
      editButton.parentElement.appendChild(cancelButton);

      editButton.onclick = function () {
        let newQuantity = quantityCell.querySelector("input").value;
        let newPrice = priceCell.querySelector("input").value;

        if (isNaN(newQuantity) || isNaN(newPrice) || newQuantity === '' || newPrice === '') {
          alert("Quantidade e valor precisam ser números válidos!");
          quantityCell.textContent = originalQuantity;
          priceCell.textContent = originalPrice;
        } else {
          quantityCell.textContent = newQuantity;
          priceCell.textContent = newPrice;
          updateItem(originalName, originalName, newQuantity, newPrice);
          alert("Item atualizado!");
        }

        // Restaura botão com imagem
        editButton.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" width="15" height="15">`;
        editButton.className = "edit";
        cancelButton.remove();
        enableEdit();
      };

      // Cancela edição
      cancelButton.onclick = function () {
        quantityCell.textContent = originalQuantity;
        priceCell.textContent = originalPrice;

        editButton.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" width="15" height="15">`;
        editButton.className = "edit";
        cancelButton.remove();
        enableEdit();
      };
    };
  }
};