# API RESTful com Node.js + Oracle

Este projeto é uma API RESTful desenvolvida com **Node.js**, **Express** e banco de dados **Oracle**, utilizando **procedures PL/SQL** para inserir, atualizar, buscar e deletar produtos.

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- OracleDB (node-oracledb)
- PL/SQL (procedures)
- Postman (testes)

## 📦 Endpoints disponíveis

### 🔹 GET `/produtos`

Lista todos os produtos:

```json
[
  {
    "id": 1,
    "nome": "Notebook",
    "preco": 3299.99,
    "quantidade": 5
  },
  ...
]
```

---

### 🔹 GET `/produtos/:id`

Retorna os dados de um único produto pelo ID.

**Exemplo:**  
`GET http://localhost:3000/produtos/1`

---

### 🔹 POST `/produtos`

Insere um novo produto no banco, usando a procedure `INSERIR_PRODUTO`.

**Body JSON:**
```json
{
  "nome": "Mouse",
  "preco": "9,90",
  "quantidade": 3
}
```

**Retorno:**
```json
{ "mensagem": "Produto inserido com sucesso!" }
```

---

### 🔹 PUT `/produtos/:id`

Atualiza os dados de um produto pelo ID, usando a procedure `ATUALIZAR_PRODUTO`.

**Body JSON:**
```json
{
  "nome": "Teclado Mecânico",
  "preco": 149.90,
  "quantidade": 10
}
```

**Retorno:**
```json
{ "mensagem": "Produto atualizado com sucesso." }
```

---

### 🔹 DELETE `/produtos/:id`

Remove um produto pelo ID, usando a procedure `DELETAR_PRODUTO`.

**Retorno:**
```json
{ "mensagem": "Produto removido com sucesso." }
```

---

## 🗃️ Banco de Dados Oracle

Exemplo de criação da tabela:

```sql
CREATE TABLE PRODUTOS (
  ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  NOME VARCHAR2(100),
  PRECO NUMBER(10,2),
  QUANTIDADE NUMBER
);
```

### 📜 Procedures

```sql
-- INSERIR_PRODUTO
CREATE OR REPLACE PROCEDURE INSERIR_PRODUTO (
  p_nome IN VARCHAR2,
  p_preco IN NUMBER,
  p_quantidade IN NUMBER
) AS
BEGIN
  INSERT INTO produtos (nome, preco, quantidade)
  VALUES (p_nome, p_preco, p_quantidade);
END;

-- ATUALIZAR_PRODUTO
CREATE OR REPLACE PROCEDURE ATUALIZAR_PRODUTO (
  p_id IN NUMBER,
  p_nome IN VARCHAR2,
  p_preco IN NUMBER,
  p_quantidade IN NUMBER
) AS
BEGIN
  UPDATE produtos
  SET nome = p_nome, preco = p_preco, quantidade = p_quantidade
  WHERE id = p_id;
END;

-- DELETAR_PRODUTO
CREATE OR REPLACE PROCEDURE DELETAR_PRODUTO (
  p_id IN NUMBER
) AS
BEGIN
  DELETE FROM produtos WHERE id = p_id;
END;
```

---

## 🧪 Testes

Você pode testar os endpoints usando o **Postman**. Basta rodar o servidor com:

```bash
node api.js
```

E acessar `http://localhost:3000`.

---

## 💡 Dica

Garanta que você tenha o Oracle XE 21c instalado, e que o arquivo `dbConfig.js` contenha:

```js
module.exports = {
  user: 'seu_usuario',
  password: 'sua_senha',
  connectString: 'localhost/XEPDB1'
};
```

---

## 🧑‍💻 Autor

Desenvolvido por Walquíria de Avelar Mourão  
[GitHub](https://github.com/walquiriaavelar) | [LinkedIn](https://www.linkedin.com/in/walquiria-de-avelar-mour%C3%A3o-563115b8/)