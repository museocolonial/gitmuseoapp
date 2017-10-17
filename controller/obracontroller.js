var Obra = require("../model/obra.js");
var multipart = require('connect-multiparty');

var ObraControlador = function (routes) {
    
    routes.push({
        path:"/obra",
        type:"PUT",
        func: function (req,res) {
            var obra = new Obra();
            var session = req.session;
            if (session.cliente) {
                obra.insertObra(req.body, req.files, function(responseManager) {
                   res.send(responseManager); 
                });
            }
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/obra/update",
        type:"PUT",
        func: function (req,res) {
            var obra = new Obra();
            var session = req.session;
            if (session.cliente) {
                obra.updateObra(req.body, req.files, function(responseManager) {
                   res.send(responseManager); 
                });
            }
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/obra",
        type:"GET",
        func: function (req,res) {
            var obra = new Obra();
            obra.getObras(function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/obra/idioma",
        type:"POST",
        func: function (req,res) {
            var obra = new Obra();
            obra.getObraPorIdyIdioma(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/obra/obtener/:id",
        type:"GET",
        func: function (req,res) {
            var obra = new Obra();
            obra.getObraPorId(req.params.id, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/obra/beacon/:idBeacon/:idioma",
        type:"GET",
        func: function (req,res) {
            var obra = new Obra();
            obra.getObraPorIdBeacon(req.params.idBeacon, req.params.idioma, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/obra/busqueda/:nombre",
        type:"GET",
        func: function (req,res) {
            var obra = new Obra();
            obra.buscarObraPorNombre(req.params.nombre, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/obra/delete/:id",
        type:"DELETE",
        func: function (req,res) {
            var obra = new Obra();
            var session = req.session;
            if (session.cliente) {
                obra.eliminarObra(req.params.id, function(responseManager) {
                   res.send(responseManager); 
                });
            }
        }
    });
    
    routes.push({
        path:"/obra/beacon",
        type:"PUT",
        func: function (req,res) {
            var obra = new Obra();
            obra.updateBeaconInfoObra(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    return routes;
}

module.exports = ObraControlador;