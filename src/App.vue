<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->    	
    	<transition name='fade' mode='out-in'></transition>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/


body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}
.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}
.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}
.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
