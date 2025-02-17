$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "pokemon.json-master/pokedex.json",
    dataType: "json",
    success: function (data) {
      let container = $("#card-container");
      container.empty();
      const template = document.querySelector("#pokemon-template");

      $.each(data, function (index, pokemon) {
        let idPadded = String(pokemon.id).padStart(3, "0");
        let imgSrc = "pokemon.json-master/images/" + idPadded + ".png";

        let clone = $(template.content.cloneNode(true));

        clone
          .find(".card-front img")
          .attr("src", imgSrc)
          .attr("alt", pokemon.name.english);

        clone.find(".nombre-pokemon").text(pokemon.name.english);

        let typeList = clone.find(".tipos ul");
        $.each(pokemon.type, function (idx, type) {
          $("<li>").text(type).appendTo(typeList);
        });

        let statsList = clone.find(".stats");
        $.each(pokemon.base, function (statName, statValue) {
          $("<li>")
            .text(statName + ": " + statValue)
            .appendTo(statsList);
        });

        clone.find(".card").on("click", function () {
          $(this).toggleClass("flipped");
        });

        container.append(clone);
      });
    },
  });
});
