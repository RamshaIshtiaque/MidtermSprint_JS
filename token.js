const fs = require('fs');
const path = require('path');

const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

function tokenSearchUsername(username) {
    if (DEBUG) console.log('tokenSearchUsername()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error;   
        let tokens = JSON.parse(data);
        const userIndex = tokens.findIndex((user) => user.username === username);
        if (userIndex !== -1) {
            console.log(`User with username '${username}' has token: ${tokens[userIndex].token}`)
        }
    })
}

function tokenSearchEmail(email) {
    if (DEBUG) console.log('tokenSearchEmail()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error;   
        let tokens = JSON.parse(data);
        const userIndex = tokens.findIndex((user) => user.email === email);
        if (userIndex !== -1) {
            console.log(`User with email-id '${email}' has token: ${tokens[userIndex].token}`)
        }
    })
}

function tokenSearchPhone(phone) {
    if (DEBUG) console.log('tokenSearchPhone()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if (error) throw error;   
        let tokens = JSON.parse(data);
        const userIndex = tokens.findIndex((user) => user.phone === phone);
        if (userIndex !== -1) {
            console.log(`User with phone number '${phone}' has token: ${tokens[userIndex].token}`)
        }
    })
}

function tokenUpdateEmail(username, newEmail) {
    if (DEBUG) console.log('tokenUpdateEmail()');
  
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if (error) throw error;
  
      let tokens = JSON.parse(data);
  
      // Find the index of the user with the provided username
      const userIndex = tokens.findIndex((user) => user.username === username);
  
      if (userIndex !== -1) {
        // Update the email for the found user
        tokens[userIndex].email = newEmail;
  
        // Convert the updated array back to JSON
        const updatedTokens = JSON.stringify(tokens, null, 2);
  
        // Write the updated JSON back to the file
        fs.writeFile(__dirname + '/json/tokens.json', updatedTokens, (err) => {
          if (err) console.log(err);
          else {
            console.log(`Email updated for ${username}.`);
          }
        });
      } else {
        console.log(`User with username '${username}' not found.`);
      }
    });
  }
  

function tokenUpdatePhone(username, newPhone) {
    if (DEBUG) console.log('tokenUpdatePhone()');
  
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if (error) throw error;
  
      let tokens = JSON.parse(data);
  
      // Find the index of the user with the provided username
      const userIndex = tokens.findIndex((user) => user.username === username);
  
      if (userIndex !== -1) {
        // Update the phone number for the found user
        tokens[userIndex].phone = newPhone;
  
        // Convert the updated array back to JSON
        const updatedTokens = JSON.stringify(tokens, null, 2);
  
        // Write the updated JSON back to the file
        fs.writeFile(__dirname + '/json/tokens.json', updatedTokens, (err) => {
          if (err) console.log(err);
          else {
            console.log(`Phone number updated for ${username}.`);
          }
        });
      } else {
        console.log(`User with username '${username}' not found.`);
      }
    });
  }

function tokenCount() {
    if (DEBUG) console.log('tokenCount()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if (error) throw error;
      let tokens = JSON.parse(data);
      console.log(`Total number of tokens: ${tokens.length}`);
    });
}

function tokenList() {
  if(DEBUG) console.log('token.tokenCount()');
  fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if(error) throw error; 
      let tokens = JSON.parse(data);
      console.log('** User List **')
      tokens.forEach(obj => {
          console.log(' * ' + obj.username + ': ' + obj.token);
      });
   });
};

function newToken(username) {
  if(DEBUG) console.log('token.newToken()');
  let newToken = JSON.parse(`{
      "created": "1969-01-31 12:30:00",
      "username": "username",
      "email": "user@example.com",
      "phone": "5556597890",
      "token": "token",
      "expires": "1969-02-03 12:30:00",
      "confirmed": "tbd"
  }`);

  let now = new Date();
  let expires = addDays(now, 3);

  newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

  fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if(error) throw error; 
      let tokens = JSON.parse(data);
      tokens.push(newToken);
      userTokens = JSON.stringify(tokens);
  
      fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
          if (err) console.log(err);
          else { 
              console.log(`New token ${newToken.token} was created for ${username}.`);
          }
      })
      
  });
  return newToken.token;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function tokenApp() {
  if(DEBUG) console.log('tokenApp()');

  switch (myArgs[1]) {
  case '--count':
    if(DEBUG) console.log('--count');
      tokenCount();
      break;
  case '--list':
    if(DEBUG) console.log('--list');
      tokenList();
      break; 
  case '--new':
    if (myArgs.length < 3) {
        console.log('invalid syntax. node myapp token --new [username]')
    } else {
    if(DEBUG) console.log('--new');
    newToken(myArgs[2]);
    }
    break;
  case '--upd':
    if (myArgs[2] === 'p' && myArgs.length >= 5) {
        if(DEBUG) console.log('--upd p');
        tokenUpdatePhone(myArgs[3], myArgs[4]);
    } else if (myArgs[2] === 'e' && myArgs.length >= 5) {
        if(DEBUG) console.log('--upd e');
        tokenUpdateEmail(myArgs[3], myArgs[4]);
    } else {
        console.log('invalid syntax. node myapp token --upd [p/e] [username] [value]')
    }
    break; 
  case '--search':
    if (myArgs[2] === 'u' && myArgs.length >= 4) {
        if(DEBUG) console.log('--search u');
        tokenSearchUsername(myArgs[3]);
    } else if (myArgs[2] === 'e' && myArgs.length >= 4) {
        if(DEBUG) console.log('--search e');
        tokenSearchEmail(myArgs[3]);
    } else if (myArgs[2] === 'p' && myArgs.length >= 4) {
        if(DEBUG) console.log('--search p');
        tokenSearchPhone(myArgs[3]);
    } else {
        console.log('invalid syntax. node myapp token --upd [p/e] [username] [value]')
    }
    break; 
  case '--help':
  case '--h':
  default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
          if(error) throw error;              
          console.log(data.toString());
      });
  }
}

module.exports = {
  tokenApp,
}