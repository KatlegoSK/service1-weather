const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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

app.listen(port, () => console.log(`Listening on port ${port}`))