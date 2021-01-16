/*
 * @Descripttion: 初始化插件，插件都是一个函数，扩展初始化文件
 * @Author: 黄佳佳
 * @Date: 2021-01-16 11:18:11
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 14:56:49
 */
import { initState } from "./state"
// 初始化， vue是构造函数
export function initMixin(Vue) {
    // 给vue原型上增加一个初始化的扩展方法 _init
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        // 初始化状态（将数据做一个初始化的劫持，当改变数据的时候应该更新试图）
        // vue组件中有很多状态 data  props watch computed 
        initState(vm);
    }
}