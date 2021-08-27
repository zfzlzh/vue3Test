<template>
	<div class="header-top flexBetCenter">
		<div class="header-top-left">
			<bread></bread>
		</div>
		<div class="header-top-right flexBox">
			<!-- 切换语言 -->
			<changeLanguage></changeLanguage>
			<!-- 切换颜色 -->
			<changeColorTheme></changeColorTheme>
			<!--头像  -->
			<div class="header-pic">
				<el-badge :value="badgeValue" class="badgeitem">
					<img :src="headerPic" alt="" class="pic" />
				</el-badge>
			</div>
			<!-- 登出 -->
			<div class="flexVerCenter">
				<el-dropdown>
				  <span class="el-dropdown-link">
					<span>{{loginName}}</span>
				    <i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item icon="el-icon-s-custom">{{$t('message.message')}}</el-dropdown-item>
				      <el-dropdown-item icon="el-icon-switch-button"> 
						  {{$t('message.loginOut')}}
					  </el-dropdown-item>
				    </el-dropdown-menu>
				  </template>
				</el-dropdown>
			</div>
		</div>
	</div>
	<div class="header-bottom">
		
	</div>
	
</template>

<script lang="ts">
	import bread from '../bread/bread.vue'
	import {defineComponent,computed,reactive,toRefs} from 'vue'
	import changeLanguage from '@/components/changeLanguage/changeLanguage.vue'
	import changeColorTheme from '@/components/changeColorTheme/changeColorTheme.vue'
	export default defineComponent({
		name:'headerDiv',
		components:{
			bread,
			changeLanguage,
			changeColorTheme
		},
		setup(){
			let uploadHeaderPic:string
			let headerPic = computed(()=>{
				return uploadHeaderPic ? uploadHeaderPic : '../../../static/img/basic_header_pic.png'
			})
			const state = reactive({
				loginName:'admin'
			})
			return {
				...toRefs(state),
				headerPic
			}
		},
		
	}) 
</script>

<style lang="scss">
	.header-top-left{
		// background:$blue
	}
	.header-top-right{
		&>div{
			margin-right: 1.5vh;
			&:last-child{
				margin-right:0
			}
		}
		.header-pic{
			height: 4vh;
    		width: 4vh;
			.pic{
				@include overSpread;
				border-radius:50%
			}
		}
	}
	.badgeitem.el-badge{
		height:100%;
		@include flex;
		@include ai-center
	}
	.head-badge-img{
		height:77%
	}
</style>
