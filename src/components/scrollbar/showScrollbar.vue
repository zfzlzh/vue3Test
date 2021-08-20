<template>
    <el-scrollbar class="body-scrollbar" ref="bodyScroll" :class="[hasScroll ? 'hasScroll' : '',dire]">
        <slot></slot>
    </el-scrollbar>
</template>
<script>
export default{
    props:{
        hasScroll:{
            type:Boolean,
            default:false
        },
        //竖滚动条还是横滚动条，默认竖显示
        dire:{
            type:String,
            default:'ver'
        }
    },
}
</script>
<style lang='scss' scoped>
.body-scrollbar{
    height:100%;
    width:100%;
    &.ver{
        :deep(.el-scrollbar__wrap){
            overflow-x: hidden;
        }
 
    }
    &.hor{
        :deep(.el-scrollbar__wrap){
            overflow-y: hidden;
        }
       
    }
    
    :deep(.el-scrollbar__wrap){
        .el-scrollbar__view{
            height:100%;
        }
    }
    :deep(.el-scrollbar__bar){
        &.is-horizontal{
            opacity: 0
        }
        &.is-vertical{
           opacity: 0
        }
    }
    &.hasScroll{
        &.hor{
            :deep(.el-scrollbar__bar){
                // 横
                &.is-horizontal{
                    opacity: 1;
                    right: 5px;
                }
            }
        }
        &.ver{
            :deep(.el-scrollbar__bar){
                // 竖
                &.is-vertical{
                    opacity: 1;
                    right: 5px;
                }
            }
        }
    }
    :deep(.el-scrollbar__bar){
         &.is-horizontal{
             background:#062533;
             .el-scrollbar__thumb{
                 background:#194B62
             }
         }  
         &.is-vertical{
             background:#062533;
             .el-scrollbar__thumb{
                 background:#194B62
             }
         }
    }
}
</style>