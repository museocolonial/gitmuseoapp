/**
 * Clase ObraManager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function ObraManager() {
     
 this.getSkeleton = function() {
     return {nombre:"",descripcionCorta:"",descripcionLarga:"",idioma:1};
 }
     
 this.insert = function (jsonData, files, callBackUpdated, callBackError) {
     
        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        for (var i = 0; i < files.length ; i++) {
            data.append('file'+i, files[i]);
        }
        
         $.ajax({
            url: '/obra',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            cache: false,
            processData: false,
            contentType: false,
            data:data,
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
     
this.update = function (jsonData, files, callBackUpdated, callBackError) {
     
        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        for (var i = 0; i < files.length ; i++) {
            data.append('file'+i, files[i]);
        }
        
         $.ajax({
            url: '/obra/update',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            cache: false,
            processData: false,
            contentType: false,
            data:data,
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
     
 this.obtenerAll = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/obra',
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

this.obtenerPorId = function (id, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/obra/obtener/' + id,
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
     
     this.eliminarObra = function (id, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/obra/delete/' + id,
            type: 'DELETE', //Obtiene los datos del cliente.
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