<template>
    <div id=''>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs } from 'vue'
export default defineComponent({
    name:'customPageEditor',
    setup(){
        const state = reactive({
                                
        })
        const methods = reactive({
                                  
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
        }
    }
})
</script>
<style lang='scss' scoped>
</style>