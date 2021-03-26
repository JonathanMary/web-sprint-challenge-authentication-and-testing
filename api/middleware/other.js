module.exports = {
    validUser,
}

function validUser(user) {
  return Boolean(user.username && user.password)
}
