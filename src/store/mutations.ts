import { storeState , tabs,navbarList } from './store.d'
const mutations = {
    pushTabs(state:storeState,data:tabs){
        state.tabs.push(data)
        state.tabsIndexList.push(data.index)
    },
    fitlerTabs(state: storeState, data:String){
        state.tabs = state.tabs.filter(val => val.index != data)
    },
    getNavbarList(state:storeState,list:Array<navbarList>){
        state.navbarList = list
    },
    getActiveTabs(state: storeState,tabs:string){
        state.activeTabs = tabs
    }
}
export default mutations