/*---------------------------------------------------------------------------
 * Shortcut
 *-------------------------------------------------------------------------*/
var Shortcut = function(config) {

  Ext.apply(this, config || {});

	this.addEvents(
	  'render',
		'destroy',
		'add',
		'remove'
	);

	this.getId();
  Ext.ComponentMgr.register(this);
  Shortcut.superclass.constructor.call(this);

  this.initComponent();

  if (this.renderTo) {
	  this.render(this.renderTo);
    delete this.renderTo;
  }

}; // Shortcut

Ext.extend(Shortcut, Ext.util.Observable, {

	default_group: 'Прочее',
  group_cls: 'column',

  cls: 'ux-shortcut-cnt',

  init: function(c) {

    c.on('render', this.render, this, { single: true });
	  c.on('destroy', this.destroy, this);
		return this;

  }, // init

  getDesktop: function() {
    return this.comp;
  }, // getDesktop

  getComponentId : function(comp){
    return comp.itemId || comp.id;
  }, // getComponentId

  initComponent : function() {
  	this.groups = new Ext.util.MixedCollection();
  }, // initComponent

	render: function(container, position) {

		if (!this.rendered && !this.el) {

      this.container = container.getEl();

      if (this.ctCls) {
				this.container.addClass(this.ctCls);
      }

      this.rendered = true;

      if (position !== undefined) {
	  		if (typeof position == 'number') {
					position = this.container.dom.childNodes[position];
        } else {
          position = Ext.getDom(position);
        }
      }

      this.onRender(this.container, position || null);

      if (this.cls) {
      	this.el.addClass(this.cls);
        delete this.cls;
      }

      if (this.style) {
		  	this.el.applyStyles(this.style);
        delete this.style;
      }

      this.fireEvent("render", this);

      var items = this.items;
      delete this.items;
      this.items = new Ext.util.MixedCollection(false, this.getComponentId);

      if (items) {
        this.add(items);
      }

      container.shortcuts = this;

    }
    return this;

	}, // render

	addClass : function(cls) {

    if (this.el) {
  		this.el.addClass(cls);
    } else {
      this.cls = this.cls ? this.cls + ' ' + cls : cls;
    }

  }, // addClass

  removeClass : function(cls) {

    if (this.el) {
      this.el.removeClass(cls);
    } else if(this.cls) {
      this.cls = this.cls.split(' ').remove(cls).join(' ');
    }

  }, // removeClass

  onRender : function(ct, position) {

  	this.el = document.createElement('div');
   	this.el.id = this.getId();
   	this.el = Ext.get(this.el);
		ct.dom.insertBefore(this.el.dom, position);

  }, // onRender

  destroy : function() {

    this.beforeDestroy();
    if (this.rendered) {
      this.el.removeAllListeners();
      this.el.remove();
      Ext.ComponentMgr.unregister(this);
      this.fireEvent("destroy", this);
      this.purgeListeners();
    }

  }, // destroy

	beforeDestroy : function() {

    if (this.items) {
      Ext.destroy.apply(Ext, this.items.items);
    }

	}, // beforeDestroy

	getEl : function() {
    return this.el;
  }, // getEl

  getId : function() {
  	return this.id || (this.id = "ext-comp-" + (++Ext.Component.AUTO_ID));
  }, // getId

  add: function(comp) {

    if (!this.rendered) {
      this.items = comp;
      return;
    }

    if (Ext.isArray(comp)) {

      for(var i = 0, len = comp.length; i < len; i++) {
        this.add(comp[i]);
      }
      return;

    }; // if

    var c = this.lookupComponent(comp);
	  var pos = this.items.length;

	  this.onBeforeAdd(c);
	  this.items.add(c);
	  c.ownerCt = this;
	  this.fireEvent('add', this, c, pos);
	  return c;

  }, // add

  lookupComponent : function(comp) {

    if (typeof comp == 'object') {
	    return new ShortcutElement(comp);
    }
    return comp;

  }, // lookupComponent

  onBeforeAdd : function(item) {

    if (item.ownerCt) {
    	item.ownerCt.remove(item);
    }
    item.on("destroy", this.remove, this);
    item.render( this.getGroup(item.getGroupName()) );

  }, // onBeforeAdd

  remove: function(comp) {

  	var c = this.getComponent(comp);
    this.items.remove(c);
    delete c.ownerCt;
    this.onAfterRemove(c);
    this.fireEvent('remove', this, c);
    return c;

  }, // remove

  onAfterRemove: function(c) {

    var name = c.getGroupName();
    var count = this.items.filterBy(function(item) {
      return (item.getGroupName() == name);
    }, this);

    if (count == 0) {
      Ext.destroy( this.groups.key(name) );
    }

  }, // onAfterRemove

  getComponent : function(comp) {

    if (typeof comp == 'object') {
		  return comp;
    }
    return this.items.get(comp);

  }, // getComponent

  getGroup: function(name) {

  	if (name == null || name == "") {
			name = this.default_group;
		}
		name = name.toLowerCase().trim();

		var group = this.groups.key(name);
		if (!group) {
      group = this.createGroup(name);
		}
		return group.body;

  }, // getGroup

  createGroup: function(name) {

    var group = this.el.createChild();

    group.unselectable();

    group.head = group.createChild({
      tag: "div",
      html: name.capitalize()
    });

    group.body = group.createChild();

    if (this.group_cls) {

      group.addClass(this.group_cls);
      group.head.addClass(this.group_cls + "-title");
      group.body.addClass(this.group_cls + "-body");

    }

    return this.groups.add(name, group);

  } // createGroup

}); // Shortcut

