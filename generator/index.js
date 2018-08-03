async function f() {
    await Promise.reject('出错了');
  }
  
  f()
  .then(v => console.log(v))
  .catch(e => console.log(e))