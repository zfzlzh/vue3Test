<template>
    <div id="changeColorTheme" class="flexVerCenter">
        <el-dropdown @command="changeColor">
            <span class="el-dropdown-link">
                <span class="color-rect"></span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item 
                        v-for="item in colorList" 
                        :key="item.value"
                        :command="item"
                    >
                        <div class="flexCenter">
                            <span :style="calcColor(item.value)" class="drop-down-color"></span>
                            <span class="drop-down-label">{{item.label}}</span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,computed } from 'vue'
import color from '@/components/changeColorTheme/json/color.json'
interface item{
    value:string,
    label:string,
}
export default defineComponent({
    setup(){
        const state = reactive({
               colorList:[
                   {label:'蓝色',value:'blue'},
                   {label:'红色',value:'red'},
                   {label:'绿色',value:'green'},
                   {label:'天蓝色',value:'skyBlue'},
               ],
        })
        const methods = reactive({
               changeColor(command:item){
                   let nowTheme = color[command.value]
                   document.documentElement.style.setProperty('--theme-color', nowTheme.color);
                   document.documentElement.style.setProperty('--theme-border-color', nowTheme.borderColor);
                   document.documentElement.style.setProperty('--theme-font-color', nowTheme.fontColor);
                   document.documentElement.style.setProperty('--theme-focus-color', nowTheme.focusColor);
                   document.documentElement.style.setProperty('--theme-focus-border-color', nowTheme.focusBorderColor);
                   document.documentElement.style.setProperty('--theme-focus-font-color', nowTheme.focusFontColor);
               }
        })
        const calcColor = computed(()=>{
            return (val:string)=>{
                return `background:${color[val].color}` 
            }
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           calcColor
        }
    }
})
</script>
<style lang='scss' scoped>
@mixin rect{
    width:2vh;
    height:2vh;
}
.color-rect{
    @include rect;
    background:var(--theme-color)
}
:deep(.el-dropdown-link){
    @include inlineFlex;
    @include ai-center
}
:deep(.el-dropdown-menu__item){
    @include inlineFlex;
    @include jc-start
}
.drop-down-color{
    @include rect;
    margin-right:15px
}
.drop-down-label{
    text-align: left;
}
</style>