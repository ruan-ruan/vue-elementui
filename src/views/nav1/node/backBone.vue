<template>
  <div>
    <section>
      <!--工具条-->
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'  >
        <el-form :inline='true' :model='filters' ref='filters'>
          <el-form-item :label='$t("Public.name")' prop='name' >
            <el-input  v-model='filters.name' class='ipt_sta' ></el-input>
          </el-form-item>
          <el-form-item :label='$t("physicalPosition.tab.data")' prop='search_dc' >
            <el-select class='ipt_sta' v-model='filters.search_dc' :placeholder='$t("topFilters.placeholder")' filterable  >
              <el-option
                v-for='(item,index) in dataCenter'
                :key='index'
                :label='item.name'
                :value='item.id'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  :label='$t("Public.status")' prop='search_status' >
            <el-select  class='ipt_sta' v-model='filters.search_status'  :placeholder='$t("topFilters.placeholder")' >
              <el-option
                v-for='(vals,index) in status'
                :key='index'
                :label='vals.label'
                :value='vals.value'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label='$t("Form.creation")' prop='timeVal' >
            <el-date-picker
              v-model="filters.timeVal"
              type="datetimerange"
              :range-separator="$t('Public.to')"
              :start-placeholder="$t('Public.start')"
              :end-placeholder="$t('Public.end')"
              class='port_sel'
              @change="timeValSearchBtn"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size='small' type='primary' v-on:click='getUsers' >
            	<!--查询-->{{$t('topFilters.search')}}
            </el-button>
            <el-button size='small'  type='info'  @click='reset' >
            	<!--重置-->{{$t('topFilters.reset')}}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>


      <div class="table-top">
          <el-button size='small'  type="danger"   @click="batchRemove(sels)"   :disabled="this.sels.length===0"  v-if='buttonVal.del'>
          	<!--批量删除-->{{$t('tabOperation.batchDel')}}
          </el-button>
      	 <el-dropdown size='small' split-button  type='success'  @command="handleExport"  >
         		 <!--导出数据-->{{$t('tabOperation.derived.tit')}}
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item command="current"> 
            	<!--当前页-->{{$t('tabOperation.derived.currentPage')}}
            </el-dropdown-item>
            <el-dropdown-item command="all">
            	<!--所有页-->{{$t('tabOperation.derived.allPage')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      
      
      <!--列表-->
        <el-col :span="24">
          <el-table :data='users'   highlight-current-row   @selection-change='selsChange'   style='width: 100%;'   
          	v-loading='loading' >
            <el-table-column  type='selection'  min-width='50'  ></el-table-column>
            <el-table-column   type='index'  min-width='80'   :label='$t("Public.index")'   align='center' >
            	<template slot-scope='scope'>
								<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
							</template>
            </el-table-column>
            <el-table-column    width='80'  :label='$t("Public.creation")'   align='center'  >
            	<template slot-scope='scope'>
            		{{ scope.row.creation_time | timeFormat }}
            	</template>
            </el-table-column>
            <el-table-column   prop='name'  min-width='80'  :label='$t("Public.nodeName")'   align='center' ></el-table-column>
            <el-table-column    width='80'  :label='$t("Public.nodeStatus")'  align='center' >
            	<template slot-scope='scope'>
            		<!--prop='nodeStatus'--> 
            		<span :class="scope.row.color">{{scope.row.nodeStatus}}</span>
            	</template>
            </el-table-column>
            <el-table-column   min-width='80'  :label='$t("Public.deviceName")'   align='center'  >
              <template slot-scope="scope">
              	<span>{{scope.row.devices_name1}}</span> <br />
              	<span>{{scope.row.devices_name2}}</span>

              </template>
            </el-table-column>
            <el-table-column
              prop='exist_status'
              width='80'
              :label='$t("Public.deviceStatus")' 
              align='center'
            >
              <template slot-scope="scope">
                <ul v-for='(item,index) in scope.row.devices' :key='index'>
                  <li  :class="item.status=='UP'? 'backRun':'backStop' ">{{item.status=='UP'?$t('Public.run') : $t('Public.leave') }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              min-width='60'

              :label='$t("Public.snNumber")' 
              align='center'
            >
              <template slot-scope="scope">
              	<span >{{scope.row.devices_sn1}}</span> <br />
              	<span>{{scope.row.devices_sn2}}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width='70'
             
              :label='$t("Public.manageIP")' 
              align='center'
            >
              <template slot-scope="scope">
              	<span>{{scope.row.devices_ip1}}</span> <br />
              	<span>{{scope.row.devices_ip2}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop='vtep'
             min-width='80'
             
              label='vtep'
              align='center'
            ></el-table-column>
            <el-table-column
              prop='dc.name'
              min-width='70'
              
              :label='$t("Public.dataCen")' 
              align='center'
            ></el-table-column>
            <el-table-column

              min-width='60'
              
             :label='$t("Public.description")' 
              align='center'
            >
            <template slot-scope='scope'>
            	
							{{ scope.row.devices[0].description | descriptionValue }} <br />
							<span v-if='scope.row.devices && scope.row.devices.length ==2'>
							{{ scope.row.devices[1].description | descriptionValue }}
							</span>
						</template>
            </el-table-column>
            <el-table-column
            	width='140'
              :label='$t("Public.operation")' 
              align='center'
            >
              <template slot-scope='scope'>
                <el-button
                  type='info'
                  size='mini'
                  @click='handleSee(scope.$index, scope.row)'
                  v-if='buttonVal.see'
                > 
                <!--详情-->{{ $t('tabOperation.info')}}
                </el-button>
                <el-button
                  type='success'
                  size='mini'
                  @click='handleEdit(scope.$index, scope.row)'
                  v-if='buttonVal.edit'
                >
                <!--编辑-->{{ $t('tabOperation.edit')}}
                </el-button>
                <el-button
                  type='danger'
                  size='mini'
                  @click='handleDel(scope.$index, scope.row)'
                  v-if='buttonVal.del?diStatus:false'
                >
                <!--删除-->{{ $t('tabOperation.delete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

      <!--底部工具条-分页-数据的导出等-->

        <el-col :span='24'  class='toolbar'>
          <el-pagination
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30,50]"
            :page-size='pagesize'
            :current-page.sync="currentPage"
            :page-count='pageNum'
            :pager-count="pagecount"
          ></el-pagination>
        </el-col>

    </section>
  </div>
</template>

<script>

	
import {descriptionValue,getTime,sortVal,datedialogFormat} from '@/assets/js/index.js'

export default {
  name: "Service",
  data() {
    return {
      //获取用户的token
      token: sessionStorage.getItem("token"),
      //顶部的搜索的部分对用参数
      filters: {
        name: "",
        search_dc: "",
        search_status: "",
        start_time: "",
        end_time: "",
        //选择时间
        timeVal: []
      },

      //列表的数据
      users: [],
      sels: [],
      //数据中心的数据
      dataCenter: [],
      //状态的转换
      status: [
        {
          value: "UP",
          label: this.$t('Public.run')
        },
        {
          value: "DOWN",
          label: this.$t('Public.leave')
        }
      ],
      //时间戳的转换
      Tiem: 0,
      //删除按钮是根据状态是否离线来实现的
      diStatus: true,
      //分页所需要的参数
      total: 0,
      pagesize: 10,
      currentPage: 1,
      pageNum: 1,
      pagecount: 5,

      //导出数据的时候用来保存数据
      excelData: [],
      loading: false,
      dataCen: {
        id: "",
        name: ""
      },
      buttonData:this.recursion( this.$store.state.aside ,"Public.backboneNode"),//获取节点内
	  	buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏
	  		del:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backboneNode").list, "node@del_node").show,//单个删除和批量的删除是绑定在一起的  
	  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backboneNode").list, "node@edit_node").show,//编辑的值
	  		see:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backboneNode").list, "node@node_info" ).show,//查看详情
	  	}
    };
  },
  created() {
    this.selectData();
    this.getUsers()
  },
  methods: {
    selectData() {
      this.$ajax
        .get("/location/dcs" + "?token=" + this.token)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              var str = [];
              var sons = [];
              var dataCen;
              str = res.data.data.items;
              sons = str;
              var arr = [];
              for (let val of sons) {
                arr.push(val.id);
              }
              var newArr = [];
              var newArr2 = [];
              for (var i = 0; i < arr.length - 1; i++) {
                if (newArr.indexOf(arr[i]) == -1) {
                  newArr.push(arr[i]);
                  newArr2.push(sons[i]);
                }
              }
              this.dataCenter = newArr2;
              this.bus.$emit("service", this.dataCenter);
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    //重置按钮
    reset() {
      this.$refs['filters'].resetFields()
    },
    selsChange(sels) {
      this.sels = sels;
    },
    timeValSearchBtn(value) {

    	if( (!value   && typeof (value) !='undefined' && value !=0) || typeof value =='undefined' ){
    		return 
    		this.filters.start_time='';
    		this.filters.end_time='';
    	}else {
    		this.filters.start_time = this.filters.timeVal[0];
      	this.filters.end_time = this.filters.timeVal[1];
    	}
      
    },
    //获取列表的所有的数据
    getUsers() {
      var _this = this;
      this.loading = true;

      var str=this.filters.timeVal;
      if(   ! str &&  typeof(str) !='undefined' && str!=0 ){
      	this.filters.start_time='';
      	this.filters.end_time=''
      }else {
      	this.filters.start_time = this.filters.timeVal[0]  ? this.filters.timeVal[0] : "";
      	this.filters.end_time = this.filters.timeVal[1] ? this.filters.timeVal[1] : "";
      }
      //				顶部工具栏内的对应的数据
      var para = {
        page: this.currentPage,
        per_page: this.pagesize,
        search_name: this.filters.name,
        search_dc: this.filters.search_dc,
        search_status: this.filters.search_status,
        search_start_time: getTime(this.filters.start_time),
        search_end_time: getTime(this.filters.end_time),
        search_activated:true,//true的时候    代表的是已经运行的节点   false是未运行节点
      };
      this.$ajax.get("/node/nodes" + "?token=" + this.token, para)
        .then(res => {
          _this.loading = false;
          if (res.status == 200) {
            if (res.data.status == 0) {
              let arr = res.data.data.items;
              for(let item =0 ;item<arr.length;item++){
              	if(arr[item].status == "运行中"){
              		 _this.diStatus = false;
              	}else{
              		 _this.diStatus = true;
              	}
              	if(arr[item].devices.length ==1){
									var str1=arr[item].devices.find(i => {
				    					return i['sign'] == 'd1' 
				    				})
				    				arr[item].devices_name1=str1.hostname
				    				arr[item].devices_ip1=str1.ip;
				    				arr[item].devices_sn1=str1.sn;
				    				
				    				arr[item].devices_name2='';
				    				arr[item].devices_ip2='';
				    				arr[item].devices_sn2='';
				    				if(str1.status == "UP"){
				    					arr[item].nodeStatus = this.$t('Public.run');
				    					arr[item].color='backRun'
				    				}else{
				    						arr[item].nodeStatus= this.$t('Public.leave');
				    						arr[item].color='backStop'
				    				}
								}else if(arr[item].devices.length ==2){
									var str1=arr[item].devices.find(i => {
				    					return i.sign == 'd1' 
				    				})
									
									var str2=arr[item].devices.find(i => {
				    					return i.sign =='d2' 
				    				})

									if(str1.status == "UP" && str2.status == "UP"){
				    					arr[item].nodeStatus= this.$t('Public.run');
				    					arr[item].color='backRun'
				    			}else	if( (str1.status == "UP" && str2.status == "DOWN")
				    			|| (str2.status == "DOWN" && str1.status == "UP")){
				    					arr[item].nodeStatus= this.$t('Public.SingleRun');
				    					arr[item].color='backRun'
				    				}else{
			    						arr[item].nodeStatus= this.$t('Public.leave');
			    						arr[item].color='backStop'
				    				}
				    				arr[item].devices_name1=str1.hostname
				    				arr[item].devices_ip1=str1.ip;
				    				arr[item].devices_sn1=str1.sn;
				    				
				    				arr[item].devices_name2=str2.hostname
				    				arr[item].devices_ip2=str2.ip;
				    				arr[item].devices_sn2=str2.sn;
									}
             }
               _this.users = res.data.data.items;
              _this.total = res.data.data.page.total;
            }
          }
        })
        .catch(e => {
          _this.loading = false;
          console.log(e);
        });
    },
    //分页的选择页面显示个数和点击其他的分页的时候显示数据
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUsers();
    },
    //详情界面
    handleSee(index, row) {
      this.$router.push({
        path: "/location/index/unknown/nodedetails",
        query:{
        	detailsID:row.id
        }
      });
    },
    //显示编辑的界面
    handleEdit(index, row) {
//    this.$router.push({ path: "/location/index/editForm/" + row.id });
      this.$router.push({
        path: "/location/index/editForm",
        query: {
          edtiID: row.id
        }
      });
      //将数据中心的数据发送到数据仓库
      this.$store.state.DataCenter = this.dataCenter;
    },
    handleDel: function(index, row) {
      this.$confirm(this.$t('confirm.title'), this.$t('confirm.tooltip'), {
        type: "warning"
      })
        .then(() => {
          this.$ajax
            .del("/node/del_node/" + row.id + "?token=" + this.token)
            .then(res => {
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: this.$t('tooltipMes.delSuccess'),
                    type: "success"
                  });
                  this.getUsers();
                }
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    //批量删除
    batchRemove: function(rows) {
      var ids = [];
      rows.forEach(element => {
        ids.push(element.id);
      });
      this.$confirm( this.$t('confirm.titles'), this.$t('confirm.title'), {
        type: "warning"
      })
        .then(() => {
          let para = {
            ids: ids
          };
          this.$ajax
            .del("/node/del_nodes" + "?token=" + this.token, para)
            .then(res => {
              if (res.status == "200") {
                if (res.data.status == "0") {
                  this.$message({
                    message: this.$t('tooltipMes.delSuccess'),
                    type: "success"
                  });
                }
                this.getUsers();
              }
            });
        })
        .catch(() => {});
    },
    handleExport(command) {
      if (command == "all") {
        //导出所有的数据
        this.$confirm( this.$t('tooltipMes.exportDataAll') , this.$t('confirm.title'), {
          confirmButtonText: this.$t('confirm.confi'),
          cancelButtonText: this.$t('tabOperation.cancel'),
          type: "warning"
        })
          .then(() => {
            var para = {
              page: this.currentPage,
              per_page: this.pagesize,
              search_activated:true
            };
            this.exportData(para);
          })
          .catch(() => {});
      } else if (command == "current") {
        //导出当前
        this.$confirm( this.$t('tooltipMes.exportDataCurr'),  this.$t('confirm.title'), {
         	confirmButtonText: this.$t('confirm.confi'),
          cancelButtonText: this.$t('tabOperation.cancel'),
          type: "warning"
        })
          .then(() => {
            this.exportData();
          })
          .catch(() => {});
      }
    },
    exportData: function(params) {
      this.$ajax
        .get("/node/nodes" + "?token=" + this.token, params)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              
              var arr=res.data.data.items;
              for(let item =0 ;item<arr.length;item++){
              	if(arr[item].devices.length ===1){
              		arr[item]={
              			id:arr[item]['id'],
              			creation_time:arr[item]['creation_time'],
              			user_vlan:arr[item]['user_vlan'],
              			vtep:arr[item]['vtep'],
              			description:arr[item]['description'],

	              		dc_name:arr[item].dc.name,
	              		creation_time:datedialogFormat(arr[item].creation_time),
	              		device1_ip:arr[item]['devices'][0]['ip'],
	              		device1_sn:arr[item]['devices'][0]['sn'],
	              		device1_hostname:arr[item]['devices'][0]['hostname'],
	              		device1_id:arr[item]['devices'][0]['id'],
	              		device1_model:arr[item]['devices'][0]['model'],
	              		device1_port_section:arr[item]['devices'][0]['port_section'],
	              		device1_vendor:arr[item]['devices'][0]['vendor'],
	              		device1_room:arr[item]['devices'][0]['room'],
	              		device1_rack:arr[item]['devices'][0]['rack'],
	              		device1_status:arr[item]['devices'][0]['status'],
	              		
	              		device2_ip:'',
	              		device2_sn:'',
	              		device2_hostname:'',
	              		device2_id:'',
	              		device2_model:'',
	              		device2_port_section:'',
	              		device2_vendor:'',
	              		device2_room:'',
	              		device2_rack:'',
	              		device2_status:'',
	              	}
              	}else{
              		arr[item]={
              			id:arr[item]['id'],
              			creation_time:arr[item]['creation_time'],
              			user_vlan:arr[item]['user_vlan'],
              			vtep:arr[item]['vtep'],
              			description:arr[item]['description'],
	              		dc_name:arr[item].dc.name,
	              		creation_time:datedialogFormat(arr[item].creation_time),
	              		device1_ip:arr[item]['devices'][0]['ip'],
	              		device1_sn:arr[item]['devices'][0]['sn'],
	              		device1_hostname:arr[item]['devices'][0]['hostname'],
	              		device1_id:arr[item]['devices'][0]['id'],
	              		device1_model:arr[item]['devices'][0]['model'],
	              		device1_port_section:arr[item]['devices'][0]['port_section'],
	              		device1_vendor:arr[item]['devices'][0]['vendor'],
	              		device1_room:arr[item]['devices'][0]['room'],
	              		device1_rack:arr[item]['devices'][0]['rack'],
	              		device1_status:arr[item]['devices'][0]['status'],
	              		
	              		device2_ip:arr[item]['devices'][1]['ip'],
	              		device2_sn:arr[item]['devices'][1]['sn'],
	              		device2_hostname:arr[item]['devices'][1]['hostname'],
	              		device2_id:arr[item]['devices'][1]['id'],
	              		device2_model:arr[item]['devices'][1]['model'],
	              		device2_port_section:arr[item]['devices'][1]['port_section'],
	              		device2_vendor:arr[item]['devices'][1]['vendor'],
	              		device2_room:arr[item]['devices'][1]['room'],
	              		device2_rack:arr[item]['devices'][1]['rack'],
	              		device2_status:arr[item]['devices'][1]['status'],
	              	}
              	}
              }
              this.excelData = arr;
              this.export2Excel();
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    export2Excel() {
      let that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/export2Excel");
        const tHeader = [this.$t('Public.creation'), 
        'user_vlan','vtep',this.$t('Public.dataCen'), 
        this.$t('Public.id'),  this.$t('Public.description'),
        
        '(1)'+this.$t('Public.deviceName'),'(1)'+this.$t('Public.deviceStatus'),
        '(1)'+this.$t('Public.snNumber'),'(1)'+this.$t('Public.manageIP'),
        '(1)'+this.$t('Public.vendor'),'(1)'+this.$t('Public.deviceModel'),
        '(1)'+this.$t('Public.portSection'),'(1)'+this.$t('Public.room'),
        '(1)'+this.$t('Public.rack'),'(1)'+this.$t('Public.deviceID'),
        
        '(2)'+this.$t('Public.deviceName'),'(2)'+this.$t('Public.deviceStatus'),
        '(2)'+this.$t('Public.snNumber'),'(2)'+this.$t('Public.manageIP'),
        '(2)'+this.$t('Public.vendor'),'(2)'+this.$t('Public.deviceModel'),
        '(2)'+this.$t('Public.portSection'),'(2)'+this.$t('Public.room'),
        '(2)'+this.$t('Public.rack'),'(2)'+this.$t('Public.deviceID')
        ];
        const filterVal = [
          "creation_time",'user_vlan','vtep', "dc_name", "id","description",
          
          'device1_hostname',
          'device1_status','device1_sn', 'device1_ip', 'device1_vendor',   'device1_model',
	        'device1_port_section', 'device1_room', 'device1_rack', 'device1_id',
          
          
          'device2_hostname',
          'device2_status','device2_sn', 'device2_ip', 'device2_vendor',   'device2_model',
	        'device2_port_section', 'device2_room', 'device2_rack', 'device2_id',
        ];
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, this.$t('tooltipMes.download')+"excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },

};
</script>

<style >
	
	

</style>