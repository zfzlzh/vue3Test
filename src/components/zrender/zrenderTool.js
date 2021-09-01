
import zrenderDraw from './zrenderDraw'
import * as zrender from 'zrender'
import html2canvas from 'html2canvas'
import lodash from 'lodash'
import { reactive, ref, toRefs, nextTick} from 'vue'
import { ElMessageBox} from 'element-plus'
export default function () {
        const state = reactive({
            nowType: '',
            zr: '',
            group: '',
            shortTimeGroup: '',
            clickPoints: [],
            keepStraight: false,
            needClose: '',
            nowDrawName: '',
            colorObj: {
                stroke: '',
                fill: ''
            },
            predefineColors: [
                'rgba(246,168,33,.5)',
                'rgba(126,215,232,.2)'
            ],
            showTool: false,
            changedRectObj: {},
            showDialog: false,
            setForm: {
                id: '',
                name: '',
                stroke: '',
                fill: '',
                lineWidth: '',
                text: '',
                textFill: '',
                fontSize: 14,
                opacity: 1,
                fontWeight: 0,
                textStroke: '',
                z: 0
            },
            calcLine: false,
            needDelete: false,
            groupBack: '',
            nowPageOffset: {},
            showPngSet: false,
            pngSetForm: {
                title: '',
                colorType: 1,
                fill: ''
            },
            clickShapes:false,
            clickShapesItem:{}
        })
        const methods = reactive({
            //计算不同屏幕
            calcDifferentScreen(obj) {
                return new Promise((resolve, reject) => {
                    let { item, ratio, index } = obj
                    let { position, shape, style, chartType } = item
                    let newData = lodash.cloneDeep(item)
                    switch (chartType) {
                        case 'polyline':
                        case 'polygon':
                            newData.shape = methods.calcDifferentFuncForPolyline(shape.points, ratio)
                            break;
                        case 'rect':
                            newData.shape = methods.calcDifferentFuncForRectOrImg(shape, ratio)
                            break
                        case 'image':
                            newData.style = methods.calcDifferentFuncForRectOrImg(style, ratio)
                            break;
                        case 'circle':
                            newData.shape = methods.calcDifferentFuncForCircle(shape, ratio)
                            break;
                        case 'ellispe':
                            newData.shape = methods.calcDifferentFuncForEllipse(shape, ratio)
                            break;
                        case 'bezier':
                            newData.shape = methods.calcDifferentFuncForBezier(shape, ratio)
                            break;
                        default:
                            break;
                    }
                    newData.position = position && position.length == 2 ?  [position[0] * ratio.x, position[1] * ratio.y] : []
                    console.log('newData', newData)
                    newData.chartIndex = chartType + index
                    console.log('newData', newData)
                    console.log('style.fontSize', style.fontSize)
                    if (style.fontSize) {
                        newData.style.fontSize = style.fontSize * ratio.x
                    }
                    console.log('newData',newData)
                    resolve(newData)
                })
            },
            //矩形与图片
            calcDifferentFuncForRectOrImg(shape, ratio) {
                let newShape = lodash.cloneDeep(shape)
                newShape.x = shape.x * ratio.x
                newShape.y = shape.y * ratio.y
                newShape.width = shape.width * ratio.x
                newShape.height = shape.height * ratio.y
                return newShape
            },
            //折线
            calcDifferentFuncForPolyline(points, ratio) {
                let newPoints = points && points.length != 0 ? points.map((val) => {
                    return [val[0] * ratio.x, val[1] * ratio.y]
                }) : []
                return { points: newPoints }
            },
            //圆
            calcDifferentFuncForCircle(shape, ratio) {
                let newShape = lodash.cloneDeep(shape)
                newShape.cx = shape.cx * ratio.x
                newShape.cy = shape.cy * ratio.y
                newShape.r = shape.r * ratio.x
                return newShape
            },
            //贝塞尔曲线
            calcDifferentFuncForBezier(shape, ratio) {
                let newShape = lodash.cloneDeep(shape)
                newShape.x1 = shape.x1 * ratio.x
                newShape.y1 = shape.y1 * ratio.y
                newShape.x2 = shape.x2 * ratio.x
                newShape.y2 = shape.y2 * ratio.y
                newShape.cpx1 = shape.cpx1 * ratio.x
                newShape.cpy1 = shape.cpy1 * ratio.y
                newShape.precent = [shape.precent[0] * ratio.x, shape.precent[1] * ratio.y]
                return newShape
            },
            //椭圆
            calcDifferentFuncForEllipse(shape, ratio) {
                let newShape = lodash.cloneDeep(shape)
                newShape.cx = shape.cx * ratio.x
                newShape.cy = shape.cy * ratio.y
                newShape.rx = shape.rx * ratio.x
                newShape.ry = shape.ry * ratio.y
                return newShape
            },
            //计算新旧容器宽高比例
            calcRatios(json,dom){
                let nowW = dom.offsetWidth
                let nowH = dom.offsetHeight
                let jsonW = json.offsetW
                let jsonH = json.offsetH
                return {
                    x:nowW / jsonW,
                    y:nowH / jsonH
                }

            },
            //初始化
            init(json,dom,pageType) {
                state.nowPageOffset = { width: dom.offsetWidth, height: dom.offsetHeight }
                state.zr = zrender.init(dom)
                state.group = new zrender.Group();
                state.groupBack = new zrender.Group();
                let width = dom.offsetWidth
                let height = dom.offsetHeight
                let background = zrenderDraw.drawRect({
                    shape: {
                        width,
                        height,
                        x: 0,
                        y: 0
                    },
                    z: 1,
                    name: 'backgroundRect',
                    cursor: 'default'
                })
                state.groupBack.add(background)
                background.on('click', methods.clickBackground)
                state.shortTimeGroup = new zrender.Group()
                state.zr.add(state.group)
                state.zr.add(state.groupBack)
                state.zr.add(state.shortTimeGroup)
                //有数据传入时绘制
                console.log(Object.values(json))
                if (json && Object.keys(json).length != 0) {
                    nextTick(() => {
                        Object.keys(json).forEach((val) => {
                            if (!['connect','offsetW','offsetH'].includes(val)) {
                                let jsonItem = json[val] 
                                methods.initWhileHasData(jsonItem, json, dom, pageType)
                            }
                        })
                    })
                }
            },
            //当有数据时的生成
            initWhileHasData(item, json, dom, pageType) {
                let newItem
                if (item.length != 0) {
                    console.log('item',item)
                    for (let i = 0; i < item.length; i++) {
                        let val = item[i]
                        let jsonVal = val
                        // console.log(jsonVal)
                        if(typeof jsonVal == 'object'){
                            jsonVal.draggable = pageType == 'edit' ? true : false
                            jsonVal.invisible = false
                            //计算分辨率比例
                            let ratio = methods.calcRatios(json, dom)
                            //根据比例转换数据完成后生成图形
                            methods.calcDifferentScreen({ item: jsonVal, ratio, index: i + 1 }).then((obj) => {
                                console.log('obj',obj)
                                switch (obj.chartType) {
                                    case 'polyline':
                                    case 'polygon':
                                        newItem = zrenderDraw.drawPolyline(obj)
                                        newItem.on('drag', methods.changePolyline)
                                        let position = obj.position && obj.position.length != 0 ? obj.position : [0, 0]
                                        obj.shape.points.forEach((points, index) => {
                                            methods.createDragRect({
                                                shape: {
                                                    x: points[0] + position[0],
                                                    y: points[1] + position[1],
                                                },
                                                nameIndex: index + 1,
                                                name: obj.chartIndex + '|' + index,
                                                invisible: true,
                                            })
                                        })
                                        break;
                                    case 'image':
                                        newItem = zrenderDraw.drawImage(obj)
                                        newItem.on('drag', methods.dragBigRect)
                                        methods.calcDragRectData(newItem).then((data) => {
                                            data.forEach((val) => {
                                                val.invisible = true
                                                methods.createDragRect(val)
                                            })
                                        })
                                        break;
                                    case 'rect':
                                        newItem = zrenderDraw.drawRect(obj)
                                        newItem.on('drag', methods.dragBigRect)
                                        console.log(obj)
                                        methods.calcDragRectData(newItem).then((data) => {
                                            data.forEach((val) => {
                                                val.invisible = true
                                                methods.createDragRect(val)
                                            })
                                        })
                                        break;
                                    case 'circle':
                                        newItem = zrenderDraw.drawCircle(obj)
                                        newItem.on('drag', methods.dragCircle)
                                        methods.calcDragRectDataForCircle(newItem).then((data) => {
                                            data.forEach((val) => {
                                                val.invisible = true
                                                methods.createDragRect(val)
                                            })
                                        })
                                        break;
                                    default:
                                        break;
                                }
                                newItem.on('dblclick', methods.showSetForm)
                                newItem.on('click', methods.handlerClick)
                                state.group.add(newItem)

                            })
                        }
                    }
                }
            },
            //画图
            draw(type) {
                if (['polyline', 'polygon', 'delete'].includes(type) && state.needClose) {
                    return
                }
                if (!['polyline', 'polygon', 'delete'].includes(type) && state.needClose) {
                    state.needDelete = false
                    methods.closeDraw()
                }
                if (!['xy', 'stroke', 'fill', 'image'].includes(type)) {
                    state.nowType = type
                    let num
                    state.clickShapes = true
                    switch (type) {
                        case 'rect':
                            methods.drawRectFunc()
                            break
                        case 'polyline':
                        case 'polygon':
                            window.addEventListener('contextmenu', methods.createpolyline)
                            state.needClose = type
                            num = state.group._children ? state.group._children.length : 0
                            state.nowDrawName = 'polyline' + num
                            break
                        case 'circle':
                            methods.drawCircleFunc()
                            break
                        case 'ellipse':
                            methods.drawEllipseFunc()
                            break;
                        case 'bezier':
                            state.needClose = type
                            num = state.group._children ? state.group._children.length : 0
                            state.nowDrawName = 'bezier' + num
                            break;
                        // case 'output':
                        //     ElMessageBox.prompt('文件名：', '提示', {
                        //         confirmButtonText: '确定',
                        //         cancelButtonText: '取消',
                        //     }).then(({ value }) => {
                        //         methods.exportJson(value)
                        //     }).catch(() => { })
                        //     break;
                        // case 'outputPng':
                        //     state.showPngSet = true
                        //     state.pngSetForm = {
                        //         title: '',
                        //         colorType: 1,
                        //         fill: ''
                        //     }
                        //     break;
                        default:
                            break;
                    }
                    let len = state.group._children.length
                    state.clickShapesItem = state.group._children[len - 1]
                } else {
                    switch (type) {
                        case 'xy':
                            state.keepStraight = !state.keepStraight
                            break
                        default:
                            break
                    }

                }

            },
            // 矩形
            drawRectFunc() {
                let rect = zrenderDraw.drawRect({
                    shape: {
                        x: state.nowPageOffset.width * 0.3,
                        y: state.nowPageOffset.height * 0.3,
                        width: 50,
                        height: 50,
                    },
                    draggable: true,
                    name: 'rect' + state.group._children.length,
                    chartIndex: 'rect' + state.group._children.length,
                    z: 2,
                    style:{
                        stroke:'#888'
                    }
                })
                state.group.add(rect)
                methods.calcDragRectData(rect).then((rectData) => {
                    rectData.forEach((val) => {
                        methods.createDragRect(val)
                    })
                })
                rect.on('drag', methods.dragBigRect)
                rect.on('dblclick', methods.showSetForm)
                rect.on('click', methods.handlerClick)
            },
            //圆
            drawCircleFunc() {
                let circle = zrenderDraw.drawCircle({
                    shape: {
                        cx: 100,
                        cy: 100,
                        r: 20
                    },
                    style: {
                        lineWidth: 3,
                        stroke:'#888',
                        
                    },
                    name: 'circle' + state.group._children.length + '',
                    chartIndex: 'circle' + state.group._children.length + '',
                    draggable: true,
                    z: 2
                })
                state.group.add(circle)
                methods.calcDragRectDataForCircle(circle).then((data) => {
                    data.forEach((val) => {
                        methods.createDragRect(val)
                    })
                })
                circle.on('drag', methods.dragCircle)
                circle.on('dblclick', methods.showSetForm)
                circle.on('click', methods.handlerClick)
            },
            //椭圆
            drawEllipseFunc() {
                let ellipse = zrenderDraw.drawEllipse({
                    shape: {
                        cx: 100,
                        cy: 100,
                        rx: 100,
                        ry: 50
                    },
                    name: 'circle' + state.group._children.length + '',
                    chartIndex: 'circle' + state.group._children.length + '',
                    draggable: true,
                    z: 2,
                    style: {
                        stroke: '#888'
                    }
                })
                state.group.add(ellipse)
                methods.calcDragRectDataForEllipse(ellipse).then((data) => {
                    data.forEach((val) => {
                        methods.createDragRect(val)
                    })
                })
                ellipse.on('drag', methods.dragEllipse)
                ellipse.on('dblclick', methods.showSetForm)
                ellipse.on('click', methods.handlerClick)
            },
            //折线
            //折线图生成点
            getPolylinePoint(el) {
                let points = [el.event.zrX, el.event.zrY]
                if (['null', 'undefined', ''].includes(String(el.event.zrX)) || ['null', 'undefined', ''].includes(String(el.event.zrY))) {
                    return
                }
                if (state.keepStraight && state.clickPoints.length != 0) {
                    let lastLen = state.clickPoints.length - 1
                    let x = el.event.zrX - state.clickPoints[lastLen][0],
                        y = el.event.zrY - state.clickPoints[lastLen][1]
                    let dire = Math.abs(x) > Math.abs(y) ? 'leftRight' : 'bottomTop'
                    points = dire == 'leftRight' ? [el.event.zrX, state.clickPoints[lastLen][1]] : [state.clickPoints[lastLen][0], el.event.zrY]
                }
                methods.createDragRect({
                    shape: {
                        x: points[0],
                        y: points[1],
                    },
                    style: {
                        stroke: '#888'
                    },
                    nameIndex: state.clickPoints.length + 1,
                    name: state.nowDrawName + '|' + state.clickPoints.length,

                })
                state.clickPoints.push(points)
                // if(state.clickPoints.length >= 2){
                //     methods.createPolylineFunc()
                // }
            },
            //完成折线
            createpolyline(el) {
                el.preventDefault()
                if (state.clickPoints.length == 0) {
                    return
                }
                methods.createPolylineFunc()
            },
            createPolylineFunc() {
                let time = setTimeout(() => {
                    if (state.nowType == 'polygon') {
                        state.clickPoints.push(state.clickPoints[0])
                    }
                    let polyline = zrenderDraw.drawPolyline({
                        shape: {
                            points: state.clickPoints
                        },
                        style: {
                            lineWidth: 3,
                            stroke:'#888'
                        },
                        name: state.nowDrawName,
                        chartIndex: state.nowDrawName,
                        draggable: true,
                        z: 2
                    })
                    state.group.add(polyline)
                    if (state.colorObj.stroke) {
                        polyline.attr({ style: { stroke: state.colorObj.stroke } })
                    }

                    polyline.on('drag', methods.changePolyline)
                    polyline.on('click', methods.handlerClick)
                    polyline.on('dblclick', methods.showSetForm)
                    state.clickPoints = []
                    clearTimeout(time)
                }, 100)
            },
            //关闭折线生成
            closeDraw() {
                let timer = setTimeout(() => {
                    state.needClose = ''
                    window.removeEventListener('contextmenu', methods.createpolyline)
                    if (state.clickPoints.length != 0) {
                        methods.createPolylineFunc()
                    }
                    clearTimeout(timer)
                }, 100)

            },
            //贝塞尔曲线
            getBezierPoint(el) {
                let points = [el.event.zrX, el.event.zrY]
                if (['null', 'undefined', ''].includes(String(el.event.zrX)) || ['null', 'undefined', ''].includes(String(el.event.zrY))) {
                    return
                }
                if (state.keepStraight && state.clickPoints.length != 0) {
                    let lastLen = state.clickPoints.length - 1
                    let x = el.event.zrX - state.clickPoints[lastLen][0],
                        y = el.event.zrY - state.clickPoints[lastLen][1]
                    let dire = Math.abs(x) > Math.abs(y) ? 'leftRight' : 'bottomTop'
                    points = dire == 'leftRight' ? [el.event.zrX, state.clickPoints[lastLen][1]] : [state.clickPoints[lastLen][0], el.event.zrY]
                }
                methods.createDragRect({
                    shape: {
                        x: points[0],
                        y: points[1],
                    },
                    nameIndex: state.clickPoints.length + 1,
                    name: state.nowDrawName + '|' + state.clickPoints.length,
                    style: {
                        stroke: '#888'
                    }
                })
                state.clickPoints.push(points)
                if (state.clickPoints.length == 2) {
                    methods.initBezier()
                }
            },
            initBezier() {
                let time = setTimeout(() => {
                    state.needClose = ''
                    let one = state.clickPoints[0], two = state.clickPoints[1]
                    let shape = {
                        x1: one[0],
                        y1: one[1],
                        x2: two[0],
                        y2: two[1],
                        cpx1: (one[0] + two[0]) / 2,
                        cpy1: (one[1] + two[1]) / 2 - 20
                    }
                    let precent = [shape.cpx1 / (one[0] + two[0]), shape.cpy1 / (one[1] + two[1])]
                    shape.precent = precent
                    methods.createDragRect({
                        shape: {
                            x: (one[0] + two[0]) / 2,
                            y: (one[1] + two[1]) / 2 - 20,
                        },
                        nameIndex: state.clickPoints.length + 1,
                        name: state.nowDrawName + '|' + state.clickPoints.length,
                        style: {
                            stroke: '#888'
                        }
                    })
                    let bezier = zrenderDraw.drawBezierCurve({
                        shape,
                        style: {
                            lineWidth: 3,
                            stroke:'#888'
                        },
                        name: state.nowDrawName,
                        chartIndex: state.nowDrawName,
                        draggable: true,
                        z: 2
                    })
                    state.group.add(bezier)

                    bezier.on('drag', methods.changeBezier)
                    bezier.on('click', methods.handlerClick)
                    bezier.on('dblclick', methods.showSetForm)
                    state.clickPoints = []
                    clearTimeout(time)
                }, 100)
            },
            //图片
            //获取图片
            fileChange(files) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let url = e.target.result
                    let image = zrenderDraw.drawImage({
                        style: {
                            image: url,
                            x: state.nowPageOffset.width * 0.3,
                            y: state.nowPageOffset.height * 0.3,
                            width: 78,
                            height: 27
                        },
                        name: 'image' + state.group._children.length,
                        chartIndex: 'image' + state.group._children.length,
                        draggable: true,
                        z: 2
                    })
                    state.group.add(image)
                    image.on('drag', methods.dragBigRect)
                    image.on('click', methods.handlerClick)
                    image.on('dblclick', methods.showSetForm)
                    state.calcDragRectData(image).then((rectData) => {
                        rectData.forEach((val) => {
                            methods.createDragRect(val)
                        })
                    })
                }
                reader.readAsDataURL(files[0]);
            },
            //可拖拽小方块
            //计算可拖拽方块的数据 -- 矩形与图片
            calcDragRectData(item) {
                return new Promise((resolve, reject) => {
                    let data = item.type == 'rect' ? item.shape : item.style
                    let position = item.position
                    let { x, y, width, height } = data
                    let chartIndex = item.chartIndex
                    let obj = { shape: {}, nameIndex: '', name: '' }
                    let nameObj = {
                        0: 'left-top',
                        1: 'left-middle',
                        2: 'left-bottom',
                        3: 'middle-bottom',
                        4: 'right-bottom',
                        5: 'right-middle',
                        6: 'right-top',
                        7: 'middle-top',
                    }
                    let xyObj = {
                        left: x - 5 + position[0],
                        right: x + width - 5 + position[0],
                        top: y - 5 + position[1],
                        bottom: y + height - 5 + position[1],
                        middleX: x + width / 2 - 5 + position[0],
                        middleY: y + height / 2 - 5 + position[1]
                    }
                    //从左上角逆时针生成
                    let rectData = new Array(8).fill({}).map((val, index) => {
                        let smallX, smallY
                        let nameList = nameObj[index].split('-')
                        smallX = nameList[0] == 'middle' ? xyObj['middleX'] : xyObj[nameList[0]]
                        smallY = nameList[1] == 'middle' ? xyObj['middleY'] : xyObj[nameList[1]]
                        val = lodash.cloneDeep(obj)
                        val.shape.x = smallX
                        val.shape.y = smallY
                        val.z = 100
                        val.position = [0, 0]
                        val.name = chartIndex + '|' + nameObj[index]
                        val.nameIndex = index
                        return val
                    })
                    resolve(rectData)
                })
            },
            //计算可拖拽方块的数据 -- 圆
            calcDragRectDataForCircle(item) {
                return new Promise((resolve, reject) => {
                    let data = item.shape
                    let position = item.position
                    let { cx, cy, r } = data
                    let chartIndex = item.chartIndex
                    let obj = { shape: {}, nameIndex: '', name: '' }
                    let nameObj = {
                        0: 'left-top',
                        1: 'left-bottom',
                        2: 'right-bottom',
                        3: 'right-top',
                    }
                    let xyObj = {
                        left: cx - r + position[0] - 10,
                        right: cx + r + position[0],
                        top: cy - r + position[1] - 10,
                        bottom: cy + r + position[1],
                    }
                    //从左上角逆时针生成
                    let circleData = new Array(4).fill({}).map((val, index) => {
                        let nameList = nameObj[index].split('-')
                        val = lodash.cloneDeep(obj)
                        val.shape.x = xyObj[nameList[0]]
                        val.shape.y = xyObj[nameList[1]]
                        val.z = 100
                        val.position = [0, 0]
                        val.name = chartIndex + '|' + nameObj[index]
                        val.nameIndex = index
                        return val
                    })
                    resolve(circleData)
                })
            },
            //计算可拖拽方块的数据 -- 椭圆
            calcDragRectDataForEllipse(item) {
                return new Promise((resolve, reject) => {
                    let position = item.position
                    let { cx, cy, rx, ry } = item.shape
                    let chartIndex = item.chartIndex
                    let obj = { shape: {}, nameIndex: '', name: '' }
                    let nameObj = {
                        0: 'left-top',
                        1: 'left-middle',
                        2: 'left-bottom',
                        3: 'middle-bottom',
                        4: 'right-bottom',
                        5: 'right-middle',
                        6: 'right-top',
                        7: 'middle-top',
                    }
                    let xPlusWid = cx + rx,
                        yPlusHei = cy + ry,
                        onlyX = cx - rx,
                        onlyY = cy - ry
                    let xyObj = {
                        left: onlyX + position[0],
                        right: xPlusWid + position[0],
                        top: onlyY + position[1],
                        bottom: yPlusHei + position[1],
                        middleX: cx + position[0],
                        middleY: cy + position[1]
                    }
                    //从左上角逆时针生成
                    let ellipseData = new Array(8).fill({}).map((val, index) => {
                        let smallX, smallY
                        let nameList = nameObj[index].split('-')
                        smallX = nameList[0] == 'middle' ? xyObj['middleX'] : xyObj[nameList[0]]
                        smallY = nameList[1] == 'middle' ? xyObj['middleY'] : xyObj[nameList[1]]
                        val = lodash.cloneDeep(obj)
                        val.shape.x = smallX
                        val.shape.y = smallY
                        val.z = 100
                        val.position = [0, 0]
                        val.name = chartIndex + '|' + nameObj[index]
                        val.nameIndex = index
                        return val
                    })
                    resolve(ellipseData)
                })
            },
            //可拖拽方块生成
            createDragRect(obj) {
                let { shape, nameIndex, name, invisible } = obj
                let newShape = {
                    ...shape, ...{
                        width: 10,
                        height: 10,
                    }
                }
                let rect = zrenderDraw.drawRect({
                    shape: newShape,
                    name,
                    nameIndex,
                    draggable: true,
                    z: 100,
                    invisible: invisible ? true : false,
                    style:{
                        stroke:'#000'
                    }
                })
                rect.on('drag', methods.dragSmallRect)
                state.shortTimeGroup.add(rect)
            },

            //拖拽
            //拖拽小方块
            dragSmallRect(el) {
                let nowCoor = [el.event.zrX, el.event.zrY]
                let nowRect = el.target
                let name = nowRect.name.split('|')[0]
                let smallRectName = nowRect.name.split('|')[1]
                let groupItem
                state.group.eachChild((val) => {
                    if (val.chartIndex == name) {
                        groupItem = val
                    }
                })
                //图形操作
                switch (groupItem.type) {
                    case 'polyline':
                        methods.dragSmallRectPolyline({ nowRect, nowCoor, groupItem, smallRectName });
                        break;
                    case 'rect':
                    case 'image':
                        methods.dragSmallRectRectImg({ nowRect, nowCoor, groupItem, smallRectName });
                        break;
                    case 'circle':
                        methods.dragSmallRectCircle({ nowRect, nowCoor, groupItem, smallRectName });
                        break;
                    case 'bezier-curve':
                        methods.dragSmallRectBezier({ nowRect, nowCoor, groupItem, smallRectName })
                        break;
                    case 'ellipse':
                        methods.dragSmallRectEllipse({ nowRect, nowCoor, groupItem, smallRectName })
                        break;
                    default:
                        break;
                }
            },
            //拖拽小方块时---折线
            /**
             * * 折线
                拖拽的小方块关联的线段的x坐标 = 当前x坐标 - 小方块宽度/2
                拖拽的小方块关联的线段的y坐标 = 当前y坐标 - 小方块高度/2
             */
            dragSmallRectPolyline(obj) {
                let { nowRect, nowCoor, groupItem } = obj
                let newPoints = groupItem.shape.points
                let newCoor = [nowCoor[0] - groupItem.position[0], nowCoor[1] - groupItem.position[1]]
                if (nowRect.nameIndex == 1) {
                    newPoints[0] = newCoor
                    if (state.nowType == 'polygon') {
                        newPoints[newPoints.length - 1] = newCoor
                    }
                } else {
                    newPoints[nowRect.nameIndex - 1] = newCoor
                }
                groupItem.attr({ shape: { points: newPoints } })
            },
            //拖拽小方块时---矩形或图片
            /**
             * * 方块与图片
                * left --- 拖拽左边中间的方块
                    * 宽度 = 原始宽度+（原始x坐标-当前小方块的x坐标）
                    * x坐标 = 原始x坐标-当前小方块的x坐标
                * top --- 拖拽上方中间的方块
                    * 高度 = 原始高度 + （原始y坐标 - 当前小方块y坐标）
                    * y坐标 = 原始y坐标 - 当前小方块y坐标
                * right --- 拖拽右边中间的方块
                    * 宽度 = 当前小方块的x坐标 - 原始x坐标
                    * x坐标不变
                * bottom --- 拖拽下方中间的方块
                    * 高度 = 当前小方块y坐标 - 原始y坐标
                    * y坐标不变
                * 拖拽左上角方块的方块
                    left,top
                * 拖拽右上角方块的方块
                    right,top
                * 拖拽左下角方块的方块
                    left,bottom
                * 拖拽右下角方块的方块
                    right,bottom
             */
            dragSmallRectRectImg(obj) {
                let { nowCoor, groupItem, smallRectName } = obj
                // 矩形与图片
                let shape = groupItem.type == 'rect' ? lodash.cloneDeep(groupItem.shape) : lodash.cloneDeep(groupItem.style)
                let position = groupItem.position
                if (['right-top', 'right-bottom', 'right-middle'].includes(smallRectName)) {
                    shape.width = nowCoor[0] - position[0] - shape.x
                }
                if (['left-top', 'left-bottom', 'left-middle'].includes(smallRectName)) {
                    let newX = Number(shape.x) + Number(position[0]) - nowCoor[0]
                    shape.width = newX + Number(shape.width)
                    shape.x = Number(nowCoor[0])
                    position[0] = 0

                }
                if (['right-top', 'left-top', 'middle-top'].includes(smallRectName)) {
                    let newY = Number(shape.y) + Number(position[1]) - nowCoor[1]
                    shape.height = newY + Number(shape.height)
                    shape.y = Number(nowCoor[1])
                    position[1] = 0
                }
                if (['right-bottom', 'left-bottom', 'middle-bottom'].includes(smallRectName)) {
                    shape.height = nowCoor[1] - position[1] - shape.y
                }
                let attr = groupItem.type == 'rect' ? { shape, _legacyPos: position } : { style: shape, _legacyPos:position }
                groupItem.attr(attr)
                methods.calcDragRectData(groupItem).then((rectData) => {
                    rectData.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            //拖拽小方块时---圆
            /**
             * r -- 半径 -- 原始半径 + 当前小方块的坐标 - 原始圆的坐标
             *  原始圆的坐标，最左最上：[原始圆的cx - 半径，原始圆的cy - 半径]，最右最下：[原始圆的cx + 半径，原始圆的cy + 半径]
             *      
             */
            dragSmallRectCircle(obj) {
                let { nowRect, nowCoor, groupItem, smallRectName } = obj
                let shape = lodash.cloneDeep(groupItem.shape)
                let position = groupItem.position
                let circlePos = [shape.cx - shape.r, shape.cy - shape.r]
                let circlePosPlusWidth = [Number(shape.cx) + Number(shape.r) + position[0], Number(shape.cy) + Number(shape.r) + position[1]]
                let posX = nowCoor[0] - circlePosPlusWidth[0],
                    posY = nowCoor[1] - circlePosPlusWidth[1]
                shape.r = Number(shape.r) + Number(posX)
                shape.cx = Number(shape.cx) + Number(posX)
                shape.cy = Number(shape.cy) + Number(posY)


                let attr = { shape, position }
                groupItem.attr(attr)
                methods.calcDragRectDataForCircle(groupItem).then((data) => {
                    data.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            //拖拽小方块时---椭圆
            dragSmallRectEllipse(obj) {
                let { nowRect, nowCoor, groupItem, smallRectName } = obj
                let shape = lodash.cloneDeep(groupItem.shape)
                let position = groupItem.position
                let xPlusWid = shape.cx + shape.rx + position[0],
                    yPlusHei = shape.cy + shape.ry + position[1]
                let posX = nowCoor[0] - xPlusWid,
                    posY = nowCoor[1] - yPlusHei
                if (smallRectName.indexOf('left') > -1 || smallRectName.indexOf('right') > -1) {
                    shape.rx = Math.abs(nowCoor[0] - shape.cx - position[0])
                    shape.cx = Number(shape.cx) + Number(posX)
                }
                if (smallRectName.indexOf('top') > -1 || smallRectName.indexOf('bottom') > -1) {
                    shape.ry = Math.abs(nowCoor[1] - shape.cy - position[1])
                    shape.cy = Number(shape.cy) + Number(posY)
                }
                let attr = { shape, position }
                groupItem.attr(attr)
                methods.calcDragRectDataForEllipse(groupItem).then((data) => {
                    data.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            /**
             * 拖拽贝塞尔曲线
             * 
             */
            dragSmallRectBezier(obj) {
                let { nowRect, nowCoor, groupItem, smallRectName } = obj
                let shape = lodash.cloneDeep(groupItem.shape)
                let position = groupItem.position
                let newCoor = [nowCoor[0] - position[0], nowCoor[1] - position[1]]
                let index = Number(smallRectName)
                let name = nowRect.name.split('|')[0]
                // 两端
                if (index < 2) {
                    let other = index === 0 ? [shape['x2'], shape['y2']] : [shape['x1'], shape['y1']]
                    shape['x' + (index + 1)] = newCoor[0]
                    shape['y' + (index + 1)] = newCoor[1]
                    shape['cpx1'] = (newCoor[0] + other[0]) * shape.precent[0]
                    shape['cpy1'] = (newCoor[1] + other[1]) * shape.precent[1]
                    state.shortTimeGroup.childOfName(name + '|2').attr({
                        shape: {
                            x: shape['cpx1'],
                            y: shape['cpy1']
                        },
                        position: groupItem.position
                    })
                } else {
                    //中间
                    shape['cpx1'] = newCoor[0]
                    shape['cpy1'] = newCoor[1]
                    // let precent = [shape.cpx1 / (shape.x1 + shape.x2),shape.cpy1 / (shape.y1 + shape.y2)]
                    // shape.precent = precent
                }
                groupItem.attr({ shape, position: groupItem.position })
            },
            //拖拽圆
            dragCircle(el) {
                let obj = lodash.cloneDeep(el.target)
                methods.calcDragRectDataForCircle(obj).then((data) => {
                    data.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            //拖拽椭圆
            dragEllipse(el) {
                let obj = lodash.cloneDeep(el.target)
                methods.calcDragRectDataForEllipse(obj).then((data) => {
                    data.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            //拖拽大方块或图片
            dragBigRect(el) {
                let obj = lodash.cloneDeep(el.target)
                methods.calcDragRectData(obj).then((rectData) => {
                    rectData.forEach((val) => {
                        state.shortTimeGroup.childOfName(val.name).attr(val)
                    })
                })
            },
            //拖拽折线
            changePolyline(el) {
                let obj = el.target
                obj.shape.points.forEach((points, index) => {
                    let val = state.shortTimeGroup.childOfName(obj.chartIndex + '|' + index)
                    if (!val) {
                        return
                    }
                    val.attr({
                        shape: {
                            x: points[0],
                            y: points[1],
                        },
                        position: obj.position
                    })
                })
            },
            //拖拽贝塞尔曲线
            changeBezier(el) {
                let obj = el.target
                let val1 = state.shortTimeGroup.childOfName(obj.chartIndex + '|0')
                let val2 = state.shortTimeGroup.childOfName(obj.chartIndex + '|1')
                let val3 = state.shortTimeGroup.childOfName(obj.chartIndex + '|2')
                val1.attr({
                    shape: {
                        x: obj.shape['x1'],
                        y: obj.shape['y1'],
                    },
                    position: obj.position
                })
                val2.attr({
                    shape: {
                        x: obj.shape['x2'],
                        y: obj.shape['y2'],
                    },
                    position: obj.position
                })
                val3.attr({
                    position: obj.position
                })
            },

            //点击事件，根据状态不同有不同的效果
            /**
             * 平常 -- 点击出现可拖拽小方块
             * needDelete为true -- 删除点击图形
             */
            handlerClick(el) {
                console.log('state.needDelete', state.needDelete)
                if (state.needDelete) {
                    methods.deleteItem(el)
                } else {
                    methods.hideShowRect(el)
                    console.log(el)
                    state.clickShapes = true
                    state.clickShapesItem = el.target
                }
            },
            //处理可拖拽小方块的显示
            hideShowRect(el) {
                console.log(el.target.id)
                let nowChartIndex = el.target.chartIndex
                state.shortTimeGroup.eachChild((val) => {
                    if (val.name.indexOf(nowChartIndex) > -1) {
                        val.attr({
                            invisible: false,
                        })
                    } else {
                        val.attr({
                            invisible: true,
                        })
                    }
                })
                
            },
            //判断是否在可点击框范围内
            isInClickRect(el) {
                let { offsetX, offsetY } = el
                let isIn = []
                //判断当前点击的坐标是否在某个框中
                state.group.eachChild((val) => {
                    isIn = val.rectContain(offsetX, offsetY) === true ? [...isIn, val] : isIn
                })
                return isIn
            },
            //点击空白处
            clickBackground(el) {
                if (!state.needClose) {
                    let isIn = methods.isInClickRect(el)
                    if (isIn && isIn.length != 0) {
                        methods.hideShowRect(el)
                    } else {
                        state.shortTimeGroup.eachChild((val) => {
                            val.attr({
                                invisible: true
                            })
                        })
                    }
                    state.clickShapes = false
                    state.clickShapesItem = {}
                } else {
                    switch (state.needClose) {
                        case 'polyline':
                        case 'polygon':
                            methods.getPolylinePoint(el)
                            break;
                        case 'bezier':
                            methods.getBezierPoint(el)
                            break;
                        default:
                            break;
                    }

                }

            },
            //删除
            changeDeleteState(val){
                state.needDelete = val
            },
            deleteItem(el) {
                let nowChartIndex = el.target.chartIndex
                state.group.remove(el.target)
                if (['rect', 'image'].includes(el.target.type)) {
                    let nameObj = {
                        0: 'left-top',
                        1: 'left-middle',
                        2: 'left-bottom',
                        3: 'middle-bottom',
                        4: 'right-bottom',
                        5: 'right-middle',
                        6: 'right-top',
                        7: 'middle-top',
                    }
                    Object.values(nameObj).forEach((val) => {
                        let item = state.shortTimeGroup.childOfName(nowChartIndex + '|' + val)
                        state.shortTimeGroup.remove(item)
                    })
                } else if (el.target.type == 'polyline') {
                    state.shortTimeGroup.eachChild((val) => {
                        if (val.name.indexOf(nowChartIndex + '|') > -1) {
                            state.shortTimeGroup.remove(val)
                        }
                    })
                } else if (el.target.type == 'circle') {
                    let nameObj = {
                        0: 'left-top',
                        1: 'left-bottom',
                        2: 'right-bottom',
                        3: 'right-top',
                    }
                    Object.values(nameObj).forEach((val) => {
                        let item = state.shortTimeGroup.childOfName(nowChartIndex + '|' + val)
                        state.shortTimeGroup.remove(item)
                    })
                }
                state.clickShapes = false
                state.clickShapesItem = {}
            },
            //关闭按钮事件
            handlerClose() {
                if (['polyline', 'polygon'].includes(state.needClose)) {
                    methods.closeDraw()
                }

            },
            //工具栏
            //显示工具栏
            enterShowHiden() {
                state.showTool = true
            },
            //隐藏工具栏
            leaveTool() {
                state.showTool = false
            },
            //配置窗口 -- 双击事件
            //显示配置窗口
            showSetForm(el) {
                state.showDialog = true
                let target = el.target
                state.setForm = { ...state.setForm, ...target.style }
                state.setForm.name = target.name
                state.setForm.id = target.id
                state.setForm.z = target.z
            },
            //保存当前图表的数据
            saveChartData(clickShapesId,setForm) {
                state.group.eachChild((val) => {
                    if (val.id == clickShapesId) {
                        let style = Object.keys(setForm).reduce((pre, item) => {
                            if (!['id', 'name', 'z'].includes(item)){
                                pre[item] = setForm[item] ? setForm[item] : pre[item]
                            }
                            return pre
                        }, val.style)
                        val.attr({
                            style,
                            name: setForm.name,
                            z: setForm.z
                        })
                    }
                })
            },
            //导出
            //导出文件各类型操作
            handlerChartTypeJson(obj) {
                let { type, json } = obj
                let back =  []
                if (!json || json.length == 0) {
                    return back
                }
                let newJson = json.reduce((pre2, val) => {
                    let { shape, position, style, offsetW, offsetH, name, chartType, z, zlevel } = val
                    return type == 'image' ? [...pre2, { position, style, offsetW, offsetH, name, chartType, z, zlevel }] : [...pre2, { shape, position, style, offsetW, offsetH, name, chartType, z, zlevel }]
                }, back)
                return newJson
            },
            handlerData(){
                let json = { polyline: [], rect: [], image: [], connect: [] }
                let dom = document.getElementById('zrender')
                let width = dom.offsetWidth
                let height = dom.offsetHeight
                let reduceObj = {}
                state.group.eachChild((val) => {
                    if (val.type == 'image') {
                        reduceObj = { style: {}, name: '', position: [], offsetW: '', offsetH: '', chartType: val.type, z: 2, zlevel: 1 }
                    } else {
                        reduceObj = { shape: {}, name: '', position: [], style: {}, offsetW: '', offsetH: '', chartType: val.type, z: 2, zlevel: 1 }
                    }
                    //记录当前分辨率
                    let item = methods.reduceItem(val, reduceObj)
                    json[val.type].push(item)
                })
                json.offsetW = width
                json.offsetH = height
                console.log('json', json)
                //rect与polyline的关联
                if (json.rect.length != 0) {
                    if (state.connect === true) {
                        json.connect = json.rect.reduce((pre, item) => {
                            pre[item.name] = json.polyline.reduce((pre2, val) => {
                                return val.name.indexOf(item.name) > -1 ? [...pre2, val.name] : pre2
                            }, [])
                            return pre
                        }, {})
                    }
                }
                console.log('/', json)
                //数据操作，只取shape，style，position，offsetW，offsetH，name,z,zlevel
                Object.keys(json).forEach((val) => {
                    if (!['connect','offsetW','offsetH'].includes(val)) {
                        json[val] = methods.handlerChartTypeJson({ type: val, json: json[val] })
                    }
                })
                console.log('josn2', json)
                return json
            },
            //导出json文件
            exportJson(title = 'zrenderJson') {
                let json = methods.handlerData()
                var data = JSON.stringify(json)
                //encodeURIComponent解决中文乱码
                let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
                //通过创建a标签实现
                let link = document.createElement("a");
                link.href = uri;
                //对下载的文件命名
                link.download = title + ".json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            },
            //reduce操作获取导出数据
            reduceItem(data, obj) {
                let jsonData = Object.keys(data).reduce((pre, item) => {
                    if (Object.keys(pre).includes(item)) {
                        if (data.type == 'rect') {
                            if (item == 'shape') {
                                data[item] = {
                                    x: Math.floor(data[item].x),
                                    y: Math.floor(data[item].y),
                                    width: Math.floor(data[item].width),
                                    height: Math.floor(data[item].height),
                                }
                            }
                        }
                        if (data.type == 'polyline') {
                            if (item == 'shape') {
                                data[item].points = data[item].points.map((val) => {
                                    val = [Math.floor(val[0]), Math.floor(val[1])]
                                    return val
                                })
                            }
                        }
                        pre[item] = data[item]
                    }
                    return pre
                }, obj)
                return jsonData
            },
            closePngSet() {
                state.showPngSet = false
            },
            //导出图片
            toCanvas() {
                let time = setTimeout(() => {
                    let { title = 'picture', colorType, fill } = lodash.cloneDeep(state.pngSetForm)
                    let ele = document.getElementById('zrender')
                    let ignoreElements = [];
                    ignoreElements.push(ele.querySelector('.pngSet'))
                    let eleW = ele.offsetWidth;// 获得该容器的宽
                    let eleH = ele.offsetHeight;// 获得该容器的高
                    let eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
                    let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
                    var canvas = document.createElement("canvas");
                    var abs = 0;
                    let scaleNum = 2
                    let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
                    let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
                    if (win_out > win_in) {
                        // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
                        abs = (win_out - win_in) / 2;    // 获得滚动条宽度的一半
                    }
                    canvas.width = eleW * scaleNum;    // 将画布宽&&高放大两倍
                    canvas.height = eleH * scaleNum;
                    var context = canvas.getContext("2d");
                    context.scale(scaleNum, scaleNum);
                    context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
                    html2canvas(ele, {
                        backgroundColor: colorType == 1 ? null : fill,//透明底
                        dpi: window.devicePixelRatio * 2,
                        // scale:scaleNum,
                        // allowTaint: true,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
                        useCORS: true,  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
                        ignoreElements: (elements) => { //  忽略的ele
                            return ignoreElements.includes(elements);
                        }
                    }).then((canvas) => {
                        let imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        let donwLink = document.createElement('a');
                        donwLink.href = imgUri;
                        donwLink.download = title + '.png'; // 图片名字
                        // donwLink.click();
                        let event = new MouseEvent('click');
                        donwLink.dispatchEvent(event);
                        methods.closePngSet()
                    })
                    clearTimeout(time)
                }, 100)

            },
            saveData(){
                let json = methods.handlerData()
                var data = JSON.stringify(json)
                localStorage.setItem('flowPath',data)
            }
        })
        return {
            ...toRefs(state),
            ...toRefs(methods)
        }
       
}
