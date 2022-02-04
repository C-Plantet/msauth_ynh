const path = require('path');
const fs = require('fs');

class PasswordDBServices{
    constructor(nom){

        this.DBs = new Array()

        fs.readdir('./', (err, files) => {
            files.forEach(file => {
                if (file.includes('.db')){
                    console.log(file)
                }
            });
          });
    }

    getDatabase(name){


    }
}


module.exports = PasswordDBServices