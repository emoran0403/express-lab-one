const exp = require("constants");
const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

let app = express();

// app.use(express.json()); // makes sure we interpret req.body as json data

//* middleware to log the URL from every request
// the wildcard route ensures this is hit on each and every call
// app.get("*", (req, res, next) => {
//   try {
//     console.log(`Request from URL >${req.originalUrl}<`); // log it to the console
//     fs.appendFileSync("log.txt", `Request from URL >${req.originalUrl}< \n`);
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

//! Andrew, this there any major differences between this and the above middleware?

//! there was also an issue with using appendFile, it was saying something about the callback.  i copied exactly what was done in the lecture and it was giving me that error

//! how can i use the non-synchronous versions of appendfile and writefile?

app.use((req, res, next) => {
  try {
    console.log(`middleware 2 >${req.originalUrl}<`);
    fs.appendFileSync("log.txt", `middleware 2 >${req.originalUrl}< \n`);
    next();
  } catch (error) {
    console.log(error);
  }
});

//* serve up all the files in the public directory
// this is above the '/' route, so it will take precedence
app.use(express.static(path.join(__dirname, "../public")));

// we have a get and a post request for the same '/' route, which is ok, since they're different requests
app.get("/", (req, res) => {
  try {
    res.send("Hello from the web server side...");
  } catch (error) {
    console.log(error);
  }
});

app.use(bodyParser.urlencoded({ extended: false })); // this lets me use req.body to get the contents of my form nicely

app.post("/", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  try {
    fs.writeFileSync("formData.json", JSON.stringify({ firstName, lastName }));
    res.send(`Successfully submitted!`);
  } catch (error) {
    console.log(error);
  }
});

app.get("/pokemon", (req, res, next) => {
  try {
    res.send("Welcome to the Pokemon Page!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/pokemon/:id", (req, res, next) => {
  try {
    let pokemonID = req.params.id;
    if (pokemonID <= 0 || pokemonID > 899) {
      res.send(`You requested the Pokemon with ID: ${pokemonID}, unfortunately that Pokemon is not listed in the National Pokedex.  Get out there and go discover it!`);
    } else {
      res.send(`You requested the Pokemon with ID: ${pokemonID}`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/formsubmissions", (req, res, next) => {
  try {
    res.send(fs.readFileSync("formData.json")); // this appears as an automatic file download upon reaching this route
  } catch (error) {
    console.log(error);
  }
});

//**this is super tedious the more files you need to send, so we use express.static to serve a directory's worth with one req
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public.index.html"));
// });

// app.get("/css/styles.css", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/css/styles.css"));
// });

app.listen(3000, () => console.log("server up and running!"));

//todo wrap each request within a try catch block
