<template>
    <!-- 有下级 -->
    <el-submenu :index="menuItem.index" v-if="menuItem && menuItem.children && menuItem.children[0]">
      <template #title>
        <i :class="menuItem.icon"></i>
        <span>{{menuItem.title}}</span>
      </template>
      <subMenu 
        v-for="child in menuItem.children" 
        :key="child.index" 
        :item="child"
      />
    </el-submenu>
    <!-- 无下级 -->
    <el-menu-item :index="menuItem.index" v-else :route="item.title">
      <i :class="menuItem.icon"></i>
      <template #title>{{menuItem.title}}</template>
    </el-menu-item>
</template>
<script>
import { defineComponent,reactive,inject,toRefs } from 'vue'
export default defineComponent({
    name:'subMenu',
    props:{
        item:{
            type:Object,
            default:()=>{}
        }
    },
    setup(props){
        const menuItem = reactive(props.item)
        const methods = reactive({
            
        })
        return {
            ...toRefs(methods),
            menuItem
        }
    }
})
</script>
<style lang='scss' scoped>
.el-menu-item,:deep(.el-submenu__title){
    text-align: left;
}
</style>