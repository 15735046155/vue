(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

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
    let arrayMethods = Object.create(oldArrayProtoMethods);
    let methods = [
        "push",
        "pop",
        "shift",
        "unshift",
        "reserve",
        "sort",
        "splice"
    ];
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
                    inserted = args;
                    break;
                case 'splice': // vue.$set原理
                    inserted = args.slice(2); // arr.splice(0,1,{a:1})从地0个开始增加一个{a:1}
            }
            // 给数组新增的值也要观测
            if (inserted) {
                ob.observerArray(inserted);
            }
            return result;
        };
    });

    /*
     * @Descripttion: 
     * @Author: 黄佳佳
     * @Date: 2021-01-16 17:45:35
     * @LastEditors: 黄佳佳
     * @LastEditTime: 2021-01-16 18:04:15
     */
    // 自己定义的代理数据方法
    function proxy(vm, data, key) {
        console.log(vm[data][key]);
        Object.defineProperty(vm, key,{
            get() {
                return vm[data][key]; // vm._data.a --> vm.a
            },
            set(newValue) {
                vm[data][key] = newValue; // vm._data.a = 1  --> vm.a = 1
            }
        });
    }
    function defineProperty(target, key, value) {
        // Object.defineProperty(value,'__ob__',{
        Object.defineProperty(target,key,{
            enumerable: false, // 不能被枚举，不能被循环出来
            configurable: false,
            // value: this // 把当前的实例定义在value上，方便在数组劫持的js中使用写在对象观测js中的observerArray方法
            value
        });
    }
    // 是否是对象 true：对象  false: 不是对象
    function isObject(data) {
        return typeof data == "object" && data != null
    }
    // 是否是数组 true：数组  false: 不是数组
    function isArray(data) {
        return Array.isArray(data)
    }

    /*
     * @Descripttion: 数据劫持，把数据变成响应式的数据
     * @Author: 黄佳佳
     * @Date: 2021-01-16 15:02:01
     * @LastEditors: 黄佳佳
     * @LastEditTime: 2021-01-16 18:04:29
     */
    // 检测数据的类
    class Observer {
        constructor(value){
            //判断一个对象是否被观测过，看是都有__ob__这个属性
            defineProperty(value,'__ob__',this);

            if(isArray(value)){
                // push shift  unshifyt  splice sort reserve pop这些方法会改变数组、函数劫持
                // 当值为数组的时候，劫持
                value.__proto__ = arrayMethods;
                // 观测数组中的对象类型，当数组的值为对象的时候 [{a:1}],更改arr[0].a = 100的时候
                this.observerArray(value);
            } else {
                // 使用defineProperty  重新定义属性
                this.walk(value);
            }
        }
        observerArray(value){
            value.forEach(item => {
                observer(item); // 观测数组中的每一项
            });
        }
        walk(data){
            let keys = Object.keys(data); // 获取对象key
            keys.forEach(key => {
                defineReactive(data, key, data[key]); // 
            });
        }
    }

    // 数据劫持
    function defineReactive(data, key, value) {
        //递归 {a:{a:1}}
        observer(value);
        Object.defineProperty(data, key, {
            get(){
                console.log("1111");
                return value
            },
            set(newValue){
                console.log("22222");
                if(newValue == value) return;
                observer(value); // 用户设置的值还是对象的话那就继续监控
                value = newValue;
            }
        });
    }
    // 检测的data 必须是object  但是不能是null
    function observer(data) {
        // 检测的data不是对象，直接返回,typeof null == "object"
        if(!isObject()) {
            console.log("bubuu");
            return data
        }
        // 如果被检测过就不用再检测了
        if(data.__ob__){
            return data
        }
        // 检测的data是对象，处理
        return new Observer(data)
    }

    /*
     * @Descripttion: 初始化状态的文件
     * @Author: 黄佳佳
     * @Date: 2021-01-16 14:25:15
     * @LastEditors: 黄佳佳
     * @LastEditTime: 2021-01-16 17:56:32
     */
    function initState(vm){
        const opts = vm.$options;
        if(opts.props);
        if(opts.methods);
        if(opts.data){
            initData(vm);
        }
        if(opts.computed);
        if(opts.watch);
    }

    function initData(vm) {
        let data = vm.$options.data;
        // 判断data是否是对象，data.call是因为如果是个函数执行的话
        // vm._data代理当前的data的返回值
        vm._data = data = typeof data == "function" ? data.call(vm) : data;
        // console.log(data) // {a:1}
        // 数据的劫持方案，对象object.definproperty,数组 单独处理

        // 代理数据 vm._data.a  -->  vm.a
        for (let key in data) {
            // 自己写的代理方法
            proxy(vm, '_data', key);
        }

        observer(data);
    }

    /*
     * @Descripttion: 初始化插件，插件都是一个函数，扩展初始化文件
     * @Author: 黄佳佳
     * @Date: 2021-01-16 11:18:11
     * @LastEditors: 黄佳佳
     * @LastEditTime: 2021-01-16 14:56:49
     */
    // 初始化， vue是构造函数
    function initMixin(Vue) {
        // 给vue原型上增加一个初始化的扩展方法 _init
        Vue.prototype._init = function (options) {
            const vm = this;
            vm.$options = options;
            // 初始化状态（将数据做一个初始化的劫持，当改变数据的时候应该更新试图）
            // vue组件中有很多状态 data  props watch computed 
            initState(vm);
        };
    }

    function Vue(options){
        this._init(options); // 入口方法，做初始化操作
    }
    // 初始化的插件
    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
