const {createServer} = require('http');
const {Server} = require('socket.io')
const url = require('url');
const port = 8080
;
const router = require('./routes/Routes');
const fs = require("fs");

let mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "jpeg": "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png"
};
const httpServer=createServer((req, res) => {


    const filesDefences = req.url.match(/\.js$|.css$|.jpg$|.png$/)
    if(filesDefences){
        const tail=mimeTypes[filesDefences[0].toString().split('.')[1]]
        res.writeHead(200,{"Content-Type":tail })
        fs.createReadStream(__dirname + req.url).pipe(res);
    }else{
        const parseUrl = url.parse(req.url, true)
        let pathName = parseUrl.pathname;
        const trimPath = pathName.replace(/^\/+|\/+$/g, '');
        const chooseHandler = ((typeof router[trimPath]) !== "undefined") ? router[trimPath]:router[404];
        chooseHandler(req, res);
    }}).listen(port, () => {
    console.log("server listening http://localhost:" + port)
})

const io=new Server(httpServer);

io.on('connection',socket => {
    socket.on('chat',messageChat => {
        console.log(messageChat)
        socket.broadcast.emit('userChat',messageChat)
    })

    socket.on('adminAnswer',adminAnswer=>{
        console.log(adminAnswer)
        socket.broadcast.emit('adminAnswer1',adminAnswer)
    })

    //  socket.on('adminAnswer',adminAnswer=>{
    //
    //     socket.broadcast.emit('adminAnswer',adminAnswer)
    // })


})





