<template>
    <div v-show="false" class="resize-listen" ref="resizeListen"></div>
    <div :id='echarts' v-if="chartData?.legnth != 0" class="echarts">
    </div>
    <noData v-else></noData>
</template>
<script lang='ts'>
import { defineComponent,reactive,ref,toRefs,computed,getCurrentInstance,watch,nextTick,onMounted } from 'vue'
import noData from '@/components/noData/noData.vue'
import {onResize,offResize} from '../../../utils/divResize.js'
import {onBeforeRouteUpdate} from 'vue-router'
interface y{
    name:string,
    data:Array<Array<string | number>>
}
export default defineComponent({
    components:{
        noData
    },
    props:{
        chartData:{
            type:Object,
            default:()=>{}
        },
        type:{
            type:String,
            default:'line'
        }
    },
    setup(props){
        const internalInstance:any = getCurrentInstance()
        let prototype:any = internalInstance.appContext.config.globalProperties
        const echarts = computed(()=>{
            return 'echarts' + Math.random() * 100000
        })
        const state = reactive({
               myChart:'' as any
        })
        const methods = reactive({
              drawChart(){
                  let dom = document.getElementById(echarts.value) 
                  state.myChart = prototype.$echarts.getInstanceByDom(dom);
                  if(!state.myChart){
                      state.myChart = prototype.$echarts.init(dom)
                      let unit = props.chartData?.unit || ''
                      let text = props.chartData?.name + unit || '' + unit
                      state.myChart.setOption({
                            title:{
                                text,
                                left:10,
                                top:10
                            },
                      })
                  }
                  let first = props.type.slice(0,1).toUpperCase()
                  //类型为“string”的表达式不能用于索引类型--解决方法，添加as keyof typeof obj名称
                  let font = 'draw' + first + props.type.slice(1) as keyof typeof methods
                  //font不加as keyof typeof obj名称 会有错误，不能保证传入的font与methods中的key都符合
                  methods[font]()
              },
              lineOrBar(){
                  let y = props.chartData?.y || []
                  let selfOption = props.chartData?.option
                  let type = props.chartData?.type || 'line'
                  let left = methods.calcLeft()
                  let option = {
                    xAxis: {
                        type: 'category',
                        data:props.chartData?.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid:{
                        right:10,
                        left
                    },
                    tooltip:{

                    },
                    series:y.map((val:y)=>{
                        return {
                            type,
                            data:val.data,
                            name:val.name
                        }
                    })
                  }
                  option = selfOption ? {...option,...selfOption} : option
                  state.myChart.setOption(option)
              },
              drawLine(){
                  methods.lineOrBar()
              },
              drawPie(){
                  let {data,secondType,name,roseType,ringRadius,center,option:selfOption} = props.chartData
                  let option = {
                      tooltip:{
                      },
                      series:[
                          {
                              type:'pie',
                              data,
                              roseType:secondType == 'rose' ? roseType ? roseType : true : false,
                              name,
                              radius:secondType == 'ring' ? ringRadius?.length == 2 ? ringRadius : ['80%','100%'] : [0, '75%'],
                              center:center?.length == 2 ? center : ['50%','50%'],
                              labelLine:{
                                  show:false
                              },
                              label:{
                                  position:secondType == 'ring' ? 'center' : 'inside',
                                  color:'#fff'
                              }
                          }
                      ]
                  }
                  option = selfOption ? {...option,...selfOption} : option
                  state.myChart.setOption(option)
              },
              drawBar(){
                  methods.lineOrBar()
              },
              calcLeft(){
                  let data = prototype.$_.cloneDeep(props.chartData?.y)  || []
                  let sort = data.length == 0 ? 6 : data.reduce((pre:number,item:y)=>{
                      let sortList = item.data?.sort((a:Array<string | number>,b:Array<string | number>)=>{return Number(a[1]) - Number(b[1])})
                      let sortLen = String(sortList[0][1]).length
                      return pre < 6 ? 6 : sortLen > pre ? sortLen : pre
                  },0)
                  return sort * 10
              },
              resizeChart(){
                  if(state.myChart){
                      state.myChart.resize()
                  }
              }
        })
        
       watch(props.chartData,(newVal)=>{
            nextTick(()=>{
                methods.drawChart()
            })
            
        },{
            deep:true,
            immediate:true
        })
        const resizeListen = ref(null)
        nextTick(()=>{
            onResize(resizeListen.value,methods.resizeChart)
        })
        onBeforeRouteUpdate((to,from)=>{
            offResize(resizeListen.value,methods.resizeChart)
        })
        return {
           ...toRefs(state),
           ...toRefs(methods),
           echarts,
           resizeListen
        }
    }
})
</script>
<style lang='scss' scoped>
.echarts{
    @include overSpread
}
.resize-listen{
    @include overSpread
}
</style>