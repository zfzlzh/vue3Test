<template>
  <div id="bread-div">
    <div id="bread-content">
      <el-breadcrumb class="bread-offest" separator="|">
        <el-breadcrumb-item class="bread-first">
			{{currentPath}}
		</el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="isShowFirstPath"
          class="bread-path firstPath"
        >
			{{ showFirstPath }}
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="isShowSecondPath"
          :to="firstPath"
          class="bread-path"
          :class="{ activepath: secondLevel }"
        >
			{{ showSecondPath }}
		</el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="isShowThirdPath"
          class="bread-path"
          :class="{ activepath: thridLevel }"
        >
			{{ showThirdPath }}
		</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script lang="ts">
import {computed,watch,getCurrentInstance,ref,relative} from 'vue'
import { useRouter } from "vue-router"
export default {
	setup(){
		let router = useRouter()
		let { proxy } = getCurrentInstance()
		
		
		let nowPath = ref('/home');
		let lastPath = ref('');
		
		watch(router,(newVal,oldVal) => {
			nowPath = newVal
			lastPath = oldVal
		})
		console.log(nowPath)
		let pathPart = ref(nowPath.value.split("/"));
		let pathPartVal = pathPart.value
		let isShowFirstPath = computed(() => {
			return pathPartVal.length > 1;
		})
		
		let isShowSecondPath =computed(() => {
		  return pathPartVal.length > 2;
		}) 
		
		const secondLevel:Boolean = ref(false)
		const thridLevel:Boolean = ref(false)
		let isShowThirdPath = computed(() => {
			console.log('pathPart',pathPart)
		  if (pathPartVal.length > 3) {
		    secondLevel.value = false;
		    thridLevel.value = true;
		    return true;
		  } else {
		    secondLevel.value = true;
		    thridLevel.value = false;
		    return false;
		  }
		})
		
		const currentPath:String = ref("")
		const firstPath:String = ref("")
		const secondPath:String = ref("")
		const thirdPath:String = ref("")
		let showFirstPath = computed(() => {
		  if (pathPartVal.length > 1) {
		    firstPath.value = '/' + pathPartVal[1]
		    currentPath.value = proxy.$Global.MENU[pathPartVal[1]];
		    if(pathPartVal[2]){
		      firstPath.value = '/' + pathPartVal[1] + '/' + pathPartVal[2]
		    }
		    return proxy.$Global.MENU[pathPartVal[1]]
		  }
		}) 
		let showSecondPath = computed(()=>{
		  if (pathPartVal.length > 2) {
		    secondPath.value = '/' + pathPartVal[1] + '/' + pathPartVal[2]
		    currentPath.value = proxy.$Global.MENU[pathPartVal[2]];
		    return proxy.$Global.MENU[pathPartVal[2]];
		  }
		}) 
		let showThirdPath = computed(() => {
		  if (pathPartVal.length > 3) {
		    thirdPath.value = "/Home";
		    currentPath .value= proxy.$Global.MENU[pathPartVal[3]];
		    return proxy.$Global.MENU[pathPartVal[3]]
		  }
		}) 
		return {
			secondLevel,
			thridLevel,
			currentPath,
			firstPath,
			secondPath,
			thirdPath,
			isShowFirstPath,
			isShowThirdPath,
			isShowThirdPath,
			showFirstPath,
			showSecondPath,
			showThirdPath,
		}
	}
	
	
};
</script>

<style type="text/css" scoped>
#bread-div {
  height: 52px;
  position: relative;
  background-color: #ffffff;
  border-bottom: #e4e4e4 1px;
  vertical-align: bottom;
  font-family: Arial,"SimHei","Helvetica Neue", Helvetica, Arial, "PingFang SC",sans-serif
}
#bread-content {
  height: 52px;
}
#bread-margin-bottom {
  height: 20px;
}
.bread-offest {
  margin-left: 30px;
  line-height: 52px;
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
