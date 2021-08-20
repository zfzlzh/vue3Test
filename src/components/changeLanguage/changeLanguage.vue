<template>
    <div id='changeLanguage'>
        <el-dropdown @command="clickLanguage">
            <span class="el-dropdown-link">
                <span>{{language}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item 
                        v-for="item in languageList" 
                        :key="item.value"
                        :command="item"
                    >
                        {{item.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script lang="ts">
import { defineComponent,reactive,ref,toRefs,computed } from 'vue'
import {useI18n} from 'vue-i18n'
interface item{
    value:string,
    label:string,
}
interface state{
    languageList:Array<item>
}
export default defineComponent({
    setup(){
        const {t,locale} = useI18n()
        const state:state = reactive({
               languageList:[
                   {label:'简体中文',value:'zh-cn'},
                   {label:'英文',value:'en'},
               ],
        })
        const methods = reactive({
             clickLanguage(command:item){
                 console.log(command)
                const {value,label} = command
                locale.value = value
                localStorage.setItem('language',value + '_' + label)
             }
        })
        const language = computed(()=>{
            const nowLanguage = state.languageList.filter(val => locale.value == val.value)
            let lang:String = nowLanguage[0]?.label || '简体中文'
            locale.value = nowLanguage.length == 0 ? 'zh-cn' : locale.value
            return lang
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           language
        }
    }
})
</script>
<style lang='scss' scoped>
</style>