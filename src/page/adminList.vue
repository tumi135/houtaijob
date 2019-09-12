<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="user_name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="注册日期"
        width="220">
      </el-table-column>
      <el-table-column
        prop="city"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="admin"
        label="权限">
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
                loading: false
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async initData (){
                try{
                    const countData = await api.adminCount()
                    if (countData.data.status == 1) {
                        this.count = countData.data.count
                    }else{
                        throw new Error('获取数据失败')
                    }
                    this.getAdmin()
                }catch(err){
                    console.log('获取数据失败', err)
                }
            },
            async getAdmin () {
                this.loading = true
                const Admin = await api.adminList({offset: this.offset, limit: this.limit})
                this.tableData = []
                this.tableData = [...Admin.data.data]
                console.log(98745)
                console.log(Admin)

                var that = this
                setTimeout(() => {
                    this.loading = false
                },300)
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getUsers()
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
</style>
