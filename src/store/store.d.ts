interface tabs{
    title:string,
    index:string
}
interface navbarList{
    index: string, 
    title: string,
    children:Array<navbarList>
}
interface storeState{
    tabs: Array<tabs>,
    navbarList: Array<navbarList>,
    tabsIndexList:Array<string>,
    tabsNameList:Array<string>,
    activeTabs:string
}
export {
    storeState,
    tabs,
    navbarList
}