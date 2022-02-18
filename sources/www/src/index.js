const port = 2000;
let express = require('express');
let bodyParser = require('body-parser')
let sqlite3 = require('sqlite3').verbose();
let PasswordDBService = require('./PasswordDBService.js');
const methodOverride = require('method-override');


let app = express();

const log = require('./Logger.js');
const logger = log.logger;



app.set('view engine','ejs');
app.set('views', __dirname + '/view');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(methodOverride('_method'));

/**
 *   
 *  Route permettant l'inscription d'un utilisateur via un JSON issu du formulaire PHP
 * 
 */

app.post('/ms/inscription', function(req, res) {
    
    data = JSON.parse(JSON.stringify(req.body))
    console.log(data)

    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,"creation")  // On intérroge la BDD avec les informations l'identifiant

    setTimeout(() => {  // Timeout si la BDD n'existe pas le temps de la créer 

        passwordDBService.getUserByUsername(data["username"]).then((user)=>{

    
            if (user!==undefined){
                res.send("Failed");     // Cas où l'utilisateur existe déjà 
            }
    
            else{
    
                passwordDBService.createUser(data["name"],data["surname"],data["username"],data["pwd"],data["admin"]).then(()=>{  //Création de l'utilisateur
                
                    passwordDBService.getAllUsers().then((list)=>{   //On récupère les utilisateurs       
                        
                        res.send(list)     
                    })  
            
                })
            }
        })

     }, 500);
    
    
    
});

/**
 * 
 * Route permettant la connexion d'un utilisateur via un JSON issu du formulaire PHP
 * 
*/

app.post('/ms/connection',function(req,res){

    data = JSON.parse(JSON.stringify(req.body))
    console.log(data)
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,'query') // On récupère la BDD associée au projet

    if(passwordDBService.dao != undefined){
        passwordDBService.getUserByUsernamePassword(data["username"],data["pwd"]).then((user)=>{  // Méthode d'authentification
            console.log(user)
            if(user==undefined){
                logger.info("user not found")   // Cas où l'utilisateur existe pas
                res.send("User not found")
            }
            else{
                logger.info("user found")
                console.log(user)   // Cas où l'utilisateur existe, on le retourne pour pouvoir stocker ses informations dans l'objet session de PHP
                res.send(user)
            }
        })
    }

    else{
        res.send("DB not found")
    }

})

/**
 * 
 * Route permettant de récupérer les utilisateurs inscrits sur un projet
 * 
 */

app.post("/ms/user",function(req,res){

    data=JSON.parse(JSON.stringify(req.body))
    console.log(`${data["ProjectName"]}_${data["ProjectToken"]}`)
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,'query') // On récupère la BDD associée au projet 
    if(passwordDBService.dao != undefined){
        passwordDBService.getAll().then((donnee)=>{
            console.log(donnee)
            res.json(donnee)
        })
    }

});

/**
 * Route par défaut permettant d'afficher le manuel d'utilisation du microservice
 */

app.get('/ms', function(req,res){
    res.render('Manuel_Utilisation_Authentification')
});


/**
 * Route permettant de supprimer un utilisateur de la base de données
 */


app.delete('/ms/del',function(req,res){

    let data = JSON.parse(JSON.stringify(req.body))
    console.log(data)
    let passwordDBService = new PasswordDBService(`${data["ProjectName"]}_${data["ProjectToken"]}`,'query') // On récupère la BDD associée au projet

    passwordDBService.deleteUser(data["name"]).then(()=>{

        res.send("User succesfully deleted")

    });

});


app.listen(port,() => {
    console.log(`Example app listening at port 2000`)   //Ecoute du microservice sur le port 2000
    logger.info('Server HTTP successfully started')
})

