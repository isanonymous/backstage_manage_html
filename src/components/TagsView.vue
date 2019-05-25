<template id="">
  <div class="tags-view-container">
    <!--<scroll-panel class="tags-view-wrap">-->
      <router-link v-for="tag in Array.from(visitedviews)" :to="tag.path" :key="tag.path"
                   class="tags-view-item" :class="isActive(tag)?'activeTag':''">
        {{tag.title}}
        <span class='el-icon-close' @click.prevent.stop="delSelectTag(tag)"></span>
      </router-link>
    <!--</scroll-panel>-->
  </div>
</template>

<script>
  import scrollPanel from '@/components/scroll-panel.vue'
  import {mapState,mapGetters} from 'vuex'

  export default {
    data() {
      return {
        msg: 'vue模板页'
      }
    },
    computed:{
//      ...mapState(['visitedviews']),
      ...mapGetters(['visitedviews']),
      visitedViews(){//store中取值
        return this.$store.state.tagsview.visitedviews
      }
    },
    components:{scrollPanel},
    methods:{
      delSelectTag(route){//先提交删除数据的方法,数组删除出掉数据后，如果关闭的是当前打开的路由需要将路由改为数组最后一次push进去的路由
        this.$store.dispatch('delVisitedViews',route).then((views)=>{
          if(this.isActive(route)){//只有在关闭当前打开的标签页才会有影响
            let lastView = views.slice(-1)[0]//选取路由数组中的最后一位
            if(lastView){
              this.$router.push(lastView);
            }else{
              this.$router.push('/welcome');
            }
          }
        })
      },
      isActive(route){
        return route.path == this.$route.path
      },
      addViewTags(){//路由改变时执行的方法
        if(this.$route.name){
          const route = this.$route
          this.$store.dispatch('addVisitedViews',route);
        }
      },
    },
    watch:{
      $route(){
        this.addViewTags();
      }
    },
    created(){

    }
  }
</script>

<style>
  .tags-view-item{
    text-decoration:none;


    /*background-color: rgba(0, 94, 206, 0.1);*/
    background-color: #f7e1e7;
    color: rgb(72, 210, 255);
    border-top-color: rgba(0, 111, 239, 0.2);
    border-right-color: rgba(0, 111, 239, 0.2);
    border-bottom-color: rgba(0, 111, 239, 0.2);
    border-left-color: rgba(0, 111, 239, 0.2);


    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    /*color: #409eff;*/
    color: black;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64,158,255,.2);
    white-space: nowrap;
  }
  .tags-view-item.activeTag{
    background-color: rgba(255, 110, 41,0.8)/*绿色:#00d1b2;*/
  }
</style>
