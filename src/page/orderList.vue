<template>
  <div class="table_container">
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名" >
                <span>{{ props.row.user_name }}</span>
              </el-form-item>
              <el-form-item label="店铺名称">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="订单 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="总价格"
        prop="total_amount">
      </el-table-column>
      <el-table-column
        label="订单状态"
        prop="status_bar.title">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="20"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>
    <my-loading :is-loading="loading"/>
  </div>
</template>

<script>
    import api from "../api";
    import myLoading from "../components/loading";

    export default {
        name: "userList",
        data() {
            return {
                tableData: [],
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                loading: false,
                restaurant_id: null
            }
        },
        created() {
            this.restaurant_id = this.$route.query.restaurant_id
            this.initData()
        },
        methods: {
            async initData (){
                try{
                    const countData = await api.getOrderCount({restaurant_id: this.restaurant_id})
                    if (countData.data.status == 1) {
                        this.count = countData.data.count
                    }else{
                        throw new Error('获取数据失败')
                    }
                    this.getOrder()
                }catch(err){
                    console.log('获取数据失败', err)
                }
            },
            async getOrder () {
                this.loading = true
                const Order = await api.getOrderLis({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id})
                this.tableData = []
                this.tableData = [...Order.data]
                console.log(this.tableData)
                var that = this
                setTimeout(() => {
                    this.loading = false
                },300)
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getOrder()
            },
        },
        components: {
            myLoading
        }
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
  .table_container{
    padding: 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
