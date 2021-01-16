/*
 * @Descripttion: 
 * @Author: 黄佳佳
 * @Date: 2021-01-16 17:45:35
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 18:04:15
 */
// 自己定义的代理数据方法
export function proxy(vm, data, key) {
    console.log(vm[data][key])
    Object.defineProperty(vm, key,{
        get() {
            return vm[data][key]; // vm._data.a --> vm.a
        },
        set(newValue) {
            vm[data][key] = newValue // vm._data.a = 1  --> vm.a = 1
        }
    })
}
export function defineProperty(target, key, value) {
    // Object.defineProperty(value,'__ob__',{
    Object.defineProperty(target,key,{
        enumerable: false, // 不能被枚举，不能被循环出来
        configurable: false,
        // value: this // 把当前的实例定义在value上，方便在数组劫持的js中使用写在对象观测js中的observerArray方法
        value
    })
}
// 是否是对象 true：对象  false: 不是对象
export function isObject(data) {
    return typeof data == "object" && data != null
}
// 是否是数组 true：数组  false: 不是数组
export function isArray(data) {
    return Array.isArray(data)
}
