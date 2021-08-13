import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import RequestUtil from './utils/RequestUtil.js'
import Global from './components/js/global.js'
let app = createApp(App)
console.log(router)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$RequestUtil = RequestUtil
app.config.globalProperties.$Global = Global
app.mount('#app')
