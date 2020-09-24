// //stampo il numero di pagine della chiamata
// function renderPages(obj){
//   var totalPages = obj.total_pages;
//   //preparo il template
//   var source = $("#pages-template").html();
//   var pageTemplate = Handlebars.compile(source);
//
//   //ciclo i numeri delle pagine prodotte dal risutato della query e compilo il context
//   for(var i = 1; i <= totalPages; i++){
//     var context = {
//       "page": i
//     }
//
//     var html = pageTemplate(context);
//     //stampo nel DOM
//     $(".movies-page-list").append(html);
//   }
// }


//click sul quadratino prende il valore di data-page e passiamo il valore alla funzione getResults
// $(document).on("click", ".page_numb", function(){
//   //seleziono con il this cioè quel quadratino che vado a selezionare
//   var actualPage = $(this).attr("data-page");
//   // cancello il risultato precedente
//   resetResult();
//   // printa a schermo risultato pagina selezionata
//   getResults(lastSearch, actualPage);
// });
