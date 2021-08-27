<template>
    <div class="top">
        <!-- 表格 -->
        <!-- <p>{{$t('message.shapesSet')}}</p> -->
        <div class="form-list" v-show="showForm">
            <showScrollbar>
                <el-form ref="setform" :model="setForm">
                    <el-form-item 
                        v-for="item in formList" 
                        :key="item.prop" 
                        :prop="item.prop" 
                        :label="item.label + '：'" 
                        :label-width="calcWidth"
                    >
                        <el-input 
                            v-model="setForm[item.prop]" 
                            placeholder="" 
                            v-if="item.type == 'input'"
                            class="form-list-input"
                            size="small"
                        >
                        </el-input>
                        <el-select 
                            v-model="setForm[item.prop]" 
                            placeholder="" 
                            v-else-if="item.type == 'select'"
                            class="form-list-input"
                            clearable
                        >
                            <el-option
                                v-for="item in item.data"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-color-picker 
                            v-model="setForm[item.prop]" 
                            v-else-if="item.type == 'color'"
                            class="form-list-input"
                        >
                        </el-color-picker>
                        <el-input-number 
                            v-model="setForm[item.prop]" 
                            :precision="item.precision ? item.precision : 0" 
                            :step="item.step" 
                            :max="item.max" 
                            :min="item.min"
                            size="small"
                            v-else-if="item.type == 'numberInput'"
                            class="form-list-input"
                        >
                        </el-input-number>
                    </el-form-item> 
                </el-form>
            </showScrollbar>
        </div>
        <div class="btn" v-show="showForm">
            <el-button type="primary" size="small" @click="saveInfo">{{$t('message.save')}}</el-button>
        </div>
    </div>
    <!-- 缩略图 -->
    <div class="bottom">
        <!-- <p>{{$t('message.miniMap')}}</p> -->
        <canvas class="mini-map"></canvas>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs ,computed,getCurrentInstance,watch} from 'vue'
import showScrollbar from '@/components/scrollbar/showScrollbar.vue'
export default defineComponent({
    components:{
        showScrollbar
    },
    props:{
        showForm:{
            type:Boolean,
            default:false
        },
        clickShapesItem:{
            type:Object,
            default:()=>{}
        }
    },
    setup(props,ctx){
        const internalInstance:any = getCurrentInstance()
        let prototype:any = internalInstance.appContext.config.globalProperties
        // let clickId = props.clickShapesItem?.id
        console.log(props)
        const state = reactive({
              formList:[
                {prop:'title',label:'图形名称',type:'input'},
                {prop:'lineWidth',label:'描边粗细',type:'numberInput',max:10,precision:1,min:0},
                {prop:'stroke',label:'描边颜色',type:'color'},
                {prop:'fill',label:'填充颜色',type:'color'},
                {prop:'text',label:'显示文字',type:'input'},
                {prop:'textFill',label:'文字填充颜色',type:'color'},
                {prop:'textStroke',label:'文字描边颜色',type:'color'},
                {prop:'fontSize',label:'文字大小',type:'numberInput',min:4,precision:1,},
                {prop:'fontWeight',label:'文字加粗',type:'numberInput',max:700,step:50,min:0},
                {prop:'opacity',label:'透明度',type:'numberInput',max:1,step:0.01,precision:2,min:0},
                {prop:'z',label:'图形层级',type:'numberInput',max:100,step:1},
              ],
              setForm:{
                  id:'',
                  title:'',
                  lineWidth:1,
                  stroke:'',
                  fill:'',
                  text:'',
                  textFill:'',
                  textStroke:'',
                  fontSize:4,
                  fontWeight:0,
                  opacity:1,
                  z:1
              }
        })
        const methods = reactive({
               saveInfo(){
                   ctx.emit('saveInfo',state.setForm)
               }
        })
        const calcWidth = computed(()=>{
            let max = state.formList.reduce((pre:number,item:{label:string})=>{
                let len = prototype.$commonUtils.placeholderLength(item.label)
                return pre > len ? pre : len
            },0 as number)
            let width = (max + 1) * 10
            return width + 'px'
        })
        console.log('info',props.clickShapesItem)
        watch(() => props.clickShapesItem,(newVal)=>{
            if(newVal.id == state.setForm.id){
                return
            }
            state.setForm = Object.keys(newVal).reduce((pre:any,item:any)=>{
                let style = newVal.style
                pre[item] = style[item] ? style[item] : newVal[item] ? newVal[item] : pre[item]
                return pre
            },state.setForm as any)
        },{deep:true})
        return {
           ...toRefs(state),
           ...toRefs(methods),
           calcWidth,
        }
    }
})
</script>
<style lang='scss' scoped>
.mini-map{
    @include overSpread
}
.top{
    height:59vh;
    border-bottom: 1px solid #ccc;
    .form-list{
        height:87%
    }
    .btn{
        height:10%;
        .el-button{
            width:80%
        }
    }
}
.bottom{
    height:calc(100% - 59vh)
}
.form-list{
    padding:10px
}
.form-list-input{
    width: 6vw;
}
:deep(.el-color-picker){
    width: 100%;
}
:deep(.el-color-picker__trigger){
    width:95%
}
:deep(.el-form-item__content){
    height:40px
}
</style>