// const emailLookUp = (email, users) => {
//   for (let key in users) {
//     if (users[key].email === email) {
//       return true;
//     }
//   }
//   return false;
// };

function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2, 10);
  return randomString;
}
const urlsForUser = (id, urlDatabase) => {
  let filterDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filterDatabase[key] = urlDatabase[key];
    }
  }
  return filterDatabase;
};
const getUserByEmail = (email, users) => {
  for (let key in users) {
    const user = users[key];
    if (users[key].email === email) {
      return user;
    }
  }
  return null;
};

// function will compare email that client is entering to the email in the users database

module.exports = {
  urlsForUser,
  getUserByEmail,
  generateRandomString,
};
