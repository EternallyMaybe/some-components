import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import routes from './routes'
Vue.use(VueRouter);
var router = new VueRouter(routes);

new Vue({
    el: '#app',
    router,
    render: (h) => h(App)
});