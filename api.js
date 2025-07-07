const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  user: 'SYSTEM',      
  password: 'root',      
  connectString: 'localhost/XE' 
};

app.get('/produtos', async (req, res) => {
  try {
    const conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      'BEGIN LISTAR_PRODUTOS(:cursor); END;',
      { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = [];
    let row;

    while ((row = await resultSet.getRow())) {
      rows.push({
        id: row[0],
        nome: row[1],
        preco: row[2],
        quantidade: row[3],
      });
    }

    await resultSet.close();
    await conn.close();

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar produtos.' });
  }
});

app.post('/produtos', async (req, res) => {
  let conn;
  let { nome, preco, quantidade } = req.body;

  preco = parseFloat(preco.toString().replace(',', '.'));

  if (!nome || isNaN(preco) || !quantidade) {
    return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos corretamente.' });
  }

  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `BEGIN INSERIR_PRODUTO(:nome, :preco, :quantidade); END;`,
      { nome, preco, quantidade }
    );
    await conn.commit();
    res.json({ mensagem: 'Produto inserido com sucesso!' });
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro ao inserir produto.' });
  } finally {
    if (conn) await conn.close();
  }
});

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade } = req.body;

  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      'BEGIN ATUALIZAR_PRODUTO(:id, :nome, :preco, :quantidade); END;',
    { id: parseInt(id), nome, preco, quantidade }
    );
    await conn.commit();
    await conn.close();
    res.status(200).json({ mensagem: 'Produto atualizado com sucesso.' });
  } catch (err) {
     console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar o produto.' });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `BEGIN DELETAR_PRODUTO(:id); END;`,
      { id: parseInt(id) }
    );
    await conn.close();
    res.status(200).json({ mensagem: 'Produto deletado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao deletar o produto.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
