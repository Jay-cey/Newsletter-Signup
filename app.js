const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address : email,
                status : 'subscribed',
                merge_fields : {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);


    const listG = process.env.LIST;
    const url = `https://us21.api.mailchimp.com/3.0/lists/${listG}`;


    const apiKey = process.env.API_KEY;

    const options = {
        method: 'POST',
        auth: `Jay:${apiKey}`
    };

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        } else if(response.statusCode !== 200){
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
    

    console.log(fName + ' ' + lName + ' ' + email);
});

app.post('/failure', function(req, res){
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000"); 
});

 