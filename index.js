const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Declarations for Front-end Authentication
const fs = require('fs');
const parse = require('xml-parser');
const xml = fs.readFileSync('authfile.xml','utf8');
const parseString = require('xml2js').parseString;


//A module for allowing endpoints to be exposed on public
const cors = require('cors');

var port = process.env.PORT || 4300;

const axios = require('axios');

app.use(bodyParser.json());

app.use(cors());

//An enpoint that requests Weather conditions from Service2
app.post('/service1', (req, res) => {
	
	     console.log("Running service1");
		 
		 let locationInformation = {
			 
			  locationName: req.body.locationName 
			 
		 }
		 
		 axios.post("https://service2-weather.herokuapp.com/service2",locationInformation)
			 .then(response =>{
				 
				 
				 res.send(response.data);
				 
			 }).catch(error =>{
				 
				   if(error.data)
					{
						
						res.send(error.data.Message);
						
					}else{
						
						res.send("An unexpected error occured. Please try again later.");
					}
				 
				 
			 })
	
	
	
})

//Front-end authentication
app.post('/auth', (req, res) => {
	
			console.log("Auth....");

			onAuthenticate(req.body).then(data =>{
				
				console.log(data);
				res.send(data);
				
			}).catch(error=>{
				
				console.log(error);
				res.send(error);
				
			})
	
})

function onAuthenticate(userCredentials)
{
	
		let promise = new Promise((resolve, rejevt)=>{
			
			
			parseString(xml, function (err, result) {
				console.log(result.users.user);
				 let hasFound = false;
				if(result)
				{
					for(let i = 0; i< result.users.user.length ; i++ ){
				
					
					if(result.users.user[i].password[0] == userCredentials.password)
					{
						if(result.users.user[i].email[0] == userCredentials.email)
						{
							
							hasFound = true;
							
						}
						
						
						
					}
					
				  }
				  
				  if(hasFound)
				  {
					  resolve({exists: true});
					  
				  }else{
					  
					  resolve({exists: false});
				  }
					
				}else{
					
					reject("An error has occured");
				}
				
			});
			
			
		})
		
		
		return promise;
	
}

app.listen(port, () => console.log(`Listening on port ${port}`))