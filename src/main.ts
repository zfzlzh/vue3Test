import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import RequestUtil from './utils/RequestUtil.js'
// import Global from './components/js/Global.js'
import store from './store'
import vuexToSession from './store/vuexToSession'
import i18n from './language'
import * as echarts from 'echarts'
import lodash from 'lodash'
import moment from 'moment'
import '../static/css/theme.scss'
import commonUtils from './utils/commonUtils.js'
let app = createApp(App)

console.log(i18n)
app.use(ElementPlus, {
    i18n: i18n.global.t,
})
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(i18n)
app.config.globalProperties.$RequestUtil = RequestUtil
// app.config.globalProperties.$Global = Global
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$_ = lodash
app.config.globalProperties.$moment = moment
app.config.globalProperties.$commonUtils = commonUtils
vuexToSession(store)
console.log('app',app)
app.mount('#app')
