<template>
  <div>
    <el-form ref="form" :model="searchForm" label-width="auto" @submit.native.prevent="doSearch">
      <el-row :gutter="20">  <!--gutter:栅格间隔-->
        <el-col :span="8">  <!--span:栅格占据的列数,默认24-->
          <el-form-item label="技能名"><el-input v-model="searchForm.frameName" size="small" clearable></el-input></el-form-item>
        </el-col>
        <el-col :span="8">
          <!--<el-form-item label="框架作者"><el-input v-model="searchForm.frameAuthor" size="small"></el-input></el-form-item>-->
          <el-form-item label="最后更新时间">
            <!--<el-date-picker v-model="searchForm.lateUpdDate" type="datetime" placeholder="选择日期时间"></el-date-picker>-->
            <el-date-picker v-model="searchForm.lateUpdDate" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期"
                            :default-time="['00:00:00','23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!--<el-form-item label="框架分类"><el-input v-model="searchForm.frameType" size="small"></el-input></el-form-item>-->
          <el-form-item label="技能分类">
            <!--expand-trigger:次级菜单的展开方式{click|hover}; options:数据,类似treeData;
                show-all-levels:是否显示完整的路径,默认true; filterable:可搜索; change-on-select:是否允许选择任意一级的选项,默认false; -->
            <el-cascader expand-trigger="click" :options="options" :props="{value:'skillTypeId',label:'skillTypeName'}"
                         v-model="searchForm.frameTypeCasCader" filterable  clearable :show-all-levels="true" placeholder="点击选择, 输入来搜索"
                         @change="handleChange" @click.native="loadCascader">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12"></el-col>
        <el-col :span="1" :offset="20">  <!--offset:栅格左侧的间隔格数,默认0-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" native-type="submit">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!--<my-confirm title="标题" content="内容" type="error" :myThen="myLog" :myCatch="myCatch"></my-confirm>-->
    <!--<el-button @click="testt">myConfirmBox</el-button>-->
    <el-button-group>
      <el-button type="primary" size="mini" @click="$router.push('/study/java/frame/add')" icon="el-icon-plus"></el-button>
      <el-button type="primary" size="mini" @click="delChecked" icon="el-icon-delete"></el-button>
    </el-button-group>

    <el-table :data="tableData" ref="tbl" stripe  highlight-current-row  tooltip-effect="dark"
              @selection-change="currAllCheckRow" @row-click="checkThisRow">
      <!--行展开后的内容模板-->
      <el-table-column type="expand">
        <template slot-scope="props">
          <!--<el-form label-position="left">
            <el-form-item label="日期"><span>{{props.row.title}}</span></el-form-item>
            <el-form-item label="姓名"><span>{{props.row.content}}</span></el-form-item>
            <el-form-item label="地址"><span>{{props.row.wz_id}}</span></el-form-item>
          </el-form>-->
          <el-row>
            <el-col :span="6" :push="2"><p><span class="jiaCu">技能名:</span></p> </el-col>
            <el-col :span="6"><p> {{props.row.title}}</p> </el-col>

            <el-col :span="6" :push="1"><p><span class="jiaCu">内容:</span></p> </el-col>
            <el-col :span="6" :pull="3"><p>{{props.row.content}}</p> </el-col>

            <el-col :span="6" :push="2"><p><span class="jiaCu">最后更新时间:</span></p> </el-col>
            <el-col :span="6"><p>{{props.row.lateUpdDate}}</p> </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!--stripe:斑马纹-->
      <!--<el-table :data="props.row" @selection-change="currAllCheckRow" @row-click="checkThisRow"-->
                <!--ref="tbl" stripe highlight-current-row tooltip-effect="dark">-->
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="title" label="标题" width="140"></el-table-column>
        <el-table-column prop="content" label="内容" width="120"></el-table-column>
        <el-table-column prop="lateUpdDate" label="最后更新时间"></el-table-column>
        <el-table-column prop="skillType.skillTypeName" label="技能类型名"></el-table-column>
        <!--<el-table-column prop="wzId" label="最后更新时间"></el-table-column>-->

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      <!--</el-table>-->
    </el-table>

    <div class="block" style="margin-top: 2vh">
      <!--prev:上一页，next:下一页，pager:页码列表，total:共xxx条，sizes:xxx条/页，jumper:前往xx页-->
      <el-pagination layout="total,prev,pager,next,sizes,jumper,->" :total="count" background
                     :current-page="pageInfo.current" :page-sizes="[2,10, 20, 30, 50]" :page-size="pageInfo.size"
                     @size-change="pageSizeCh" @current-change="pageNumCh" @prev-click="pageNumCh" @next-click="pageNumCh">
        <!--@size-change="pageSizeCh" @current-change="pageNumCh" @prev-click="prevPage" @next-click="nextPage">-->
        <!--这四个方法的回调函数的参数, 都是改变后的结果(页大小,第几页)-->
      </el-pagination>

      <!--<span class="demonstration">完整功能</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>-->
    </div>
  </div>
</template>

