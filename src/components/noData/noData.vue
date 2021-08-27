<template>
    <div class="no-data" :class="bgColor">
        <span>{{noDataRemark}}</span>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,computed } from 'vue'
export default defineComponent({
    props:{
        bgColor:{
            type:String,
            default:'white'
        },
        remark:{
            type:String,
            default:''
        }
    },
    setup(props){
        const state = reactive({
                                
        })
        const methods = reactive({
                                  
        })
        const noDataRemark = computed(()=>{
            return props.remark || '暂无数据'
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           noDataRemark
        }
    }
})
</script>
<style lang='scss' scoped>
.no-data{
    @include overSpread;
    @extend .flexCenter;
    font-size:2vh;
    &.white{
        color:#888
    }
    &.black{
        color:#ccc
    }
}
</style>