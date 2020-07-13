<template>
	<div class="device">
		<!--这个是设备端口的组件封装 label-width='210px'-->
		<el-form :inline='true' :model='filter'   ref='filter':rules='rulesFilter' v-loading='load'>
			<el-form-item :label='editForm.device+"："' prop='device'>
				<el-select v-model='filter.device' class='ipt_sels2' @change='selDevice( filter.device )'>
					<el-option v-for='item in device'
						:key='item.id'
						:value='item.id'
						:label='item.hostname'>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='设备端口：' prop='port'>
				<el-select  v-model='filter.port' class='ipt_sels2' @change='selPort(filter.port)'>
					<el-option v-for='item in portList'
						:key='item.id'
						:value='item.id'>
						<template>
							<span>{{ item.port_no }}</span>
							<span :style='{color:item.status=="DOWN"?"red":"#20B3FD" ,marginLeft:"40px",}'>{{item.status}}</span>
						</template>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	
	export default{
		name:'devicePort',
		props:{
			label:{//  父组件传值过来  label信息数据  抱哈端口和设备的label字段，和 节点id
				type:Object,
				default:function(){
					return{}
				}
			}
		},
		data(){
			return {
				token:sessionStorage.getItem('token'),
				deviceList:[],
				portList:[],
				load:false,
				filter:{
					device:'',
					port:''
				},
				rulesFilter:{//  设备和端口的校验
					device:[{required:true, message:'请选择设备',trigger:'change,blue'}],
					port:[{required:true, message:'请选择设备端口',trigger:'change,blue'}]
				}
			}
		},
		created(){
//			sessionStorage.getItem('token')
			console.log(this.label)
		},
		computed:{
			editForm(){
				if(this.label) return this.label;
			},
			device(){
				if(this.label.deviceList) {
					this.$forceUpdate();
					return this.label.deviceList;
				}
			}
		},
		watch:{
			label:{
				handler:function(newVal,oldVal){
					console.log(newVal)	
				},
				deep:true
			}
		},
		methods:{
			selDevice(id){
				//筛选可用的设备端口
				var para={
					search_available:false
				};
				this.$ajax.get('/node/device_info/'+id+'/ports'+'?token='+this.token,para )
				.then(res => {
					if(res.status == 200){
						if(res.data.status ==0){
							console.log(res);
							this.$forceUpdate();
							this.portList=res.data.data.items;
							
						}
					}
				}).catch(err => console.log(err))
			},
			selPort(id){
				// 在这个执行完数据后将数据发送到父组件
				console.log(this.filter)
				this.$emit('sendObj',this.filter)
			}
		}
	}
</script>
<style scoped>
	.device{
		margin-left: 132px;
	}
</style>