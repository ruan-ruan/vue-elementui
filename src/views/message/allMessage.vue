<template>
  <div class="allMessage">

    <section>
      <!--工具条-->
      <el-col
        :span='24'
        class='toolbar'
        style='padding-bottom: 0px;'
      >
        <el-form
          :inline='true'
          :model='formList'
          ref='formList'
          @submit.native.prevent
        >
          <el-form-item
            :label="$t('mesModule.unMessage.table.title')"
            prop='name'
          >
            <el-input
              v-model='formList.name'
              class="sel"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('mesModule.unMessage.table.type')"
            prop='mesType'
          >
            <el-select
            	filterable
              class='ipt_sta'
              v-model='formList.mesType'
              :placeholder='$t("topFilters.placeholder")' 
            >
              <el-option
                v-for='(item,index) in mesTypeList'
                :key='index'
                :label='item.name'
                :value='item.value'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('mesModule.unMessage.table.level')"
            prop='level'
          >
            <el-select
            	filterable
              class='ipt_sta'
              v-model='formList.level'
              :placeholder='$t("topFilters.placeholder")' 
            >
              <el-option
                v-for='(vals,index) in levelList'
                :key='index'
                :label='vals.name'
                :value='vals.value'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label='时间'
            prop='timeVal'
          >
            <el-date-picker
              v-model="formList.timeVal"
              type="daterange"
              :range-separator="$t('mesModule.sea.time.to')"
              :start-placeholder="$t('mesModule.sea.time.start')"
              :end-placeholder="$t('mesModule.sea.time.end')"
              class='ipt_sels'
              @change="timeValSearchBtn"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <span>
              <el-button
              	size='small'
                type='primary'
                @click='getData'
              >{{ $t('topFilters.search')}}</el-button>
              <el-button
              	size='small'
                type='info'
                @click='reset'
              >{{$t('topFilters.reset')}}</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span='24'>
        <span style="float:right;">
          <el-button
            type="success"
            :disabled="this.sels.length===0"
            @click='markTap'
            size='small'
          >{{$t('mesModule.operation.marked')}}</el-button>
          <el-button
            type='danger'
            :disabled="this.sels.length===0"
            @click='delMes'
            size='small'
          >{{$t('tabOperation.delete')}}</el-button>
        </span>
      </el-col>
      <!--列表-->
      <el-table
        :data='tableData'
        highlight-current-row
        @selection-change='selsChange'
        style='width: 100%;'
        empty-text='暂无数据'
        v-loading='loading'
        
      >

        <el-table-column
          type='selection'
          align='center'
          
        ></el-table-column>
        <el-table-column
          type='index'
          align='center'
          :label= "$t('mesModule.unMessage.table.serial')"
        >
          <template slot-scope='scope'>
            <span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label=" $t('mesModule.unMessage.table.title') "
          prop='title'
          align='left'
        >
          <template slot-scope="scope">
            <el-popover
              ref="visible"
              placement="right"
              trigger="hover"
            >
              <span class="warptitle"v-html='scope.row.content ' >
              	<!--{{ scope.row.content | filText }}-->
              	<!--v-html='scope.row.content'-->
              </span>
              <span
                style="margin-left: 5px;"
                class='cli_spn'
                slot="reference"
                @click="handleClick(scope.$index,scope.row)"
                
              >
                <span v-show="!scope.row.is_read"><img
                    src="../../assets/images/message/unread.png.png"
                    alt=""
                    style="width:12px;height:12px;"
                   
                  ></span>
                {{ scope.row.title}}
              </span>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column
          prop='time'
          :formatter='dateFormat'
          :label="$t('mesModule.unMessage.table.time')"
          
          width='80'
          align='center'
        ></el-table-column>
        <el-table-column
          prop='level'
          :label="$t('mesModule.unMessage.table.level')"
          align='center'
          
        >
          <template slot-scope="scope">
            <span>{{ scope.row.level}}{{$t('mesModule.sea.leType')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='type'
          :label="$t('mesModule.unMessage.table.type')"
          align='center'
        >
          <!--<template slot-scope="scope">
            <span>{{ scope.row.type=='notice'?$t('mesModule.sea.mesTypeList.product'):$t('mesModule.sea.mesTypeList.police')}}</span>
          </template>-->
        </el-table-column>
      </el-table>
      <!--底部工具条-分页-数据的导出等-->
      <el-col
        :span='24'
        class='toolbar'
      >
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
      <messageDialog
        :mesdetail="mesdetail"
        @getData='getData'
      ></messageDialog>

    </section>
  </div>
</template>

<script>
import messageDialog from "@/components/dialog/messageDialog";
import { getTime } from "@/assets/js/index.js";
import Utils from "@/assets/js/eventBus.js";
export default {
  name: "read",
  components: {
    messageDialog
  },
  data() {
    return {
      //获取用户的token
      token: sessionStorage.getItem("token"),
      //顶部的搜索的部分对用参数
      formList: {
        name: "",
        mesType: "",
        level: "",//  展示纤细的类型
        start_time: "",
        end_time: "",
        //选择时间
        timeVal: []
      },
      mesdetail: {
        dialogVisible: false,
        header: "",
        title: "",
        type: "",
        timeVal: "",
        text: "",
        parma:{}
      },
      //表格的数据
      tableData: [],
      // 选中的项
      sels: [],
      //类型
      mesTypeList: [
	      {
	      	name:'端口类型',
	      	value:'port'
	      },
	      {
	      	name:'节点类型',
	      	value:'node'
	      },
	      {
	      	name:'设备类型',
	      	value:'device'
	      },
	      {
	      	name:'业务类型',
	      	value:'vll'
	      }
      ],
      //状态的转换
      levelList: [
         {
          name: this.$t('mesModule.sea.mesTypeList.product'),
          value: "notice"
        },
        {
          name:this.$t('mesModule.sea.mesTypeList.police'),
          value: "warning"
        }
      ],
      //时间戳的转换
      Tiem: 0,
      //分页所需要的参数
      total: 0,
      pagesize: 10,
      currentPage: 1,
      pageNum: 1,
      pagecount: 5,

      loading: false,
      isid: [],
      readid: [],
      tableDatas: []
    };
  },
  filters:{
  	filText(msg){
  		console.log(msg)
  		return msg.replace(/\\n/g ,' <br/> ')
  	}
  },
  created() {
    this.getData();
  },
  methods: {
    //重置按钮
    reset() {
      this.$refs["formList"].resetFields();
    },
    selsChange(val) {
      this.sels = val;
    },
    // 标记已读
    markTap() {
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      if (!ids) {
        this.$message({
          message: "请选择你要标记的选项",
          type: "warning",
          duration: 1500
        });
        return;
      } else {
        this.$confirm("确认要标记该记录吗？", "提示", {
          type: "warning"
        })
          .then(() => {
            const id = ids.substring(0, ids.lastIndexOf(","));
            this.readid = id.split(",");
            let para = { ids: this.readid };
            this.$ajax
              .put("/public/read_news" + "?token=" + this.token, para)
              .then(res => {
              	console.log(res)
                if (res.status == 200) {
                  if (res.data.status == 0) {
                    this.$message({
                      message: "标记成功!",
                      type: "success"
                    });
                    this.getData();
                    this.$store.state.message = this.$store.state.message - 1;
                    if (this.$store.state.message < 0) {
                      this.$store.state.message = 0;
                    }
                  }
                }
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(() => {});
      }
    },
    // 删除消息
    delMes() {
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      var id = ids.substring(0, ids.lastIndexOf(","));
      this.isid = id.split(",");
      const paras = { ids: this.isid };
      if (!ids) {
        this.$message({
          message: "请选择你要删除的选项",
          type: "warning",
          duration: 1500
        });
        return;
      } else {
        this.$confirm("确认要删除该记录吗？", "提示", {
          type: "warning"
        })
          .then(() => {
            this.$ajax
              .del("/public/del_news" + "?token=" + this.token, paras)
              .then(res => {
                if (res.status == 200) {
                  if (res.data.status == 0) {
                    this.$message({
                      message: "删除成功!",
                      type: "success"
                    });

                  }
                    this.getData();
                  
                }
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(() => {});
      }
    },
    //获取列表的所有的数据
    getData() {
      var _this = this;
      this.loading = true;
      this.formList.start_time = this.formList.timeVal[0]
        ? this.formList.timeVal[0]
        : "";
      this.formList.end_time = this.formList.timeVal[1]
        ? this.formList.timeVal[1]
        : "";
      var para = {
        page: this.currentPage,
        per_page: this.pagesize,
        search_title: this.formList.name,
        search_type: this.formList.mesType,// 展示消息是端口还是节点的数据类型
        search_level: this.formList.level,
        search_start_time: getTime(this.formList.start_time),
        search_end_time: getTime(this.formList.end_time)
      };
      this.$ajax
        .get("/public/get_news" + "?token=" + this.token, para)
        .then(res => {
          _this.loading = false;
          if (res.status == 200) {
            if (res.data.status == 0) {
              _this.tableData = res.data.data.items;
              _this.total = res.data.data.page.total;
              this.tableDatas = res.data.data.items? res.data.data.items.slice(0, 5): [];
              Utils.$emit("demo", this.tableDatas);
            }
          }
        })
        .catch(e => {
          _this.loading = false;
          console.log(e);
        });
    },
    dateFormat(row, column) {
      let date = new Date(parseInt(row.time) * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
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
    timeValSearchBtn(value) {
      this.formList.start_time = this.formList.timeVal[0];
      this.formList.end_time = this.formList.timeVal[1];
    },
    //分页的选择页面显示个数和点击其他的分页的时候显示数据
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 消息详情-弹窗
    handleClick(index, row) {
    	this.mesdetail={
    		dialogVisible:true,
    		header:row.title,
    		title:row.type,
    		type : row.level + this.$t('mesModule.sea.leType'),
    		timeVal : row.time,
    		text : row.content,
    		param:row.param,
    		code:row.code,
    		id:row.id,
    		level:row.level,
    	}
      this.readid = row.id.split(",");
      
      let para = { ids: this.readid };
      this.$ajax
        .put("/public/read_news" + "?token=" + this.token, para)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 0) {
              this.$store.state.message = this.$store.state.message - 1;
              if (this.$store.state.message < 0) {
                this.$store.state.message = 0;
              }
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style lang="scss">
.allMessage {
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 290px;
  }
  .el-table__empty-block{
		/*display: none !important;*/
		display: block  !important;
	}
}
</style>