<template>
	<el-container>
		<el-header>
			<headerDiv></headerDiv>
		</el-header>
		<el-aside>
			
		</el-aside>
		<el-main>
			
		</el-main>
	</el-container>
</template>

<script lang="ts">
import headerDiv from './header.vue'
import {defineComponent} from 'vue'
	export default defineComponent({
		components:{
			headerDiv
		}
	})
	
</script>

<style lang="scss" scoped>
</style>
