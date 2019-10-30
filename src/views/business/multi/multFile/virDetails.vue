<template>
	<div>
		<!--虚拟机的详情界面-->   <!--基本的信息basicForm里面展示-->
		<!--Dc-->
		<el-form label-position='left' :model='detailsForm' ref='detailsForm' label-width='120px' v-loading='detaLoading' 
			v-if='basicObj.dataType==="endpoints"'>
			<el-form-item label='逻辑口类型'>
				<span>{{ detailsForm.dataType == "endpoints" ? "数据中心端口" :"公有云端口" }}</span>
			</el-form-item>
			<el-form-item label='节点名称'>
				<el-input v-model='detailsForm.node.name' disabled class='ipt'></el-input>
			</el-form-item>
			<el-form-item label='逻辑口'>
				<el-input v-model='detailsForm.logic_port.name' disabled class='ipt'></el-input>
			</el-form-item>
			<el-form-item label='逻辑口状态'>
				<el-input v-model='detailsForm.logicStatus' disabled class='ipt'></el-input>
			</el-form-item>
		</el-form>
		<!--云的数据-->
		<el-from :model='detailsForm' ref='detailsForm' label-width='120px' v-loading='detaLoading' 
			v-if="basicObj.dataType==='cloud_endpoints'">
			<el-form-item label='公有云'>
				<el-input v-model='detailsForm.cloud_type' disabled class='ipt'></el-input>
			</el-form-item>
			<el-form-item label='目标Region'>
				<el-input v-model='detailsForm.region'disabled class='ipt'></el-input>
			</el-form-item>
			<el-form-item label='云对接链路'>
				<el-input v-model='detailsForm.cloud_config.name'disabled class='ipt'></el-input>
			</el-form-item>
			<!--不同的云的对接获取不同的数据-->
			<el-form-item v-for='(item,index) in dockCloun' :key='index' :label='item.show_name'>
				<el-input v-model='item.keyVal'disabled class='ipt'></el-input>
			</el-form-item>
		</el-from>
	</div>
</template>

<script>
	
	
	export default{
		name:'virDetails',
		props:['basicObj'],
		data(){
			return{
				detailsForm:{},
				detaLoading:false,
				dockCloun:[],//根据云对接的时候获取不同的数据
			}
		},
		created(){
			console.log(this.basicObj);
			this.detailsForm=Object.assign({},this.basicObj)
			//根据dc和cloun，云对接的选择
//			if(typeof this.basicObj !=='undefined'){//详情数据存在的时候
//				if(this.basicObj.dataType==='endpoints'){//dc的数据结构   dc里面详情
//					this.detailsForm={
//						logic_port_name:this.basicObj.logic_port.name,
//						status:this.basicObj.ports.status
//					}
//					
//				}else if(this.basicObj.dataType==='cloud_endpoints'){//云的数据结构
////					this.getClounList(this.basicObj.cloud_config.driver)//根据云对接所选择的类型获取
//				}
//			}
			
		},
		methods:{
//			getDcData(ids){//根据逻辑口   获取详情数据
//				this.$ajax.get('/port/logic_port_info/'+ids+'?token='+this.token)
//				.then(res => {
//					if(res.status==200){
//						if(res.data.status==0){
//							this.detailsForm={
//								logic_port_name:this.basicObj.logic_port.name,
//								status:this.basicObj.ports.status
//							}
//						}
//					}
//				}).catch(e => {
//					console.log(e)
//				})
//			},
			getClounList(dockCloun){//根据不同的云对接的时候显示不通过的列表    通过该函数获取列表，然后在根据传过来的容器里面查找对应的值      在转换为数组
				var para={
					name:dockCloun
				}
				this.$ajax.get('/vll/get_driver_frame/'+dockCloun+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.clounList=res.data.data;
							
							res.data.data.forEach(ele => {
								
								ele.keyVal=''//用来保存信息展示的值
							})
							
						//		参数: name,show_name   添加参数keyVal
							res.data.data.forEach(ele => {
								for(var  item in ele){ //查找数组里面的每个对象 里面的key对应的值
									for(var  index in this.basicObj){
										if(item === index){//找到对应的时候   返回该对应的值
											ele[keyVal]=this.basicObj[index];
										}
									}
								}
							})
							this.dockCloun=res.data.data;//获取云对接的所有的数据列表
						}
					}
				}).catch(e => {console.log(e)})
				
			}
		}
	}
</script>

<style>
</style>