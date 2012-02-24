/*---------------------------------------------------------------------------
 * IconButton
 *-------------------------------------------------------------------------*/
var IconButton = Ext.extend(Ext.Button, {

  delta:  5,
  width:  60,
  height: 38,
  maxSlices: 3,

  menuAlign : "tl-bl?",
  menuAlignOffest : [0, 13],

  menuClassTarget : 'div:first',
  activedClass    : "x-btn-active",
  actionMode      : "container",

  initComponent : function() {

    IconButton.superclass.initComponent.call(this);

    this.template = new Ext.Template(
      '<div unselectable="on">',
        '<div class="icon-pad-btn-wrap">',
          '<button type="{1}">{0}</button>',
        '</div>',
      '</div>'
    );

    this.slices = new Ext.util.MixedCollection();

    this.menu = new IconButtonMenu();
    this.menu.on("itemremove", this.onItemRemove, this);

    this.menu.add(this.owner);

    this.cmenu = new Ext.menu.Menu({
      items: [{
        text: 'Восстановить',
        handler: Ext.emptyFn,
        scope: this
      },{
        text: 'Свернуть',
        handler: Ext.emptyFn,
        scope: this
      },{
        text: 'Свернуть все',
        handler: Ext.emptyFn,
        scope: this
      },{
        text: 'Развернуть',
        handler: Ext.emptyFn,
        scope: this
      }, '-', {
        text: 'Закрыть',
        handler: Ext.emptyFn,
        scope: this
      },{
        text: 'Закрыть все',
        handler: Ext.emptyFn,
        scope: this
      }]

    });

    if (this.owner) {
      this.iconCls    = this.owner.iconCls;
      this.controller = this.owner.controller;
    }

  }, // initComponent

  onItemRemove: function() {

    var c = this.menu.getCount();
    if (c < 1) {
      this.destroy();
    } else if (c < this.maxSlices) {

      var i = this.maxSlices - c,
          w = this.el.getWidth(true),
          slice;

      while(i != 0) {

        slice = this.slices.remove(this.slices.last());
        if (slice) {
          w -= this.delta;
          Ext.destroy(slice);
        }
        i--;

      } // while

      this.el.setWidth(w);

    } // if
    return this;

  }, // onItemRemove

  contextMenu: function(menu) {

    this.cmenu = menu;
    if (!this.el) { return; }

    if (this.el.cmenu && this.cmenu) {
      Ext.destroy(this.el.cmenu)
    }

    if (this.cmenu) {
      this.el.cmenu = this.cmenu;
      this.el.cmenu.render();
    }

    delete this.cmenu;

  }, // contextMenu

  initButtonEl : function(btn, btnEl) {

    IconButton.superclass.initButtonEl.call(this, btn, btnEl);

    this.contextMenu(this.cmenu);
    btn.on('contextmenu', this.onContextMenu, this);

  }, // initButtonEl

  onContextMenu: function(e) {

    e.stopEvent();
    if (this.el.cmenu) {

      var xy = e.getXY();
      xy[1] = Math.round(this.el.getHeight() * 0.95);
      this.el.cmenu.showAt(xy);

    } // if

  }, // onContextMenu

  itemId: function() {
    return this.controller || 'unknown';
  }, // itemId

  addSlice: function(o) {

    if (this.menu.getCount() < this.maxSlices) {

      var wrap = this.slices.add(
        this.el.insertFirst({ cls: 'icon-pad-btn-wrap' })
      );

      var w = this.el.getWidth(true);
      w += this.delta;

      wrap.setLeft( this.delta*this.slices.getCount() );
      this.el.setWidth(w);

    }

    this.menu.add(o.owner);
    return this;

  }, // addSlice

  autoWidth: function() {
    this.el.setSize(this.width, this.height);
  }, // autoWidth

  setText: Ext.emptyFn,

  getText: Ext.emptyFn,

  showMenu : function() {

    if (!this.menu.show(this.el, this.menuAlign, null, this.menuAlignOffest)) {
      this.onSelectWin();
    }
    return this;

  }, // showMenu

  onSelectWin: function() {
    IconButtonMenuItem.prototype.onSelectWin.call(this);
  }, // onSelectWin

  onActive: function(actived) {

    this.actived = actived ? true : false;
    if (this.el) {
      this.el[this.actived ? 'addClass' : 'removeClass'](this.activedClass);
    }

  }, // onActive

  onDestroy : function() {

    IconButton.superclass.onDestroy.call(this);
    Ext.destroy.apply(Ext, this.slices.items);

  } // onDestroy

}); // IconButton

