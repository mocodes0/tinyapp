const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helper");
const bcrypt = require("bcryptjs");
const express = require("./node_modules/express");
const app = express();
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
// app.use(cookieParser()); // Cookies Parser
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
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

// USER INFO TEMPLATE-----------------------------------------------------

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("66", 10),
  },
};

// Home Page ----------------------------------------------------------------
app.get("/urls", (req, res) => {
  if (!users[req.session.id]) {
    res.redirect("/login");
    return;
  }

  let obj1 = {};
  const loginID = req.session.id;
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === loginID) {
      obj1[i] = urlDatabase[i];
    }
  }
  let templateVars = {
    urls: obj1,

    user: users[req.session["id"]],
    //username: req.cookies["id"],
  };
  res.render("urls_index", templateVars);
});

//New URL Creation----------------------------------------------------------------
app.get("/urls/new", (req, res) => {
  if (!users[req.session.id]) {
    res.redirect("/login");
    return;
  }
  let templateVars = {
    user: users[req.session["id"]],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let individualURL = urlsForUser(req.session.id, urlDatabase);
  if (individualURL[req.params.shortURL]) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      username: users[req.session.id].email,
      user: users[req.session["id"]],
    };
    res.render("urls_show", templateVars);
    return;
  } else {
    res.status(400).send(" URL does not exist ");
  }
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.session.id,
  };
  res.redirect("/urls/" + shortURL);
});

// Edit & Deleting URL ----------------------------------------------------------------

app.post("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(400).send(" URL does not exist ");
    return;
  }

  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
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
    user: users[req.session.id],
    // user: null
  };
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let url = urlDatabase[req.params.shortURL];
  if (!url) {
    res.status(400).send(" URL does not exist ");
    return;
  }
  res.redirect(url.longURL);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(password);
  if (email === "" || password === "") {
    res.status(404);
    res.send("Email and Password cannot be blank");
  }
  // We are checking to see if the email exists in the database

  const user = getUserByEmail(email, users);
  // if the email exists we need to make sure the password the user inputs is the same as the on in database

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session["id"] = user.id;
    res.redirect("/urls"); // if yes then redirect to urls Page
    return;
  }
  // if the email exists but password is wrong tell them to type in correct
  else if (user && !bcrypt.compareSync(password, user.password)) {
    res.status(401);
    res.send("Your Password is incorrect. Please try again");
  } else {
    res.status(401);
    res.send("Cannot find email on the Database");
  }

  // if not tell them register as we cant find email in DB

  res.status(400);
  res.send("Login failed");
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
}); // Login Logout Fix

// -----------------------Registration Template -----------------------

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.id],
    user: null,
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
  } else if (getUserByEmail(email, users)) {
    res.status(400).send("Email already exists. Please login!!");
  } else {
    users[userID] = {
      id: userID,
      email: email,
      password: bcrypt.hashSync(password, 10),
    };
    console.log(users);
    req.session.id = userID;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
