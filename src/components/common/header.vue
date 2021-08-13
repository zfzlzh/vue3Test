<template>
	<div class="header-top flexBox">
		<div class="header-top-left">
			<bread></bread>
		</div>
		<div class="header-top-right">
			<!--下发接口信息  -->
			<div class="">
				<el-badge :value="badgeValue" class="badgeitem">
					<img class="head-badge-img" src="../../../static/img/20200317170320.png" @click="badgeClick">
				</el-badge>
			</div>
			<!-- 登出 -->
			<div class="">
				<el-dropdown class="cs-mr" :show-timeout="50" @command="handleCommand">
					<span class="btn-text">
					<!-- {{ loginName }}
						<i class="el-icon-arrow-down el-icon--right" /> -->
					<div class="head-pic">
						<img class="head-pic-img" :src="loginPic">
					</div>
					</span>
					<el-dropdown-menu slot="dropdown">
					<el-dropdown-item disabled>{{ loginName }}</el-dropdown-item>
					<el-dropdown-item command="logOut" divided>登出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
	<div class="header-bottom">
		
	</div>
	
</template>

<script lang="ts">
	import bread from './bread.vue'
	import {defineComponent} from 'vue'
	export default defineComponent({
		components:{
			bread
		}
	}) 
</script>

<style lang="scss">
</style>
