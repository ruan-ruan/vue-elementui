<template>
  <div class="unreadmessage">

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
          @submit.native.prevent
        >
          <el-form-item
            label='标题'
            prop='name'
          >
            <!--搜索对应的名字-->
            <el-input
              v-model='formList.name'
              class='sel'
            ></el-input>
          </el-form-item>
          <el-form-item
            label='类型'
            prop='mesType'
          >
            <el-select
              class='ipt_sta'
              v-model='formList.mesType'
              placeholder='全部'
            >
              <el-option
                v-for='item in mesTypeList'
                :key='item.value'
                :label='item.name'
                :value='item.value'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label='级别'
            prop='level'
          >
            <el-select
              class='ipt_sta'
              v-model='formList.level'
              placeholder='全部'
            >
              <el-option
                v-for='vals in levelList'
                :key='vals.name'
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
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class='ipt_sels'
              @change="timeValSearchBtn"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <span>
              <el-button
                type='primary'
                @click='getData'
              >查询</el-button>
              <el-button
                type='info'
                @click='reset(formList)'
              >重置</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span='24'>
        <span>
          <el-button
            type="success"
            @click='markTap'
          >标记已读</el-button>
          <el-button
            type='danger'
            @click='delMes'
          >删除</el-button>
        </span>
      </el-col>
      <!--列表-->
      <el-table
        :data='tableData'
        highlight-current-row
        @selection-change='handleSelectionChange'
        style='width: 100%;'
        v-loading='loading'
      >
        <el-table-column
          type='selection'
          width='60'
        ></el-table-column>
        <el-table-column
          label='标题'
          prop='title'
          align='left'
        >
          <template slot-scope="scope">
            <el-popover
              ref="visible"
              placement="right"
              trigger="hover"
            >
              <span class="warptitle">
                {{scope.row.content | ellipsis}}
              </span>
            </el-popover>
            <span v-show="!scope.row.is_read"><img
                src="../../assets/images/message/unread.png.png"
                alt=""
                style="width:12px;height:12px;"
              ></span>
            <span
              style="margin-left: 5px;"
              class='cli_spn'
              v-popover:visible
              @click="handleClick(scope.$index,scope.row)"
            >{{ scope.row.title}}</span>

          </template>
        </el-table-column>
        <el-table-column
          prop='time'
          :formatter='dateFormat'
          label='时间'
          align='center'
        ></el-table-column>
        <el-table-column
          prop='level'
          label='级别'
          align='center'
        >
          <template slot-scope="scope">
            <span>{{ scope.row.level}}级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='type'
          label='类型'
          align='center'
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type=='notice'?'产品信息':'警告信息'}}</span>
          </template>
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
          :current-page.sync="currentPage"
          :page-count='pageNum'
          :pager-count="pagecount"
          :prev-text='prev'
          :next-text='next'
        ></el-pagination>
      </el-col>
      <messageDialog :mesdetail="mesdetail"></messageDialog>

    </section>
  </div>
</template>

<script>
import messageDialog from "@/components/dialog/messageDialog";
import { getTime } from "@/assets/js/index.js";
export default {
  name: "Service",
  components: {
    messageDialog
  },
  data() {
    return {
      //获取用户的token
      token: "",
      //顶部的搜索的部分对用参数
      formList: {
        name: "",
        mesType: "",
        level: "",
        start_time: "",
        end_time: "",
        //选择时间
        timeVal: []
      },
      mesdetail: {
        dialogVisible: false,
        header: "标题信息",
        title: "一级信息",
        type: "产品信息",
        timeVal: "2019.12.9",
        text: "ertertretdfgdg"
      },
      //表格的数据
      tableData: [],
      // 选中的项
      sels: [],
      //类型
      mesTypeList: [
        {
          name: "产品消息",
          value: "notice"
        },
        {
          name: "报警消息",
          value: "warning"
        }
      ],
      //状态的转换
      levelList: [
        {
          name: "一级",
          value: "1级"
        },
        {
          name: "二级",
          value: "2级"
        },
        {
          name: "三级",
          value: "3级"
        },
        {
          name: "四级",
          value: "4级"
        },
        {
          name: "五级",
          value: "5级"
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
      next: "下一页",
      prev: "上一页",
      loading: false,
      isid: [],
      readid: []
    };
  },
  created() {
    //获取用户的权限
    this.token = sessionStorage.getItem("token");
  },
  mounted() {
    //执行钩子函数
    this.getData();
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  methods: {
    //重置按钮
    reset(sels) {
      for (let key in sels) {
        sels[key] = "";
      }
    },
    // 标记已读
    markTap() {
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      console.log(ids);
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
            console.log(id);
            this.readid = id.split(",");
            let para = { ids: this.readid };
            this.$ajax
              .put("/public/read_news" + "?token=" + this.token, para)
              .then(res => {
                debugger;
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
                  } else if (res.data.status) {
                    this.$message({
                      messaeg: res.data.message,
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
      }
    },
    handleSelectionChange(val) {
      this.sels = val;
      console.log(this.sels);
    },
    // 删除消息
    delMes() {
      console.log(111);
      let ids = "";
      for (let item of this.sels) {
        ids += item.id + ",";
      }
      console.log(ids);

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
            const id = ids.substring(0, ids.lastIndexOf(","));
            this.isid = id.split(",");
            let para ={ ids: this.isid };
            console.log(para);
            this.$ajax
              .del("/public/del_news" + "?token=" + this.token, {data:para})
              .then(res => {
                if (res.status == "200") {
                  if (res.data.status == "0") {
                    this.$message({
                      message: "删除成功!",
                      type: "success"
                    });
                    this.getData();
                  } else if (res.data.status) {
                    this.$message({
                      messaeg: res.data.message,
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
        search_type: this.formList.mesType,
        search_level: this.formList.level,
        search_start_time: getTime(this.formList.start_time),
        search_end_time: getTime(this.formList.end_time),
        search_read: "false"
      };
      this.$ajax
        .get("/public/get_news" + "?token=" + this.token, para)
        .then(res => {
          _this.loading = false;
          console.log(res);
          if (res.status == 200) {
            if (res.data.status == 0) {
              _this.tableData = res.data.data.items;
              console.log(_this.tableData);
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
      this.mesdetail.dialogVisible = true;
      this.mesdetail.header = row.content;
      this.mesdetail.title = row.type == "notice" ? "产品信息" : "警告信息";
      this.mesdetail.type = row.level + "级";
      this.mesdetail.timeVal = row.time;
      this.mesdetail.text = row.title;
    }
  }
};
</script>

<style lang="scss">
.unreadmessage {
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 290px;
  }
}
</style>