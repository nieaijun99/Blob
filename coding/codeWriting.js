let reg2=/^http(s)?:\/\/w+\.qq\.com[^.]*$/
// ^ :	匹配输入字符串的开始位置
// ?:匹配前面的子表达式零次或一次
// \:转义字符
// +:匹配前面的子表达式一次或多次
// [^xyz]:负值字符集合。匹配未包含的任意字符
//* 匹配前面的子表达式零次或多次


//*****************************new 核心原理实现**********************************************//

/**
 * new 核心原理实现
 * 1、new 返回一个新的对象；
 * 2、通过原型链继承构造函数的原型对象；
 * 3、通过apply绑定this,访问父构造函数实现继承；
 * 返回新的对象；
 * 
*/

 function create(){
//   console.log(arguments);// argument是一个类数组；
   // [Arguments] { '0': [Function: Car], '1': 'black' }
   var obj=Object.create({});
   // 获取构造函数；
   const Con=[].shift.call(arguments);
   // 通过原型链继承构造函数的原型对象；
   obj.__proto__=Con.prototype;
   // 通过apply 绑定this,访问构造函数中的属性；
   Con.apply(obj,arguments);

   return obj;
 }


 function Car(color){
    this.color=color;
    this.name="baixiyang"
    return {
      name:this.name
    }
 }

var car =create(Car,'black');


//  new 模拟实现的优化； 
// 构造函数有如下三种情况： 返回新的对象 return {}； 2、没有return,即返回undefined,3、返回undefined以外的数据类型
function  updateCreate(){
   // 获取构造函数
   let Con =[].shift.call(arguments); 
   // 创建一个继承自构造函数原型的对象；
   let obj=Object.create(Con.prototype);
   // 绑定新建this对象,使其可访问构造函数中的属性
   let ret=Con.apply(obj,arguments)
   // 构造函数返回对象，则优先返回对象；
   return ret instanceof Object?ret:obj
}

//***************************************************************************//

//*****************************EventLoop**********************************************//
/**
 *  js是单线程的，为了防止一个函数执行时间过程阻塞后面的代码，会将同步任务压入执行栈；
 * 依次执行；
 *  将异步任务推入异步队列，异步队列氛围宏任务和微任务，
 *  宏任务队列的执行时间较长，因此微任务队列优先于宏任务队列；
 *  微任务队列代表：promise.then, MutationObserver
 *  宏任务代表：setImmediate setTimeout  setInterval;
 * 
*/

//***************************************************************************//


//***************************************原生ajax************************************//
/**
   ajax 异步通信方式,用从服务端获取数据达到局部刷新；
   * 1、创建XMLHttpRequest对象；
     2、调用open();  传入三个参数、 get/post 、url、同步异步true/false
     3、监听onreadyStateChange事件，当readyState===4时，返回responseText;
     4、调用send方法传递参数；
 * 
 * 
 * 
*/

//*******************************************************************************************//

//*******************************思考题 手写累加器********************************************//
/**
 * 问题：用 JS 实现一个无限累加的函数 add，示例如下：

      add(1); // 1
      add(1)(2);  // 3
      add(1)(2)(3)； // 6
      add(1)(2)(3)(4)； // 10 
 * 
*/

/**
 * 解题思路：
 * * console.log(functionName); 会自动调用functionName.toString();方法；
 * * 我们使用闭包 sum(b) 对a进行累加；
 * * 重写sum的toString方法；
 * 
*/
function add (a=0){

   function sum(b){ // 使用闭包
      a+=b;
      return sum;
   }
   sum.toString=function (){
      return a;
   }
   return sum;
}


//*********************************手写call apply bind******************************************//

Function.prototype.myCall=function(context,...args){
  if(typeof this !=='function'){
    throw new TypeError('not function');
  }
  if(!context){
     context=window
  }
  let fn=Symbol();
  context[fn]=this;
  let result =context[fn](...args)
  delete context[fn]
  return result;
}


Function.prototype.myApply=function(context,args=[]){
   if(typeof this!=='function'){
      throw new TypeError('not function')
   }
   if(!context){
      context=window
   }
   let fn=Symbol()
   context[fn]=this;
   let result=context[fn](...args)
   delete context[fn]
   return result;
}

