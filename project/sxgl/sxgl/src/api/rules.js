const rules = function (pattern, value, key) {
  switch (pattern) {
    case 'idCard':
      var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
      if (!reg.test(value)) {
        Toast(key + '不合法');
        return false;
      }
      return true;
      break;
  }
}

export default rules
