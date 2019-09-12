<template>
    <div class="addGoods">
      <el-row>
        <el-col :span="14" :offset="5">
          <header class="form_header">选择食品种类</header>
          <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form" :rules="categorysRule">
            <el-row class="category_select">
              <el-form-item label="食品种类" prop="categorySelect">
                <el-select v-model="categoryForm.categorySelect" placeholder="请选择食品种类" style="width:100%;">
                  <el-option
                    v-for="item in categoryForm.categoryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-form>
          <el-form :model="addCategoryForm" ref="addCategory" label-width="110px" class="form addCategory" :rules="addCategoryRules">
            <el-row class="add_category_row" :class="showAddCategory? 'showEdit': ''">
              <div class="add_category">
                <el-form-item label="食品种类" prop="addCategoryName">
                  <el-input v-model="addCategoryForm.addCategoryName"></el-input>
                </el-form-item>
                <el-form-item label="种类描述" prop="description">
                  <el-input v-model="addCategoryForm.description"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitcategoryForm('addCategory')">提交</el-button>
                </el-form-item>
              </div>
            </el-row>
            <div class="add_category_button" @click="addCategoryFun">
              <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i>
              <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
              <span>添加食品种类</span>
            </div>
          </el-form>

<!--          </el-form>-->
          <header class="form_header">选择食品种类</header>
          <el-form  :model="foodForm" ref="foodForm" label-width="110px"  class="form food_form">
            <el-form-item label="食品名称" prop="name" :rules="{ required: true, message: '请输入食品名称', trigger: 'blur' }">
              <el-input v-model="foodForm.name"></el-input>
            </el-form-item>
            <el-form-item label="食品活动" prop="activity">
              <el-input v-model="foodForm.activity"></el-input>
            </el-form-item>
            <el-form-item label="食品详情" prop="description">
              <el-input v-model="foodForm.description"></el-input>
            </el-form-item>
            <el-form-item label="上传食品图片" :rules="{required: true}">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/v1/addimg/food'"
                :show-file-list="false"
                :on-success="uploadImg"
                :before-upload="beforeImgUpload">
                <img v-if="foodForm.image_path" :src="baseImgPath + foodForm.image_path" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="食品特点">
              <el-select v-model="foodForm.attributes" multiple placeholder="请选择食品特点">
                <el-option
                  v-for="item in attributes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="食品规格">
              <el-radio class="radio" v-model="foodSpecs" label="one">单规格</el-radio>
              <el-radio class="radio" v-model="foodSpecs" label="more">多规格</el-radio>
            </el-form-item>
            <el-row v-if="foodSpecs == 'one'">
              <el-form-item label="包装费">
                <el-input-number controls-position="right" v-model="foodForm.specs[0].packing_fee" :min="0" :max="100"></el-input-number>
              </el-form-item>
              <el-form-item label="价格">
                <el-input-number controls-position="right" v-model="foodForm.specs[0].price" :min="0" :max="10000"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row v-if="foodSpecs == 'more'"  style="overflow: auto; text-align: center;">
              <el-button type="primary" @click="dialogFormVisible = true" style="margin-bottom: 10px;">添加规格</el-button>
              <el-table
                :data="foodForm.specs"
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
                      @click="handleDelete(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="addFood('foodForm')">确认添加食品</el-button>
            </el-form-item>
          </el-form>
          <el-dialog title="添加规格" :visible.sync="dialogFormVisible">
            <el-form :rules="specsFormrules" ref="specsForm" :model="specsForm">
              <el-form-item label="规格" label-width="100px" prop="specs">
                <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="包装费" label-width="100px">
                <el-input-number v-model="specsForm.packing_fee"></el-input-number>
              </el-form-item>
              <el-form-item label="价格" label-width="100px">
                <el-input-number v-model="specsForm.price"></el-input-number>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addspecs">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import api from "../api";
    export default {
        name: "addGoods",
        data(){
            return {
                baseImgPath: '//elm.cangdu.org/img/',
                baseUrl: '//elm.cangdu.org',
                restaurant_id: 1,
                categoryForm: {
                    categoryList: [],
                    categorySelect: '',
                },
                addCategoryForm: {
                    addCategoryName: '',
                    description: '',
                },
                foodForm: {
                    name: '',
                    description: '',
                    image_path: '',
                    activity: '',
                    attributes: [],
                    specs: [{
                        specs: '默认',
                        packing_fee: 0,
                        price: 20,
                    }],
                },
                attributes: [{
                    value: '新',
                    label: '新品'
                }, {
                    value: '招牌',
                    label: '招牌'
                },],
                showAddCategory: false,
                foodSpecs: 'one',
                dialogFormVisible: false,
                specsForm: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                },
                categorysRule: {
                    categorySelect:{required: true, message: '请选择食品种类', trigger: 'change'}
                },
                specsFormrules: {
                    specs: [
                        { required: true, message: '请输入规格', trigger: 'blur' },
                    ],
                },
                addCategoryRules: {
                    addCategoryName: [
                        { required: true, message: '请输入食品种类', trigger: 'blur' }
                    ]
                }
            }
        },
        created () {
            this.initData()
        },
        mounted () {
            if(this.$route.query.restaurant_id){
                this.restaurant_id = this.$route.query.restaurant_id
            }else {
                this.$confirm('添加食品需要选择一个商铺，先去就去选择商铺吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push('/layout/shopList')
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        },
        computed: {
            selectValue: function (){
                return this.categoryForm.categoryList[this.categoryForm.categorySelect]||{}
            }
        },
        methods: {
            async initData () {
                try {
                    const result = await api.getCategory(this.restaurant_id)
                    if (result.data.status == 1) {
                        result.data.category_list.map((item, index) => {
                            item.value = index;
                            item.label = item.name;
                        })
                        this.categoryForm.categoryList = result.data.category_list;
                    }else{
                        console.log(result)
                    }
                }catch (e) {
                    console.log(e)
                }
            },
            addCategoryFun () {
                this.showAddCategory = !this.showAddCategory
            },
            uploadImg (res) {
                if (res.status == 1) {
                    this.foodForm.image_path = res.image_path
                }else{
                    this.$message.error('上传图片失败！')
                }
            },
            beforeImgUpload(file) {
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
            submitcategoryForm (categoryForm){
                this.$refs[categoryForm].validate(async (valid, a) => {
                    if(this.addCategoryForm.description == '')
                    if (valid) {
                        const params = {
                            name: this.addCategoryForm.addCategoryName,
                            description: this.addCategoryForm.description,
                            restaurant_id: this.restaurant_id,
                        }
                        try{
                            const result = await api.addCategory(params);
                            if (result.data.status == 1) {
                                this.initData();
                                this.categoryForm.name = '';
                                this.categoryForm.description = '';
                                this.showAddCategory = false;
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                            }
                        }catch(err){
                            console.log(err)
                        }
                    } else {
                        console.log(a)
                        this.$notify.error({
                            title: '错误',
                            message: '请检查输入是否正确',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
            addspecs (){
                if(this.specsForm.specs == ''){
                    this.$refs.specsForm.validateField('specs')
                    return
                }
                this.foodForm.specs.push({...this.specsForm})
                this.$nextTick(() => {
                    this.specsForm.specs = '';
                    this.specsForm.packing_fee = 0;
                    this.specsForm.price = 20;
                    this.dialogFormVisible = false;
                })
            },
            handleDelete (index) {
                this.foodForm.specs.splice(index,1)
            },
            addFood(foodForm){
                console.log(this.categoryForm.categorySelect)
                if(this.categoryForm.categorySelect == '' || this.categoryForm.categorySelect == undefined){
                    this.$refs.categoryForm.validateField('categorySelect')
                }
                this.$refs[foodForm].validate(async (valid) => {
                    if (valid) {
                        const params = {
                            ...this.foodForm,
                            category_id: this.selectValue.id,
                            restaurant_id: this.restaurant_id,
                        }
                        try{
                            const result = await api.addFood(params);
                            console.log(result)
                            if (result.data.status == 1) {
                                console.log(result)
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                this.foodForm = {
                                    name: '',
                                    description: '',
                                    image_path: '',
                                    activity: '',
                                    attributes: [],
                                    specs: [{
                                        specs: '默认',
                                        packing_fee: 0,
                                        price: 20,
                                    }],
                                }
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: result.data.message
                                });
                            }
                        }catch(err){
                            console.log(err)
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请检查输入是否正确',
                            offset: 100
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
  .form{
    min-width: 400px;
    margin-bottom: 30px;
  }
  .form:hover{
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    border-radius: 6px;
    transition: all 400ms;
  }
  .food_form{
    border: 1px solid #eaeefb;
    padding: 10px 10px 0;
  }
  .form_header{
    text-align: center;
    margin-bottom: 10px;
  }
  .category_select{
    border: 1px solid #eaeefb;
    padding: 10px 30px 10px 10px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }
  .add_category_row{
    height: 0;
    overflow: hidden;
    transition: all 400ms;
    background: #f9fafc;
  }
  .showEdit{
    height: 185px;
  }
  .addCategory{
    margin-top: -30px;
  }
  .add_category{
    background: #f9fafc;
    padding: 10px 30px 0px 10px;
    border: 1px solid #eaeefb;
    border-top: none;
  }
  .add_category_button{
    text-align: center;
    line-height: 40px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid #eaeefb;
    border-top: none;
    transition: all 400ms;
  }
  .add_category_button span{
    font-size: 14px;
    collapse: #999;
    transition: all 400ms;
  }
  .add_category_button .edit_icon{
    color: #ccc;
    transition: all 400ms;
  }
  .add_category_button:hover{
    background: #f9fafc;
  }
  .add_category_button:hover span, .add_category_button:hover .edit_icon{
    color: #20a0ff;
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
  .cell{
    text-align: center;
  }
</style>
<style>
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
  .el-input-number span{
    background: #ffffff;
  }
</style>
