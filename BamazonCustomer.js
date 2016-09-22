var mysql = require('mysql');
var prompt = require('prompt');

// Creates the properties so that we can connect our server.js file to the mysql database
var connection  = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "Bamazon"
});


var inventory = [];

connection.connect(function(err){

	if(err){
		console.log("Connection Error");
		return;
	}


	console.log("connected as id " + connection.threadID);
});


connection.query("SELECT itemID, ProductName, DepartmentName, Price, StockQuantity from Products", function(err, res){
	if(err){
		throw err
	}else{
		console.log("Welcome to Bamazon!")
		console.log("------------------------------------");
		console.log("ID    Product Name       Department       Price");
		for(var i=0; i<res.length; i++){
			console.log(res[i].itemID, res[i].ProductName, res[i].DepartmentName, res[i].Price);
			inventory.push(res[i]);
		}
		UserPrompt();
	}
})


function UserPrompt(){
	prompt.start()

	
	var schema = {
		properties:{
			itemID:{
				message: "Please enter the ID for the product you wish to purchase.",
				required: true
			},
			itemQuantity:{
				message: "How many of this product do you wish to purchase?",
				required: true
			}
		}
	}

	
	prompt.get(schema, function(err, result){
		if(err){
			throw err
		}else{			
			var ID = result.itemID;
			var quantity = result.itemQuantity;
		}
		console.log(ID);
		console.log(quantity);
		QuantityCheck(ID, quantity);
	})
}

function QuantityCheck(ID, quantity){

	console.log("checking the quantity...");
	
	for(var i=0; i<inventory.length; i++){
		
		if(ID == inventory[i].itemID){			
			
			if(quantity > inventory[i].StockQuantity){
				console.log("Insufficient quantity. Order cannot go through. Please try again.");
				UserPrompt();
			}else if(quantity < inventory[i].StockQuantity){
				
				var newQuantity = inventory[i].StockQuantity - quantity;
				connection.query("UPDATE Products SET StockQuantity="+newQuantity+" WHERE StockQuantity="+inventory[i].StockQuantity, function(err, res){
					if(err){
						throw err
					}else{
					}
				})
				var cost = inventory[i].Price * quantity;	
				console.log("Successful Purchase! Total cost is: " + cost);
			}
		}
	}
}