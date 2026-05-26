/**
 * Standard API response formatter.
 */
const formatSuccess = (message, data = null) => {
  return {
    success: true,
    message,
    data,
  };
};

module.exports = {
  formatSuccess,
};
