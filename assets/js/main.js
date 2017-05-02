$(document).ready(function(){
  "use strict"
  //initialize the api key and url stub
  var key = "dc6zaTOxFJmzC";                       //API Key
  var gifUrl = "";                                 //Holds the URL to send to API
  var createBtn = "";                              //Holds the button to create
  var gifData = {};                                //Holds all retreived gif data and their addresses and state on the DOM
  var searchParam = "";                            //Will hold the string for which to search  
  var buttonItems = [];                            //Holds the names of the current buttons on the page
  var currentDisplayKey = "";                      //Holds the "key" for gifs currently on display
  var defaultState = "";                           //Holds the current state for a hover toggle
  var message = "";                                //Contains message to user of how many Gifs are displayed
  var defaultBtns = [
    "cat", "dog", "fish",                          //Default buttons to appear on page
    "monkey", "zebra"
  ]  

  //Function contains the API Call which is performed when user clicks the "create" button
  function getGif(id, callBack){
    // Create an AJAX call to retrieve GIF data
    // Note we always query max results of 50 and then limit results on client-side
    // This alows user to change quantity to display and reclick multiple times but only run 1 API query
    gifUrl = "https://api.giphy.com/v1/gifs/search?q=" + id + "&api_key=" + key + "&limit=50";
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
          renderContent(id, $(".numSelector").val());//display gifs
        });
      } else {
        renderContent(this.id, $(".numSelector").val()); //display gifs
      }
    })
  }

  //Function called on startup. Populates the Body of the DOM with Skeleton
  //HTML structure
  function buildOutPage(){
    $("body").append("<header class=\"row\"> <h1>GifTastic</h1> </header>")
    $("body").append("<div id=\"container\">")
    $("#container").append("<div id=\"searchHolder\" class=\"row\">")
    $("#container").append("<div id=\"btnHolder\" class=\"row\">")
    $("#container").append("<div id=\"gifHolder\" class=\"row\">")
    $("#searchHolder").append($("<button>").addClass("create").html("Add Button!"));
    $("#searchHolder").append($("<input type=\"text\" id=\"inputField\">")) 
    $("#searchHolder").append($("<select class=\"form-control numSelector\"><option value=" + 
      "\"10\">10</option><option value=\"25\">25</option><option value=\"50\">50</option></select>"))
    $("#searchHolder").append("<p id=\"msg\"></p>")
    $("#gifHolder").append("<img src=\"./assets/img/defaultGify.gif\"/>")
    $("body").append("<footer> <h4>M A Lang 2017</h4> </footer>")
    
    $(".create").on("click", function(){
      makeButton();
    });

    defaultBtns.forEach(function(item){
      makeButton(item);
    });
  }

  //Creates a button and appends it to the DOM
  function makeButton(btnVal){
    //checks if JS code passed a name for the button (used to populate default buttons)
    if (btnVal === undefined){ //if no button name passed to function
      searchParam = $("#inputField").val().trim().toLowerCase(); //take the value of the user input form
    } else if(btnVal.trim().length > 0) { //otherwise if the passed variable contains a value
      searchParam = btnVal;  //use the passed variable as the button name
    }

    //Will only proceed to create a button if the name contains characters
    //and if the button is not already on the page
    if(searchParam.length > 0 && buttonItems.indexOf(searchParam) === -1 ){ 
      event.preventDefault();
      createBtn = "<button class=\"gifBtn\" id=\"" + searchParam + "\">" + searchParam + "</button>"; //Build button
      $("#btnHolder").append(createBtn); //Append Button to DOM
      buttonItems.push(searchParam); //Track in code that this button exists
      addButtonListener(); //Re-attach click listeners to the class
    }
  }

  //Function displays the Gifs when a button is clicked
  function renderContent(id, num){
    var i = 0;
    currentDisplayKey = id; //stores the key of items currently in render for later use in toggle
    message = "Displayed " + num + " Gifs!" //tell user how many gifs successfully displayed

    //Set the amount to render equal to the lesser of num or 
    //the number of Gifs in the object
    if(num > gifData[id][0].data.length){
      num = gifData[id][0].data.length
      message = "We only found " + num + " gifs to show you..."
    }

    //Reset the gifHolder element and the array holding URLs/State
    $("#gifHolder").empty();
    gifData[id][1] = [];
    gifData[id][2] = [];
    gifData[id][3] = [];
    gifData[id][4] = [];

    //Load GIF addresses, state, and rating into local array object from the API query response object
    for(; i < num ; i ++){
      gifData[id][1].push(gifData[id][0].data[i].rating); //push in the rating
      gifData[id][2].push(gifData[id][0].data[i].images.fixed_width.url); //push in the animated
      gifData[id][3].push(gifData[id][0].data[i].images.fixed_width_still.url); //push in the still
      gifData[id][4].push("still") //push in the gif state
      
      //Render the still GIF to the DOM within a frame (div) and put the rating within the frame
      $("#gifHolder").append("<div class='gifFrame'><img src='" + gifData[id][3][i] + 
        "' class='gifPic' id='gify" + i + "'/> <p class='rating'>" + gifData[id][1][i].toUpperCase()+ 
        "</p></div>") 
    }

    //append the message to the DOM
    $("#msg").html(message);

    //Set the click and hover listeners to toggle still/animate
    $(".gifPic").off(); //Remove listeners from the class

    //Add the click listener
    //On click toggle the Gif's state. Pass the Gif's ID and the fact that 
    //toggle is called from a click
    $(".gifPic").on("click", function(){
      toggleAnimate(this.id, "clk"); 
    });

    //On hover toggle the Gif's state. Pass the Gif's ID and the fact that 
    //toggle is called from a mouseenter or mouseleave
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
  ///These rules alow for "preview" of the animation by
  //hovering without formally activating the gif. When a 
  //click event is detected it will cause the toggle mode
  //to "stick"
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



