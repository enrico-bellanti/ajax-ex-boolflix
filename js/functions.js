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
