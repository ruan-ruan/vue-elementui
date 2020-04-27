

import Vue from 'vue'
import Router from 'vue-router'
//登录
import Login from '@/views/Login.vue'
//未找到
import NotFound from '@/views/404.vue'
//主组件
import Home from '@/views/Home.vue'

import Topology from'@/views/nav1/Topology'

import parent from '@/views/parent'
Vue.use(Router)

var router = new Router({
	mode:'history',
	routes:[
		{
	        path: '/login',
	        component:Login,
	        name:'',
	        hidden: true,
	        leaf:false,
	        meta:{
	        	name:'登录',
	        }
	    },
	    {
	    	path: '/change',
	        component: Home,
	        name:"",
	        hidden: true,
	        meta:{
	        	requireAuth:true,
	        	name:'修改'
	        },
	        children:[
	        	{path:'/changepassword', component: () => import ('@/components/changePsw'),name:'aside.changePsd', leaf:true,meta:{name:'修改密码'}}
	        ]
	    },
	    {
	        path: '/404',
	        component: NotFound,
	        name: '',
	        hidden: true,
	        meta:{
	        	name:'未找到',
	        }
		},
		{		
			path: '/',
			component: Home,
			name: 'aside.myself',
			iconCls: require('@/assets/images/aside/myself.png'),
			leaf:false,
			hidden:false,
			meta:{
				requireAuth:true,
				name:'个人中心',
			},
			children: [
				//站内信
				{path:'/message',component: () => import ('@/views/parent'), name: 'aside.standLetter',leaf:false,meta:{requireAuth:true,name:'站内信'},
				children:[
					{path:'/message/unreadMessage',component: () => import ('@/views/message/unreadMessage'), name: 'aside.unMessage',leaf:true,meta:{requireAuth:true,name:'未知消息'}},
					{path:'/message/allMessage',component: () => import ('@/views/message/allMessage'), name: 'aside.allMessage',leaf:true,meta:{requireAuth:true,name:'全部消息'} }, 
					//  查看组网
//					{path:'/resource/virtualLine/pointsTos-see',component: () => import ('@/views/resources/pointsTos'), name: 'aside.virtualSpecial',leaf:true,meta:{ requireAuth:true, name:'虚拟组网'},},
					// 查看点到点
				]},
				//个人资料部分  待开发
				{path:'/personal',component: () =>import ('@/views/message/personal'),name:'aside.personal',leaf:true ,meta:{requireAuth:true,name:'个人资料'}}
			] 
		},
		{
	        path: '/',//骨干节点
	        component: Home,
			name:'aside.backManage',
	        iconCls: require('../assets/images/aside/backbone.png'),//图标样式class    
	        hidden:false,
	        leaf:false,
	        meta:{
	        	requireAuth:true,
	        	name:'骨干管理',
	        },
	        children: [
				{path:"/topology",component:Topology,name:'aside.topoView',leaf:true, meta:{ requireAuth:true, name:'拓扑视图' }},
				{path:"/topology/charts",component:() => import ('@/components/multCharts.vue'),name:'aside.LinkCharts',leaf:true,hidden:true,meta:{  requireAuth:true,name:'拓扑图表详情'  }},//topo的图表详情
				{path:'/location/position',component:() => import ('@/views/nav1/Table.vue'),name:'aside.physicalLocation',leaf:true, meta:{requireAuth:true,name:'物理位置'}},
				{path:'/backManage',component:() => import('@/views/parent'),name:'aside.nodeManage',leaf:false,meta:{ requireAuth:true, name:'节点管理'},
				children:[
					{path:'/location/backbone',component:() => import('@/views/nav1/Form.vue'),name:'aside.backNode',leaf:false,hidden:false, meta:{requireAuth:true,name:'骨干节点'}},
				]},
				//骨干节点的详情的界面路由和链路里面的A，Z端的节点的详情
				{path:'/location/index/unknown/nodedetails',component:() => import('@/views/nav1/node/details/Details'),name:'aside.nodeDetails',hidden:true,leaf:true ,meta:{ requireAuth:true, name:'节点详情'},},
				//骨干节点的编辑界面的路由
				{path:'/location/index/editForm',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.nodeEditor',hidden:true,leaf:true,meta:{ requireAuth:true, name:'节点编辑'},},
				//骨干的未知节点的编辑部分
				{path:'/location/index/unknown_editForm',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.unknown',hidden:true,leaf:true,meta:{ requireAuth:true, name:'未知节点编辑'},},
				//骨干的未知节点的添加部分
				{path:'/location/index/unknown_add',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.addUnknown',hidden:true,leaf:true,meta:{ requireAuth:true, name:'未知节点添加'},},
				//骨干的未知节点的详情部分
				{path:'/location/index/unknown_details',component:() => import('@/views/nav1/node/details/child/node'),name:'aside.unknownDetails',hidden:true,leaf:true,meta:{ requireAuth:true, name:'未知节点详情'},},
				
				{path:'/linkManage',name:'aside.lineManage',component: () => import('@/views/parent'),redirect:'user',hidden:false,leaf:false,meta:{ requireAuth:true, name:'链路管理'},
				children:[
					{path:'/location/line/link',component:() => import('@/views/nav1/user.vue'),name:'aside.line',leaf:true,meta:{ requireAuth:true, name:'链路'}, },
					{path:'/location/line/cloun',component:() => import('@/views/nav1/line/cloun.vue'),name:'aside.cloudLine',leaf:true,meta:{ requireAuth:true, name:'云对接'},},
				]},
				//云对接操作部分
				{path:'/location/line/addcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'aside.addCloud',hidden:true,leaf:true,meta:{ requireAuth:true, name:'云对接添加'},},
				{path:'/location/line/editcloun',component:() => import('@/views/nav1/line/clounFile/addCloun.vue'),name:'aside.cloudLineEdit',hidden:true,leaf:true,meta:{ requireAuth:true, name:'云对接编辑'},},
				{path:'/location/line/clounDetails',component:() => import('@/views/nav1/line/clounFile/clounsTab.vue'),name:'aside.cloudLineDeta',hidden:true,leaf:true,meta:{ requireAuth:true, name:'云对接详情'},},
	        ]
	    },
	    {		
	        path: '/',
	        component: Home,
	        name: 'aside.resourcesManage',
	        iconCls: require('../assets/images/aside/resource.png'),
	        leaf:false,
	        meta:{
	        	requireAuth:true,
	        	name:'资源管理'
	        },
	        children: [

				{ path: '/resource/port', component: () => import ('@/views/resources/port.vue'), name: 'aside.logicManage',leaf:true, meta:{ requireAuth:true, name:'逻辑口管理'},},
				//逻辑端口的创建
				{ path: '/resource/add/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: 'aside.creatLogic',leaf:true,hidden:true,meta:{ requireAuth:true, name:'创建逻辑口'},},
				//逻辑端口的编辑
				{ path: '/resource/edit/logicalPort', component: () => import ('@/views/resources/details/logicalPort.vue'), name: 'aside.editLogic',leaf:true,hidden:true,meta:{ requireAuth:true, name:'编辑逻辑口'},},
				//逻辑端口的详情的界面
				{ path: '/resource/see/logicalPort', component: () => import ('@/views/resources/details/logicalDetails.vue'), name: 'aside.logicDetails',leaf:true,hidden:true,meta:{ requireAuth:true, name:'逻辑口详情'},},
				//虚拟专线
				{path:'/resource/virtualLine',component: () => import ('@/views/parent'), name: 'aside.virtual',leaf:false,meta:{ requireAuth:true, name:'虚拟专线'}, children:[
					{path:'/resource/virtualLine/pointTo',component: () => import ('@/views/resources/pointTo'), name: 'aside.pointSpecial',leaf:true,meta:{ requireAuth:true, name:'点到点'},},
					{path:'/resource/virtualLine/pointsTos',component: () => import ('@/views/resources/pointsTos'), name: 'aside.virtualSpecial',leaf:true,meta:{ requireAuth:true, name:'虚拟组网'},},
				]},
				{path:'/resource/virtualLine/pointdetails',component: () => import ('@/views/resources/virtualDetails/poinDetail'), name: 'aside.pointSpecialDeta',leaf:true,hidden:true,meta:{ requireAuth:true, name:'点到点详情'},},
				//路径调整
				{path:'/resource/seletPath',component: () => import ( '@/views/resources/virtualDetails/pointsDetails/selectPath') ,name :'路径调整',leaf:true,hidden:true, }
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
	        	requireAuth:true,
	        	name:'业务开通'
	        },
	        children: [
	            { path: '/business/open', component:parent , name: 'aside.pointsTo',leaf:false,meta:{ requireAuth:true, name:'点到点互联'}, children:[
	            	{path:'/business/point/dataInter',component:() => import ('@/views/business/pointTo/dataInterconnection'),name:'aside.dataCenterInter',leaf:true,meta:{ requireAuth:true, name:'点到点'},},
	            	{path:'/business/point/dataCloun',component:() => import ('@/views/business/pointTo/dataToCloun'),name:'aside.dataCenterCloud',leaf:true,meta:{ requireAuth:true, name:'点到云'},},
	            	{path:'/business/point/clounInter',component:() => import ('@/views/business/pointTo/clounsInterconnection'),name:'aside.cloudInter',leaf:true,meta:{ requireAuth:true, name:'云到云'},},
	            	
	            ] },
	            { path: '/business/multipoint', component:() => import ('@/views/business/multi/multiPoint') , name: 'aside.pointsMultiInter',leaf:true,meta:{ requireAuth:true, name:'点到多点'},},
	            //点到多点的编辑
	            { path: '/business/editMultipoint', component:() => import ('@/views/business/multi/multFile/editMultipoint') , name: 'aside.virtualNetEdit',leaf:true,hidden:true,meta:{ requireAuth:true, name:'点到多点编辑'},},
	            { path: '/business/detailsMultipoint', component:() => import ('@/views/business/multi/multFile/detailsTab') , name: 'aside.virtualNetDeta',leaf:true,hidden:true,meta:{ requireAuth:true, name:'点到多点详情'},},     
	        ]
	    },
	
	    {
	    	path:'/',
	    	component:Home,
	    	name:'aside.tenantManage',
	    	iconCls:require('../assets/images/aside/tenant.png'),
	    	 leaf:false,
	    	 meta:{
	        	requireAuth:true,
	        	name:'租户管理'
	        },
	    	children:[
	    		{path:'/customer/cus',component:() => import ('@/views/customer/Customer'),name:'aside.tenantList',leaf:true,meta:{ requireAuth:true, name:'租户列表'},},
	    		//租户添加
	    		{path:'/customer/addCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'aside.addTenant',leaf:true,hidden:true,meta:{ requireAuth:true, name:'添加租户'},},
	    		//租户的编辑
	    		{path:'/customer/editCus',component:() => import ('@/views/customer/Details/cusOperation'),name:'aside.editTenant',leaf:true,hidden:true,meta:{ requireAuth:true, name:'编辑租户'},},
	    		{path:'/customer/details/tenant',component:() => import ('@/views/customer/Details/tenant'),name:'aside.detaTenant',leaf:true,hidden:true,meta:{ requireAuth:true, name:'租户详情'},},
	
	    	]
	    },
	    {
	    	path:'/',
	    	component:Home,
	    	name:'aside.accountManage',
	    	iconCls:require('../assets/images/aside/account.png'),
	    	leaf:false,
	    	meta:{
	        	requireAuth:true,
	        	name:'账户管理'
	        },
	    	children:[
	    			{path:'/account',component:() => import('@/views/account/Role'),name:'aside.peopleRole',leaf:true,meta:{ requireAuth:true, name:'人员角色'},},
	    			//角色的添加
	    			{path:'/account/roles/add',component:() => import('@/views/account/add/roles'),name:'aside.addRole',hidden:true,meta:{ requireAuth:true, name:'角色添加'},},
	    			//角色的详情
	    			{path:'/account/roles/details',component:() => import('@/views/account/add/roles'),name:'aside.roleDetails',hidden:true,meta:{ requireAuth:true, name:'角色详情'},},
	    			//角色编辑
	    			{path:'/account/roles/editForm',component:() => import('@/views/account/add/roles'),name:'aside.roleEditor',hidden:true,meta:{ requireAuth:true, name:'角色编辑'},},
	    			
	    			{path:'/account/set',component:() => import('@/views/account/Set'),name:'aside.peopleSet',leaf:true,meta:{ requireAuth:true, name:'人员设置'},}
	    	]
	    }, 
	    {
	        path: '*',
	        hidden: true,
	        redirect: { path: '/404' }
	    },

	]
})


export default router;


