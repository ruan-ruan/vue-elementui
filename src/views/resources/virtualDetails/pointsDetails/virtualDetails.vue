<template>
	<div>
		<!--虚拟专线的详情的界面-->
		<section>
			<el-form :mdoel='seeForm' ref='seeForm' v-loading='seeLoading' label-width='200px'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item :label='$t("Public.specialName") + "："'>
								<span>{{seeForm.name}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.bandwidth") + "："'>
								<span>{{seeForm.bandwidth}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.specialStatus") + "："'>
								<span>{{seeForm.status}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item :label='$t("Public.specialType") + "："'>
								<span>{{seeForm.typeHtml}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.tenant") + "："'>
								<span>{{seeForm.tenant.name}}</span>
							</el-form-item>
						</el-col>						
					</el-col>
				</el-row>
				<el-row class='marT20'>
					<el-col :span='24' v-if='seeForm.type=="d2d"'><!--数据中心互联-->
						<el-col :span='12' >
							<h3 class="marB15">{{$t('Public.dcAport')}}</h3>
							<dc :dcData='dcFormA'></dc>
						</el-col>
						<el-col :span='12' >
							<h3 class="marB15">{{$t('Public.dcZport')}}</h3>
							<dc :dcData='dcFormZ'></dc>
						</el-col>
					</el-col>
					
					
					
					<el-col :span='24'v-if='seeForm.type=="c2c"'><!--云互联-->
						<el-col :span='12' >
							<h3 class="marB15">{{$t('Public.cloudAport')}}</h3>						
							<cloun :clounData='clFormA'  @sendRepair='getMsg' v-if='emitCloudStatus'></cloun>
						</el-col>
						<el-col :span='12' >
							<h3 class="marB15">{{$t('Public.cloudZport')}}</h3>	
							<cloun :clounData='clFormZ'  @sendRepair='getMsg' v-if='emitCloudStatus'></cloun>
						</el-col>
					</el-col>
					
					
					
					<el-col :span='24' v-if='seeForm.type=="d2c"'><!--数据中心到云-->
						<el-col :span='12' >
							<h3 class="marB15">{{$t('Public.cloudAport')}}</h3>	
							<cloun :clounData='clFormA' @sendRepair='getMsg' v-if='emitCloudStatus' ></cloun>
		
						</el-col>
						<el-col :span='12'>
							<h3 class="marB15">{{$t('Public.zPortDetails')}}</h3>	
							<dc :dcData='dcFormZ'></dc>
						</el-col>
					</el-col>
				</el-row>
				
				<el-row class='marT20'>					
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item :label='$t("Public.chargModel") + "："'>
								<span>{{seeForm.charge_mode}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.creation") + "："'>
								<span>{{seeForm.creation_time}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.billTime") + "："'>
								<span>{{seeForm.charge_time}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item :label='$t("Public.expTime") + "："'>
								<span>{{seeForm.expiration_time}}</span>
							</el-form-item>
							<el-form-item :label='$t("Public.description") + "："'>
								<span>{{seeForm.description}}</span>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
			</el-form>
		</section>
	</div>
</template>

<script>

	import {datedialogFormat , isNull ,isPort ,getPortStatus} from '@/assets/js/index.js'
	
	
	import basic from '@/views/resources/virtualDetails/childs/basic'
	import dc from '@/views/resources/virtualDetails/childs/dc'
	import cloun from '@/views/resources/virtualDetails/childs/cloun'
	
	
	
	export default{
		name:'virtualDetails',
		components:{
			basic,dc,cloun
		},
		props:['titData'],
		data(){
			return{
				token:'',
				seeForm:{
					charge_mode:'',//计费模式
					public_cloud:'',//共有云类型
					bandwidth:'',//带宽
					charge_time:'',//计费时间
					expiration_time:'',//过期时间
					description:'',//备注
					creation_time:'',//创建时间
					type:'',//点到点专线类型					
					id:'',//业务ID
					name:'',//专线名称
					status:'',//状态
					tenant:{
						name:'',
						id:''
					},
					endpoints:{},
					typeHtml:'',
				},
				dcFormA:{},
				dcFormZ:{},
				clFormA:{},
				clFormZ:{},
				endpointsData:[],
				seeLoading:false,
				emitCloudStatus:true,
			}
		},
		created(){
			
			this.token=sessionStorage.getItem('token');
			
			if(typeof this.titData !=='undefined'){
				this.getPointDetails(this.titData)
			}
			
		},
		methods:{
			getMsg(msg){
				this.emitCloudStatus=false;
				this.$nextTick(() => {
					this.emitCloudStatus=true;
				})
				this.getPointDetails(this.titData);
				
			},
			getPointDetails(ids){
				//获取点到点的详细信息
				this.seeLoading=true;
				this.$ajax.get('/vll/p2p_vll_info/'+ids+'?token='+this.token)
				.then(res =>{
					if(res.status==200){
						if(res.data.status==0){
							this.seeLoading=false;
							var  str=res.data.data;
							let statusVal='';
//							statusVal=(str.status==='servicing'?'运行中':'stopping'?'停止中':'failure'?'创建失败':'creating'?'创建中':'')
							if(str.status==='servicing'){
								statusVal=this.$t('Public.servicing');
							}else if(str.status==='stopping'){
								statusVal=this.$t('Public.stopping');
							}else if(str.status==='failure'){
								statusVal=this.$t('Public.failure');
							}else if(str.status==='creating'){
								statusVal=this.$t('Public.creating');
							}
							

							if (!str.charge_time && typeof(str.charge_time)!="undefined" && str.charge_time!=0){ 
//							     alert("null"); 
							 }
							isNull(str,'charge_time');
							isNull(str,'creation_time');
							isNull(str,'expiration_time');
							
							let charge='';
							if(str.type == 'd2d'){
								charge='DCI'
							}else if(str.type == 'd2c'){
								charge=this.$t('Public.cloudInter');
								
							}else if(str.type == 'c2c'){
								charge=this.$t('Public.cloudsTo');
								
							}

							this.seeForm={
								charge_mode:str.charge_mode,//计费模式
								public_cloud:str.public_cloud,//共有云类型
								bandwidth:str.bandwidth,//带宽
								charge_time:str.charge_time==''?'':datedialogFormat(str.charge_time),//计费时间  datedialogFormat
								expiration_time:str.expiration_time==''?'':datedialogFormat(str.expiration_time),//过期时间
								description:str.description,//备注
								creation_time:str.creation_time==''?'':datedialogFormat(str.creation_time),//创建时间
								type:str.type,//点到点专线类型					
								id:str.id,//业务ID
								name:str.name,//专线名称
								status:statusVal,//状态
								tenant:{
									name:str.tenant.name,
									id:str.tenant.id
								},
								endpoints:{},
								typeHtml:charge,
							};
							var  objA={},objZ={};
//							let zvlan='',avlan='';
							if(str.type=='d2d'){
								objA=res.data.data.endpoints.find(item => {
									return item.name == "A端"
								})
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								})
								this.dcFormZ=JSON.parse(JSON.stringify(objZ))
								this.dcFormA=JSON.parse(JSON.stringify(objA))
							}
							if(str.type=='c2c'){

								objA=res.data.data.cloud_endpoints.find(item => {
									return item.name == "A端"
								});
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								});
								this.clFormA=JSON.parse(JSON.stringify(objA));
								this.clFormZ=JSON.parse(JSON.stringify(objZ));
							}
							
							if(str.type=='d2c'){
								objA=res.data.data.cloud_endpoints.find(item => {
									return item.name == "A端"
								});
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								})

								this.clFormA=JSON.parse(JSON.stringify(objA))
//								this.clFormA.vlan=avlan;
								this.dcFormZ=JSON.parse(JSON.stringify(objZ))
							}
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
			},
		}
	}
</script>

<style>
</style>