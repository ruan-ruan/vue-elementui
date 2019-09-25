<template>
	<div>
		<el-tabs v-model='activeName' @tab-click="handleClick">
			<el-tab-pane label='区域' name='first'>
				<Area v-if='activeName=="first"'></Area>
			</el-tab-pane>
			<el-tab-pane label='城市' name='second'>
				<City v-if='activeName=="second"'></City>
			</el-tab-pane>
			<el-tab-pane label='数据中心' name='third'>
				<Data v-if='activeName=="third"'></Data>
			</el-tab-pane>		
		</el-tabs>
	
	</div>
</template>

<script>
import util from "../../common/util";

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
//			name:'first'
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