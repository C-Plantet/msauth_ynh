let express = require('express')
let app = express()

app.get('/my_webapp_node', function(req, res) {

    res.send('HelloWorld')
    
});


app.listen(5000,() => {
    console.log(`Example app listening at port 5000`)
});