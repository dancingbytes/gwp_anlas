
/*---------------------------------------------------------------------------
 * Ext.Window
 *-------------------------------------------------------------------------*/
Ext.override(Ext.Window, {

  minHeight: 200,
  minWidth:  200,

  show : function(animateTarget, cb, scope) {

    if (!this.rendered) {
      this.render(Workplace.getEl());
    }

    if (this.hidden === false) {
      this.toFront();
      return;
    }

    if (this.fireEvent("beforeshow", this) === false) {
      return;
    }

    if(cb) {
      this.on('show', cb, scope, {single:true});
    }
    this.hidden = false;

    if (animateTarget !== undefined) {
      this.setAnimateTarget(animateTarget);
    }

    this.beforeShow();
    if (this.animateTarget) {
      this.animShow();
    } else {
      this.afterShow();
    }

  }, // show

  maximize : function() {

    if (!this.maximized) {

      this.expand(false);
      this.restoreSize = this.getSize();
      this.restorePos = this.getPosition(true);

      if (this.maximizable){
        this.tools.maximize.hide();
        this.tools.restore.show();
      }
      this.maximized = true;
      this.el.disableShadow();

      if (this.dd) {
        this.dd.lock();
      }
      if (this.collapsible) {
        this.tools.toggle.hide();
      }
      this.el.addClass('x-window-maximized');
      this.container.addClass('x-window-maximized-ct');

      this.setPosition( Workplace.getEl().getAnchorXY() );
      this.fitContainer();
      this.fireEvent('maximize', this);

    } // if

  }, // maximize

  getFrameHeight : function() {

    var h = this.el.getFrameWidth('tb');
 
    h += (this.bbar ? this.bbar.getHeight() : 0);
    h += (this.header ? this.header.getHeight() : 0);
    h += (this.footer ? this.footer.getHeight() : 0);
 
    return h;

  } // getFrameHeight

}); // Ext.Window

/*---------------------------------------------------------------------------
 * Ext.Window.DD
 *-------------------------------------------------------------------------*/
Ext.Window.DD = function(win) {
    
  this.win = win;
  Ext.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD-'+win.id);
  this.setHandleElId(win.headerDragPanel.id);
  this.scroll = false;

};

Ext.extend(Ext.Window.DD, Ext.dd.DD, {

  moveOnly:true,
  headerOffsets:[100, 25],

  startDrag : function() {

    var w = this.win;
    this.proxy = w.ghost();
    var s = this.proxy.getSize();

    this.constrainTo(Workplace.getEl(), {

      right: -(s.width-this.headerOffsets[0]-40),
      bottom: -(s.height-this.headerOffsets[1]-40)

    });

  }, // startDrag

  b4Drag : Ext.emptyFn,

  onDrag : function(e){
    this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
  }, // onDrag

  endDrag : function(e){
    this.win.unghost();
    this.win.saveState();
  } // endDrag

}); // Ext.Window.DD

/*---------------------------------------------------------------------------
 * WindowManager
 *-------------------------------------------------------------------------*/
var WindowManager = Ext.extend(Ext.WindowManager, {
    
  onActive : function(win) {

    WindowManager.superclass.onActive.apply(this, arguments);

    if (win.button) {
      this.desktop.toolbar.setActiveButton(win.button);
      win.button.onActive(true);
    }

  }, // onActive

  onInactive : function(win) {

    WindowManager.superclass.onInactive.apply(this, arguments);

    if (win.button) {
      win.button.onActive(false);
    }
  
  }, // onInactive

  onMinimize : function(win) {

    WindowManager.superclass.onMinimize.apply(this, arguments);
      
    if (!win.hidden) {
      win.hide();
    }
  
  }, // onMinimize

  register : function(win) {

    WindowManager.superclass.register.apply(this, arguments);
    
    var b = this.desktop.toolbar.add({ owner: win });
    win.button = b[0];
      
  } // register

}); // WindowManager

/*---------------------------------------------------------------------------
 * Desktop
 *-------------------------------------------------------------------------*/
var Desktop = function(config) {

	Ext.apply(this, config || {});

  this.addEvents(
    'contextmenu',
    'render',
    'afterrender',
    'resize',
    'destroy'
  );

  this.getId();

  Ext.ComponentMgr.register(this);
  Desktop.superclass.constructor.call(this);

  this.initComponent();

  if (this.plugins) {

    if (Ext.isArray(this.plugins)) {

      for (var i = 0, len = this.plugins.length; i < len; i++) {
        this.plugins[i] = this.initPlugin(this.plugins[i]);
      }

    } else {
      this.plugins = this.initPlugin(this.plugins);
    }

  }; // if

  this.render(Ext.getBody());

}; // Desktop

