<template>
    <div id=''>
        <div class="flexBetCenter btn-group">
            <el-button type="primary" size="small" @click="clearQuery('left')">{{$t('message.btn1')}}</el-button>
            <div>
                <el-select v-model="model" placeholder="" class="select" size="small">
                    <el-option
                        v-for="(item,index) in acceptBoxList"
                        :key="index"
                        :label="'右边标题' + (index + 1)"
                        :value="index">
                    </el-option>
                </el-select>
                <el-button type="primary" size="small" @click="clearQuery('right',model)">{{$t('message.btn2')}}</el-button>
            </div>
            <el-button type="primary" size="small" @click="clearQuery('all')">{{$t('message.btn3')}}</el-button>
            <el-button type="primary" size="small" @click="getRes">{{$t('message.btn4')}}</el-button>
        </div>
        <div class="flexBox">
            <transferBox
                :rightBoxList="acceptBoxList"
                :data="transferData"
                ref="box"
                class="transfer-box"
                :leftTitle="leftTitle"
                @change="changeTransfer"
                v-model="modelData"
            >
                <template #right="{ item }">
                    <el-tooltip effect="dark" :content="item.label" placement="top" :disabled="needTooltip(item.label)">
                        <span class="label">{{item.label}}</span>    
                    </el-tooltip>
                    <el-button type="primary" size="small" @click="openDialog(item)">slot</el-button>
                </template>
            </transferBox>
            <div class="show-data">
                <pre>{{stringModelData}}</pre>
            </div> 
        </div>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,onMounted, computed ,getCurrentInstance,nextTick} from 'vue'
import transferBox from '@/views/transferBox/components/transferBox.vue'
import {useI18n} from "vue-i18n"
import mockjs from 'mockjs'
interface right{
    title:string,
    data:Array<string>,
    list:Array<{label:string,value:string}>
}
export default defineComponent({
    components:{
        transferBox
    },
    setup(){
        const internalInstance:any = getCurrentInstance()
        let prototype:any = internalInstance.appContext.config.globalProperties
        const {t} = useI18n()
        const state = reactive({
              acceptBoxList:[] as Array<right>,
              transferData:[

              ] as Array<{label:string,value:string}>,
              isShow:false,
              isMounted:false,
              model:'',
              leftTitle:'左边标题',
              modelData:{},
              stringModelData:''
        })
        const box:any = ref(null)
        const methods = reactive({
                 openDialog(item:any){
                     console.log('item',item)
                     state.isShow = true
                 },
                 clearQuery(type:string,index:number){
                     nextTick(()=>{
                         console.log(box)
                         box.value.clearQuery(type,index)
                     })
                 },
                 changeTransfer(model:any,dire:any,changeData:any){
                     console.log(model)
                     console.log(dire)
                     console.log(changeData)
                 },
                 getRes(){
                     state.stringModelData = mockjs.mock(state.modelData)
                     console.log(state.stringModelData)
                     console.log(state.modelData)
                 }
        })
        const needTooltip = computed(() => {
            return (label:string) => {
                if(!state.isMounted){
                    return
                }
                let dom:any = document.getElementsByClassName('label')[0]
                if(!dom){
                    return
                }
                let width:any = dom.offsetWidth
                let style:any = window.getComputedStyle(dom).fontSize
                let fontSize:any = style.match(/\d/ig).join(''),
                    len = label ? prototype.$commonUtils.placeholderLength(label) : 0,
                    maxNum =  Math.floor(width / fontSize) * 2
                let isNeed = len <= maxNum ? true : false
                return isNeed
            }
        })
        onMounted(() => {
            state.acceptBoxList = [
                {title:"右边标题1",data:[],list:[]},
                {title:"右边标题2",data:[],list:[]},
            ]
            for(let i = 0 ; i < 8 ; i ++){
                let obj = i == 7 ? {label:'很长很长很长很长很长很长的选项' + i,value:i + ''} : {label:'选项' + i,value:i + ''}
                state.transferData.push(
                    obj
                )
            }
            state.isMounted = true
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           needTooltip,
           box
        }
    }
})
</script>
<style lang='scss' scoped>
.transfer-box{
    .el-button{
        min-height: 20px;
        padding: 0 15px;
        width: 3vw;
    }
}
.select{
    width: 7vw;
}
.btn-group{
    width: 33vw;
    margin-bottom: 15px;
}
:deep(.transfer-box-item){
    .list{
        .el-checkbox{
            .el-checkbox__label{
                .label{
                    width:calc(100% - 3vw);
                    @include textEllipsis
                }
            }
        }
    }
}
.show-data{
    pre{
        width: 40vw;
        text-align: left;
        padding: 0 5vh;
        // white-space: pre-wrap;
    }
}
</style>