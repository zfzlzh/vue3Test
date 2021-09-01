<template>
    <div class="transfer-box">
        <!-- 左边 -->
        <transferBoxItem 
            class="transfer-box-left"
            :title="leftTitle"
            v-model="leftData"
            :list="leftList"
            ref="leftBox"
            :listHeight="leftListHeight"
        >
        <template #other="{item}">
            <slot name="left" :item="item"></slot>
        </template>
        </transferBoxItem>
        <!-- 按钮与右边,可复数 -->
        <div class="transfer-box-center-right" ref="boxCenterRight">
            <div class="transfer-box-center-right-item" v-for="(item,index) in acceptBoxList" :key="index">
                <!-- 按钮 -->
                <div class="center-btn">
                    <div class="to-left btn-item" @click="transferTo('left',index)">
                        <el-icon :size="14" fill="#fff">
                            <arrow-left-bold />
                        </el-icon>
                    </div>
                    <div class="to-right btn-item" @click="transferTo('right',index)">
                        <el-icon :size="14" fill="#fff">
                            <arrow-right-bold />
                        </el-icon>
                    </div>
                </div>
                <!-- 右边 -->
                <transferBoxItem 
                    class="transfer-box-right"
                    :title="item.title"
                    v-model="item.data"
                    :list="item.list"
                    :ref="el=>{rightBoxObj[index] = el}"
                >
                <template #other="{item}">
                    <slot name="right" :item="item"></slot>
                </template>
                </transferBoxItem>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,watch ,computed,unref} from 'vue'
import { ArrowLeftBold,ArrowRightBold } from '@element-plus/icons'
import transferBoxItem from '@/views/transferBox/components/transferBoxItem.vue'
export default defineComponent({
    components:{
        transferBoxItem,
        ArrowLeftBold,
        ArrowRightBold
    },
    props:{
        leftTitle:{
            type:String,
            default:''
        },
        data:{
            type:Array,
            default:()=>[]
        },
        modelValue:{
            type:Object,
            default:()=>[]
        },
        rightBoxList:{
            type:Array,
            default:()=>[]
        }
    },
    emits:['update:modelValue','change'],
    setup(props,ctx){
        const leftBox:any = ref(null)
        const boxCenterRight:any = ref(null)
        let rightBoxObj:any = ref({})
        const state = reactive({
               acceptBoxList:[] as any,
               leftList:[] as Array<string>,
               leftData:[] as Array<string>,
        })
        const methods = reactive({
            // 左右传输
              transferTo(dire:string,index:number){
                    let toListOld = dire == 'right' ? state.acceptBoxList[index].list : state.leftList
                    let fromListOld = dire == 'right' ? state.leftList : state.acceptBoxList[index].list
                    let dataOld = dire == 'left' ? state.acceptBoxList[index].data : state.leftData
                    let filterObj = {toList:toListOld,fromList:fromListOld,data:dataOld}
                    let {toList,fromList} = methods.handlerData(filterObj)
                    state.leftList = dire == 'right' ? fromList : toList
                    state.acceptBoxList[index].list = dire == 'left' ? fromList : toList
                    if(dire == 'left'){
                        state.leftData = []
                    }
                    if(dire == 'right'){
                        state.acceptBoxList[index].data = []
                    }
                    // 更新值，change事件
                    let emitData = state.acceptBoxList.reduce((pre:any,val:any)=>{
                        pre[val.sequence] = val.list
                        return pre
                    },{})
                    ctx.emit('update:modelValue',emitData)
                    methods.change(dire,state.acceptBoxList[index],emitData)
              },
              // 操作数据
              handlerData(obj:{toList:any,fromList:any,data:Array<string>}){
                    let {toList,fromList,data} = obj
                    let filterOut:Array<{label:string,value:string}> = []
                    let fromListNew = fromList.filter((val:any)=>{
                        if(data.includes(val.value)){
                            filterOut.push(val)
                        }
                        return !data.includes(val.value)
                    })
                    let toListNew = [...toList,...filterOut]
                    return {toList:toListNew,fromList:fromListNew}
              },
            //   清理
            clearQuery(dire:string,index:number){
                if(['all','left'].includes(dire)){
                    leftBox.value.clear()
                }
                if(dire == 'right'){
                    rightBoxObj.value[index].clear()
                }
                if(dire == 'all'){
                    Object.values(rightBoxObj.value).forEach((val:any)=>{
                        val.clear()
                    })
                }
            },
            change(dire:string,rightBox:any,emitData:any){
                ctx.emit('change',emitData,dire,rightBox)
            }
        })
        let leftListHeight = computed(() => {
                if(!rightBoxObj.value[0]?.header && !rightBoxObj.value[0]?.filter){
                    return
                }
                let header = rightBoxObj.value[0].header.offsetHeight
                let filter = rightBoxObj.value[0].filter.offsetHeight
                let centerRight = boxCenterRight.value.offsetHeight
                let width = centerRight - header - filter
                return width + 'px'
        })
        //监听传入右边数据
        watch(() => props.rightBoxList,(newVal:any)=>{
            state.acceptBoxList = newVal.reduce((pre:Array<{label:string,value:string,sequence:number}>,item:{label:string,value:string},index:number) => {
                return [...pre,{...item,sequence:index}]
            },[]);  
            // 获取所有右边的数据
            const allCheckedList = computed(()=>{
                let list = state.acceptBoxList.map((val:any)=>{
                    return val.data
                })
                return list.flat()
            })
            // 将左边的数据进行过滤，去除右边的数据
            state.leftList = props.data.filter((val:any,index:number)=>{
                val.sequence = index
                return !allCheckedList.value.includes(val.value)
            }) as Array<string>
            
        },{deep:true})
        // 计算左边的高度，右边的高度*右边的个数 + （个数 - 1）* 间距
        
        
        return {
           ...toRefs(state),
           ...toRefs(methods),
           leftListHeight,
           leftBox,
           rightBoxObj,
           boxCenterRight
        }
    }
})
</script>
<style lang='scss' scoped>
.transfer-box{
    @extend .flexBox;
}
.transfer-box-left{

}
.transfer-box-center-right{
    @extend .flexBox;
    @include flexColumn;
    @include overSpread;
    .transfer-box-center-right-item{
        width:20vw;
        margin-bottom:1vh;
        @extend .flexBox;
        &:last-child{
            margin-bottom:0
        }
        .center-btn{
            width:calc( 100% - 13vw);
            @extend .flexCenter;
            @include flexColumn;
            .btn-item{
                --btn-size:5vh;
                width:var(--btn-size);
                height:var(--btn-size);
                @include circleDiv;
                @extend .flexCenter;
                background:var(--theme-color);
                @include cursor;
                transition:all .1s linear;
                &:hover{
                    background:var(--theme-hover-color)
                }
                &:first-child{
                    margin-bottom:1vh
                }
                .el-icon{
                    color:var(--theme-font-color)
                }
            }
        }
        .transfer-box-right{

        }
        
    }
}

</style>