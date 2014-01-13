enyo.kind({
	name: "Master.models.menu.MenuItem",
	kind: "Master.Model",
	attributes:{
		name: "",
		customClass:"",
		hash: "",
		key: "list", // menu item key.
	},
	// note: override the parse function.
	parse: function (data, options) {
		return  {
			name: data.name,
			customClass: data.customClass,
			hash: data.hash,
			key: data.key
		};
	}
});