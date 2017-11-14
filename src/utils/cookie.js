
let doc = document

let cookie = {
  // 写cookies
  set: (name, value, domain, expiredays) => {
    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    let expires = expiredays == null ? '' : ';expires=' + exdate.toGMTString()
    doc.cookie = name + '=' + escape(value) + expires + ';path=/;domain=.' + domain
  },

  // 读取cookies
  get: (name) => {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = doc.cookie.match(reg)
    if (arr) {
      return arr[2]
    } else {
      return ''
    }
  },

  // 删除cookies
  del: (name, domain) => {
    let exp = new Date()
    let cval = ' ' // this.getCookie(name)

    exp.setTime(exp.getTime() - 100)
    doc.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/;domain=.' + domain
  }
}

export default cookie
