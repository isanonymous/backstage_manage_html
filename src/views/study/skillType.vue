<template>
  <div class="block">
    <el-switch v-model="expandTree" @change="expandAll" active-text="展开/收起"></el-switch>
    <span style="margin-left: 12vh;font-size: 14px">提示：右击鼠标对树进行相关操作</span>
    <div style="margin: 10px 0;"></div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 60vh"></el-input>
    <div style="margin: 10px 0;"></div>
    <!--<p>使用 scoped slot</p>-->
    <!--<el-button @click="addTop">添加顶级节点</el-button>-->
    <!--<el-button @click="addChild">添加子节点</el-button>-->
    <!--<el-button @click="delChecked">删除选中节点</el-button>-->
    <el-tree :data="data" node-key="skillTypeId" ref="eltree" :props="{label:'skillTypeName'}"
             default-expand-all :expand-on-click-node="true" @node-contextmenu="rightClickBtn"
             :filter-node-method="filterNode" >
      <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
        <!--<span>{{ node.label }}</span>-->
        <!--  <span>
            <el-button type="text" size="mini" @click="() => append(data)">
              Append
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              Delete
            </el-button>
          </span>-->
      <!--</span>-->
    </el-tree>

    <co-dialog
      :visible.sync="dialogVisible" :modal="false"
      width="10%" height="auto" :top="dialogTop" :left="dialogLeft"
      ><!--:before-close="handleClose">-->
      <div style="padding: 0 20px;" @click="rename"><el-button type="text">重命名</el-button></div>
      <div style="padding: 0 20px;" @click="addTop"><el-button type="text">添加顶级节点</el-button></div>
      <div style="padding: 0 20px;" @click="addChild"><el-button type="text">添加子节点</el-button></div>
      <div style="padding: 0 20px;" @click="delChecked"><el-button type="text">删除选中节点</el-button></div>
      <!--<span>这是一段信息</span>-->
      <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  <!--</span>-->
    </co-dialog>
  </div>
</template>

