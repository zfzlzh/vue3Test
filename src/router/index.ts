import { createRouter, createWebHashHistory ,Router} from 'vue-router'
import login from '../views/login/login.vue'
import container from '../views/container/container.vue'
const routes = [
	{
		path: "/",
		name: "home",
		meta: { title: "登录" },
		redirect: { name: "login"},
		component: login,
	},
	{
		path: "/login",
		component: login,
		name: "login",
		meta: { title: "登录" },
	},
	{
		path: "/container",
		component: container,
		name: "container",
		meta: { title: "主体" },
		children:[
			{
				path: "/homeIndex",
				component: ()=> import('../views/homeIndex/index.vue'),
				name: "homeIndex",
				meta: { title: "首页" },
			},
			{
				path: "/editor/flowPathEditor",
				component: () => import('../views/flowPathEditor/index.vue'),
				name: "flowPathEditor",
				meta: { title: "流程编辑器" },
			},
			{
				path: "/editor/customPageEditor",
				component: () => import('../views/customPageEditor/index.vue'),
				name: "customPageEditor",
				meta: { title: "自定义页面编辑器" },
			},
			{
				path: "/report/customReport",
				component: () => import('../views/customReport/index.vue'),
				name: "customReport",
				meta: { title: "自定义报表" },
			}
		]
	},
]
const router: Router = createRouter({
	history: createWebHashHistory(),
	routes
})
export default router