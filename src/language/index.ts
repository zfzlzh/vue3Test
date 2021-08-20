import { createI18n } from 'vue-i18n'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import selfEn from './en'
import selfZhCn from './zh-cn'
const messages = {
    [enLocale.name]: {
        // el 这个属性很关键，一定要保证有这个属性，
        el: enLocale.el,
        // 定义你自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
        message: {
            hello: 'hello world',
            ...selfEn
        },
    },
    [zhLocale.name]: {
        el: zhLocale.el,
        // 定义你自己的字典，但是请不要和 `el` 重复，这样会导致 ElementPlus 内部组件的翻译失效.
        message: {
            hello: '你好，世界',
            ...selfZhCn
        },
    },
    testLocale: {
        el: {},
        // 没有定义 message 字段，会 fallback 回到 en 去, fallbackLocale 的定义在下方 👇
    },
}
const localSto:string | null = localStorage.getItem('language') ? localStorage.getItem('language') : ''
const localLanguage:Array<string> = localSto?.split('_') || []
const i18n = createI18n({
    locale: localLanguage[0] || zhLocale.name,
    fallbackLocale: zhLocale.name,
    messages: messages ? messages : {},
})
export default i18n