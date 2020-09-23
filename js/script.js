$(document).ready(function(){
  var lastSearch = "";
  // funzione cerca al click sul bottone
  $(".search_button").click(function(){
    // salvo il valore dell'input ricerca
    var searchMovie = $(".search_input").val();
    if (searchMovie != "") {
      // salvo la ricerca in una variabile globale
      lastSearch = $(".search_input").val();
      // resetto la casella input
      $(".search_input").val("");
      // cancello il risultato precedente
      resetResult();
      // stampo a schermo il nuovo risultato
      getResults(searchMovie);
    }
  });

  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchMovie = $(".search_input").val();
      if (searchMovie != "") {
        // salvo la ricerca in una variabile globale
        lastSearch = $(".search_input").val();
        // resetto la casella input
        $(".search_input").val("");
        // cancello il risultato precedente
        resetResult();
        // stampo a schermo il nuovo risultato
        getResults(searchMovie);
      }
    }

  });


  //click sul quadratino prende il valore di data-page e passiamo il valore alla funzione getResults
  // $(document).on("click", ".page_numb", function(){
  //   //seleziono con il this cioè quel quadratino che vado a selezionare
  //   var actualPage = $(this).attr("data-page");
  //   // cancello il risultato precedente
  //   resetResult();
  //   // printa a schermo risultato pagina selezionata
  //   getResults(lastSearch, actualPage);
  // });

});

//Printa il risultato della risposta a schermo con i film e il numero di pagine
function getResults(searchMovies){

  var api_key = "e985f53e1e87b07c7fd1095468f025a0";

  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key" : api_key,
        "language": "it-IT",
        "page": "",
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
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/tv",
      "data": {
        "api_key" : api_key,
        "language": "it-IT",
        "page": "",
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


  for(var i = 0; i < results.length; i++){
    // prendo il voto e lo converto in stelle in html
    var starVote = convert(results[i].vote_average);
    var originalLanguage = converFlagIso(results[i].original_language);
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
// renderizza il template del film
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
    var originalLanguage = converFlagIso(results[i].original_language);
    var context = {
      "name": results[i].name,
      "original_name": results[i].original_name,
      "original_language" : originalLanguage,
      "vote_average": results[i].vote_average,
      "star_vote": starVote
    };
    console.log(starVote);
    console.log(context);
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

// controlla se il valore della ligua corrisponde alla bandiera
function converFlagIso(lang) {
  if (lang == "en") {
    return "gb";
  } else if (lang == "ja") {
    return "jp";
  } else if (lang == "zh") {
    return "cn";
  }
  return lang;
}
