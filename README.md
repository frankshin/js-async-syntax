# js-async-demos

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

## Generator

ES6将JavaScript异步编程带入了一个全新的阶段

## async函数

ES7中的async函数更是给出了异步编程的终极解决方案

## 参考文章&感谢

[JS的四种异步方式：：回调/监听/流程控制库/promise](https://blog.csdn.net/lilongsy/article/details/74351989?utm_source=itdadao&utm_medium=referral)

[前端基本知识（四）：JS的异步模式：1、回调函数；2、事件监听；3、观察者模式；4、promise对象](https://www.cnblogs.com/chengxs/p/6497575.html)89  