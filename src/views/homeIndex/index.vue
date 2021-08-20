<template>
    <div id='homeIndex'>
        <div class=""></div>
    </div>
</template>
<script>
import { defineComponent,reactive,ref,toRefs } from 'vue'
export default defineComponent({
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