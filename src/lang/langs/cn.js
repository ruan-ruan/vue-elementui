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
    	bandwidthG:'带宽(Gbps)',
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
    	aliCloud:'阿里云',
    	tcCloud:'腾讯云' ,
    	cloudBase:'云链路基础信息配置',
    	clTooltip:'请正确填写公有云名称，否则将会影响拓扑图的效果展示',
    	bandwid:'带宽',
    	clDock:'云链路对接配置',
    	dockName:'对接节点名称',
    	dockLogic:'对接逻辑口',
    	clParams:'云链路参数配置',
    	dataWStruc:'数据结构',
    	par:'参数',
    	plaBandwidth:'请输入带宽',
    	plarightBand:'请输入正确的带宽',
    	maxBand:'最大带宽不超过1000000Mbps',
    	plpublicClo:'请选择公有云类型',
    	plblueclo:'请输入云链路名称',
    	plRegion:'请输入区域',
    	plAccess:'请输入接入点',
    	plChNode:'请选择节点',
    	plChLogic:'请选择逻辑口',
    	plChInter:'请选择接口驱动',
    	ali:'阿里云',
		AWS:'AWS',
		tc:'腾讯云',
		js:'金山云',
		UC:'UCloud',
		baidu:'百度云',
		huawei:'华为云',
    	tenant:'租户标识',
    	plaLogicSt:'请选择逻辑端口状态',
    	plaTenant:'请选择租户',
    	creatLogic:'创建逻辑端口',
    	portNumber:'端口组合数',
    	linkType:'用户连接方式',
    	conStart:'合同开始时间',
    	conEnd:'合同结束时间',
    	logName:'逻辑口名称',
    	enable:'启用',
    	abnormal:'异常',
    	Prohibit:'禁用',
    	plaConSta:'请选择合同的开始日期时间',
    	plaConEnd:'请选择合同的截止日期时间',
    	accPort:'关联端口',
    	userDevType:'用户设备类型',
    	cabNnumber:'机柜编号',
    	portType:'端口类型',
    	portStatus:'端口状态',
    	networkEqu:'网络设备',
    	NnetworkPort:'网络设备端口',
    	phyIntformation:'物理端口对接客户信息',
    	roomLoacation:'机房位置',
    	phyList:'关联物理端口列表',
    	second:'第二步:关联物理端口(至少关联一个物理端口)',
    	logicInformation:'逻辑端口信息',
    	first:'第一步:配置逻辑端口',
    	plaLogicName:'请输入逻辑端口名称',
    	plaChaTenant:'请选择租户标识',
    	plaUserDock:'请选择用户接入方式',
    	plaConSta:'请选择合同的开始时间',
    	plaConEnd:'请选择合同的结束时间',
    	plaChaBacknode:'请选择骨干节点',
    	plaDev:'请选择设备',
    	plaPort:'请选择端口',
    	exclusive:'独享',
    	share:'共享',
    	assphy:'关联物理端口',
    	editphy:'编辑物理端口',
    	assphyInfo:'关联物理端口详情',
    	swith:'交换机',
    	router:'路由器',
    	firewall:'防火墙',
    	mwSing:'万兆单模',
    	megaMult:'万兆多模',
    	gigabit:'千兆单模',
    	gigabitMult:'千兆多模',
    	gigabitJun:'千兆电口',
    	signModel:'百G单模',
    	basicPhy:'关联物理端口至少一个，不能为空，请关联物理端口!',
    	plaAccPhy:'请添加关联物理端口',
    	devPort:'设备端口',
    	specialStatus:'专线状态',
    	specialType:'专线类型',
    	origin:'起始',
    	abort:'截止',
    	billTime:'计费时间',
    	staBill:'开始计费日期时间',
    	endBill:'结束计费日期时间',
    	specialName:'专线名称',
    	aLogicStatus:'A逻辑口状态',
    	zLogicStatus:'Z逻辑口状态',
    	expTime:'过期时间',
    	busiStatus:'业务状态',
    	plaStartBill:'请选择计费开始日期时间',
    	plaEndBill:'请选择计费截止日期时间',
    	plaName:'请输入名称',
    	creating:'创建中',
    	stopping:'停止中',
    	servicing:'运行中',
    	failure:'创建失败',
    	cloudInter:'云互联',
    	cloudsTo:'云直连',
    	passthrough:'透传',
    	bandW:'带宽',
    	detailed:'详细信息' ,
    	dcAport:'DC端A端配置详情',
    	dcZport:'DC端Z端配置详情',
    	cloudAport:"A(云)端配置详情",
    	cloudZport:'Z(云)端配置详情',
    	zPortDetails:'Z(DC)端配置详情',
    	chargModel:'计费模式',
    	tarRegion:'目标Region',
    	
    },
    
    business:{
    	dataIntertitle:'通过此配置的界面，可以用专线连接两个不同的数据中心，并可以自定义专线的计费时间，结束时间和带宽！',
    	step1:'第一步:创建数据中心互联的虚拟专线',
    	step2:'第二步:业务两端基础信息配置',
    	aConfigure:'A端配置',
    	zConfigure:'Z端配置',
    	step3:'第三步:其他配置',
    	conDetails:'配置详情概览',
    	tooltip1:'请先选择节点和逻辑口',
    	tooltip2:'默认逻辑口为trunk,vlan为UNTAG',
    	tooltip3:'创建任意两个数据中心之间的二层虚拟专线',
    	atooltip:'虚拟专线受控的起始端',
    	ztooltip:'虚拟专线受控的终止端',
    	changeVlan:'选择vlan',
    	logicType:'逻辑口类型',
    	vlanSection:'VLAN区间',
    	plaVlanSection:'请选择vlan区间',
    	common:'共',
    	bar:'条记录',
    	page:'页',
    	prev:'上一页',
    	next:'下一页',
    	home:'首页',
    	tail:'尾页',
    	plaChangeLogic:'请选择逻辑口类型',
    	plaggin:'请重新选择,该逻辑口已经选择trunk模式，不能再选择透传模式!',
    	logicUntag:'该逻辑口已经为UNTAG模式，不可在为该模式！',
    	numIsNot:'该号不在区间内！',
    	vlanNot:'vlan值不能为空!',
    	bothPort:'两端不能选择相同的逻辑口，请重新选择!',
    	busiSubmitS:'业务提交成功，正在处理请在消息列表中查看具体进度!',
    	continueOpen:'继续开通',
    	goToSee:'前往查看',
    	payModel:'付费模式',
    	virtualUser:'该虚拟专线的实际使用者，需先创建后选择！',
    	plaPayModel:'请选择计费方式',
    	Annual:'包年包月',
    	cloudTooltip:'请选择本次链接云的类型',
    	tarRegion:'目标Region',
    	cloudRouter:'云便捷路由器(VBR)归属区域',
    	cloudDock:'云对接链路',
    	cloudPhyTooltip:'对接云的物理线路',
    	linePro:'专线提供方',
    	lineID:'共享专线ID',
    	region:'地域',
    	cliLine:'点击如何获取专线通道',
    	dialog:{//腾讯云对接时候里面对应规则
    		tit:'腾讯专用通道ID如何创建',
    		step1:'第一步：让客户登录腾讯云控制台，进入"专线接入"模块下"专用通道"列表中进行创建;点击列表中左上角"创建"按钮,腾讯云控制台登录网址',
    		link:'点击进入腾讯云控制台',
    		step2:'	第二步:点击"新建"按钮进入基本配置页面，此页面用户需注意一下四个字段的填写方式，如下图所示',
    		lineType:'专线类型:一定要选择"共享专线"类型，否则创建的专线通道ID不能使用	',
    		linePorvide:'专线提供方',
    		plaDataPro:'请将此数据填写值基本配置页面中"专线提供方" ',
    		cory:'复制',
    		lineID:'共享专线ID',
    		plaLineID:'请将此数据填写至基本配置页面中"共享专线ID"字段中',
    		plaRegion:'请根据此数据在基本配置页面中进行相应的地域选择，确保选择的一致性 ',
    		basic:'"基本配置"页面值需要注意以上四个字段的填写方式，其余字段信息用户如实填写完成既可，填写完毕点击"下一步"。',
    		step3:'第三步:点击"下一步"进入"高级配置"页面，里面的字段信息用户如实填写既可，填写完毕点击"下一步"。',
    		step4:'第四步:点击"下一步"进入"配置IDC设备"页面，里面的字段信息用户如实填写既可，填写完毕点击"提交"等待创建成功,',
    		dock1:'创建成功后，生成专用通道ID，即:列表中蓝色标识ID,如图所示:',
    		dock2:'将此专用通道ID填写到天驰网络系统"专线通道ID"字段中',
    		know:'我已知晓'
    	},
    	plaShared:'请选择公有云',
    	plaRegion:'请选择目标region',
    	plaDock:'请选择云对接',
    	seeTencent:'如何获取腾讯专线通道ID',
    	tencentTit:'此数据将用户创建腾讯云专线通道ID时使用',
    	c2ctoDCTitle1:'通过此配置的界面，可以连接不同的公有云的服务商，并可以自行定义专线的起始时间/终止时间以及带宽',
    	c2cStep1:'第一步:创建云到云的虚拟专线',
//  	c2cTooltip1:'创建任意两个数据中心之间的二层虚拟专线',
//  	c2cStep2:'第二步:业务两端基础信息配置',
    	c2cAcloud:'A(云)配置',
    	c2cZcloud:'Z(云)配置',
//  	c2cStep3:'第三步:其他配置',

    	c2cAshared:'A公有云',
    	c2cZshared:'Z公有云',
    	d2ctitle:'通过此配置的界面，可以用专线连接数据中心到公有云服务提供商(比如阿里云，AWS),并可以自行定义转此案的起始时间/终止时间以及带宽',
    	zDc:'Z(DC)配置',
    	d2cStep1:'第一步:创建数据中心到云的虚拟专线',
    	plaVlan:'请输入vlan号',
    	plaTrunk:"请重新选择,该逻辑口已经选择trunk模式，不能再选择透传模式!",
    	plaUntag:'该逻辑口已经为UNTAG模式，不可在为该模式！',
    	
    	
    },
    multi:{//组网
    	multiName:'组网名称',
    	multiStatus:'组网状态',
    	addMulti:'添加虚拟组网',
    	assPoints:'关联端点数',
    	plaMultiName:'请输入组网名称',
    	newAdd:'新增虚拟组网',
    	addLogicPort:'添加逻辑端口',
    	SelectType:'类型选择',
    	dataCentPort:'数据中心端口',
    	sharedCloud:'公有云端口',
    	multiInformation:'组网基本信息配置',
    	multiPort:'组网端点配置',

    	
    	
    },
    customer:{//租户信息列表
    	tenantPho:'租户手机号',
    	addCustomer:'添加租户',
    	tenantName:'租户标识(公司名称)',
    	tenantUser:'租户联系人',
    	phone:'手机号',
    	email:'邮箱',
    	cus:'客户标识',
    	corporate:'公司名称',
    	corporateType:'公司类型',
    	corporatePho:'公司电话',
    	address:'详细地址',
    	plaRun:'确定要启用该租户吗?',
    	plaStop:'确认要禁用该租户吗?',
    	tenantStatus:'租户状态',
    	logicList:'逻辑端口列表',
    	tooltip1:'公司名称应该与客户签订合同的主题名称一致!',
    	plaTenantUser:'请输入租户联系人',
    	plaTenantPho:'请输入租户手机号',
    	plaTenantEma:'请输入租户邮箱',
    	assTenant:'关联租户标识',
    	comporateType:'公司行业类型',
    	plaComporate:'按类型列表选择客户公司行业类型',
    	comporatePho:'公司电话',
    	comporateAddress:'公司地址',
    	plAddress:'请输入详细地址',
    	plaMax:'备注字符最长为200',
    	plaPho:'请输入手机号',
    	plaRightPho:'请输入正确的手机号',
    	plaEma:'请输入邮箱',
    	plaRightEma:'请输入正确的邮箱',
    	plaTenant:'请输入租户标识',
    	plaComporate:'请输入公司名称',
    	cloud:'云服务商',
    	idc:'IDC运用商',
    	government:'政府客户',
    	industry:'行业客户',
    	network:'网络提供商',
    	other:'其他'
    },
    roles:{//角色
    	roleName:'角色名称',
    	roleStatus:'角色状态',
    	plaDis:'确定要禁用该角色吗?',
    	plaEnable:'确定要启用该角色吗?',
    	role:'角色',
    	extentList:'角色的权限列表',
    	extentChange:'权限选择',
    	plaStatus:'请选择状态',
    	extentEmt:'权限不能为空',
    	account:'账户',
    	personStatus:'人员状态',
    	accNumber:'账号',
    	assRoles:'关联角色',
    	psd:'密码',
    	psdCon:'密码必须包含数字，小写、大写字母',
    	conPsd:'确认密码',
    	plAdginPsd:'请再次输入密码',
    	plaConPsd:'两次输入密码不一致',
    	plaPsd:'请输入密码',
//  	plaPsdRules:'密码必须包含数字，小写、大写字母',
    	plaPho:'手机号不能为空',
    	plaRightPho:'请输入正确的手机号',
    	placcoun:'请输入账号',
    	max30:'不能超过 30 个字符',
    	plaRoles:'请选择角色'
    	
    },
    confirm:{
    	tooltip:'提示',
    	confi:'确定',
    	title:'确认删除该记录吗?',
    	titles:'确认删除选中记录吗?',
    	linkOpen:'确认将此链路开启，开启维护状态!',
    	linkClose:'确认将此链路关闭，关闭维护状态!',
    	disPort:'确定要禁用该端口吗?',
    	enPort:'确定要启用该端口吗?',
    	delPhy:'确定要删除该物理端口吗?',
    	editVir:'编辑虚拟专线',
		plaSureStop:'请确认是否确认禁用?',
		plaSureRun:'请确认是否确认启用?',
    	dataEmt:'数据为空不能执行导出操作!',
    	conExportAll:'确定导出所有的数据吗?',
    	conExportCur:'确定要导出当前页的数据吗?',
		conStop:'确认要禁用吗?',
		conRun:'确认要启用吗?',
		
		
    },
    topFilters:{//单页面  搜索栏   
    	search:'搜索',
    	reset:'重置',
    	placeholder:'全部',
    	name:'名称',
    },

    validateMes:{
    	place:'请输入',
    	placeCh:'请选择'
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
    	stop:'停止',
    	copy:'复制'
    	
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
    	diSuccess:'禁用成功!',
    	enSuccess:'启用成功！',
    	runSuccess:'运行成功！',
    	stopSuccess:"禁止成功!",
    	changeSuccess:'选择成功！',
    	copySuccess:'复制成功!',
    	copyFail:'复制失败！',
    	creaSuccess:'创建成功!',

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
    			showAllbandwidth:'显示所有带宽链路',
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