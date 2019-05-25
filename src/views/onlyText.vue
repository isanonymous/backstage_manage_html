<template>
  <div>
    {{text}}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'vue模板页'
      }
    },
    props:{
      text:String
    }
  }
</script>

<style>

</style>
