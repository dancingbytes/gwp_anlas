/*---------------------------------------------------------------------------
 * TaskButtonBarButton
 *-------------------------------------------------------------------------*/
var TaskButtonBarButton = Ext.extend(Ext.Component, {

  buttonSelector 	: "button:first-child",
  pressed : false,

  initComponent : function() {

    TaskButtonBarButton.superclass.initComponent.call(this);

    this.addEvents(
      'click',
      'mouseover',
      'mouseout'
    );

  }, // initComponent

  onRender : function(ct, position) {

    this.template = this.template || new Ext.Template(
      '<div unselectable="on">',
        '<div class="x-btn-wrap {0}">',
          '<button type="button">&nbsp;</button>',
        '</div>',
      '</div>'
    );

    if (position) {
      this.el = this.template.insertBefore(position, [this.buttonCls], true);
    } else {
      this.el = this.template.append(ct, [this.buttonCls], true);
    }
    this.el.addClass("x-btn");

    var btnEl = this.el.child(this.buttonSelector);
    btnEl.on({
      'focus' : this.onFocus,
      'blur'  : this.onBlur,
      'click' : this.onClick,
      scope: this
    });

    this.btnEl = btnEl;

    if (this.id) {

      var d = this.el.dom,
          c = Ext.Element.cache;

      delete c[d.id];
      d.id = this.el.id = this.id;
      c[d.id] = this.el;

    }

    if (this.tabIndex !== undefined) {
      btnEl.dom.tabIndex = this.tabIndex;
    }

    if (this.tooltip) {
      if (typeof this.tooltip == 'object') {
        Ext.QuickTips.register(Ext.apply({
          target: btnEl.id
        }, this.tooltip));
      } else {
        btnEl.dom[this.tooltipType] = this.tooltip;
      }
    }

    if (this.pressed) {
      this.el.addClass("x-btn-pressed");
    }

    if (this.cls) {
      this.el.addClass(this.cls)
    }

    this.el.on({
      'mouseover': this.onMouseOver,
      'mousedown': this.onMouseDown,
      scope: this
    })

    this.el.setSize(this.width || 'auto', this.height || 'auto');

    Ext.ButtonToggleMgr.register(this);

  }, // onRender

  setHandler : function(handler, scope){

    this.handler = handler;
    this.scope = scope;

  }, // setHandler

  focus : function() {
    this.btnEl.focus();
  }, // focus

  onDisable : function() {
    this.onDisableChange(true);
  }, // onDisable

  onEnable : function() {
    this.onDisableChange(false);
  }, // onEnable

  onDisableChange : function(disabled) {

    if (this.el) {
      if (!Ext.isIE6) {
        this.el[disabled ? 'addClass' : 'removeClass'](this.disabledClass);
      }
      this.el.dom.disabled = disabled;
    }
    this.disabled = disabled;

  }, // onDisableChange

  onClick : function(e) {

    if (e) { e.preventDefault(); }
    if (e.button != 0 || this.disabled) { return; }

    this.fireEvent("click", this, e);
    if (this.handler) {
      this.handler.call(this.scope || this, this, e);
    }

  }, // onClick

  onMouseOver : function(e) {

    if (this.disabled) { return; }

    var internal = e.within(this.el,  true);
    if (!internal) {

      this.el.addClass("x-btn-over");
      if (!this.monitoringMouseOver) {
        Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
        this.monitoringMouseOver = true;
      }
      this.fireEvent('mouseover', this, e);
    }

  }, // onMouseOver

  monitorMouseOver : function(e) {

    if (e.target != this.el.dom && !e.within(this.el)) {

      if (this.monitoringMouseOver) {
        Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
        this.monitoringMouseOver = false;
      }
      this.onMouseOut(e);

    } // if

  }, // monitorMouseOver

  onMouseOut : function(e){

    var internal = e.within(this.el) && e.target != this.el.dom;
    this.el.removeClass("x-btn-over");
    this.fireEvent('mouseout', this, e);

  }, // onMouseOut

  onFocus : function(e){

    if (!this.disabled) {
      this.el.addClass("x-btn-focus");
    }

  }, // onFocus

  onBlur : function(e){
    this.el.removeClass("x-btn-focus");
  }, // onBlur

  getClickEl : function(e, isUp) {
    return this.el;
  }, // getClickEl

  onMouseDown : function(e) {

    if (!this.disabled && e.button == 0) {
      this.getClickEl(e).addClass("x-btn-click");
      Ext.getDoc().on('mouseup', this.onMouseUp, this);
    }

  }, // onMouseDown

  onMouseUp : function(e){

    if (e.button == 0) {
      this.getClickEl(e, true).removeClass("x-btn-click");
      Ext.getDoc().un('mouseup', this.onMouseUp, this);
    }

  }, // onMouseUp

  beforeDestroy: function() {

    if (this.btnEl) {

      if (typeof this.tooltip == 'object') {
        Ext.QuickTips.unregister(this.btnEl);
      }
      Ext.destroy(this.btnEl);

    } // if

    TaskButtonBarButton.superclass.beforeDestroy.call(this);

  }, // beforeDestroy

  onDestroy : function() {

    Ext.getDoc().un({
      'mouseover' : this.monitorMouseOver,
      'mouseup'   : this.onMouseUp,
      scope: this
    });

    if (this.rendered) {
      Ext.ButtonToggleMgr.unregister(this);
    }

    TaskButtonBarButton.superclass.onDestroy.call(this);

  } // onDestroy

}); // TaskButtonBarButton

