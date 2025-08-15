const express = require("express");
const path = require("path");
require('dotenv').config();

const { init, close } = require('./db/oracle');
const api = require('./api');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend
app.use('/', express.static(__dirname));

// API
app.use('/api', api);

// Health
app.get('/health', (_req, res) => res.json({ ok:true }));

const port = process.env.PORT || 3000;
init().then(() => {
  app.listen(port, () => console.log(`Server http://localhost:${port}`));
}).catch((err) => {
  console.error('Falha ao iniciar pool Oracle:', err);
  process.exit(1);
});

process.on('SIGINT', async () => { await close(); process.exit(0); });
