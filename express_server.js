const express = require("./node_modules/express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // Cookies Parser
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8080;

// URL Database ----------------------------------------------------

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// USER INFO TEMPLATE

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// Home Page ----------------------------------------------------------------
app.get("/urls", (req, res) => {
  let obj1 = {};
  const loginID = req.cookies.id;
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === loginID) {
      obj1[i] = urlDatabase[i];
    }
  }
  let templateVars = {
    urls: obj1,
    username: req.cookies["id"],
  };
  res.render("urls_index", templateVars);
});

//New URL Creation----------------------------------------------------------------
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: req.cookies["id"],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.cookies.id,
  };
  res.redirect("/urls/" + shortURL);
});

// Edit & Deleting URL ----------------------------------------------------------------

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Logging in & Out----------------------------------------------------------------

app.get("/login", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id],
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  const password = req.body.password;
  console.log(password);
  for (let key in users) {
    if (users[key].email === email && users[key].password === password) {
      res.cookie("id", key);
      res.redirect("/urls");
    }
  }
  res.status(400);
  res.send("Login failed");
});
app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/urls");
}); // Login Logout Fix

// -----------------------Registration Template -----------------------

app.get("/register", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id],
  };
  res.render("urls_registration", templateVars);
});
// Email check & error message

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.status(404);
    res.send("Email and Password cannot be blank");
  } else if (emailLookUp(email, users)) {
    res.status(400).send("Email already exists. Please login!!");
  } else {
    users[userID] = {
      id: userID,
      email: email,
    };
    console.log(users);
    res.cookie("id", userID);
    res.redirect("/urls");
    // res.clearCookie("username", username)
  }
});
// ---------------- Email

const emailLookUp = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
};

// Random String Generation

function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
