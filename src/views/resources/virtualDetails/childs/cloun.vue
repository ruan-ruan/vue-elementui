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
					<span>{{clounForm.logic_name}}-{{clounForm.vlan}}  </span>
				</el-form-item>
				<el-form-item :label='$t("Public.logicStatus")+ "："'>
					<span>{{clounForm.logic_status}}</span>
				</el-form-item>			
			</el-form>

			<el-form label-width='200px'class='cloud_cls'>
			<h4 class="cloud_tit">{{$t('Public.cloudArea')}}</h4>
				
				<el-form-item v-for='(item,index) in  cloudData' :key='index' :label='item.show_name+"："' :prop='item.name' >
					<span>{{item.keyVal}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.cloudStatus")+"："'>
					 {{ clounForm.cloud_status}}<br />
					<el-button size='mini' type='primary' @click='detection' v-if='type ==="edit"?false:true' >{{$t('Public.detection')}}</el-button>
					<el-button size='mini' type='success' @click='repair'  v-if='type ==="edit"?false:true' >{{$t('Public.repair')}}</el-button>
					<el-button size='mini' type='warning' @click='remove'   v-if='type ==="edit"?false:true'>{{$t('Public.remove')}}</el-button>
				</el-form-item>
			</el-form>
			
			
			<el-dialog  :title='textMap[dialogStatus]':visible.sync="dialogFormVisible" :close-on-click-modal="false"   >
				<el-form  label-width='200px'>
					<el-form-item v-for='(item,index) in  cloudData' :key='index' :label='item.show_name+"："' :prop='item.name'>
						<el-input v-model='item.keyVal' class='ipt_sels' :disabled='item.show_name === "vlan"'></el-input>
						<template v-for='( i,j ) in getLogo'>
							<span v-if=' i.name == item.show_name ' :title="i.value" style="cursor: pointer; color: orangered;">{{i.label}}</span>
							<span v-if='i.name == "专用通道id" && item.show_name == "专用通道id" ' style="cursor: pointer; color: orangered;" @click="tenRules"> 
								{{$t('business.cliLine')}}</span>
						</template>
					</el-form-item>
				</el-form>
				<div style="text-align: center;">
					<el-button size='small' @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
					<el-button size='small' type='primary' @click='repairSubmit'>{{$t('tabOperation.Submit')}}</el-button>
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
						value:this.$t('tooltipMes.vlanTooltip'),
						label:'?'
					},
					{
						name:'专用通道id',
						value:this.$t('tooltipMes.vlanTooltip'),
						label:'?',

					}
				],
				cloudData:[],
				clounForm:{},//云的基本对象列表
				textMap:{
					repair:this.$t('Public.repair'),
//					remove:'清除',
//					deteation:'检测',
					see:this.$t('business.seeTencent'),
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
					
					this.selCloud(newVal);
					this.getCloudList( newVal );
				},
				deep:true,
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
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
			this.selCloud(this.clounData );
			this.getCloudList( this.clounData );
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

				this.$ajax.put('/vll/repair_cloud/'+this.clounData.id+'?token='+this.token,para)
				.then(res => {
					this.dialogFormVisible=false;
					if(res.status ==200){
						if(res.data.status ==0){
							this.$message({
								message:res.data.message,
								type:'success'
							})
							this.cloudData=[];
						}
						this.$emit('sendRepair',false)
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
				this.$confirm(this.$t('confirm.conDecetion'),this.$t('Public.detection'),{
					type:'warning'
				}).then( () =>{
					this.$ajax.put('/vll/check_cloud_status/'+this.clounData.id+'?token='+this.token)
					.then(res => {
						if(res.status ==200){
							if(res.data.status ==0){
								this.$message({
									message:this.$t('tooltipMes.detSuccess'),
									type:'success'
								})
								this.$emit('sendRepair',false)
							}
						}
					}).catch(e => {console.log(e)})
				} )
				.catch( () => {} )
			},
			remove(){
				const confirmText=[this.$t('confirm.conRemove'),this.$t('confirm.conTootip')];
				const newDatas = [];
				const h=this.$createElement;
				for(const i in confirmText){
					newDatas.push( h('p' ,null ,confirmText[i] ) )
				}
				this.$confirm(this.$t('Public.remove'),{
					title:this.$t('Public.remove'),
					message:h('div',null,newDatas),
					showCancelButton: true,
					type:'warning'
				}).then(() => {
					this.$ajax.del('/vll/clear_cloud/'+this.clounData.id+'?token='+this.token)
					.then(res => {
						if(res.status ==200){
							if(res.data.status ==0){
								this.$message({
									message:this.$t('tooltipMes.removeSuccess'),
									type:'success'
								})
								this.$emit('sendRepair',false)
							}
						}
					}).catch(e => {console.log(e)})
				}).catch(() => {})
			},
			selCloud(obj){//选择云对接
				this.copy={}
				if(obj.cloud_type == '腾讯云'){
					this.$ajax.get('/vll/tc_params_to_tenant/'+obj.cloud_config.id+'?token='+this.token)
					.then(res => {
						if(res.status == 200){
							if(res.data.status ==0){
								var str=res.data.data;

								this.copy={//拷贝的数据
									Dedicated:str.account_id,
									shardID:str.api_uuid,
									area:str.region_name,
								}

							}
						}
					}).catch(e => {console.log(e)})
				}
				
			},
		}
	}
</script>

<style scoped>

	.cloud_cls{
		border:  1px solid #C0C4CC ;
		border-radius:5px ;
		margin-bottom: 10px;
	}
	.cloud_tit{
		position:relative;
		background: #FFFFFF;
		text-align: center;
		width: 100px;
		bottom:10px ;
		left:50%;
		margin-left: -50px;
	}
</style>