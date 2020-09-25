// variabili globali
var totalResults = {};
// inizio document ready
$(document).ready(function(){
  // funzione cerca al click sul bottone
  $(".search_button").click(function(){
    // salvo il valore dell'input ricerca
    var searchInput = $(".search_input").val();
    // controllo che la casella input non sia vuota
    if (searchInput != "") {
      // cancello il risultato precedente
      resetResult();
      // stampo a schermo il risultato
      getResults("movie", searchInput);
      getResults("tv", searchInput);
    }
  });

  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchInput = $(".search_input").val();
      if (searchInput != "") {
        // cancello il risultato precedente
        resetResult();
        // stampo a schermo il risultato e salvo il valore della funzione
        getResults("movie", searchInput);
        getResults("tv", searchInput);


      }
    }

  });

});
// end document ready

//Printa il risultato della risposta
function getResults(type, textSearch) {
  var urlCall = "https://api.themoviedb.org/3/search/" + type;
  // chiamata oer la ricerca films
  $.ajax(
    {
      "url": urlCall,
      "data": {
        "api_key" : "e985f53e1e87b07c7fd1095468f025a0",
        "language": "it-IT",
        "query": textSearch
      },
      "method": "GET",
      "success": function (data) {
        totalResults[type] = data.total_results;
        renderResults(type, data);
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );

}



// renderizza il template del film
function renderResults(type, obj) {
  if (totalResults.movie === 0 && totalResults.tv === 0) {
    printNoResults(type);
  }
  //preparo il template
  var source = $("#result-template").html();
  var template = Handlebars.compile(source);
  //array del risultato
  var results = obj.results;
  var title, originalTitle;
// ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
    // controlla se che tipo di risultato
    if (type == "tv") {
      title = results[i].name;
      originalTitle = results[i].original_name;
    } else if (type == "movie") {
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
  // resetto la casella input
  $(".search_input").val("");
  // resetto la ricerca
  $("#results-list").html("");
  // resetto eventuali errori a video
  $("#error-list").html("");

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
function printNoResults(category) {
  var source = $("#no-results-template").html();
  var errorTemplate = Handlebars.compile(source);
  var context = {
    "category": category
  };
  var html = errorTemplate(context);
  $("#error-list").append(html);

}
