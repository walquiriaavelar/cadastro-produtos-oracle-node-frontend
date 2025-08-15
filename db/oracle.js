const oracledb = require('oracledb');
require('dotenv').config();

let pool;

function getConnectString() {
  // EZCONNECT: host:port/service
  return `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT || 1521}/${process.env.ORACLE_SERVICE}`;
}

async function init() {
  if (pool) return pool;
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: getConnectString(),
    poolMin: Number(process.env.ORACLE_POOL_MIN || 1),
    poolMax: Number(process.env.ORACLE_POOL_MAX || 8),
    poolTimeout: Number(process.env.ORACLE_POOL_TIMEOUT || 60)
  });
  return pool;
}

async function close() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

async function query(sql, binds = {}, options = {}) {
  const p = await init();
  let conn;
  try {
    conn = await p.getConnection();
    const res = await conn.execute(sql, binds, options);
    return res;
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = { init, close, query };