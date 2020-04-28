<template>
  <div class="mesgdia">
    <el-dialog
      :title="$t('mesModule.newDetails.title')"
      :visible.sync="mesdetail.dialogVisible"
      :before-close="handleClose"
    >
      <div class="backg">
        <div>
          <h4>{{mesdetail.header}}</h4>
          <br>
          <p>{{$t('mesModule.unMessage.table.type')}}：{{mesdetail.title}}</p>
          <p>{{$t('mesModule.unMessage.table.time')}}：{{mesdetail.timeVal | timeFormat}}</p>
        </div>
        <h3>
          {{mesdetail.type}}
        </h3>
      </div>
      <!--日式框内容-->
      <div class="cener">
        <span v-html='mesdetail.text'>
        </span>
        <template v-if='mesdetail.param && mesdetail.param.length!=0'>
	        <span v-if=' Array.isArray(mesdetail.param)' >
	        	<template v-if='code == "port" || code == "device"'>
	        		<el-dropdown size="mini" split-button type="primary" class='btn_message'  
	        			v-for='item in mesdetail.param' :key='item.id'>
							  查看
							  <el-dropdown-menu slot="dropdown" >
							    <el-dropdown-item @click.native='selectInfo(mesdetail.param.id,"vll")'>虚拟专线</el-dropdown-item>
							    <el-dropdown-item @click.native='selectInfo(mesdetail.param.id,"multi")'>虚拟组网</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
	        	</template>
	        	<template v-else>
	        		<el-button class='btn_message'  v-for='item in mesdetail.param' 
        			:key='item.id'
        			:title='item.id'  
        			type='success' 
        			size='mini'
        			@click='seeInfo(item.id)'>查看</el-button> 
	        	</template>
        		
	        </span>
	        <span v-else>
	        	<template v-if='code == "port" || code == "device"'>
	        		<el-dropdown size="mini" split-button type="primary">
							  查看
							  <el-dropdown-menu slot="dropdown" >
							    <el-dropdown-item @click.native='selectInfo(mesdetail.param.id,"vll")'>虚拟专线</el-dropdown-item>
							    <el-dropdown-item @click.native='selectInfo(mesdetail.param.id,"multi")'>虚拟组网</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
	        	</template>
	        	
	        	<template v-else>
	        		<el-button type='success':title='mesdetail.param.id' size='mini'@click='seeInfo(mesdetail.param.id)'>查看</el-button>
	        	</template>
	        	
	        </span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    mesdetail: Object
  },
  data() {
    return {
    	token:sessionStorage.getItem("token"),
    	param:null,
    	code:'',//  port& device
    	//  获取各个   信息的查看的权限
    	buttonVal:{
    		Vll_Info:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@p2p_vll_info" ).show,//查看点到点详情
    		node_Info:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backboneNode").list, "node@node_info" ).show,//查看节点详情
    		mul_Info:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@multi_vll_info").show,//查看组网详情
    		muls:this.recursion( this.$store.state.aside ,"aside.virtualSpecial").show,//查看组网列表
    		vlls:this.recursion( this.$store.state.aside ,"aside.pointSpecial").show//查看组网列表
    	}
    };
  },
  watch:{
  	"mesdetail":{
  		handler(newVal,oldVal){
  			this.param=JSON.parse(JSON.stringify(newVal.param));
  			this.code=newVal.code.match(/(\S*)@/)[1];
  		},
  		deep:true
  	}
  },
  methods: {
    handleClose() {
      this.mesdetail.dialogVisible = false;
      this.$emit('getData');
    },
    selectInfo(id,type){
    	/**
    	 * id  		当前需要传的id
    	 * type		要显示的界面的类型   vll  multi  两种
    	 * code  	只有在 str数组里对应的name  获取对应的value  作为参数  传递     分为 设备 或者端口  查看对应的列表
    	 * */
    	var arr=[
    		{
    			type:'vll',
    			path:'/resource/virtualLine/pointTo',
    			value:this.buttonVal.vlls
    		},{
    			type:'multi',
    			path:'/resource/virtualLine/pointsTos',
    			value:this.buttonVal.muls
    		},
    	];
    	var str=[
    		{
    			name:'port',
    			value:'search_port'
    		},{
    			name:'device',
    			value:'search_device'
    		}
    	];
    	str.map(item => {
    		arr.map(inject => {
    			if(this.code == item.name){
    				if(inject.value){
    					if(inject.type == type ){
	    					var para={};
			    			var query={};
			    			para['path']=inject.path;
			    			query[item.value]=id;
			    			para.query=query;
			    			this.$router.push(para)
	    				}
    				}else{
    					this.$message({
    						message:this.$t("Public.noView"),
    						type:'warning'
    					})
    				}
    				
    			}
    		})
    	})

    },
    seeInfo(id){
    	/**
    	 * id   获取详情的时候需要的使用的id
    	 * {mesdetail{code}
    	 * 			
    	 * */
    	/**
    	 * type  类型
    	 * path  跳转路由
    	 * */
    	var arr=[
    		{
    			type:'vll',
    			path:'/resource/virtualLine/pointdetails',
    			value:'pointID',
    			boo:this.buttonVal.Vll_Info
    		},{
    			type:'point',
    			path:'/business/detailsMultipoint',
    			value:'detailsID',
    			boo:this.buttonVal.mul_Info
    		}
    	];
    	if(this.code == 'node'){
    		if(this.buttonVal.node_Info){
    			this.$ajax.get('/node/node_info/'+id+'?token='+this.token)
	    		.then(res => {
	    			if(res.status == 200 && res.data.status == 0){
	    				if(res.data.data.activated){//进入节点详情
	    					this.$router.push({
					        path: "/location/index/unknown/nodedetails",
					        query:{
					        	detailsID:id
					        }
					      });
	    				}else{// 进入未知节点详情
	    					this.$router.push({
									path:'/location/index/unknown_details',
									query:{
										unknownID:id
									}
								})
	    				}
	    			}
	    		})
    		}else{
    			this.$message({
						message:this.$t("Public.noView"),
						type:"warning"
					})
    		}
    	}else {
    		//不是节点的时候   剩下  虚拟专线和组网详情界面
    		arr.map(item => {
    			if(item.boo){
    				if( this.code == item.type ){
	    				var obj={},query={};
	    				obj['path']=item.path;
	    				query[item.value]= id;
	    				obj.query=query;
	    				this.$router.push(obj)
	    			}
    			}else{
    				this.$message({
    					message:this.$t("Public.noView"),
    					type:"warning"
    				})
    			}
    		})
    	}
    },

  }
};
</script>
<style lang="scss">
.mesgdia {
  .el-dialog {
    height: auto;
    .el-dialog__body {
      padding: 0 0 20px 0 !important;
      background: #f0f1f4;
      .backg {
        padding: 0 20px;
        padding-top: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #ccc;
        p {
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .cener {
        margin: 10px 20px;
        border-top: 1px solid #cccccc;
        text-align: left;
        background: #f0f1f4;
        padding: 10px 0;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        .btn_message{
        	display: block;
        	margin-bottom: 20px;
        }
      }
    }
  }
}
</style>