Function.prototype.myBind=function(context,...args){
   if(typeof this !=='function'){
      throw new TypeError('not function')
   }
   if(!context){
      context=window;
   }
   let fn=this;
   return function(...otherArgs){
      return fn.apply(context,[...args,...otherArgs])
   }
}


//***************************************************************************//


function Product(name, price) {
   this.name = name;
   this.price = price;
 }
 
 function Food(name, price) {
   Product.call(this, name, price);
   this.category = 'food';
 }
 
 function Toy(name, price) {
   Product.call(this, name, price);
   this.category = 'toy';
 }
 
 var cheese = new Food('feta', 5);
//  var fun = new Toy('robot', 40);


//************************************手写 Promise***************************************//

// 调用原生Promise 

const promise = new Promise((resolve, reject) => {
   resolve('success')
   reject('err')
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})

/**
 * @description 
 * Promsise 类是一个，在new 一个对象的时候，传入一个执行器且这个执行器立即执行；
 * 
 * Promsie 有三种状态 pending resolved    rejected 
 * 
 * Promsie 内部由resolve  reject 来改变promise 状态且不可逆
 * 
 * **/

// 定义三个常量；
const PENDING='pending'
const FULLFILLED='fullfilled'
const REJECTED='rejected'

// 1、完成状态和结果管理；
 class myPromise{
    constructor(executor){
       // 执行器立即执行；
      executor(this.resolve,this.reject);

    }
    // 成功后返回的值；
    value=null;
    // 拒绝后返回的值；
    reason=null;

   //暂存resolevd回调函数
   onFullfilledCallback=[];
   
   //暂存rejected回调函数； 
   onRejectedCallback=[];
    // promise 状态；
    status=PENDING

    resolve=(value)=>{
       // 只有状态是pending ,才执行修改，结果不可逆；
     if(this.status==PENDING){
        this.status=FULLFILLED;
        this.value=value
        // 迭代处理callback调用
        while(this.onFullfilledCallback.length>0){
       
           this.onFullfilledCallback.shift()(value)

        }
     }
    }

    reject=(reason)=>{
      if(this.status===PENDING){
         this.status=REJECTED;
         this.reason=reason;
         //迭代处理callback回调
         while(this.onRejectedCallback.length>0){
            this.onRejectedCallback.shift()(reason);
         }
         
      }
    }

   // 2、then 的简单实现； then 方法传入两个回调函数；
   then(onFullfilled,onRejected){
      if(this.status==FULLFILLED){
         // 4、链式调用then;为了链式调用then，直接返回一个新的Promise;
         const nextPromise=new myPromise((resolve,reject)=>{
        
            const x= onFullfilled(this.value)
            // 判断x的值类型，如果是普通类型直接返回，如果是promise类型，则返回then;
            resolvePromise(x,resolve,reject);
            
         })
         return nextPromise
         
      }else if(this.status==REJECTED){
         onRejected(this.reason);
      }else{
         // 3、通过暂存callback函数，实现异步逻辑处理调用resolve()
         // 3.1 then方法多次调用,利用数组存储callback回调；
         //暂存callback函数；
         this.onFullfilledCallback.push(onFullfilled);
         this.onRejectedCallback.push(onRejected);
      }
   }

 }
 function resolvePromise(x,resolve,reject){
   if(x instanceof myPromise){
      // 如果x是一个promise 对象；调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
      x.then(resolve,reject)
   }else{
      resolve(x);
   }
}

 // 对外暴露myPromise
 module.exports = myPromise;


 // for test

 const mypromise = new myPromise((resolve, reject) => {
   resolve('success')
   reject('err')
})

mypromise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})


// for test async 

const asyncPromise = new myPromise((resolve, reject) => {
  setTimeout(()=>{
   resolve('async success')
  },3000);
})

asyncPromise.then(value => {
  console.log('resolve async ', value)
}, reason => {
  console.log('reject async ', reason)
})


// for test multi then
const multiPromise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

