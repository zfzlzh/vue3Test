<template>
	<div class="header-top flexBetCenter">
		<div class="header-top-left">
			<bread></bread>
		</div>
		<div class="header-top-right flexBox">
			<!--下发接口信息  -->
			<div class="">
				<el-badge :value="badgeValue" class="badgeitem">
					<img class="head-badge-img" src="../../../static/img/20200317170320.png" @click="badgeClick">
				</el-badge>
			</div>
			<!-- 登出 -->
			<div class="">
				<el-dropdown>
				  <span class="el-dropdown-link">
					  <div class="flexBox">
						  <img :src="headerPic" alt="" class="header-pic" />
						  <p class="loginName"></p>
					  </div>
				    <i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <template #dropdown>
				    <el-dropdown-menu>
				      <el-dropdown-item icon="el-icon-avatar">信息</el-dropdown-item>
				      <el-dropdown-item icon="el-icon-switch-button"> 
						  登出
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
	import {defineComponent,computed} from 'vue'
	export default defineComponent({
		setup(){
			let uploadHeaderPic
			let headerPic = computed(()=>{
				return uploadHeaderPic ? uploadHeaderPic : '../../../static/img/header_pic.png'
			})
		},
		components:{
			bread
		}
	}) 
</script>

<style lang="scss">
	.header-top-left{
		// background:$blue
	}
</style>
