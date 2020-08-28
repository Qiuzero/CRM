axios.defaults.baseURL = 'http://localhost:8888'; //配置请求的基本路径

//数据已表单的形式提交
axios.defaults.headers['Content-type'] = 'application/x-www-form-urlencoded';

axios.defaults.transformRequest = function (data) {
    if (!data) return data;
    let result = '';
    for (let attr in data) {
        if (!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;

    }
    return result.substring(1);
}
//配置请求拦截器
axios.interceptors.request.use(config => {
    return config
})
//配置相应拦截器
axios.interceptors.response.use(response => {
    return response.data;
}, reason => {
    //console.log(reason);
    if (reason.response) {
        switch (String(reason.response.status)) {
            case "404":
                alert('当前请求的地址不存在')
                break;
            default:
                break;
        }
    }
    return Promise.reject(reason);

})