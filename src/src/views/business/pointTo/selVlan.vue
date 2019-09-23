<template>
	<div >
		<!--vlan的选择-->
		<el-form :model='editForm' ref='editForm' label-width='100px' :rules='editFormRules'>
			<el-form-item label='vlan'prop='vlan'>
				<template>
					<el-input v-model='editForm.vlan' v-show='false'></el-input>
					<el-switch v-model='editForm.chooseVlan'
						active-text="UNTAG"
						title='默认逻辑口为trunk,vlan为UNTAG'></el-switch>	
						<el-button v-text='editForm.selVlan?editForm.selVlan:"选择vlan"'
							size='small' 
							@click='addVlan' 
							title='请先选择节点和逻辑口'
							:disabled='titA?logicStatusA:logicStatusZ'
							v-if='!editForm.chooseVlan'></el-button>
				</template>		
			</el-form-item>
		</el-form>
		<el-dialog style='width: 120%;' :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible":close-on-click-modal="false" v-loading='vlanLoading' >
			<el-form   :model='portVlan' ref='portVlan' v-loading='portVlanLoading'>
				<el-form-item>
					<template>
						<span>逻辑口:</span>
						<span>{{creatForm.logicPort_name}}</span>
					</template>
					<br />
					<template>
						<span>逻辑口状态:</span>
						<span>{{creatForm.logicPort_status}}</span>
					</template>
					<template>
						<el-input v-model='portVlan.vlanName' placeholder='请输入vlan号'class='details'></el-input>
						<el-button size='small' type='primary' @click='getVlan'>搜索</el-button>
					</template>
					<template>
						<span>VLAN区间</span>
						<el-select v-model='portVlan.selVlanVal'placeholder='请选择vlan区间'class='details'>
							<el-option v-for='(item,index) in vlanInterval'
								:value='item.value'
								:label='item.label'
								:key='index'></el-option>
						</el-select>
					</template>
				</el-form-item>
				<el-form-item >
					<template slot-scope='scope'>
						<div  v-model='portVlan.vlanVal' id="idData" style="height: 300px; overflow-y: auto;">
							<span class="bor_data" v-for='(item ,index) in vlanData' 
								:key='index'
								@click='cliData(index,item)'
								:class='timeIndex===index ? "active" :"" '
								>
								{{item }}</span>
						</div>
						<div id="barcon">
							<span class='spn_tit'>共{{vlanData.length}}条记录{{totalPage}}页</span>
							<span @click='goPaseSize(1,100)' class="spn">首页</span>
							<span @click='goPaseSize(currentPage-1>0?currentPage-1:1,100)' class="spn" >上一页</span>
							<span v-for='(item,index) in pageVal'
								:key='index' @click='goPaseSize(item,100)'class="spn">{{item}}</span>
							<span @click='goPaseSize(currentPage+1<totalPage+1?currentPage+1:totalPage,100)'class="spn">下一页</span>
							<span @click='goPaseSize(6,100)'class="spn">尾页</span>
						</div>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				 <el-button size='small' @click.native="dialogFormVisible=false">取消</el-button>
				 <el-button size='small' type='primary' @click='creatVlan'>保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
