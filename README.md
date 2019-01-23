# js-async-demos

```
目录结构：
|—— 回调函数
|—— 事件监听
|—— 发布/订阅
|—— promise
|—— generator（es6生产函数）
|—— async（es7异步函数）
|—— 其他
    |—— Rxjs(Observable对象)
```

> 此demo项目仅作为个人对js整个异步编程发展的总结汇总，遂参考了多方资料，已在末尾备注

asynchronous development process of javascript and some demos

## 回调函数callback

> 回调函数即函数的某个参数为function，会掉函数在拿到上一步结果后执行，如：

```javascript {cmd="node"}
funa(param1, callback){
    ....
    callback(xxx);
}
```

## 事件监听

> 采用事件驱动模式,任务的执行不取决代码的顺序，而取决于某一个事件是否发生。

监听函数有：on，bind，listen，addEventListener，observe

```javascript {cmd="node"}
// 为f1绑定一个事件（采用jquery写法）。当f1发生done事件，就执行f2。
f1.on('done',f2);

// 对f1进行改写, 执行完成后，立即触发done事件，从而开始执行f2.
function f1(){
    settimeout(function(){
        //f1的任务代码
        f1.trigger('done');  
    },1000);
}
f1.trigger('done')

```

这种方法的优点：比较容易理解，可以绑定多个事件，每一个事件可以指定多个回调函数，而且可以去耦合，有利于实现模块化。
这种方法的缺点：整个程序都要变成事件驱动型，运行流程会变得不清晰。
事件监听方法：
（1）onclick方法

```javascript {cmd="node"}
element.onclick=function(){
   //处理函数
}
```

优点：写法兼容到主流浏览器
缺点：当同一个element元素绑定多个事件时，只有最后一个事件会被添加,例如：

```javascript {cmd="node"}
// 只有handler3会被添加执行，所以我们使用另外一种方法添加事件
element.onclick=handler1;
element.onclick=handler2;
element.onclick=handler3;
```

（2）attachEvent和addEvenListener方法

```javascript {cmd="node"}
// IE:attachEvent 三个方法执行顺序：3-2-1
elment.attachEvent("onclick",handler1);
elment.attachEvent("onclick",handler2);
elment.attachEvent("onclick",handler3);

//标准addEventListener 执行顺序：1-2-3；
elment.addEvenListener("click",handler1,false);
elment.addEvenListener("click",handler2,false);
elment.addEvenListener("click",handler3,false);

```

（三）DOM方法addEventListener()和removeListenner()
addEventListenner()和removeListenner()表示用来分配和删除事件的函数。这两种方法都需要三种参数，分别为：string（事件名称），要触发事件的函数function，指定事件的处理函数的时期或者阶段（boolean),例子见（二）.

（四）通用的事件添加方法：

```javascript {cmd="node"}
on:function(elment,type,handler){
   //添加事件
   return element.attachEvent？elment.attachEvent("on"+type,handler):elment.addEventListener(type,handler,false);
}
```

## 发布/订阅

> 我们假定，存在一个”信号中心”，某个任务执行完成，就向信号中心”发布”（publish）一个信号，其他任务可以向信号中心”订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做”发布/订阅模式“（publish-subscribe pattern），又称”观察者模式“（observer pattern）。

这个模式有多种实现，下面采用的是Ben Alman的Tiny Pub/Sub，这是jQuery的一个插件。
首先，f2向”信号中心”jQuery订阅”done”信号。

```javascript {cmd="node"}
jQuery.subscribe("done", f2);

//然后，f1进行如下改写：
function f1(){
　　setTimeout(function () {
　　　　// f1的任务代码
　　　　jQuery.publish("done");
　　}, 1000);
}
```

jQuery.publish("done")的意思是，f1执行完成后，向”信号中心”jQuery发布”done”信号，从而引发f2的执行。
此外，f2完成执行后，也可以取消订阅（unsubscribe）。

```javascript {cmd="node"}
jQuery.unsubscribe("done", f2);
```

这种方法的性质与”事件监听”类似，但是明显优于后者。因为我们可以通过查看”消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

## promise对象

> Promise的概念并不是ES6新出的，而是ES6整合了一套新的写法。同样继续上面的例子，使用Promise代码就变成这样了：

```javascript {cmd="node"}
 /* promise的api方法：
 * promise construct
 * then
 * resolve/reject
 * catch
 * all
 * race: 顾名思义，Promse.race就是赛跑的意思，意思就是Promise.race([p1, p2, p3])里面哪个结果获得的快就返回那个结果
 * finally:
 */
var readFile = require('fs-readfile-promise');
readFile(fileA)
.then((data)=>{console.log(data)})
.then(()=>{return readFile(fileB)})
.then((data)=>{console.log(data)})
// ... 读取n次
.catch((err)=>{console.log(err)})

// 注意：上面代码使用了Node封装好的Promise版本的readFile函数，它的原理其实就是返回一个Promise对象，咱也简单地写一个：
var fs = require('fs');
var readFile = function(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}
module.export = readFile
```

但是，Promise的写法只是回调函数的改进，使用then()之后，异步任务的两段执行看得更清楚，除此之外并无新意。撇开优点，Promise的最大问题就是代码冗余，原来的任务被Promise包装一下，不管什么操作，一眼看上去都是一堆then()，原本的语意变得很不清楚。

## Generator(from es6)

> Generator(生成器)函数是ES6提供的一种异步编程解决方案，语法行为与传统函数完全不同。ES6将JavaScript异步编程带入了一个全新的阶段。
> Generator 函数的暂停执行的效果，意味着可以把异步操作写在yield表达式里面，等到调用next方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield表达式下面

generator函数的特性如下，后面两个特性使它可以作为异步编程的完整解决方案：

* 暂停执行

* 恢复执行

* 函数体内外的数据交换

* 错误处理机制

```javascript {cmd="node"}
// Ajax是典型的异步操作，通过Generator函数部署Ajax操作，可以用同步的方式表达。
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}
function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}
var it = main();
it.next();

// 上面代码的main函数，就是通过 Ajax 操作获取数据。可以看到，除了多了一个yield，它几乎与同步操作的写法完全一样。注意，makeAjaxCall函数中的next方法，必须加上response参数，因为yield表达式，本身是没有值的，总是等于undefined。

```

## async函数

> ES2017标准引入了async函数，使得异步操作变得更加方便。但它其实是是Generator函数的语法糖

```javascript {cmd="node"}
// demo1: 一个 Generator 函数，依次读取两个文件。
const fs = require('fs');
const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
// 写成async函数，就是下面这样。
// 比较就会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// demo2:
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}
getStockPriceByName('goog').then(function (result) {
  console.log(result);
});

```

async函数对 Generator 函数的改进，体现在以下四点。

* 内置执行器

* 更好的语义

* 更广的适用性

* 返回值是Promise

async 函数的实现原理：
async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里

```javascript {cmd="node"}
async function fn(args) {
    // ...
}
// 等同于
function fn(args) {
    return spawn(function* () {
       // ...
    });
}
```

## 其他

### RxJS

> 概述：Observable对象格式

## 参考文章&感谢

[JS的四种异步方式：：回调/监听/流程控制库/promise](https://blog.csdn.net/lilongsy/article/details/74351989?utm_source=itdadao&utm_medium=referral)

[前端基本知识（四）：JS的异步模式：1、回调函数；2、事件监听；3、观察者模式；4、promise对象](https://www.cnblogs.com/chengxs/p/6497575.html)89  

[JavaScript异步编程的终极演变](https://segmentfault.com/a/1190000006510526)

[阮一峰es6教程](http://es6.ruanyifeng.com/#docs/async)