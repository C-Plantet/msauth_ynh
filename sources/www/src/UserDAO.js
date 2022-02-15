const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
var generator = require('generate-password');
let sqlite3 = require('sqlite3').verbose();
let User = require('./model/User.js')
let Promise = require('bluebird')
let Users = require('./model/Users.js')
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
const { json } = require('body-parser');

class UserDAO{

    constructor(project) {
        let nom = String(project) + ".db"
        this.allUsers = null
        console.log(nom)
        this.db = new sqlite3.Database(path.resolve(__dirname,nom),err => {
            if (err){
                throw err
            }
        });
    }

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