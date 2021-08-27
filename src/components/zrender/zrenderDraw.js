import * as zrender from 'zrender'

export default {
    /**
         * 绘制矩形
         * @param {*Object} newOption - 矩形的参数
         */
    drawRect(newOption) {
        let option = {
            invisible: false,//是否不可见
            rectHover: false,//是否使用包围盒检验鼠标是否移动到物体。false 则检测元素实际的内容。
            silent: false,//是否响应鼠标事件
            name: '',//该矩形的标识
            shape: {

            },
            style: {
                opacity: 1,//不透明度
                fill: 'transparent',//填充色彩
                stroke: '#fff',
                lineWidth: 2,//线宽
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption,option)
        }
        // 设置矩形
        let rect = new zrender.Rect(option);
        return rect
    },
    /**
     * 绘制折线
     * @param {* Object} newOption - 配置项
     */
    drawPolyline(newOption) {
        let option = {
            invisible: false,//是否不可见
            rectHover: false,//是否使用包围盒检验鼠标是否移动到物体。false 则检测元素实际的内容。
            silent: false,//是否响应鼠标事件
            // zlevel: 1,//决定绘画在哪层 Canvas 中
            shape: {
                points: []
            },
            style: {
                opacity: 1,//不透明度
                stroke: 'rgba(255,255,255,.5)',//填充色彩
                lineWidth: 1,//线宽
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption,option)
        }
        // 设置折线
        let polyline = new zrender.Polyline(option);
        return polyline
    },
    /**
     * 绘制单条线
     * @param {*Object} newOption - 配置项
     */
    drawLine(newOption) {
        let option = {
            shape: {
                x1: 0,//起点x
                y1: 0,//起点y
                x2: 0,//终点x
                y2: 0,//终点x
            },
            style: {
               
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption,option)
        }
        // 设置线段
        let line = new zrender.Line(option);
        return line
    },
    /**
     * 绘制图形
     * @param {*Object} newOption - 配置项
     */
    drawImage(newOption) {
        let option = {
            z: 1,
            style: {
                image: '',
                width: 1632,
                height: 813,
                x: 0,
                y: 0
            },
        };
        if (newOption) {
            option = this.reduceOption(newOption,option)
        }
        // 设置图片
        let image = new zrender.Image(option);
        return image
    },
    /**
     * 绘制文字
     */
    drawText(){
        let option = {
            style: {
                text: '',
            },
        };
        if (newOption) {
            option = this.reduceOption(newOption,option)
        }
        // 设置图片
        let text = new zrender.Text(option);
        return text
    },
    /**
     * 绘制圆环
     */
    drawRing(newOption){
        let option = {
            shape:{
                cx:'',
                cy:'',
                r:'',
            },
            style: {
                opacity: 1,//不透明度
                fill: 'transparent',//填充色彩
                stroke: '#fff',
                lineWidth: 2,//线宽
            }
        }
        if(newOption){
            option = this.reduceOption(newOption,option)
        }
        let bigCircle = new zrender.Circle(option)
        let smallOption = JSON.parse(JSON.stringify(option))
        smallOption.shape.r = smallOption.shape.r - 2
        smallOption.name = smallOption.name + '-small'
        let smallCircle = new zrender.Circle(smallOption)
        return { bigCircle,smallCircle}
    },
    /**
     * 绘制圆形
     */
    drawCircle(newOption){
        let option = {
            shape: {
                cx: '',
                cy: '',
                r: '',
            },
            style: {
                opacity: 1,//不透明度
                fill: 'transparent',//填充色彩
                stroke: '#fff',
                lineWidth: 2,//线宽
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption, option)
        }
        let circle = new zrender.Circle(option)
        return circle
    },
    /**
     * 绘制椭圆
     */
    drawEllipse(newOption) {
        let option = {
            shape: {
                cx: '',
                cy: '',
                rx: '',
                ry: '',
            },
            style: {
                opacity: 1,//不透明度
                fill: 'transparent',//填充色彩
                stroke: '#fff',
                lineWidth: 2,//线宽
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption, option)
        }
        let ellipse = new zrender.Ellipse(option)
        return ellipse
    },
    /**
     * 绘制贝塞尔曲线
     */
    drawBezierCurve(newOption) {
        let option = {
            shape: {
                x1:'',
                y1:'',
                x2:'',
                y2:'',
                cpx1:'',
                cpy1:'',
            },
            style: {
                opacity: 1,//不透明度
                fill: 'transparent',//填充色彩
                stroke: '#fff',
                lineWidth: 2,//线宽
            }
        }
        if (newOption) {
            option = this.reduceOption(newOption, option)
        }
        let BezierCurve = new zrender.BezierCurve(option)
        return BezierCurve
    },
    /**
     * 
     * @param {*} newOption 
     * @param {*} option 
     */
    reduceOption(newOption,option){
       let reOption = Object.keys(newOption).reduce((pre, val) => {
            if (typeof pre[val] == 'object' && newOption[val]) {
                pre[val] = { ...pre[val], ...newOption[val] }
            }
            if (typeof pre[val] != 'object' && newOption[val]) {
                pre[val] = newOption[val]
            }
            return pre
        }, option)
        return reOption
    },
    //十六进制颜色转化为rgb或rgba
    hexToRgba(color) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        let newColor = color, alpha = ""
        //当有透明度的时候取出透明度单独操作
        if (color.length === 9) {
            newColor = color.substring(0, 7)
            alpha = color.substring(7) / 100
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < newColor.length; i += 2) {
            colorChange.push(parseInt("0x" + newColor.slice(i, i + 2)));
        }
        let lastColor = color.length !== 9 ? "rgb(" + colorChange.join(",") + ")" : "rgba(" + colorChange.join(",") + ',' + alpha + ")"
        return lastColor;
    },
    
}