var DBUSER = "bd6d4fe3a1cf78";
var DBPASS = "c6ce1076";
var DBNAME = "heroku_43d1799af035f12";

var Connection = function () {

    this.getConnParams = function() {
        return {
          host     : 'us-cdbr-iron-east-05.cleardb.net',
          port     : 3306,
          user     : DBUSER,
          password : DBPASS,
          database : DBNAME
        };

    }
}

module.exports = Connection;
