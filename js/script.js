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
        renderResults("movies", data);
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
        renderResults("series", data);
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );
}



// renderizza il template del film
function renderResults(type, obj) {
  //preparo il template
  var source = $("#movies-template").html();
  var template = Handlebars.compile(source);
  //array del risultato
  var results = obj.results;
  var title, originalTitle;
// ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
    if (type == "series") {
      title = results[i].name;
      originalTitle = results[i].original_name;
    } else if (type == "movies") {
      title = results[i].title;
      originalTitle = results[i].original_title;
    }
    // prendo i dati che mi servono per renderizzare il template
    var starVote = printStars(results[i].vote_average);

    var context = {
      "type": type,
      "title": title,
      "original_title": originalTitle,
      "original_language" : results[i].original_language,
      "vote_average": results[i].vote_average,
      "poster": results[i].poster_path,
      "star_vote": starVote
    };

    var html = template(context);
    $("#results-list").append(html);

  }

}


// funzione che converte voto in 5 stelline
function printStars(vote) {
  // porta il voto da 1 a 5
  var newVote = vote / 2;
  // prendi l'intero
  var voteMath = Math.floor(newVote);
  // dammi il decimale
  var decimal = (newVote - voteMath).toFixed(2);

  // fai copia template
  var source = $("#stars-template").html();
  var template = Handlebars.compile(source);
  var typeStar;
  var htmlStars = "";
  // inizia a ciclare le stelline
  // PIENA: <i class="fas fa-star"></i>
  // MEZZA: <i class="fas fa-star-half-alt"></i>
  // VUOTA: <i class="far fa-star"></i>
  for (var i = 0; i < 5; i++) {
    // voto = 3.6
    if (i < voteMath) {
      typeStar = "fas fa-star";
    }else if (i == voteMath) {
      if (decimal < 0.25) {
        typeStar = "far fa-star";
      }else if (decimal > 0.25 && decimal < 0.75) {
        typeStar = "fas fa-star-half-alt";
      }else {
        typeStar = "fas fa-star";
      }
    } else {
      typeStar = "far fa-star";
    }

    // riempi template stella
    var context = {
      "type_star": typeStar,
    };

    var html = template(context);
    htmlStars += html;
  }
  return htmlStars;
}

// resetto la casella di ricerca input
function resetResult() {
  $("#results-list").html("");
}