//	:empty='empty'
	export default{
		name:'vlan',
		props:[],
		data(){
			return{
				token:'',
				editForm:{
					selVlan:'',
					chooseVlan:'false',
					vlan:''
				},
				creatForm:{
					logicPort_name:'',
					logicPort_status:''
				},
				editFormRules:{
					vlan:[{ required: true, message: '请选择vlan', trigger: 'change' }]
				},
				dialogVlanStatusA:true,//A-vlan的可点击弹窗
				textMap:{
					port_a:'A端VLAN选择',
					port_z:'Z端VLAN选择',
					port:'VLAN选择'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				portVlan:{
					vlanName:'',
					selVlanVal:'1-600',
					vlanVal:'',
				},
				vlanLoading:false,
				portVlanLoading:false,
				vlanData:[],//保存选择vlan号区间的所有的数据
				vlanVal:[],//保存所选取的vlan的区间的前后的字符串
				portType:[{label:'透传',value:'-1'},{label:'trunk',value:'0'}],
				vlanInterval:[{label:'1-600',value:'1-600'},{label:'601-1200',value:'601-1200'},{label:'1201-1800',value:'1201-1800'},
				{label:'1801-2400',value:'1801-2400'},{label:'2401-3000',value:'2401-3000'},{label:'3001-3600',value:'3001-3600'},{
				label:'3601-4094',value:'3601-4094'},],//数据中心互联的是偶是这个区间段  ali和腾讯的不一样
				timeIndex:null,
				//自定义分页
				totalPage:0,//一共有几页
				currentPage:null,//当前是第几页   默认的显示的是第一页
				pageSize:null,//每页显示数量
				pageVal:[1,2,3,4,5,6],
				logicStatusA:true,
				logicStatusZ:true,
				
			}
		},
		watch:{
			
		},
		created(){
			this.token=sessionStorage.getItem('token')
			this.vlanVal=this.portVlan.selVlanVal.split('-');
			this.vlanData=this.getData(parseInt(this.vlanVal[0]),parseInt(this.vlanVal[1]));
			this.takeUp(this.logicId)//获取该id下的所有的可用的vlan
		},
		mounted(){
			this.goPaseSize(1,100)
		},
		methods:{
			addVlan(){
				if(typeof this.titA!='undefined'){
					this.dialogStatus='port_a'
				}else if(typeof this.titZ!='undefined'){
					this.dialogStatus='port_z'
				}else{
					this.dialogStatus='port'
				}
				this.dialogFormVisible=true;
				this.selVlanStatus=true;
			},
			cliData:function(index,val){
				if(typeof this.titA !='undefined'){
//					console.log('执行a的保存')
				}else if(typeof this.titZ !='undefined'){
//					console.log('执行z的保存')
				}
				this.timeIndex=index;
				this.portVlan.vlanVal=val;
			},
			getVlan(){
				//获取所有的vlan区间内的数据
				let obj={};
				let  strVal=[];
				let numVla=parseInt(this.portVlan.vlanName);
				let str=['1-600','601-1200','1201-1800','1801-2400','2401-3000','3001-3600','3601-4094'];
				if(parseInt(this.portVlan.vlanName)>=1&&parseInt(this.portVlan.vlanName)<=4094){
//					console.log('正确');
					for(let index in str){
						if(numVla>=parseInt(str[index].split('-')[0])&&numVla<=parseInt(str[index].split('-')[1])){
							this.portVlan.selVlanVal=str[index];
						}
					}
				}else if(parseInt(this.portVlan.vlanName)<1||parseInt(this.portVlan.vlanName)>4094){
					this.$message({
						message:'该号不在区间内！',
						type:'warning'
					})
				}else{
					return
				}
			},
			takeUp(ids){
				//获取id下已经被占用的vlan
				this.$ajax.get('/vll/get_disable_vlan/'+ids+'?token='+this.token)
				.then(res => {
					console.log(res)
				}).catch(e => console.log(e))
			},
			getData(start,end){
				//获取选择的vlan的区间的时候转换为数据
				let strVal=[];
				for (let i=start;i<end+1;i++) {
					strVal.push(i)
				}
				//将获取的vlan的不可用的区间标识出来
				
				return strVal
			},
			creatVlan(){
				console.log(this.portVlan)
				//设置vlan号的时候保存
				if(this.portVlan.vlanVal){
					this.editForm.selVlan=this.portVlan.vlanVal;
					this.editForm.vlan=this.portVlan.vlanVal;

					this.$message({
						message:'选择成功！',
						type:'success'
					})
					this.dialogFormVisible=false;
					this.$emit('getVlan',this.editForm.vlan);
				}else{
					this.$message({
						message:'vlan值不能为空!',
						type:'warning'
					})
				}
			},
			goPaseSize(pno,psize){
				let itable=document.getElementById('idData').getElementsByTagName("span");
				this.totalPage=0;
				this.pageSize=psize;
				let num=itable.length;
			        //总共分几页 
			    if(num/this.pageSize > parseInt(num/this.pageSize)){   
			        this.totalPage=parseInt(num/this.pageSize)+1; 
					
			    }else{   
			        this.totalPage=parseInt(num/this.pageSize);   
			    }
			    this.currentPage=pno;//当前页数
			    var startRow = (this.currentPage - 1) * this.pageSize+1;//开始显示的行  31 
			    var endRow = this.currentPage * this.pageSize;//结束显示的行   40
			    endRow = (endRow > num)? num : endRow;    //40
			    for(var i=1;i<(num+1);i++){    
			        var irow = itable[i-1];
			        if(i>=startRow && i<=endRow){
			            irow.style.display = "inline-block";    
			        }else{
			            irow.style.display = "none";
			        }
			    }
			},
		}
	}
</script>

<style>
	.active{
		background: #737272;
	}
	#barcon{
		text-align: center;
	}
	.spn{
		cursor: pointer;
		color: #2B8CFC;
		display: inline-block;
		margin-left: 5px;
	}
	.spn_tit{
		font-family: "微软雅黑";	
		font-weight: bold;	
	}
	.spn_val{
		text-align: right;
		margin-right: 5px;
	}
	.bor_data{
		float: left;
	    display: inline-block;
	    border: 2px solid #CCCCCC;
	    width: 40px;
	    height: 30px;
	    line-height: 30px;
	    text-align: center;
	    /*margin: 10px auto;*/
	   margin-left: 10px;
	   margin-bottom: 10px;
	   border-radius: 3px;
	   cursor: pointer;
	}
	.details{
		width: 150px;
	}
</style>