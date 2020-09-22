$(document).ready(function() {
  $("#search_button").click(function() {
    // cancello il risultato precedente
    $(".movie_info").remove();
    // prendo valore input
    var searchMovie = $("#input_movie").val();
    // stampa risultati
    var totalPages = printResults(searchMovie);
    printPageLabel(totalPages);
    // ripulisci input
    $("#input_movie").val("");
  });

  $("#input_movie").keydown(function(event){
    if (event.which == 13) {
      // cancello il risultato precedente
      $(".movie_info").remove();
      // prendo valore input
      var searchMovie = $("#input_movie").val();
      // stampa risultati
      var totalPages = printResults(searchMovie);
      console.log("click invio"+totalPages);

      printPageLabel(totalPages);
      // ripulisci input
      $("#input_movie").val("");
    }
  });





});
// end document ready


// funzioni

// stampa a a schermo i risultati
function printResults(searchKey) {
  // var searchMovie = "star wars";
  var source = $("#movie-template").html();
  var movieTemplate = Handlebars.compile(source);

  // chiamo il server per reperire le info film richiesto
  $.ajax(
   {
     "url":"https://api.themoviedb.org/3/search/movie",
     "data":{
       "api_key": "faa82c855e9e700015c133bf3942bd8f",
       "language": "it-IT",
       "query": searchKey,
       "page": ""
     },
     "method":"GET",
     "success":function (data) {
       var movieResults = data.results;
       var pageNumb = data.total_pages;
       console.log("valore alla chiamata"+pageNumb)
       for (var i = 0; i < movieResults.length; i++) {
         // compilo il template
         var context = {
           "title": movieResults[i].title,
           "original_title": movieResults[i].original_title,
           "original_language": movieResults[i].original_language,
           "vote_average": movieResults[i].vote_average
         };
         var html = movieTemplate(context);
         $(".movie_list").append(html);
        }
       console.log("return nella chiamata"+pageNumb);
        return pageNumb;
     },
     "error":function (err) {
       alert("E avvenuto un errore. "+ err);
     }
  });
}

// funzione per stampare etichetta numero pagina
function printPageLabel(pages) {
  var source = $("#page-template").html();
  var pageTemplate = Handlebars.compile(source);
  for (var i = 0; i < pages; i++) {
    var context = {
      "page_numb": i
    };
    var html = pageTemplate(context);
    $(".nav_bar").append(html);
  }
}
