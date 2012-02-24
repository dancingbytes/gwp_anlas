/*---------------------------------------------------------------------------
 * Button
 *-------------------------------------------------------------------------*/
var Toolbar = Ext.extend(Ext.BoxComponent, {

  height: 41,
  cls:'desktor-base-toolbar',

  initComponent : function() {

    this.accountPanel = new AccountPanel();

    this.accountPanel.addButton({
      cls: 'logoff',
      text: 'Выход',
      handler: this.onLogOff,
      scope: this
    });

    this.accountPanel.addText({
      text: 'Василина Петрова (менеджер)'
    });

    this.iconPad = new TaskButtonBar();

    this.on("resize", this.autoSize, this);
    Toolbar.superclass.initComponent.call(this);

  }, // initComponent

  onRender : function(ct, position) {

    var el = document.createElement('div');
    ct.dom.insertBefore(el, position);
    this.el = Ext.get(el);
    this.el.unselectable();

    this.iconPad.render(this.el, 0);
    this.accountPanel.render(this.el, 1);

    Toolbar.superclass.onRender.call(this, ct, position);

  }, // onRender

  autoSize: function() {

    var w = this.el.getWidth();
    w -= this.accountPanel.getWidth();
    this.iconPad.setWidth(w-20);
    this.accountPanel.setLeft(w);

  }, // autoSize

  add: function() {
    return this.iconPad.add.apply(this.iconPad, arguments);
  }, // add

  remove: function(el) {
    return this.iconPad.remove(el);
  }, // remove

  setActiveButton: function(el) {
    return this.iconPad.setActiveButton(el);
  }, // setActiveButton

  onLogOff: function() {
    document.location.href = "/admin/logout";
  } // onLogOff

}); // Toolbar