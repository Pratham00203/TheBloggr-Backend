const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const { check, validationResult } = require("express-validator");
const cors = require("cors");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended : true}));
app.use(cors());


// Define Routes
// Using the js files in the routes/api
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/blogs", require("./routes/blogs"));
app.use("/comments", require("./routes/comments"));

app.get("/", (req, res) => {
  res.send("Running");
});


app.listen(PORT, () => console.log(`Server Listening at Port ${PORT}`));
