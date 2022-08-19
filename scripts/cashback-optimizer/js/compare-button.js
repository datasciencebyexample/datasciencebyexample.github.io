
//Set the recommemnd button to recommend cards
document.getElementById("compute_button").addEventListener("click", recommend);

const cards_all = ["BOA_customized_cash_rewards", "AMX_blue_cash_everyday","Wells_Fargo_active_cash","Citi_custom_cash_back","Citi_double_cash","Chase_amazon_rewards_signature","CapitalOne_savorone"]

/*

*/
function recommend() {
  // Grab the values from the input
  let input_values = grab_values();
  
  console.log(input_values);
  
  let prev_cards = grab_prev_cards();
  console.log(prev_cards);
   
  if(!input_values.total_value>0){
	document.getElementById("card2_text").innerHTML = "Please type spendings for at least one category";
	document.getElementById("recommendDiv").style.display = 'block';
	document.body.scrollIntoView(false);
	return;
  }
  else{
	document.getElementById("card2_text").innerHTML = "Running, best solutions are comming in seconds...";
	document.getElementById("recommendDiv").style.display = 'block';
	document.body.scrollIntoView(false);	
  }
  // call api
  // POST request using fetch()
	fetch("https://m6t0ffoyvj.execute-api.us-east-1.amazonaws.com/prod/", {
		
		mode: "cors",
		// Adding method type
		method: "POST",
		
		// Adding body or contents to send
		body: JSON.stringify({
			"spendings":input_values.entry,
			"selected_cards":prev_cards
			
		}),
		 
		// Adding headers to the request
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})
	 
	// Converting to JSON
	.then(response => response.json())
	 
	.then(function(data)
	  {console.log(data)
	  
	  document.getElementById("card2_text").innerHTML = "";
	  
	  //var te=document.getElementById("others_entry")
	  //te.value=99
	  
	  function makeUL(usage) {
		// Create the list element:
		var list = document.createElement('ul');

		for (var key in usage) {
			// Create the list item:
			var item = document.createElement('li');

			// Set its contents:
			item.appendChild(document.createTextNode('percentage of '+key+' is: '+usage[key]* 100 + "%"));
			

			// Add it to the list:
			list.appendChild(item);
		}

		// Finally, return the constructed list:
		//console.log(list);
		return list;
	  }

	 function makeCustom(data) {
		// Create the list element:
			  
		var list = document.createElement('ul');

		if('BOA customized cash rewards_custom_cat' in data['result'][0]){
			var item = document.createElement('li');
			item.appendChild(document.createTextNode(
			" Set "+data['result'][0]['BOA customized cash rewards_custom_cat']+
				" to be the max reward category for Bank of America Customized Cash Rewards Card" 
			));
			list.appendChild(item);	
		}
		if('Citi custom cash back_custom_cat' in data['result'][0]){
			var item = document.createElement('li');
			item.appendChild(document.createTextNode(
		      " Set "+data['result'][0]['Citi custom cash back_custom_cat']+
			" to be the max reward category for Citi Custom Cash Rewards Card" 
			));
			list.appendChild(item);	
			
			
		}
		
		
		return list;
	  }

	// Add the contents of options[0] to #foo:
	  document.getElementById("card2_text").innerHTML += " <p> Total spending will be $"+input_values.total_value+"</p><br>" 
	  document.getElementById("card2_text").innerHTML += " <p> <b> Total cashback </b> will be <font color=\"blue\">$"+data['result'][0]['reward']+"</font></p><br>" 
	  
	  if ('BOA customized cash rewards_custom_cat' in data['result'][0] || 'Citi custom cash back_custom_cat' in data['result'][0]){
		 document.getElementById("card2_text").innerHTML += "<br>" 
		 document.getElementById("card2_text").innerHTML += " <p> Custom spending category configration:</p><br>" 
		 document.getElementById('card2_text').appendChild(makeCustom(data));
	  }
	  
	  document.getElementById("card2_text").innerHTML += " <p> How to spend the money with different credit cards:</p>" 
	  document.getElementById('card2_text').appendChild(makeUL(data['result'][0]['usage']));
	  
	  let recommendDivShow = document.getElementById("recommendDiv");
	  //console.log(recommendDivShow.style.display);
	  if (recommendDivShow.style.display != 'block'){
		document.getElementById("recommendDiv").style.display = 'block';
	  }
	  document.body.scrollIntoView(false);
  
	  //document.getElementById("card2_text").innerHTML = " <p> test </p>" 
	  
	  //=document.getElementById("title")
	  //body=document.getElementById("bd")
	  //title.innerHTML = data.title
	  //body.innerHTML = data.body  
	}).catch(error => console.error('Error:', error)); 
  
	//console.log(results);
  
  
}


/*
  grab_values: take the values from the user and organize/clean them
  
    return: {expenditures: {three_months: int, six_months: int}, entry: {category: int, category: int...}}
*/
function grab_values() {
  
  // Grab the Entry Values
  let entry = {};
  let total_value = 0;
  
  entry["dining"] = parseInt(document.getElementById("dining_entry").value);
  entry["grocery"] = parseInt(document.getElementById("grocery_entry").value);
  entry["amazon"] = parseInt(document.getElementById("amazon_entry").value);
  entry["gas"] = parseInt(document.getElementById("gas_entry").value);
  entry["online"] = parseInt(document.getElementById("online_entry").value);
  entry["others"] = parseInt(document.getElementById("others_entry").value);

  // Clean the values

  for(let key in entry){
    
	if (typeof entry[key] != 'number' || isNaN(entry[key])){
      entry[key] = 0;
    }  
	if(entry[key]>0)
		total_value = total_value+entry[key]
  }

  return { total_value: total_value, entry: entry };
}



function grab_prev_cards(){
  let prev_cards = [];
  
  for(const key of cards_all){
    let checkbox_id = key + "_Checkbox"
    //console.log("space"+checkbox_id+"space")
    if (document.getElementById(checkbox_id).checked){
      prev_cards.push(key);
    }
  }
  
  return prev_cards;
}

