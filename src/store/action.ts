// import {useStore} from 'vuex'
// let store = useStore()
import { storeState, tabs, navbarList } from './store.d'
const actions = {
    handlerTabs({ commit, state }, data: tabs){
        if (state.tabsIndexList.includes(data.index)) {
            commit('pushTabs',data)
        }else{
            commit('getActiveTabs',data.index)
        }
    }
}
export default actions