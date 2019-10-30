import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    message: {
        pageTitle:{
            title:'Tianchi SDN network system ',
            login:'Login',
            404:'404'
        },
//      'hello': 'hello, world',
//      'select':'please selected',
//      'btn':'click'
    },
    nav:{
    	layout:'Log out',
    	changPsd:'Change password',
    	language:'Language',
    	message:'Message'

    },
    aside:{
    	myself:'Personal center',
    	standLetter:'message',
    	unMessage:'Unread messages',
    	allMessage:'All the news',
    	backManage:'Backbone manage',
    	topoView:'Topology',
    	physicalLocation:'Physical location',
    	nodeManage:'Node manage',
    	backNode:'Backbone nodes',
    	nodeDetails:'Node details',
    	nodeEditor:'Node editor',
    	unknown:'Unknown node editor',
    	addUnknown:"Add unknown node",
    	unknownDetails:'Unknown node details',
    	
    	lineManage:'Link manage',
    	line:'Link',
    	cloudLine:'Cloud docking',
    	addCloud:'Add cloud',
    	cloudLineEdit:"Cloud dock editor",
    	cloudLineDeta:'Cloud dock details',
    	
    	resourcesManage:'Resources manage',
    	logicManage:'Logic manage',
    	
    	creatLogic:'Creat logic port',
    	editLogic:'Edit logic port',
    	logicDetails:'Logic port details',
    	
    	virtual:'Virtual line',
    	pointSpecial:'Point to point',
    	virtualSpecial:'Virtual networking',
    	
    	pointSpecialDeta:'Point to point details',
    	
    	
    	business:'Business open',
    	pointsTo:"Point to interconnection ",
    	dataCenterInter:'Data center interconnection',
    	dataCenterCloud:'Data to cloud',
    	cloudInter:'Cloud to cloud',
    	pointsMultiInter:'Point to multipoint',
    	virtualNetEdit:'Virtual network editor',
    	virtualNetDeta:'Virtual network details',
    	
    	tenantManage:'Tenant manage',
    	tenantList:'Tenant list',
    	addTenant:'Add tenant',
    	editTenant:'Tenant editor',
    	detaTenant:'Tenant details',
    	
    	accountManage:'Account manage',
    	peopleRole:'Personal role',
    	
    	addRole:'Add role',
    	roleDetails:'Role details',
    	roleEditor:'Role editor',
    	
    	peopleSet:'Personal set'
    },
     topFilters:{//单页面  搜索栏   
    	search:'Search',
    	reset:'Reset',
    	placeholder:'All',
    },
     
    tabOperation:{//表格数据的操作按钮部分
    	info:"Info",
    	edit:'Editor',
    	add:'Add',
    	delete:'Delete',
    	batchDel:'Batch deletion ',
    	derived:{
    		tit:'Derived data',
    		currentPage:'Current page',
    		allPage:'All page'
    	}
    },
    
    Public:{//公共部分
    	index:'Serial',
    	creation:'Creation time',
    	operation:'Operation ',
    	time:'Time',
	    type:'Type',
	    status:'Status',
	    name:'Name',
	    nodeDetails:'Node details',
	    linkDetails:'Link details',
    	creatime:'Creation time ：',
	    backboneStatus:'Backbone state ：',
	    backboneName:'Backbone name ：',
	    dataCen:'Data center ：',
	    //拓扑图的线的详情里面  使用
    	chart:'Chart：',
    	linkState:'Link status：',
    	sysBandwidth:'Total bandwidth(Mbps) ：',
    	phyBandwidth:'Physical bandwidth(Mbps) ：',
    	surBandwidth:'Residual bandwidth(Mbps) ：',
    	linkExpen:'Link cost ：',
    	linkCheck:'Link detection ：',
    	aPort:'A port：',
    	aportDescribe:'A end description ：',
    	zPort:'Z port：',
    	zportDescribe:'Z end description ：',
    	description:'Description：',
    		//2.云链路
    	cloudName:'Cloud chain road name：',
    	shardCloud:'Public cloud ：',
    	region:'Region：',
    	accessPoint:'Access point ：',
    	logic:'Logic name：',
    	logicStatus:'Logic status：',
    	bandwidth:'Bandwidth(Mbps)：',
    	interface_driver:'Interface driver ：',
    	open:'Open',//拓扑里面的点的详情
    	close:'Close',
    },
    
    
    //消息部分
    mesModule:{//消息模块
    	newDetails:{
    		title:'News details',
    	},
    	sea:{
    		mesTypeList:{
    			product:'Product',
    			police:'Warning'
    		},
    		time:{
    			start:'Start time',
    			end:'End time',
    			to:"To"
    		},
    		lea:{
    			one:'One level',
    			two:'Two level',
    			three:'Three level',
    			four:'Four level',
    			five:'Five level',
    		},
    		leType:'level'
    	},
    	operation:{
    		marked:'Read'
    	},
    	unMessage:{
    		table:{
    			serial:'Serial',
    			title:'Title',
    			time:'Time',
    			level:'Level',
    			type:'Type'
    		}
    	}
    },
     //骨干管理  
    	//拓扑视图
    topology:{
    	topBtn:{
    		save:'Save', //save layout
    		reduction:"Reduction",//reduction layout
    	},
    	footerBtn:{
    		showLabel:'Label',//show label
    		showFlow:'Flow',//显示流量
    		bandwidth:'Bandwidth',//bandwidth
    		showNetwork:'Network',//show network
    		legend:'Lengend',
    		bandW:{//带宽里面的数据
    			showBandwidth:'Bandwidth label',
    			showAllbandwidth:'All bandwidth',
    			showbandwidth1:'1G bandwidth',
    			showbandwidth2:'10 bandwidth',
    			showbandwidth3:'40G bandwidth',
    			showbandwidth4:'100 bandwidth',
    			showbandwidth5:'Other bandwidth',
    		},
    		shwoNet:{//显示网元部分
    			showBackboneNode:'Backbone node',
    			showShardCloud:'Public cloud',
    			showBackboneLink:'Backbone link'
    		},
    		leng:{//图例
    			tit:'Instructions',
    			flowColor:'Meaning of flow color ',
    			netwotkAbnormal:'NE abnormal status ',
    			networkInstructions:'NE type description ',
    			backNode:'Backbone',
    			ali:'Ali cloud ',
    			AWS:'AWS clod',
    			tc:'Tencent cloud ',
    			js:'Jin Shan Yun ',
    			UC:'UCloud cloud',
    			baidu:'Baidu cloud ',
    			huawei:'Hua Wei Yun ',
    			other:'Other clouds ',
    			
    		},
    		AbnormalStatus:{//网元异常状态
    			deviceAb:'Equipment exception ',
    			linkAbnormal:'Link / Vll exception ',
    			linkProtect:'Link protection '
    		}
    	},
    	details:{
    		wat:'Monitoring record ',
    		notDatatip:'More data can be found in the information list ',
    		deviceDetails:"View device details " 
    	}
    },
    //物理位置部分
    	//1
    physicalPosition:{
    	tab:{
    		area:'Region',
    		city:'City',
    		data:'Data center',
    	},
    	
    },
    ...enLocale
}

export default en;