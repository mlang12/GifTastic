# GifTastic

Welcome to GifTastic!

This website utilzes the https://giphy.com/ API to search for and return related GIF results.

The user's searches are added as a button which can later be selected again to see the GIFs that were returned or change the quantity displayed. The GIF rating is listed below each GIF however these are user submited and unvalidated therefore ratings may not reflect accurately for an individual gif. Hovering over the GIF will preview its activie state and clicking on a GIF will
toggle the state between "still" and "active." The user may also select a "theme" to apply to their search.

Design notes:
  -The API is only hit once per unqiue search/button click. Once the search is performed the result are stored in memory for later re-use. This helps limit burden on the API

  -The query always requests 50 Gifs regardless of what the user selects and then those are filtered in the JS to return however many were requested.

  -The hover and click toggle functionality to switch between "active" and "still" gifs was coded into memory rather than using the DOM to store state.

  -User can apply a "theme" from the supplied list. Doing so will "theme" the results with that option. For example - selecting "dancing" and then clicking the "cat" button will produce dancing cats GIFs

Tech used:
- Bootstrap, jQuery, HTML, CSS, JavaScript, AJAX API Requests

You can find a live deplyment at https://mlang12.github.io/GifTastic/

Thanks for visiting!