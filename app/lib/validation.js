var validators = {
  validateName(name) {
    if (typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
    return false;
  },
  // can this be better? 🤔
  validateLength(string, length) {
    if (length) {
      if (typeof string === 'string' && string.trim().length === length) {
        return string.trim();
      }
      return false;
    } else {
      if (typeof string === 'string' && string.trim().length > 0) {
        return string.trim();
      }
      return false;
    }
  },
  validateTOS(tosAgreement) {
    // typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true ? true : false;
    if (typeof tosAgreement === 'boolean' && tosAgreement) {
      return true;
    }
    return false;
  },
}

module.exports = validators;