/*---------------------------------------------------------------------------
 * IconButtonMenu
 *-------------------------------------------------------------------------*/
var IconButtonMenu = Ext.extend(Ext.menu.Menu, {

  cls: "desktop-toolbar-menu-slider",

  constructor : function() {

    IconButtonMenu.superclass.constructor.apply(this, arguments);

    this.addEvents(
      'itemremove'
    );

    this.items.on("remove", this.onItemRemove, this);

  }, // constructor

  onItemRemove: function(item) {
    this.fireEvent("itemremove", item);
  }, // onItemRemove

  createEl : function() {

    return new Ext.Layer({
      cls:      "x-menu",
      shadow:   this.shadow,
      constrain: false,
      parentEl: this.parentEl,
      zindex:   15000
    });

  }, // createEl

  show : function(el, pos, parentMenu, posOffset) {

    if (this.getCount() > 1) {

      this.parentMenu = parentMenu;
      if (!this.el) {
        this.render();
      }
      this.fireEvent("beforeshow", this);
      this.showAt( this.el.getAlignToXY(el, pos || this.defaultAlign, posOffset), parentMenu, false );
      return true;

    }
    return false;

  }, // show

  getCount: function() {
    return this.items.getCount();
  }, // getCount

  add : function() {

    var a = arguments, l = a.length, item, li;
    for (var i = 0; i < l; i++) {

      item = new IconButtonMenuItem({
        text: (this.items.getCount() + 1),
        win: a[i]
      });
      item.on("destroy", this.items.remove, this.items);

      if (this.ul) {
        li = document.createElement("li");
        li.className = "x-menu-list-item";
        this.ul.dom.appendChild(li);
        item.render(li, this);
        this.delayAutoWidth();
      } // if
      this.items.add(item);

    } // for
    return this;

  }, // add

  addItem:      Ext.emptyFn,
  addSeparator: Ext.emptyFn,
  addElement:   Ext.emptyFn,
  addMenuItem:  Ext.emptyFn,
  addText:      Ext.emptyFn

}); // IconButtonMenu

/*---------------------------------------------------------------------------
 * IconButtonMenuItem
 *-------------------------------------------------------------------------*/
var IconButtonMenuItem = Ext.extend(Ext.menu.BaseItem, {

  ctype       :  "IconButtonMenuItem",
  itemCls     :  "x-menu-item",
  canActivate :  true,

  initComponent : function() {

    Ext.menu.BaseItem.superclass.initComponent.call(this);

    this.addEvents(
      'click',
      'activate',
      'deactivate'
    );

    this.on({
      'activate'    : this.onActiveWin,
      'deactivate'  : this.onDeactiveWin,
      'click'       : this.onSelectWin,
      scope: this
    });

    if (this.win) {
      this.win.on("destroy", this.destroy, this);
    }

  }, // initComponent

  onRender : function(container, position){

    var el = document.createElement("div");
    el.className = "x-menu-item";

    this.textEl = document.createElement("div");
    this.textEl.className = "x-text";
    el.insertBefore(this.textEl, null);

    this.textEl = Ext.get(this.textEl);
    this.el = el;

    IconButtonMenuItem.superclass.onRender.call(this, container, position);

  }, // onRender

  afterRender: function(container) {

    this.el.unselectable();
    this.textEl.unselectable();
    IconButtonMenuItem.superclass.afterRender.call(this, container);
    this.setText(this.text || '&nbsp;');

  }, // afterRender

  setText : function(text){

    this.text = text;
    if (this.rendered) {
      this.textEl.update(this.text);
    };

  }, // setText

  onSelectWin: function() {

    var win = this.win;
    if (win) {

      if (win.hidden) {
        win.show();
        win.restore();
      } else {
        win.hide();
      }

    }

  }, // onSelectWin

  onActiveWin: function() {

    var win = this.win;
    if (!win) { return; }

    win.manager.each(function(item) {

      if (item.getId() != win.getId()) {
        item.ghost().setStyle("z-index", 1);
      }

    });

  }, // onActiveWin

  onDeactiveWin: function() {

    var win = this.win;
    if (!win) { return; }

    win.manager.each(function(item) {

      if (item.getId() != win.getId()) {
        item.unghost(true, true);
      }

    });

  } // onDeactiveWin

}); // IconButtonMenuItem