import Vue from 'vue'
import Router from 'vue-router'

// import javaFrameEdit from './views/study/javaFrameEdit.vue'
// import javaFramesList from './views/study/javaFramesList.vue'
// import javaBaseList from './views/study/javaBaseList.vue'
// import javaBaseEdit from './views/study/javaBaseEdit.vue'

import adjacentTree from './views/area/adjacentTree.vue'
// import login from './views/login.vue'
import store from '@/store/store.js'
import axios from 'axios'

Vue.use(Router)

const router = new Router({
  routes:[
    {
      path:'/test',
      name:'test',
      component:()=>import('@/test/dongTai_addNode.vue')
    },
    {
      path:'/testtags',
      name: 'tags',
      component:()=>import('@/components/TagsView.vue')
    },
    {
      path:'/',
      redirect:'/login',
      meta:{direct:true},
      // component:()=>import('@/views/home.vue')
      // component:()=>import('@/views/login.vue')
    },
    {
      path:'/login',
      name:'login',
      meta:{title:'登陆', direct:true},
      component:()=>import('@/views/login.vue')
    },
    {
      path:'/manage',
      name:'manage',
      // component:()=>import('@/views/home.vue')
      component:()=>import('@/manage.vue'),
      children: [
    // },
    {
      path:'/welcome',  //首页
      name:'welcome',
      meta:{title:'欢迎页'},
      component:()=>import('@/views/study/welcome.vue')
    },
    {
      path:'/skillTypeTree',
      name: 'skillTypeTree',
      meta:{title:'技术类型管理'},
      component:()=>import('@/views/study/skillType.vue')
    },
    {
      path:'/skillList',  //技能list表格
      name: 'skillTable',
      meta:{title:'需要学习的技术'},
      component:()=>import('@/views/study/javaFramesList.vue')
    },

    {
      path:'/area/adjacent/Tree',
      name:'area',
      meta:{title:'区域树'},
      component:adjacentTree
    },

    /*————————————————————————————————————————————————————————————*/
    // {
    //   path:'/study/java/base',
    //   // component:javaBaseList
    //   component:()=>import('@/views/study/javaBaseList.vue')
    // },
    // {
    //   path:'/study/java/base/edit',
    //   component:()=>import('@/views/study/javaBaseEdit')
    // },
    // {
    //   path:'/study/java/frame',
    //   component:()=>import('@/views/study/javaFramesList')
    // },
    // {
    //   path:'/study/java/frame/edit/:wzId',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/java/frame/add',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/db/mysql',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/webpage/es',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/webpage/vue',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/webpage/webpack',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/common/data-structure',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/common/algorithm',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },
    // {
    //   path:'/study/common/pattern',
    //   component:()=>import('@/views/study/javaFrameEdit')
    // },

    ]},
  ]
})
//to:即将要进入的目标路由对象, from:当前导航正要离开的路由
//next(): 进行管道中的下一个钩子

//next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址
router.beforeEach((to, from, next) => {
  // nprogress.start()
  if (to.meta.direct) {  //直接进入的
    next()
  }else {
    if (store.state.tagsview.username) {  // 通过vuex state获取当前的token是否存在
      // console.log(typeof(store.state),"--store.state-- ",JSON.stringify(store.state));
      next();
      return
    }
    // console.log(typeof(this),"--this-- ",this);
    axios.get('/doLogin').then(resp=>{
      // console.log(typeof(resp),"--router..axios..resp-- ",resp);
      if (resp.data.status==1) {
        store.state.tagsview.username=resp.data.data
      }
      if (store.state.tagsview.username) {  // 通过vuex state获取当前的token是否存在
        // console.log(typeof(store.state),"--store.state-- ",JSON.stringify(store.state));
        next();
      }
      else {
        next({
          path: '/login',
          query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    }).catch(err=>{
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    })
  }
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  // nprogress.done()
})

export default router
