<template>
	<div>
		<!--公有云部分-->
		<el-form :model='editForm':rules='editFormRules' ref='editForm'label-width='160px' v-loading='editLoading'>
			<el-form-item :label='$t("Public.shardCloud")+"："'prop='cloun'>
				<el-select v-model='editForm.cloun' filterable  class='ipt'  @change='handleSelect(editForm.cloun)'>
					<el-option v-for='(item ,index) in clounData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<span class="cli_toTip" :title="$t('business.cloudTooltip')">?</span>
			</el-form-item>
			<el-form-item :label='$t("business.tarRegion")+"："' prop='targetRegion'>
				<el-select v-model='editForm.targetRegion' class='ipt' @change='selRegion(editForm.targetRegion)'>
					<el-option v-for='(item ,index) in targetRegionData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<span class="cli_toTip" :title="$t('business.cloudRouter')">?</span>
			</el-form-item>
			<el-form-item :label='$t("business.cloudDock")+"："' prop='clounDock'>
				<el-select v-model='editForm.clounDock'class='ipt' >
					<el-option v-for='(item ,index) in clounDockData'
						:label='item.name'
						:value='item.id'
						:key='index'>
					<span>{{item.name}}</span>
					<span style="margin-left: 20px;">{{item.logic_port.name}}</span>
					</el-option>
				</el-select>
				<span class="cli_toTip" :title="$t('business.cloudPhyTooltip')">?</span>
			</el-form-item>
			<el-form-item :label='$t("business.linePro")+"："' v-if='JSON.stringify(copy) !="{}" && editForm.clounDock !=="" '>
				<el-input v-model='editForm.Dedicated' disabled class='ipt'></el-input>
				<span style="cursor: pointer; color: orangered;" :title="tcTit">?</span>
			</el-form-item>
			<el-form-item :label='$t("business.lineID")+"："' v-if='JSON.stringify(copy) !="{}" && editForm.clounDock !=="" '>
				<el-input v-model='editForm.shardID' disabled class='ipt'></el-input>
				<span style="cursor: pointer; color: orangered;" :title="tcTit">?</span>
			</el-form-item>
			<el-form-item :label='$t("business.region")+":"' v-if='JSON.stringify(copy) !="{}" && editForm.clounDock !=="" '>
				<el-input v-model='editForm.area' disabled class='ipt'></el-input>
				<span style="cursor: pointer; color: orangered;" :title="tcTit">?</span>
			</el-form-item>
			<el-form-item v-for='(item,index) in dockLinks' :label='item.show_name +":"':key='index' :prop='item.keyVal'
				:rules="{required:true,message:item.keyVal+'不能为空',trigger:'blur'}" v-if='editForm.clounDock ==""? false :true  '>
				<el-input v-model='item.keyVal':placeholder="'请输入'+item.show_name"class='ipt'
					:disabled='editForm.cloun==="腾讯云"? ( (item.show_name == "专用通道id" || item.show_name == "vlan" )? false:true ) :false' ></el-input>
					<template v-if='editForm.cloun==="腾讯云"? true : false' v-for='(val ,index) in getLogo'>
						<span v-if='val.name === item.show_name '  :title="val.value"
							style="cursor: pointer; color: orangered;" >{{val.label}}</span>  
							<span v-if='val.name == "专用通道id" && item.show_name == "专用通道id" ' style="cursor: pointer; color: orangered;" @click="tenRules"> 
								{{$t('business.cliLine')}}</span>

					</template>

			</el-form-item>
		</el-form>
		
		<!--腾讯云配置   => rules-->
		<el-dialog :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-loading='seeLoading'>
			<el-form label-position='left' :model='seeForm' ref='seeForm'label-width='80px'>
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
						<el-button type='primary' size='small' @click='dialogFormVisible=false' >{{$t('business.dialog.know')}}</el-button>
						
					</li>
					
				</ul>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>


	export default{
		name:'sharedCloun',
		data(){
			return{
				tcTit:this.$t('business.tencentTit'),
				icoData:[//腾讯云开通的时候  需要的数据的提示界面
//					{
//						name:'专用通道id',
//						value:'腾讯云专心通道ID,即DirectConnectTunnelld',
//						label:'?',
//
//					},
					{
						name:'专线提供方',
						value:'此数据将用于创建腾讯云专线通道id时使用',
						label:'?'
					},{
						name:'共享专线id',
						value:'此数据将用于创建腾讯云专线通道id时使用',
						label:'?'
					},{
						name:'地域',
						value:'此数据将用于创建腾讯云专线通道id时使用',
						label:'?'
					},
//					{
//						name:'vlan',
//						value:'选择的vlan号应该与创建专用通道ID所使用的额vlan号保持一致',
//						label:'?'
//					}
				],
				getLogo:[
					
					{
						name:'vlan',
						value:this.$t('tooltipMes.vlanTooltip'),
						label:'?'
					},
					{
						name:'专用通道id',
						value:this.$t('tooltipMes.dedicID'),
						label:'?',

					}
				],
				tc1:require('../../../../assets/images/tc1.png'),
				tc2:require('../../../../assets/images/tc2.png'),
				tc3:require('../../../../assets/images/tc3.png'),
				copy:{},//拷贝的数据				
				token:'',
				editForm:{
					cloun:'',
					targetRegion:'',
					clounDock:'',
					Dedicated:'',
					shardID:'',
					area:''
				},
				sendForm:{
					cloun:'',
					targetRegion:'',
					clounDock:'',
				},
				clounidsList:'',//根据id找到对应的 interface_driver
//				clounDockObj:{},//保存云对接的对象数据
				dockListObj:{},//选择不同的云对接的时候，将数据发送到父组件
				editFormRules:{
					cloun:[{ required: true, message: this.$t('business.plaShared'), trigger: 'change' }],
					targetRegion:[{ required: true, message: this.$t('business.plaRegion'), trigger: 'change' }],
					clounDock:[{ required: true, message:this.$t('business.plaDock'), trigger: 'change' }],
				},
				editLoading:false,
				clounData:[],//公有云的数据
				targetRegionData:[],//目标 region
				clounDockData:[],//云对接的数据
				dockLinks:[],//根据不同的云对接的获取不同的列表
				str:[],
				seeLoading:false,
				textMap: {
		        	see:this.$t('business.seeTencent')
		      	},
		      	dialogFormVisible:false,
		      	dialogStatus:'',
		      	seeForm:{}
			}
		},
		watch:{
			editForm:{
				handler(newVal,oldVal){
						if(newVal.clounDock){
							if(newVal.clounDock==='Automatically'){
								//实现随机分配
								this.clounDockData.shift();//将数组内的随机分配的数据删除
								var index=null,ids='',sliData=[];
								sliData=JSON.parse(JSON.stringify(this.clounDockData))
								
								if(sliData.length !=0){
									index = Math.floor(Math.random()*sliData.length);
									ids=sliData[index].id;
									this.selectCloun( this.selectDriver( ids) );
									this.selCloud(ids);
									newVal.clounDock=ids;
								}
								//下面的是指定某一个值进行传参  (当为自动配置的是偶)
//								this.selectCloun( this.selectDriver( this.clounDockData[this.clounDockData.length-1].id ) );//自动分配的时候获取数组里面的数据的倒数第一个id
//								if(this.clounDockData.length !=1){
//									this.selCloud(this.clounDockData[this.clounDockData.length-1].id)
//								}
//								newVal.clounDock=this.clounDockData[this.clounDockData.length-1].id;
							}else{
								this.selCloud(newVal.clounDock)
								this.selectCloun(this.selectDriver(newVal.clounDock));//获取所选的列表
							}
						}

					this.sendForm.cloun=newVal.cloun;
					this.sendForm.targetRegion=newVal.targetRegion;
					this.sendForm.clounDock=newVal.clounDock
					
					
				},
				deep:true,
			},
			sendForm:{
				handler(newVal,oldval){
					console.log(newVal);
					this.$emit('sendClounbasic',newVal)//发送基本的云选择的列表
					this.$emit('sendClounbasic_a',newVal)
					this.$emit('sendClounbasic_z',newVal)
				},
				deep:true,
			},
			dockLinks:{
				handler(newVal,oldVal){
					newVal.forEach(ele => {
						this.dockListObj[ele.name]=ele.keyVal;
					})
					this.$emit('sendClounList',this.dockListObj) //发送云列表到父组件
				},
				deep:true,
			}

		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getFormData()
			
		},

		methods:{
			selectDriver(ids){//根据选择的interface_driver  从数组里面获取该对象数据
//				console.log(ids)
				let str=''
				var findDriver=this.clounDockData.find(function(obj){
					return obj.id===ids
				})
				str=findDriver.interface_driver;

				return str;
			},
			selectCloun(clounName){
//				console.log(clounName)
//				var para={
//					name:clounName
//				}
				this.$ajax.get('/vll/get_driver_frame/'+clounName+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							res.data.data.forEach(ele => {
								ele.keyVal=''
							})

							this.dockLinks=res.data.data;

						}
					}
				}).catch(e => {console.log(e)})
				

			},
			selCloud(type){//选择云对接
				this.copy={}
				if(this.editForm.cloun == '腾讯云'){
					this.$ajax.get('/vll/tc_params_to_tenant/'+type+'?token='+this.token)
					.then(res => {
						console.log(res);
						if(res.status == 200){
							if(res.data.status ==0){
								var str=res.data.data;

								this.copy={//拷贝的数据
									Dedicated:str.account_id,
									shardID:str.api_uuid,
									area:str.region_name,
								}
								this.editForm.Dedicated=this.copy.Dedicated;
								this.editForm.shardID=this.copy.shardID;
								this.editForm.area=this.copy.area;
							}
						}
					}).catch(e => {console.log(e)})
				}
				
			},
			tenRules(){
				this.seeLoading=true;
				
				this.dialogStatus='see'
				this.dialogFormVisible=true;
				this.seeLoading=false;
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
			handleSelect(item) {
				this.editForm.targetRegion='';
				this.editForm.clounDock='';
				this.copy={};
				this.targetRegionData=[];
//				this.editForm.cloun=item;
				let para={
					search_cloud:item
				}
				//获取目标region
				this.$ajax.get('/vll/get_cloud_region'+"?token="+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.targetRegionData=res.data.data;
						}
					}
				}).catch(e => {console.log(e)})
				
		    },
		    selRegion(ids){
		    	this.clounDockData=[];
		    	this.editForm.clounDock='';
		    	let para={
		    		search_cloud:this.editForm.cloun,
		    		search_region:ids,
		    	}
		    	
		    	this.$ajax.get('/link/cloud_links'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.clounDockData=res.data.data.items;
							this.clounDockData.unshift({interface_driver:'自动分配',name:'自动分配',id:'Automatically',logic_port:{name:''}})

						}
					}
				}).catch(e => {
					console.log(e)
				})
		  },
			getFormData(){
				this.clounData=[];
				//获取公有云的列表
				this.$ajax.get('/vll/get_public_cloud'+'?token='+this.token)
				.then(res => {

					if(res.status==200){
						if(res.data.status==0){
							this.clounData=res.data.data;
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
	/*.tc_img{
		width: 570px;
	}
	.span_toTip{
		display: inline-block;
		color:#FD042B;
		margin: 0 5px;
	}
	.cur_span{
		font-size: 12px;
		display: inline-block;
		background-color: #67C23A;
		cursor: pointer;
		border-radius: 6px;
		width: 40px;
		height: 24px;
		line-height: 24px;
		text-align: center;
	}
	.span_left_tit{
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border: 1px solid ;
		border-radius:10px ;
		color: #000000;
		font-weight: 300;
	}
	.span_tit_one{
		background-color: #009DD9;
	}
	.span_tit_two{
		background-color: #FFFF00;
	}
	.span_tit_three{
		background-color: #66FF00;
	}
	.span_tit_four{
		background-color: #FF00FF;
	}*/
</style>