<template>
    <div class="transfer-box-item">
        <div class="header" ref="header">
            <el-checkbox 
                :indeterminate="isIndeterminate"
                v-model="checkAll" 
                @change="handleCheckAllChange"
            >
                {{title}}
            </el-checkbox>
            <span class="totalAndActived">
                <span>{{activedNum}}</span>
                <span>/</span>
                <span>{{total}}</span>
            </span>
        </div>
        <div class="filter" ref="filter">
            <el-input 
                v-model="filterData" 
                placeholder="" 
                prefix-icon="el-icon-search"
                clearable
                ref="search"
            >
            </el-input>
        </div>
        <div class="list" :style="listHeight ? 'height:' + listHeight : ''">
            <el-checkbox-group v-model="checkData"  @change="handleChecked" class="check-list" >
                <el-checkbox 
                    v-for="item in filterCheckList" 
                    :label="item.value" 
                    :key="item.value" 
                >
                    <slot name="other" :item="item">
                        <span>{{item.label}}</span>
                    </slot>
                </el-checkbox>
                
            </el-checkbox-group>
        </div>
    </div>
</template>
<script lang='ts'>
import { computed, defineComponent,reactive,ref,toRefs,watch ,unref} from 'vue'
export default defineComponent({
    props:{
        title:{
            type:String,
            default:''
        },
        modelValue:{
            type:Array,
            default:()=>[]
        },
        list:{
            type:Array,
            default:()=>[]
        },
        listHeight:{
            type:String,
            default:''
        },
    },
    emits:['update:modelValue'],
    setup(props,ctx){
        const search:any = ref(null)
        const header:any= ref(null)
        const filter:any= ref(null)
        const state = reactive({
              filterData:'',
              checkList:[],
              checkData:[] as Array<string>,
              checkAll:false,
              isIndeterminate:true,
        })
        // 
        let checkAllData = computed(() => {
            return state.checkList.map((val:{value:string,label:string})=>{
                return val.value
            })
        })
        // 输入关键字过滤
        let filterCheckList = computed(() => {
            state.checkData = []
            let list = ['','null','undefined'].includes(state.filterData + '') ? state.checkList : methods.filterList()
            return list.sort((a:any,b:any):any => {
                return a.sequence - b.sequence
            }) as any
        })
        // 总条数
        let total = computed(() => {
            return filterCheckList.value.length
        })
        // 选中的个数
        let activedNum = computed(() => {
            methods.handleChecked(state.checkData)
            return state.checkData.length
        })
        // 监听传入的已选项
        watch(() => props.modelValue,(newVal:any) => {
            state.checkData = newVal
            
        },{deep:true})
        // 监听传入的数据列表
        watch(()=>props.list,(newVal:any) => {
            state.checkList = newVal.reduce((pre:any,item:any)=>{
                return [...pre,{...item}]
            },[])
        },{deep:true})

        const methods = reactive({
            // 点击全选
              handleCheckAllChange(val:Array<string>){
                state.checkData = val && checkAllData.value ? checkAllData.value : [];
                state.isIndeterminate = false;
                ctx.emit('update:modelValue',state.checkData)
              },
            //   点击选项，判断是否全选
              handleChecked(val:Array<string>){
                  let len = val.length
                  let listLen = state.checkList.length
                  state.checkAll = len == listLen && len + listLen != 0
                  state.isIndeterminate = len > 0 && len < listLen
                  ctx.emit('update:modelValue',val)
              },
            //   过滤数据
              filterList(){
                  ctx.emit('update:modelValue',state.checkData)
                  let list = state.checkList.filter((val:{label:string,value:string}) => {
                      return val.label.toUpperCase().indexOf(state.filterData.toUpperCase()) > -1
                  })
                  return list
              },
            //   清除
              clear(){
                  search.value.clear()
              }
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           checkAllData,
           filterCheckList,
           total,
           activedNum,
           search,
           header,
           filter
        }
    }
})
</script>
<style lang='scss' scoped>
@mixin paddingVer15{
    padding:0 15px
}
.transfer-box-item{
    --transfer-item-width:13vw;
    width: var(--transfer-item-width);
    border:1px solid #ccc;
    border-radius:4px;
    .header{
        height: 5vh;
        @extend .flexBetCenter;
        @include paddingVer15;
        background:#f5f7fa;
        border-bottom:1px solid #ccc;
        width:var(--transfer-item-width);
        @include borderBox;
        .totalAndActived{
            font-size: 1.2vh;
            color: #888;
        }
        :deep(.el-checkbox__input){
            font-size:2vh;
            font-weight: 600;
        }
    }
    .filter{
        padding: 15px;
        height: 7vh;
        width:var(--transfer-item-width);
        @include borderBox;
        :deep(.el-input__inner){
            --transfer-filter-height: 32px;
            border-radius:calc(var(--transfer-filter-height) / 2);
            height:var(--transfer-filter-height)
        }
    }
    .list{
        height: var(--transfer-box-list-height);
        overflow: auto;
        width:var(--transfer-item-width);
        @include paddingVer15;
        @include borderBox;
        .check-list{
            @include overSpread
        }
        .el-checkbox{
            width: 100%;
            margin-right: 0;
            display: inline-flex;
            margin-bottom:1vh;
            @include ai-center;
            &:last-child{
                margin-bottom:0
            }
            :deep(.el-checkbox__label){
                width:89%;
                @include inlineFlex;
                @include jc-bet;
                &>span{
                    display: inline-block;
                    text-align: left;
                }
            }
        }
    }
}
</style>