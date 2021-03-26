const Users = require('../auth/users-model');

module.exports = {
  validUser,
  isAvailable,
}

function validUser(req, res, next) {
  const user = req.body;
  if (user.username && user.password) {
    next();
  } else {
    res.status(412).json({ message: 'username and password required' });
  }
}

async function isAvailable(req, res, next) {
  Users.getBy({ username: req.body.username })
       .then(result => {
         if(result.length === 0) {
           next();
         } else {
           res.status(500).json({ message: 'username taken' });
         }
       })
}
