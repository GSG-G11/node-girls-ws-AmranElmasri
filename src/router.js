
const fs = require("fs");
const path = require("path")
const querystring  = require("querystring");
const publicHandler = require('./handlePublic')


const router = (request, response) => {
    const endPoint = request.url;
    const method = request.method;
    if(endPoint== "/"){
        publicHandler('/public/index.html',response)
    }
    else if(endPoint == "/public/main.css"){
        publicHandler(endPoint,response)
    }
    else if(endPoint== "/public/img/logo1.png"){
        publicHandler(endPoint,response)
    }
    else if(endPoint== "/public/script.js"){
        publicHandler(endPoint,response)
    }
    else if (endPoint === '/posts' && request.method === 'GET'){
        const filePath = path.join(__dirname , 'posts.json')
        fs.readFile(filePath , (err,data)=>{
            if(err){
                response.writeHead(500)
                response.end('ERROR IN THE SERVER')
            }else {
                response.writeHead(200 , {'content-type': 'text/javascript'})
                response.end(data)
            }
        })
    }
    else if(endPoint === '/public/img/logo2.png'){
        publicHandler(endPoint,response)
    }

    else if(endPoint == "/create-post" && request.method === 'POST'){
            let allTheData = '';
            request.on('data', chunkOfData => {
                allTheData += chunkOfData;
            });
            request.on('end', () => {
                const convertedData = querystring.parse(allTheData);
                const jsonPath = path.join(__dirname , "posts.json")
                fs.readFile(jsonPath , 'UTF8' , (err,data)=>{
                    if(err){
                        response.writeHead(500)
                        response.end("ERROR IN THE SERVER")
                    }
                    else{
                        const obj = JSON.parse(data);
                        obj[Date.now()] = convertedData.post;
                        fs.writeFile(jsonPath , JSON.stringify(obj) , err =>{
                            if(err){
                                response.writeHead(500)
                                response.end("ERROR IN THE SERVER")
                            }
                        })
                        response.writeHead(302,{Location:'/'})   //redirection
                        response.end();
                    }
                })
            });
    }
    else { 
        response.writeHead(404)
        response.end("Not found");
    }
 }



 module.exports = router