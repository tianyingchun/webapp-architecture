-webapp-architecture
=======================================================

Application template for packaged Enyo

- The customized mobile framework based on ENYO 2.3 pre

Refer to the [Wiki](https://github.com/enyojs/enyo/wiki/Bootplate) for how to get started.


- The project folder structures

```project structure folder
 	webapp-architecture
	├── assets  (the external static resource assets)
	│   └── favicon.ico
	├── build   (the directory to store app buit css, js files `app.css,app.js, enyo.css, enyo.js`)
	│   ├── app.css
	│   ├── app.js
	│   ├── enyo.css
	│   └── enyo.js
	├── deploy  (the final webapp deployed directory, contains all necessary assets)
	│	├── assets
	│	├── build
	│	├── external
	│	├── other....
	│	├── lib
	│	├── icon.png
	│	└── index.html
	├── enyo    (enyo library)
	├── external(store other external files)
	├── lib     (put all libraries based enyojs, we can also put ourself commonly used plugin here)
	├── source  (we put our main business logics code in source directory)
	├── test    (some test code here)  
	├── tools   (contains deploy tools for our webapp)
	├── debug.html 
	├── deploy.json
	├── icon.png
	├── package.js
	├── web-server.js 
	└── index.html

```