<template>
    <div class="sum-card">
        <header class="header">
            <div class="title">{{title}}</div>
            <div class="time" :class="timeType">{{time}}</div>
        </header>
        <article class="body">
            <div class="now-data">{{nowData}}</div>
            <div class="icon">
                <i :class="icon"></i>
            </div>
        </article>
        <footer class="footer">
            <div class="sum-title">{{sumTitle}}</div>
            <div class="sum-data">{{sumData}}</div>
        </footer>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs } from 'vue'
export default defineComponent({
    components:{
        
    },
    setup(){
        const state = reactive({
                   title:'',
                   timeType:'',
                   nowData:'',
                   sumTitle:'',
                   sumData:'',
                   icon:''
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
.sum-card{
    border-radius:4px;
    height: 18vh;
    width: 19vw;
    @include boxShadowAround
}
.header,.body,.footer{
    @extend .flexBetCenter;
    padding:0 10px
}
</style>