const express = require("express");
const app = express();
const mainpg = require("./mainpg");
var path = require("path");

const port = 1337;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // needed

app.get("/", (req, res, next) => {
  // not needed
  try {
    // res.sendFile(path.join(__dirname, "index.html"));
    res.send(mainpg());
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`App listening in port ${port}`);
});
