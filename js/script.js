// variabili globali
var totalResults = {};
var genresResults = {};
var lastResult;
var allGenres = [];
var filterGenre = "All";
// inizio document ready
$(document).ready(function(){
  // fare un reset sulla select filtro genre
  $('#select_genre').val("Genere");
  $('#select_genre').prop('disabled', true);
  // funzione cerca al click sul bottone
  // $(".search_button").click(function(){
  //   // salvo il valore dell'input ricerca
  //   var searchInput = $(".search_input").val();
  //   lastResult = searchInput;
  //   // controllo che la casella input non sia vuota
  //   if (searchInput != "") {
  //     // cancello il risultato precedente
  //     resetResults();
  //     // stampo a schermo il risultato
  //     getIds("movie", searchInput);
  //     getIds("tv", searchInput);
  //     $('#select_genre').prop('disabled', false);
  //   }
  // });

  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchInput = $(".search_input").val();
      lastResult = searchInput;
      if (searchInput != "") {
        // cancello il risultato precedente
        resetResults();
        // stampo a schermo il risultato e salvo il valore della funzione
        getIds("movie", searchInput);
        getIds("tv", searchInput);

        // funzione per renderizzare la select filtro e salvare i risultati in un array
        // cicla l'array e prepara il template
          var source = $("#option_genres-template").html();
          var optionTemplate = Handlebars.compile(source);
          console.log(allGenres);
          for (var i = 0; i < allGenres.length; i++) {
            console.log("ciao");
            console.log(allGenres[i]);
            var context ={
              "value": allGenres[i]
            };
            var html = optionTemplate(context);
            $("#select_genre").append(html);
          }

        // setta la select filtro genre
        $('#select_genre').prop('disabled', false);
        $('#select_genre').val("All");

      }
    }
  });

  // selezionare il genere
  $("#select_genre").change(function(){
    var genreSelect = $(this).val();
    filterGenre = genreSelect;
    resetResults();
    getIds("movie", lastResult);
    // getIds("tv", lastResult);

  });

});
// end document ready

function getIds(type, searchInput) {
  var urlCall = "https://api.themoviedb.org/3/search/" + type;
  // chiamata oer la ricerca films
  $.ajax(
    {
      "url": urlCall,
      "data": {
        "api_key" : "e985f53e1e87b07c7fd1095468f025a0",
        "language": "it-IT",
        "query": searchInput
      },
      "method": "GET",
      "success": function (obj) {
        totalResults[type] = obj.total_results;
        // controllo su i risultati
        if (totalResults.movie === 0 && totalResults.tv === 0) {
          printNoResults(type);
        } else {
          renderResults(type, obj);
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

  var results = obj.results;
  var id;
  // ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
    id = results[i].id;
    // faccio unìaltra chiamata per ottenere i dettagli
    $.ajax(
      {
        "url":"https://api.themoviedb.org/3/"+type+"/"+id+"?api_key=faa82c855e9e700015c133bf3942bd8f",
        "method":"GET",
        "success": function (details) {

          // compilo il context
          var context = {
            "id": details.id,
            "filter_on": setFilterGenre(details),
            "type_label": jsUcfirst(type),
            "type_class": type,
            "title": details.name || details.title,
            "original_title": details.original_name || details.original_title,
            "original_language" : details.original_language,
            "vote_average": details.vote_average,
            "isPoster": isPoster(details.poster_path),
            "poster": details.poster_path,
            "star_vote": printStars(details.vote_average),
            "overview": details.overview,
            "genres": getGenres(details.genres)
          };

          //preparo il template e lo compilo con il context
          var source = $("#result-template").html();
          var template = Handlebars.compile(source);
          var html = template(context);
          $("#results-list").append(html);

        },
        "error":function (err) {
          alert("E avvenuto un errore. "+ err);
        }
    });
    // end call
  }
  // STAMPA DA QUI LE OPTION PER I FILTRI
}


// funzione che converte voto in 5 stelline
function printStars(vote) {
  // porta il voto da 1 a 5
  var newVote = vote / 2;
  // prendi l'intero
  var voteMath = Math.floor(newVote);
  // dammi il decimale
  var decimal = (newVote - voteMath).toFixed(2);

  // inizia a ciclare le stelline
  var typeStar;
  var htmlStars = "";
  for (var i = 0; i < 5; i++) {
    // voto = 3.6
    if (i < voteMath) {
      // stella piena
      typeStar = "fas fa-star";
    }else if (i == voteMath) {
      if (decimal < 0.25) {
        // stella meta
        typeStar = "far fa-star";
      }else if (decimal > 0.25 && decimal < 0.75) {
        // stella vuota
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

    // fai copia template
    var source = $("#stars-template").html();
    var template = Handlebars.compile(source);
    var html = template(context);
    htmlStars += html;
  }
  return htmlStars;
}

// filtra per genere
function setFilterGenre(details) {
  var visile = "";
  if (filterGenre == "All") {
    visile = "filter_on";
  }
  var listGen = details.genres;
  var typeGenre;
  for (var i = 0; i < listGen.length; i++) {
    typeGenre = listGen[i].name;
    if (typeGenre == filterGenre) {
      visile = "filter_on";
    }
    // inserisci il valore in un array globale se presente scarta
    if (!allGenres.includes(typeGenre)) {
      allGenres.push(typeGenre);
    }
  }
  return visile;
}

// resetto la casella di ricerca input
function resetResults() {
  // resetto la casella input
  $(".search_input").val("");
  // resetto la ricerca
  $("#results-list").html("");
  // resetto eventuali errori a video
  $("#error-list").html("");
  // resetto la lista dei generi correlati alla ricerca prev
  allGenres =[];
}

// capitalizza il primo carattere
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// controlla se e' presente il poster
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

function getGenres(listGenres) {
  var stringGenres = "";
  for (var i = 0; i < listGenres.length; i++) {
    stringGenres += listGenres[i].name + " ";
  }
  return stringGenres;
}
