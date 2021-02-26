const express = require('express')
var request = require('request');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const url = require('url');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

//app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const visited = [];

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/search", function(req, res){

	const queryObject = url.parse(req.url,true).query;
	var pincode = "95602";
  	if(queryObject["where"])
  		pincode = queryObject["where"];

  	console.log(pincode);

	var options = {
	  'method': 'POST',
	  'url': 'https://api.citygridmedia.com/graphql',
	  'headers': {
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
	    query: `query($pincode: String!){
	    searchAds(publisher: "talmktdcc", type: null, keyword: "pest", zip: $pincode, hasLocation: true, paidOnly: null, rpp: 10, page: 1)
	    {
	        type
	        tagline
	        phone
	        business{
	            name
	            teaser
	            bullet1
	            bullet2
	            bullet3
	            images
	            profileImage
	            services
	            features
	            address {
	                street
	                city
	                state
	                postalCode
	            }
	        }
	    callSettings{
	        dedupPeriod
	        dedupUnit
	        duration
	    }
	}
	}`,
	    variables: {"pincode":pincode}
	  })
	};
	request(options, function (error, response) {
	  if (error) throw new Error(error);

	  return res.render('search',{data: JSON.parse(response.body)["data"]});;

	});

    
});

app.post("/search", function(req, res){
   	res.redirect("/search");
});

// Start the Express server
app.listen(`${process.env.PORT}`, () => {
	console.log('Server running on port 3000!')
})