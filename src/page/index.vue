<template>
  <div class="myIndex">
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{adminCount}}</span> 新增管理员</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allUserCount}}</span> 注册用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allOrderCount}}</span> 订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allAdminCount}}</span> 管理员</div></el-col>
      </el-row>
    </section>
    <index-echarts :sevenDate='sevenDate' :sevenDay='sevenDay'/>
    <my-loading :is-loading="loading"/>
  </div>
</template>

<script>
  import dtime from 'time-formater'
  import api from '../api'
  import indexEcharts from "../components/indexEcharts";
  import myLoading from "../components/loading";
  export default {
        name: "index",
        data(){
            return {
                userCount: null,
                orderCount: null,
                adminCount: null,
                allUserCount: null,
                allOrderCount: null,
                allAdminCount: null,
                sevenDay: [],
                sevenDate: [[],[],[]],
                loading: false
            }
        },
        components: {
            indexEcharts,
            myLoading
        },
        created() {
            this.loading = true
            this.init()
            for (let i = 6; i > -1; i--) {
                const date = dtime(new Date().getTime() - 86400000*i).format('YYYY-MM-DD')
                this.sevenDay.push(date)
            }
            this.getSevenData()
        },

        methods: {
            async init () {
                const today = dtime().format('YYYY-MM-DD')
                await Promise.all([api.userCount(today), api.orderCount(today), api.adminDayCount(today), api.getUserCount(), api.getOrderCount(), api.adminCount()]).then(res => {
                    this.userCount = res[0].data.count;
                    this.orderCount = res[1].data.count;
                    this.adminCount = res[2].data.count;
                    this.allUserCount = res[3].data.count;
                    this.allOrderCount = res[4].data.count;
                    this.allAdminCount = res[5].data.count;
                })
            },
            async getSevenData(){
                const apiArr = [[],[],[]];
                this.sevenDay.forEach(item => {
                    apiArr[0].push(api.userCount(item))
                    apiArr[1].push(api.orderCount(item))
                    apiArr[2].push(api.adminDayCount(item))
                })
                const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
                await Promise.all(promiseArr).then(res => {
                    const resArr = [[],[],[]];
                    res.forEach((item, index) => {
                        if (item.data.status == 1) {
                            resArr[Math.floor(index/7)].push(item.data.count)
                        }
                    })
                    this.sevenDate = resArr;
                }).catch(err => {
                    console.log(err)
                })
                var that = this
                setTimeout(() => {
                    this.loading = false
                },300)
            }

        }
    }
</script>

<style scoped>
  @import "../assets/css/comment.css";
  .myIndex{
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: center;*/
  }
  .data_section {
    padding: 20px;
    margin-bottom: 40px;
  }
  .data_section .el-row{
    display: flex;
    justify-content: center;
  }
  .section_title{
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #E5E9F2;
  }
  .data_num{
    color: #333;
    font-size: 26px;
  }
  .head{
    border-radius: 6px;
    font-size: 22px;
    padding: 4px 0;
    color: #fff;
    display: inline-block;
  }
  .today_head{
    background: #FF9800;
  }
  .all_head{
    background: #20A0FF;
  }
  .wan{
    font-size: 16px;
    color: #333;
  }

</style>
