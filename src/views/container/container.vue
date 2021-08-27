<template>
	<el-container>
		<el-aside>
			<navbar></navbar>
		</el-aside>
		<el-container>
			<el-header>
				<headerDiv></headerDiv>
			</el-header>
			<el-main>
				<mainwin></mainwin>
			</el-main>
		</el-container>
	</el-container>
</template>

<script lang="ts">
import headerDiv from '@/components/header/headerDiv.vue'
import navbar from '@/components/navbar/navbar.vue'
import mainwin from '@/components/mainwin/mainwin.vue'
import {defineComponent} from 'vue'
	export default defineComponent({
		components:{
			headerDiv,
			navbar,
			mainwin
		}
	})
	
</script>

<style lang="scss" scoped>
.el-container{
	height:100vh
}
.el-header{
	--el-header-height:40px
}
.el-aside{
	--el-aside-width:11vw
}
.el-header{
	box-shadow: 0px 0px 7px 2px rgba(0, 0, 0,.3);
}
</style>
