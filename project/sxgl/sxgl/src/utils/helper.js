export default {
  sessionStorage: {
    set: function (key, value) {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },
    get: function (key) {
      let str = window.sessionStorage.getItem(key)
      return str ? JSON.parse(str) : ''
    },
    remove: function (key) {
      delete (window.sessionStorage[key])
    },
    clear: function () {
      for (let key in window.sessionStorage) {
        delete (window.sessionStorage[key])
      }
    }
  },
  tool: {
    updateArr: function (arrList, newArr) {
      for (var i = 0; i < newArr.length; i++) {
        arrList.push(newArr[i])
      }
    },
    findObjById: function (arr, id, objId) { // 根据某一id找到arrlist中一个对象
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][objId] === id) {
          return arr[i]
        }
      }
    },
    regExps: {
      ip: /^(\d{1,3}|\*)(\.(\d{1,3}|\*)){3}(,(\d{1,3}|\*)(\.(\d{1,3}|\*)){3})*$/, // ip多个之间用逗号隔开
      port: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/ // 端口号
    }
  }
}
