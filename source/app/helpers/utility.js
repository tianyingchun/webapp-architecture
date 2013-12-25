(function(win){
	var _utility = {
		formatFileSize: function(size) {
            var sizeUnit = ["Byte", "KB", "MB", "GB"];
            for (var index = 0; size > 1024; index++){
                size = (size / 1024).toFixed(2);
            }

            return size.toLocaleString() + " " + sizeUnit[index];
        },
        /**
         * escapeHtml 
         * @param  {string} string
         */
        escapeHtml: function(string) {
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };
            return String(string).replace(/[&<>"'\/]/g, function (s) {
               return entityMap[s];
            });
        }
	};
	win.utility = _utility;
})(window);