multiPromise.then(value => {
  console.log(1)
  console.log('resolve', value)
})
 
multiPromise.then(value => {
  console.log(2)
  console.log('resolve', value)
})

multiPromise.then(value => {
  console.log(3)
  console.log('resolve', value)
})

// for test 链式调用then;
// then 方法链式调用，那么就需要返回一个promise 对象；且里面return 一个返回值，作为下一个then方法的参数，如果return一个参数，则需要判断他的状态；


const thenPromise = new myPromise((resolve, reject) => {
   // 目前这里只处理同步的问题
   resolve('success thenPromise')
 })
 
 function other () {
   return new myPromise((resolve, reject) =>{
     resolve('other thenPromise')
   })
 }
 thenPromise.then(value => {
   console.log(1,'thenPromise')
   console.log('resolve', value)
   return other()
 }).then(value => {
   console.log(2)
   console.log('resolve', value)
 })


//***************************************************************************//

//*******************************手写一个浅克隆********************************************//
// 浅克隆，只拷贝数组或者对象的第一层内容；
// 判断是否是对象， array 或者 {}； 如果是对象则遍历对象属性；
const shallClone =(target)=>{
   if(typeof target==='object'&&target!==null){
      // 
      const cloneTarget=Array.isArray(target)?[]:{};
      for(let key in target){
         if(target.hasOwnProperty(key)){
            cloneTarget[key]=target[key]
         }
      }// end of for 
      return cloneTarget;
   }else{
      return target;
   }
}

//*******************************手写一个深克隆********************************************//
// 递归调用给每一个对象属性进行赋值； 只考虑array  {}
function deepClone(target){
   if(target==null){
      return null
   }
   if(typeof target !=='object'){
      return target
   }
   const deepTarget=Array.isArray(target)?[]:{}
   // 否则进行遍历深度递归；
   for(let key in target){
      if(target.hasOwnProperty(key)){
         deepTarget[key]=deepTarget(target[key])
      }
   }// end of for 
   return deepTarget;
}


//*******************************手写一个数组去重********************************************//



function debounce (fun,wait=500){
  let timer=null
  return function anonymous(...params){
    clearTimeout(timer);
    timer=setTimeout(()=>{
       timer=null;
       fun.call(this,...params);
    },wait);
  }
}


function throttle(fun,wait){
  let timer=null,preivous=0;
  return function anonymous(...params){
    let now=new Date();
    let remaining=wait-(now-preivous)  // 维护一个剩余执行时间；
    if(remaining<0){  // 则可以放行执行
      clearTimeout(timer);
      timer=null;
      preivous=new Date();
      fun.call(this,...params);

    }else if(!timer){ // 第一次触发；
      timer=setTimeout(()=>{
         // 执行完清除计时器；
         clearTimeout(timer);
         timer=null;
         preivous=new Date();
         fun.call(this,...params);
      },remaining);
    }
  }
}


// Object.create
Object.create=function create(prototype){
   if(prototype==null||typeof prototype !=='object'){
      throw new TypeError('object');
   } 
   // 空构造函数；让其原型属性指向传入的原型对象；
   function Temp(){}
   Temp.__proto__=prototype;
   return new Temp; 
}


function _new(Fun,...args){
   let obj=Object.create(Fun.prototype);
   let res=Fun.call(obj,...args);
    
   // 返回值判断；
   if(res!==null&&/^(object|function)$/.test(typeof res)){
      return res;
   }
   // 否则返回obj;
   return obj;

}


// es5 实现数组扁平化；
function myFlat(){
   _this=this;
   let newArr=[];
   let cycleArray=(arr)=>{
      for(let i=0;i<arr.length;i++){
         if(Array.isArray(arr[i])){
            cycleArray(arr[i])
            continue
         }else{
            newArr.push(arr[i]);
         }
      }// end of for 
   }
   cycleArray(_this);
   return newArr;
}


// es5实现扁平化；
const flat=(arr)=>{
   let newArr=[];
   let cycleArray=(arr)=>{
      for(let i=0;i<arr.length;i++){
         let item=arr[i]
         if(Array.isArray(item)){
            cycleArray(item);
            continue;
         }else{
            newArr.push(item);
         }
      }// end 
   }// 
   cycleArray(arr);
   return newArr;
}

