<template>
  <div class="fillcontain">
    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="店铺地址"
          prop="address">
        </el-table-column>
        <el-table-column
          label="店铺介绍"
          prop="description">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="seeOrder(scope.$index, scope.row)">查看订单</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="Success"
              @click="addFood(scope.$index, scope.row)">添加食品</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              size="mini"
              @click="seeFood(scope.$index, scope.row)">查看食品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
      <el-dialog title="修改店铺信息" :visible.sync="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="店铺名称" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-autocomplete
              v-model="address.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="100px">
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.phone"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" label-width="100px">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商铺图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/shop'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload">
              <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateShop">确 定</el-button>
        </div>
      </el-dialog>
      <my-loading :is-loading="loading"/>
    </div>
  </div>
</template>

<script>
    import myLoading from "../components/loading";
    import api from "../api";

    export default {
        name: "shopList",
        data() {
            return {
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                categoryOptions: [],
                selectedCategory: [],
                address: {},
                loading: false,
                baseImgPath: '//elm.cangdu.org/img/',
                baseUrl: '//elm.cangdu.org'
            }
        },
        created () {
            this.initData()
        },
        methods: {
            async initData () {
                try{
                    var city = await api.cityGuess()
                    this.city = city.data
                    const countData = await api.getResturantsCount()
                    if (countData.data.status == 1) {
                        this.count = countData.data.count
                    }else{
                        throw new Error('获取数据失败')
                    }
                    this.getResturants()
                }catch(err){
                    console.log('获取数据失败', err)
                }
            },
            async getResturants(){
                this.loading = true
                const {latitude, longitude} = this.city
                const restaurants = await api.getResturants({latitude, longitude, offset: this.offset, limit: this.limit})
                this.tableData = []
                this.tableData = [...restaurants.data]
                setTimeout(() => {
                    this.loading = false
                },300)

            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.offset = (val - 1)*this.limit
                this.getResturants()
            },
            seeOrder (index, row) {
                this.$router.push('/layout/orderList?restaurant_id=' + row.id)
            },
            seeFood (index, row) {
                this.$router.push('/layout/foodList?restaurant_id=' + row.id)
            },
            handleEdit(index, row) {
                this.selectTable = row
                this.address.address = row.address
                this.dialogFormVisible = true
                this.selectedCategory = row.category.split('/')
                if (!this.categoryOptions.length) {
                    this.getCategory()
                }
            },
            async getCategory (){
                try{
                    const categories = await api.foodCategory();
                    categories.data.forEach(item => {
                        if (item.sub_categories.length) {
                            const addnew = {
                                value: item.name,
                                label: item.name,
                                children: []
                            }
                            item.sub_categories.forEach((subitem, index) => {
                                if (index == 0) {
                                    return
                                }
                                addnew.children.push({
                                    value: subitem.name,
                                    label: subitem.name,
                                })
                            })
                            this.categoryOptions.push(addnew)
                        }
                    })
                }catch(err){
                    console.log('获取商铺种类失败', err);
                }
            },
            addFood (index, row){
                this.$router.push({ path: 'addGoods', query: { restaurant_id: row.id }})
            },
            async handleDelete (index, row){
                try{
                    const res = await api.deleteResturant(row.id);
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除店铺成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.data.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除店铺失败')
                }
            },
            async updateShop (){
                try{
                    Object.assign(this.selectTable, this.address);
                    this.selectTable.category = this.selectedCategory.join('/');
                    const res = await api.updateResturant(this.selectTable)
                    console.log(res)
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新店铺信息成功'
                        });
                        this.getResturants();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                }catch(err){
                    console.log('更新餐馆信息失败', err);
                }
                this.dialogFormVisible = false
            },
            async querySearchAsync (queryString, cb){
                console.log(queryString)
                if (queryString) {
                    try{
                        const cityList = await api.searchplace(this.city.id, queryString);
                        if (cityList.data instanceof Array) {
                            cityList.data.map(item => {
                                item.value = item.address;
                                return item;
                            })
                            cb(cityList.data)
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
            },
            addressSelect (vale){
                const {address, latitude, longitude} = vale;
                this.address = {address, latitude, longitude};
            },
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path
                }else{
                    this.$message.error('上传图片失败！')
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!')
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!')
                }
                return isJPG && isLt2M
            }
        },
        components: {
            myLoading
        }
    }
</script>

<style scoped>
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
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
<style>
  .table_container .el-button--mini{
    margin: 5px 0px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar-uploader>.el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader>.el-upload:hover{
    border-color: #409EFF;
  }
</style>
