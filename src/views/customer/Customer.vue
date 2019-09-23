<template>
  <div>
    <!--客户管理-->
    <section>
      <!--顶部工具栏-->
      <el-col
        :span='24'
        class='toolbar'
        style="padding-bottom: 0px;"
      >
        <el-col :span='24'>
          <el-form
            :inline='true'
            :model='filters'
          >
            <el-form-item label='租户标识：'>
              <el-input
                v-model='filters.name'
                class='sel'
              ></el-input>
            </el-form-item>
            <el-form-item label='状态：'>
              <el-select
                v-model='filters.status'
                class='ipt_sta'
              >
                <el-option
                  v-for='(item,index) in staData'
                  :key='index'
                  :label='item.name'
                  :value='item.value'
                ></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label='租户联系人：'>
							<el-input v-model='filters.pho'class='sel'></el-input>
						</el-form-item>-->
            <el-form-item label='租户手机号：'>
              <el-input
                v-model='filters.pho'
                class='sel'
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type='primary'
                @click='getUsers'
                @keydown.enter='getUsers'
              >搜索</el-button>
              <el-button
                type='info'
                @click='reset(filters)'
              >重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>

      <el-col :span='24'>
        <el-col :span='3'>
          <el-button
            type='primary'
            @click='handleAdd'
          >添加租户</el-button>
        </el-col>
        <el-col :span='21'>
          <el-dropdown
            split-button
            type='success'
            @command="handleExport"
          >
            导出数据
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command="current">当前页 </el-dropdown-item>
              <el-dropdown-item command="all">所有页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
      <el-table
        :data='users'
        highlight-current-row
        @selection-change="selsChange"
        style="width: 100%;"
        v-loading='loading'
      >
        <el-table-column
          type='selection'
          width='60'
          align='center'
        ></el-table-column>
        <el-table-column
          type='index'
          width='60'
          align='center'
          label='序号'
        ></el-table-column>
        <!--<el-table-column prop='name' width='100' align='center' label='创建时间':formatter='dateTableFormat'></el-table-column>-->
        <el-table-column
          prop='email'
          width='150'
          align='center'
          label='租户标识'
        >
          <template slot-scope='scope'>
            <span
              class="tem_span"
              @click="handleSee(scope.$index, scope.row)"
            >{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='usableText'
          width='150'
          align='center'
          label='租户状态'
        ></el-table-column>
        <el-table-column
          prop='company_name'
          width='150'
          align='center'
          label='公司名称'
        ></el-table-column>
        <el-table-column
          prop='contact'
          width='150'
          align='center'
          label='租户联系人'
        ></el-table-column>
        <el-table-column
          prop='mobile'
          width='100'
          align='center'
          label='手机号'
        ></el-table-column>
        <el-table-column
          prop='email'
          width='100'
          align='center'
          label='邮箱'
        ></el-table-column>
        <el-table-column
          prop='description'
          width='100'
          align='center'
          label='备注'
        ></el-table-column>
        <el-table-column
          width='300'
          label='操作'
          align='center'
        >
          <template slot-scope='scope'>
            <el-button
              type='info'
              size='small'
              @click='handleSta(scope.$index, scope.row)'
              class='cusSta'
            >{{scope.row.usableBtnText}}</el-button>
            <el-button
              type='success'
              size='small'
              @click='handleEdit(scope.$index, scope.row)'
            >编辑</el-button>
            <el-button
              type='danger'
              size='small'
              @click='handleDel(scope.$index, scope.row)'
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span='24'>
        <el-col :span='3'>
          <el-button
            type="danger"
            @click="batchRemove(sels)"
            :disabled="this.sels.length===0"
          >批量删除</el-button>
        </el-col>
        <el-col :span='21'>
          <el-pagination
            :total='total'
            layout="total, sizes, prev, pager, next, jumper"
            @size-change='handleSizeChange'
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-count='pageNum'
            :pager-count="pagecount"
            :prev-text='prev'
            :next-text='next'
          >
          </el-pagination>
        </el-col>
      </el-col>
    </section>
  </div>
</template>

<script>
export default {
  name: "Customer",
  data() {
    return {
      //获取token
      token: "",
      filters: {
        name: "",
        status: "true",
        pho: ""
        //					ema:''
      },
      staData: [
        {
          name: "启用",
          value: "true"
        },
        {
          name: "禁用",
          value: "false"
        }
      ],
      users: [],
      loading: false,
      sels: [],
      //分页所需要的参数
      total: 0,
      pagesize: 10,
      currentPage: 1,
      pageNum: 1,
      pagecount: 5,
      next: "下一页",
      prev: "上一页"
    };
  },
  created() {
    this.token = sessionStorage.getItem("token");
    this.getUsers();
  },
  methods: {
    //分页的选择页面显示个数和点击其他的分页的时候显示数据
    handleSizeChange(val) {
      //				console.log(`每页${val}条`);
      this.pagesize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      //				let _this=this;
      this.currentPage = val;
      //				console.log(`当前页数是:${val}`)
      this.getUsers();
    },
    getUsers() {
      //搜索
      this.laoding = true;
      var para = {
        page: this.currentPage,
        per_page: this.pagesize,
        search_name: this.filters.name,
        search_usable: this.filters.status,
        search_email: this.filters.ema,
        search_mobile: this.filters.pho
      };

      this.$ajax
        .get("/tenant/tenants" + "?token=" + this.token, para)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            if (res.data.status == 0) {
              this.laoding = false;
              this.users = res.data.data.items;
              this.total = res.data.data.page.total;
              this.users.forEach(ele => {
                if (ele.usable) {
                  ele.usableText = "启用";
                  ele.usableBtnText = "禁用";
                } else {
                  ele.usableText = "禁用";
                  ele.usableBtnText = "启用";
                }
              });
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    reset(sles) {
      //重置
      for (let key in sles) {
        sles[key] = "";
      }
      this.filters.status = "true";
    },
    handleSta(index, row) {
      //禁用和启用切换
      var cusSta = document.getElementsByClassName("cusSta");
      if (cusSta[index].innerText === "启用") {
        this.$confirm("确定要启用该设备吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "primary"
        }).then(() => {
          this.$ajax
            .put("/tenant/to_enable_tenant/" + row.id + "?token=" + this.token)
            .then(res => {
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: "启用成功!",
                    type: "success"
                  });
                  cusSta[index].innerText = "禁用";
                  this.getUsers();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              }
            });
        });
      } else if (cusSta[index].innerText === "禁用") {
        this.$confirm("确认要禁用该设备吗?", "提示", {
          confirmButtontText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$ajax
            .put("/tenant/to_disable_tenant/" + row.id + "?token=" + this.token)
            .then(res => {
              console.log(res);
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: "禁用成功！",
                    type: "success"
                  });
                  cusSta[index].innerText = "启用";
                  this.getUsers();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              }
            });
        });
      }
    },
    handleAdd() {
      console.log("添加租户");
      //添加
      this.$router.push({
        name: "租户添加",
        path: "/customer/addCus",
        query: {
          name: "添加"
        }
      });
    },
    handleSee(index, row) {
      console.log("执行详情的界面");
      console.log(row.id);
      //查看详情-传递id
      this.$router.push({
        path: "/customer/details/tenant/" + row.id
      });
    },
    handleEdit(index, row) {
      //编辑 -传递id
      console.log("这一步执行编辑的部分的传值id");
      this.$router.push({
        path: "/customer/editCus",
        query: {
          id: row.id
        }
      });
    },
    handleDel(index, row) {
      //删除
      this.$confirm("确认要删除该数据吗?", "提示 ", {
        type: "warning "
      })
        .then(() => {
            this.$ajax
              .del("/tenant/del_tenant/" + row.id + "?token=" + this.token)
              .then(res => {
				console.log(res);
                if (res.status == "200") {
                  if (res.data.status == "0") {
                    this.$message({
                      message: "删除成功!",
                      type: "success"
                    });
                    this.getUsers();
                  } else {
                    this.$message({
                      message: res.data.message,
                      type: "warning"
                    });
                  }
                }
              })
              .catch(() => {});
        })
        .catch(() => {});
    },
    selsChange(sels) {
      this.sels = sels;
    },
    batchRemove: function(rows) {
      //批量删除
      var ids = [];
      rows.forEach(ele => {
        ids.push(ele.id);
      });
      this.$confirm("确认要删除选中的记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          var para = { ids: ids };

          this.$ajax
            .del("/tenant/del_tenants" + "?token=" + this.token, para)
            .then(res => {
              console.log(res);
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: "删除成功!",
                    type: "success"
                  });
                  this.getUsers();
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    handleExport(command) {
      var _this = this;
      if (_this.users == "") {
        console.log(_this.users);
        this.$message({
          message: "数据为空，不能执行导出操作!",
          type: "warning"
        });
      } else {
        //			console.log('数据不是空');
        console.log(_this.users);
        if (command == "all") {
          //导出所有的数据
          this.$confirm("确定要导出所有的数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              var para = {
                page: this.currentPage,
                per_page: this.pagesize
              };
              this.exportData(para);
            })
            .catch(() => {});
        } else if (command == "current") {
          //导出当前
          this.$confirm("确定要导出当前页数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.exportData();
            })
            .catch(() => {});
        }
      }
    },
    exportData: function(params) {
      this.$ajax
        .get("/tenant/tenants" + "?token=" + this.token, params)
        .then(res => {
          this.excelData = res.data.data.items;
          this.export2Excel();
        })
        .catch(e => {
          console.log(e);
        });
    },

    //数据写入excel表格里面
    export2Excel() {
      let that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/export2Excel");
        const tHeader = [
          "客户标识",
          "租户联系人",
          "邮箱",
          "手机号",
          "公司名称",
          "公司 类型",
          "公司电话",
          "详细地址",
          "描述信息"
        ];
        const filterVal = [
          "name",
          "contact",
          "email",
          "mobile",
          "company_name",
          "company_type",
          "phone",
          "extra",
          "description"
        ];
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "下载数据excel");
      });
      //		console.log(this.creation_time)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
    //			dateTableFormat(row,column){
    //				//将时间戳转换为前端的时间
    //				let date=new Date(parseInt(row.creation_time)*1000);
    //				let Y=date.getFullYear()+'-';
    //				let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
    //				let D=date.getDate() <10? '0' +date.getDate() +'':date.getDate()+'';
    //				let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
    //				let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
    //				let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
    //				return Y + M + D + h + m + s
    //			}
  }
  //		mounted(){
  //			this.getUsers()
  //		}
};
</script>

<style scoped>
.tem_span {
  display: inline-block;
  cursor: pointer;
  color: #1a4ef9;
}
</style>