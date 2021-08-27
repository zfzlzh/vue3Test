<template>
  <div id="bread-div">
    <div id="bread-content">
      <el-breadcrumb class="bread-offest" separator="|">
        <el-breadcrumb-item class="bread-first">
			{{currentPath}}
		</el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="item in breadList"
		  :key="item.sequence"
          class="bread-path"
		  :class="item.sequence == 1 ? 'firstPath' : ''"
        >
			{{ item.path }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent,computed,watch,getCurrentInstance,ref,toRefs,reactive} from 'vue'
import { useRouter,useRoute } from "vue-router"
import {useStore} from 'vuex'
import {navbarList} from '../../store/store.d'
interface breadList{
	path:string,
	sequence:number | string,
}
interface state{
	currentPath:string
}
export default defineComponent({
  name:'bread',
	setup(){
		let router = useRouter()
		let route = useRoute()
		let store =  useStore()
		const internalInstance:any = getCurrentInstance()
		let prototype:any = internalInstance.appContext.config.globalProperties
		
		const state:state = reactive({
			currentPath:'',
		})
		const breadList = computed(()=>{
			let nowPath = route.path
			let pathPartVal:Array<string> = nowPath.split("/");
			let children:Array<navbarList> = store.state.navbarList
			let filterPath:string = ""
			let list = pathPartVal.reduce((pre,val,index)=>{
				if(index === 0){
					return pre
				}
				filterPath = filterPath + '/' + val
				let filter = children.filter((item:navbarList) => item.index == filterPath)[0]
				let path = filter?.title || '无该页面'
				children = filter?.children || []
				if(index == pathPartVal.length -1){
					state.currentPath = filter.title
				}
				return [...pre,{
					path,
					sequence:index + 1
				}] 
			},[] as Array<breadList>)
			return list
		} )
		return {
			...toRefs(state),
			breadList,
		}
	} 
	
	
});
</script>

<style type="text/css" scoped>
#bread-div {
  height: 35px;
  position: relative;
  background-color: #ffffff;
  border-bottom: #e4e4e4 1px;
  vertical-align: bottom;
  font-family: Arial,"SimHei","Helvetica Neue", Helvetica, Arial, "PingFang SC",sans-serif
}
#bread-content {
  height: 35px;
}
#bread-margin-bottom {
  height: 20px;
}
.bread-offest {
  margin-left: 30px;
  line-height: 30px;
  display: flex;
  align-items: baseline;
  vertical-align: bottom;
}
.bread-first {
  font-size: 20px;
  color: #434343 !important;
  font-weight: 500;
}

.firstPath {
  font-weight: 400 !important;
}

@media screen and (max-width: 1366px) {
  .bread-first {
    font-size: 16px;
  }
  .firstPath {
    font-size: 12px;
  }
}
</style>
<style>
.el-breadcrumb__separator {
  font-weight: 400;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-weight: 500 !important;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-weight: 700 !important;
  text-decoration: none;
  -webkit-transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: #409eff !important;
}

@media screen and (max-width: 1366px) {
  .el-breadcrumb__item {
    font-size: 12px;
  }
}
</style>
