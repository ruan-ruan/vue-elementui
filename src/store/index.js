import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {base} from '@/api/api'
import *as types from '@/api/types'

Vue.use(Vuex)



const store = new Vuex.Store({
    state:{
    	aside:JSON.parse( sessionStorage.getItem('asideList') ),
    	token:sessionStorage.getItem('token'),
    	//用户的数据的密码和账号
    	user:{
    		name:'',
    		psd:'',
    		token:'',
        },
        message:0,
    	//获取角色里面的数据
        roles : [],
        //保存骨干位置节点的编辑的时候，所选数据的复制
        unknown_editForm:{},
        //角色的编辑的时候，将主页面的点击的数据保存在仓库，以便于在编辑的手使用
        editRoel:{},
        //租户标识
        tenantData:[],
        node_id:'', //拓扑节点id
        nodeID:"",//直接赋值 
        linkObj:{},
        filters:{},//接收拓扑图的默认的数据
        statusname:false,
    },
    mutations:{
    	setAside(state,data){
    		state.aside =data;
//  		console.log(data)
    	},
    	setRole(state,msg){
    		state.roles=msg
    	},
		[types.LOGIN]: (state, data) => {
//			sessionStorage.setItem('token',data)
            sessionStorage.token = data;
            state.token = data;
            
        },
        [types.LOGOUT]: (state) => {
        	sessionStorage.removeItem("user");
          	sessionStorage.removeItem("asideList");
            state.token = null;
            state.aside=null;
            
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        },
		newAuthor(state,msg){//拓扑图点击节点的时候详情
            state.node_id = msg
       },
       sendLink(state,msg){//拓扑图点击链路的详情
       		state.linkObj=msg;
       },
    },
    actions:{
    	setRoles({commit,state},msg){
    		commit('setRole',msg)
    	},
    },
})

export default store