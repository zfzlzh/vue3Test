<template>
    <div class="logo"></div>
     <el-menu
      :uniqueOpened="true"
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="selectNavbar"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-scrollbar>
        <subMenu v-for="item in navbarList" :key="item.index" :item="item" ></subMenu>
      </el-scrollbar>
    </el-menu>
</template>

<script>
import subMenu from '@/components/navbar/components/subMenu.vue'
import { defineComponent,reactive,computed,toRefs } from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default defineComponent({
  name:'navbar',
  components:{
    subMenu,
  },
  setup(){
    const state = reactive({
      navbarList:[
        {index:'/homeIndex',title:'首页',children:[]},
        {index:'/editor',title:'编辑器',children:[
          {index:'/editor/flowPathEditor',title:'流程编辑器',children:[]},
          {index:'/editor/flowPathView',title:'流程图查看',children:[]},
        ]},
        {index:'/report',title:'报表',children:[
          {index:'/report/customReport',title:'自定义报表',children:[]},
        ]},
        {index:'/components',title:'组件',children:[
          {index:'/components/transferBox',title:'穿梭框',children:[]}
        ]},
      ],
    })
    let route = useRoute()
    const activeMenu = computed(()=>{
      return route.path
    })
    let router = useRouter()
    let store = useStore()
    store.commit('getNavbarList',state.navbarList)
    const methods = reactive({
      handleOpen(){},
      handleClose(){},
      selectNavbar(index,indexPath,item){
          router.push({path:index})
          store.dispatch('handlerTabs',{title:item.route,index})
          store.commit('getActiveTabs',index)
          console.log('store',store.state)
      },
    })
    return {
      activeMenu,
      ...toRefs(methods),
      ...toRefs(state),
    }
  }
})
</script>

<style scoped lang="scss">
.el-menu{
  height:100%
}
</style>