// reduce 实现扁平化；
 const flatReduce=(arr)=>{
   return arr.reduce((pre,cur,index)=>{
      return pre.concat(Array.isArray(cur)?flatReduce(cur):cur);
   },[]);
 }

 // 原地去重；数组去重；
function arraySet(arr){
   let obj={};
   for(let i=0;i<arr.length;i++){
      let item=arr[i];
      if(obj[item]!=='undefined'){
         // 删除当前元素；
         arr[i]=arr[arr.length-1]
         arr.length--;
         i--
      }
      obj[item]=item;
   }
   obj=null;
}

// 基于generator 实现async await ;

function asyncFun(generator){
   const iterator=generator();
   const next=(data)=>{
      let {value,done}=iterator.next(data);
      if(done){
         return ;
      }
      value.then((data)=>{
         next(data);
      });

   }
   next();
}

asyncFun(function* (){
   let data= yield readfile();
   data=yield readfile2();
   return data;
})



// 基于promise 封装ajax；
function ajax(url,method){
  return new Promise((resolve,reject)=>{
   const  xhr=new XMLHttpRequest();
   xhr.open(url,method,true);
   xhr.onreadystatechange=function(){
      if(xhr.readyState===4){
         if(xhr.status===200){
            resolve(xhr.responseText);
         }else{
            reject();
         }
      }else{
         reject('req error');
      }
   }
   xhr.send(null);
  })
}


//手动实现jsonp跨域；

let script =document.createElement('script');
script.src="http://www.baidu.com?username=json**callback=callback"

document.appendChild(script);
function  callback(res){
   console.log(res);
}

// 手动实现sleep;
function sleep(wait){
   return new Promise((resolve,reject)=>{
      setTimeout(()=>{
         resolve();
      },wait);
   });
}

// es5实现reduce ;

[].reduce((pre,curr,index,arr)=>{},prev);


Array.prototype.myReduce=function(fn,prev){
   // 遍历当前array;
   for(let i=0;i<this.length;i++){
      if(typeof prev==='undefined'){
         prev=fn(this[i],this[i+1],i+1,this);
         i++
      }else{
         prev=fn(prev,this[i],i,this)
      }
   }// end of 
   return prev;
}

// 手动实现currying 函数；
function add(a,b,c,d){
   return a+b+c+d;
}
function currying(fn,...args){
   // 将函数的参数综合与当前传入的参数长度进行比较；
   if(fn.length===args.length){
      return fn(...args);
   }else{
      // 返回一个函数接受另外的参数；
      return function anonymous(...newArgs){
         let all=[...args,...newArgs]
         // 递归调用currying;
         return currying(fn,...all)
      }
   }
}


// es5实现一个继承；
// 寄生继承； 通过构造函数继承属性；通过原型链继承方法；


function Parent(name) {
   this.name = name;
   this.colors = ['red', 'blue', 'green'];
 }
 Parent.prototype.getName = function () {
   return this.name;
 }
 

function Child(name,age){
   Parent.call(this,name);
   this.age=age;
}

// 寄生组合继承；
Child.prototype=Object.create(Parent.prototype);
Child.prototype.constructor=Child;
Child.prototype.getAge=function(){
   return this.age;
}


// 手动实现发布订阅；
// 每次emit 都会触发on callback;
class EventEmitter{
   constructor(){
      this.events={};
   }
   on(eventName,callback){
      if(this.events[eventName]=='undefined'){
         this.events[eventName]=[callback]
      }else{
         this.events[eventName].push(callback);
      }
   }

   // 触发事件的方法；
   emit(eventName){
      this.events[eventName]&&this.events[eventName].forEach(cb=>cb());
   }
}

// 手动实现观察者模式；
// 观察者模式有观察者，有被观察者；
// 被观察者 
class Subject{
 constructor(name){
   this.state='happy';
   this.observers=[];// 存储所有的观察者；
 }
 attach(o){
   this.observers.push(o);
 }
 // 更新被观察者；
 setState(newState){
   this.state=newState; // 更新状态；
   this.observers.forEach(o=> o.update(this));
 }
}

