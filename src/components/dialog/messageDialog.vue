<template>
  <div class="mesgdia">
    <el-dialog
      title="消息详情"
      :visible.sync="mesdetail.dialogVisible"
      :before-close="handleClose"
    >
      <div class="backg">
        <div>
          <h4>{{mesdetail.header}}</h4>
          <br>
          <p>类型：{{mesdetail.title}}</p>
          <p>时间：{{timestamp(mesdetail.timeVal)}}</p>
        </div>
        <h3>
          {{mesdetail.type}}
        </h3>
      </div>
      <div class="cener">
        <span>
          {{mesdetail.text}}
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    mesdetail: Object
  },
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.mesdetail.dialogVisible = false;
      this.$emit('getData');
    },
    timestamp(timestamp){
      let timestampString = null;
      if(String(timestamp).length==10) {
        timestampString = timestamp*1000;
      }else {
        timestampString = timestamp;
      }
      var date = new Date(Number(timestampString));

      var Y = date.getFullYear() +'-';
      var M = (date.getMonth() +1<10 ?'0'+(date.getMonth() +1 +'-'):(date.getMonth()+1)+'-');
      var D = this.timeChange(date.getDate()) +'';
      var h = this.timeChange(date.getHours()) +':';
      var m = this.timeChange(date.getMinutes()) +':';
      var s = date.getSeconds();
      return Y + M + D + h + m + this.timeChange(s);
    },
    timeChange(time){
      time = String(time);
      if(time.length ==1) {
        return '0' +time;
      }else {
        return time;
      }
    }
  }
};
</script>
<style lang="scss">
.mesgdia {
  .el-dialog {
    height: auto;
    .el-dialog__body {
      padding: 0 0 20px 0 !important;
      background: #f0f1f4;
      .backg {
        padding: 0 20px;
        padding-top: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #ccc;
        p {
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .cener {
        margin: 10px 20px;
        border-top: 1px solid #cccccc;
        text-align: left;
        background: #f0f1f4;
        padding: 10px 0;
        span {
          font-size: 14px;
          text-align: left;
        }
      }
    }
  }
}
</style>