<template>
	 <div class="login flexBox">
	    <!-- 左边 -->
	    <div class="login-left">
	      <div></div>
	    </div>
	    <!-- 右边 -->
	    <div class="login-right">
			<div class="global-change">
				<changeLanguage></changeLanguage>
				<changeColorTheme></changeColorTheme>
			</div>
			<div class="flexCenter login-div">
				<!-- 登录框 -->
				<el-form ref="cartForm" :rules="rules" :model="cart" class="demo-ruleForm login-line">
					<el-form-item>
						<div class="login-text flexCenter">{{$t('message.loginTitle')}}</div> 
					</el-form-item>
					<el-form-item prop="userName">
						<el-input
						v-model="cart.userName"
						autocomplete="off"
						readonly
						onfocus="this.removeAttribute('readonly',true);"
						onblur="this.setAttribute('readonly',true);"
						class="userInput"
						:placeholder="$t('message.userNameTip')"
						@keyup.enter="toLogin(cartForm)"
						/>
					</el-form-item>
					<el-form-item prop="password">
						<el-input
						v-model="cart.password"
						class="userInput"
						type="password"
						:placeholder="$t('message.passwordTip')"
						@keyup.enter="toLogin(cartForm)"
						/>
					</el-form-item>
					<el-form-item prop="">
						<div class="flexCenter pwdDiv">
						<div class="rememberPwd flexCenter cursorP" @click="remPwd = !remPwd">
							<div class="check-div flexCenter"><i v-show="remPwd" class="el-icon-check checkIcon" /></div>
							<div class="check-label">{{$t('message.rememberPwd')}}</div>
						</div>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button class="to-btn" type="primary" @keyup.enter="toLogin" @click="toLogin(cartForm)">{{$t('message.login')}}</el-button>
					</el-form-item>
					<el-row />
				</el-form>
			</div>
	    </div>
	</div>
</template>

<script lang="ts">
	interface login{
		userName:string,
		password:string
	}
	interface rules{
		userName:Array<rulesItem>,
		password:Array<rulesItem>
	}
	interface rulesItem{
		required:Boolean,
		message:string,
		trigger:string
	}
	interface setForm{
		title:string
	}
	interface state{
		cart:login,
		rules:rules,
		remPwd:Boolean,
		cartForm:null,
		setForm:setForm
	}
	import { defineComponent ,ref, reactive,onMounted,computed,nextTick,watch,toRefs,getCurrentInstance } from 'vue'
	import md5 from 'js-md5'
	import { useRoute, useRouter } from "vue-router"
	import { useStore } from 'vuex'
	import { ElMessage } from "element-plus"
	import {useI18n} from "vue-i18n"
	import changeLanguage from '@/components/changeLanguage/changeLanguage.vue'
	import changeColorTheme from '@/components/changeColorTheme/changeColorTheme.vue'
	export default defineComponent({
		components:{
			changeLanguage,
			changeColorTheme
		},
		setup(){
			const {t} = useI18n()
			const logoIcon:any = computed(()=>{
				return window.innerWidth <= 1366 ? '../../../static/img/loginBackFontSmall.png' : '../../../static/img/loginBackFont.png';
			})
			const state:state = reactive({
				cart:{
				  userName: "",
				  password: ""
				},
				/*规则*/
				rules: {
				  userName: [{ required: true, message: t('message.userNameTip'), trigger: "blur" }],
				  password: [{ required: true, message: t('message.passwordTip'), trigger: "blur" }]
				},
				remPwd: ref(false),
				cartForm:ref(null),
				setForm:{
					title:''
				}
			})
			
			const internalInstance:any = getCurrentInstance()
			let prototype:any = internalInstance.appContext.config.globalProperties
			let router = useRouter()
			let store = useStore()
			//方法
			const methods = reactive({
				toLogin(myRef:any) {
					myRef.validate((valid:Boolean) => {
						if (valid) {
							if (state.remPwd == true) {
								localStorage.setItem("nalcoUser", JSON.stringify(state.cart));
							} else if (state.remPwd == false && localStorage.getItem("nalcoUser")) {
								localStorage.removeItem("nalcoUser");
							}
							methods.login(null)
						} else {
							return false;
						}
					});
				},
				login(obj:login | null){
					let userName = obj ? obj.userName : state.cart.userName
					let password = obj ? obj.password : md5(state.cart.password)
					// prototype.$RequestUtil.post({
					// 	url: "/user/auth/login",
					// 	params: {
					// 		username:userName,
					// 		password
					// 	},
					// 	success: (data:Object) => {
					// 		router.push({path:'\home'})
					// 	},
					// 	error: () => {
					// 	}
					// });
					router.push({path:'/homeIndex'})
					store.commit('pushTabs',{title:'首页',index:'/homeIndex'})
				}
			})
			return {
				...toRefs(state),
				...toRefs(methods),
				logoIcon
			}
		},
		
	}) 
</script>

<style lang="scss" scoped>
.login{
	height:100vh;
	.login-left{
		width:65%
	}
	.login-right{
		width:35%;
		@include flexColumn;
		.global-change{
			height:3vh;
			padding: 0 1vw;
			@extend .flexVerCenter;
			@include jc-end;
		}
		.login-div{
			height:calc(100% - 3vh);
			.login-text{
				font-size: 3vh
			}
			.login-line{
				width: 17vw;
    			height: 46vh;
				.to-btn{
					width: 100%;
				}
				.check-div{
					width: 15px;
					height: 15px;
					border: 1px solid #ccc;
					margin-right: .4vw;
				}
			}
		}
	}
}
</style>