/*---------------------------------------------------------------------------
 * TaskButtonBar
 *-------------------------------------------------------------------------*/
var TaskButtonBar = Ext.extend(Ext.BoxComponent, {

  cls:            'icon-pad',
  height:         40,
  scrollDuration: 0.35,

  initComponent : function() {

    TaskButtonBar.superclass.initComponent.call(this);
    this.items = new Ext.util.MixedCollection(false, function(o) {
      return o.itemId();
    });

    this.on("resize", this.delegateUpdates, this);

  }, // initComponent

  onRender : function(ct, position) {

    var el = document.createElement("div");
    ct.dom.insertBefore(el, position);
    this.el = Ext.get(el);

    this.stripWrap = this.el.createChild({
      cls: this.cls + '-strip-wrap'
    });

    this.strip = this.stripWrap.createChild({
      tag: 'ul',
      cls: this.cls + '-strip'
    });

    this.edge = this.strip.createChild({
      tag: 'li',
      cls: this.cls + '-strip-edge'
    });
    TaskButtonBar.superclass.onRender.call(this, ct, position);

  }, // onRender

  afterRender: function() {

    TaskButtonBar.superclass.afterRender.apply(this, arguments);
    if (this.buttons) {
      this.add.apply(this, this.buttons);
      delete this.buttons;
    }

  }, // afterRender

  add: function() {

    if (!this.rendered) {
      this.buttons = arguments;
      return [];
    }

    var a = arguments, l = a.length;
    var buttons = [], li, c, btn;
    for(var i = 0; i < l; i++) {

      c = (a[i].owner ? a[i].owner.controller : null) || 'unknown';

     btn = this.items.key(c);

  	 if ( btn ) {
  	    btn.addSlice(a[i]);
  	 } else {

        li = this.strip.createChild({tag:'li'}, this.edge);
        btn = new IconButton(a[i]);
        btn.on("destroy", this.items.remove, this.items);

        btn.render(li);
        this.items.add(btn);

      }
      this.setActiveButton(btn);
      buttons.push(btn);

    }
    return buttons;

  }, // add

  setActiveButton : function(btn) {

    this.activeButton = btn;
    this.delegateUpdates();
    return btn;

  }, // setActiveButton

  scrollToButton : function(item) {

    var el = item.ownerCnt;
    if (!el) { return; }

    var pos = this.getScrollPos(),
        area = this.getScrollArea();

    var left = el.getOffsetsTo(this.stripWrap)[0] + pos;
    var right = left + el.dom.offsetWidth;
    if (left < pos) {
      this.scrollTo(left);
    } else if (right > (pos + area)) {
      this.scrollTo(right - area);
    }

  }, // scrollToButton

  scrollTo : function(pos) {
    this.stripWrap.scrollTo('left', pos, this.getScrollAnim());
  }, // scrollTo

  getScrollWidth : function() {
    return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
  }, // getScrollWidth

  getScrollPos : function() {
    return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
  }, // getScrollPos

  getScrollArea : function() {
    return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
  }, // getScrollArea

  getScrollAnim : function() {

    return {
      duration: this.scrollDuration,
      callback: this.updateScrollButtons,
      scope: this
    };

  }, // getScrollAnim

  delegateUpdates: function() {

    if (this.rendered) {
      this.autoScroll();
    }

  }, // delegateUpdates

  autoScroll: function() {

    if (this.items.getCount() == 0) { return; }

    var ow    = this.el.dom.offsetWidth,
        tw    = this.el.dom.clientWidth,
        wrap  = this.stripWrap,
        cw    = wrap.dom.offsetWidth,
        pos   = this.getScrollPos(),
        l     = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

    wrap.setWidth(tw);

    if (l <= tw) {

      wrap.dom.scrollLeft = 0;
      if (this.scrolling) {

        this.scrolling = false;
        this.el.removeClass(this.cls + '-scrolling');
        Ext.destroy(this.scrollLeft, this.scrollRight);
        this.scrollLeft = null;
        this.scrollRight = null;

      }

    } else {

      if (!this.scrolling) {

        this.el.addClass(this.cls + '-scrolling');
        if (!this.scrollLeft) {
          this.createScrollers();
        }

      } // if

      tw -= wrap.getMargins('lr');
      wrap.setWidth(tw);

      this.scrolling = true;
      if (pos > (l-tw)) {
        wrap.dom.scrollLeft = l-tw;
      } else {
        this.scrollToButton(this.activeButton);
      }
      this.updateScrollButtons();

    } // if

  }, // autoScroll

  createScrollers : function() {

    this.scrollLeft = this.scrollLeft || new TaskButtonBarButton({
      cls: this.cls + '-scroller-left',
      buttonCls: this.cls + '-arrow-left',
      handler: this.onScrollLeft,
      scope: this,
      width: 20,
      height: this.height,
      renderTo: this.el
    });

    this.scrollRight = this.scrollRight || new TaskButtonBarButton({
      cls: this.cls + '-scroller-right',
      buttonCls: this.cls + '-arrow-right',
      handler: this.onScrollRight,
      scope: this,
      width: 20,
      height: this.height,
      renderTo: this.el
    });

  }, // createScrollers

  updateScrollButtons: function() {

    var pos = this.getScrollPos();
    if (this.scrollLeft) {
      this.scrollLeft.onDisableChange( (pos == 0) );
    }

    if (this.scrollRight) {
      this.scrollRight.onDisableChange( (pos >= (this.getScrollWidth()-this.getScrollArea())) );
    }

  }, // updateScrollButtons

  onScrollLeft: function() {

    var pos = this.getScrollPos(),
        target = 0,
        lp;

    this.items.each(function(item) {

      lp = item.ownerCnt.getOffsetsTo(this.stripWrap)[0];
      if (lp < 0) {
        target = lp;
      } else {
        return false;
      }

    }, this);

    var s = Math.max(0, pos + target);
    if ( s != pos ) {
      this.scrollTo(s);
    }

  }, // onScrollLeft

  onScrollRight: function() {

    var sw = this.getScrollWidth(),
        sa = this.getScrollArea(),
        pos = this.getScrollPos(),
        target = 0,
        lp;

    this.items.each(function(item) {

      lp = item.ownerCnt.getOffsetsTo(this.stripWrap)[0];
      lp += item.ownerCnt.dom.offsetWidth;
      if (sw - lp > sa) {
        target = lp;
      } else {
        return false;
      }

    }, this);

    var s = Math.min(sw-sa, pos + sa - target);
    if ( s != pos ) {
      this.scrollTo(s);
    }

  }, // onScrollRight

  onDestroy : function() {

    Ext.destroy(
      this.scrollLeft,
      this.scrollRight,
      this.edge,
      this.stripWrap,
      this.wrap
    );
    TaskButtonBar.superclass.onDestroy.call(this);

  } // onDestroy

}); // TaskButtonBar