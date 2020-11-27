import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login-widget'
import Register from '../components/register-widget'
import Home from '../components/Home'
import Hole from "@/components/Hole";
import Index from "@/components/Index";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', redirect: '/index'},
        {
            path: '/index',
            component: Index,
            redirect: '/login',
            children: [
                {path: '/login', component: Login},
                {path: '/register', component: Register}
            ]
        },
        {
            path: '/home',
            component: Home,
            redirect: '/hole',
            children: [
                {path: '/hole', component: Hole},
            ]
        }
    ]
})

export default router
