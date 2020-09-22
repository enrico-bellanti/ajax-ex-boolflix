$(document).ready(function() {
  var searchMovie = "star wars";

  var source = $("#movie-template").html();
  var movieTemplate = Handlebars.compile(source);

  // chiamo il server per reperire le info film richiesto
  $.ajax(
   {
     "url":"https://api.themoviedb.org/3/search/movie",
     "data":{
       "api_key": "faa82c855e9e700015c133bf3942bd8f",
       "language": "it-IT",
       "query": searchMovie,
       "page": ""
     },
     "method":"GET",
     "success":function (data) {
       var movieResults = data.results;
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

     },
     "error":function (err) {
       alert("E avvenuto un errore. "+ err);
     }
  });

});
// end document ready
