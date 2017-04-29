$(document).ready(function(){

  //initialize the api key and url stub
  var key = "dc6zaTOxFJmzC";        //API Key
  var limiter = 10;                 //How many gifs to return
  var gifUrl = "";                  //Holds the URL to send to API
  var createBtn = "";               //Holds the button to create
  var gifData = {};                 //Holds all retreived button click data


  function getGif(item){
    // Create an AJAX call to retrieve GIF data
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + item + "&limit=" + limiter +  "&api_key=" + key;
    $.ajax({
      url: gifUrl,
      method: "GET"
    })

    .done(function(results){
      return results;
    });   
  }

  function addMovieButtonListener(){
    $(".movieBtn").on("click", function(){
      event.preventDefault()

      if(gifData[this.id] === "undefined"){
        gifData[this.id] = getGif(this.id);
      }

      
      console.log(gifData);
      listenerActive = true;
    })
  }

  function buildOutPage(){
    //build page structure
    $("body").append("<div id=\"container\">")
    $("#container").append("<div id=\"searchHolder\">")
    $("#container").append("<div id=\"btnHolder\">")
    $("#container").append("<div id=\"gifhHolder\">")
    $("#searchHolder").append($("<button>").addClass("create").html("Create Button"));
    $("#searchHolder").append($("<input type=\"text\" id=\"inputField\">")) 

    //attach listener to the button generating button
    $(".create").on("click", function(){
      event.preventDefault()
      searchParam = $("#inputField").val().trim()
      createBtn = "<button class=\"movieBtn\" id=\"" + searchParam + "\">"
      $("#btnHolder").append(createBtn);
      $("#" + searchParam).html(searchParam)
      addMovieButtonListener();
    })
  }

  buildOutPage();

})