Ext.extend(Desktop, Ext.util.Observable, {

  hideMode  : 'display',
  hidden    : false,
      
  initPlugin : function(p) {

    p.init(this);
    return p;

  }, // initPlugin

  initComponent: function() {

    if (!this.winManager) {
      this.winManager = new WindowManager(this);
    }

    this.bg = new BgManager();
    this.bg.init(this);

    this.shortcuts = new Shortcut();
    this.shortcuts.init(this);

    if (App.Shortcuts) {
      this.shortcuts.add(App.Shortcuts);
      delete App.Shortcuts;
    }

  }, // initComponent

  render : function(ct) {

    if (!this.rendered) {

    	this.rendered = true;
      this.container = ct;

      this.onRender(this.container);

      if (this.cls) {
        this.el.addClass(this.cls);
        delete this.cls;
      }

      if (this.style) {
        this.el.applyStyles(this.style);
        delete this.style;
      }

      if (this.hidden) {
        this.hide();
      }

      this.fireEvent("render", this);
      this.afterRender();

    }
    return this;

  }, // render

  onRender : function(ct) {

    if (!this.el) {

     	this.wrap = document.createElement('div');
     	this.wrap = Ext.get(this.wrap);
      ct.dom.insertBefore(this.wrap.dom, null);

      this.toolbar = new Toolbar({
        renderTo: this.wrap
      });

      this.el = document.createElement('div');
    	this.el = Ext.get(this.el);
    	this.wrap.dom.insertBefore(this.el.dom, null);

      this.el.on('contextmenu', this.onContextMenu, this);

    }

  }, // onRender

  afterRender : function() {

    this.setSize(Ext.lib.Dom.getViewWidth(), Ext.lib.Dom.getViewHeight());
  	this.bg.set(this.bgCfg);
    delete this.bgCfg;

    Ext.EventManager.onWindowResize(this.setSize, this);

    this.el.on('contextmenu', this.onContextMenu, this);

    Ext.QuickTips.init();

    cmd( document.location.hash.substr(1) );

    this.fireEvent("afterrender", this);

  }, // afterRender

  setSize: function(w, h) {

    this.wrap.setSize(w, h);
    this.onResize(w, h);
    this.fireEvent("resize", w, h);

  }, // setSize

  onResize: function(w, h) {

    h -= this.toolbar.el.getHeight();
    this.el.setSize(w, h);
    this.toolbar.setWidth(w);

  }, // onResize

  getSize: function() {
    return this.el.getSize();
  }, // getSize

  width: function() {
    return this.el.width();
  }, // width

  height: function() {
    return this.el.height();
  }, // height

  getWrap: function() {
    return this.wrap;
  }, // getWrap

  getEl : function() {
  	return this.el;
  }, // getEl

  getId : function() {
   	return this.id || (this.id = "ext-comp-" + (++Ext.Component.AUTO_ID));
  }, // getId

  onContextMenu: function(e) {

   	e.stopEvent();
 		this.fireEvent('contextmenu', this, e);

  }, // onContextMenu

  show: function() {

    this.hidden = false;
    if (this.rendered) {
      this.el.removeClass('x-hide-' + this.hideMode);
      this.fireEvent("show", this);
    }
    return this;

  }, // show

  hide: function() {

    this.hidden = true;
    if (this.rendered) {
      this.el.addClass('x-hide-' + this.hideMode);
      this.fireEvent("hide", this);
    }
    return this;

  }, // hide

  setVisible: function(visible) {

    visible ? this.show() : this.hide();
    return this;

  }, // setVisible

  isVisible : function() {
    return this.rendered && this.el.isVisible();
  }, // isVisible

  findParentBy: function(fn) {

    for (var p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
    return p || null;

  }, // findParentBy

  addClass : function(cls){

    if (this.el) {
      this.el.addClass(cls);
    } else {
      this.cls = this.cls ? this.cls + ' ' + cls : cls;
    }
    return this;

  }, // addClass

  removeClass : function(cls){

    if (this.el) {
      this.el.removeClass(cls);
    } else if(this.cls) {
      this.cls = this.cls.split(' ').remove(cls).join(' ');
    }
    return this;

  }, // removeClass

  beforeDestroy: function() {

   	Ext.destroy(
   		this.toolbar,
   		this.bg,
      this.winManager
   	);

  }, // beforeDestroy

 	destroy : function() {

    this.beforeDestroy();
    if (this.el) {
      this.el.removeAllListeners();
      this.el.remove();
  		this.el = null;
    }
    this.fireEvent("destroy", this);
    this.purgeListeners();
    Ext.ComponentMgr.unregister(this);

  } // destroy

}); // Desktop