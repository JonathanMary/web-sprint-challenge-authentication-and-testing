module.exports = {
    validUser,
}

function validUser(req, res, next) {
  const user = req.body;
  if (user.username && user.password) {
    next();
  } else {
    res.status(412).json({ message: 'valid username and password required' });
  }
}
