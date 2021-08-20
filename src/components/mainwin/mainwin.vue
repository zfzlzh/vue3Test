<template>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTabs" @tab-click="clickTabs">
        <el-tab-pane
            :key="item.index"
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :name="item.index"
        >
        </el-tab-pane>
    </el-tabs>
    <router-view :key="key" v-slot="{Component}">
        <keep-alive>
            <component :is="Component" v-if="isOpenMenus.includes($route.path)"></component>
        </keep-alive>
        <component :is="Component" v-if="!isOpenMenus.includes($route.path)"></component>
    </router-view>
</template>

<script>
import { defineComponent,computed,reactive,toRefs } from "@vue/runtime-core";
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default defineComponent({
    setup(){
        let store = useStore()
        let router = useRouter()
        const state = reactive({
            editableTabs:store.state.tabs,
            editableTabsValue:store.state.activeTabs || '/homeIndex'
        })
        const methods = reactive({
            removeTabs(index){
                store.commit('fitlerTabs',index)
                state.editableTabs = state.editableTabs.filter(val =>  val.index != index)
                if(state.editableTabs.length == 0){
                    router.push({path:'/homeIndex'})
                    store.commit('pushTabs',{index:'/homeIndex',title:'首页'})
                    state.editableTabs.push({index:'/homeIndex',title:'首页'})
                    store.commit('getActiveTabs','/homeIndex')
                }
            },
            clickTabs(tab){
                let index = tab.props.name
                router.push({path:index})
                store.commit('getActiveTabs',index)
            }
        })
        const key = computed(()=>{
            return useRoute.path + new Date()
        })
        const isOpenMenus = computed(()=>{
            return store.state.tabs.filter(val => val.index)
        })
        return {
            key,
            isOpenMenus,
            ...toRefs(state),
            ...toRefs(methods)
        }
    }
})
</script>

<style>
</style>