<script>
  //  import myConfirm from '../components/Confirm.vue'
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  import TreeType from '@/common/constant/TreeType.js'

  export default {
    components: {ElCol, ElRow},
    data() {
      return {
//        tableData: Array(20).fill(item)  // 把item复制20次,并返回一个数组
        tableData:[],  //表数据
        count:0,  //总记录数
        pageInfo:{current:1, size:10},  //页号和页max行数,
        allCheckRow:[],  //已选中行
        searchForm:{},  //条件搜索的表单
        options:[],  //框架分类级联选择器
      }
    },
//    components:{myConfirm},
    methods:{
      loadCascader() {
        if(!this.options.length) {
          this.$get('/skillTypeTreeList',{params: {treeType:TreeType.SKILL}}).then(resp => {
            this.options = resp.data
          })
        }
      },
      handleChange(value) {  //框架分类级联选择器
        console.log(value);
      },
      doSearch(){
        console.log(typeof(233),"--233-- ",233);
        let frameType = this.searchForm.frameTypeCasCader;
        if (frameType) {
          this.searchForm.frameType = frameType[frameType.length - 1]
        }
        this.$get('/api/study/java/frameList',{params:this.searchForm}).then(resp=>{
          let respData = resp.data;
          this.tableData=respData.records
          this.count=parseInt(respData.total)
        })
      },
      pageSizeCh(pageSize) {  //页大小改变, pageSize为改变后的值
        this.pageInfo.size = pageSize;
        this.fetch();
      },
      pageNumCh(Page) {  //页号改变, Page为改变后的值
        this.pageInfo.current = Page;
        this.fetch();
      },
//      prevPage(Page){this.pageInfo.pageNum=Page;this.fetch();console.log("---- 上一页",Page );},
//      nextPage(Page){this.pageInfo.pageNum=Page;this.fetch();console.log("---- 下一页",Page );},
//      testt(){new myConfirm().myConfirm()},
//      myLog(){console.log('myLog((===========');},
//      myCatch(){console.log('myCatch((===========');},

      /** 从服务器获取数据*/
      fetch(){
//        this.$get('/api/study/java/frameList',{params: {pageInfo:this.pageInfo}}).then(resp=>{
        this.$get('/api/study/java/frameList',{params:this.pageInfo}).then(resp=>{
          let respData = resp.data;
          this.tableData=respData.records
//          console.log(typeof(respData.records),"---- ",respData.records);
          this.count=parseInt(respData.total)///          console.log(typeof(this.tableData),"---- ",this.tableData);
        })
      },
      handleEdit(idx, row){  //跳转到编辑页面
        this.$router.push('/study/java/frame/edit/'+row.wzId)
      },
      handleDelete(idx, row){  //删除当前行
//        console.log(idx,10010,row);  //1  10010  {当前行的tableData数据}
//        this.$message(`删除第${idx+1}行   ${row.wz_id}`)
        this.$confirm('此操作将永久删除文章, 是否继续?', '提示', {type:'warning'}).then(()=> {

          //md不懂了,data:row.wzId不行, data:[row.wzId]就可以
          this.$delete('/api/study/java/frame/'+row.wzId).then(resp => {
//          this.$delete('/api/study/java/frame/'+row.wz_id, {data: [row.wz_id]}).then(resp => {
            this.hintResult(resp,'删除')
            this.fetch()
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      checkThisRow(row) {  //选择当前行
        let tbl = this.$refs['tbl'];  //根据ref获取表格
        tbl.toggleRowSelection(row)  //[不]选中当前行的checkbox
        tbl.toggleRowExpansion(row)  //[不]展开当前行
//        console.log(this.tableData);
      },
      currAllCheckRow(val){  //目前所有选中行
//        console.log(val);  //[{选中行的tableData数据},{选中行的tableData数据}....]
        this.allCheckRow=val;
      },
      delChecked(){  //删除选中的
        if (this.allCheckRow.length===0){
          this.$message.warning('请选择要删除的数据')
          return
        }
        let map = this.allCheckRow.map(el=>el.wzId);  //只要id
        // 注意: 这里参数的k一定为data
        this.$delete('/api/study/java/frame',{data:map}).then(resp=>{
          this.hintResult(resp,'删除')
          this.fetch()
        })
      },
      hintResult(resp, operate) {
        if (resp.data.status) {
          this.$message.success(operate+'成功')
        } else {
          this.$message.error(operate+'失败')
        }
      }
    },
    created(){
      this.fetch()
    }
  };
</script>

<style scoped>
  .el-checkbox__inner{  /*修改checkbox的样式*/
    border: 1px solid #777;
  }
  .el-table__expanded-cell[class*=cell]{  /*行展开后的内容*/
    padding:10px 50px;
  }
  .el-form-item{  /*行展开后的内容的某行*/
    /*margin-left: 9vh;*/
    margin-bottom:6px;
  }
  .el-form-item__label{  /*行展开后的内容的某行的label*/
    font-size: 15px;
    font-weight: bold;
    padding-right:25px;
  }
  .el-col p{  /*行展开后的内容的某行*/
    margin:6px;
  }
  .input85{
    width:85%;
  }
  .jiaCu{
    font-weight: bold;
  }
  /*input.el-range-input{*/
    /*width: 50px;*/
  /*}*/
  .el-date-editor--daterange{
    width: 270px;
  }
</style>