<script>
  import TreeType from '@/common/constant/TreeType.js'
  import coDialog from '@/components/coDialog.vue'
  let id = 1000;

  export default {
    data() {
      const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1'/*,
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]*/
        }]
      }];
      return {
        expandTree: true,
        filterText: '',
        dialogVisible: false,
        dialogTop:'',
        dialogLeft:'',
        currentNode:{},

//        data: JSON.parse(JSON.stringify(data)),
//        data: JSON.parse(JSON.stringify(data))
        data:[]
      }
    },
    components:{coDialog},
    methods: {
      expandAll(val){
        let allNodes = this.$refs.eltree.store._getAllNodes();
        for(var i=0; i<allNodes.length; i++){
          if(!allNodes[i].isLeaf)
            allNodes[i].expanded = val;
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      filterNode(value, data) {
        if (!value) return true;
//        return data.skillTypeName.indexOf(value) !== -1;
        return data.skillTypeName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
//      append(data) {  // data是当前节点
//        const newChild = { id: id++, label: 'testtest', children: [] };  // 新的节点: id,文本,子节点
//        if (!data.children) {  // 没有子节点时
//          this.$set(data, 'children', []);  //添加一个空[]
//        }
//        data.children.push(newChild);
//      },
//
//      remove(node, data) {  //node:当前节点; data:当前节点的`id,文本,子节点`数据
//        const parent = node.parent;  //当前节点的父节点
//        const children = parent.data.children || parent.data;  //有子节点->返回子节点, 没有->返回节点的data
//        const index = children.findIndex(d => d.id === data.id);
//        children.splice(index, 1);
//      },
      //event: 鼠标点的哪里,asc是否被按下....; data:实体类的属性; node当前点击的节点; arg[4]:vm
//      rightClickBtn(event,data,node,vm) {
      rightClickBtn(event,data) {
        this.dialogLeft=event.clientX+'px'
        this.dialogTop=event.clientY+'px'
        this.dialogVisible = true
        this.currentNodeData=data

      },
      rename() {
        this.dialogVisible=false
        this.$prompt('请输入新的节点名称', '提示', {inputValue:this.currentNodeData.skillTypeName}).then(({ value }) => {
          this.$put('/skillType/rename', {skillTypeName: value, skillTypeId: this.currentNodeData.skillTypeId}).then(resp => {
            this.$commonFn.methods.hintResult(resp, '修改', this.getTreeData, this)
          })
        }).catch(() => {
          this.$message({type: 'info', message: '取消输入'});
        });
      },
      getTreeData() {
        this.$get('/skillTypeTreeList',{params:{treeType:TreeType.SKILL}}).then(resp=>{
//        console.log(typeof(resp.data),"---- ",JSON.stringify(resp.data));
//          console.log(this.data," --");
//          if (this.data){
            this.data=resp.data
//          }
//          console.log(this);
//          return resp.data
        })
      },
      delChecked() {
        this.dialogVisible=false
        this.$confirm('此操作将永久删除节点及子节点, 是否继续?', '提示', {type:'warning'}).then(()=> {
//          let currentNode = this.$refs.eltree.getCurrentNode();
          let currentNode=this.currentNodeData
//        console.log(typeof(currentNode),"---- ",currentNode);
//          this.$refs.eltree.remove(currentNode)
          this.$delete('/skillType/'+currentNode.skillTypeId).then(resp => {
            this.$commonFn.methods.hintResult(resp, '删除', this.getTreeData, this)
          })
//        console.log(JSON.stringify(this.data));
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      addChild() {
//        let currentNode = this.$refs.eltree.getCurrentNode();  //获取当前选中的节点
        let currentNode=this.currentNodeData
//        let currentNode =nodeData || this.$refs.eltree.getCurrentNode();  //获取当前选中的节点
//        console.log(typeof(JSON.stringify(currentNode)),"---- ",JSON.stringify(currentNode));
        if(!currentNode){
          this.$message.warning('请选择节点再进行此操作')
          this.dialogVisible=false
          return
        }
        this.dialogVisible=false
//        const newChild = { id: id++, label: 'testtest', children: [] };  // 新的节点: id,文本,子节点
        this.$prompt('请输入节点名称', '提示', {}).then(({ value }) => {
          this.$post('/skillType', {skillTypeName: value, parent: currentNode.skillTypeId, isLeaf:1}).then(resp => {
            this.$commonFn.methods.hintResult(resp, '添加', this.getTreeData, this)
          })
        }).catch(() => {
          this.$message({type: 'info', message: '取消输入'});
        });
//        this.$refs.eltree.append(newChild,currentNode)
      },
      addTop() {
        this.dialogVisible=false
        this.$prompt('请输入节点名称', '提示', {}).then(({ value }) => {
//          this.$message.success('你的邮箱是: ' + value);
          this.$post('/skillType',{skillTypeName:value,parent:0,isLeaf:1}).then(resp=>{
//            console.log(this.getTreeData);
              this.$commonFn.methods.hintResult(resp,'添加',this.getTreeData,this)
//            if(resp.data.status) {
//              this.$message.success('新增成功')
//              this.getTreeData()
//            }else {
//              this.$message.error('新增失败')
//            }
          })
        }).catch(() => {
          this.$message({type: 'info', message: '取消输入'});
        });
//        let currentNode = this.$refs.eltree.getCurrentNode();
//        let $children = this.$refs.eltree.$children;
//        console.log($children);
//        const newChild = { id: id++, label: 'testtest', children: [] };  // 新的节点: id,文本,子节点
//        this.$refs.eltree.insertAfter(newChild, $children[$children.length-1].node)
      }

      /*renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
        <span>
        <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
        <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
        </span>
        </span>);
      }*/
    },
    watch: {
      filterText(val) {
        /*console.log(this.$refs.areaTree.filter);
        filter: function filter(value) {
          if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
          this.store.filter(value);
        },*/
        this.$refs.eltree.filter(val);
      }
    },
    mounted() {
      this.getTreeData()
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-dialog{
    margin-left: 0px;
  }
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    /*padding-top: 3px;*/
    /*padding-bottom: 3px;*/
    padding: 0px;
  }
</style>
