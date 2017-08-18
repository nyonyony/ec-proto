import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Products from '@/components/Product/Products'
import CreateMeetup from '@/components/Meetup/CreateMeetup'
import Profile from '@/components/User/Profile'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'
import Product from '@/components/Product/Product'
import CustomerProducts from '@/components/Product/CustomerProducts'
import Plans from '@/components/Plan/Plans'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/meetup/new',
      name: 'Meetup',
      component: CreateMeetup
    },
    {
      path: '/products/:id',
      name: 'Product',
      props: true,
      component: Product
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/plans',
      name: 'Plans',
      component: Plans
    },
    {
      path: '/customer-products',
      name: 'CustomerProducts',
      component: CustomerProducts
    }
  ],
  mode: 'history'
})
