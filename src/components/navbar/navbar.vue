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
          {index:'/editor/flowPathEditor',title:'流程编辑器',children:[]}
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
          store.dispatch('pushTabs',{title:item.route,index})
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
