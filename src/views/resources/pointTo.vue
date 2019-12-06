<template>
  <div>
    <!--点到点专线-->
    <section>
      <el-row class='toolbar'>
        <el-col  :span='24'  >
          <el-form :model='filters':inline='true' ref='filters'>
            <el-form-item :label='$t("Public.name")' prop='search_name'>
              <el-input
                v-model='filters.search_name'
                class='sel'
                :placeholder='$t("Public.name")'
              ></el-input>
            </el-form-item>
            <el-form-item :label='$t("Public.tenant")' prop='search_tenant'>
              <el-select
                v-model='filters.search_tenant' filterable
                class='sel' >
                <el-option
                  v-for='(item,index) in tenantData'
                  :value='item.id'
                  :label='item.name'
                  :key='index'
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("Public.specialStatus")' prop='search_status'>
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
            <el-form-item :label='$t("Public.specialType")' prop='search_type'>
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
            <el-form-item :label='$t("Public.bandwidth")' prop='search_start_bandwidth'>
              <el-input
                v-model='filters.search_start_bandwidth'
                class='ipts'
                :placeholder='$t("Public.origin")'
              ></el-input>{{$t('Public.to')}}
            </el-form-item>
            <el-form-item prop='search_end_bandwidth'>
            	<el-input
                v-model='filters.search_end_bandwidth'
                class='ipts'
                :placeholder='$t("Public.abort")'
              ></el-input>
            </el-form-item>
            <el-form-item :label='$t("Public.billTime")' prop='billingTime'>
              <el-date-picker
                v-model="filters.billingTime"
                type="datetimerange"
                value-format="timestamp"
                :range-separator="$t('Public.to')"
                :start-placeholder="$t('Public.staBill')"
                :end-placeholder="$t('Public.endBill')"
                class='ipt'
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label='$t("Public.expTime")' prop='overdueTime'>
              <el-date-picker
                v-model="filters.overdueTime"
                type="datetimerange"
                value-format="timestamp"
                :range-separator="$t('Public.to')"
                :start-placeholder="$t('Public.origin')"
                :end-placeholder="$t('Public.abort')"
                class='ipt'
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
              	size='small'
                @click='getUsers'
                type='primary'
              >{{$t('topFilters.search')}}</el-button>
              <el-button
              	size='small'
                type='info'
                @click='reset'
              >{{$t('topFilters.reset')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
				<div class="table-top">
          <el-button size='small' type="danger"  @click="batchRemove()" :disabled="this.sels.length===0" v-if='buttonVal.del? parentStatus :buttonVal.del'  >
             	{{$t('tabOperation.delete')}}</el-button>   	
           <el-dropdown size='small' split-button type='success' @command="handleExport"  >
             	 {{$t('tabOperation.derived.tit')}}
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>
                <el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
				</div>
				
          <el-table
            :data="users"
            @selection-change="selsChange"
            highlight-current-row
            v-loading='getLoading'
            
          >
            <el-table-column
              type='selection'
              min-width='30'
              align='center'
              v-if='parentStatus'
            ></el-table-column>
            <el-table-column
              type='index'
              :label='$t("Public.index")'
              min-width='30'
              align='center'
            >
	            <template slot-scope='scope'>
								<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
							</template>
            </el-table-column>
            <el-table-column
              :label='$t("Public.specialName")'
              min-width='60'
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
              :label='$t("Public.specialStatus")'
              min-width='50'
              align='center'
            >
              <template slot-scope='scope'>
                <span :class="scope.row.statusColor">{{scope.row.statusHTML}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop='bandwidth'
              :label='$t("Public.bandwidth")'
              min-width='60'
              align='center'
            >
            </el-table-column>
            <el-table-column
              :label='$t("Public.specialType")'
              min-width='60'
              align='center'
            >
              <template slot-scope='scope'>
                <span>{{scope.row.typeName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label='$t("Public.aPort")'
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
            <el-table-column :label='$t("Public.aLogicStatus")' min-width='70'  align='center'  >
              <template slot-scope='scope'>
                <span  :class="scope.row.colorA" v-text="scope.row.statusValA"> </span>
              </template>
            </el-table-column>
            <el-table-column
              :label='$t("Public.zPort")'
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
            <el-table-column prop='endpoints.ports.status' :label='$t("Public.zLogicStatus")'  min-width='75' align='center' >
            	<template slot-scope='scope'>
            		<span v-text='scope.row.statusValZ' :class="scope.row.colorZ"></span>
            	</template>
            </el-table-column>
            <el-table-column
              prop='creation_time'
              :label='$t("Public.creation")'
              width='80'
             
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='charge_time'
              :label='$t("Public.billTime")'
              width='80'
              
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='expiration_time'
              :label='$t("Public.expTime")'
              width='80'
              
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='tenant.name'
              :label='$t("Public.tenant")'
              min-width='70'
              align='center'
            >
            </el-table-column>
            <el-table-column
              prop='descriptionVal'
              :label='$t("Public.description")'
              min-width='70'
              align='center'
            >
            </el-table-column>
            <el-table-column
              :label='$t("Public.operation")'
              width='140'
              align='center'
              v-if='parentStatus'
            >
              <template slot-scope='scope' v-if='scope.row.status == "creating"?false:true '>
                <el-button
                  size='mini'
									v-if='buttonVal.stop? scope.row.status !=="failure"?true:false  : buttonVal.stop'
                  @click='handleStatus(scope.$index,scope.row)'
                >{{scope.row.specialName}}</el-button>
                <el-button
                  size='mini'
                  type='primary'
                  @click='handleEdit(scope.$index,scope.row)'
                  v-if='buttonVal.edit ? scope.row.status !=="failure"?true:false :buttonVal.edit'
                >{{$t('tabOperation.edit')}}</el-button>
                <el-button
                  size='mini'
                  type='danger'
                  @click='handleDel(scope.$index,scope.row)'
                  v-if='buttonVal.del ? scope.row.status=="failure"?true:false : buttonVal.del'
                >{{$t('tabOperation.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
      
      <el-row v-if='parentStatus' class='toolbar'>
        	<el-col :span='24'>
          <el-pagination
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30,50]"
            :current-page.sync="currentPage"
            :page-count='pageNum'
            :pager-count="pagecount"
          ></el-pagination>

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
          label-width='200px'
          :rules='editFormRules'
        >
          <el-form-item
            :label='$t("Public.specialName")'
            prop='name'
          >
            <el-input v-model='editForm.name'  class='ipt'></el-input>
          </el-form-item>
          <el-form-item
            :label='$t("Public.bandW")'
            prop='bandwidth'
          >
            <el-input v-model='editForm.bandwidth'  class='ipt'></el-input>Mbps
          </el-form-item>
          <el-form-item :label='$t("Public.busiStatus")'>
            <el-input
              v-model='editForm.statusHTML' class='ipt'
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item :label='$t("Public.creation")'>
            <el-input v-model='editForm.time' class='ipt' disabled></el-input>
          </el-form-item>
          <el-form-item :label='$t("Public.billTime")'>
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
             :placeholder="$t('Public.plaStartBill')"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label='$t("Public.expTime")'>
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
              :placeholder="$t('Public.plaEndBill')"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label='$t("Public.description")'>
            <el-input type='textarea' v-model='editForm.description'  class='ipt'></el-input>
          </el-form-item>
        </el-form>
        <div
          slot='footer'
          class='dialog-footer'
        >
          <el-button size='small' @click.native='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
          <!--编辑-->
          <el-button
            v-if="dialogStatus=='update'"
            size='small'
            type="primary"
            @click="UpdateData"
          >{{$t('tabOperation.save')}}</el-button>
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
  descriptionValue,dealNull
  
} from "@/assets/js/index";
export default {
  name: "pointsTo",
  props: ["customer", "nodeID", "customerID"], // customer 逻辑口的id   nodeID节点的id
  data() {
    let isValidNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('Public.plaBandwidth')));
      } else if (!isValidinteger(value)) {
        callback(new Error(this.$t('Public.plarightBand')));
      }if(value>1000000){
					callback(new Error(this.$t('Public.maxBand')))
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

      textMap: {
        update:this.$t('confirm.editVir')
      },
      dialogStatus: "",
      dialogFormVisible: false,
      editLoading: false,
      editForm: {
        name: "",
        bandwidth: "",
        charge_time: "",
        expiration_time: "",
        description: "",
        time:'',
        statusHTML:'',//业务状态
        charge_mode:''
      },
      editFormRules: {
        name: [{ required: true, message:this.$t('Public.plaName'), trigger: "blur" }],
        bandwidth: [
          { required: true, validator: isValidNumber, trigger: "blur" }
        ]
      },
      excelData: [],
      specialData: [
        {
          label: this.$t('Public.creating'),
          value: "creating"
        },
        {
          label: this.$t('Public.stopping'),
          value: "stopping"
        },
        {
          label: this.$t('Public.failure'),
          value: "failure"
        },
        {
          label: this.$t('Public.servicing'),
          value: "servicing"
        }
      ], //专线的状态
      specialTypeData: [
        {
          label: "DCI",
          value: "d2d"
        },
        {
          label: this.$t('Public.cloudInter'),
          value: "d2c"
        },
        {
          label: this.$t('Public.cloudsTo'),
          value: "c2c"
        }
      ],
      specialTypeData1: [
        {
          label:this.$t('Public.cloudInter'),
          value: "d2c"
        },
        {
          label:this.$t('Public.cloudsTo'),
          value: "c2c"
        }
      ],
      startDatePicker: this.beginDate(), //计费时间 和 结束时间的判断
      endDatePicker: this.processDate(),
      tenantData: [], //租户数据
      parentStatus: true, //该组件被调用的S时候，上面控制部分隐藏
      isid: [],
      baseForm:{},//数据的备份
      timers:null,
      buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
	  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@del_vll").show,//单个删除和批量的删除是绑定在一起的  
	  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list,"vll@edit_p2p_vll").show,//编辑的值
	  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@p2p_vll_info" ).show,//查看详情
	  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@to_stop_vll").show,//查看逻辑口的详情
	  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@to_serve_vll").show,//查看逻辑口的详情
	  		
	  	}
    };
  },
  created() {

    this.token = sessionStorage.getItem("token");
    this.getFiltersData();
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

      this.$ajax.get("/tenant/tenants" + "?token=" + this.token)
      .then(res => {
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
      }).catch(e => {console.log(e)})
       
    },
    //改变的时候
    handleSizeChange(val) {

      this.pagesize = val;
      this.getUsers();
    },
    //条目改变的时候
    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;
      this.getUsers();
    },
    getUsers() {
      //获取所有的点的数据
      this.getLoading=true;
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
        search_end_charge_time: typeof this.filters.billingTime[1] == "undefined"  ? "" : Number(this.filters.billingTime[1]) / 1000,
        search_start_expiration_time: typeof this.filters.overdueTime[0] == "undefined" ? ""  : Number(this.filters.overdueTime[0]) / 1000,
        search_end_expiration_time:  typeof this.filters.overdueTime[1] == "undefined"  ? "" : Number(this.filters.overdueTime[1]) / 1000,
        search_node: typeof this.nodeID !== "undefined" ? this.nodeID : "",
        search_logic_port: typeof this.customer !== "undefined" ? this.customer : ""
      };
      this.$ajax.get("/vll/p2p_vlls" + "?token=" + this.token, para)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {

            	this.getLoading=false;
              // this.users=res.data.data.items;
              this.total=res.data.data.page.total;
							descriptionValue(res.data.data.items);
							
							dealNull(res.data.data.items,'charge_time')
							
              res.data.data.items.map(ele => {
              	//设置   a端  z端数据  datedialogFormat
								if((!ele.charge_time && typeof(ele.charge_time) !='undefined' && ele.charge_time !=0) || ele.charge_time==''|| typeof ele.charge_time =='undefined'){
	            		ele.charge_time=''
	            	}else {
	            		ele.charge_time=datedialogFormat(ele.charge_time)
	            	}
	            	if((!ele.expiration_time&& typeof(ele.expiration_time) !='undefined' && ele.expiration_time !=0) || ele.expiration_time=='' || typeof ele.charge_time =='undefined'){
	            		ele.expiration_time=''
	            	}else {
	            		ele.expiration_time=datedialogFormat(ele.expiration_time)
	            	}
	            	
	            	ele.creation_time=datedialogFormat(ele.creation_time);
	            	if(ele.type ==='d2d'){//d2d
	            		ele.typeName = "DCI";
	            		var objA=ele.endpoints.find(item =>{
	            			return item.name =='A端';
	            		})
	            		var objZ=ele.endpoints.find(item => {
	            			return item.name =='Z端';
	            		})
	            		if (ele.status == "failure") {
	                  ele.statusHTML = this.$t('Public.failure');
	                  ele.statusColor = "creatFie";
	                  //creat   控制操作部分   btn控制  删除按钮和其他按钮的互斥

	                } else if (ele.status == "creating") {
	                  ele.statusHTML = this.$t('Public.creating');
	                  ele.statusColor = "creating";

	                } else if (ele.status == "stopping") {
	                	
	                  ele.statusHTML = this.$t('Public.stopping');
	
	                  ele.specialName = this.$t('tabOperation.run');
	                  ele.statusColor = "stopVal";

	                }else if (ele.status == "servicing"){
	                	
	                	ele.specialName = this.$t('tabOperation.stop');
	                	
	                	
										if(getPortStatus(objA.ports) =='UP' || getPortStatus(objA.ports) =='异常' ){
	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.servicing');
	                  		ele.statusColor = "ServerVal";
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  	}
	                  }else if(getPortStatus(objA.ports)=='DOWN'){
	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.fau');
	                  		ele.statusColor = "creatFie";
	                  		
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  	}
	                  }
	                }
	                ele.statusValA = getPortStatus(objA.ports);
                  ele.statusValZ = getPortStatus(objZ.ports);
                  if(getPortStatus(objA.ports) ==='UP'){
                  	ele.colorA='colorGreen'
                  }else if(getPortStatus(objA.ports)==='DOWN'){
                  	ele.colorA='colorRed'
                  }else if(getPortStatus(objA.ports) ==='异常'){
                  	ele.colorA='colorWarning'
                  }
                  if(getPortStatus(objZ.ports) ==='UP'){
                  	ele.colorZ='colorGreen'
                  }else if(getPortStatus(objZ.ports)==='DOWN'){
                  	ele.colorZ='colorRed'
                  }else if(getPortStatus(objZ.ports) ==='异常'){
                  	ele.colorZ='colorWarning'
                  }
                  ele.logicPortA = objA.logic_port.name;
                  ele.logicPortZ = objZ.logic_port.name;
	                if (objA.vlan == "-1") {
	                  ele.vlanHTMLA = this.$t('Public.passthrough');//透传
	                } else if (objA.vlan == "0") {
	                  ele.vlanHTMLA = "UNTAG";
	                } else {
	                  ele.vlanHTMLA = 'vlan:' + objA.vlan;
	                }
	                if (objZ.vlan == "-1") {
	                  ele.vlanHTMLZ = this.$t('Public.passthrough');
	                } else if (objZ.vlan == "0") {
	                  ele.vlanHTMLZ = "UNTAG";
	                } else {
	                  ele.vlanHTMLZ ='vlan:' + objZ.vlan;
	                }
	            	}else if(ele.type == "d2c"){//d2c
	            		
	            		
	            		var objA=ele.cloud_endpoints.find(item =>{
	            			return item.name =='A端';
	            		})
	            		var objZ=ele.endpoints.find(item => {
	            			return item.name =='Z端';
	            		})
	            		ele.typeName = this.$t('Public.cloudsTo');//云直连
	            	
	            		if (ele.status == "failure") {
	                  ele.statusHTML = this.$t('Public.failure');
	                  ele.statusColor = "creatFie";

	                } else if (ele.status == "creating") {
	                  ele.statusHTML = this.$t('Public.creating');
	                  ele.statusColor = "creating";

	                } else if (ele.status == "stopping") {
	                	
	                  ele.statusHTML = this.$t('Public.stopping');
	
	                  ele.specialName = this.$t('tabOperation.run');
	                  ele.statusColor = "stopVal";

	                }else if (ele.status == "servicing"){
	                	ele.specialName = this.$t('tabOperation.stop');
										if(getPortStatus(objA.ports) =='UP' || getPortStatus(objA.ports) =='异常' ){

	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.servicing');
	                  		ele.statusColor = "ServerVal";
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  	}
	                  }else if(getPortStatus(objA.ports)=='DOWN'){
	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.fau');
	                  		ele.statusColor = "creatFie";
	                  		
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  			
	                  	}
	                  }
	                }
                	ele.statusValA = getPortStatus(objA.ports);
                  ele.statusValZ = getPortStatus(objZ.ports);
                  if(getPortStatus(objA.ports) ==='UP'){
                  	ele.colorA='colorGreen'
                  }else if(getPortStatus(objA.ports)==='DOWN'){
                  	ele.colorA='colorRed'
                  }else if(getPortStatus(objA.ports) ==='异常'){
                  	ele.colorA='colorWarning'
                  }
                  if(getPortStatus(objZ.ports) ==='UP'){
                  	ele.colorZ='colorGreen'
                  }else if(getPortStatus(objZ.ports)==='DOWN'){
                  	ele.colorZ='colorRed'
                  }else if(getPortStatus(objZ.ports) ==='异常'){
                  	ele.colorZ='colorWarning'
                  }

                  ele.logicPortA = objA.cloud_config.logic_port.name;
                  ele.logicPortZ = objZ.logic_port.name;
	                if (objA.vlan == "-1") {
	                  ele.vlanHTMLA = this.$t('Public.passthrough');//透传
	                } else if (objA.vlan == "0") {
	                  ele.vlanHTMLA = "UNTAG";
	                } else {
	                  ele.vlanHTMLA = 'vlan:' + objA.vlan;
	                }
	                if (objZ.vlan == "-1") {
	                  ele.vlanHTMLZ = this.$t('Public.passthrough');
	                } else if (objZ.vlan == "0") {
	                  ele.vlanHTMLZ = "UNTAG";
	                } else {
	                  ele.vlanHTMLZ ='vlan:' + objZ.vlan;
	                }
	            	}else if(ele.type == "c2c"){
	            		
	            		
	            		var objA=ele.cloud_endpoints.find(item =>{
	            			return item.name =='A端';
	            		})
	            		var objZ=ele.cloud_endpoints.find(item => {
	            			return item.name =='Z端';
	            		})
	            		ele.typeName = this.$t('Public.cloudInter');//云互联
	            		if (ele.status == "failure") {
	                  ele.statusHTML = this.$t('Public.failure');
	                  ele.statusColor = "creatFie";
	                  //creat   控制操作部分   btn控制  删除按钮和其他按钮的互斥

	                } else if (ele.status == "creating") {
	                  ele.statusHTML = this.$t('Public.creating');
	                  ele.statusColor = "creating";

	                } else if (ele.status == "stopping") {
	                	
	                  ele.statusHTML = this.$t('Public.stopping');
	
	                  ele.specialName = this.$t('tabOperation.run');
	                  ele.statusColor = "stopVal";

	                }else if (ele.status == "servicing"){
	                	ele.specialName = this.$t('tabOperation.stop');
										if(getPortStatus(objA.ports) =='UP' || getPortStatus(objA.ports) =='异常' ){

	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.servicing');
	                  		ele.statusColor = "ServerVal";
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  	}
	                  	
	                  }else if(getPortStatus(objA.ports)=='DOWN'){
	                  	if(getPortStatus(objZ.ports) =='UP' || getPortStatus(objZ.ports) =='异常'){
	                  		ele.statusHTML = this.$t('Public.fau');
	                  		ele.statusColor = "creatFie";
	                  		
	                  	}else if(getPortStatus(objZ.ports)=='DOWN'){
	                  			ele.statusHTML = this.$t('Public.fau');
	                  			ele.statusColor = "creatFie";
	                  	}
	                  }
	                }
	                	ele.statusValA = getPortStatus(objA.ports);
	                  ele.statusValZ = getPortStatus(objZ.ports);
	                  if(getPortStatus(objA.ports) ==='UP'){
	                  	ele.colorA='colorGreen'
	                  }else if(getPortStatus(objA.ports)==='DOWN'){
	                  	ele.colorA='colorRed'
	                  }else if(getPortStatus(objA.ports) ==='异常'){
	                  	ele.colorA='colorWarning'
	                  }
	                  if(getPortStatus(objZ.ports) ==='UP'){
	                  	ele.colorZ='colorGreen'
	                  }else if(getPortStatus(objZ.ports)==='DOWN'){
	                  	ele.colorZ='colorRed'
	                  }else if(getPortStatus(objZ.ports) ==='异常'){
	                  	ele.colorZ='colorWarning'
	                  }
	
	                  ele.logicPortA = objA.cloud_config.logic_port.name;
	                  ele.logicPortZ = objZ.cloud_config.logic_port.name;
                    if (objA.vlan == "-1") {
                      ele.vlanHTMLA = this.$t('Public.passthrough');//透传
                    } else if (objA.vlan == "0") {
                      ele.vlanHTMLA = "UNTAG";
                    } else {
                      ele.vlanHTMLA = 'vlan:' + objA.vlan;
                    }
                    if (objZ.vlan == "-1") {
                      ele.vlanHTMLZ = this.$t('Public.passthrough');
                    } else if (objZ.vlan == "0") {
                      ele.vlanHTMLZ = "UNTAG";
                    } else {
                      ele.vlanHTMLZ ='vlan:' + objZ.vlan;
                    }
	            	}

              });

						this.users=res.data.data.items


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

      //专线的详情的
      if(this.buttonVal.see){
      	this.$router.push({
	        path: "/resource/virtualLine/pointdetails",
	        query: {
	          pointID: row.id
	        }
	      });
      }else{
      	this.$message({
      		message:'暂无查看权限！',
      		type:'warning'
      	})
      }
    },
    handleSeeA(index, row) {//A端的详情

    	var logic=new Object();
    	if(row.type ==='d2d'){
    		var obj=row.endpoints.find(item => {
					return item.name == 'A端'
				})
    		logic=obj.logic_port;
    	}else if(row.type === 'd2c' || row.type ==='c2c'){//云直连
    		var obj=row.cloud_endpoints.find(item => {
					return item.name == 'A端'
				})
    		logic=obj.cloud_config.logic_port;
    	}
      //查看A的详情
			if(JSON.stringify(logic) !=='{}'){
				this.$router.push({
	        path: "/resource/see/logicalPort",
	        query: {
	          detailsID: logic.id
	        }
	      });
	      this.$emit('send',logic.id)//改组件被引用的时候  向父组件传值更新
			}
      
    },
    handleSeeZ(index, row) {
      //查看Z端的详情
      var logic=new Object();
    	if(row.type ==='d2d' || row.type === 'd2c'){
    		var obj=row.endpoints.find(item => {
					return item.name == 'Z端'
				})
    		logic=obj.logic_port;
    	}else if(row.type ==='c2c'){//云直连
    		var obj=row.cloud_endpoints.find(item => {
					return item.name == 'Z端'
				})
    		logic=obj.cloud_config.logic_port;
    	}

			if(JSON.stringify( logic) !=='{}'){
				this.$router.push({
	        path: "/resource/see/logicalPort",
	        query: {
	          detailsID: logic.id
	        }
	      });
	      this.$emit('send',logic.id)//改组件被引用的时候  向父组件传值更新
			}
     
      
    },
    handleEdit(index, row) {
      //编辑
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      if( (!row.expiration_time && typeof(row.expiration_time)!='undefined' && row.expiration_time!=0) || (typeof (row.expiration_time) ==='undefined') || row.expiration_time ==''){
      	row.expiration_time=''
      }
      if( (!row.charge_time && typeof(row.charge_time)!='undefined' && row.charge_time!=0) || (typeof (row.charge_time) ==='undefined') || row.charge_time==''){
      	row.charge_time=''
      }
      this.editForm = {
        id: row.id,
        name: row.name,
        bandwidth: row.bandwidth,
        time:row.creation_time,
        charge_time:row.charge_time==''?"": new Date(row.charge_time),
        expiration_time:row.expiration_time==''?"": new Date(row.expiration_time) ,
        description: row.description,
        statusHTML:row.statusHTML,
        charge_mode:row.charge_mode
      };
      this.baseForm=Object.assign({},row);
     	this.baseForm.charge_time==datedialogFormat(row.charge_time)
    },
    reset() {
      this.$refs['filters'].resetFields()
    },
    UpdateData: function() {
      //编辑保存按钮
      this.$refs.editForm.validate(valid => {
        if (valid) {
			let para={
				name:this.editForm.name,
				charge_mode:this.editForm.charge_mode,
				bandwidth:this.editForm.bandwidth,
				charge_time:this.editForm.charge_time=='Invalid Date'?null: Number(this.editForm.charge_time)/1000,
				expiration_time:this.editForm.expiration_time=='Invalid Date'?null: Number(this.editForm.expiration_time)/1000,
				description:this.editForm.description
			}

          	this.$ajax.put(
              	"/vll/edit_p2p_vll/" + this.editForm.id + "?token=" +  this.token,  para  )
            .then(res => {
              if (res.status == 200) {
                if (res.data.status == 0) {
                  this.$message({
                    message: this.$t('tooltipMes.editSuccess'),
                    type: "success"
                  });
                  
                }
                this.$refs["editForm"].resetFields();
              	this.dialogFormVisible = false;
              	this.getUsers();
              }
            })
            .catch(e => {
              console.log(e);
            });
        } 
      });
    },
    handleDel(index, row) {
      //删除
      this.$confirm(this.$t('confirm.title'), this.$t('confirm.tooltip'), {type:'warning'})
        .then(() => {
          this.$ajax
            .del("/vll/del_vll/"+ row.id + "?token=" + this.token)
            .then(res => {
              if (res.status == 200) {
                if (res.data.status == 0) {
                  this.$message({
                    message:this.$t('tooltipMes.delSuccess'),
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
    batchRemove: function() {
      //批量删除
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'), {type:'warning'})
        .then(() => {
          const id = ids.substring(0, ids.lastIndexOf(","));
          this.isid = id.split(",");
          let para = { ids: this.isid };
          this.$ajax.del("/vll/del_vlls" + "?token=" + this.token, para)
            .then(res => {
              if (res.status == 200) {
                if (res.data.status == 0) {
                	
                  this.$message({
                    message:this.$t('tooltipMes.delSuccess'),
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
    handleStatus(index, row) {
    	if(row.specialName=== this.$t('tabOperation.stop') ){
    		this.$ajax.put('/vll/to_stop_vll/'+row.id+'?token='+this.token)
    		.then(res => {
    			if(res.status==200){
    				if(res.data.status==0){
    					this.$message({
    						message:this.$t('tooltipMes.stopSuccess'),
    						type:'success'
    					})

    				}
    					this.getUsers()
    				
    			}
    		})
    		.catch(e => {console.log(e)})
    	}else if(row.specialName===this.$t('tabOperation.run')){
    		this.$ajax.put('/vll/to_serve_vll/'+row.id+'?token='+this.token)
    		.then(res => {
    			if(res.status==200){
    				if(res.data.status==0){
    					this.$message({
    						message:this.$t('tooltipMes.runSuccess'),
    						type:'success'
              })

    				}
              this.getUsers()
    				
    			}
    		})
    	} 
    },
    handleExport(command) {
      //选择导出的当前还是所有数据
      if (command == "all") {
        this.$confirm(this.$t('tooltipMes.exportDataAll'), this.$t('confirm.tooltip'), {})
          .then(() => {
            this.exportData();
          })
          .catch(() => {});
      } else if (command == " current") {

        this.$confirm(this.$t('tooltipMes.exportDataCurr'), this.$t('confirm.tooltip'), {})
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
  },

};
</script>

<style scoped>

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