<template>
  <div style="text-align: center">
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: '欢迎来到xx系统 , '+this.$store.state.tagsview.username
      }
    }
  }
</script>

<style>

</style>
