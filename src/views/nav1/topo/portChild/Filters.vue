<template>
	<div>
		<!--topo里面的所有的业务的流量的显示-->
		<el-radio-group v-model="filters.change" v-show='isShow'>
		    <el-radio v-for='item in change' 
		    	:key='item.name' 
		    	:label='item.label'>{{item.name}}</el-radio>
		</el-radio-group>
		<el-select v-model='filters.device' class='ipt_sels2' v-if='filters.change === 2'>
			<el-option v-for='item in devices'
				:value='item.id'
				:key='item.id'
				:label='item.name'
				></el-option>
		</el-select>
		<el-form :model='filters' ref='filters' :inline='true' class='marT10'>
			<el-form-item >
				<el-select v-model='filters.unit'class='sel'>
					<el-option
						v-for='item in units ' 
						:key='item.name'
						:value='item.value'
						:label='item.name'>
					</el-option>
				</el-select>
				<el-select v-model='filters.num' class='sel'>
					<el-option v-for='item in numType'
					:value='item.value'
					:label='item.name'
					:key='item.value'
					></el-option>
				</el-select>
				<el-select v-model='filters.time' class='sel'>
					<el-option v-for='item in timeType'
					:key='item.value'
					:value='item.value'
					:label='item.name'
					></el-option>
				</el-select>
				<el-button type='primary' size='small' @click='getData'>搜索</el-button>
				    <el-date-picker
				      	v-model="filters.cusTime"
				      	type="datetimerange"
				      	range-separator="至"
				      	start-placeholder="开始日期"
				      	end-placeholder="结束日期"
				      	class='ipt'
				      	v-show='filters.time === "customize"'>
				    </el-date-picker>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		name:'Filters',
		props:{
			ports:{
				type:Array,
				default:function(){
					return [];
				}
			},
			bool:{
				type:Boolean,
				default:false,//默认在节点详情里
			}
		},
		data(){
			return {
				change:[
					{
						name:'查看总流量图',
						label:1
					},{
						name:'查看设备端口流量图',
						label:2
					}
				],
				units:[
					{
						name:'Mbps',
						value:'Mbps'
					},{
						name:'PPS',
						value:'PPS'
					}
				],
				numType:[
					{
						name:'最大值',
						value:'max'
					},{
						name:'最小值',
						value:'min'
					},{
						name:'平均值',
						value:'avg'
					}
				],
				timeType:[
					{
						name:'最近一小时',
						value:'hour'
					},{
						name:'最近一天',
						value:'day'
					},{
						name:'最近一周',
						value:'week'
					},{
						name:'自定义',
						value:'customize'
					}
				],
				token:this.$store.state.token,
				filters:{
					change:1,//默认的时候显示的是总的流量图
					port:'',//根据设备筛选端口  并获取某一个的流量图
					unit:'Mbps',//  根据单位进行筛选显示
					num:'avg',//  显示平均值
					time:'day',//显示最近一天的数据
					cusTime:[],//自定义时间 
					device:''
				},
				
			}
		},
		computed:{
			isShow(){
				return this.bool;
			},
			devices(){
				var arr=[];
				console.log(this.ports)
				this.ports.map(item => {
					arr.push(item.device);//在选择框使用的时候设别的数据，但是在获取流量的数据的时候，需要的是端口的数据，在父组件内进行筛选
				})
				return arr;
			},
//			selPort(){
//				//根据选择的设备然后将端口的信息发送到父组件
//				this.ports.find(item => {
//					if(item.device.id === this.filters.id){
//						return item.port.id;//找到对应的设备的端口，并将该端口id发送到父组件
//					}
//				})
//			}
			
		},
		watch:{
			filters:{
				handler:function(newVal,oldVal){
					this.$emit('fil',newVal)
				},
				deep:true
			},
		},
		methods:{
			getData(){
				this.$emit('sourch')
			}
		}
	}
	
</script>