class Observer{
   constructor(name){
      this.name=name;
   }
   update(student){
      console.log('',student);
   }
}

let student = new Subject('学生'); 

let parent = new Observer('父母'); 
let teacher = new Observer('老师'); 

// 被观察者存储观察者的前提，需要先接纳观察者
student. attach(parent); 
student. attach(teacher); 
student. setState('被欺负了');


// 手动实现Object.freeze;
// 冻结一个对象，让其不能再增删改其他属性；

function myFreeze(obj){
   if(obj instanceof Object){
      Object.seal(obj); // 封闭对象；
      for(let key in obj){
         if(obj.hasOwnProperty(key)){
            Object.defineProperty(obj,key,{
               writable:false
            });
            // 递归
            myFreeze(obj[key]);
         }
      }
   }
}

//手写 Promsie.all
// 有一个promise 任务失败就全失败；，返回一个promise;
 function isPromsie(val){
   return typeof val.then ==='function'
 }


 //promise.all([a,b,c,d]);

Promise.all=function(promises){
   return new Promise((resolve,reject)=>{
      let arr=[];//存放promise执行结果；
      let index=0;// 计数器，累计promise 执行次数；
      const processData=(key,data)=>{
         arr[key]=data;
         if(++index==promises.length){
            resolve(arr);
         }
      }
      // 遍历依次拿到执行结果；
      for(let i=0;i<promises.length;i++){
         let result=promises[i];
         if(isPromsie(result)){
            // 原数组顺序依次输出；
            result.then((data)=>{
               processData(i,data);
            },reject);
         }else{
            ProcessData(i,result);
         }
      }
   });
}

Promise.allSettled=function(promises){
   return new Promise((resolve,reject)=>{
      let arr=[]; // 存储每个结果的状态；
      let times=0; // 累加器；
      // 统计函数；
      const setData=(i,data)=>{
         arr[i]=data;
         if(++times===promises.length){
            resolve(arr);
         }
      }
      for(let i=0;i<promises.length;i++){
         let current=promises[i]
         if(isPromsie(current)){
            current.then((data)=>{
               setData(i,{status:'fulfilled',value:data});
            },err=>{
               setData(i,{status:'rejected',value:err});
            });
         }else{
            setData(i,{status:'fulfulled',value:current});
         }
      }

   });
}


// 手动实现promise.finally;
Promise.prototype.finally=function(callback){
   return this.then((data)=>{
      return Promise.resolve(callback()).then(()=>data);
   },err=>{
      return Promise.resolve(callback()).then(()=>{
         throw err;
      });
   })
}

https://juejin.cn/post/6870319532955828231#heading-42

//实现一个异步求和函数；
function asyncAdd(a,b,callback){
   setTimeout(()=>{  
      callback(null,a+b)
   },1000);
}
// 异步两数之和；
async function  sumT(a,b){
   return await new Promise((resolve,reject)=>{
      asyncAdd(a,b,(err,res)=>{
         if(!err){
            resolve(res);
         }
         reject(err);
      })
   })
}

// 多数之和呢

const arr=[1,2,3,4]
const reducer=(acc,cur)=>{
   return acc+cur
}
arr.reduce(reducer);


// 利用两数之和 ；
async function sum(...args){
   if(args.length===1){
      return args[0]
   }
   let result=[];
   for(let i=0;i<args.length;i=+2){
      result.push(sumT(args[0],args[1]));
   }
   // 判断是否是奇行；
   if(args.length&1){
      result.push(args.length-1):
   }//
   return sum(...await Promise.all(result));
}

// 手写一个Promise.prototype.finally();
// finally是一个callback回调函数无论前面的返回结果是什么，他都执行；且返回一个promise;

Promise.prototype.finally=function(callback){
   return this.then((res)=>{
      return Promise.resolve(callback()).then(()=>{
        return res; 
      });
   },(err)=>{
      return Promise.resolve(callback()).then(()=>{
         throw err;
      });
   })
};

