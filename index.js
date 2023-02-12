const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

const User = require("./models/User");

app.get("/users", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ error: "No users found" }));
});

app.post("/users", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  newUser
    .save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json({ error: "Unable to add user" }));
});

app.put("/users/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    },
    { new: true }
  )
    .then(user => res.json(user))
    .catch(err => res.status(400).json({ error: "Unable to update user" }));
});

app.delete("/users/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.json({ success: "User removed successfully" }))
    .catch(err => res.status(404).json({ error: "No user found" }));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
