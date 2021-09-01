<template>
    <div class="flowPathEditor">
        <div class="icon-choice">
            <showScrollbar :key="'all' + Math.random() * 1000">
                <lineTitleRect
                    :title="shapesTool"
                >
                    <template v-slot:content>
                        <div class="icon-list">
                            <showScrollbar :key="'tool' + Math.random() * 1000">
                                <div class="scroll-div flexWrap">
                                    <div 
                                        class="icon-list-item" 
                                        v-for="item in iconListTool" 
                                        :key="item.index" 
                                        @click="toolHandler(item.type)"
                                        :title="item.alt"
                                        :class="activedTool == item.type && ['delete'].includes(item.type) ? 'actived' : ''"
                                    >
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="'#icon-' + item.icon"></use>
                                        </svg>
                                    </div>
                                </div>
                            </showScrollbar>
                        </div>
                    </template>
                </lineTitleRect>
                <lineTitleRect
                    :title="basicShapes"
                >
                    <template v-slot:content>
                        <div class="icon-list">
                            <showScrollbar :key="'basic' + Math.random() * 1000">
                                <div class="scroll-div flexWrap">
                                    <div 
                                        class="icon-list-item" 
                                        v-for="item in iconListBasic" 
                                        :key="item.index" 
                                        @click="draw(item.type)"
                                        :title="item.alt"
                                    >
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="'#icon-' + item.icon"></use>
                                        </svg>
                                    </div>
                                </div>
                            </showScrollbar>
                        </div>
                    </template>
                </lineTitleRect>
                <lineTitleRect
                    :title="customShapes"
                >
                    <template v-slot:content>
                        <div class="icon-list flexWrap hasOther">
                            <showScrollbar :key="'custom' + Math.random() * 1000">
                                <div  class="scroll-div">
                                    <div 
                                    class="icon-list-item" 
                                    v-for="item in iconListCustom" 
                                    :key="item.index"
                                    draggable="true"
                                    >
                                        <img :src="item.icon">
                                    </div>
                                </div>
                            </showScrollbar>
                        </div>
                        <el-upload
                            class="upload"
                            ref="upload"
                            action=""
                            accept=".png, .jpg, .bmp, .gif,.jpeg"
                            method="post"
                            :on-change="changeImg"
                            :before-upload="beforeUpload"
                            :file-list="fileList"
                            multiple
                            :limit="3"
                            :show-file-list="false"
                            :auto-upload="false"
                            :http-request="uploadIcon"
                        >
                            <el-button size="small" type="primary">{{$t('message.upload')}}</el-button>
                        </el-upload>
                    </template>
                </lineTitleRect>
            </showScrollbar>
        </div>
        <div class="editor" id="zrender">
            <!-- <canvas class="editor-canvas" ></canvas> -->
        </div>
        <div class="icon-info">
            <iconInfo
                :showForm="clickShapes"
                :clickShapesItem="clickShapesItem"
                @saveInfo="saveInfo"
            >
            </iconInfo>
        </div>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,nextTick,computed,watch } from 'vue'