// promsie.any
const promises = [
  Promise.reject('ERROR A'),
  Promise.reject('ERROR B'),
  Promise.resolve('result'),
]

Promise.any(promises).then((value) => {
  console.log('value: ', value)
}).catch((err) => {
  console.log('err: ', err)
})

const promises = [
  Promise.reject('ERROR A'),
  Promise.reject('ERROR B'),
  Promise.reject('ERROR C'),
]

Promise.any(promises).then((value) => {
  console.log('value：', value)
}).catch((err) => {
  console.log('err：', err)
  console.log(err.message)
  console.log(err.name)
  console.log(err.errors)
})

// 返回一个promise;手写promise.any 遍历promises ，只要一个resove则resolvr;
Promsie.prototype.any=function(promises){
   return new Promise((resolve,reject)=>{
      promises=Array.isArray(promises)?promises:[];
      let len=promises.length;
      let err=[];
      if(len==0){
         return reject(new AggregateError(''))
      }
      // 遍历；
      promises.forEach((promise)=>{
         promsie.then((val)=>{
            resolve(val);
         },(err)=>{
            len--;
            err.push(err);
            if(len==0){
               reject(new AggregateError(err));
            }
         });
      });
   })
}


// coding promsie.allSettled

Promise.prototype.allSettled=function(promises){
   return new Promise((resolve,reject)=>{
      let res=[];
      let times=0;
      let setData=(index,data)=>{
         res[index]=data;
         if(++times===promises.length){
            resolve(res);
         }
      }
      for(let i=0;i<promises.length;i++){
         let curr=promises[i]
         if(isPromsie(curr)){
            curr.then((res)=>{
               setData(i,{status:'fullfilled',value:res});
            },(err)=>{
               setData(i,{status:'rejected',value:err});
            }
         }else{
            setData(i,{status:'fullfilled',value:curr});
         }
      }
   });
}

// 监听一个对象；

function observer(obj){
   Object.keys(obj).forEach(key){
      defineReactive(obj,key,obj[key])
   } 
}
function defineReactive(obj,k,v){
   if(typeof v==='object'){
      observer(v);
   }
   Object.defineProperty(obj,k,{
      enumerable:true,
      configrable:true,
      get:function reactiveGetter(){
         return v;
      },
      set:function reactiveSetter(newV){
         if(v!=newV){
            v=newV;
         }
      }
   });
}

const arrayProto=Array.prototype;
export const arrayMethods=Object.create(arrayProto);
// 重写以下函数；
const methodsToPath=['push','pop','shift','unshift','splice',
'sort','reverse']

methodsToPath.forEach((method)=>{
   // 缓存原生函数；
   const original=arrayProto[method]
   // 重写函数；
   def(arrayMethods,method,function mutator(...args){
      // 调用原生函数获取结果；
      const result =original.apply(this,args)
      const ob=this.__ob__;
      let inserted;
      switch ((method)) {
         case 'push':
         case:'unshift':
            inserted=args
            break;
         case:'splice':
         inserted=args.slice(2)
            break;
         default:
            break;
      }
      if(inserted){
         ob.observerArray(inserted);
      }
      // 手动派发更新；
      ob.dep.notify();
      return result;
   })
});


// vm.$set();
export function set(target,key,val){
   // target 如果为数组；
   if(Array.isArray(target)&&isInvalidArrayIndex(key)){
      target.length=Math.max(target.length,key);
      target.splice(key,1,val);
      return val;
   }//
  
   if(key in target && !(key in target.prototype)){
      target[kye]=val
      return val;
   }

   // 判断是否响应式‘
   const ob=target.__ob__;
   if(!ob){  // target 不是响应式数据；
      target[key]=val;
      return val;
   }

   // 关键是手动调用，否则进行响应式处理；并通知；ob.dep.notify();
   defineReactive(ob.value,key,val);
   ob.dep.notify();
   return val;

};
// 手写一个reactive;

const toProxy= new WeekMap():
const toRaw= new WeekMap();
function reactive(target){
   // reactive
   createReactiveObject(target);
}
function createReactiveObject(target){
   if(!isObject(target)){
      return target
   }
   //
   let observed=toProxy.get(target);
   if(observed){
      return observed
   }
   if(toRao.has(target)){
      return target
   }
   const handler={
      get(target,key,receiver){
         let res=Reflect.get(target,key,receiver);
         track(target,'get',key);
         return res;
      },
      set(target,key,val,receiver){
         let oldV=target[key]
         let hadkey=target.hasOwnProperty(key);
         let res=Reflect.set(target,key,val,receiver);
         if(hadkey){
            track(target,'set',key);
         }else{
            track(target,'addd',key)
         }
         return res;
      }// 
   }// 
   let proxy=new Proxy(target,handler);
   toProxy.set(target,proxy);
   toRaw.set(proxy,target); 
};

function rgb2hex(rgb){
   rgb=rgb.match(/\d+/g);
   const hex=(n)=>{
      return ("0"+Number(n).toString(16)).slice(-2);
   }
   return rgb.reduce((acc,cur)=>{acc+hex},"#");
}
   
// 插入排序；
function insertionSort(arr){
   let n=arr.length;
   let prevIndex,current;
   for(let i=1;i<n;i++){
      current=arr[i];
      prevIndex=i-1;
      while(prevIndex>=0&&current<arr[prevIndex]){
         arr[prevIndex+1]=arr[prevIndex]
         prevIndex--
      }
      curr[prevIndex+1]=current
   }// end of for ;
   return arr;
}

// 闭包js基础题；
// 1、闭包收集参数 2、getValue进行求和操作；
var foo = function(...args) { // 要求实现函数体}
var f1 = foo(1,2,3); f1.getValue(); // 6 输出是参数的和
var f2 = foo(1)(2,3); f2.getValue(); // 6
var f3 = foo(1)(2)(3)(4); f3.getValue(); // 10

var foo=function(...args){
   let addArgs=[...args]
   function fn(...innerArgs){
      addArgs=[...innerArgs,...args]
      return fn;
   }
   fn.getValue=function(){
      return addArgs.reduce((acc,cur)=>{
         return acc+cur
      },0);
   }
}

var debounce=function (fn,wait=50){
   let timer,context,args;
  
   const later=setTimeout(()=>{
      fn.apply(context,args);
      context=null;
      args=null;
   },wait);
    // 使用闭包；
   return function (...params){
      
      if(!timer){
         timer=later();
         context=this;
         args=params;
      }else{
         clearTimeout(timer)
         timer=later();

      }
   }
}

// 柯里化curry
function curry(fn,...args){
    //将函数的参数综合与当前传入的参数长度进行比较；
   if(fn.length===args.lenght){
      return fn(...args)
   }
   return function anonymous(...otherArgs){
      let all=[...args,...otherArgs]
      return curry(fn,all);
   }
}
// instanceof 内部原理实现；
function instanceof(L,R){
   let prototype=R.prototype;
   let lProto=L.__proto__;
   while(true){
      if(L==null){
         return false;
      }
      if(lProto===prototype){
         return  true;
      }
      lProto=lProto.__proto__;
   }
}

//按照 instanceof 的逻辑，真正决定类型的是 prototype

function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]"
}
function isDate(value) {
  return Object.prototype.toString.call(value) === "[object Date]"
}
function isRegExp(value) {
  return Object.prototype.toString.call(value) === "[object RegExp]"
}

