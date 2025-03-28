require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const { home, uploadFile, view, uploadPage } = require('./controller/controller')

app.get("/", home)
app.post('/upload', uploadFile)
app.get('/view', view)
app.get('/upload', uploadPage)


app.listen(3000, () => console.log("Server running on port 3000"));