let express = require('express')
let app = express()

app.get('/', function(req, res) {

    res.json("Hi")
    
});


app.listen(5000,() => {
    console.log(`Example app listening at port 5000`)
});