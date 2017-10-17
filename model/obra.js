var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");

//Clase Obra
var Obra = function () {
    //Obteniendo recursos
    this.fs = require("fs");
    this.path = require('path');
    var connection = new Connection();
    
    var connParams = connection.getConnParams();
    
    //Obteniendo recursos
    this.mysql = require("mysql");
    
    var connection = new Connection();
    var connParams = connection.getConnParams();
    
    //funciones
    this.crearConexion = function (conexionCreada) {
        var connection = instance.mysql.createConnection(connParams);
        connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            conexionCreada(null);
            return;
          }
        
          console.log('connected as id ' + connection.threadId);
          conexionCreada(connection);
          setTimeout(function() {connection.end();}, 1000);
          
        });
    }
    
    this.getObras = function (responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlUpdate = "select * from obras";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.insertObra = function (obraObject, files, responseCallback) {
        console.log(Object.keys(files).length);
        if (Object.keys(files).length > 0) {
            var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, err) {
                    obraObject.imagen = getResource(filesPath, ".png");
                    obraObject.audio = getResource(filesPath, ".mp3");
                    insertObraData(obraObject, responseCallback);
            }, []);
        } else {
            obraObject.imagen = null;
            obraObject.audio = null;
            insertObraData(obraObject, responseCallback);
        }
        
    }
    
    function insertObraData(obraObject, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var imageInfo = obraObject.imagen != null ? ",'" + obraObject.imagen + "'" : "";
                var audioInfo = obraObject.audio != null ? ",'" + obraObject.audio + "'" : "";
                var metodoCall = "insertarObra";
                var sqlUpdate = "CALL " + metodoCall + "('" + obraObject.nombre + "', '" + obraObject.descripcionCorta + "','" + obraObject.descripcionLarga + "'" + imageInfo + audioInfo + ","+obraObject.idioma+");";
                console.log(sqlUpdate);
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.updateObra = function (obraObject, files, responseCallback) {
        if (Object.keys(files).length > 0) {
            var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, err) {
                    obraObject.audio = getResource(filesPath, ".mp3");
                    obraObject.imagen = getResource(filesPath, ".png");
                    updateObraData(obraObject, responseCallback);
            }, []);
        } else {
            obraObject.imagen = null;
            obraObject.audio = null;
            updateObraData(obraObject, responseCallback);
        }
    }
    
    function updateObraData(obraObject, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var mediaInfo = obraObject.imagen != null && obraObject.audio != null ? 
                                                                                      ",'" + obraObject.imagen + "','" + obraObject.audio + "'" 
                                                                                      : obraObject.imagen != null ? ",'" + obraObject.imagen + "'"
                                                                                      : obraObject.audio != null ? ",'" + obraObject.audio + "'"
                                                                                      : "";
                var metodoCall = obraObject.imagen != null && obraObject.audio != null ? 
                                                                                      "updateObra" 
                                                                                      : obraObject.imagen != null ? "updateObraConImagen"
                                                                                      : obraObject.audio != null ? "updateObraConAudio"
                                                                                      : "updateObraNoMedia";
                
                var sqlUpdate = "CALL " + metodoCall + "("+obraObject.id+" ,'" + obraObject.nombre + "', '" + obraObject.descripcionCorta + "','" + obraObject.descripcionLarga + "'" + mediaInfo + ","+obraObject.idioma+");";
                console.log(sqlUpdate);
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.getObraPorIdyIdioma = function (obraObject, responseCallback) {
         instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlGet = "CALL obtenerObraPorIdyIdioma(" + obraObject.id + ", " + obraObject.idioma + ")";
                connection.query(sqlGet, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0];
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.getObraPorId = function (id, responseCallback) {
         instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlGet = "CALL obtenerObraPorId(" + id + ")";
                connection.query(sqlGet, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0][0];
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.getObraPorIdBeacon = function (idBeacon, idioma, responseCallback) {
         instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlGet = "CALL obtenerObraPorBeacon('" + idBeacon + "', " + idioma + ")";
                console.log(sqlGet);
                connection.query(sqlGet, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0][0];
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.eliminarObra = function (id, responseCallback) {
         instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlGet = "CALL eliminarObra(" + id + ")";
                connection.query(sqlGet, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows;
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.buscarObraPorNombre = function (nombre, responseCallback) {
         instance.crearConexion(function (connection) {
            
            if (connection) {
                var sqlGet = "CALL buscarObraPorNombre('" + nombre + "')";
                connection.query(sqlGet, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows;
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.updateBeaconInfoObra = function(beaconObject, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                console.log(beaconObject);
                var functionName = beaconObject.plataforma == "android" ? "updateBeaconInfoObraAndroid" : "updateBeaconInfoObraIOS";
                var sqlUpdate = "CALL " + functionName + "(" + beaconObject.id + ", '" + beaconObject.idBeacon + "')";
                console.log(sqlUpdate);
                connection.query(sqlUpdate, function (err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows;
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    function getResource(filesPath, type) {
        for (var index = 0; index < filesPath.length; index++) {
            var filePath = filesPath[index].path;
            if (filePath.toLowerCase().indexOf(type) != -1) {
                return filePath;
            }
        }
        return null;
    }
    
    var instance = this;
}

module.exports = Obra;