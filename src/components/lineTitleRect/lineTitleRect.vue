<template>
    <div class="line-title-rect">
        <header class="icon-title">
            <span>{{title}}</span>
        </header>
        <slot name="content"></slot>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs } from 'vue'
export default defineComponent({
    props:{
        title:{
            type:String,
            default:''
        }
    },
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
.line-title-rect{
    border:1px solid #ccc;
    height:100%;
}
// border-right:1px solid #ccc;
.icon-title{
    font-size: 15px;
    text-align: left;
    height: 4vh;
    color:var(--theme-color);
    @extend .flexVerCenter;
    position:relative;
    padding: 0 10px;
    &::after{
        content:'';
        // border-bottom:1px solid;
        --linear-color:var(--theme-color);
        position: absolute;
        width:90%;
        height:1px;
        bottom:0;
        background-image: linear-gradient(to right ,var(--linear-color),transparent);
    }
}
</style>