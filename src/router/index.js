import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
//登录
import Login from '@/views/Login.vue'
//未找到
import NotFound from '@/views/404.vue'
//主组件
import Home from '@/views/Home.vue'

////日志
//import Open_log from '@/views/log/Open_log'
//import Link_log from '@/views/log/Link_log'
//import Opera_log from '@/views/log/Opera_log'
//import Login_log from '@/views/log/Login_log'

import Topology from'@/views/nav1/Topology'

import parent from '@/views/parent'
Vue.use(Router)

var router = new Router({
	mode:'history',
  routes: [
	{
        path: '/login',
        component:Login,
        hidden: true
    },
    {
    	path: '/',
        component: Home,
        hidden: true,
        meta:{
        	requireAuth:true
        },
        children:[
        	{path:'/changepassword', component: () => import ('@/components/changePsw'),name:'密码修改',leaf:true}
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
	},
	{		
		path: '/',
		component: Home,
//		name:"个人中心",
		name: 'aside.myself',
		iconCls: require('../assets/images/aside/myself.png'),
		leaf:false,
		meta:{
			requireAuth:true
		},
		children: [
			//站内信
			{path:'/message',component: () => import ('@/views/parent'), name: 'aside.standLetter',leaf:false,children:[
				{path:'/message/unreadMessage',component: () => import ('@/views/message/unreadMessage'), name: 'aside.unMessage',leaf:true},
				{path:'/message/allMessage',component: () => import ('@/views/message/allMessage'), name: 'aside.allMessage',leaf:true}
			]}
			
		]
	},
	{
        path: '/',
        component: Home,
		name:'aside.backManage',
        iconCls: require('../assets/images/aside/backbone.png'),//图标样式class    
        leaf:false,
        meta:{
        	requireAuth:true
        },
        children: [
			{path:"/topology",component:Topology,name:'aside.topoView',leaf:true,},
			{path:"/topology/charts",component:() => import ('@/components/multCharts.vue'),name:'',leaf:true,hidden:true},//topo的图表详情
			{path:'/location/area',component:() => import ('@/views/nav1/Table.vue'),name:'aside.physicalLocation',leaf:true,},
			{path:'/location',component:() => import('@/views/parent'),name:'aside.nodeManage',leaf:false,
			children:[
			{path:'/location/backbone',component:() => import('@/views/nav1/Form.vue'),name:'aside.backNode',leaf:false, },
			
			]},
			//骨干节点的详情的界面路由和链路里面的A，Z端的节点的详情
			{path:'/location/index/unknown/nodedetails/:id',component:() => import('@/views/nav1/node/details/Details'),name:'aside.nodeDetails',hidden:true,leaf:true},

			//骨干节点的编辑界面的路由
			{path:'/location/index/editForm',component:() => import('@/views/nav1/node/details/child/node'),name:'节点编辑',hidden:true,leaf:true},
			//骨干的未知节点的编辑部分
			{path:'/location/index/unknown_editForm/:unknownEditID',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.unknown',hidden:true,leaf:true},
			//骨干的未知节点的添加部分
			{path:'/location/index/unknown_add',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.addUnknown',hidden:true,leaf:true},
			//骨干的未知节点的详情部分
			{path:'/location/index/unknown_details/:unknownID',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.unknownDetails',hidden:true,leaf:true},
			
			{path:'/location/',name:'aside.lineManage',component: () => import('@/views/parent'),redirect:'user',hidden:false,leaf:false,

			children:[{path:'/location/line/link',component:() => import('@/views/nav1/user.vue'),name:'aside.line',leaf:true},
			{path:'/location/line/cloun',component:() => import('@/views/nav1/line/cloun.vue'),name:'aside.cloudLine',leaf:true},
			]},
			//云对接的部分
			{path:'/location/line/addcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'aside.addCloud',hidden:true,leaf:true},
			{path:'/location/line/editcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'aside.cloudLineEdit',hidden:true,leaf:true},
			{path:'/location/line/clounDetails',component:() => import('@/views/nav1/line/clounFile/clounsTab.vue'),name:'aside.cloudLineDeta',hidden:true,leaf:true},
        ]
    },
    {		
        path: '/',
        component: Home,
        name: 'aside.resourcesManage',
        iconCls: require('../assets/images/aside/resource.png'),
        leaf:false,
        meta:{
        	requireAuth:true
        },
        children: [
			{ path: '/resource/port', component: () => import ('@/views/resources/port.vue'), name: 'aside.logicManage',leaf:true },
			//逻辑端口的创建
			{ path: '/resource/add/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: 'aside.creatLogic',leaf:true,hidden:true},
			//逻辑端口的编辑
			{ path: '/resource/edit/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: 'aside.editLogic',leaf:true,hidden:true},
			//逻辑端口的详情的界面
			{ path: '/resource/see/logicalPort', component: () => import ('@/views/resources/details/logicalDetails.vue'), name: 'aside.logicDetails',leaf:true,hidden:true},
			//虚拟专线
			{path:'/resource/virtualLine',component: () => import ('@/views/parent'), name: 'aside.virtual',leaf:false,children:[
				{path:'/resource/virtualLine/pointTo',component: () => import ('@/views/resources/pointTo'), name: 'aside.pointSpecial',leaf:true},
				{path:'/resource/virtualLine/pointsTos',component: () => import ('@/views/resources/pointsTos'), name: 'aside.virtualSpecial',leaf:true},
			]},
			{path:'/resource/virtualLine/pointdetails',component: () => import ('@/views/resources/virtualDetails/poinDetail'), name: 'aside.pointSpecialDeta',leaf:true,hidden:true},
			
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'aside.business',
        iconCls: require('../assets/images/aside/business1.png'),
//      leaf: true,//只有一个节点
 		leaf:false,
   		meta:{
        	requireAuth:true
        },
        children: [
            { path: '/business', component:parent , name: 'aside.pointsTo',leaf:false,children:[
            	{path:'/business/point/dataInter',component:() => import ('@/views/business/pointTo/dataInterconnection'),name:'aside.dataCenterInter',leaf:true},
            	{path:'/business/point/dataCloun',component:() => import ('@/views/business/pointTo/dataToCloun'),name:'aside.dataCenterCloud',leaf:true},
            	{path:'/business/point/clounInter',component:() => import ('@/views/business/pointTo/clounsInterconnection'),name:'aside.cloudInter',leaf:true},
            	
            ] },
            { path: '/business/multipoint', component:() => import ('@/views/business/multi/multipoint') , name: 'aside.pointsMultiInter',leaf:true,},
            //点到多点的编辑
            { path: '/business/editMultipoint', component:() => import ('@/views/business/multi/multFile/editMultipoint') , name: 'aside.virtualNetEdit',leaf:true,hidden:true},
            { path: '/business/detailsMultipoint', component:() => import ('@/views/business/multi/multFile/detailsTab') , name: 'aside.virtualNetDeta',leaf:true,hidden:true},     
        ]
    },

    {
    	path:'/',
    	component:Home,
    	name:'aside.tenantManage',
    	iconCls:require('../assets/images/aside/tenant.png'),
    	 leaf:false,
    	 meta:{
        	requireAuth:true
        },
    	children:[
    		{path:'/customer/cus',component:() => import ('@/views/customer/Customer'),name:'aside.tenantList',leaf:true,},
    		//租户添加
    		{path:'/customer/addCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'aside.addTenant',leaf:true,hidden:true},
    		//租户的编辑
    		{path:'/customer/editCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'aside.editTenant',leaf:true,hidden:true},
    		{path:'/customer/details/tenant/:id',component:() => import ('@/views/customer/Details/tenant'),name:'aside.detaTenant',leaf:true,hidden:true},

    	]
    },
    {
    	path:'/',
    	component:Home,
    	name:'aside.accountManage',
    	iconCls:require('../assets/images/aside/account.png'),
    	leaf:false,
    	meta:{
        	requireAuth:true
        },
    	children:[
    			{path:'/account',component:() => import('@/views/account/Role'),name:'aside.peopleRole',leaf:true,},
    			//角色的添加
    			{path:'/account/roles/add',component:() => import('@/views/account/add/roles'),name:'aside.addRole',hidden:true,},
    			//角色的详情
    			{path:'/account/roles/details/:id',component:() => import('@/views/account/add/roles'),name:'aside.roleDetails',hidden:true},
    			//角色编辑
    			{path:'/account/roles/editForm',component:() => import('@/views/account/add/roles'),name:'aside.roleEditor',hidden:true},
    			
    			{path:'/account/set',component:() => import('@/views/account/Set'),name:'aside.peopleSet',leaf:true,}
    	]
    },
//	{
//		path:'/',
//		component:Home,
//		name:'日志',
//		iconCls:require('../assets/images/aside/updateLog.png'),
//		leaf:false,
//		meta:{
//  		requireAuth:true
//  	},
//		children:[
//			{path:'/log/open',component:Open_log,name:'业务开通日志'},
//			{path:'/log/link',component:Link_log,name:'设备链路日志'},
//			{path:'/log/opera',component:Opera_log,name:'系统操作日志'},
//			{path:'/log/login',component:Login_log,name:'账户登录日志'}
//		]
//	},
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
  ]
})

export default router

