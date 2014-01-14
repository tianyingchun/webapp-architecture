enyo.depends(
	"$lib/layout",
	"$lib/onyx",
	// universal mobile app engine infrustrures
	"$lib/engine",
	// for text editor libaray.
	"$lib/markitup",
	// for highlight plugin.
	"$lib/highlight",
	// put locale on the front cause of the widget maybe contains locale
	"locale/",
	// universal widgets for app.
	"$lib/widgets",
	// current app themes.
	"$lib/theme",
	// keep config as before of all customized logics 
	"config/",
	// --------other resource files depends---------//
	"app/",
	"boot/"
);