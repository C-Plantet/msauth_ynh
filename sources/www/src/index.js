const port = 2000;
let express = require('express');
let bodyParser = require('body-parser')
let sqlite3 = require('sqlite3').verbose();
let PasswordDBService = require('./PasswordDBService.js');
const User = require('./model/User.js');
const methodOverride = require('method-override');
const PasswordDBServices = require('./PasswordDBServices.js')

let app = express();

const log = require('./Logger.js');
const logger = log.logger;



app.set('view engine',"ejs");
app.set('views','view');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(methodOverride('_method'));

app.post('/ms/initDB',function(req,res){

    data = JSON.parse(JSON.stringify(req.body))
    console.log(data["ProjectToken"])
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`)

    res.send("Success");

});


app.post('/ms/inscription', function(req, res) {
    
    data = JSON.parse(JSON.stringify(req.body))
    console.log(data)

    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,"creation")

    setTimeout(() => {  

        passwordDBService.getUserByUsername(data["username"]).then((user)=>{

    
            if (user!==undefined){
                res.send("Failed");
            }
    
            else{
    
                passwordDBService.createUser(data["name"],data["surname"],data["username"],data["pwd"],data["admin"]).then(()=>{
                
                    passwordDBService.getAllUsers().then((list)=>{
                        
                        res.send(list)
                    })  
            
                })
            }
        })

     }, 10);
    
    
    
});

app.post('/ms/connection',function(req,res){

    data = JSON.parse(JSON.stringify(req.body))
    console.log(data)
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,'query')

    if(passwordDBService.dao != undefined){
        passwordDBService.getUserByUsernamePassword(data["username"],data["pwd"]).then((user)=>{
            console.log(user)
            if(user==undefined){
                logger.info("user not found")
                res.send("User not found")
            }
            else{
                logger.info("user found")
                console.log(user)
                res.send(user)
            }
        })
    }

    else{
        res.send("DB not found")
    }

})

app.post("/ms/user",function(req,res){

    data=JSON.parse(JSON.stringify(req.body))
    console.log(`${data["ProjectName"]}_${data["ProjectToken"]}`)
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,'query')
    if(passwordDBService.dao != undefined){
        passwordDBService.getAll().then((donnee)=>{
            console.log(donnee)
            res.json(donnee)
        })
    }

});

app.get('/ms/helloworld', function(req,res){
    res.send("hello")
});



app.delete('/mdp/:name',function(req,res){

    let data = JSON.parse(JSON.stringify(req.body))
    let passwordDBService = new PasswordDBService(nom)

    passwordDBService.deleteUser(data["idUser"]).then(()=>{

        res.send("User succesfully deleted")

    });

});


app.listen(port,() => {
    console.log(`Example app listening at port 2000`)
    logger.info('Server HTTP successfully started')
})

