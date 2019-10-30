import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'
import locale from 'element-ui/lib/locale'//用element需要引入，其它不需要
Vue.use(VueI18n)
//从localStorage中拿到用户的语言选择，如果没有，那默认中文。
var language = localStorage.getItem('language');
// 获取浏览器语言
var systemLg = navigator.language.split("-").pop().toLowerCase();
console.log(messages[systemLg]);
console.log(language)
const i18n = new VueI18n({
    locale: language || systemLg || 'cn',
    messages,
})
locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换
// 刷新浏览器是初始化默认语言 把当前语言写缓存，其它地方都先从缓存获取语言
localStorage.setItem('language',i18n.locale);
//设置页面默认title,因为这个执行的快所以，先设置了后面有可能会根据页面的title而被改变
document.title = i18n.t('message.pageTitle.title');
export default i18n