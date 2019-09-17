
/**选择title*/
export function generateTitle(title){
	const haskey=this.$te('route.'+title);
	const translatedTitle=this.$t('route'+title);
	if(haskey){
		return translatedTitle
	}
	return title
}

//export function generateSkinColor(color)
