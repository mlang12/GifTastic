$(document).ready(function(){
  "use strict"
  //initialize the api key and url stub
  var key = "dc6zaTOxFJmzC";                       //API Key
  var gifUrl = "";                                 //Holds the URL to send to API
  var createBtn = "";                              //Holds the button to create
  var gifData = {};                                //Holds all retreived gif data and their addresses and state on the DOM
  var searchParam = "";
  var defaultBtns = ["cat", "dog", "fish", "monkey", "zebra"]                            //What the user is looking for from the form
  var buttonItems = [];       //Default buttons to appear on page
  var currentDisplayKey = "";                      //Holds the "key" for gifs currently on display
  var defaultState = "";                           //Holds the current state for a hover toggle

  //Function contains the API Call which is performed when user clicks the "create" button
  function getGif(id, callBack){
    // Create an AJAX call to retrieve GIF data
    // Note we always query max results of 50 and then limit results on client-side
    // This alows user to change quantity to display and reclick multiple times but only run 1 API query
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + id + "&limit=50&api_key=" + key;
    $.ajax({
      url: gifUrl,
      method: "GET"
    }).done(function(results){
      gifData[id] = [results,[], [], [],[]]; //Each property holds [[results of query], [rating], [animated.gif], [stills.gif], and [DOM-state]]
      if(typeof callBack === "function"){
        callBack(id);
      }
    });   
  }

  //Funtion adds listener to the gifBtn class for every new btn created
  function addButtonListener(){
    $(".gifBtn").off();
    $(".gifBtn").on("click", function(){
      event.preventDefault();
      if(gifData[this.id] === undefined){ //if we don't have api results for the search term
        getGif(this.id, function(id){ //run api query 
          renderContent(id, 10);//display gifs
        });
      } else {
        renderContent(this.id, 10); //display gifs
      }
    })
  }

  function buildOutPage(){
    //build page structure
    $("body").append("<header class=\"row\"> <h1>GifTastic</h1> </header>")
    $("body").append("<div id=\"container\">")
    $("#container").append("<div id=\"searchHolder\" class=\"row\">")
    $("#container").append("<div id=\"btnHolder\" class=\"row\">")
    $("#container").append("<div id=\"gifHolder\" class=\"row\">")
    $("#searchHolder").append($("<button>").addClass("create").html("See Gifs!"));
    $("#searchHolder").append($("<input type=\"text\" id=\"inputField\">")) 
    $("body").append("<footer> <h4>M A Lang 2017</h4> </footer>")
    
    $(".create").on("click", function(){
      makeButton();
    });

    defaultBtns.forEach(function(item){
      makeButton(item);
    });
  }

  function makeButton(btnVal){
    //checks if user passed a name for the button
    if (btnVal === undefined){ //if no button name passed to function
      searchParam = $("#inputField").val().trim().toLowerCase(); //take the value of the user input form
    } else if(btnVal.trim().length > 0) { //otherwise if the passed variable contains a value
      searchParam = btnVal;  //use the passed variable as the button name
    }

    //Will only proceed to create a button if the name contains characters
    //and if the button is not already on the page
    if(searchParam.length > 0 && buttonItems.indexOf(searchParam) === -1 ){ 
      event.preventDefault();
      createBtn = "<button class=\"gifBtn\" id=\"" + searchParam + "\">" + searchParam + "</button>";
      $("#btnHolder").append(createBtn);
      buttonItems.push(searchParam);
      addButtonListener();
    }
  }

  function renderContent(id, num){
    var i = 0;
    currentDisplayKey = id; //stores the key of items currently in render for later use in toggle

    //Set the amount to render equal to the lesser of num or 
    //the number of Gifs in the object
    if(num > gifData[id][0].data.length){
      num = gifData[id][0].data.length
    }

    $("#gifHolder").empty();

    for(; i < num ; i ++){
      gifData[id][1].push(gifData[id][0].data[i].rating); //push in the rating
      gifData[id][2].push(gifData[id][0].data[i].images.fixed_width.url); //push in the animated
      gifData[id][3].push(gifData[id][0].data[i].images.fixed_width_still.url); //push in the still
      gifData[id][4].push("still") //push in the gif state
      
      $("#gifHolder").append("<div class='gifFrame'><img src='" + gifData[id][3][i] + 
        "' class='gifPic' id='gify" + i + "'/> <p class='rating'>" + gifData[id][1][i].toUpperCase()+ 
        "</p></div>") //add img and rating to DOM
    }

    //Set the click and hover listeners to toggle still/animate
    $(".gifPic").off();

    $(".gifPic").on("click", function(){
      toggleAnimate(this.id, "clk");
    });

    $(".gifPic").on({
      mouseenter: function () {
        toggleAnimate(this.id, "hvron");
      },
      mouseleave: function () {
        toggleAnimate(this.id, "hvroff");
      }
    });

  }

  //Checks the state of the ID and toggles the opposite
  function toggleAnimate(id, fromEvent){
    var itemNumber = Number(id.substring(4, id.length));
    var state = gifData[currentDisplayKey][4][itemNumber];

    if(state === "still" && fromEvent === "clk"){
      $("#" + id).attr("src", gifData[currentDisplayKey][2][itemNumber]);
      gifData[currentDisplayKey][4][itemNumber] = "active";
    
    } else if(state === "active" && fromEvent === "clk"){
      $("#" + id).attr("src", gifData[currentDisplayKey][3][itemNumber])
      gifData[currentDisplayKey][4][itemNumber] = "still"
    
    } else if(state === "still" && fromEvent === "hvron"){
      $("#" + id).attr("src", gifData[currentDisplayKey][2][itemNumber]);

    } else if(state === "still" && fromEvent === "hvroff"){
      $("#" + id).attr("src", gifData[currentDisplayKey][3][itemNumber]);
    } 
  }

  //Builds out the HTML Skeleton of the body of the page
  buildOutPage();

})



