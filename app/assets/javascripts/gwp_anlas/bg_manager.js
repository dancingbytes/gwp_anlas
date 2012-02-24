/*---------------------------------------------------------------------------
 * BgManager
 *-------------------------------------------------------------------------*/
var BgManager = function(target) {

  if (target) {
		this.init(target);
	}

}; // BgManager

BgManager.prototype = {

	init: function(t) {

		this.target = t;
		t.on("render", this.onRender, this);

	}, // init

	set: function(o) {

		o = o || {};
		return this.setImage(o.url)
			.setRepeat(o.repeat)
			.setPosition(o.top, o.left)
			.setSize(o.size)
			.setColor(o.color);

	}, // set

	reset: function() {}, // reset

	setImage: function(url) {

		if (url && url != '') {
			this.el.applyStyles("background-image: url('" + url + "')");
		}
		return this;

	}, // setImage

	setRepeat: function(v) {

		var r = ["no-repeat", "repeat", "repeat-x", "repeat-y"];
		if (!v || r.indexOf(v) == -1) { v = r[0]; }

		this.el.applyStyles("background-repeat: " + v);
		return this;

	}, // setRepeat

  setPosition: function(top, left) {

		top = top || "center";
		left = left || "center";

		this.el.applyStyles("background-position: " + top + " " + left);
		return this;

	}, // setPosition

	setSize: function(v) {

		var r = ["auto", "cover", "contain"];
		if (!v || r.indexOf(v) == -1) { v = r[0]; }

		this.el.applyStyles("background-size: " + v);
		return this;

	}, // setSize

	setColor: function(v) {

		v = v || "transparent";
		this.el.applyStyles("background-color: " + v);
		return this;

	}, // setColor

	onRender: function() {

		this.el = this.target.getWrap();
		return this;

	} // onRender

}; // BgManager