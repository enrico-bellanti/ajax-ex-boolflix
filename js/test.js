
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
