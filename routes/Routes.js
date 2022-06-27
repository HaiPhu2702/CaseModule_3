
const productController = require('../controller/productControler')



module.exports={
    "404":productController.errorPage,

    "login":productController.login,
    "login/signup":productController.signup,
    "admin/logout":productController.logout,

    "admin":productController.showAdminPage,
    "products/create":productController.addProduct,
    "products/delete": productController.deleteProduct,
    "products/update":productController.updateProduct,


    "user":productController.showUserPage,
    "user/order":productController.order


}