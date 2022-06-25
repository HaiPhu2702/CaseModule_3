

module.exports=class Database{

     static connectionMysql(){
        return require('mysql').createConnection({
            host: 'localhost',
            user:"root",
            password:"Matkhau1234@@",
            database:"test_connection",
            charset:"utf8_general_ci"
        })
    }

}
