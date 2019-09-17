<template>
	<div>
		<!--公有云部分-->
		<el-form :model='editForm':rules='editFormRules' ref='editForm'label-width='100px' v-loading='editLoading'>
			<el-form-item label='公有云'prop='cloun'>
				<!--<el-select v-model='editForm.cloun' class='ipt' >
					<el-option v-for='(item ,index) in clounData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>-->
				
				<el-autocomplete
				  popper-class="my-autocomplete"
				  v-model="editForm.cloun"
				  :fetch-suggestions="querySearch"
				  placeholder="请输入内容"
				   class='ipt'
				   @blur='addData(editForm.cloun)'
				    @select="handleSelect"
				    @focus='sel'>
				  <i
				    class="el-icon-edit el-input__icon"
				    slot="suffix"
				    @click="handleIconClick">
				  </i>
				  <template slot-scope="{ item }">
				    <div >{{ item}}</div>
				  </template>
				  <!--<template v-for="(item,index) in clounData"  >
				  	<span :key='index'>{{item}}</span>
				  </template>-->
				</el-autocomplete>
				
				<span class="cli_toTip" title="请选择本次链接云的类型">?</span>
			</el-form-item>
			<el-form-item label='目标Region' prop='targetRegion'>
				<el-select v-model='editForm.targetRegion' class='ipt'>
					<el-option v-for='(item ,index) in targetRegionData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<span class="cli_toTip" title="云便捷路由器(VBR)归属区域">?</span>
			</el-form-item>
			<el-form-item label='云对接链路' prop='clounDock'>
				<el-select v-model='editForm.clounDock'class='ipt'>
					<el-option v-for='(item ,index) in clounDockData'
						:label='item.name'
						:value='item.id'
						:key='index'>
					<span>{{item.name}}</span>
					<span style="margin-left: 20px;">{{item.logic_port.name}}</span>
					</el-option>
				</el-select>
				<span class="cli_toTip" title="对接云的物理线路">?</span>
			</el-form-item>
			<el-form-item v-for='(item,index) in dockLinks' :label='item.show_name':key='index' :prop='item.keyVal'
				:rules="{required:true,message:'不能为空',trigger:'blur'}">
				<el-input v-model='item.keyVal':placeholder="'请输入'+item.show_name"class='ipt'></el-input>
				<!--<span>?</span>-->
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	
	export default{
		name:'sharedCloun',
		data(){
			return{
				token:'',
				editForm:{
					cloun:'',
					targetRegion:'',
					clounDock:'',
				},
				clounidsList:'',//根据id找到对应的 interface_driver
//				clounDockObj:{},//保存云对接的对象数据
				dockListObj:{},//选择不同的云对接的时候，将数据发送到父组件
				editFormRules:{
					cloun:[{ required: true, message: '请选择公有云', trigger: 'change' }],
					targetRegion:[{ required: true, message: '请选择目标region', trigger: 'change' }],
					clounDock:[{ required: true, message: '请选择云对接', trigger: 'change' }],
				},
				editLoading:false,
				clounData:[],//公有云的数据
				targetRegionData:[],//目标 region
				clounDockData:[],//云对接的数据
				dockLinks:[],//根据不同的云对接的获取不同的列表
				str:[],
			}
		},
		watch:{
			editForm:{
				handler(newVal,oldVal){
						if(newVal.clounDock){
							if(newVal.clounDock==='Automatically'){
								this.selectCloun(this.selectDriver(this.clounDockData[1].id));//自动分配的时候获取数组里面的数据的第二个id
							}else{
								this.selectCloun(this.selectDriver(newVal.clounDock));//获取所选的列表
							}
						}
						
					this.$emit('sendClounbasic',this.editForm)//发送基本的云选择的列表
					this.$emit('sendClounbasic_a',this.editForm)
					this.$emit('sendClounbasic_z',this.editForm)
					
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
		mounted(){
			if(this.clounData.length!==2){
				this.clounData=localStorage.getItem("temp");
			}else{
				return this.clounData;
			}
		},
		methods:{
			sel(item){
//				console.log(item);
//				console.log(localStorage.getItem("temp"))
			},
			addData(item){//失去焦点的时候，公有云添加新的数据
				this.clounData.unshift(item);
//				if(this.clounData.length>5){
//					this.clounData=this.clounData.slice(0,5);
//				}
				console.log(this.clounData)
//				str=this.clounData;
				localStorage.setItem("temp",this.clounData); 
				console.log(localStorage.getItem("temp"))
			},
			handleSelect(item) {
//		        console.log(item);
//				(editForm.cloun)
				this.editForm.cloun=item;
		    },
			handleIconClick(ev) {
		        console.log(ev);
		    },
			querySearch(queryString, cb) {
//				this.clounData
		        var restaurants = this.clounData;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			getFormData(){
				//获取公有云的列表
				this.$ajax.get('/vll/get_public_cloud'+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.clounData=res.data.data;
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
				//获取目标region
				this.$ajax.get('/vll/get_cloud_region'+"?token="+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.targetRegionData=res.data.data;
						}
					}
				}).catch(e => {console.log(e)})
				
				//获取云对接的链路
				this.$ajax.get('/link/cloud_links'+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.clounDockData=res.data.data.items;
							this.clounDockData.unshift({interface_driver:'自动分配',name:'自动分配',id:'Automatically',logic_port:{name:''}})
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			selectCloun(clounName){
				var para={
					name:clounName
				}
				this.$ajax.get('/vll/get_driver_frame/'+clounName+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
//							this.clounList=res.data.data;
							res.data.data.forEach(ele => {
								ele.keyVal=''
							})
							console.log(res.data.data);
							this.dockLinks=res.data.data;
//							res.data.data.forEach(ele => {
//								this.dockListObj[ele.name]=ele.keyVal;
//							})
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectDriver(ids){//根据选择的interface_driver  从数组里面获取该对象数据
				let str=''
				var findDriver=this.clounDockData.find(function(obj){
					return obj.id===ids
				})
				str=findDriver.interface_driver;
				return str;
			}
		}
	}
</script>

<style>
</style>