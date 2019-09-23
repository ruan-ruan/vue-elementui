<template>
	<el-dropdown trigger='click' class='international' @command='handleSetLanguage'>
		<div>
			<nx-svg-icon class='international-icon' icon-class='language'></nx-svg-icon>
		</div>
		<el-dropdown-menu slot='dropdown'>
			<el-dropdown-item command='zh' :disabled='language==="zh"'>中文</el-dropdown-item>
			<el-dropdown-item command='en' :disabled='language==="en"'>English</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
	
	import tcSvgIcon from '@/components/tc-svg-icon/index'
	export default{
		name:'tc-lang-select',
		components:{tcSvgIcon},
		computed:{
			language(){
				return this.$store.getters.language
			}
		},,
		methods:{
			handleSetLanguage(lang){
				this.$i18n.locale=lang;
				this.$store.dispatch('setLanguage',lang);
				this.$message({
					message:'switch language success',
					type:'success'
				})
			}
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style scoped>
	.international-icon{
		font-size: 22px;
		cursor: pointer;
		vertical-align: -5px !important;
	}
	
	.el-dropdown{
		color: #5a5e66;
	}
</style>