<template>
	<div>
		<!--cloun的配置详情-->
		<section>
			<el-form :model='clounForm'ref='clounForm'style='width:100%'label-width='200px' >
				<el-form-item :label='$t("Public.shardCloud")+ "："'>
					<span>{{clounForm.cloud_type}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.tarRegion")+ "："'>
					<span>{{clounForm.region}}</span>
				</el-form-item>
				<el-form-item :label='$t("aside.cloudLine")+ "："'>
					<span>{{clounForm.cloud_config_name}}</span>-
					<span>{{clounForm.logic_name}}{{clounForm.vlan}}  </span>
				</el-form-item>
				<el-form-item :label='$t("Public.logicStatus")+ "："'>
					<span>{{clounForm.logic_status}}</span>
				</el-form-item>			
			</el-form>
			<h4>云端控制区</h4>
			<el-form label-width='200px' style='border:  1px solid #C0C4CC ; width: 400px;margin-bottom: 10px;'>
				<el-form-item v-for='(item,index) in  cloudData' :key='index' :label='item.show_name+"："' :prop='item.name' >
					<span>{{item.keyVal}}</span>
				</el-form-item>
				<el-form-item label='云端状态(非实时)：'>
					 {{ clounForm.cloud_status}}<br />
					<el-button size='mini' type='primary' @click='detection' v-if='type ==="edit"?false:true' >检测</el-button>
					<el-button size='mini' type='success' @click='repair'  v-if='type ==="edit"?false:true' >修复</el-button>
					<el-button size='mini' type='warning' @click='remove'   v-if='type ==="edit"?false:true'>清除</el-button>
				</el-form-item>
			</el-form>
			
			
			<el-dialog  :title='textMap[dialogStatus]':visible.sync="dialogFormVisible" :close-on-click-modal="false" >
				<el-form  label-width='200px'>
					<el-form-item v-for='(item,index) in  cloudData' :key='index' :label='item.show_name+"："' :prop='item.name'>
						<el-input v-model='item.keyVal' class='ipt_sels'></el-input>
						<template v-for='( i,j ) in getLogo'>
							<span v-if=' i.name == item.show_name ' :title="i.value" style="cursor: pointer; color: orangered;">{{i.label}}</span>
							<span v-if='i.name == "专用通道id" && item.show_name == "专用通道id" ' style="cursor: pointer; color: orangered;" @click="tenRules"> 
								{{$t('business.cliLine')}}</span>
						</template>
					</el-form-item>
				</el-form>
				<div style="text-align: center;">
					<el-button size='small' @click='dialogFormVisible=false'>取消</el-button>
					<el-button size='small' type='primary' @click='repairSubmit'>提交</el-button>
				</div>
			</el-dialog>
			
			
			
			
			<el-dialog :title='textMap[dialogStatus]' :visible.sync="dialogVisible" :close-on-click-modal="false" v-loading='seeLoading'>
				<el-form label-position='left'label-width='80px'>
					<h3>{{$t('business.dialog.tit')}}?</h3>
					<ul class="marT10">
						<li class="marT10">
							{{$t('business.dialog.step1')}}: <a href="https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2F" target ='_blank' style="text-decoration: none;">
								( {{$t('business.dialog.link')}})
							</a>
						</li>
						<li class="marT10">
							<img :src="tc1"  class="tc_img"/>
						</li>
						<li class="marT10">
							{{$t('business.dialog.step2')}}
							<div class="marT5">
								<span class="span_left_tit span_tit_one">1</span>
								{{$t('business.dialog.lineType')}}
							</div>
							 <!--<br />-->
							<div class="marT5">
								<span class="span_left_tit span_tit_two ">2</span>
								{{$t('business.dialog.linePorvide')}}: <span class="span_toTip">{{copy.Dedicated}}</span>{{$t('business.dialog.plaDataPro')}}
								<span class="cur_span"  v-clipboard:copy="copy.Dedicated"  
									v-clipboard:success="onCopy"  v-clipboard:error="onError">{{$t('tabOperation.copy')}}</span> 
							</div>
							<!--<br />-->
							<div class="marT5">
								<span class="span_left_tit span_tit_three ">3</span>
								{{$t('business.dialog.lineID')}}: <span class="span_toTip">{{copy.shardID}}</span>{{$t('business.dialog.plaLineID')}}
								<span class="cur_span"	  v-clipboard:copy="copy.shardID"  
									v-clipboard:success="onCopy"  v-clipboard:error="onError">{{$t('tabOperation.copy')}}</span>	
							</div>
							 <!--<br />-->
							<div class="marT5">
								<span class="span_left_tit span_tit_four ">4</span>
								{{$t('business.region')}}: <span class="span_toTip">{{copy.area}}</span>{{$t('business.dialog.plaRegion')}}
								<span class="cur_span"	  v-clipboard:copy="copy.area"  
									v-clipboard:success="onCopy"  v-clipboard:error="onError">{{$t('tabOperation.copy')}}</span>
							</div>	
							
						</li>
						<li class="marT10">
							<img :src="tc2" alt=""  class="tc_img"/> <br />
							<template class="marT7">
								{{$t('business.dialog.basic')}}
							</template>
							
							
						</li>
						<li class="marT10">
						{{$t('business.dialog.step3')}}
						</li>
						<li class="marT10">
							{{$t('business.dialog.step4')}} <br />
							{{$t('business.dialog.dock1')}} <br />
							{{$t('business.dialog.dock2')}} <br />
							<img :src="tc3"  class="tc_img marT7"/>
						</li>
						<li style="text-align: center;" class="marT10">
							<el-button type='primary' size='small' @click='dialogVisible=false' >{{$t('business.dialog.know')}}</el-button>
						</li>
						
					</ul>
				</el-form>
			</el-dialog>
			
			
			
			
		</section>
	</div>
</template>

<script>
	import {getPortStatus} from '@/assets/js/index'
	export default{
		name:'cloun',
		props:['clounData','type'],//cloudLis云后台返回列表   clounData   云的基本信息   type  是在虚拟组网调用编辑的时候，对云端的状态的按钮的控制
		data(){
			return {
				getLogo:[
					{
						name:'vlan',
						value:'选择的vlan号应该与创建专用通道ID所使用的额vlan号保持一致',
						label:'?'
					},
					{
						name:'专用通道id',
						value:'腾讯云专心通道ID,即DirectConnectTunnelld',
						label:'?',

					}
				],
				cloudData:[],
				clounForm:{},//云的基本对象列表
				textMap:{
					repair:'修复',
					remove:'清除',
					deteation:'检测',
					see:'如何获取腾讯专线通道ID',
				},	
				dialogStatus:'',
				editLoading:false,
				dialogFormVisible:false,
				dialogVisible:false,//专用通道点击的详情额的界面
				params:{},
				paramsRules:{},
				copy:{},
				seeLoading:false,
				token:'',
				tc1:require('@/assets/images/tc1.png'),
				tc2:require('@/assets/images/tc2.png'),
				tc3:require('@/assets/images/tc3.png'),
			}
		},
		watch:{
			clounData:{
				handler:function(newVal,oldVal){
					console.log(newVal);
					var zvlan='';
					if(newVal.vlan < 0){
						zvlan=this.$t('Public.passthrough');
					}else if(newVal.vlan == 0){
						zvlan='UNTAG'
					}else if(newVal.vlan){
						zvlan=newVal.vlan;
					}
					this.clounForm={
						region:newVal.region,
						vlan:zvlan,
						cloud_type:newVal.cloud_type,
						cloud_status:newVal.cloud_status,
						cloud_config_name:newVal.cloud_config.name,
						logic_name:newVal.cloud_config.logic_port.name,
						logic_status:getPortStatus( newVal.ports ),
						cloudID:newVal.cloud_config.id,//云链路的id
						cloud_type:newVal.cloud_type,
					}
					this.selCloud(newVal.cloudID)
				},
				deep:true,
			}
		},
		created(){
			this.token=sessionStorage.getItem('token')

			this.getCloudList( this.clounData );

		},
		mounted(){
			var zvlan='';
			if(this.clounData.vlan < 0){
				zvlan=this.$t('Public.passthrough');
			}else if(this.clounData.vlan == 0){
				zvlan='UNTAG'
			}else if(this.clounData.vlan){
				zvlan=this.clounData.vlan;
			}
			this.clounForm={
				region:this.clounData.region,
				vlan:zvlan,
				cloud_type:this.clounData.cloud_type,
				cloud_status:this.clounData.cloud_status,
				cloud_config_name:this.clounData.cloud_config.name,
				logic_name:this.clounData.cloud_config.logic_port.name,
				logic_status:getPortStatus( this.clounData.ports ),
				cloudID:this.clounData.cloud_config.id,//云链路的id
				cloud_type:this.clounData.cloud_type,
			}
			this.selCloud(this.clounForm.cloudID)
		},
		methods:{
			getCloudList(obj){
				//this.cloudData
				this.$ajax.get('/vll/get_driver_frame/'+obj.cloud_config.interface_driver+'?token='+this.token)
				.then(res => {
					if(res.status == 200){
						if(res.data.status ==0){
							res.data.data.forEach(ele => {
//									ele.keyVal='';
								for(let vals in obj){
									if(ele.name === vals){//根据属性找到对应的属性
										ele.keyVal=obj[vals];
									}
								}
							})
							this.cloudData=res.data.data;
							
						}
					}
				}).catch( e => {console.log(e)})
			},
			repair(){
				this.dialogStatus='repair',
				this.dialogFormVisible=true;

			},
			repairSubmit(){

				var para={}
				this.cloudData.map(item => {
					para[item.name] =item.keyVal;
				})

				this.$ajax.put('/vall/repair_cloud/'+this.clounData.id+'?token='+this.token,para)
				.then(res => {
					if(res.status ==200){
						if(res.data.status ==0){
							this.$message({
								message:res.data.message,
								type:'success'
							})
						}
					}
				}).catch(e => {console.log(e)})
			},
			onCopy(e){
				this.$message({
					message:this.$t('tooltipMes.copySuccess'),
					type:'success'
				})
			},
			onError(e){
				this.$message({
					message:this.$t('tooltipMes.copyFail'),
					type:"warning"
				})
			},
			tenRules(){
				this.seeLoading=true;
				
				this.dialogStatus='see'
				this.dialogVisible=true;
				this.seeLoading=false;
			},
			detection(){
				this.$confirm('确定要重新检测云端状态','检测',{
					type:'warning'
				}).then( () =>{
					this.$ajax.put('/vll/check_cloud_status/'+this.clounData.id+'?token='+this.token)
					.then(res => {
						if(res.status ==200){
							if(res.data.status ==0){
								this.$message({
									message:'正在检测',
									type:'success'
								})
							}
						}
					}).catch(e => {console.log(e)})
				} )
				.catch( () => {} )
			},
			remove(){
				const confirmText=['确定要清除云端配置?','注意：此操作不一定能清除成功，详情见消息提醒!'];
				const newDatas = [];
				const h=this.$createElement;
				for(const i in confirmText){
					newDatas.push( h('p' ,null ,confirmText[i] ) )
				}
				this.$confirm('清除',{
					title:'清除',
					message:h('div',null,newDatas),
					showCancelButton: true,
					type:'warning'
				}).then(() => {
					this.$ajax.delete('/vll/clear_cloud/'+this.clounData.id+'?token='+this.token)
					.then(res => {
						if(res.status ==200){
							if(res.data.status ==0){
								this.$message({
									message:'清除成功!',
									type:'success'
								})
							}
						}
					}).catch(e => {console.log(e)})
				})
				.catch(() => {})
			},
			selCloud(type){//选择云对接

				this.copy={}
				if(this.clounForm.cloud_type == '腾讯云'){
					this.$ajax.get('/vll/tc_params_to_tenant/'+type+'?token='+this.token)
					.then(res => {

						if(res.status == 200){
							if(res.data.status ==0){
								var str=res.data.data;

								this.copy={//拷贝的数据
									Dedicated:str.account_id,
									shardID:str.api_uuid,
									area:str.region_name,
								}
//								this.editForm.Dedicated=this.copy.Dedicated;
//								this.editForm.shardID=this.copy.shardID;
//								this.editForm.area=this.copy.area;
							}
						}
					}).catch(e => {console.log(e)})
				}
				
			},
		}
	}
</script>

<style >
	.el-dialog__wrapper{
		z-index:2100 !important ;
	}
	.el-message-box__wrapper{
		z-index: 2200 !important;
	}
</style>