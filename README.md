# GifTastic

Welcome to GifTastic!

This website utilzes the https://giphy.com/ API to search for and return related GIF results.

The user's searches are added alongside the default buttons which can later be selected 
again to see the GIFs that were returned / change quantity. The GIF rating is listed below each 
individual gif. Hovering over the GIF will preview its activie state and clicking on a GIF will
toggle the state between "still" and "active."

Design notes:
  -The API is only hit once per unqiue search/button click. Once the search is performed the results
  are stored in memory for later re-use. This helps limit burden on the API
  -The query always requests 50 Gifs regardless of what the user selects and then those
  are filtered in the JS to return however many were requested.
  -The hover and click toggle functionality to switch between "active" and "still" gifs
  was coded into memory rather than using the DOM to store state.

Tech used:
- Bootstrap, jQuery, HTML, CSS, JavaScript, API Request

You can find a live deplyment at https://mlang12.github.io/GifTastic/