<template>
  <!--ref:?用于定义一个表单??-->
  <el-form ref="wzform" :model="form" label-width="100px" @submit.native.prevent="savewz('wzform')"
           :rules="myrule" >
    <el-form-item label="文章标题" prop="title">  <!--没有prop属性就不能进行表单验证-->
      <el-input v-model="form.title" :autofocus="true"></el-input>
    </el-form-item>

    <el-form-item label="文章内容" prop="content">
      <el-input type="textarea" size="medium" :rows="6" v-model="form.content"></el-input>
    </el-form-item>

    <!--<el-form-item label="最后更新时间">-->
    <!--<el-date-picker v-model="form.lateUpdDate" :readonly="wzId.length>0" type="datetime" placeholder="选择日期时间"></el-date-picker>-->
    <!--</el-form-item>-->

    <el-form-item label="技术类型">
      <skill-type-cascader :selected="selectedCascader" @selectedChange="selectedChange"></skill-type-cascader>
    </el-form-item>

    <!--<el-form-item label="文章内容">
      <quill-editor v-model="content" ref="myQuillEditor" class="editer"
                    :options="editorOption" @ready="onEditorReady($event)"></quill-editor>
    </el-form-item>-->

    <!--富文本-->
    <!--<el-form-item label="NOTE"><Editor v-model="article.content"/></el-form-item>-->

    <el-form-item>
      <!--<el-button type="primary" @click="onSubmit">保存</el-button>-->
      <el-button type="primary" native-type="submit">保存</el-button>
      <el-button @click.native="$router.back">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  //  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  import Editor from '../Editor.vue'
  import skillTypeCascader from '@/components/skillTypeCascader.vue'
  import {mapState,mapGetters} from 'vuex'
  export default {
    data() {
      return {
        article:{},
//        editorOption:{},
        wzId:"",
        selectedCascader:[],
        form: {
          title:"",
          content:"",
//          lateUpdDate:null,
//          skillType:{}
        },
//        skillTypeCascader:[]
        myrule:{
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'},
            {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入文章内容', trigger: 'blur'},
            {min: 1, max: 999, message: '长度在 1 到 999 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    computed:{
      ...mapState(['skillTypeCascader']),
      ...mapGetters(['lastCascader']),
    },
    components:{Editor,skillTypeCascader},
    methods: {
//      onEditorReady(editor) {console.log('editor ready!', editor)},
      returnList(){
        this.$router.push('/study/java/frame')
      },
      selectedChange(newVal) {
        this.selectedCascader=newVal
      },
      savewz(formName) {  //保存文章
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            alert('submit!');
//            return false;

//        let axios = this.$axios.create({
//          headers: {'X-Custom-Header': 'foobar'}
//        });
//        console.log(typeof(this.lastCascader),"---- ",this.lastCascader);
//        return
            let selectedCascader = this.selectedCascader;
            if (selectedCascader) {
              this.form.skillType={}
              this.form.skillType.skillTypeId = selectedCascader[selectedCascader.length-1]
              this.form.skillType.fullParent = selectedCascader.filter((item,idx) => idx!=(selectedCascader.length-1))
            }
            //        if (this.form.lateUpdDate) {
            //          this.form.lateUpdDate = this.form.lateUpdDate.getTime()
            //        }
            console.log(typeof(this.form),"---- ",this.form);
            if (this.wzId) {  //修改
              this.$put(`/api/study/java/frame/${this.wzId}`,this.form).then(resp=>{
                if(resp.data.status) {
                  this.$message.success('修改成功')
                  this.returnList()
                }else {
                  this.$message.error('修改失败')
                }
              })
            }else {  //新增
              this.$post("/api/study/java/frame",this.form).then(resp=>{
                if(resp.data.status) {
                  this.$message.success('新增成功')
                  this.returnList()
                }else {
                  this.$message.error('新增失败')
                }
                //            this.$router.push('/wz/list')
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        /*this.$message({
          message:'保存成功',  //消息文字
          type:'success',  //success/warning/info/error
          duration:2000,  //显示时间, 毫秒。设为0则不会自动关闭	,默认3000
//          showClose:true,  //是否显示关闭按钮,默认false
        })*/

        /*this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          callback:(confrim)=>{this.$message('confrim');this.$router.push('/wz/list')}
        })*/
      },
      onSubmit() {
        console.log('submit!');
      }
    },
    created(){
      this.wzId = this.$route.params.wzId;  //获取当前路由参数
      if(this.wzId) {  //有id则为编辑页面
        //从服务器获取数据
        this.$get('/api/study/java/frame/'+this.wzId).then(resp=>{
          console.log(typeof(resp.data),"---- ",resp.data);
          this.form=resp.data
          var st=this.form.skillType=resp.data.skillType
          if (st) {
            st.skillTypeId = resp.data.skillType.skillTypeId
            this.selectedCascader=[...(st.fullParent),st.skillTypeId]
          }
//          this.$store.dispatch('skillTypeCascader',[st.parent,st.skillTypeId])
        })
      }
    }
  }
</script>

<style>
  .edit_container{
    padding: 40px;
    margin-bottom: 40px;
  }
  .editer{
    height: 350px;
  }
</style>
