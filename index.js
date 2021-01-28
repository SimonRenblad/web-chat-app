const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const mongo = require('./config/mongo');
const io = require('./controllers/io');

// import routers
const router = require('./routes/router');







const http = require('http');
const server = http.Server(app);

// connect to mongo
let db = mongo();

// define the database connection to be accessible to routers and controllers
app.locals.db = db;

// define middlewares
app.use(cors())
app.use(bodyParser.json())

// set routes
app.use("/api/", router);
io(server, db);

// start the server
app.use(express.static(__dirname + '/chat-app/dist/chat-app'));
app.use("/images", express.static(__dirname + '/images'));
// const port = 3000;
// app.listen(port, () => console.log(`Server listening on port ${port}`));



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
 });


