require('dotenv').config();
const express = require("express");
const app = express();
const request = require("request");
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");


app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: process.env.apiKeyEnc,
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: process.env.serverKey,
});

app.post("/", function (req, res) {
  //html body-parser
  const firstName = req.body.fName;
  const secondName = req.body.lName;
  const email = req.body.theEmail;
  //*****************************ENTER YOU LIST ID HERE******************************
  const listId = process.env.listIdKey;
  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email,
  };

  //console.log(firstName, secondName, email);
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
  //Running the function and catching the errors
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
