<template>
	<div>
		<!--<span>{{$t('message.select')}}</span>-->
		<el-tabs v-model='activeName' @tab-click="handleClick">
			<el-tab-pane :label='$t("physicalPosition.tab.area")' name='first' v-if='areaVal'>
				<Area v-if='activeName=="first"'></Area>
			</el-tab-pane>
			<el-tab-pane :label='$t("physicalPosition.tab.city")' name='second' v-if='cityVal'>
				<City v-if='activeName=="second"'></City>
			</el-tab-pane>
			<el-tab-pane :label='$t("physicalPosition.tab.data")' name='third' v-if='dataVal'>
				<Data v-if='activeName=="third"'></Data>
			</el-tab-pane>		
		</el-tabs>
	</div>
</template>

<script>

import City from '@/views/nav1/tabs/City'
import Area from '@/views/nav1/tabs/Area'
import Data from '@/views/nav1/tabs/Data'
export default {
	components:{
		City,
		Area,
		Data
	},
	data(){
		return{
			activeName:'first',
			tabsData:[],//返回对应的列表   数据需要进一步的处理
			areaVal:this.recursion( this.$store.state.aside , 'physicalPosition.tab.area').show,//根据后台返回的权限列表找到对应的状态  来控制显示和隐藏
			cityVal:this.recursion( this.$store.state.aside , 'physicalPosition.tab.city').show,
			dataVal:this.recursion( this.$store.state.aside , 'physicalPosition.tab.data').show,
		}
		
	},

	methods:{
		handleClick(tab) {
			this.activeName=tab.name;
        }
	}
};
</script>

<style scoped>

</style>