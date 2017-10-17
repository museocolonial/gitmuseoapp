var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
//Clase Usuario
var Usuario = function () {

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
    
    
    this.authUser = function (userAuthData, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                var sql = "select * from usuarios as u where u.email = '" + userAuthData.email + "' and u.password = '"+userAuthData.password+"' and u.tipo=0";
                console.log(sql);
                connection.query(sql, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        if (rows.length <= 0) {
                            responseManager.error = "Usuario o password incorrecto";
                        } else {
                           responseManager.error = "NO_ERROR";
                           responseManager.object = rows[0]; 
                        }
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    var instance = this;

}

module.exports = Usuario;

