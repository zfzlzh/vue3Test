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
		name: "主体",
		meta: { title: "主体" },
		children:[
			{
				path: "/homeIndex",
				component: ()=> import('../views/homeIndex/index.vue'),
				name: "首页",
				meta: { title: "首页" },
			},
			{
				path: "/editor/flowPathEditor",
				component: () => import('../views/flowPathEditor/index.vue'),
				name: "流程编辑器",
				meta: { title: "流程编辑器" },
			}
		]
	},
]
const router: Router = createRouter({
	history: createWebHashHistory(),
	routes
})
export default router