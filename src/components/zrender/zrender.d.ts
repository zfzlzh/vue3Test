interface position{
    
}
interface shapeRect{
    x:string | number,
    y:string | number,
    width:string | number,
    height:string | number,
}
interface shapePolyline{
    points:Array<Array<number| string>>
}
interface shapeCircle{
    cx: string | number,
    cy: string | number,
    r: string | number
}
interface shapeEllipse {
    cx: string | number,
    cy: string | number,
    rx: string | number,
    ry: string | number,
}
interface shapeBezier{
    x1: string | number,
    x2: string | number,
    y1: string | number,
    y2: string | number,
    cpx1: string | number,
    cpx2: string | number,
    precent:Array<number | string>
}
interface style extends shapeRect{
    [propName: string]:any
}
interface item{
    position: position,
    shape: Object,
    style: style,
    chartType:string
}
interface ratio{
    x:string | number,
    y:string | number
}
interface obj{
    item:item,
    ratio:ratio, 
    index:string | number
}
export {
    obj,
    item,
    ratio,

}
