<template>
    <div ref='flowPathView' class="flow-path-view">
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs ,onMounted} from 'vue'
import { useI18n } from 'vue-i18n'
import * as zrender from 'zrender'
import zrenderTool from '@/components/zrender/zrenderTool.js'
export default defineComponent({
    setup(){
        const { calcRatios,init,group } = zrenderTool()
        let flowPathView:any = ref(null)
        const state = reactive({
             width:'',
             height:'',
             ratios:{x:'',y:''},
             addJson:{}
        })
        const methods = reactive({
             
        })
        onMounted(()=>{
            let json:any = localStorage.getItem('flowPath') ? localStorage.getItem('flowPath') : '{}'
            state.addJson = JSON.parse(json)
            state.width = flowPathView.value.offsetWidth
            state.height = flowPathView.value.offsetHeight
            console.log(json)
            init.value(state.addJson,flowPathView.value,'view')
            console.log(group)
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           flowPathView
        }
    }
})
</script>
<style lang='scss' scoped>
.flow-path-view{
    @include overSpread
}
</style>