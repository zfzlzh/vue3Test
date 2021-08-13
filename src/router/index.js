import {createRouter,createWebHashHistory} from 'vue-router'
import login from '../views/login.vue'
import home from '../components/common/home.vue'
const routes = [
	{
		path: "/",
		name: "登录",
		meta: { title: "登录" },
		redirect:login
	},
	{
		path: "/login",
		component: login,
		name: "登录",
		meta: { title: "登录" },
	},
	{
		path: "/home",
		component: home,
		name: "主页",
		meta: { title: "主页" },
		children:[
			
		]
	}
]
export default createRouter({
	history:createWebHashHistory(),
	routes
})