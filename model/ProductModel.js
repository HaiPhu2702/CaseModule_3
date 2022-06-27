const connectionMysql = require('./connectDatabase').connectionMysql()


module.exports = class productModel {

    constructor() {
    }


    static checkJoinUserWithRole(name,password){
        return new Promise((resolve, reject) => {
            let sql = `select u.name,u.pass,r.role
                        from user u
                        join role r on u.idrole=r.idrole
                        where u.name='${name}' and u.pass='${password}'`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }





    static checkNameSignUp(name){
        return new Promise((resolve, reject) => {
            let sql = `select * from user where name='${name}'`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }
    static addNewUser(nameUser,passUser){
        return new Promise((resolve, reject) => {
            let sql = `insert into user(name,pass,idrole)values('${nameUser}','${passUser}',1)`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve('delete ok')
            })
        })
    }



   static joinProductWithType() {
        return new Promise((resolve, reject) => {
            let sql = `select p.id,p.name,p.price,t.type 
                        from products p 
                        join typeProduct t on p.idtypeProduct = t.idtypeProduct`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }

     static findProductUpdateByID(idUpdate) {
        return new Promise((resolve, reject) => {
            let sql = `select p.name,p.price,t.type 
                        from products p 
                        join typeProduct t on p.idtypeProduct = t.idtypeProduct
                        where p.id='${idUpdate}'`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }

                    resolve(result)
            })
        })
    }





   static joinProductWithTypeWithOrder(idOder) {
        return new Promise((resolve, reject) => {
            let sql = `select p.id,p.name,p.price,t.type 
                        from products p 
                        join typeProduct t on p.idtypeProduct = t.idtypeProduct
                        join test_connection.order o on p.idorder = o.idorder
                        where o.idorder='${idOder}'`
            connectionMysql.query(sql, (err, result) => {

                    reject(err)

                resolve(result)
            })
        })
    }



    static findProductByID(id){
        return new Promise((resolve, reject) => {
            let sql = `select p.name,p.price,t.type 
                        from products p 
                        join typeProduct t on p.idtypeProduct = t.idtypeProduct
                        where p.id='${id}'`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }

    static getTypeProduct(){
        return new Promise((resolve, reject) => {
            let sql = `select * from typeProduct`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    }



    static insertProduct(nameForm,priceForm,typeProduct){
         return new Promise((resolve, reject) => {
            let sql = `insert into products(name,price,idtypeProduct) 
                        values('${nameForm}','${priceForm}','${typeProduct}')`
             connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve('ok')
            })
        })
    }

    static deleteProduct(index){
        return new Promise((resolve, reject) => {
            let sql = `delete from products where id=${index}`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve('delete ok')
            })
        })
    }


    static updateProduct(nameForm,priceForm,typeProductForm,index){
        return new Promise((resolve, reject) => {
            let sql = `update products 
                        set name='${nameForm}',
                            price='${priceForm}',
                            idtypeProduct='${typeProductForm}'
                        where id=${index}`
            connectionMysql.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve('delete ok')
            })
        })

    }











}
