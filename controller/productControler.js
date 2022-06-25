const productModel = require('../model/ProductModel')
const session = require('../Session/session')
const fs = require("fs");
const qs = require("qs");
const url = require("url");
const cookie = require("cookie");
const router = require("../routes/Routes");

module.exports = class productController {

    constructor() {
    }

    static errorPage(req, res){
        productController.readFile('./views/products/404.html',req, res)
    }
    static readFile(pathFile, req, res) {
        fs.readFile(pathFile, "utf8", (err, data) => {
            if (err) {
                throw err
            }
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write(data)
            res.end();
        })
    }
    static login(req, res) {

        if(req.method === 'GET'){

            productController.readFile('./views/login/login.html',req, res)
            let cookieClient=cookie.parse(req.headers.cookie||'')

            if(cookieClient.cookie_user){
                // lay IDSessionCookie chinh la = name file  để so sánh vs file trong cơ sơ dữ liệu
                let IDSessionCookie= (JSON.parse(cookieClient.cookie_user)).session_name;
                let role=(JSON.parse(cookieClient.cookie_user)).roles;
                    //else doc data trong server dieu huong nếu admin->admin,user->user

                    fs.exists('./Session/dataSession/'+IDSessionCookie+'.txt',(exists)=>{
                        if(exists){
                            if(role==='admin'){
                                res.writeHead(301, {location: '/admin'});
                                res.end();
                            }

                            if(role==='user'){
                                res.writeHead(301, {location: '/user'});
                                res.end();
                            }

                        }else{
                            productController.readFile('./views/login/login.html',req, res)
                        }
                    })
            }else {
                productController.readFile('./views/login/login.html',req, res)
            }
        }else {
            // lay du lieu tu form tra ve gom 2 bang product+typeProduct
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', () => {
                const loginForm = qs.parse(data)
                console.log(loginForm);

                //kiem tra trong co so du lieu join 2 bang
                productModel.checkJoinUserWithRole(loginForm.name,loginForm.password)
                    .then(result=>{
                        let users=Object.values(JSON.parse(JSON.stringify(result)))
                        if(users.length>0){

                            if(loginForm.remember==='on'){
                                //tao session
                                let IDSession=session.createRandomIDSession(13)
                                let DataSession=session.createDataSession(loginForm.name,loginForm.password)
                                let Session=session.createSession(IDSession,DataSession)

                                let nameFile=Date.now();

                                session.writeSessionSever(`./Session/dataSession/${nameFile}.txt`,Session)

                                let cookieClient={
                                    session_name:nameFile,
                                    roles:users[0].role
                                }

                                session.writeCookieClient(cookieClient,res)
                            }

                            if(users[0].role==='admin'){

                                res.writeHead(301,{location:'/admin'})
                                res.end()
                            }

                            if(users[0].role==='user'){
                                res.writeHead(301,{location:'/user'})
                                res.end()
                            }
                        }else{

                            fs.readFile('./views/login/login.html',"utf8",(err, data)=>{
                                    if(err){throw err;}
                                    res.writeHead(200,{"Content-Type":"text/html"})
                                    data=data.replace('display:none','display:block')
                                    res.write(data)
                                    res.end()
                                }
                            )

                        }
                    })
                    .catch(err => {throw err;})



            })
            }

    }
    static signup(req, res) {
        if(req.method === 'GET'){
            productController.readFile('./views/login/signup.html',req,res)
        }else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', () => {
                const signUpForm = qs.parse(data)
                //kiem tra xem trong co so du lieu  co ten ton tai k
                productModel.checkNameSignUp(signUpForm.name)
                    .then((result) =>{
                        if(result.length===0){
                            //them new user
                            productModel.addNewUser(signUpForm.name,signUpForm.password)
                                .then(result=>{
                                    })
                                res.writeHead(301,{location: '/login'})
                                res.end();
                        }else {

                            //ten da ton tai
                                fs.readFile('./views/login/signup.html',"utf8",(err, data)=>{
                                        if(err){throw err;}
                                        res.writeHead(200,{"Content-Type":"text/html"})
                                        data=data.replace('display:none','display:block')
                                        res.write(data)
                                        res.end()
                                    }
                                )
                        }

                    })
                    .catch(error=>{
                        throw error
                    })


                //cho ra lai trang login



            })
        }


    }

    static logout(req, res) {
        let cookieClient=cookie.parse(req.headers.cookie||'')
        let IDSessionCookie= (JSON.parse(cookieClient.cookie_user)).session_name;

        fs.exists(`./Session/dataSession/${IDSessionCookie}.txt`,exists=>{
            if (exists){
                fs.unlink(`./Session/dataSession/${IDSessionCookie}.txt`,err =>{
                    if(err){throw err}
                    res.writeHead(301,{location: '/login'})
                    res.end()
                })
            }{
                res.writeHead(301,{location: '/login'})
                res.end()
            }
        })



    }

    static showAdminPage(req, res) {
        productModel.joinProductWithType().then(listProduct => {
            fs.readFile('./views/admin/admin.html', "utf8", (err, data) => {
                if (err) {
                    throw err
                }
                let html = '';
                listProduct.forEach((product, index) => {
                    html += '<tr>'
                    html += `<td >${index + 1}</td>`
                    html += `<td >${product.name}</td>`
                    html += `<td>${product.price}</td>`
                    html += `<td>${product.type}</td>`
                    html += `<td>
                             <button type="button" value="${product.id}" class="btn btn-danger"> <a href="/products/delete?id=${product.id}"><i class="fa-solid fa-trash-can"></i></a></button>
                            </td>`
                    html += `<td>
                                <button type="button" value="${product.id}" class="btn btn-warning"><a href="/products/update?id=${product.id}"><i class="fa-solid fa-wrench"></i></a></button>
                            </td>`

                    html += '</tr>'
                })
                data = data.replace('{list-products}', html)
                res.writeHead(200, {"Content-Type": "text/html"})
                res.write(data)
                res.end();
            })

        }).catch(error => {
            throw error
        })
    }

    static showUserPage(req, res) {
        productController.readFile('./views/user/user.html',req,res)
    }

    static order(req, res) {
        if(req.method === 'GET'){
            productController.readFile('./views/user/order.html',req,res)
        }else{
            let data ='';
            req.on('data', chunk=>{
                data+=chunk
            })
            req.on('end', () => {
                const product = qs.parse(data)
                console.log( product.order)

                if(product.order==='1'){
                     productModel.joinProductWithTypeWithOrder(1)
                         .then((result)=>{
                             console.log(result)
                         })
                         .catch(error => {throw error})

                }
                //  if(product.order==='2'){
                //
                // }
                //  if(product.order==='1' && product.order==='2'){
                //
                // }


            })

        }
    }

    static showFormAdd(pathFile, req, res) {
        productModel.getTypeProduct().then(typeProduct => {
            fs.readFile(pathFile, "utf8", (err, data) => {
                if (err) {
                    throw err
                }
                let html = ''
                typeProduct.forEach(type => {
                    html += `<input type="checkbox" value="${type.idtypeProduct}" name="TypeProduct">${type.type}`
                })
                data = data.replace('{list-type}', html)

                res.writeHead(200, {"Content-Type": "text/html"})
                res.write(data)
                res.end();
            })
        }).catch(err => {
            throw err
        })

    }

    static showFormUpdate(pathFile, req, res, index) {
        fs.readFile(pathFile, "utf8", (err, data) => {
            if (err) {
                throw err
            }
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write(data)
            res.end();

        })
    }

    static addProduct(req, res) {
        if(req.method === 'GET'){
            productController.showFormAdd('./views/products/add.html',req,res)
        }else {
            let data ='';
            req.on('data', chunk=>{
                data+=chunk
            })
            req.on('end', () => {
                const product = qs.parse(data)
                console.log(product)
                //luu no trong database product
                productModel.insertProduct(product.name, product.price, product.TypeProduct)
                    .then( result => {
                        res.writeHead(301,{location:'/admin'})
                        res.end();
                        }
                    )
                    .catch(err => {
                        throw new Error(err.message)
                    })
            })

        }
    }

    static deleteProduct(req, res) {
        const parseUrl = url.parse(req.url, true)
         let  indexParse=qs.parse(parseUrl.query).id;
        console.log(indexParse)

        productModel.deleteProduct(indexParse)
            .then(result => {
                res.writeHead(301,{location:'/admin'})
                res.end();
                }
            )
            .catch(err => {
                throw new Error(err.message)
            })

    }

    static updateProduct(req, res) {
        let parseUrl = url.parse(req.url, true)
        let index=(qs.parse(parseUrl.query)).id;
        if(req.method === 'GET'){
            productController.showFormUpdate('./views/products/update.html',req,res,index)

            //lay du lieu tu bang
            // productModel.findProductByID(index)
            //     .then(result => {
            //         console.log(result)})



        }else {
            // lay du lieu tu form tra ve gom 2 bang product+typeProduct
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', () => {
                const product = qs.parse(data)
                //cap nhat trong database product
                console.log(product)


                productModel.updateProduct(product.name, product.price,product.typeProduct,index)
                    .then(result => {
                            res.writeHead(301,{location:'/admin'})
                            res.end();
                        }
                    )
                    .catch(err => {
                        throw new Error(err.message)
                    })
            })
        }
    }


}