<template>
  <div id="app" class="fillcontain">
    <router-view/>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'App',
    // created() {
    //   axios.post('test/goods/GetShippingNotice',{id: 649}).then(res => {
    //       console.log('结果', res)
    //   })
    // }
}
</script>

<style>
*{
  margin: 0px;
  padding: 0px;
}
html,body{
  height: 100%;
  width: 100%;
}

.fillcontain{
  height: 100%;
  width: 100%;
}
  #app{
    position: relative;
  }
</style>
