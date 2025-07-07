# 📡 API de Produtos – Oracle XE + Node.js

Esta API permite realizar operações CRUD em uma tabela de produtos utilizando o banco Oracle 21c XE, via procedures PL/SQL e com backend em Node.js.

---

## 🔧 Endpoints Disponíveis

| Método | Rota                  | Descrição                     |
|--------|------------------------|-------------------------------|
| `GET`  | `/produtos`           | Lista todos os produtos       |
| `POST` | `/produtos`           | Cadastra um novo produto      |
| `PUT`  | `/produtos/:id`       | Atualiza um produto por ID    |
| `DELETE`| `/produtos/:id`      | Deleta um produto por ID      |

---

## 📦 Exemplo de Payloads e Testes no Postman

### ✅ `GET /produtos`

- **Descrição**: Retorna todos os produtos cadastrados.
- **Requisição**:  
  - Método: `GET`
  - URL: `http://localhost:3000/produtos`
- **Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "nome": "Notebook",
    "preco": 3299.99,
    "quantidade": 5
  },
  {
    "id": 2,
    "nome": "Mouse",
    "preco": 49.90,
    "quantidade": 10
  }
]
```

---

### ✅ `POST /produtos`

- **Descrição**: Cadastra um novo produto usando uma procedure Oracle.
- **Requisição**:
  - Método: `POST`
  - URL: `http://localhost:3000/produtos`
  - Headers:
    ```
    Content-Type: application/json
    ```
  - Body (JSON):
```json
{
  "nome": "Fone de ouvido",
  "preco": 30.00,
  "quantidade": 2
}
```
- **Resposta esperada:**
```json
{ "mensagem": "Produto inserido com sucesso!" }
```

---

### ✅ `PUT /produtos/:id`

- **Descrição**: Atualiza os dados de um produto pelo ID.
- **Requisição**:
  - Método: `PUT`
  - URL: `http://localhost:3000/produtos/2`
  - Headers:
    ```
    Content-Type: application/json
    ```
  - Body (JSON):
```json
{
  "nome": "Mouse Gamer",
  "preco": 59.90,
  "quantidade": 8
}
```
- **Resposta esperada:**
```json
{ "mensagem": "Produto atualizado com sucesso." }
```

---

### ✅ `DELETE /produtos/:id`

- **Descrição**: Deleta um produto específico do banco.
- **Requisição**:
  - Método: `DELETE`
  - URL: `http://localhost:3000/produtos/2`
- **Body**: nenhum.
- **Resposta esperada:**
```json
{ "mensagem": "Produto deletado com sucesso." }
```

---

## 📚 Procedures no Oracle

A API depende das seguintes procedures Oracle criadas previamente:

```sql
-- Inserir
CREATE OR REPLACE PROCEDURE INSERIR_PRODUTO(p_nome IN VARCHAR2, p_preco IN NUMBER, p_quantidade IN NUMBER) IS
BEGIN
  INSERT INTO PRODUTOS (NOME, PRECO, QUANTIDADE)
  VALUES (p_nome, p_preco, p_quantidade);
  COMMIT;
END;

-- Listar
CREATE OR REPLACE PROCEDURE LISTAR_PRODUTOS(p_cursor OUT SYS_REFCURSOR) IS
BEGIN
  OPEN p_cursor FOR SELECT ID, NOME, PRECO, QUANTIDADE FROM PRODUTOS;
END;

-- Atualizar
CREATE OR REPLACE PROCEDURE ATUALIZAR_PRODUTO(p_id IN NUMBER, p_nome IN VARCHAR2, p_preco IN NUMBER, p_quantidade IN NUMBER) IS
BEGIN
  UPDATE PRODUTOS
  SET NOME = p_nome, PRECO = p_preco, QUANTIDADE = p_quantidade
  WHERE ID = p_id;
  COMMIT;
END;

-- Deletar
CREATE OR REPLACE PROCEDURE DELETAR_PRODUTO(p_id IN NUMBER) IS
BEGIN
  DELETE FROM PRODUTOS WHERE ID = p_id;
  COMMIT;
END;
```

---

## 🧪 Testando com Postman

1. Abra o Postman
2. Crie uma nova requisição
3. Escolha o método (GET, POST, PUT ou DELETE)
4. Insira a URL e corpo conforme os exemplos acima
5. Clique em **Send**

---

## 🛡️ Observações

- A API usa a biblioteca [`oracledb`](https://www.npmjs.com/package/oracledb)
- A conexão usa o usuário `SYSTEM` com `connectString: '127.0.0.1:1521/XE'`
- Certifique-se de que o **Oracle Listener esteja ativo**
- O `COMMIT` é feito dentro das procedures

---

## 👩‍💻 Desenvolvido por

**Walquiria Avelar Mourão**  
📧 walquiriamourao@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/walquiria-de-avelar-mour%C3%A3o-563115b8/)