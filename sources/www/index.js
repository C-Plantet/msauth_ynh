let express = require('express')
let app = express()

app.get('/', function(req, res) {

    res.send('HelloWorld')
    
});


app.listen(443,() => {
    console.log(`Example app listening at port 5000`)
});