$(document).ready(function(){
  // salvo una variabile globale per l'ultima ricerca fatta
  var lastSearch = "";
  // funzione cerca al click sul bottone
  $(".search_button").click(function(){
    // salvo il valore dell'input ricerca
    var searchInput = $(".search_input").val();
    // controllo che la casella input non sia vuota
    if (searchInput != "") {
      // salvo la ricerca nella variabile globale
      lastSearch = $(".search_input").val();
      // resetto la casella input
      $(".search_input").val("");
      // cancello il risultato precedente
      resetResult();
      // stampo a schermo il risultato
      getMovies(searchInput);
      getSeries(searchInput);
    }
  });

  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchInput = $(".search_input").val();
      if (searchInput != "") {
        // salvo la ricerca nella variabile globale
        lastSearch = $(".search_input").val();
        // resetto la casella input
        $(".search_input").val("");
        // cancello il risultato precedente
        resetResult();
        // stampo a schermo il risultato e salvo il valore della funzione
        var movieResults, seriesResults;
        movieResults =  getMovies(searchInput);
        seriesResults = getSeries(searchInput);
        console.log(movieResults);
        console.log(seriesResults);

        if (movieResults == false && seriesResults == false) {
          printNoResults("prova");
        }
      }
    }

  });

});
// end document ready

//Printa il risultato della risposta
function getMovies(textSearch) {
  // chiamata oer la ricerca films
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key" : "e985f53e1e87b07c7fd1095468f025a0",
        "language": "it-IT",
        "query": textSearch
      },
      "method": "GET",
      "success": function (data) {
        if (data.total_results != 0) {
          renderResults("movies", data);
        }else {
          return false;
        }
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );

}
function getSeries(textSearch){
  // chiamata per la ricerca series
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/tv",
      "data": {
        "api_key" : "e985f53e1e87b07c7fd1095468f025a0",
        "language": "it-IT",
        "query": textSearch
      },
      "method": "GET",
      "success": function (data) {
        if (data.total_results != 0) {
          renderResults("series", data);
        }else {
          return false;
        }
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
  var source = $("#result-template").html();
  var template = Handlebars.compile(source);
  //array del risultato
  var results = obj.results;
  var title, originalTitle;
// ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
    // controlla se che tipo di risultato
    if (type == "series") {
      title = results[i].name;
      originalTitle = results[i].original_name;
    } else if (type == "movies") {
      title = results[i].title;
      originalTitle = results[i].original_title;
    }

    // prendo i dati che mi servono per renderizzare il template
    var starVote = printStars(results[i].vote_average);
    var poster = results[i].poster_path;
    var context = {
      "type": jsUcfirst(type),
      "type_data": type,
      "title": title,
      "original_title": originalTitle,
      "original_language" : results[i].original_language,
      "vote_average": results[i].vote_average,
      "isPoster": isPoster(poster),
      "poster": poster,
      "star_vote": starVote,
      "overview": results[i].overview
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

// capitalizza il primo carattere
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// controlla se e' presente il poster o no
function isPoster(poster) {
  var isPoster;
  if(poster == null) {
    return isPoster = false;
  }
  return isPoster = true;
}
// funzione che stampa a schermo messaggio d'errore
function printNoResults(search) {
  var source = $("#no-results-template").html();
  var errorTemplate = Handlebars.compile(source);
  var context = {
    "last_search": search,
  };
  var html = errorTemplate(context);


}
