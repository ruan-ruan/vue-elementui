<template>
  <div>
    <!--点到点专线-->
    <section>
      <el-row class='toollbar'>
        <el-col
          :sm='24'
          :md='24'
          :lg='24'
        >
          <el-form :model='filters':inline='true' ref='filters'>
            <el-form-item label='名称'>
              <el-input
                v-model='filters.search_name'
                class='sel'
                placeholder='名称'
              ></el-input>
            </el-form-item>
            <el-form-item label='租户标识'>
              <el-select
                v-model='filters.search_tenant'
                class='sel'
              >
                <el-option
                  v-for='(item,index) in tenantData'
                  :value='item.id'
                  :label='item.name'
                  :key='index'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='专线状态'>
              <el-select
                v-model='filters.search_status'
                class='sel'
              >
                <el-option
                  v-for='(item,index) in specialData'
                  :label='item.label'
                  :value='item.value'
                  :key='index'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='专线类型'>
              <el-select
                v-model='filters.search_type'
                class='sel'
              >
                <el-option
                  v-for='(item,index) in specialTypeData'
                  :label='item.label'
                  :value='item.value'
                  :key='index'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='带宽(Mbps)'>
              <el-input
                v-model='filters.search_start_bandwidth'
                class='ipts'
                placeholder='起始'
              ></el-input>至
              <el-input
                v-model='filters.search_end_bandwidth'
                class='ipts'
                placeholder='截止'
              ></el-input>
            </el-form-item>
            <el-form-item label='计费时间'>
              <el-date-picker
                v-model="filters.billingTime"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始计费日期时间"
                end-placeholder="结束计费日期时间"
                class='ipt'
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label='过期时间'>
              <el-date-picker
                v-model="filters.overdueTime"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="截止"
                class='ipt'
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                @click='getUsers'
                type='primary'
              >搜索</el-button>
              <el-button
                type='info'
                @click='reset(filters)'
              >重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
				<div class="table-top">
					 <!--<el-button type="danger"  @click="batchRemove()" :disabled="this.sels.length===0" v-if='parentStatus'  >
             	批量删除</el-button>-->
           <el-dropdown split-button type='success' @command="handleExport"  >
             	 导出数据
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command="current">当前页 </el-dropdown-item>
                <el-dropdown-item command="all">所有页</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
				</div>
				
      <!--<el-row>
        <el-col
          :sm='24'
          :md='24'
          :lg='24'
        >-->

          <el-table
            :data="users"
            @selection-change="selsChange"
            highlight-current-row
            v-loading='getLoading'
          >
            <el-table-column
              type='selection'
              width='30'
              align='center'
              v-if='parentStatus'
            ></el-table-column>
            <el-table-column
              type='index'
              label='序号'
              width='40'
              align='center'
            ></el-table-column>
            <el-table-column
              label='专线名称'
              min-width='70'
              align='center'
            >
              <template slot-scope='scope'>
                <span
                  class="cli_spn"
                  @click='handleSeePoint(scope.$index,scope.row)'
                >{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label='专线状态'
              min-width='40'
              align='center'
            >
              <template slot-scope='scope'>
                <span :class="scope.row.statusColor">{{scope.row.statusHTML}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop='bandwidth'
              label='带宽(Mbps)'
              min-width='40'
              align='center'
            >
            </el-table-column>
            <el-table-column
              label='专线类型'
              min-width='40'
              align='center'
            >
              <template slot-scope='scope'>
                <span>{{scope.row.typeName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label='A端'
              min-width='60'
              align='center'
            >
              <template slot-scope='scope'>
                <span
                  class="cli_spn"
                  @click="handleSeeA(scope.$index,scope.row)"
                >
                  {{scope.row.logicPortA}}

                </span> <br />
                <span>{{scope.row.vlanHTMLA}}</span>
              </template>
            </el-table-column>
            <el-table-column label='A逻辑口状态' min-width='60'  align='center'  >
              <template slot-scope='scope'>
                <span  :class="scope.row.colorA" v-text="scope.row.statusValA"> </span>
              </template>
            </el-table-column>
            <el-table-column
              label='Z端'
              min-width='60'
              align='center'
            >
              <template slot-scope='scope'>
                <span
                  class="cli_spn"
                  @click="handleSeeZ(scope.$index,scope.row)"
                >

                  {{scope.row.logicPortZ}}

                </span> <br />
                <span>{{scope.row.vlanHTMLZ}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='endpoints.ports.status' label='Z逻辑口状态'  min-width='60' align='center' >
            	<template slot-scope='scope'>
            		<span v-text='scope.row.statusValZ' :class="scope.row.colorZ"></span>
            	</template>
            </el-table-column>
            <el-table-column
              prop='creation_time'
              label='创建时间'
              width='95'
              :formatter='dateFormat'
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='charge_time'
              label='计费时间'
              width='95'
              :formatter='dateFormat'
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='expiration_time'
              label='过期时间'
              width='95'
              :formatter='dateFormat'
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='tenant.name'
              label='租户标识'
              min-width='50'
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='descriptionVal'
              label='备注'
              min-width='60'
              align='center'
            >
            </el-table-column>
            <el-table-column
              label='操作'
              width='220'
              align='center'
              v-if='parentStatus'
            >
              <template slot-scope='scope' v-if='scope.row.creat'>
                <el-button
                  size='small'
									v-if='!scope.row.btn'
                  @click='handleStatus(scope.$index,scope.row)'
                >{{scope.row.specialName}}</el-button>
                <el-button
                  size='small'
                  type='primary'
                  @click='handleEdit(scope.$index,scope.row)'
                  v-if='!scope.row.btn'
                >编辑</el-button>
                <el-button
                  size='small'
                  type='danger'
                  @click='handleDel(scope.$index,scope.row)'
                  v-if='scope.row.btn'
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        <!--</el-col>
      </el-row>-->
      
      <el-row v-if='parentStatus'>
      	
        <el-col :span='24'>
        	<el-col :span='3'>
        		<el-button type="danger"  @click="batchRemove()" :disabled="this.sels.length===0" v-if='parentStatus'  >
             	批量删除</el-button>
        	</el-col>
        	<el-col :span='21'>
          <el-pagination
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30,50]"
            :current-page.sync="currentPage"
            :page-count='pageNum'
            :pager-count="pagecount"
            :prev-text='prev'
            :next-text='next'
          ></el-pagination>
          </el-col>
        </el-col>
      </el-row>

      <el-dialog
        :title='textMap[dialogStatus]'
        :visible.sync='dialogFormVisible'
        :close-on-click-modal='false'
        v-loading='editLoading'
      >
        <el-form
          :model='editForm'
          ref='editForm'
          label-width='120px'
          :rules='editFormRules'
        >
          <el-form-item
            label='专线名称'
            prop='name'
          >
            <el-input v-model='editForm.name'></el-input>
          </el-form-item>
          <el-form-item
            label='带宽'
            prop='bandwidth'
          >
            <el-input v-model='editForm.bandwidth'></el-input>
          </el-form-item>
          <el-form-item label='业务状态'>
            <el-input
              v-model='editForm.name'
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label='创建时间'>
            <el-input v-model='editForm.time'></el-input>
          </el-form-item>
          <el-form-item label='计费时间'>
            <!--<el-input v-model='editForm.charge_time'></el-input>-->
            <el-date-picker
              v-model="editForm.charge_time"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              clearable
              style="width: 100%"
              :picker-options="startDatePicker"
              type="datetime"
              class='ipt'
              placeholder="请选择计费开始日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label='过期时间'>
            <!--<el-input v-model='editForm.expiration_time'></el-input>-->
            <el-date-picker
              v-model="editForm.expiration_time"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="timestamp"
              clearable
              style="width: 100%"
              :picker-options="endDatePicker"
              type="datetime"
              class='ipt'
              placeholder="请选择计费截止日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label='备注'>
            <el-input v-model='editForm.description'></el-input>
          </el-form-item>
        </el-form>
        <div
          slot='footer'
          class='dialog-footer'
        >
          <el-button @click.native='dialogFormVisible=false'>取消</el-button>
          <!--编辑-->
          <el-button
            v-if="dialogStatus=='update'"
            type="primary"
            @click="UpdateData"
          >保存</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>

	
import {
  datedialogFormat,
  isValidinteger,
  getPortStatus,
  descriptionValue
} from "@/assets/js/index";
export default {
  name: "pointsTo",
  props: ["customer", "nodeID", "customerID"], // customer 逻辑口的id   nodeID节点的id
  data() {
    let isValidNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入带宽"));
      } else if (!isValidinteger(value)) {
        callback(new Error("请输入正确的带宽"));
      }if(value>1000000){
					callback(new Error('带宽最大不超过1000000Mbps'))
				} else {
        callback();
      }
    };
    return {
      token: "",
      filters: {
        billingTime: "", //计费时间开始和截止
        overdueTime: "", //过期的时间开始和截止
        search_name: "", //名称
        search_tenant: "", //租户id
        search_type: "", //点到点的类型
        search_status: "", //业务状态
        search_start_bandwidth: "", //带宽开始值
        search_end_bandwidth: "", //带宽结束值
        search_start_charge_time: "", //计费时间开始值
        search_end_charge_time: "", //计费时间结束值
        search_start_expiration_time: "", //过期时间开始值
        search_end_expiration_time: "" //过期时间结束值
      },
      users: [], //保存表格里面的数据
      sels: [], //保存勾选的数据
      getLoading: false,
      //分页所需要的参数
      total: 0,
      pagesize: 10,
      currentPage: 1,
      pageNum: 1,
      pagecount: 5,
      next: "下一页",
      prev: "上一页",
      textMap: {
        update: "编辑虚拟专线"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      editLoading: false,
      editForm: {
        name: "",
        bandwidth: "",
        charge_time: "",
        expiration_time: "",
        description: ""
      },
      editFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        bandwidth: [
          { required: true, validator: isValidNumber, trigger: "blur" }
        ]
      },
      excelData: [],
      specialData: [
        {
          label: "创建中",
          value: "creating"
        },
        {
          label: "停止中",
          value: "stopping"
        },
        {
          label: "创建失败",
          value: "failure"
        },
        {
          label: "运行中",
          value: "serving"
        }
      ], //专线的状态
      specialTypeData: [
        {
          label: "DCI",
          value: "d2d"
        },
        {
          label: "云互联",
          value: "d2c"
        },
        {
          label: "云直连",
          value: "c2c"
        }
      ],
      specialTypeData1: [
        {
          label: "云互联",
          value: "d2c"
        },
        {
          label: "云直连",
          value: "c2c"
        }
      ],
      startDatePicker: this.beginDate(), //计费时间 和 结束时间的判断
      endDatePicker: this.processDate(),
      tenantData: [], //租户数据
      parentStatus: true, //该组件被调用的S时候，上面控制部分隐藏
      isid: []
    };
  },
  created() {
    this.token = sessionStorage.getItem("token");
    this.getFiltersData();
//  let str = [this.customer, this.nodeID];
    if (
      typeof this.customer !== "undefined" ||
      typeof this.nodeID !== "undefined" ||
      typeof this.customerID !== "undefined"
    ) {
      this.parentStatus = false;
    } else {
      this.parentStatus = true;
    }
    this.getUsers();
  },
  methods: {
    getFiltersData() {
      //获取租户标识的数据
      let tenantObj = {};

      this.$ajax.get("/tenant/tenants" + "?token=" + this.token).then(res => {
        if (res.status == 200) {
          if (res.data.status == 0) {
            res.data.data.items.forEach(ele => {
              tenantObj = {
                id: ele.id,
                name: ele.name
              };
              this.tenantData.push(tenantObj);
            });
          }
        }
      });
    },
    //改变的时候
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.pagesize = val;
      this.getUsers();
    },
    //条目改变的时候
    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;
      console.log(`当前页:${val}`);
      this.getUsers();
    },
    getUsers() {
      //获取所有的点的数据
      let para = {
        search_tenant:
          typeof this.customerID !== "undefined" ? this.customerID : this.filters.search_tenant,
        page: this.currentPage,
        per_page: this.pagesize,
        search_name: this.filters.search_name,
        search_type: this.filters.search_type,
        search_status: this.filters.search_status,
        search_start_bandwidth: this.filters.search_start_bandwidth,
        search_end_bandwidth: this.filters.search_end_bandwidth,
        
        search_start_charge_time: typeof this.filters.billingTime[0] == "undefined" ? "": Number(this.filters.billingTime[0]) / 1000,
        search_end_charge_time:
          typeof this.filters.billingTime[1] == "undefined"
            ? ""
            : Number(this.filters.billingTime[1]) / 1000,
        search_start_expiration_time:
          typeof this.filters.overdueTime[0] == "undefined"
            ? ""
            : Number(this.filters.overdueTime[0]) / 1000,
        search_end_expiration_time:
          typeof this.filters.overdueTime[1] == "undefined"
            ? ""
            : Number(this.filters.overdueTime[1]) / 1000,
        search_node: typeof this.nodeID !== "undefined" ? this.nodeID : "",
        search_logic_port:
          typeof this.customer !== "undefined" ? this.customer : ""
      };
      console.log(para);
      this.$ajax
        .get("/vll/p2p_vlls" + "?token=" + this.token, para)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              // this.users=res.data.data.items;
                 this.total=res.data.data.page.total;
              console.log(res);
							descriptionValue(res.data.data.items);
              res.data.data.items.forEach(ele => {
              	
                if (ele.type == "d2d") {
                  ele.typeName = "DCI";
                } else if (ele.type == "d2c") {
                  ele.typeName = "云互联";
                } else if (ele.type == "c2c") {
                  ele.typeName = "云直连";
                }
                if (ele.status == "failure") {
                  ele.statusHTML = "创建失败";
                  ele.statusColor = "creatFie";
                  ele.creat = true;
                  ele.btn=true;
                } else if (ele.status == "creating") {
                  ele.statusHTML = "创建中";
                  ele.statusColor = "creating";
                  ele.creat = false;
//                 ele.btn=t;
                } else if (ele.status == "stopping") {
                  ele.statusHTML = "停止中";
                  ele.specialName = "运行";
                  ele.statusColor = "stopVal";
                  ele.creat = true;
                  ele.btn=true;
                } else if (ele.status == "serving") {
                  ele.statusHTML = "运行中";
                  ele.specialName = "停止";
                  ele.statusColor = "ServerVal";
                  ele.creat = true;
                   ele.btn=false;
                }
                
                
                
                //								console.log(ele)
                var str = ele.endpoints;
                if (str) {
                  if (str.length !== 0) {
                    if (str.length == 1) {
                      console.log(ele);
                      ele.statusValA = getPortStatus(str[0].ports);
                      ele.logicPortA = str[0].logic_port.name;
                      if (str[0].vlan) {
                        if (str[0].vlan == "-1") {
                          ele.vlanHTMLA = "透传";
                        } else if (str[0].vlan == "0") {
                          ele.vlanHTMLA = "trunk";
                        } else {
                          ele.vlanHTMLA = str[0].vlan;
                        }
                      } else {
                        return;
                      }
                    } else if (str.length === 2) {
                      ele.statusValA = getPortStatus(str[0].ports);
                      ele.statusValZ = getPortStatus(str[1].ports);
                      if(getPortStatus(str[0].ports) ==='UP'){
                      	ele.colorA='colorGreen'
                      }else if(getPortStatus(str[0].ports)==='DOWN'){
                      	ele.colorA='colorRed'
                      }else if(getPortStatus(str[0].ports) ==='异常'){
                      	ele.colorA='colorWarning'
                      }
                      if(getPortStatus(str[1].ports) ==='UP'){
                      	ele.colorZ='colorGreen'
                      }else if(getPortStatus(str[1].ports)==='DOWN'){
                      	ele.colorZ='colorRed'
                      }else if(getPortStatus(str[1].ports) ==='异常'){
                      	ele.colorZ='colorWarning'
                      }
                      
                      ele.logicPortA = ele.endpoints[0].logic_port.name;
                      ele.logicPortZ = ele.endpoints[1].logic_port.name;
                      if (str[0].vlan) {
                        if (str[0].vlan == "-1") {
                          ele.vlanHTMLA = "透传";
                        } else if (str[0].vlan == "0") {
                          ele.vlanHTMLA = "trunk";
                        } else {
                          ele.vlanHTMLA = str[0].vlan;
                        }
                      } else if (str[1].vlan) {
                        if (str[1].vlan == "-1") {
                          ele.vlanHTMLZ = "透传";
                        } else if (str[1].vlan == "0") {
                          ele.vlanHTMLZ = "trunk";
                        } else {
                          ele.vlanHTMLZ = str[1].vlan;
                        }
                      }
                    } else {
                      return;
                    }
                  }
                }
              });
						let creatData=[],failureData=[],stopData=[],servData=[];
						let strData=res.data.data.items;
							creatData=strData.filter(item => {
								return item.status==='creating'
							})
							failureData=strData.filter(item => {
								return item.status==='failure'
							})
							stopData=strData.filter(item => {
								return item.status==='stopping'
							})
							servData=strData.filter(item => {
								return item.status==='serving'
							})
							this.users=creatData.concat(failureData,stopData,servData)


//            this.users = res.data.data.items;
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //全选单选多选
    selsChange: function(sels) {
      this.sels = sels;
    },
    handleSeePoint(index, row) {
      console.log(row);
      //专线的详情的
      //		    	console.log('进入专线详情');
      this.$router.push({
        path: "/resource/virtualLine/pointdetails",
        query: {
          pointID: row.id
        }
      });
    },
    handleSeeA(index, row) {
      //查看A的详情
      console.log("进入A端的详情");
      this.$router.push({
        path: "/resource/see/logicalPort",
        query: {
          detailsID: row.id
        }
      });
    },
    handleSeeZ(index, row) {
      //查看Z端的详情
      console.log("进入Z端的详情");
      this.$router.push({
        path: "/resource/see/logicalPort",
        query: {
          detailsID: row.id
        }
      });
    },
    handleEdit(index, row) {
      //编辑
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.editForm = {
        id: row.id,
        name: row.name,
        bandwidth: row.bandwidth,
        charge_time: new Date(datedialogFormat(row.charge_time)),
        expiration_time: new Date(datedialogFormat(row.expiration_time)),
        description: row.description
      };
    },
    reset(sles) {
      //重置
      for (let key in sles) {
        sles[key] = "";
      }
    },
    UpdateData: function() {
      //编辑保存按钮
      this.$refs.editForm.validate(valid => {
        if (valid) {
        //   this.$confirm("确定要修改 吗?", "提示", {})
        //     .then(() => {
              let para = Object.assign({}, this.editForm);

              this.$ajax
                .put(
                  "/vll/edit_p2p_vll/" +
                    this.editForm.id +
                    "?token=" +
                    this.token,
                  para
                )
                .then(res => {
                  if (res.status == 200) {
                    if (res.data.status == 0) {
                      this.$message({
                        message: "修改成功!",
                        type: "success"
                      });
                      this.$refs["editForm"].resetFields();
                      this.dialogFormVisible = false;
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
            // })
            // .catch(() => {});
        } else {
          return;
        }
      });
    },
    handleDel(index, row) {
      //删除
      this.$confirm("确定要删除吗?", "提示", {})
        .then(() => {
          this.$ajax
            .del("/vll/del_vll/"+ row.id + "?token=" + this.token)
            .then(res => {
              if (res.status == 200) {
                if (res.data.status == 0) {
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
    batchRemove: function() {
      //批量删除
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      console.log(ids);
      this.$confirm("确定要删除选中的数据吗?", "提示", {})
        .then(() => {
          const id = ids.substring(0, ids.lastIndexOf(","));
          this.isid = id.split(",");
          let para = { ids: this.isid };
          this.$ajax
            .del("/vll/del_vlls" + "?token=" + this.token, para)
            .then(res => {
              if (res.status == 200) {
                if (res.data.status == 0) {
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
    handleStatus(index, row) {
    	console.log(row);
    	if(row.specialName==='停止'){
    		this.$ajax.put('/vll/to_stop_vll/'+row.id+'?token='+this.token)
    		.then(res => {
    			if(res.status==200){
    				if(res.data.status==0){
    					this.$message({
    						message:'禁用成功!',
    						type:'success'
    					})
    					this.getUsers()
    				}else{
    					this.$message({
    						message:res.data.message,
    						type:'warning'
    					})
    				}
    				
    			}
    		})
    		.catch(e => {console.log(e)})
    	}else if(row.specialName==='运行'){
    		this.$ajax.put('/vll/to_serve_vll/'+row.id+'?token='+this.token)
    		.then(res => {
    			if(res.status==200){
    				if(res.data.status==0){
    					this.$message({
    						message:'运行成功!',
    						type:'success'
    					})
    					this.getUsers()
    				}else{
    					this.$message({
    						message:res.data.message,
    						type:'warning'
    					})
    				}
    			}
    		})
    	} 
    },
    handleExport(command) {
      //选择导出的当前还是所有数据
      if (command == "all") {
        console.log("导出所有的数据");
        this.$confirm("确定要导出所有的数据吗?", "提示", {})
          .then(() => {
            this.exportData();
          })
          .catch(() => {});
      } else if (command == " current") {
        console.log("导出当前的数据");
        this.$confirm("确定要导出当前页的数据吗?", "提示", {})
          .then(() => {
            var para = {
              page: this.currentPage,
              per_page: this.pagesize
            };
            this.exportData(para);
          })
          .catch(() => {});
      }
    },
    exportData: function(params) {
      this.$ajax
        .get("/vll/p2p_vlls" + "?token=" + this.token, params)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              this.excelData = res.data.data;
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //表格数据时间转换
    dateFormat(row, column) {
      //将时间戳转换为前端的时间
      let date = new Date(parseInt(row.creation_time) * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + "" : date.getDate() + "";
      let h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //计费时间和结束时间
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.editForm.expiration_time) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.editForm.expiration_time).getTime() < time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.editForm.charge_time) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.editForm.charge_time).getTime() > time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    }
  }
};
</script>

<style scoped>
.ipts {
  width: 80px;
}
.stopVal {
  color: #f56c6c;
}
.ServerVal {
  color: #20a0ff;
}
.creating {
  color: #67c23a;
}
.creatFie {
  color: #e6a23c;
}
</style>