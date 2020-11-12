// FUNZIONE PER LO SCROLL ORIZZIONATALE


function scrollHorizontal(container, list, elements, angles) {
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
}

// ISTRUZIONI E FUNZIONE PER RESIZE DIV CON MOUSE

// <style>
// #resizable { width: 200px; height: 150px; padding: 5px; }
// #resizable h3 { text-align: center; margin: 0; }
// </style>
//
// <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
// <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
//
// <script>
$( function() {
  $( "#resizable" ).resizable({
    maxHeight: 150,
    maxWidth: 350,
    minHeight: 150,
    minWidth: 200,
    handles: "e"
  });
} );
// </script>
//
//
// </head>
// <body>
//
// <div id="resizable" class="ui-widget-content">
// <h3 class="ui-widget-header">Resize larger / smaller</h3>
// </div>
