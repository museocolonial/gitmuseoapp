#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var session = require('express-session');
var fs      = require('fs');
var bodyParser = require('body-parser');
var connect = require('connect');

// Controlador requires
var ObraController = require(__dirname + "/controller/obracontroller.js");
var BannersController = require(__dirname + "/controller/bannersController.js");
var UsuarioControlador = require(__dirname + "/controller/usuarioControlador.js");
var MensajesControlador = require(__dirname + "/controller/mensajesController.js"); 


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP ? process.env.OPENSHIFT_NODEJS_IP : process.env.IP || "0.0.0.0";
        self.port      = process.env.OPENSHIFT_NODEJS_PORT ? process.env.OPENSHIFT_NODEJS_PORT || 8080 : process.env.PORT || 3000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = [];
        self.routes = ObraController(self.routes);
        self.routes = BannersController(self.routes);
        self.routes = UsuarioControlador(self.routes);
        self.routes = MensajesControlador(self.routes);
        
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();
        self.app.use(express.static(__dirname + '/public'));
        if (process.env.OPENSHIFT_DATA_DIR != null) {
            self.app.use(express.static(process.env.OPENSHIFT_DATA_DIR + '/public'));
            console.log("Carpeta datos open shift");
            console.log(process.env.OPENSHIFT_DATA_DIR);
        }
        
        self.app.use(bodyParser.urlencoded({extended: false}));
        self.app.use(bodyParser.json());
        self.app.use(express.cookieParser());
        self.app.use(session({secret: '1234567890QWERTY'}));
        console.log("agregando rutas");
        for (var r in self.routes) {
            
            if (self.routes[r].type == "GET") {
                self.app.get(self.routes[r].path, self.routes[r].func);
            }
            
            if (self.routes[r].type == "POST") {
                self.app.post(self.routes[r].path, self.routes[r].func);
            }
            
            if (self.routes[r].type == "PUT") {
                if (self.routes[r].middleware) {
                    self.app.put(self.routes[r].path, self.routes[r].middleware, self.routes[r].func);
                } else {
                    self.app.put(self.routes[r].path, self.routes[r].func);
                }
            }
            
            if (self.routes[r].type == "DELETE") {
                self.app.delete(self.routes[r].path, self.routes[r].func);
            }
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

