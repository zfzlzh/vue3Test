import { Store } from "vuex";

export default <T>(store: Store<T>): void => {
    if (sessionStorage.getItem('store')) {
        store.replaceState(
            Object.assign(
                {},
                store.state,
                JSON.parse(sessionStorage.getItem('store') as string)
            )
        )
        sessionStorage.removeItem("store")
    }
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem("store", JSON.stringify(store.state));
    })
}