// indexOf / findIndex  //的第一个元素的索引
Array.prototype.indexOf();

//第 161 题：用最精炼的代码实现数组非零非负最小值index
例如：[10,21,0,-7,35,7,9,23,18] 输出5, 7最小

function getIndex(arr){
      let index=null;
      ...
      return index;
}

function getIndex(arr){
   let index=-1;
   let min=Infinity;
   for(let i=0;i<arr.length;i++){
      if(arr[i]>0&&arr[i]<min){
         min=arr[i]
         index=i;
      }
   }// end of for;
   return index;
}
// O(N) O(1)


// 第 160 题：输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，
//应该如何改造？注意不可改动 square 方法 #389

const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

function test() {
  list.forEach(async x=> {
    const res = await square(x)
    console.log(res)
  })
}
test()
// forEach 是否不能阻塞的，默认是请求并行发起，所以同时输出1,4,9；

// 串行输出；
async function tes(){
   for(let val of list){
      const res=await square(val);
      console.log(res);
   }
}
// promsie版本；
// 利用promise 本身的链式调用来实现串行；
let promsie=new Promise();
function test(i=0){
   if(i===list.length){
      return ;
   }
   promsie=promsie.then(()=>{
      square(list[i]);
   });
   test(i+1)
}

// 第 159 题：实现 Promise.retry，成功后 resolve 结果，
//失败后重试，尝试超过一定次数才真正的 reject #387
Promise.prototype.retry=function(promsieFn,times=3){
return new Promsie(async (resolve,reject)=>{
   while(times--){
      try{
         let res=await promsieFn();
         resolve(res);
         break;
      }catch(e){
         if(!times){
            reject(e);
         }
      }
   }
});
}

