<template>
  <div></div>
</template>
<script>
  export default {
    methods:{
      hintResult(resp, operate, refreshFn,vm) {
        let data = resp.data;
        if (data.status) {
          vm.$message.success(operate!=='msg'?operate+'成功':data.msg)
//          data=refreshFn()
          if (refreshFn) {
            refreshFn()
          }
        } else {
          vm.$message.error(operate!=='msg'?operate+'失败':data.msg)
        }
      }
    },
    hintResultByBool(status, operate) {
      if (status) {
        this.$message.success(operate+'成功')
      } else {
        this.$message.error(operate+'失败')
      }
    }
  }
</script>

