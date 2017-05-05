$(document).ready(function(){
  "use strict";
  //initialize the api key and url stub
  var key = "dc6zaTOxFJmzC";                       //API Key
  var gifUrl = "";                                 //Holds the URL to send to API
  var createBtn = "";                              //Holds the button to create
  var gifData = {};                                //Holds all retreived gif data and their addresses and state on the DOM
  var searchParam = "";                            //Will hold the string for which to search  
  var buttonItems = [];                            //Holds the names of the current buttons on the page
  var currentDisplayKey = "";                      //Holds the "key" for gifs currently on display
  var message = "Welcome! Click a button...";      //Contains message to user of how many Gifs are displayed
  var currentTheme = "";                           //The value of the current theme
  var defaultBtns = [
    "cat", "dog", "fish",                          //Default buttons to appear on page
    "monkey", "zebra", "moose",
    "fox", "dingo", "frog",
    "bees"
  ];
  var themes = {
    "none": "",
    "dancing": "dancing",
    "colorful": "colors",
    "retro": "retro"
  };                                   //Different themese user can select

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

  //Function called on startup. Populates the Body of the DOM with Skeleton
  //HTML structure
  function buildOutPage(){
    //Add the message to the DOM
    $("#msg").html(message);

    //Add listern for button-creating button
    $(".create").on("click", function(){
      var item = makeButton();          //create a button
      if(item){                         //If the button was created...
        $("#inputField").val("");       //Clear the search bar
        btnPress(item);                 //Call the button press
      }
    });

    //Populate the default buttons
    defaultBtns.forEach(function(item){
      makeButton(item);
    });

    //Add listener to the search buttons
    $("#btnHolder").on("click", function(){
      event.preventDefault();
      var id = event.target.id; //get the id of the specific clicked button
      btnPress(id); //
    });

    //Allow user to press "enter" after typing search term
    $("#inputField").on("keypress", function(event){
      if(event.keyCode == 13){
          event.preventDefault();
          $(".create").click();
      }
    });

    //Listen for theme selection
    $(".themeBtn").on("click", function(){
      event.preventDefault();
      var id = $(event.target).attr("data")//.data; //get the id of the specific clicked button
      currentTheme = "";
      if (themes[id] !== undefined){
        $("#activeTheme").attr("id", "");
        currentTheme = themes[id];
        $(event.target).attr("id", "activeTheme");
      } 
    });
  }

  //Function will check if a valid button was clicked and if so
  //Will proceed to call a function to query the API and call
  //a function to render the GIFs
  function btnPress(id){
    //check for valid button name before proceeding
    var themeID = currentTheme + " " + id;

    if(buttonItems.indexOf(id) === -1){ 
      return;
    }

    if(gifData[themeID] === undefined){ //if we don't have api results for the search term
      getGif(themeID, function(themeID){ //run api query 
        console.log("themeID: " + themeID);
        renderContent(themeID, $(".numSelector").val());//display gifs
      });
    } else {
      console.log("themeID: " + themeID);
      renderContent(themeID, $(".numSelector").val()); //display gifs
    }
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
      // event.preventDefault();
      
      //Build button
      createBtn = (
        "<button class=\"btn btn-default gifBtn\" id=\"" + searchParam + "\">" + 
          searchParam + 
        "</button>"
      );

      $("#btnHolder").append(createBtn); //Append Button to DOM
      buttonItems.push(searchParam); //Track in code that this button exists
      return searchParam; //returns the search Item if a button was created
    }
    return false; //returns false if the button wasn't created
  }

  //Function displays the Gifs when a button is clicked
  function renderContent(id, num){
    var i;
    currentDisplayKey = id; //stores the key of items currently in render for later use in toggle
    message = "Displayed " + num + " " + id + " Gifs!"; //tell user how many gifs successfully displayed

    //Set the amount to render equal to the lesser of num or 
    //the number of Gifs in the object
    if(num > gifData[id][0].data.length){
      num = gifData[id][0].data.length;
      message = "We only found " + num + " " + id + " gifs to show you...";
    }

    //Reset the gifHolder element and the array holding URLs/State
    $("#gifHolder").empty();
    gifData[id][1] = []; //Clear Ratings
    gifData[id][2] = []; //Clear Animated URL
    gifData[id][3] = []; //Clear Still URL
    gifData[id][4] = []; //Clear current Gif State

    //Load GIF addresses, state, and rating into local array object from the API query response object
    for(i = 0 ; i < num ; i += 1){
      gifData[id][1].push(gifData[id][0].data[i].rating); //push in the rating
      gifData[id][2].push(gifData[id][0].data[i].images.fixed_width.url); //push in the animated URL
      gifData[id][3].push(gifData[id][0].data[i].images.fixed_width_still.url); //push in the still URL
      gifData[id][4].push("still"); //push in the gif state (default is still)
      
      //Render the still GIF to the DOM within a frame (div) and put the rating within the frame
      $("#gifHolder").append(
        "<div class='gifFrame'>" + 
          "<img src='" + gifData[id][3][i] + "' class='gifPic' id='gify" + i + "'/> " + 
          "<p class='rating'>" + 
            gifData[id][1][i].toUpperCase()+ 
          "</p>" +
        "</div>"
      ); 
    }

    //message to the DOM
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

  //Checks the state of the Gif's ID and toggles the opposite
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
      $("#" + id).attr("src", gifData[currentDisplayKey][3][itemNumber]);
      gifData[currentDisplayKey][4][itemNumber] = "still";
    
    } else if(state === "still" && fromEvent === "hvron"){
      $("#" + id).attr("src", gifData[currentDisplayKey][2][itemNumber]);

    } else if(state === "still" && fromEvent === "hvroff"){
      $("#" + id).attr("src", gifData[currentDisplayKey][3][itemNumber]);
    } 
  }

  //Builds out the HTML Skeleton of the body of the page
  buildOutPage();
});



