/**
 * @class  Master.TimeoutSupport
 * @author tianyingchun@outlook.com
 * Note: use this class need mixins ClassSupport.js in each customized class.
 * provider exec task timeout.
 */
(function (enyo) {
	if (enyo.getPath("Master.TimeoutSupport")) {
		return;
	}
	enyo.setPath("Master.TimeoutSupport", {
		name: "Master.TimeoutSupport",

		timeout: 0,
		failed: false,
		startTimer: function() {
			this.startTime = enyo.perfNow();//enyo.now();
			if (this.timeout) {
				this.timeoutJob = setTimeout(this.bindSafely("timeoutComplete"), this.timeout);
			}
		},
		endTimer: function() {
			if (this.timeoutJob) {
				this.endTime = enyo.perfNow();//enyo.now();
				clearTimeout(this.timeoutJob);
				this.timeoutJob = null;
				this.latency = this.endTime - this.startTime;
				this.zLog("current task exec time: ", this.latency);
			}
		},
		timeoutComplete: function() {
			this.timedout = true;
			this.fail("timeout");
		},
		//* @public
		//* Can be called from any handler to trigger the error chain.
		fail: function(inError) {
			this.failed = true;
			this.endTimer();
			this.zLog("current task failed...", inError);
		}
	});
})(enyo);