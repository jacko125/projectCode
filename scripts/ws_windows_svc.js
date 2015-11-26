/*
    Script for installing/uninstalling MIA as a Windows service.
    Requires the following in the MIA directory
        npm install -g node-windows
        npm link node-windows    
    
    Usage: node ws_windows_svc [install | uninstall]
*/

var Service = require('node-windows').Service;

if (process.argv.length != 3) {
    console.log('Usage: node ws_windows_svc [install | uninstall]');
    return;
}

// Create a new service object
var svc = new Service({
  name:'TGP_MIA_prod_ws_service',
  description: 'The Grad Project - MIA production WebsocketServer service',
  script: 'D:\\TGP\\mia\\ws-server.js',
  env:
  {
	  name: 'ENVIRONMENT',
	  value: 'prod'
  }
});

// Listen for the "install" event, which indicates the process is available as a service.   
svc.on('install',function(){
  console.log('Installed service');
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.'); 
});

switch (process.argv[2]) {
    case 'install':
        svc.install();
        break;
    case 'uninstall':
        svc.uninstall();
        break;
    default:
        console.log('Invalid option specified');        
}