/*---------------------------------------------------------------------------
 * ShortcutElement
 *-------------------------------------------------------------------------*/
var ShortcutElement = Ext.extend(Ext.Button, {

  buttonSelector : 'div.box',
  clickEvent: 'dblclick',

  onRender : function(ct, position) {

    var template = new Ext.Template(
      '<div class="ux-shortcut-btn">',
        '<div class="notice">&nbsp;</div>',
        '<div class="box">&nbsp;</div>',
        '<div class="text">{0}</div>',
      '</div>'
    );

    var btn = template.append(ct, [this.text || '&#160;'], true);

    var btnEl = this.btnEl = btn.child(this.buttonSelector);
    this.initButtonEl(btn, btnEl);

    if(this.menu){
      this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
    }
    Ext.ButtonToggleMgr.register(this);

    if (this.iconCls) {
      btnEl.addClass(this.iconCls);
    }

    this.noticeEl = this.el.child("div.notice");
    this.noticeEl.hide();

    this.textEl = this.el.child("div.text");

  }, // onRender

  setText : function(text) {

    if (this.el) {
      this.btnEl.dom[this.tooltipType] = this.text = text;
      this.textEl.update(text);
    }

  }, // setText

  getGroupName: function() {
    return (this.groupName || "").toLowerCase().trim();
  }, // getGroupName

  afterRender : function(){

    Ext.Button.superclass.afterRender.call(this);
    this.updateNotice(this.notices);

  }, // afterRender

  updateNotice: function(int) {

    int = parseInt(int);
    int = isNaN(int) ? 0 : int;

    if (int < 1) {
      this.noticeEl.update(0);
      this.noticeEl.hide();
    } else {
      this.noticeEl.update(int);
      this.noticeEl.show();
    }

  }, // updateNotice

  setHandler: Ext.emptyFn,

  onFocus: Ext.emptyFn,

  onBlur: Ext.emptyFn,

  onClick : function(e) {

    if (e) {
      e.preventDefault();
    }

    if (this.disabled || e.button != 0) {
     return;
    }

    if (this.enableToggle && (this.allowDepress !== false || !this.pressed)) {
      this.toggle();
    }

    if (this.menu && !this.menu.isVisible() && !this.ignoreNextClick) {
      this.showMenu();
    }

    if (this.runApp) {
      cmd(this.runApp);
    }

  } // onClick

}); // ShortcutElement