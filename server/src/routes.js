let express = require("express")

let router = express.Router()

let controller = require("./controller")

let authsMiddleware = require("./middleware")

// route to get all todos
router.get("/todos/:username", controller.todos)

router.delete("/todos/:id",controller.deleteEntry)

router.post("/login", controller.login)

router.post("/register",controller.register)

router.post("/todos",controller.addEntry)

router.post("/todos/:id",controller.updateEntry)

router.put("/todos/:id",controller.updateChecked)

module.exports = router;