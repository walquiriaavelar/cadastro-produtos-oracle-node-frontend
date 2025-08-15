// api.js — Router da API
const express = require('express');
const router = express.Router();
const db = require('./db/oracle');

/**
 * POST /api/auth/login
 * Valida usuário (CADUSU): CODUSU/MNUINI + status.
 */
router.post('/auth/login', async (req, res) => {
  const { usuario, senha } = req.body || {};
  if (!usuario || !senha) {
    return res.status(400).json({ ok: false, mensagem: 'Informe usuário e senha.' });
  }
  try {
    const r = await db.query(
      `SELECT codusu, nomusu, codemp, situs u AS situs, NVL(evlsen,0) AS evlsen
         FROM cadusu
        WHERE UPPER(codusu) = :usuario
          AND mnuini = :senha`,
      { usuario: usuario.toUpperCase(), senha }
    );

    const row = r.rows?.[0];
    if (!row)                 return res.status(401).json({ ok:false, mensagem:'Usuário/senha inválidos.' });
    if (row.SITUS === 'I')    return res.status(403).json({ ok:false, mensagem:'Usuário inativo.' });
    if (Number(row.EVLSEN))   return res.status(403).json({ ok:false, mensagem:'Usuário bloqueado.' });

    return res.json({ ok:true, nome: row.NOMUSU, codemp: row.CODEMP });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, mensagem:'Erro no login.' });
  }
});

/**
 * GET /api/linhas-produto
 * Retorna linhas (ex.: SEQAGR RLT). Ajuste a origem conforme seu modelo.
 */
router.get('/linhas-produto', async (_req, res) => {
  try {
    const r = await db.query(`
      SELECT DISTINCT codgru, desgru
        FROM seqagrrlt
       ORDER BY codgru
    `);
    const rows = r.rows.map(x => ({
      codgru: x.CODGRU ?? x[0],
      desgru: x.DESGRU ?? x[1],
    }));
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao buscar linhas' });
  }
});

/**
 * GET /api/familias-produto?linha=<valor>
 * Retorna famílias vinculadas à linha.
 */
router.get('/familias-produto', async (req, res) => {
  const { linha } = req.query;
  if (!linha) return res.status(400).json({ erro: 'Parâmetro "linha" obrigatório' });

  try {
    const r = await db.query(
      `SELECT DISTINCT b.codfam, b.desfam
         FROM agrfamrlt a
         JOIN nucfam b ON a.codemp = b.codemp AND a.codfam = b.codfam
        WHERE a.codgru = :linha
        ORDER BY b.codfam`,
      { linha }
    );
    const rows = r.rows.map(x => ({
      codfam: x.CODFAM ?? x[0],
      desfam: x.DESFAM ?? x[1],
    }));
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao buscar famílias de produto' });
  }
});

/**
 * GET /api/produtos
 * Placeholder — ajuste depois para sua fonte real.
 */
router.get('/produtos', async (_req, res) => {
  res.json([]);
});

/**
 * POST /api/produtos
 * Chama a procedure INSERIR_PRODUTO (exemplo). Usa autoCommit.
 */
router.post('/produtos', async (req, res) => {
  const { nome, unidade, linha, familia, largura, comprimento } = req.body || {};

  const nLarg = Number(largura);
  const nComp = Number(comprimento);
  if (!nome || !unidade || !linha || !familia || Number.isNaN(nLarg) || Number.isNaN(nComp)) {
    return res.status(400).json({ erro: 'Todos os campos devem ser informados corretamente.' });
  }

  try {
    await db.query(
      `BEGIN INSERIR_PRODUTO(:nome, :unidade, :linha, :familia, :largura, :comprimento); END;`,
      { nome, unidade, linha, familia, largura: nLarg, comprimento: nComp },
      { autoCommit: true }
    );
    res.status(201).json({ ok: true, mensagem: 'Produto inserido com sucesso.' });
  } catch (e) {
    console.error('Erro ao chamar INSERIR_PRODUTO:', e);
    res.status(500).json({ erro: 'Erro ao inserir produto.' });
  }
});

module.exports = router;
