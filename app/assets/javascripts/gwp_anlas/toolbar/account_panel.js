/*---------------------------------------------------------------------------
 * AccountPanel
 *-------------------------------------------------------------------------*/
var AccountPanel = Ext.extend(Ext.BoxComponent, {

  cls:      'account-panel',
  height:   40,

  autoCreate: {
    html:'<table cellspacing="0"><tr></tr></table>'
  },

  initComponent : function() {

    AccountPanel.superclass.initComponent.call(this);
    this.items = (Ext.isArray(this.items) ? this.items : []);

  }, // initComponent

  onRender : function(ct, position) {

    this.el = ct.createChild(Ext.apply({ id: this.id }, this.autoCreate), position);
    this.tr = this.el.child("tr", true);
    this.table = this.el.child("table:first");

    AccountPanel.superclass.onRender.call(this, ct, position);

  }, // onRender

  afterRender: function() {

    AccountPanel.superclass.afterRender.apply(this, arguments);

    this.autoResize();

    var items = this.items;
    this.items = new Ext.util.MixedCollection();
    for(var i = 0, size = items.length; i < size; i++) {
      this.add(items[i]);
    }

  }, // afterRender

  add: function(o) {

    if (Ext.isArray(o)) {
      var items = [];
      for(var i = 0, size = o.length; i < size; i++) {
        items.push(this.add(o[i]));
      }
      return items;
    }

    if (!this.rendered) {
      this.items.push(o);
    } else {

      var bt = o.render( this.nextBlock() );
      this.items.add(o);
      this.autoResize();

    }
    return o;

  }, // add

  autoResize: function() {
    this.el.setWidth( this.table.getWidth(true) );
  }, // autoResize

  addButton: function(conf) {
    return this.add( new AccountPanel.Button(conf) );
  }, // addButton

  addText: function(conf) {
    return this.add( new AccountPanel.Text(conf) );
  }, // addText

  nextBlock: function() {

    var td = document.createElement("td");
    this.tr.insertBefore(td, this.tr.firstChild);
    return td;

  }, // nextBlock

  getWidth: function() {
    return this.el ? this.el.getWidth() : this.width;
  }, // getWidth

  setLeft: function(x) {
    this.el.setLeft(x);
  }, // setLeft

  setTop: function(x) {
    this.el.setTop(x);
  }, // setTop

  adjustSize : function(w, h) {

    return {
      width : this.width,
      height: this.height
    };

  }, // adjustSize

  onDestroy: function() {

    Ext.destroy.apply(Ext, this.items.items);
    onDestroy.superclass.initComponent.call(this);

  } // onDestroy

}); // AccountPanel


AccountPanel.Button = Ext.extend(Ext.Button, {

  menuClassTarget: 'div:first',
  minWidth: 80,

  initComponent : function() {

    AccountPanel.Button.superclass.initComponent.call(this);

    this.template = new Ext.Template(
      '<div unselectable="on">',
        '<div class="x-btn-wrap">',
          '<button type="{1}">{0}</button>',
        '</div>',
      '</div>'
    );

  }, // initComponent

  showMenu : Ext.emptyFn

}); // AccountPanel.Button


AccountPanel.Text = Ext.extend(Ext.Component, {

  textSelector: 'span:first',
  cls: 'account-panel-txt',
  minWidth: 230,

  onRender : function(ct, position) {

    this.template = this.template || new Ext.Template(
      '<div class="{0}">',
        '<span>{1}</span>',
      '</div'
    );

    var args = [this.cls + "-wrap", this.text || '&#160;'];
    if (position) {
      this.el = this.template.insertBefore(position, args, true);
    } else {
      this.el = this.template.append(ct, args, true);
    }

    this.txtEl = this.el.child(this.textSelector);

    AccountPanel.Text.superclass.onRender.call(this, ct, position);

  }, // onRender

  afterRender : function() {

    AccountPanel.Text.superclass.afterRender.call(this);
    if (Ext.isIE6) {
      this.autoWidth.defer(1, this);
    } else {
      this.autoWidth();
    }

  }, // afterRender

  autoWidth : function() {

    if (this.el) {

      if (this.minWidth && (this.el.getWidth() < this.minWidth)) {
        this.el.setWidth(this.minWidth);
      } else {
        this.el.setWidth("auto");
      } // if

    } // if

  }, // autoWidth

  setText : function(text){

    this.text = text;
    this.txtEl.update(text);
    this.autoWidth();

  }, // setText

  getText : function(){
    return this.text;
  } // getText

}); // AccountPanel.Text