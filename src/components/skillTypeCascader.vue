<template>
  <el-cascader expand-trigger="click" :options="options" :props="{value:'skillTypeId',label:'skillTypeName'}"
               v-model="skillTypeCascader" filterable  clearable :show-all-levels="true" placeholder="点击选择, 输入来搜索"
               @click.native="loadCascader" :before-filter="xxx">
  </el-cascader>
</template>

<script>
  import TreeType from '@/common/constant/TreeType.js'

  export default {
    data() {
      return {
        options: [],
//        sel:this.skillTypeCascader
      }
    },
    props:{
//      skillTypeCascader:Array,  //当前选择的
      selected:{
        type:Array, required: false, default:[]
      }
    },
    computed:{
      skillTypeCascader:{
        get() {
//          return this.$store.state.skillTypeCascader
          return this.selected
        },
        set(newVal) {
//          this.$store.dispatch('skillTypeCascader',newVal)
          this.$emit('selectedChange', newVal)
        }
      }
//      lastCascader() {
//        let cascader = this.skillTypeCascader;
//        return cascader.length > 0 ? cascader[cascader.length - 1] : null;
//      }
    },
    methods:{
      xxx(val) {
        console.log(val);
      },
      loadCascader() {
        if(!this.options.length) {
          this.$get('/skillTypeTreeList',{params: {treeType:TreeType.SKILL}}).then(resp => {
            this.options = resp.data
            this.sel=this.skillTypeCascader.toString().split(',')
          })
        }
      },
    },
    mounted() {
//      this.$get('/skillTypeTreeList').then(resp=>{
//        this.data=resp.data
//      })
      this.loadCascader()
    }
  }
</script>

<style scoped>
  .el-cascader{  //默认的不够宽
    width:auto
  }
</style>
