<template>
  <div class="loading" v-show="isLoading">
    <i class="el-icon-loading"></i>
  </div>
</template>

<script>
    export default {
        name: "loading",
        props: ['isLoading']
    }
</script>

<style scoped>
  .loading{
    width: 100%;
    height: 100%;
    background: #ffffff;
    opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .el-icon-loading{
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    font-size: 28px;
    color: #333333;
  }
</style>