// 第 158 题：如何模拟实现 Array.prototype.splice
let splice=function(start,deleteCount,...addList){
   if(start<0){
      if(Math.abs(start)>this.length){
         start=0;
      }else{
         start+=this.length;
      }
   }// 获取下标；
   if(typeof deleteCount==='undefined'){
      deleteCount=this.length-start;
   }// 如果不传，则删除数量为start之后的所有；

   // splice 返回移除以后的数组；
   const removeList=this.slice(start,start+deleteCount);

   const right=this.slice(start+deleteCount);
   let addIndex=start;
   addList.concat(right).forEach((item)=>{
      this[addIndex]=item;
      addIndex++
   });
   this.length=addIndex;
   // 
   return removeList
}



// 第 156 题：求最终 left、right 的宽度（变形)
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 300px;
    background: red;
  }
  .right {
    flex: 2 1 200px;
    background: blue;
  }
</style>

// flex-grow  flex-shrink flex-basic的计算；
// 多余100；宽度，应该扩大；
// 括大空间的占比 1/2

//https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax


// 4. 求最终 left、right 的宽度 #5
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 500px;
    background: red;
  }
  .right {
    flex: 2 1 400px;
    background: blue;
  }
</style>
// 计算flex-shrink  溢出则进行缩小；
//总权重： 2*500+1*400=1400；
300*2*500/1400
300*1*400/1400


// 第 153 题：实现一个批量请求函数 multiRequest(urls, maxNum) #378

// 要求如下：

// 要求最大并发数 maxNum
// 每当有一个请求返回，就留下一个空位，可以增加新的请求
// 所有请求完成后，结果按照 urls 里面的顺序依次打出
new Promise((resolve,reject)=>{

});

// 最大并发数请求的实现；
function multiRequest(urls,maxNum){
   let result=[];
   let i=0;
   let resolve;
   const promsie=new Promise((res,rej)=>{
      resolve=res;
   });
   const addTask=function(){
      if(i>=urls.length){
         resolve();
      }
      const task=request(urls[i++]).finally(()=>{
         addTask()
      })
      result.push(task);
   }
   // 先执行addTask;
   while(i<maxNum){
      addTask();
   }
   return promsie.then(()=>{
      Promise.all(result);
   });
}

//第 152 题：实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据 #331
字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
示例一: 'abc' --> {value: 'abc'}
示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

// ["abc", "bcd", "def"]

function normalize(s){
   let arr=s.match(/\w+/g);
   let result
   while(arr.length){
      let cur=arr.pop();
      let temp={value:cur}
      if(result){
         temp.children=result;
      }
      result=temp;
   }// 
   return result;
}

// 第 151 题：用最简洁代码实现indexOf方法 #321  slice(start,end);

function indexOf(str,item){
   let strLen=str.length;
   let itemLen=item.length;
   for(let i=0;i<=strLen-itemLen;i++){
      // 校验是否存在子串；
      if(str.slice(i,itemLen+i)===item){
         return i;
      }
   }
   return -1;
}

https://github.com/Advanced-Frontend/Daily-Interview-Question/issues?page=4&q=is%3Aissue+is%3Aopen




