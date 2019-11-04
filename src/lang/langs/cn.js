import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    message: {
        pageTitle:{
            title:'天弛SDN网络系统',
            login:'登录',
            404:'404'
        },
    },
    nav:{//顶部   导航栏  
    	layout:'退出登录',
    	changPsd:'修改密码',
    	language:'语言',
    	message:'消息',
    },
    aside:{//  侧边  导航栏
    	myself:'个人中心',
    	standLetter:'站内信',
    	unMessage:'未读消息',
    	allMessage:'全部消息',
    	backManage:'骨干管理',
    	topoView:'拓扑视图',
    	physicalLocation:'物理位置',
    	nodeManage:'节点管理',
    	backNode:'骨干节点',
    	nodeDetails:'节点详情',
    	nodeEditor:'节点编辑',
    	unknown:'未知节点编辑',
    	addUnknown:"添加未知节点",
    	unknownDetails:'未知节点详情',
    	lineManage:'链路管理',
    	line:'链路',
    	cloudLine:'云对接链路',
    	addCloud:'添加云',
    	cloudLineEdit:"云对接编辑",
    	cloudLineDeta:'云对接详情',
    	resourcesManage:'资源管理',
    	logicManage:'逻辑口管理',
    	creatLogic:'创建逻辑端口',
    	editLogic:'编辑逻辑端口',
    	logicDetails:'逻辑端口详情',
    	virtual:'虚拟专线',
    	pointSpecial:'点到点专线',
    	virtualSpecial:'虚拟组网专线',
    	
    	pointSpecialDeta:'点到点详情',
    	business:'业务开通',
    	pointsTo:"点到点互联",
    	dataCenterInter:'数据中心互联',
    	dataCenterCloud:'数据中心到云',
    	cloudInter:'云到云互联',
    	pointsMultiInter:'点到多点互联',
    	virtualNetEdit:'虚拟组网编辑',
    	virtualNetDeta:'虚拟组网详情',
    	
    	
    	tenantManage:'租户管理',
    	tenantList:'租户信息列表',
    	addTenant:'租户添加',
    	editTenant:'租户编辑',
    	detaTenant:'租户详情',
    	accountManage:'账户管理',
    	peopleRole:'人员角色',
    	addRole:'添加角色',
    	roleDetails:'角色详情',
    	roleEditor:'角色编辑',
    	peopleSet:'人员设置'
    },
    topFilters:{//单页面  搜索栏   
    	search:'搜索',
    	reset:'重置',
    	placeholder:'全部',
    	name:'名称',
    },
   
    tabOperation:{//表格数据的操作按钮部分
    	info:'详情',
    	edit:'编辑',
    	add:'新增',
    	delete:'删除',
    	batchDel:'批量删除',
    	derived:{
    		tit:'导出数据',
    		currentPage:'当前页',
    		allPage:'所有页'
    	},
    	cancel:'取消',
    	Submit:'提交' ,
    	save:'保存',
    	run:'运行',
    	
    },

    
    Form:{
    	creation:'创建时间：',
    	region:'区域'
    },

    Public:{//公共部分
    	backLink:'骨干链路',
    	unLink:'未知链路',
    	apply:'申请时间',
    	SingleRun:'单一运行',
    	run:'运行中',
    	leave:'离线',
    	start:'开始时间',
		end:'结束时间',
		to:"至",
    	index:'序号',
    	creation:'创建时间',
    	SubordinateArea:'所属区域', 
    	SubordinateCity:'所属城市',
    	operation:'操作',
    	time:'时间',
	    type:'类型',
	    status:'状态',
	    name:'名称',
	    nodeDetails:'节点详情',
	    linkDetails:'链路详情',
	    nodeName:'节点名称',
	    nodeStatus:'节点状态',
	    deviceName:"设备名称",
	    deviceStatus:'设备状态',
	    snNumber:'sn号',
	    manageIP:'管理IP',
		description:'备注',
	    id:'id',
	    portInfo:'端口信息',
	    pointLine:'点到点专线',
	    virtualLine:'虚拟组网专线',
	    goback:'返回',
	    addphyDeviceTwo:'添加物理设备2',
	    packUpDeviceTwo:'收起物理设备2',
	    place1:'请输入设备1端口',
	    place2:'请输入设备2端口',
	    phyDeviceOne:'物理设备1',
	    phyDeviceTwo:'物理设备2',
	    vendor:'硬件供应商',
	    deviceModel:'设备型号',
	    portSection:'端口区间',
	    position:'所在位置',
	    room:'所在房间',
	    rack:'rack',
	    place150:'最多输入150字符',
		placeFind:'请输入发现参数',
		findDevice:'发现设备参数设置',
		runSuccess:'运行成功，请在骨干节点中查看!',
		runDevice:'确定要运行该设备吗?',
		
		
		
	    PortNum:'请输入端口号',
	    portRulestip:'请输入正确的端口号:详情规则请点击右侧！',
		portRules:'格式:填写1~54内的正整数;"-"代表端口区间并取两边的数值;","代表单个端口隔离 ,例:1-23,25,26-48代表除去24口的所有端口',
		ip:'ip',
		fau:"故障",
	    fault:'故障/维护',
	    //  拓扑图里面的使用过
	    creatime:'创建时间',
	    backboneStatus:'骨干状态',
	    backboneName:'骨干名称',
	    dataCen:'数据中心',
	    backboneNode:'骨干节点',
	    unNode:'未知节点',
	    //拓扑图的线的详情里面  使用
	    
	    
	    //form表单
	    	//1.点到点链路
    	chart:'图表',
    	linkState:'链路状态',
    	sysBandwidth:'总带宽(Mbps)',
    	phyBandwidth:'物理带宽(Mbps)',
    	surBandwidth:'剩余带宽(Mbps)',
    	linkExpen:'链路开销',
    	linkCheck:'链路检测',
    	aPort:'A端',
    	aportDescribe:'A端描述',
    	zPort:'Z端',
    	zportDescribe:'Z端描述',
    	
    		//2.云链路
    	cloudName:'云链路名称',
    	shardCloud:'公有云',
    	region:'区域',
    	accessPoint:'接入点',
    	logic:'逻辑口',
    	logicStatus:'逻辑口状态',
    	bandwidth:'带宽(Mbps)',
    	interface_driver:'接口驱动',
    	open:'开启',  //拓扑里面的点的详情
    	close:'关闭',
    	
    	linkID:'链路id',
    	checkType:'检测类型',
    	checkParams:'检测参数',
    	get_flow:'获取流量键入值',
    	notEmity:'不能为空',
    	placeRight:'请输入正确的值',
    	openMain:'开启维护',
    	closeMain:'关闭维护',
    	maintain:'维护',
    	deviceID:'设备id',
    	addUnknownLink:"添加未知链路",
    	findLink:"发现链路",
    	aPortNode:'A端节点',
    	a_ip:'A端接口IP',
    	a_vlan:'A端接口VLAN',
    	a_des:'A端描述',
    	z_PortNode:'Z端节点',
    	z_ip:'Z端接口IP',
    	z_vlan:'Z端接口VLAN',
    	z_des:'Z端描述',
    	placeFind:'请输入发现链路参数',
    	placeaNode:'请选择A端节点',
    	placeaIp:'请输入A端端口IP',
    	placeaDes:'请输入A端端口描述',
    	placezNode:'请选择Z端节点',
    	placezIp:'请输入Z端端口IP',
    	placezDes:'请输入Z端端口描述',
    	placeLink:'请选择链路检测是否开启',
    	placeLinkType:'请选择链路检测类型',
    	findParams:'发现链路参数配置',
    	placeNumber:'请输入正整数',
    	openLinkSure:'确认将次链路开通运行吗?',
    	linkRunSuc:'运行成功，请到骨干链路中查看!',
    	paramsNotEmity:'参数不能为空！',
    	cloudTit:'通过此页面可创建对应的逻辑口',
    	addCloud:'添加云链路',
    	
    	
    	
    },
    
    confirm:{
    	tooltip:'提示',
    	confi:'确定',
    	title:'确认删除该记录吗?',
    	titles:'确认删除选中记录吗?',
    	linkOpen:'确认将此链路开启，开启维护状态!',
    	linkClose:'确认将此链路关闭，关闭维护状态!'
//  	cancel:'取消'
		
    },
    validateMes:{
    	place:'请输入',
    	placeCh:'请选择'
    },
    tooltipMes:{//提示信息  
    	addNode:'添加节点',
    	findNode:'发现节点',
    	name:'名称',
    	area:'区域',
    	city:'城市',
    	editSuccess:'修改成功!',
    	addSuccess:'添加成功!',
    	delSucess:'删除成功!',
    	dataNull:'数据为空，不能执行导出操作!',
    	exportDataAll:'确定要导出所有的数据吗?',
    	exportDataCurr:'确定要导出当前页的数据吗?',
    	download :'下载数据',
    	exportSucess:'导出成功!',
    	openSuc:'开启成功！',
    	closeSuc:'关闭成功！',
    	
//  	downloading:'正在'
    	
    },
    
    
    
    mesModule:{//消息模块
    	newDetails:{
    		title:'消息详情',
    	},
    	sea:{
    		mesTypeList:{
    			product:'产品信息',
    			police:'报警信息'
    		},
    		time:{
    			start:'开始时间',
    			end:'结束时间',
    			to:"至"
    		},
    		lea:{
    			one:'一级',
    			two:'二级',
    			three:'三级',
    			four:'四级',
    			five:'五级',
    		},
    		leType:'级'
    	},
    	operation:{
    		marked:'标记已读'
    	},
    	unMessage:{
    		table:{
    			serial:'序号',
    			title:'标题',
    			time:'时间',
    			level:'级别',
    			type:'类型'
    		}
    	}
    },
    //骨干管理  
    	//拓扑视图
    
    topology:{
    	topBtn:{
    		save:'保存布局', //save layout
    		reduction:"还原布局",//reduction layout
    	},
    	footerBtn:{
    		showLabel:'显示标签',//show label
    		showFlow:'显示流量',//显示流量
    		bandwidth:'带宽',//bandwidth
    		showNetwork:'显示网元',//show network
    		legend:'图例',
    		bandW:{//带宽里面的数据
    			showBandwidth:'显示带宽标签',
    			showAllbandwidth:'显示所有带宽',
    			showbandwidth1:'显示1G带宽链路',
    			showbandwidth2:'显示10G带宽链路',
    			showbandwidth3:'显示40G带宽链路',
    			showbandwidth4:'显示100G带宽链路',
    			showbandwidth5:'显示其他带宽链路',
    		},
    		shwoNet:{//显示网元部分
    			showBackboneNode:'显示骨干节点',
    			showShardCloud:'显示公有云节点',
    			showBackboneLink:'显示骨干链接'
    		},
    		leng:{//图例
    			tit:'图例说明',
    			flowColor:'流量颜色的含义',
    			netwotkAbnormal:'网元异常状态',
    			networkInstructions:'网元类型说明',
    			backNode:'骨干节点',
    			ali:'阿里云',
    			AWS:'AWS',
    			tc:'腾讯云',
    			js:'金山云',
    			UC:'UCloud',
    			baidu:'百度云',
    			huawei:'华为云',
    			other:'其他云',
    			
    		},
    		AbnormalStatus:{//网元异常状态
    			deviceAb:'设备异常',
    			linkAbnormal:'链路/Vll异常',
    			linkProtect:'链路保护'
    		}
    	},
    	details:{
    		wat:'监控记录',
    		notDatatip:'更多数据请到信息列表中查看',
    		deviceDetails:"查看设备详情" ,
    		noData:'暂无报警记录',
    	},
    	
    },
    //物理位置部分
    	//1
    physicalPosition:{
    	tab:{
    		area:'区域',
    		city:'城市',
    		data:'数据中心',
    	},
    	regionName:'区域名称',
    	cityName:'城市名称',
    },
    
    ...zhLocale
}
export default cn;