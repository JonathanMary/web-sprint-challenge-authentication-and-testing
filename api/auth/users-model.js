const db = require('../../data/dbConfig');

module.exports = {
  getById,
  getBy,
  insert,
}

function getById(id) {
  return db('users')
    .where('id', id)
    .first()
}

function getBy(filter) {
  return db('users')
    .where(`${Object.keys(filter)}`, Object.values(filter))
}

async function insert(user) {
  const [id] = await db('users')
    .insert(user)
  return getById(id);
}
