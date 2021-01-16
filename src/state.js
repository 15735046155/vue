import { observer } from "./observer/index.js";
import { proxy } from "./util.js";

/*
 * @Descripttion: 初始化状态的文件
 * @Author: 黄佳佳
 * @Date: 2021-01-16 14:25:15
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 17:56:32
 */
export function initState(vm){
    const opts = vm.$options;
    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethods(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}
function initProps(vm) {};
function initMethods(vm) {};

function initData(vm) {
    let data = vm.$options.data;
    // 判断data是否是对象，data.call是因为如果是个函数执行的话
    // vm._data代理当前的data的返回值
    vm._data = data = typeof data == "function" ? data.call(vm) : data
    // console.log(data) // {a:1}
    // 数据的劫持方案，对象object.definproperty,数组 单独处理

    // 代理数据 vm._data.a  -->  vm.a
    for (let key in data) {
        // 自己写的代理方法
        proxy(vm, '_data', key)
    }

    observer(data)
};
function initComputed(vm) {};
function initWatch(vm) {};
