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
    <div class="tabs-content">
        <router-view v-slot="{Component,route}">
            <transition name="fade-slide" mode="out-in" appear>
                <keep-alive :key="key" :include="$store.state.tabsNameList">
                    <component :is="Component"></component>
                </keep-alive>
            <!-- <component :is="Component" :key="key" ></component> -->
            </transition>
        </router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent,computed,reactive,toRefs,watch } from "@vue/runtime-core";
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {tabs} from '../../store/store.d'
export default defineComponent({
    name:'mainwin',
    setup(){
        let store = useStore()
        let router = useRouter()
        let route = useRoute()
        const state = reactive({
            editableTabs:computed(()=>{
                return store.state.tabs || []
            }),
            editableTabsValue: computed(() => {
                return store.state.activeTabs || '/homeIndex'
            })
        })
        const methods = reactive({
            removeTabs(index:string){
                let title = store.state.tabs.filter((val:tabs)=>{
                    return val.index == index
                })
                let removeIndex = store.state.tabsIndexList.indexOf(index)
                store.commit('fitlerTabs',{index,title})
                let listLen = store.state.tabsIndexList.length
                //清除最后一个tabs时自动添加首页并显示
                let activeIndex:number = removeIndex - 1 < 0 ? listLen > 0 ? removeIndex + 1 : -1 : removeIndex - 1
                //关闭当前显示页时
                //list不为空数组，且清除的tabs时第一个时，取后面一个，是空数组，显示首页，不是空数组，移除的也不是第一个，取前面一个
                if(index == state.editableTabsValue){
                    let nowIndex:string = activeIndex == -1 ? 
                                            '/homeIndex' : 
                                            state.editableTabs[activeIndex].index
                    if(activeIndex == -1){
                        store.commit('pushTabs',{index:'/homeIndex',title:'首页'})
                    }
                    store.commit('getActiveTabs',nowIndex)
                    router.push({path:nowIndex})
                }
            },
            clickTabs(tab:any){
                let index = tab.props.name
                router.push({path:index})
                store.commit('getActiveTabs',index)
            }
        })
        const key = computed(()=>{
            return useRoute().path + new Date()
        })
        // const isKeepAlive = computed(()=>{
        //     console.log(route)
        //    return store.state.tabsIndexList.includes(route.path)
        // })
        return {
            key,
            ...toRefs(state),
            ...toRefs(methods)
        }
    }
})
</script>

<style scoped lang="scss">
.el-tabs{
    height:5vh
}
:deep(.el-tabs__item){
    height:32px;
    line-height: 32px;
}
.tabs-content{
    height:calc(100% - 5vh)
}
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.3s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
