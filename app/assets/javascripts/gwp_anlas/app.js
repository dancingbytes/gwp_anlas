//= require gwp_anlas/toolbar/account_panel.js
//= require gwp_anlas/toolbar/icon_button.js
//= require gwp_anlas/toolbar/task_button_bar.js

//= require gwp_anlas/bg_manager.js
//= require gwp_anlas/toolbar.js
//= require gwp_anlas/shortcut.js
//= require gwp_anlas/desktop.js

var shortcut = new Shortcut({

  items: [{
		text: 			'Клиенты',
		iconCls: 		'users-icon',
		groupName: 	'Магазин',
		runApp: 		'users'
	}, {
	  text: 			'Товары',
		iconCls: 		'catalog-icon',
		groupName: 	'Магазин',
		runApp: 		'catalogs'
	}, {
	  text: 			'Заказы',
	  iconCls: 		'orders-icon',
		groupName: 	'Магазин',
		runApp: 		'orders'
	}, {
	  text: 			'Доставка',
	  iconCls: 		'delivery-icon',
	  groupName: 	'Магазин',
		runApp: 		'delivery_types'
	}, {
    text: 			'Оплата',
    iconCls: 		'payment-icon',
		groupName: 	'Магазин',
		runApp: 		'payment_types'
	}, {
    text: 			'Новые товары',
    iconCls: 		'newprod-icon',
		groupName: 	'Магазин',
		runApp: 		'incoming_goods'
	},
			
	{
	  text: 			'Страницы',
	  iconCls: 		'pages-icon',
		groupName: 	'Контент',
		runApp: 		'pages'
	}, {
	  text: 			'Новости',
	  iconCls: 		'news-icon',
		groupName: 	'Контент',
		runApp: 		'news'
	}, {
	  text: 			'Файлы',
	  iconCls: 		'files-icon',
		groupName: 	'Контент',
		runApp: 		'files'
	}, 

	{
    text: 			'Баннеры',
    iconCls: 		'banners-icon',
		groupName: 	'Сервисы',
		runApp: 		'banners'
	}, {
    text: 			'Бренды',
    iconCls: 		'brands-icon',
		groupName: 	'Сервисы',
		runApp: 		'brands'
	}, {
    text: 			'Документы',
    iconCls: 		'documents-icon',
		groupName: 	'Сервисы',
		runApp: 		'documents'
	}, {
	  text: 			'Меню',
	  iconCls: 		'menu-icon',
		groupName: 	'Настройки',
		runApp: 		'menus'
	}]

});

var Workplace = new Desktop({

  plugins: 	[shortcut], 
  bgCfg: {
   	url   : "<%= image_path('/assets/gwp_anlas/desktop/background.gif') %>",
    color : '#036195',
    repeat: 'repeat'
  }

});

Workplace.render(Ext.getBody());