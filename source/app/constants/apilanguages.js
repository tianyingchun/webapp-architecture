/**
 * Define global Error code contants
 */
(function (ns) {
	var apilanguages = [
		"java",
		"csharp",
		"node"
	];
	ns.ApiLanguage ={
		languages: apilanguages,
		storageKey:"apiLanguage"
	};
})(window)