const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
var generator = require('generate-password');
let sqlite3 = require('sqlite3').verbose();
let Promise = require('bluebird')
const fs = require('fs');
const { Console } = require('console');
const { json } = require('body-parser');
const UserDAO = require('./UserDAO.js');
const log = require('./Logger.js')
const logger = log.logger

/**
 * Classe PasswordDBService contenant les fonctions nécéssaires à la création et à l'obtention d'informations dans la BDD 
 */

class PasswordDBService{

    /**
     * Constructeur appelant le DAO permettant la communication avec la base de données passée en paramètres
     * @param {String} project Nom du projet et token associés à la requête
     * @param {String} type Type de la requête
     */
    constructor(project,type){

        this.dao = undefined

        if(type==="creation"){  //Cas de création d'une BDD

            this.dao = new UserDAO(project)

            try{
                this.dao.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,firstName TEXT,surname TEXT,username TEXT UNIQUE,password TEXT,admin INTEGER)").then(()=>{
                    logger.info('Database successfully created !')
                })
                
            }
            catch{
                logger.error('Error during database creation !!!')
            }

        }

        else if(type==="query"){  //Cas d'une requête sur BDD existante

            let nom = String(project) + ".db"
            console.log(`${__dirname}/${nom}`)
            if(fs.existsSync(`${__dirname}/${nom}`)){        
                this.dao = new UserDAO(project)
            }
            else{
                logger.error('DB not found')
            }
            

        }
        
	}


    idCounter=0;

    /**
     * Fonction permettant de comparer les valeurs d'authentification de l'utilisateur à celles de la BDD
     * @param {String} username Username de l'utilisateur se connectant
     * @param {String} password Mot de passe de l'utilisateur se connectant
     * @returns user
     */
    async getUserByUsernamePassword(username,password){
        
        return this.dao.get('SELECT * FROM users WHERE username = ? AND password = ?',[username,password])  // Verification combinaison user/pwd
    }

    /**
     * Fonction permettant de récupérer les informations d'un utilisateur à partir de son pseudo
     * @param {String} username Username de l'utilisateur dont on veut récupérer les informations
     * @returns user
     */
    async getUserByUsername(username){
        
        return this.dao.get('SELECT * FROM users WHERE username = ?',[username])
    }

    /**
     * Fonction permettant de récupérer tous les utilisatuers de la BDD d'un projet
     * @returns list of users
     */
    async getAll(){
        return this.dao.all('SELECT * FROM users')
    }


/**
 * Fonction ajoutant un utilisateur dans la base de donnée d'un projet
 * @param {String} firstName Prénom de l'utilisateur à ajouter
 * @param {String} surname Nom de l'utilisateur à ajouter
 * @param {String} username Pseudo de l'utilisateur à ajouter
 * @param {String} pwd Mot de passe haché de l'utilisateur à ajouter
 * @param {Integer} admin Statut d'administrateur
 */
    async createUser(firstName,surname,username,pwd,admin){
        
        try{
        
            this.dao.run(`INSERT INTO users (firstName,surname,username,password,admin) VALUES(?,?,?,?,?)`, [firstName,surname,username,pwd,admin]).then(()=>{
                logger.info("User succesfully created")
            })
        }
        
        catch{
            logger.error("Error while adding user !!")
        }
    }

 /**
  * Fonction permettant de récupérer tous les utilisateurs d'un projet
  * @returns list of user
  */
    getAllUsers(){
        
        try{
            let list = (this.dao.all("SELECT * FROM users"))
            return list
        }

        catch{
            logger.error("Error while getting all users")
        }
        
          
    }


/**
 * Fonction permettant la suppression d'un utilisateur à partir de son pseudo
 * @param {String} username Pseudo de l'utilisateur à supprimer
 */
    async deleteUser(username){
        
        try{
            this.dao.run("DELETE FROM users WHERE username = ?",[username])
            logger.info("User successfully deleted")
        }
        catch{
            logger.error("Error while deleting user")
        }
        
    }

}

module.exports = PasswordDBService;