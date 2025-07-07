document.getElementById('product-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  const product = { name, price, quantity };

  try {
    const response = await fetch('http://localhost:3000/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    const msgEl = document.getElementById('message');
    if (response.ok) {
      msgEl.textContent = 'Produto cadastrado com sucesso!';
      msgEl.classList.remove('hidden', 'text-red-600');
      msgEl.classList.add('text-green-600');
      e.target.reset();
    } else {
      msgEl.textContent = 'Erro ao cadastrar.';
      msgEl.classList.remove('hidden', 'text-green-600');
      msgEl.classList.add('text-red-600');
    }
  } catch (error) {
    document.getElementById('message').textContent = 'Erro de conexão com a API.';
  }
});