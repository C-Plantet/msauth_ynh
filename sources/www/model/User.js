
class User{
    constructor(id,name,surname,username,password,admin){
        if(undefined != id){
            this.id = id 
        }

        if(undefined != name){
            this.name = this.name 
        }

        if(undefined != surname){
            this.surname = this.surname 
        }


        if(undefined != username){
            this.username = username;
        }

        if(undefined != password){
            this.password = password;
        }

        if(undefined!= admin){
            this.admin=admin
        }
    }

    toString(){
        return "Id : "+String(this.id) +"   Pseudo : "+String(this.username)+"   Mdp : "+String(this.password)
    }
}

module.exports= User;