// variabili globali
var totalResults = {};
var listGenres = [];
var lastSearch;

// inizio document ready
$(document).ready(function(){
  // azioni di default
  $('#select_genre').val("0");
  $('#select_genre').prop('disabled', true);
  replaceFilterDefault();

  // funzione che si attiva allo scroll
  $(document).scroll(function() {
    $(".header_container").addClass("scrolled");
  });


  // funzione cerca premendo invio
  $(".search_input").keyup(function(){

    if(event.which == 13){
      // salvo il valore dell'input ricerca
      var searchInput = $(".search_input").val();
      if (searchInput != "") {
        lastSearch = searchInput;
        // cancello il risultato precedente
        resetResults();
        // stampo a schermo il risultato e salvo il valore della funzione
        getIds("movie", searchInput);
        getIds("tv", searchInput);


        // setta la select filtro genre
        $('#select_genre').prop('disabled', false);
        $('#select_genre').val("0");


      }
    }
  });

  $("#select_genre").change(function () {
    // cancello il risultato precedente
    resetResults();
    // stampo a schermo il risultato e salvo il valore della funzione
    getIds("movie", lastSearch);
    getIds("tv", lastSearch);

  });

  // funzioni per lo scroll orizontale
  $(document).on( "click", ".angles", function() {
    if ($(this).hasClass("next")) {
      var firstElementList = $(this).parents(".row_results").find(".result:first-child").clone();
      $(this).parents(".row_results").find(".result:first-child").remove();
      $(this).parents(".row_results").find(".cards-list").append(firstElementList);
    } else if ($(this).hasClass("prev")) {
      var lastElementList = $(this).parents(".row_results").find(".result:last-child").clone();
      $(this).parents(".row_results").find(".result:last-child").remove();
      $(this).parents(".row_results").find(".cards-list").prepend(lastElementList);
    }
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
          printNoResults();
        } else if (obj.total_results != 0) {
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
  // copia e compila il template della row e appendila nel html
  var source = $("#row-results-template").html();
  var rowTemplate = Handlebars.compile(source);
  context = {
    "type": type,
    "type_label": jsUcfirst(type)
  }
  var html = rowTemplate(context);
  $("#container_results").append(html);

  // ricavo i risultati dall'oggetto scaricato e salvo in una variabile
  var results = obj.results;
  // ciclo l'array della risposta
  for(var i = 0; i < results.length; i++){
      // faccio unìaltra chiamata per ottenere i dettagli
    $.ajax(
      {
        "url":"https://api.themoviedb.org/3/"+type+"/"+results[i].id+"?api_key=faa82c855e9e700015c133bf3942bd8f",
        "method":"GET",
        "success": function (details) {
          // inserire qui il controllo su array genres
          if (displayOnByGenre(details.genres)) {

            // compilo il context
            var context = {
              "id": details.id,
              "isPoster": isPoster(details.poster_path),
              "poster": details.poster_path,
              "title": details.name || details.title,
              "type_class": type,
              "type_label": jsUcfirst(type),
              "star_vote": printStars(details.vote_average),
              "original_language" : details.original_language,
              "genres": getStringGenres(details.genres)
            };

            //preparo il template e lo compilo con il context
            var source = $("#cards-template").html();
            var template = Handlebars.compile(source);
            var html = template(context);
            $(".cards-list-"+type+"").append(html);
            getStringCast(type, details.id);
          }
        },
        "error":function (err) {
          alert("E avvenuto un errore. "+ err);
        }
    });
    // end call
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


// resetto la casella di ricerca input
function resetResults() {
  listGenres = [];
  // resetto la casella input
  $(".search_input").val("");
  // resetto la ricerca
  $("#container_results").html("");
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
  var context = "";
  var html = errorTemplate(context);
  $("#container_results").append(html);
  totalResults.movie = "";
  totalResults.tv = "";
}



// funzione per ottenere i primi 5 del cast
function getStringCast(type, idResult) {
  $.ajax(
    {
      "url":"https://api.themoviedb.org/3/"+type+"/"+idResult+"/credits?api_key=faa82c855e9e700015c133bf3942bd8f",
      "method":"GET",
      "success": function (data) {
        if (data.cast.length > 0) {
          var cast = "";
          for (var i = 1; i < 6; i++) {
            if (data.cast[i] != undefined) {
              cast += data.cast[i].name + " ";
            }
          }
          $(".cards-list-"+type+" .result[data-id="+idResult+"] .cast").append(cast);
        } else {
          $(".cards-list-"+type+" .result[data-id="+idResult+"] .cast").hide();
        }
      },
      "error":function (err) {
        alert("E avvenuto un errore. "+ err);
      }
  })
}

// funzione per inserire generi nell'array globale
function pushGenre(genre) {
  var newListGenres;
  if (!listGenres.includes(genre)) {
    listGenres.push(genre);
    listGenres.sort();
    renderFilterSelect(listGenres);
  }
}

// funzione per impostare lista filtri nella select
function renderFilterSelect(list) {
  // cancello la lista stampata precedentemente
  $("#select_genre").html("");
  replaceFilterDefault();
  // copio il template della option
  var source = $("#option-genres-template").html();
  var optionTemplate = Handlebars.compile(source);

  for (var i = 0; i < list.length; i++) {
    var context = {
      "value": list[i]
    }
    var html = optionTemplate(context);
    $("#select_genre").append(html);
  }
}

// funzione che unisce stringhe con spazio
function getStringGenres(list) {
  var arrayGenres = [];
  for (var i = 0; i < list.length; i++) {
    // inserisci genre nella lista
    pushGenre(list[i].name);
    arrayGenres.push(list[i].name);
  }
  return arrayGenres;
}

function replaceFilterDefault() {
  var source = $("#option-genres-default-template").html();
  var optionTemplate = Handlebars.compile(source);
  var html = optionTemplate();
  $("#select_genre").append(html);
}

function displayOnByGenre(list) {
  var genreOn = $("#select_genre").val();
  if (genreOn == 0) {
    return true;
  }
  for (var i = 0; i < list.length; i++) {
    if (list[i].name == genreOn) {
      return true;
    }
  }
}
