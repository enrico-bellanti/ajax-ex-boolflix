$(document).ready(function() {
  scrollHorizontal($(".cards-list"), $(".angles"));
});


// funzione per scrollare con angles orizzontalmente
function scrollHorizontal(list, angle) {
  var box = list;
  var boxScroll;
  angle.click(function() {
    if ($(this).hasClass("next")) {
      boxScroll = ((box.width() / 2)) + box.scrollLeft();
      box.animate({
        scrollLeft: boxScroll,
      })
    } else {
      x = ((box.width() / 2)) - box.scrollLeft();
      box.animate({
        scrollLeft: -boxScroll,
      })
    }
  })
}
