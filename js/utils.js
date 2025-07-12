function generateId() {
  return Date.now();
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
