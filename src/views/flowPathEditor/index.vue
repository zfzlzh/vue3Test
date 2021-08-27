<template>
    <div class="flowPathEditor">
        <div class="icon-choice">
            <showScrollbar :key="'all' + Math.random() * 1000">
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
import iconInfo from '@/views/flowPathEditor/compoments/iconInfo.vue'
import lineTitleRect from '@/components/lineTitleRect/lineTitleRect.vue'
import {useI18n} from "vue-i18n"
import * as zrender from 'zrender'
import zrenderTool from '@/components/zrender/zrenderTool.js'
export default defineComponent({
    name:'flowPathEditor',
    components:{
        showScrollbar,
        iconInfo,
        lineTitleRect
    },
    setup(){
        const {t} = useI18n()
        let {init,draw,clickShapes,saveChartData,clickShapesItem} = zrenderTool()
        const state = reactive({
               fileList:[],
               iconListBasic:[
                   {index:1,icon:'zhixian',type:'polyline'},
                   {index:2,icon:'yuancircle46',type:'circle'},
                   {index:3,icon:'juxing',type:'rect'},
                   {index:4,icon:'quxian',type:'bezier'},
                   {index:5,icon:'tuoyuan',type:'ellipse'},
                   {index:6,icon:'polygon',type:'polygon'},
               ],
               iconListCustom:[

               ],
               basicShapes:t('message.basicShapes'),
               customShapes:t('message.customShapes'),
               clickShapes:clickShapes,
               clickShapesId:''
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
            }
        })
        nextTick(()=>{
            init.value()
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
        height:49%;
        &:first-child{
            margin-bottom:.75rem
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
    @include cursor
}
.icon-info{
    width:17%;
    border:1px solid #ccc;
    border-left:none
}
</style>