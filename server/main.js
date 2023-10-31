let express = require("express")

let cors = require('cors')
let app = express()

require("dotenv").config()


app.use(express.json({ extended: false }));
app.use(cors())

let routes = require("./src/routes")

app.use(routes)

let PORT = process.env.PORT || 3306

app.listen(PORT, function(){
    console.log("TODO app start on port", PORT)
})
