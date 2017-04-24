/**
 * Created by truncate on 2017/4/19.
 * 网络请求插件 引入了toast 加载提示
 */

import methodMap from './methodMap'
import AxiosInst from './axios'

class Http {

}

Http.install = function (Vue) {

    /**
     * 全局请求接口
     * @param method 方法
     * @param opts 参数
     * @param toast 是否提示
     * @returns {string}
     */
    Vue.prototype.request = function (method, opts, toast) {
        //如果有给 toast 参数则显示 loading 加载数据
        if(toast) {
            Vue.prototype.$loading("加载中")
        }
        let m = methodMap[method]
        if (m) {
            var opts_type = typeof(opts);
            if (opts_type == null || opts_type != 'object') {
                opts = {}
            }
            if(m.method == 'get') {
                return Vue.prototype.apiGet(m.url, opts)
            } else if(m.method == 'post') {
                return Vue.prototype.apiPost(m.url, opts)
            } else {
                return "非法请求";
            }

        } else {
            closeLoading()
            console.log("url 错误", "返回结果：err = ", "无法请求，无效的请求！", "\n")
        }
    }

    /**
     * POST 请求 无提示
     * @param url 请求URL
     * @param data 请求数据
     * @returns {Promise}
     */
    Vue.prototype.apiPost = function(url, data) {
        return new Promise((resolve, reject) => {
            AxiosInst.post(url, data).then((response) => {
                if(response.data == null) {
                    console.log("接口输出异常...")
                    this.$Message.error("接口输出异常...")
                    setTimeout(() => closeLoading(), 800)
                    return
                }
                setTimeout(() => closeLoading(), 800)
                resolve(response.data)
            }).catch((response) => {
                console.log('Customize Notice', response)
                closeLoading()
                reject(response)
            })
        })
    }

    /**
     * GET 请求 无提示
     * @param url 请求URL
     * @param data 请求数据
     * @returns {Promise}
     */
    Vue.prototype.apiGet = function(url, data) {
        return new Promise((resolve, reject) => {
            AxiosInst.get(url, {
                params: data
            }).then((response) => {
                if(response.data == null) {
                    console.log("接口输出异常...")
                    this.$Message.error("接口输出异常...")
                    return
                }
                //延迟关闭
                setTimeout(() => closeLoading(), 800)
                resolve(response.data)
            }).catch((response) => {
                console.log('Customize Notice', response)
                closeLoading()
                reject(response)
            })
        })
    }

    /**
     * 关闭方法
     */
    function closeLoading() {
        Vue.prototype.$loading.close()
    }
}

export default Http
