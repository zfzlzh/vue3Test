<template>
    <div id='homeIndex'>
        <!-- 总体情况 -->
        <div class="flexBetCenter cards">
            <sumCard 
                v-for="item in cardList" 
                :key="item.title"
            >
            </sumCard>
        </div>
        <!-- 图表 -->
        <div class="charts flexBox">
            <chart
                :chartData="lineChart"
            >
            </chart>
        </div>
        <!-- 小图表 -->
        <div class="charts-small flexBox">
            <div v-for="item in smallChartList" :keys="item.name" class="charts-small-item">
                <chart
                    :chartData="item"
                    :type="item.type"
                >
                </chart>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent,reactive,ref,toRefs,getCurrentInstance } from 'vue'
import {useRoute} from 'vue-router'
import sumCard from '@/views/homeIndex/components/sumCard.vue'
import chart from '@/views/homeIndex/components/chart.vue'
interface monthData{
    x:Array<string>,
    y:Array<Array<string | number>>,
}
export default defineComponent({
    name:'homeIndex',
    components:{
        sumCard,
        chart
    },
    setup(){
        
        const internalInstance:any = getCurrentInstance()
        let prototype:any = internalInstance.appContext.config.globalProperties
        const state = reactive({
               cardList:[
                   {title:'访问量',timeType:'day',nowData:'',sumTitle:'',sumData:'',icon:''},
                   {title:'xxx',timeType:'year',nowData:'',sumTitle:'',sumData:'',icon:''},
                   {title:'ccc',timeType:'month',nowData:'',sumTitle:'',sumData:'',icon:''},
                   {title:'vvv',timeType:'week',nowData:'',sumTitle:'',sumData:'',icon:''},
               ],
               lineChart:{
                   name:'实时访问量',
                   x:['2021-08-24 16:20:00','2021-08-24 16:23:00','2021-08-24 16:26:00','2021-08-24 16:29:00','2021-08-24 16:32:00'],
                   y:[{data:[
                       ['2021-08-24 16:20:00',100],
                       ['2021-08-24 16:23:00',20],
                       ['2021-08-24 16:26:00',20],
                       ['2021-08-24 16:29:00',60],
                       ['2021-08-24 16:32:00',40],
                   ],name:'实时访问量'}]
               },
               smallChartList:[
                   {
                        name:'一周访问量',
                        x:[
                            '周一','周二','周三','周四','周五','周六','周日'
                        ],y:[
                            {
                                data:[
                                    ['周一',20],
                                    ['周二',10],
                                    ['周三',30],
                                    ['周四',50],
                                    ['周五',40],
                                    ['周六',50],
                                    ['周日',70],
                                ],
                                name:'一周访问量'
                            }
                        ],type:'bar'
                   },
                   {
                        name:'访问来源',data:[
                            {name:'百度',value:'23'},
                            {name:'谷歌',value:'13'},
                            {name:'QQ',value:'33'},
                        ],
                        type:'pie',
                        secondType:'rose'
                   },
                   {
                       name:'一月访问趋势',
                       x:[],
                       y:[
                           {
                               data:[],
                               name:'一月访问趋势'
                           }
                       ],
                       type:'line'
                   },
               ]
        })
        let monthData:monthData = {x:[],y:[]}
        let oriDate:string = '2021-05-01 00:00:00'
        monthData.x.push(oriDate)
        monthData.y.push([oriDate,20])
        for(let i = 0;i < 30; i++){
            let addTime = (i + 1) * (1000 * 60 * 60 * 24)
            let nextDate = new Date(oriDate).getTime() + addTime
            let nextDateFormat:string = prototype.$moment(nextDate).format('YYYY-MM-DD HH:mm:ss')
            monthData.x.push(nextDateFormat)
            monthData.y.push([nextDateFormat,Math.ceil(Math.random() * 100)])
        }
        state.smallChartList[2].x = monthData.x
        if(state.smallChartList[2].y){
            state.smallChartList[2].y[0].data = monthData.y
        }
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
.charts{
    height: 33vh;
    margin-top:2vh;
    border-radius:4px;
    @include boxShadowAround
}
.charts-small{
    height: 31vh;
    margin-top: 2vh;
    @extend .flexBetCenter;
    .charts-small-item{
        height:100%;
        width:32%;
        margin-right:1%;
        @include boxShadowAround;
        border-radius:4px;
        &:last-child{
            margin-right:0
        }
    }
}
</style>