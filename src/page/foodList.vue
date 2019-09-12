<template>
    <div class="foodList">
      <el-table
        :data="tableData"
        @expand-change='expand'
        :row-key="getRowKeys"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="食品 ID">
                <span>{{ props.row.item_id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="食品介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
              <el-form-item label="食品评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="食品分类">
                <span>{{ props.row.category_name }}</span>
              </el-form-item>
              <el-form-item label="月销量">
                <span>{{ props.row.month_sales }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="食品名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="食品介绍"
          prop="description">
        </el-table-column>
        <el-table-column
          label="评分"
          prop="rating">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
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
      <el-dialog title="修改食品信息" :visible.sync="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="食品名称" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="食品介绍" label-width="100px">
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item label="食品分类" label-width="100px">
            <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/food'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload">
              <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-row style="overflow: auto; text-align: center;">
          <el-table
            :data="specs"
            style="margin-bottom: 20px;"
            :row-class-name="tableRowClassName">
            <el-table-column
              prop="specs"
              label="规格">
            </el-table-column>
            <el-table-column
              prop="packing_fee"
              label="包装费">
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteSpecs(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="specsFormVisible = true" style="margin-bottom: 10px;">添加规格</el-button>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateFood">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加规格" :visible.sync="specsFormVisible">
        <el-form :rules="specsFormrules" :model="specsForm">
          <el-form-item label="规格" label-width="100px" prop="specs">
            <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="包装费" label-width="100px">
            <el-input-number v-model="specsForm.packing_fee" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="价格" label-width="100px">
            <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specsFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addspecs">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import api from "../api";
    import myLoading from "../components/loading";
    export default {
        name: "foodList",
        data() {
            return {
                baseImgPath: '//elm.cangdu.org/img/',
                baseUrl: '//elm.cangdu.org',
                tableData: [],
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                loading: false,
                restaurant_id: null,
                selectTable: {},
                dialogFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
                specsForm: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                },
                specsFormrules: {
                    specs: [
                        { required: true, message: '请输入规格', trigger: 'blur' },
                    ],
                },
                specsFormVisible: false,
                expendRow: [],
                selectedBox: [],
            }
        },
        created () {
                this.restaurant_id = this.$route.query.restaurant_id
                this.initData()
        },
        computed: {
            specs: function (){
                let specs = [];
                if (this.selectTable.specfoods) {
                    this.selectTable.specfoods.forEach(item => {
                        specs.push({
                            specs: item.specs_name,
                            packing_fee: item.packing_fee,
                            price: item.price,
                        })
                    })
                }
                return specs
            }
        },
        methods: {
            async initData () {
                try{
                    const countData = await api.getFoodsCount({restaurant_id: this.restaurant_id})
                    if (countData.data.status == 1) {
                        this.count = countData.data.count
                    }else{
                        throw new Error('获取数据失败')
                    }
                    this.getFood()
                }catch(err){
                    console.log('获取数据失败', err)
                }
            },
            async getFood () {
                this.loading = true
                const Food = await api.getFoods({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id})
                this.tableData = []
                this.tableData = [...Food.data]
                var that = this
                setTimeout(() => {
                    this.loading = false
                },300)
            },
            expand(row, status){
                if(this.selectedBox.indexOf(row.item_id) == -1){
                    this.selectedBox.push(row.item_id)
                }
                this.getSelectItemData(row)
            },
            async getSelectItemData(row, type){
                const restaurant = await api.getResturantDetail(row.restaurant_id);
                const category = await api.getMenuById(row.category_id)
                const item_id = row.item_id
                this.selectTable = {...row, ...{restaurant_name: restaurant.data.name, restaurant_address: restaurant.data.address, category_name: category.data.name}};
                this.selectMenu = {label: category.data.name, value: row.category_id}
                const index = this.tableData.findIndex(function (item) {
                    return item.item_id == item_id
                })
                this.tableData.splice(index, 1, {...this.selectTable});
                if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
                    this.getMenu();
                }
            },
            async getMenu () {
                this.menuOptions = [];
                try{
                    const menu = await api.getMenu({restaurant_id: this.selectTable.restaurant_id, allMenu: true});
                    menu.data.forEach((item, index) => {
                        this.menuOptions.push({
                            label: item.name,
                            value: item.id,
                            index,
                        })
                    })
                }catch(err){
                    console.log('获取食品种类失败', err);
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getFood()
            },
            getRowKeys (row) {
                return row.item_id
            },
            handleEdit (index, row) {
                this.getSelectItemData(row, 'edit')
                this.dialogFormVisible = true
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
            },
            handleSelect (index) {
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
            },
            async updateFood () {
                this.dialogFormVisible = false;
                try {
                    const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                    const updateFood = await api.updateFood({...this.selectTable,...subData})
                    if (updateFood.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新食品信息成功'
                        });
                        this.getFood();
                    }else {
                        this.$message({
                            type: 'error',
                            message: updateFood.data.message
                        });
                    }
                }catch (e) {
                    console.log(e)
                }
            },
            deleteSpecs (index) {
                this.specsForm.splice(index,1)
            },
            async handleDelete (index, row) {
                try{
                    const res = await api.deleteFood(row.item_id);
                    console.log(res)
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除食品成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除食品失败')
                }
            },
            tableRowClassName () {

            },
            addspecs () {
                this.space.push({...this.specsForm})
                this.specsForm.specs = '';
                this.specsForm.packing_fee = 0;
                this.specsForm.price = 20;
                this.specsFormVisible = false;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
