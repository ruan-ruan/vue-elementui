<template>
	<div>
		<el-tabs v-model='activeName'  >
			<el-tab-pane label='区域' name='first'>
				<Area ></Area>
			</el-tab-pane>
			<el-tab-pane label='城市' name='second'>
				<City ></City>
			</el-tab-pane>
			<el-tab-pane label='数据中心' name='third'>
				<Data ></Data>
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
		}
		
	},
};
</script>

<style scoped>

</style>