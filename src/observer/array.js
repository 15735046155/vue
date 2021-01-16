/*
 * @Descripttion: 数组劫持，原理是调用数组的的特定的7个方法的时候，先重新定义一个方法，先走自己的逻辑，然后在走数组本身的逻辑，然后返回值
 * @Author: 黄佳佳
 * @Date: 2021-01-16 15:39:40
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 17:15:35
 */
// 拿到数组原型上的方法（原来的方法）
let oldArrayProtoMethods = Array.prototype;
// 继承下原数组
export let arrayMethods = Object.create(oldArrayProtoMethods);
let methods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "reserve",
    "sort",
    "splice"
]
methods.forEach(method => {
    arrayMethods[method] = function(...args){
        // 劫持后走自己的逻辑
        
        // 数组本身的逻辑
        const result = oldArrayProtoMethods[method].apply(this, args);

        let inserted;
        let ob = this.__ob__;
        // push unshift这两个方法追加的内容可能是对象类型，应该被劫持后再次观测
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': // vue.$set原理
                inserted = args.slice(2); // arr.splice(0,1,{a:1})从地0个开始增加一个{a:1}
            default:
                break;
        }
        // 给数组新增的值也要观测
        if (inserted) {
            ob.observerArray(inserted)
        }
        return result;
    }
})
