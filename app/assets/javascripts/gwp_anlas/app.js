//= require gwp_anlas/toolbar/account_panel.js
//= require gwp_anlas/toolbar/icon_button.js
//= require gwp_anlas/toolbar/task_button_bar.js

//= require gwp_anlas/bg_manager.js
//= require gwp_anlas/toolbar.js
//= require gwp_anlas/shortcut.js
//= require gwp_anlas/desktop.js

Workplace = new Desktop({

  bgCfg: {
   	url   : "<%= image_path('/assets/gwp_anlas/desktop/background.gif') %>",
    color : '#036195',
    repeat: 'repeat'
  }
  
});