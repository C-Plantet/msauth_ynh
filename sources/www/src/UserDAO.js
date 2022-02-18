const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
var generator = require('generate-password');
let sqlite3 = require('sqlite3').verbose();
let Promise = require('bluebird')
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
const { json } = require('body-parser');


/**
 * Classe d'objet d'accès aux données.
 */
class UserDAO{

    /**
     * Constructeur accèdant à la base de données associée au projet
     * @param {String} project Nom du projet et token associés à la requête
     */
    constructor(project) {
        let nom = String(project) + ".db"
        this.allUsers = null
        console.log(nom)
        console.log(__dirname)

        if (fs.existsSync(`${__dirname}/${nom}`)) {

          console.log("Hello")
          this.db = new sqlite3.Database(path.resolve(__dirname,nom),sqlite3.OPEN_READWRITE,err => {  // Si la BDD existe on y accède en lecture et ecriture
              if (err){
                  throw err
              }
          });
        }

        else{
          console.log("Works")
          this.db = new sqlite3.Database(path.resolve(__dirname,nom),err => {     // Si la BDD exitse on y accède en lecture et ecriture et création
            if (err){
                throw err
            }
        });

        }
    }

    /**
     * Fonction permettant l'exécution d'une requête vers la BDD
     * @param {String} sql Requête SQL à exécuter
     * @param {Array} params Paramètres à passer dans la requête
     * @returns promise
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
                console.log('Error running sql ' + sql)
                console.log(err)
                reject(err)
            } else {
                resolve({ id: this.lastID })
            }
          })
        })
    }

    /**
     * Fonction permettant de récupérer un tuple unique dans la BDD
     * @param {String} sql Requête SQL à exécuter
     * @param {Array} params Paramètres à passer dans la requête
     * @returns user
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
    }

    
    /**
     * Fonction permettant de récupérer tous les tuples qui matchent dans la BDD
     * @param {String} sql Requête SQL à exécuter
     * @param {Array} params Paramètres à passer dans la requête
     * @returns list of users 
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
    }


}

module.exports = UserDAO