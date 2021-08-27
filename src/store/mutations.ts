import { storeState , tabs,navbarList } from './store.d'
const mutations = {
    pushTabs(state:storeState,data:tabs){
        state.tabs.push(data)
        state.tabsIndexList.push(data.index)
        state.tabsNameList.push(data.title)
    },
    fitlerTabs(state: storeState, data: tabs){
        state.tabs = state.tabs.filter(val => val.index != data.index)
        state.tabsIndexList = state.tabsIndexList.filter(val => val != data.index)
        state.tabsNameList = state.tabsNameList.filter(val => val != data.title)
    },
    getNavbarList(state:storeState,list:Array<navbarList>){
        state.navbarList = list
    },
    getActiveTabs(state: storeState,tabs:string){
        state.activeTabs = tabs
    }
}
export default mutations