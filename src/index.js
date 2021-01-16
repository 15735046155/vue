import { initMinxin } from "./init"

/*
 * @Descripttion: vue的入口，类编写， 用于扩展vue原型文件
 * @Author: 黄佳佳
 * @Date: 2021-01-16 10:49:45
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 14:55:43
 */
import { initMixin } from "./init"

function Vue(options){
    this._init(options); // 入口方法，做初始化操作
}
// 初始化的插件
initMixin(Vue)

export default Vue