<template>
	<div>
		<!--device port 子组件-->
		<div class="formleft" v-for="(domain,index) in editForm.devicelist" :key="domain.index">
				<el-row>
					<el-col :span="12">
						<el-form-item :label='$t("Public.aDevice")+":"' :prop="'devicelist.'+index+'.a_device'" :rules="{required:true,message:'不能为空',trigger:'change'}">
							<el-select v-model='domain.a_device' style='width: 180px;' :disabled='seeStatus'  @change='selectDeviceA(domain)'>
								<el-option v-for='item in aDevice'
									:value='item.id'
									:label='item.hostname'
									:key='item.id'></el-option>
							</el-select>		
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label='$t("Public.devicePort")+":"' style="margin-left:-60px;" :prop="'devicelist.'+index+'.a_device_port'">
						<el-select v-model='domain.a_device_port' :disabled='seeStatus' style='width: 150px;' @change='selectDevicePort(domain.a_device_port)'>
							<el-option v-for='(item,it) in aDevicePort'
								:value='item.id'
								:label='item.port_no'
								:key='item.id'
								>
								<template>
									<span>{{item.port_no}}</span>
									<span :class='[item.color ,"marL60"]'>{{item.status}}</span>
								</template>
							</el-option>
						</el-select>
					</el-form-item>	
					</el-col>
				</el-row>
				<el-form-item v-show="!seeStatus">
					<el-button @click='device_port_add'>+</el-button>
					<el-button  @click='device_port_down(index)'>-</el-button>
				</el-form-item>
			</div>
	</div>
</template>

<script>
export default {
  name: "devicePort",
  props: {
    aDevice: Array
  },
  watch: {
    aDevice: {
      handler(newVal, oldVal) {
        this.$forceUpdate();
        console.log(newVal);
      },
      deep: true
    },
    aDevicePort: {
      handler(newVal, oldVal) {
        this.$forceUpdate();
        console.log(newVal);
      },
      deep: true
    }
  },
  data() {
    return {
      token: sessionStorage.getItem("token"),
      editForm: {
        device: "",
        port: ""
      },
      editFormRules: {
		device:[{required:true, message:this.$t('Public.selDeviceA'),trigger:'change,blue'}],
		port:[{required:true, message:this.$t('Public.selPort'),trigger:'change,blue'}],
	  },
      Device: [],
      Port: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.aDevice);
      console.log(this.aDevicePort);
    });
    this.Device = this.aDevice;
  },
  methods: {
	validataForm() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    selectDeviceA(id) {
      this.$forceUpdate();
      this.editForm.port = "";
      //筛选可用的设备端口

      var para = {
        search_available: false
      };
      this.$ajax
        .get(
          "/node/device_info/" + id + "/ports" + "?token=" + this.token,
          para
        )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            if (res.data.status == 0) {
              res.data.data.items.map(item => {
                if (item.status === "UP") {
                  item.color = "statusUP";
                } else {
                  item.color = "statusDOWN";
                }
              });
			  this.aDevicePort = res.data.data.items;
			  this.Port = this.aDevicePort;
			  this.$emit('func',this.editForm.device,this.editForm.port);
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectDevicePort(id) {
	  this.$forceUpdate();
	  this.$emit('func',this.editForm.device,this.editForm.port);
    }
  }
};
</script>

<style>
</style>