const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    console.log("root route.");
    response.send("the route for the site's root /.");
});

app.get('/html', (request, response) => {
    const filePath = path.join(__dirname, 'views/index.html');
    response.sendFile(filePath);
});

app.post('/generateToken', (req, res) => {
    const username = req.body.username;
    const token = generateToken(username);
    res.send(`Token generated for ${username}: ${token}`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function generateToken(username) {
    const token = uuidv4();
    return token;
}

