<template>
  <el-container style="height: 100vh; border: 0px solid #eee">  <!--侧边栏-->
    <el-aside width="200px" style="background-color: rgba(215, 103, 137,0.2)">  <!--旧的238, 241, 246-->
      <el-menu router :default-active="defaultActive" active-text-color="rgb(248, 94, 25)">  <!--(导航)菜单-->
        <el-menu-item index="/welcome" :class="level1" style="height: 60px">首页</el-menu-item>

        <!--<el-submenu index="study" :class="level1">-->
        <el-menu-item index="/skillList" :class="level1">需要学习的技术
        </el-menu-item>

        <el-menu-item index="/skillTypeTree" :class="level1">技术类型管理</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header height="40px" style="text-align: right; font-size: 15px;background-color: rgba(64,158,255,0.3);padding-left: 0px">
        <div class="header_container">
          <tags-view></tags-view>
          <div>
            <!-- 全屏显示 -->
            <span class="btn-fullscreen" @click="handleFullScreen">
              <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                <i class="el-icon-rank"></i>
              </el-tooltip>
            </span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-right: 15px;font-size: 20px;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="chPwd">修改密码</el-dropdown-item>
                <el-dropdown-item :command="exit">安全退出</el-dropdown-item>
                <el-dropdown-item :command="about">关于</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>{{username}}</span>
          </div>
        </div>
      </el-header>

      <el-main>
        <!--<keep-alive>-->
          <router-view></router-view>
        <!--</keep-alive>-->
      </el-main>
    </el-container>
    <!--before-close:(右上x按钮)关闭前的回调，会暂停Dialog的关闭-->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" :before-close="about">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import ElSubmenu from "../node_modules/element-ui/packages/menu/src/submenu.vue";
  import onlyText from './views/onlyText.vue'
  import tagsView from '@/components/TagsView.vue'

  export default {
    components: {ElSubmenu,onlyText,tagsView},
    computed: {
      defaultActive(){return this.$route.path;}
    },
    data() {
      return {
        fullscreen: false,
        level1:"menu_level_1",
        username:this.$store.state.tagsview.username,
        dialogFormVisible:false,
        form: {},
        formLabelWidth: '120px'
      }
    },
    created() {
      if(this.$route.name){
        const route = this.$route
        this.$store.dispatch('addVisitedViews',route);
      }
    },
    methods:{
      chPwd(){
        this.dialogFormVisible=true
      },
      doLogout() {
        delete this.$store.state.tagsview.username
        this.$router.push('/login?time='+new Date().getTime())
      },
      exit(){
        this.$confirm('确认退出？', '提示', {type:'warning'}).then(()=> {
          this.$get('/doLogout').then(resp=>{
            this.$commonFn.methods.hintResult(resp, 'msg', this.doLogout, this)
          })

//          this.$message.info('已退出');
        }).catch(() => {
          this.$message.info('操作已取消');
        })
      },
      about(){
        this.$alert('233',{})
      },
      handleCommand(command){
        if(typeof(command) ==="function") {
          command()
        }
      },
      // 全屏事件
      handleFullScreen(){
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      }
    }
  };
</script>

<style>
  html,body{
    padding: 0;
    margin: 0;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .menu_level_1{  /*mmyy*/
    background-color: rgba(64, 158, 255,0.3);
  }
  .el-dialog__close{  /*右上x按钮*/
    font-size: 25px;
  }
  .el-breadcrumb__separator {
    color: #111;
    font-weight: bold;
  }
  .el-dropdown-menu {
    padding: 0;
  }
/*clone https://github.com/bailicangdu/vue2-manage*/
  .header_container{
    /*background-color: #EFF2F7;*/
    /*height: 60px;*/
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
  }
  .avator{
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 37px;
  }
  .el-dropdown-menu__item{
    text-align: center;
  }  /*/clone https://github.com/bailicangdu/vue2-manage*/
  .el-icon-arrow-down{  /*导航文字右边的{^ | v}*/
    font-size: 16px;
    font-weight: bold;
  }
  .btn-fullscreen{
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 20px;
  }
</style>
