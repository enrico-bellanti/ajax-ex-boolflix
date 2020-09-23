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
      getMovies(searchMovie);
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
        getMovies(searchMovie);
      }
    }

  });


  //click sul quadratino prende il valore di data-page e passiamo il valore alla funzione getMovies
  $(document).on("click", ".page_numb", function(){
    //seleziono con il this cioè quel quadratino che vado a selezionare
    var actualPage = $(this).attr("data-page");
    // cancello il risultato precedente
    resetResult();
    // printa a schermo risultato pagina selezionata
    getMovies(lastSearch, actualPage);
  });

});

//Printa il risultato della risposta a schermo con i film e il numero di pagine
function getMovies(searchMovies, page){

  var api_key = "e985f53e1e87b07c7fd1095468f025a0";

  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key" : api_key,
        "language": "it-IT",
        "page": page,
        "query": searchMovies
      },
      "method": "GET",
      "success": function (data) {
        renderMovies(data);
        renderPages(data);
      },
      "error": function (err) {
        alert("E' avvenuto un errore. " + err);
      }
    }
  );
}

//stampo il numero di pagine della chiamata
function renderPages(obj){
  var totalPages = obj.total_pages;
  //preparo il template
  var source = $("#pages-template").html();
  var pageTemplate = Handlebars.compile(source);

  //ciclo i numeri delle pagine prodotte dal risutato della query e compilo il context
  for(var i = 1; i <= totalPages; i++){
    var context = {
      "page": i
    }

    var html = pageTemplate(context);
    //stampo nel DOM
    $(".movies-page-list").append(html);
  }
}

// resetto la casella di ricerca input
function resetResult() {
  $("#movies-list").html("");
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

    var context = {
      "title": results[i].title,
      "original_title": results[i].original_title,
      "original_language" : results[i].original_language,
      "vote_average": results[i].vote_average
    };

    var html = template(context);
    $("#movies-list").append(html);
  }

}