import showScrollbar from '@/components/scrollbar/showScrollbar.vue'
import iconInfo from '@/views/flowPathEditor/components/iconInfo.vue'
import lineTitleRect from '@/components/lineTitleRect/lineTitleRect.vue'
import {useI18n} from "vue-i18n"
import * as zrender from 'zrender'
import zrenderTool from '@/components/zrender/zrenderTool.js'
import { ElMessage } from 'element-plus'
export default defineComponent({
    name:'flowPathEditor',
    components:{
        showScrollbar,
        iconInfo,
        lineTitleRect
    },
    setup(){
        const {t} = useI18n()
        let {
            init,
            draw,
            clickShapes,
            saveChartData,
            clickShapesItem,
            exportJson,
            toCanvas,
            changeDeleteState,
            saveData
        } = zrenderTool()
        const state = reactive({
               fileList:[],
               iconListBasic:[
                   {index:1,icon:'zhixian',type:'polyline',alt:t('message.polyline')},
                   {index:2,icon:'yuancircle46',type:'circle',alt:t('message.circle')},
                   {index:3,icon:'juxing',type:'rect',alt:t('message.rect')},
                   {index:4,icon:'quxian',type:'bezier',alt:t('message.bezier')},
                   {index:5,icon:'tuoyuan',type:'ellipse',alt:t('message.ellipse')},
                   {index:6,icon:'polygon',type:'polygon',alt:t('message.polygon')},
               ],
               iconListCustom:[

               ],
               iconListTool:[
                   {index:1,icon:'fuzhi',type:'copy',alt:t('message.copy')},
                   {index:2,icon:'ico_niantiejiankongrenwu',type:'paste',alt:t('message.paste')},
                   {index:3,icon:'shanchu',type:'delete',alt:t('message.delete')},
                   {index:4,icon:'json',type:'exportJson',alt:t('message.exportJson')},
                   {index:5,icon:'tupian',type:'exportImg',alt:t('message.exportImg')},
                   {index:6,icon:'shizijiahao3',type:'keepHorVer',alt:t('message.keepHorVer')},
                   {index:7,icon:'save',type:'save',alt:t('message.save')},
               ],
               basicShapes:t('message.basicShapes'),
               customShapes:t('message.customShapes'),
               shapesTool:t('message.shapesTool'),
               clickShapes:clickShapes,
               clickShapesId:'',
               needDelete:false,
               activedTool:''
        })
        watch(clickShapesItem,(newVal:any)=>{
            if(state.clickShapesId == newVal.id){
                return
            }
            state.clickShapesId = newVal.id
        },{deep:true})
        const methods = reactive({
            changeImg(file:Object,fileList:Array<Object>){

            },
            beforeUpload(file:Object){

            },
            uploadIcon(){},
            saveInfo(setForm:any){
                saveChartData.value(state.clickShapesId,setForm)
            },
            toolHandler(type:string){
                switch(type){
                    case 'exportJson':
                        exportJson.value()
                        break
                    case 'exportImg':
                        toCanvas.value()
                        break
                    case 'delete':
                        state.needDelete = !state.needDelete
                        changeDeleteState.value(state.needDelete)
                        state.activedTool = state.activedTool == 'delete' ? '' : 'delete'
                        if(state.needDelete){
                            ElMessage({
                                message:'点击图形进行删除',
                                type:'info'
                            })
                        }
                        break
                    case 'save':
                        saveData.value()
                        break
                    default:
                        break
                }
            },
        })
        nextTick(()=>{
            let json = {}
            let dom = document.getElementById('zrender')
            init.value(json,dom,'edit')
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           draw,
           saveChartData,
           clickShapesItem
        }
    }
})
</script>
<style lang='scss' scoped>
.flowPathEditor{
    @include overSpread;
    @extend .flexBox;
}
.icon-choice{
    width: 15%;
    padding-right: 1vh;
    :deep(.line-title-rect){
        height:24%;
        margin-bottom:.75rem;
        &:last-child{
            height:48.3%;
            margin-bottom:0
        }
    }
    .upload{
        height: 3.4vh;
        @extend .flexCenter;
        :deep(.el-upload){
            width:90%;
            .el-button{
                width:100%
            }
        }
    }
}
.icon-list{
    padding:10px;
    height: 36.2vh;
    &.hasOther{
        height: 31.5vh;
    }
}
.editor{
    width:68%;
    .editor-canvas{
        @include overSpread
    }
    border:1px solid #ccc
}
.scroll-div{
    @include jc-bet
}
.icon-list-item{
    height: 5vh;
    width: 5vh;
    // border:1px solid #ccc;
    @extend .flexCenter;
    margin-bottom:1.5vh;
    @include cursor;
    &.actived{
        background:#ccc
    }
}
.icon-info{
    width:17%;
    border:1px solid #ccc;
    border-left:none
}
</style>