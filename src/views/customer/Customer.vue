<template>
  <div>
    <!--租户信息列表-->
    <section>
      <!--顶部工具栏-->
      <el-col :span='24' class='toolbar' style="padding-bottom: 0px;" >
        <el-col :span='24'>
          <el-form :inline='true' :model='filters' ref='filters'> 

            <el-form-item :label='$t("Public.tenant")' prop='name'>
              <el-input  v-model='filters.name' class='sel' ></el-input>
            </el-form-item>
            <el-form-item :label='$t("Public.status")' prop='status'>
              <el-select v-model='filters.status' class='ipt_sta'  :placeholder="$t('validateMes.placeCh')" >
                <el-option
                  v-for='(item,index) in staData'
                  :key='index'
                  :label='item.name'
                  :value='item.value'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("customer.tenantPho")' prop='pho'>
              <el-input v-model='filters.pho' class='sel_sels' ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size='small' type='primary'  @click='getUsers' @keydown.enter='getUsers' >{{$t('topFilters.search')}}</el-button>
              <el-button size='small' type='info'  @click='reset' >{{$t('topFilters.reset')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button size='small' type='primary' @click='handleAdd' v-if='buttonVal.add' >{{$t('customer.addCustomer')}}</el-button>
				</el-col>
				<el-col :span='20' class='table-top'>
					<el-button
						size='small'
            type="danger"
            @click="batchRemove(sels)"
            :disabled="this.sels.length===0"
            v-if='buttonVal.del'
          >{{$t('tabOperation.batchDel')}}</el-button>
					<el-dropdown size='small'  split-button type='success' @command="handleExport" >
	        		{{$t('tabOperation.derived.tit')}}
	        <el-dropdown-menu slot='dropdown'>
	          <el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>
	          <el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>
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
          
          align='center'
        ></el-table-column>
        <el-table-column
          type='index'
          
          align='center'
          :label='$t("Public.index")'
        >
        	<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
        </el-table-column>
          <!--:formatter='dateTableFormat'-->
        <el-table-column   width='80' :label='$t("Public.creation")' align='center'>	
        	<template slot-scope='scope'>
        		{{ scope.row.creation_time | timeFormat }}
        	</template>
        </el-table-column>
        <el-table-column  align='center':label='$t("customer.tenantName")' >
          <template slot-scope='scope'>
            <span class="tem_span" @click="handleSee(scope.$index, scope.row)"
            >{{scope.row.name}}</span>  <br />
            <span>{{scope.row.company_name}}</span>
          </template>
        </el-table-column>
        <el-table-column    width='80'  align='center' :label='$t("customer.tenantStatus")' >
        	<template slot-scope='scope'>
        		<span :class='scope.row.color' v-text="scope.row.usableText"></span>
        	</template>
        </el-table-column>
        <el-table-column
          prop='contact'
          
          align='center'
          :label='$t("customer.tenantUser")'
        ></el-table-column>
        <el-table-column
          prop='mobile'
          
          align='center'
          :label='$t("customer.phone")'
        ></el-table-column>
        <el-table-column
          prop='email'
         
          align='center'
          :label='$t("customer.email")'
        ></el-table-column>
        <el-table-column
          align='center'
          :label='$t("Public.description")'
        >
        <template slot-scope='scope'>
        	{{ scope.row.description | descriptionValue }}
        </template>
        </el-table-column>
        <el-table-column
          width='150'
          :label='$t("Public.operation")'
          align='center'
        >
          <template slot-scope='scope'>
            <el-button
              type='info'
              size='mini'
              @click='handleSta(scope.$index, scope.row)'
              class='cusSta'
              v-if='buttonVal.run'
            >{{scope.row.usableBtnText}}</el-button>
            <el-button
              type='success'
              size='mini'
              @click='handleEdit(scope.$index, scope.row)'
              v-if='buttonVal.edit'
            >{{$t('tabOperation.edit')}}</el-button>
            <el-button
              type='danger'
              size='mini'
              @click='handleDel(scope.$index, scope.row)'
              v-if='buttonVal.del'
            >{{$t('tabOperation.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span='24' class='toolbar'>

        <!--<el-col :span='21'>-->
          <el-pagination
            :total='total'
            layout="total, sizes, prev, pager, next, jumper"
            @size-change='handleSizeChange'
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-size='pagesize'
            :page-count='pageNum'
            :pager-count="pagecount"
          >
          </el-pagination>
        <!--</el-col>-->
      </el-col>
    </section>
  </div>
</template>

<script>
	import {datedialogFormat } from '@/assets/js/index'
export default {
  name: "Customer",
  data() {
    return {
      //获取token
      token: sessionStorage.getItem("token"),
      filters: {
        name: "",
        status: "",
        pho: ""
      },
      staData: [
        {
          name: this.$t('Public.enable'),
          value: "true"
        },
        {
          name: this.$t('Public.Prohibit'),
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
      
      buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
	  		add:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list,"tenant@add_tenant").show,//添加	
	  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list, "tenant@del_tenant").show,//单个删除和批量的删除是绑定在一起的  
	  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list,"tenant@edit_tenant").show,//编辑的值
	  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list, "tenant@tenant_info").show,//查看详情
	  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list,"tenant@to_enable_tenant").show,//运行
	  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.tenantList").list,"tenant@to_disable_tenant").show,//停止
	  	}

    };
  },
  created() {
    this.getUsers();

    
  },
  methods: {
    //分页的选择页面显示个数和点击其他的分页的时候显示数据
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      //				let _this=this;
      this.currentPage = val;
      this.getUsers();
    },
    getUsers() {
      //搜索
      this.loading = true;
      var para={};
      if(this.filters.status=='') {
          para = {
          page: this.currentPage,
          per_page: this.pagesize,
          search_name: this.filters.name,
          search_email: this.filters.ema,
          search_mobile: this.filters.pho
        };
      }else {
           para = {
          page: this.currentPage,
          per_page: this.pagesize,
          search_name: this.filters.name,
          search_usable: this.filters.status,
          search_email: this.filters.ema,
          search_mobile: this.filters.pho
        };
      }

      this.$ajax
        .get("/tenant/tenants" + "?token=" + this.token, para)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              this.loading = false;
              this.users = res.data.data.items;
              this.total = res.data.data.page.total;
              this.users.forEach(ele => {
                if (ele.usable) {
                	ele.color='backRun'
                  ele.usableText = this.$t('Public.enable');
                  ele.usableBtnText = this.$t('Public.Prohibit');
                } else {
                	ele.color='backWarn'
                  ele.usableText = this.$t('Public.Prohibit');
                  ele.usableBtnText = this.$t('Public.enable');
                }
              });
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    reset() {
      this.$refs['filters'].resetFields()
    },
    handleSta(index, row) {
      //禁用和启用切换
      if(row.usable){//状态是启用的     点击  禁用
      	this.$confirm(this.$t('customer.plaStop'), this.$t('confirm.tooltip'), {
          type: "warning"
        })
      	.then(() => {
      		this.$ajax.put("/tenant/to_disable_tenant/" + row.id + "?token=" + this.token)
      		.then(res => {
      			if(res.status ==200 ){
      				if(res.data.status  ==0 ){
      					this.$message({
			                message: this.$t('tooltipMes.diSuccess'),
			                type: "success"
			            });
			            this.getUsers();
      				}
      			}
      		}).catch(e => {console.log(e)})
      	}).catch(() => {})
      }else if(!row.usable){//状态是禁用的  点击启用
      	this.$confirm(this.$t('customer.plaRun'), this.$t('confirm.tooltip'), {
          type: "warning"
        })
      	.then(() => {
      		this.$ajax.put("/tenant/to_enable_tenant/" + row.id + "?token=" + this.token)
      		.then(res => {
      			if(res.status ==200){
      				if(res.data.status  == 0){
      					this.$message({
			                message:this.$t('tooltipMes.enSuccess'),
			                type: "success"
			            });
			            this.getUsers();
      				}
      			}
      		}).catch(e => {console.log(e)})
      	}).catch(() => {})
      }
    },
    handleAdd() {

      //添加
      this.$router.push({
        path: "/customer/addCus",
        query: {
          name: "add"
        }
      });
    },
    handleSee(index, row) {
      //查看详情-传递id v-if='buttonVal.add'
      if(this.buttonVal.see){
	      this.$router.push({
	        path: "/customer/details/tenant",
	        query:{
	        	seeId:row.id
	        }
	      });
      }else{
      	this.$message({
      		message:'暂无查看详情权限！',
      		type:'warning'
      	});
      }
      
    },
    handleEdit(index, row) {
      //编辑 -传递id
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
                  }
                }
              })
              .catch((e) => {console.log(e)});
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
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: "删除成功!",
                    type: "success"
                  });
                }
                this.getUsers();
                
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
      if (_this.users.length == 0) {
        this.$message({
          message: "数据为空，不能执行导出操作!",
          type: "warning"
        });
      } else {
        //			console.log('数据不是空');
        if (command == "all") {
          //导出所有的数据
          this.$confirm("确定要导出所有的数据吗?", "提示", {
            type: "warning"
          })
            .then(() => {
              this.exportData();
            })
            .catch(() => {});
        } else if (command == "current") {
          //导出当前
          this.$confirm("确定要导出当前页数据吗?", "提示", {
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
        }
      }
    },
    exportData: function(params) {
      this.$ajax
        .get("/tenant/tenants" + "?token=" + this.token, params)
        .then(res => {
					var arr =res.data.data.items;
					for( let item =0 ;item<arr.length;item++ ){
						arr[item]['creation_time']=datedialogFormat(arr[item]['creation_time']);
						arr[item]['parent_name']=arr[item]['parent']['name'];
					}
          this.excelData = arr;
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
        	this.$t('Public.creation'),
        	'id',
        	this.$t('Public.tenantName'),
          this.$t('customer.tenantName'),
          this.$t('customer.tenantUser'),
          this.$t('customer.email'),
          this.$t('customer.phone'),
          this.$t('customer.corporateType'),
          this.$t('customer.corporatePho'),
          this.$t('Public.province'),
          this.$t('Public.city'),
          this.$t('Public.county'),
          this.$t('customer.address'),
          this.$t('Public.information')
        ];
        const filterVal = [
        	'creation_time',
        	'id',
        	'parent_name',
          "name",
          "contact",
          "email",
          "mobile",
          "company_type",
          "phone",
          'province',
          'city',
          'district',
          "extra",
          "description"
        ];
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "下载数据excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

  }
};
</script>

<style scoped>
.tem_span {
  display: inline-block;
  cursor: pointer;
  color: #1a4ef9;
}
</style>