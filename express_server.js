const express = require("./node_modules/express");
const app = express();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8081;

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: "" };
  res.render("urls_show", templateVars); // Page of a Single URL
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: "" };
  res.render("urls_show", templateVars); // Page of a Single URL
});

function generateRandomString() {
  let url = "";
  const characterSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    url += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
  }
  return url;
}
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); // test
