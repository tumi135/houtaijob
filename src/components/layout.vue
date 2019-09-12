<template>
  <el-container>
    <el-header :style="{background: color1}">
      <el-row>
        <el-col :xs="8" :sm="11" :md="10">
          <div class='logo' :style="{fontSize: logoSize}">
            <i class="el-icon-tableware":style="{fontSize: logoSize}"></i>
            <span>外卖管理系统</span>
          </div>
        </el-col>
        <el-col :xs="16" :sm="13" :md="14">
          <div class="head-box">
            <el-dropdown @command="handleCommand" menu-align='start' class="block">
              <!--                  <img :src="baseImgPath + adminInfo.avatar" class="avator">-->
              <img :src="baseImgPath + adminInfo.avatar" class="avator">
              <el-dropdown-menu slot="dropdown" :style="{background: color1}">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="signout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 换肤 -->
            <div class="block">
              <span class="demonstration">换肤</span>
              <el-color-picker v-model="color1"></el-color-picker>
            </div>
          </div>

        </el-col>

      </el-row>
    </el-header>
    <el-container>
      <el-aside width="" :style="{background: color1}">
        <el-menu router :background-color="color1" :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <div  @click="changeCollapse" class="collapseButton">
            <i :class="isCollapseIcon" class="isCollapseIcon"></i>
            <span slot="title">{{collapseText}}</span>
          </div>
          <el-menu-item  index="/layout/index">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">数据管理</span>
              </template>
            <el-menu-item index="/layout/userList">用户列表</el-menu-item>
            <el-menu-item index="/layout/shopList">商家列表</el-menu-item>
            <el-menu-item index="/layout/foodList">食品列表</el-menu-item>
            <el-menu-item index="/layout/orderList">订单列表</el-menu-item>
            <el-menu-item index="/layout/adminList">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>
              <span slot="title">添加数据</span>
            </template>
            <el-menu-item index="/layout/addShop">添加商铺</el-menu-item>
            <el-menu-item index="/layout/addGoods">添加商品</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span slot="title">图表</span>
            </template>
            <el-menu-item index="/layout/visitor">用户分布</el-menu-item>
            <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span slot="title">编辑</span>
            </template>
            <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
            <el-menu-item index="/layout/vueEdit">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">设置</span>
            </template>
            <el-menu-item index="/layout/adminSet">管理员设置</el-menu-item>
            <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
          </el-submenu>
          <el-menu-item  index="/layout/explain">
            <i class="el-icon-warning"></i>
            <span slot="title">说明</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main :class="mainClass">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import api from "../api";
    import {mapActions, mapState} from 'vuex'
    export default {
        name: "layout",
        data() {
            return {
                isCollapse: false,
                collapseText: '收起菜单',
                isCollapseIcon: 'el-icon-arrow-right',
                mainClass: 'marginNotCollapse',
                color1: '#ffffff',
                screenWidth: window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth,
                logoSize: '28px',
                baseImgPath: '//elm.cangdu.org/img/'
            };
        },
        mounted (){
            const that = this
            this.getAdminData()
            this.changeSize()
            window.addEventListener('resize', () => {
                return (() => {
                    window.screenWidth = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
                    that.screenWidth = window.screenWidth
                    this.changeSize()
                })()
            })
        },
        computed: {
        ...mapState(['adminInfo'])
        },
        methods: {
            ...mapActions(['getAdminData']),
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            changeSize() {
                if (this.screenWidth < 768) {
                    this.logoSize = '16px'
                } else {
                    this.logoSize = '28px'
                }
            },
            //缩放侧边栏
            changeCollapse() {
                if (this.isCollapse) {
                    this.isCollapse = false
                    this.collapseText = '收起菜单'
                    this.isCollapseIcon = 'el-icon-arrow-left'
                    this.mainClass = 'marginNotCollapse'
                } else {
                    this.isCollapse = true
                    this.collapseText = ''
                    this.isCollapseIcon = 'el-icon-arrow-right'
                    this.mainClass = 'marginCollapse'
                }
            },
            async handleCommand (command) {
                if(command == 'home'){
                    this.$router.push('/layout/index')
                }else if(command == 'signout') {
                    const res = await api.signout()
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '退出成功'
                        });
                        this.$router.push('/');
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                }
            }
        }
    }
</script>

<style scoped>
  .el-header{
    border-bottom: solid 1px #e6e6e6;
    line-height: 60px;
    position: fixed;
    z-index: 99;
    width: 100%;
  }
  .logo{
    font-size: 28px;
    overflow: hidden;
    white-space: nowrap;
    color: #303133;
  }
  .el-icon-tableware{
    font-size: 28px;
  }
  .block{
    display: flex;
    align-items: center;
    height: 60px;
    float: right;
    margin-left: 20px;
  }
  .demonstration {
    padding: 10px;
    font-size: 14px;
  }
  .avator{
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin-right: 37px;
    border: solid 1px #e6e6e6;
  }
  .el-aside{
    position: fixed;
    top: 60px;
    height: 100%;
    border-right: solid 1px #e6e6e6;
    color: #303133;
    background: #ffffff;
  }
  .collapseButton{
    cursor: pointer;
    border-bottom: solid 1px #e6e6e6;
    font-size: 16px;
    color: #303133;
    padding: 0 20px;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 56px;
    line-height: 56px;
    position: relative;
    white-space: nowrap;
    list-style: none;
  }
  .isCollapseIcon{
    border: 1px solid #909399;
    border-radius: 50%;
    margin-right: 5px;
    margin-left: 5px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    color: #909399;
  }
  .el-menu{
    border: 0px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-main{
    margin-top: 60px;
  }
  .marginCollapse{
    margin-left: 65px;
  }
  .marginNotCollapse{
    margin-left: 201px;
  }
</style>
