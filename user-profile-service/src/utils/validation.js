const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isStrongPassword = (password) => {
    return password.length >= 8;
  };
  
  module.exports = { isValidEmail, isStrongPassword };
  