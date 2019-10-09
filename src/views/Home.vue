<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img  :src="(collapsed?sysImg:sysName)" :class="collapsed?'':'Img_left'"/>
      </el-col>
      <el-col :span="8">
          <img :src="collapsed?asideRigth:asideLeft" class="tools asideLeft"  @click.prevent="collapse"/>
      </el-col>
      <el-col  :span="6"class="userinfo">
        <el-row>
          <el-col :span='24'>
            <el-col :span='7'>
              <span style="cursor:pointer;" @click="tapmes" v-popover:visible>消息</span>
              <el-badge
                :value="this.$store.state.message"
                :max="99"
                class="item"
              >
                <i class="el-icon-bell"></i>
              </el-badge>
            </el-col>
             <el-popover
                placement="left-start"
                ref="visible"
                title="站内消息通知列表"
                width="300"
                trigger="hover">
                <ul v-if="tableData.length>0" style="border-top:1px solid #ccc;">
                  <li style="border-top:1px solid #ccc;padding:8px 0;padding-bottom:2px;" v-for="(item,is) in tableData" :key="is">
                    <span><img
                      src="../assets/images/message/unread.png.png"
                      alt=""
                      style="width:12px;height:12px;"
                    ></span>
                    <span>{{item.content}}</span>
                    <div style="margin-top:6px;">
                      <span>{{timestamp(item.time)}}</span>
                      <span style="float:right;font-size:14px;font-weight:700;">{{item.level}}级</span>
                    </div>
                  </li>
                </ul>
                <div v-else>
                  暂无消息
                </div>
              </el-popover>
            <el-col :span='7'>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link userinfo-inner">语言</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>中文</el-dropdown-item>
                  <el-dropdown-item>English</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span='10'>
              <el-dropdown trigger="click">
                <span
                  class="el-dropdown-link userinfo-inner"
                  :title='sysUserName'
                ><img
                    :src="sysUserAvatar"
                    alt="头像"
                  /> {{sysUserName}}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                  <el-dropdown-item @click.native='psd'>修改密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-col>
    
    <el-col
      :span="24"
      class="main"
    >
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo el-menus"
          unique-opened
          router
          v-show="!collapsed"
          id="menuClass"
          background='#EEEEEE'
        >
          <template
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
          >
            <el-submenu
              :index="index+''"
              v-if="!item.leaf"
            >
              <template slot="title">
                <!-- <i :class="item.iconCls"></i> -->
                <img :src="item.iconCls" class='asideLogo'/>
                {{item.name}}</template>
              <el-menu-item-group
                v-for='(child,indexs)  in item.children'
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >
                <el-submenu
                  :index='child.path'
                  v-if='!child.leaf'
                >
                  <template
                    slot="title"
                    class="child_title"
                  ><i :class="child.iconCls"></i>{{child.name}}</template>
                  <el-menu-item
                    v-for="(sun,i)  in child.children"
                    :index="sun.path"
                    :key="sun.path"
                  >
                    {{sun.name}}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  :index="child.path"
                  v-else-if="child.leaf"
                  :key="child.path"
                > {{child.name}} </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0"
              :index="item.children[0].path"
            >
            <!-- <i :class="item.iconCls"></i> -->
            <img :src="item.iconCls" class='asideLogo'/>
            {{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul
          class="el-menu el-menu-vertical-demo collapsed"
          v-show="collapsed"
          ref="menuCollapsed"
        >
          <li
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden"
            class="el-submenu item"
          >
            <template v-if="!item.leaf">
              <div
                class="el-submenu__title"
                style="padding-left: 20px;"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
              <!-- <i :class="item.iconCls"></i> -->
              <img :src="item.iconCls" class='asideLogo'/>
            </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-'+index"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <li
                  v-for="child in item.children"
                  v-if="!child.hidden"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path==child.path?'is-active':''"
                  @click="$router.push(child.path)"
                >{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
          <li class="el-submenu">
            <div
              class="el-submenu__title el-menu-item"
              style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px; "
              :class="$route.path==item.children[0].path?'is-active':''"
              @click="$router.push(item.children[0].path)"
            >
            <!-- <i :class="item.iconCls"></i> -->
            <img :src="item.iconCls" class='asideLogo'/>
          </div>
        </li>
			</template>
		</li>
	</ul>
</aside>

<section class="content-container">
  <div class="grid-content bg-purple-light">
    <el-col
      :span="24"
      class="breadcrumb-container"
    >
      <strong class="title">{{$route.name}}</strong>
      <el-breadcrumb
        separator="/"
        class="breadcrumb-inner"
      >
        <el-breadcrumb-item
          v-for="item in $route.matched"
          :key="item.path"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col
      :span="24"
      class="content-wrapper"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view></router-view>
      </transition>
    </el-col>
  </div>
</section>


</el-col>
</el-row>
</template>

<script>
import * as types from "@/api/types";
import { base } from "@/api/api";
export default {
  data() {
    return {
      asideLeft:require('../assets/images/aside/left.png'),
			asideRigth:require('../assets/images/aside/right.png'),
      sysImg: require("../assets/images/logo.png"),
      sysName: require("../assets/images/LOG.png"),
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: require("../assets/images/touxiang.jpg"),
      //				sysLanguage:[{title:'CH'},{title:'English'}],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      cen: this.$router.options.routes,
      tableData:[]
    };
  },
  methods: {
    psd: function(row) {
      this.$confirm("确认要修改密码吗?", "提示", {})
        .then(() => {
          this.$router.push({ path: "/changepassword" });
        })
        .catch(() => {});
  },
    timestamp(timestamp){
      let timestampString = null;
      if(String(timestamp).length==10) {
        timestampString = timestamp*1000;
      }else {
        timestampString = timestamp;
      }
      var date = new Date(Number(timestampString));

      var Y = date.getFullYear() +'-';
      var M = (date.getMonth() +1<10 ?'0'+(date.getMonth() +1 +'-'):(date.getMonth()+1)+'-');
      var D = this.timeChange(date.getDate()) +'';
      var h = this.timeChange(date.getHours()) +':';
      var m = this.timeChange(date.getMinutes()) +':';
      var s = date.getSeconds();
      return Y + M + D + '  '+ h + m + this.timeChange(s);
    },
    timeChange(time){
      time = String(time);
      if(time.length ==1) {
        return '0' +time;
      }else {
        return time;
      }
    },
	tapmes(){
		this.$router.push({
			path:'/message/unreadMessage'
		})
	},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {})
        .then(() => {
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
          this.$store.commit(types.LOGOUT);
          this.$router.push({
            path: "/login"
          });
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
      var menuWidth = document.getElementById("menuClass");
      if (menuWidth.offsetWidth === 0) {
        menuWidth.style.width = "230px";
      }
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  mounted() {
    var tokenkey = sessionStorage.getItem("token");
    var user = sessionStorage.getItem("user");
    if (user) {
      this.sysUserName = user || "";
    }
    var para = {
      page: '',
      per_page: '',
      search_title: '',
      search_type: '',
      search_level: '',
      search_start_time: '',
      search_end_time: '',
    };
    this.$ajax
      .get("/public/get_news" + "?token=" + tokenkey, para)
      .then(res => {
        // console.log(res);
        if (res.status == 200) {
          if (res.data.status == 0) {
            let ress = res.data.data.items;
            let datas=[];
            ress.map(items =>{
              if(items.is_read==false) {
                datas.push(items);
              }
            })
            // console.log(datas)
            this.$store.state.message=datas.length;
            this.tableData = res.data.data.items?res.data.data.items.slice(0,5):[];
            // console.log(this.tableData)
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
/*@import '~scss_vars';*/
.el-popover__title{
  font-weight: 700;
}
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 70px;
        height: 70px;
        margin-left: -23px;
        margin-top: -7px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
      text-align: center;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
        padding: 0px 10px;
				width:30px;
				height: 30px;
				line-height: 30px;
				position: absolute;
				top: 30px;
				margin-top: -15px;
				cursor: pointer;
    }
  }
  .main {
    display: flex;

    position: absolute;
    top: 60px;
    bottom: 0px;

    overflow: auto;
    aside {
      overflow: auto;
      flex: 0 0 230px;
      width: 230px;

      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }

    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px !important;
    }

    .content-container {
      flex: 1;

      overflow-y: scroll;
      padding: 20px;

      .breadcrumb-container {
        
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
.Img_left {
  width: 140px !important;
  height: 40px !important;
  margin-left: -23px !important;
  margin-top: 11px !important;
}
.el-menu-item-group__title{
		padding-top: 0px !important;
	}
.asideLogo{
		width: 22px;
		height: 22px;
	}
</style>