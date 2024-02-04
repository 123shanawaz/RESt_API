const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { json } = require("body-parser");

const app = express();
const PORT = 3000;
// var bodyParser = require("body-parser");
// app.use(bodyParser);
app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = ` 
  <ul>
  
  ${users.map((users) => `<li>${users.first_name}<li/>`).join("")}
  <ul/>
  `;
  return res.send(html);
});

// REST - API

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.send(user);
});

app.post("/api/users/:id", (req, res) => {
  // Create a NewUser with id
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({
      status: "success",
    });
  });
});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { last_name } = req.body;
  const newUsers = users.map((user) => {
    if (user.id === id) {
      return { ...user, last_name };
    } else {
      return user;
    }
  });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(newUsers), (err, data) => {
    return res.json({ status: "successfully edited user", id });
  });
});

// Create a NewUser with id

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  //Find out the index of the user with above id from the array "users"
  const userIdx = users.findIndex((user) => user.id === id);

  //Get the deleted user object using splice. Mind we need to get the object and not array as returned by splice method, so '[0]' satisfies this requirement. The resulting object is just for the sake of displaying, you may neglect storing it if you don't want to display.
  const delUser = users.splice(userIdx, 1)[0];
  //   console.log(delUser);

  //Write the changes into the json file.
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", delUser });
  });
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
