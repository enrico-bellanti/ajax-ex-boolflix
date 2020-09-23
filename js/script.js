$(document).ready(function(){
  // salvo una variabile globale per l'ultima ricerca fatta
  var lastSearch = "";
  // funzione cerca al click sul bottone
  $(".search_button").click(function(){
    // salvo il valore dell'input ricerca
    var searchMovie = $(".search_input").val();
    // controllo che la casella input non sia vuota
    if (searchMovie != "") {
      // salvo la ricerca nella variabile globale
      lastSearch = $(".search_input").val();
      // resetto la casella input
      $(".search_input").val("");
      // cancello il risultato precedente
      resetResult();
      // stampo a schermo il risultato
      getResults(searchMovie);
    }
  });

  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchMovie = $(".search_input").val();
      if (searchMovie != "") {
        // salvo la ricerca nella variabile globale
        lastSearch = $(".search_input").val();
        // resetto la casella input
        $(".search_input").val("");
        // cancello il risultato precedente
        resetResult();
        // stampo a schermo il risultato
        getResults(searchMovie);
      }
    }

  });

});
// end document ready

//Printa il risultato della risposta
function getResults(searchMovies){

  var api_key = "e985f53e1e87b07c7fd1095468f025a0";
  // chiamata oer la ricerca films
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key" : api_key,
        "language": "it-IT",
        "query": searchMovies
      },
      "method": "GET",
      "success": function (data) {
        renderMovies(data);
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );
  // chiamata per la ricerca series
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/tv",
      "data": {
        "api_key" : api_key,
        "language": "it-IT",
        "query": searchMovies
      },
      "method": "GET",
      "success": function (data) {
        renderSeries(data);
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );
}


// resetto la casella di ricerca input
function resetResult() {
  $("#results-list").html("");
  $(".movies-page-list").html("");
}

// renderizza il template del film
function renderMovies(obj) {
  //preparo il template
  var source = $("#movies-template").html();
  var template = Handlebars.compile(source);
  //array del risultato
  var results = obj.results;

// ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
    // prendo i dati che mi servono per renderizzare il template
    var starVote = convert(results[i].vote_average);
    var originalLanguage = results[i].original_language;
    var context = {
      "title": results[i].title,
      "original_title": results[i].original_title,
      "original_language" : originalLanguage,
      "vote_average": results[i].vote_average,
      "star_vote": starVote
    };

    var html = template(context);
    $("#results-list").append(html);

  }

}
// renderizza il template dela series
function renderSeries(obj) {
  console.log(obj);
  //preparo il template
  var source = $("#series-template").html();
  var template = Handlebars.compile(source);
  //array del risultato
  var results = obj.results;

  for(var i = 0; i < results.length; i++){
    // prendo il voto e lo converto in stelle
    var starVote = convert(results[i].vote_average);
    var originalLanguage = results[i].original_language;
    var context = {
      "name": results[i].name,
      "original_name": results[i].original_name,
      "original_language" : originalLanguage,
      "vote_average": results[i].vote_average,
      "star_vote": starVote
    };
    var html = template(context);
    $("#results-list").append(html);
  }

}

// funzione che converte voto in 5 stelline
function convert(vote) {
  // converto il voto da 1 a 10 in da 1 a 5 e arrotondo per eccesso
  var newVote = Math.ceil(vote / 2);

  //preparo il template
  var source = $("#stars-template").html();
  var template = Handlebars.compile(source);
  var html = template();
  var starVote = "";
  for (var i = 0; i < newVote; i++) {
    starVote = starVote + html;
  }

  return starVote;
}
