const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
var generator = require('generate-password');
let sqlite3 = require('sqlite3').verbose();
let User = require('./model/User.js')
let Promise = require('bluebird')
let Users = require('./model/Users.js')
const fs = require('fs');
const { Console } = require('console');
const { json } = require('body-parser');
const UserDAO = require('./UserDAO.js');
const log = require('./Logger.js')
const logger = log.logger



class PasswordDBService{

    constructor(project,type){

        this.dao = undefined

        if(type==="creation"){

            this.dao = new UserDAO(project)

            try{
                this.dao.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,name TEXT,surname TEXT,username TEXT UNIQUE,password TEXT,admin INTEGER)").then(()=>{
                    logger.info('Database successfully created !')
                })
                
            }
            catch{
                logger.error('Error during database creation !!!')
            }

        }

        else if(type==="query"){

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

    generatePassword(){

        var generatedPassword = Math.random().toString(36).slice(-8);
        
        return generatedPassword;
    }

    async getUserByUsernamePassword(username,password){
        
        return this.dao.get('SELECT * FROM users WHERE username = ? AND password = ?',[username,password])
    }

    async getUserByUsername(username){
        
        return this.dao.get('SELECT * FROM users WHERE username = ?',[username])
    }

    async getAll(){
        return this.dao.all('SELECT * FROM users')
    }



    async createUser(name,surname,username,pwd,admin){
        
        try{
        
            this.dao.run(`INSERT INTO users (name,surname,username,password,admin) VALUES(?,?,?,?,?)`, [name,surname,username,pwd,admin]).then(()=>{
                logger.info("User succesfully created")
            })
        }
        
        catch{
            logger.error("Error while adding user !!")
        }
    }

    getAllUsers(){
        
        try{
            let list = (this.dao.all("SELECT * FROM users"))
            return list
        }

        catch{
            logger.error("Error while getting all users")
        }
        
          
    }

    async deleteUser(id){
        
        try{
            this.dao.run("DELETE FROM users WHERE id = ?",[id])
            logger.info("User successfully deleted")
        }
        catch{
            logger.error("Error while deleting user")
        }
        
    }

}

module.exports = PasswordDBService;