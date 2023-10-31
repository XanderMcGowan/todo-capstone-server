let db = require("./db");

let argon = require("argon2");

let jwt = require("jsonwebtoken")

let todos = function (req, res) {
  let username = req.params.username;
  let sql = "select id, name, checked from todos where username = ?";
  let params = [username];

  db.query(sql, params, function(err, results){
    if(err){
        console.log("todos not found", err)
        res.sendStatus(500)
    } else {
        res.json(results)
    }
  });
};

let deleteEntry = function (req, res) {
  let id = req.params.id
  let sql = "delete from todos where id = ?"
  let params = [id]


  db.query(sql, params, function(err, results){
    if(err){
      console.log("you can't even delete a todo off your list, err")
      send.sendStatus(500)

    } else {
      res.sendStatus(204)
    }
  })

};


let login = function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let sql = "select hash from users where username = ?";
  let params = [username];

  db.query(sql, params, async function (err, results) {
    let storedHash;

    if (err) {
      console.log("Failed to fetch hash for user", err);
    } else if (results.length > 1) {
      console.log("error", username);
    } else if (results.length == 1) {
      storedHash = results[0].hash;
    }

    try {
      let pass = await argon.verify(storedHash, password);
      if (pass) {
        let token = {
          id: results[0].id,
          username: username,
        };
        let signedToken = jwt.sign(token, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });

       return res.json(signedToken);
        
    
      } else {
        return res.sendStatus(401);
        
      }
    } catch (err) {
      console.log("failed to verify hash", storedHash, err);

      return;
    }
  });
};



let register = async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (!username) {
    res.status(400).json("username is required");
    return;
  }

  let hash;
  try {
    hash = await argon.hash(password);
  } catch (err) {
    console.log("Failed to has the password");
    res.status(500);
    return;
  }

  let sql = "insert into users (username, hash) values (?,?)";
  let params = [username, hash];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed", err);
    } else {
      res.status(204);
    }
  });
};

let updateEntry = function (req, res) {
  let id = req.params.id
  let name = req.body.name

  let sql = "update todos set name = ? where id = ?";
  let params = [name, id]

  db.query(sql, params, function(err, results){
    if(err){
      console.log(params)
      console.log("unable to update todo")
      res.sendStatus(500)
    } else {
      res.sendStatus(204)
    }
  })
};

let updateChecked = function (req, res) {
  let id = req.params.id
  let checked = req.body.checked

  let sql = "update todos set checked = ? where id = ?";
  let params = [checked, id]

  db.query(sql, params, function(err, results){
    if(err){
      console.log(params)
      console.log("unable to update todo")
      res.sendStatus(500)
    } else {
      res.sendStatus(204)
    }
  })
};

let addEntry = function (req, res) {
  let username = req.body.username
  let id = req.body.id
  let name = req.body.name
  let checked = req.body.checked

  let sql = "insert into todos (username, id, name, checked) values (?,?,?,?)"
  let params = [username, id, name, checked]


  db.query(sql, params, function(err, results){
    if(err){
      console.log("unable to post todo", err)
      send.sendStatus(500)

    } else {
      res.sendStatus(204)
    }
  })
};

module.exports = {
  todos,
  deleteEntry,
  register,
  login,
  updateEntry,
  addEntry,
  updateChecked
};