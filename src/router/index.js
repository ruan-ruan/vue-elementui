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
		name: '个人中心',
		iconCls: require('../assets/images/aside/myself.png'),
		leaf:false,
		meta:{
			requireAuth:true
		},
		children: [
			//站内信
			{path:'/message',component: () => import ('@/views/parent'), name: '站内信',leaf:false,children:[
				{path:'/message/unreadMessage',component: () => import ('@/views/message/unreadMessage'), name: '未读消息',leaf:true},
				{path:'/message/allMessage',component: () => import ('@/views/message/allMessage'), name: '全部消息',leaf:true}
			]}
			
		]
	},
	{
        path: '/',
        component: Home,
		name:'骨干管理',
        iconCls: require('../assets/images/aside/backbone.png'),//图标样式class    
        leaf:false,
        meta:{
        	requireAuth:true
        },
        children: [
			{path:"/topology",component:Topology,name:'拓扑视图',leaf:true,},
			{path:"/topology/charts",component:() => import ('@/components/multCharts.vue'),name:'',leaf:true,hidden:true},//topo的图表详情
			{path:'/location/area',component:() => import ('@/views/nav1/Table.vue'),name:'物理位置',leaf:true,},
			{path:'/location',component:() => import('@/views/parent'),name:'节点管理',leaf:false,
			children:[
			{path:'/location/backbone',component:() => import('@/views/nav1/Form.vue'),name:'骨干节点',leaf:false, },
			
			]},
			//骨干节点的详情的界面路由和链路里面的A，Z端的节点的详情
			{path:'/location/index/unknown/nodedetails/:id',component:() => import('@/views/nav1/node/details/Details'),name:'节点详情',hidden:true,leaf:true},

			//骨干节点的编辑界面的路由
			{path:'/location/index/editForm',component:() => import('@/views/nav1/node/details/child/node'),name:'节点编辑',hidden:true,leaf:true},
			//骨干的未知节点的编辑部分
			{path:'/location/index/unknown_editForm/:unknownEditID',component:() => import('@/views/nav1/node/details/child/node'),name:'未知节点编辑',hidden:true,leaf:true},
			//骨干的未知节点的添加部分
			{path:'/location/index/unknown_add',component:() => import('@/views/nav1/node/details/child/node'),name:'添加未知节点',hidden:true,leaf:true},
			//骨干的未知节点的详情部分
			{path:'/location/index/unknown_details/:unknownID',component:() => import('@/views/nav1/node/details/child/node'),name:'未知节点详情',hidden:true,leaf:true},
			
			{path:'/location/',name:'链路管理',component: () => import('@/views/parent'),redirect:'user',hidden:false,leaf:false,

			children:[{path:'/location/line/link',component:() => import('@/views/nav1/user.vue'),name:'链路',leaf:true},
			{path:'/location/line/cloun',component:() => import('@/views/nav1/line/cloun.vue'),name:'云对接链路',leaf:true},
			]},
			//云对接的部分
			{path:'/location/line/addcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'添加云',hidden:true,leaf:true},
			{path:'/location/line/editcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'云对接编辑',hidden:true,leaf:true},
			{path:'/location/line/clounDetails',component:() => import('@/views/nav1/line/clounFile/clounsTab.vue'),name:'云对接详情',hidden:true,leaf:true},
        ]
    },
    {		
        path: '/',
        component: Home,
        name: '资源管理',
        iconCls: require('../assets/images/aside/resource.png'),
        leaf:false,
        meta:{
        	requireAuth:true
        },
        children: [
			{ path: '/resource/port', component: () => import ('@/views/resources/port.vue'), name: '逻辑口管理',leaf:true },
			//逻辑端口的创建
			{ path: '/resource/add/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: '创建逻辑端口',leaf:true,hidden:true},
			//逻辑端口的编辑
			{ path: '/resource/edit/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: '编辑逻辑端口',leaf:true,hidden:true},
			//逻辑端口的详情的界面
			{ path: '/resource/see/logicalPort', component: () => import ('@/views/resources/details/logicalDetails.vue'), name: '逻辑端口详情',leaf:true,hidden:true},
			//虚拟专线
			{path:'/resource/virtualLine',component: () => import ('@/views/parent'), name: '虚拟专线',leaf:false,children:[
				{path:'/resource/virtualLine/pointTo',component: () => import ('@/views/resources/pointTo'), name: '点到点专线',leaf:true},
				{path:'/resource/virtualLine/pointsTos',component: () => import ('@/views/resources/pointsTos'), name: '虚拟组网专线',leaf:true},

			]},
			{path:'/resource/virtualLine/pointdetails',component: () => import ('@/views/resources/virtualDetails/poinDetail'), name: '点到点详情',leaf:true,hidden:true},
			
        ]
    },
    {
        path: '/',
        component: Home,
        name: '业务开通',
        iconCls: require('../assets/images/aside/business1.png'),
//      leaf: true,//只有一个节点
 		leaf:false,
   		meta:{
        	requireAuth:true
        },
        children: [
            { path: '/business', component:parent , name: '点到点互联',leaf:false,children:[
            	{path:'/business/point/dataInter',component:() => import ('@/views/business/pointTo/dataInterconnection'),name:'数据中心互联',leaf:true},
            	{path:'/business/point/dataCloun',component:() => import ('@/views/business/pointTo/dataToCloun'),name:'数据中心到云',leaf:true},
            	{path:'/business/point/clounInter',component:() => import ('@/views/business/pointTo/clounsInterconnection'),name:'云到云互联',leaf:true},
            	
            ] },
            { path: '/business/multipoint', component:() => import ('@/views/business/multi/multipoint') , name: '点到多点互联',leaf:true,},
            //点到多点的编辑
            { path: '/business/editMultipoint', component:() => import ('@/views/business/multi/multFile/editMultipoint') , name: '虚拟组网编辑',leaf:true,hidden:true},
            { path: '/business/detailsMultipoint', component:() => import ('@/views/business/multi/multFile/detailsTab') , name: '虚拟组网详情',leaf:true,hidden:true},     
        ]
    },

    {
    	path:'/',
    	component:Home,
    	name:'租户管理',
    	iconCls:require('../assets/images/aside/tenant.png'),
    	 leaf:false,
    	 meta:{
        	requireAuth:true
        },
    	children:[
    		{path:'/customer/cus',component:() => import ('@/views/customer/Customer'),name:'租户信息列表',leaf:true,},
    		//租户添加
    		{path:'/customer/addCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'租户添加',leaf:true,hidden:true},
    		//租户的编辑
    		{path:'/customer/editCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'租户编辑',leaf:true,hidden:true},
    		{path:'/customer/details/tenant/:id',component:() => import ('@/views/customer/Details/tenant'),name:'租户详情',leaf:true,hidden:true},

    	]
    },
    {
    	path:'/',
    	component:Home,
    	name:'账户管理',
    	iconCls:require('../assets/images/aside/account.png'),
    	leaf:false,
    	meta:{
        	requireAuth:true
        },
    	children:[
    			{path:'/account',component:() => import('@/views/account/Role'),name:'人员角色',leaf:true,},
    			//角色的添加
    			{path:'/account/roles/add',component:() => import('@/views/account/add/roles'),name:'添加角色',hidden:true,},
    			//角色的详情
    			{path:'/account/roles/details/:id',component:() => import('@/views/account/add/roles'),name:'角色详情',hidden:true},
    			//角色编辑
    			{path:'/account/roles/editForm',component:() => import('@/views/account/add/roles'),name:'角色编辑',hidden:true},
    			
    			{path:'/account/set',component:() => import('@/views/account/Set'),name:'人员设置',leaf:true,}
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

