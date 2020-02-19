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
            <el-table-column   prop='creation_time'
              :formatter='dateFormat'   width='80'  :label='$t("Public.creation")'   align='center'  ></el-table-column>
            <el-table-column   prop='name'  min-width='80'  :label='$t("Public.nodeName")'   align='center' ></el-table-column>
            <el-table-column   prop='nodeStatus'   min-width='80'  :label='$t("Public.nodeStatus")'  align='center' >
            
            </el-table-column>
            <el-table-column   min-width='80'  :label='$t("Public.deviceName")'   align='center'  >
              <template slot-scope="scope">
              	<span>{{scope.row.devices_name1}}</span> <br />
              	<span>{{scope.row.devices_name2}}</span>

              </template>
            </el-table-column>
            <el-table-column
              prop='exist_status'
              min-width='80'

              :label='$t("Public.deviceStatus")' 
              align='center'
            >
              <template slot-scope="scope">
                <ul v-for='item in scope.row.devices'>
                  <li>{{item.exist_status=='normal'?$t('Public.run') : $t('Public.leave') }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              min-width='60'

              :label='$t("Public.snNumber")' 
              align='center'
            >
              <template slot-scope="scope">
              	<span>{{scope.row.devices_sn1}}</span> <br />
              	<span>{{scope.row.devices_sn2}}</span>
                <!--<ul v-for='item in scope.row.devices'>
                  <li v-text="item.sn"></li>
                </ul>-->
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
                <!--<ul v-for='item in scope.row.devices'>
                  <li v-text="item.ip"></li>
                </ul>-->
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
              prop='descriptionVal'
              min-width='60'
              
             :label='$t("Public.description")' 
              align='center'
            ></el-table-column>
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
            :current-page.sync="currentPage"
            :page-count='pageNum'
            :pager-count="pagecount"
          ></el-pagination>
        </el-col>

    </section>
  </div>
</template>

<script>

	
import {descriptionValue,getTime,sortVal} from '@/assets/js/index.js'

export default {
  name: "Service",
  data() {
    return {
      //获取用户的token
      token: "",
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
    //获取用户的权限
    this.token = sessionStorage.getItem("token");

    this.selectData();
    this.getUsers();
//  console.log( this.$store.state.aside )
//		console.log(  this.recursion( this.$store.state.aside ,"aside.pointSpecial")  )
    
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
        search_end_time: getTime(this.filters.end_time)
      };
      this.$ajax.get("/node/nodes" + "?token=" + this.token, para)
        .then(res => {
          _this.loading = false;
          if (res.status == 200) {
            if (res.data.status == 0) {
            	descriptionValue(res.data.data.items)
              let params = res.data.data.items;

              params.forEach((ele, index) => {

                //将数据的状态保
                //根据状态对删除的按钮的显示是否渲染到模板做处理
                if (ele.status == "运行中") {
                  _this.diStatus = false;
                } else {
                  _this.diStatus = true;
                }
                
                if(ele.devices.length ==1){
					var str1=ele.devices.find(item => {
    					return item['sign'] == 'd1' 
    				})
    				ele.devices_name1=str1.hostname
    				ele.devices_ip1=str1.ip;
    				ele.devices_sn1=str1.sn;
    				
    				ele.devices_name2='';
    				ele.devices_ip2='';
    				ele.devices_sn2='';
    				
    				if(str1.exist_status == "normal"){
    					ele.nodeStatus = this.$t('Public.SingleRun');
    				}else{
    						ele.nodeStatus= this.$t('Public.leave');
    				}
    				
    				
    				
				}else if(ele.devices.length ==2){
					var str1=ele.devices.find(item => {
    					return item.sign == 'd1' 
    				})
					
					var str2=ele.devices.find(item => {
    					return item.sign =='d2' 
    				})
					
					if(str1.exist_status == "normal" && str2.exist_status == "normal"){
    					ele.nodeStatus= this.$t('Public.run');
    				}else if( (str1.exist_status == "normal" && str2.exist_status == "found") || (str2.exist_status == "normal" && str1.exist_status == "found") ){
    					ele.nodeStatus= this.$t('Public.SingleRun');
    				}else{
    						ele.nodeStatus= this.$t('Public.leave');
    				}
					
					
					
    				ele.devices_name1=str1.hostname
    				ele.devices_ip1=str1.ip;
    				ele.devices_sn1=str1.sn;
    				
    				ele.devices_name2=str2.hostname
    				ele.devices_ip2=str2.ip;
    				ele.devices_sn2=str2.sn;
				}
                
                
              	});

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
    dateFormat(row, column) {
      let date = new Date(parseInt(row.creation_time) * 1000);
      let Y = date.getFullYear() + "-";
      let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) + "-" : date.getMonth() + 1 + "-";
      let D =  date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
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
              per_page: this.pagesize
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
              this.excelData = res.data.data.items;
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
        const tHeader = [this.$t('Public.creation'), this.$t('Public.dataCen'), this.$t('Public.id'), this.$t('Public.manageIP'), this.$t('Public.description')];
        const filterVal = [
          "creation_time",
          "dc_name",
          "id",
          "ip",
          "description"
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