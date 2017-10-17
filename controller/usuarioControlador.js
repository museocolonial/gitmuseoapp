var Usuario = require("../model/usuario.js");

var UsuarioControlador = function (routes) {
    
    routes.push({
        path:"/usuario/auth",
        type:"POST",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.authUser(req.body, function(responseManager) {
                if (responseManager.object != null) {
                    var session = req.session;
                    session.cliente = responseManager.object[0] != null ? responseManager.object[0] : responseManager.object;
                    session.cliente.password = "not_delivered";
                    responseManager.object.urlRedirect = session.cliente.tipo == 0 ? "/admin/indexAdmin.html" : "/admin/indexUser.html";
                }
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/logued",
        type:"GET",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) { session.cliente.password = "not_delivered"; }
            res.send(session.cliente ? { manager:"", error:"NO_ERROR", message: "", object: session.cliente } : { manager:null, error:null, message: null, object: null });
        }
    });
    
    routes.push({
        path:"/usuario/logout",
        type:"GET",
        func: function (req,res) {
            req.session.destroy();            
            res.send({ manager:"", error:"NO_ERROR", message: "", object: null });
        }
    });
    
    return routes;
}

module.exports = UsuarioControlador;