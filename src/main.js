// 因为webpack.base.conf.js文件的entry是'./src/main.js'
import 'babel-polyfill'

import Vue from 'vue'
import router from './router.js'

import ElementUI from 'element-ui';   // 这里是全部引入, 按需引入需要修改.babelrc文件
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/*import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)*/

import App from './App.vue';
import axios from 'axios'
Vue.prototype.$get=axios.get;  //('/user?ID=12345') 或('/user',{params: { ID:12345 } } )
Vue.prototype.$post=axios.post;  //('/user', {firstName:'Fred', lastName:'Flintstone'} )

// `data` 是作为请求主体被发送的数据
// 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
// 在没有设置 `transformRequest` 时，必须是以下类型之一：
// - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
// - 浏览器专属：FormData, File, Blob
// - Node 专属： Stream
Vue.prototype.$put=axios.put;  //delete('/wz/xxx',{ data: {firstName: 'Fred'} } )
Vue.prototype.$delete=axios.delete;

// 每次请求携带cookies信息
axios.defaults.withCredentials = true
axios.defaults.baseURL='http://localhost:8881'
// //————————————————————————————————————————————————————————————
// // http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     console.log(typeof(config),"--req..this-- ",config);
//     let token = store.state.tagsview.username
//     if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//       config.headers.Authorization = `token ${token}`;
//     }
//     return config;
//   },
//   err => {
//     console.log("request...err");
//     return Promise.reject(err);
//   });
//
// // http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     console.log(typeof(response.data),"--response.data-- ",response.data);
//     return response;
//   },
//   error => {
//     console.log("response...error ",error);
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 返回 401 清除token信息并跳转到登录页面
//           store.commit(types.LOGOUT);
//           router.replace({
//             path: 'login',
//             query: {redirect: router.currentRoute.fullPath}
//           })
//       }
//     }
//     // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//     return Promise.reject(error.response)   // 返回接口返回的错误信息
//   });
// //————————————————————————————————————————————————————————————

import commonMethod from '@/components/commonMethod.vue'
Vue.prototype.$commonFn=commonMethod
import store from '@/store/store.js'
new Vue({
  el:'#app',
  components:{
    App
  },
  router,
  store,
  template:"<App/>",
  data(){
    return {

    }
  }
})
