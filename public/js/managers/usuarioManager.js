/**
 * Clase Usuario Manager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function UsuarioManager() {
     
 this.getSkeleton = function() {
     return { nombres:"", email:"", password:"",tipo:1};
 }
 

  this.isLogued = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/usuario/logued',
            type: 'GET', //Obtiene los datos del cliente.
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     } 

  this.authCliente = function (user,pass,tipo, callBackUpdated, callBackError) {
      $.ajax({
            url: '/usuario/auth',
            type: 'POST', //Obtiene los datos del cliente.
            data: JSON.stringify({email:user,password:pass,tipo:tipo}),
            dataType   : 'json',
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
    }
    
    this.logOut = function(callBackUpdated, callBackError) {
        $.ajax({
            url: '/usuario/logout',
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
    }
   
 }
 $(document).ready(function() {
    var usuarioManager = new UsuarioManager();
    usuarioManager.isLogued(function(rm) {
        console.log("Usuario autorizado");
    }, function(rm) {
       if (document.location.href.indexOf("index.html") == -1) {    
       document.location.href = "index.html"; 
       }
    });
 });
 
 function cerrarSession() {
     var usuarioManager = new UsuarioManager();
    usuarioManager.logOut(function(rm) {
        if (document.location.href.indexOf("index.html") == -1) {    
        document.location.href = "index.html"; 
       }
    }, function(rm) {
       
    });
 }