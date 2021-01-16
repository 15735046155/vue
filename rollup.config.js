/*
 * @Descripttion: rollup配置
 * @Author: 黄佳佳
 * @Date: 2021-01-16 10:48:40
 * @LastEditors: 黄佳佳
 * @LastEditTime: 2021-01-16 10:58:30
 */
import babel  from "rollup-plugin-babel"
import serve  from "rollup-plugin-serve"

export default {
    input:"./src/index.js", // 入口，以这个入口打包 new Vue
    output: {
        format:"umd", //模块化类型 esmodule commonjs模块
        name: 'Vue', //全局变量名字(打包出来的全局名字)
        file:"dist/umd/vue.js",
        sourcemap: true
    },
    plugin:[
        babel({
            exclude: "node_modules/**" // node_modules里边的文件不转化
        }),
        serve({
            open:true,
            port:3000,
            contentBase:"", // 打开的目录以哪个为基准，空字符串表示以当前目录为准
            openPage:"/index.html" // 打开页面是谁
        })
    ]
}