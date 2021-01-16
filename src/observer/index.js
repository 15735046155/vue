/*
 * @Descripttion: 数据劫持，把数据变成响应式的数据
 * @Author: 黄佳佳
 * @Date: 2021-01-16 15:02:01
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 18:04:29
 */

import { arrayMethods } from "./array";
import { defineProperty, isObject, isArray } from "../util"
// 检测数据的类
class Observer {
    constructor(value){
        //判断一个对象是否被观测过，看是都有__ob__这个属性
        defineProperty(value,'__ob__',this)

        if(isArray(value)){
            // push shift  unshifyt  splice sort reserve pop这些方法会改变数组、函数劫持
            // 当值为数组的时候，劫持
            value.__proto__ = arrayMethods;
            // 观测数组中的对象类型，当数组的值为对象的时候 [{a:1}],更改arr[0].a = 100的时候
            this.observerArray(value)
        } else {
            // 使用defineProperty  重新定义属性
            this.walk(value)
        }
    }
    observerArray(value){
        value.forEach(item => {
            observer(item) // 观测数组中的每一项
        });
    }
    walk(data){
        let keys = Object.keys(data); // 获取对象key
        keys.forEach(key => {
            defineReactive(data, key, data[key]); // 
        })
    }
}

// 数据劫持
function defineReactive(data, key, value) {
    //递归 {a:{a:1}}
    observer(value)
    Object.defineProperty(data, key, {
        get(){
            console.log("1111")
            return value
        },
        set(newValue){
            console.log("22222")
            if(newValue == value) return;
            observer(value) // 用户设置的值还是对象的话那就继续监控
            value = newValue
        }
    })
}
// 检测的data 必须是object  但是不能是null
export function observer(data) {
    // 检测的data不是对象，直接返回,typeof null == "object"
    if(!isObject()) {
        console.log("bubuu")
        return data
    }
    // 如果被检测过就不用再检测了
    if(data.__ob__){
        return data
    }
    // 检测的data是对象，处理
    return new Observer(data)
}