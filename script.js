$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "pokemon.json-master/pokedex.json",
    dataType: "json",
    success: function (data) {
      let container = $("#card-container");
      container.empty();

      /**
       * @type {HTMLTemplateElement} Pokemon template
       */
      /* const template = $("#pokemon-template").contents; */

      $.each(data, function (index, pokemon) {
        let idPadded = String(pokemon.id).padStart(3, "0");
        let imgSrc = "pokemon.json-master/images/" + idPadded + ".png";

        /* let clone = template.cloneNode(true); */

        /* clone
          .find(".card-front img")
          .attr("src", imgSrc)
          .attr("alt", pokemon.name.english);
        clone.find(".pokemon-name").text(pokemon.name.english);


        let typeList = clone.find(".type-list").empty();
        $.each(pokemon.type, function (index, type) {
          $("<li></li>").text(type).appendTo(typeList);
        }); */

        let newCard = $(`
          <div id="card">
            <div id="card-front">
              <img src="${imgSrc}" alt="${pokemon.name.english}" >
              <h3 id="nombre-pokemon">${pokemon.name.english}</h3>
            </div>
            <div id="card-back">
              <div id="tipos">
                <ul></ul>
              </div>
            </div>
          </div>
        `);

        container.append(newCard);
      });
    },
  });
});
