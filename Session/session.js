const fs = require("fs");
const cookie=require("cookie");
const {resolve} = require("url");
module.exports = class Session {

    constructor() {
    }

   static createRandomIDSession(number) {
        const bigString = "abcdefjhijklmnopqrstuvwyz0123456789"
        let IDSession = ''
        if (typeof number === "number" && number > 0) {
            for (let i = 0; i < number; i++) {
                IDSession += bigString.charAt(Math.floor(Math.random() * bigString.length))
            }
        }
        return IDSession;
    }

    static createDataSession(nameForm, passForm){
        return {name:nameForm,pass:passForm,expires:Date.now()+60*60*24*7}
    }

    static  createSession(IDSession,DataSession){
        return {IDSession:IDSession,DataSession:DataSession}
    }

    static writeCookieClient(cookieData, res){
         res.setHeader('Set-Cookie',cookie.serialize('cookie_user',JSON.stringify(cookieData),{
             httpOnly:true,
             maxAge:60*60*24*7
         }))

    }


    static writeSessionSever(PathFile,Session){
             fs.writeFile(PathFile, JSON.stringify(Session), err => {
                 if (err) {
                     throw err
                 }
         })
    }

    static deleteSession(IDSession){






    }




}