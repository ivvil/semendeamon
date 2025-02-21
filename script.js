let pokemones;

let videos;

function getEmbedUrl(youtubeUrl) {
  const videoId = youtubeUrl.split("v=")[1];
  return "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
}

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "pokemon.json-master/pokedex.json",
    dataType: "json",
    success: function (data) {
      pokemones = data;
      displayPokemones(data);
    },
  });

  $.ajax({
    type: "GET",
    url: "pokemon.json-master/videos.json",
    dataType: "json",
	success: (data) => {
	  videos = data;
	  console.log(data);
	},
  });

  $.ajax({
    type: "GET",
    url: "pokemon.json-master/types.json",
    dataType: "json",
    success: (data) => {
      displayPokemonTypes(data);
      $(".toggle-button").each((idx, elmnt) => {
        const $button = $(elmnt);
        $button.attr("data-toggle-state", "false");
        $button.on("click", (evt) => {
          const $target = $(evt.target);

          const currState = $target.attr("data-toggle-state");
          const newState = currState == "true" ? "false" : "true";

          $target.attr("data-toggle-state", newState);
        });
      });
      $(".toggle-button").each((idx, elmnt) => {
        const $button = $(elmnt);

        $button.on("click", (evt) => {
          $(".toggle-button").removeClass("selected");
          $button.addClass("selected");
        });
      });

      let prevButton = null;

      $(".toggle-button").each((idx, elmnt) => {
        const $button = $(elmnt);
        $button.on("click", () => {
          if (prevButton && prevButton !== $button) {
            prevButton.removeClass("selected").addClass("visited");
          }
          $button.removeClass("visited").addClass("selected");
          prevButton = $button;
        });
      });
    },
  });

  $("#filter-form").submit((evt) => {
    evt.preventDefault();
    let tipo = $("#tipos").val();
    filterPokemonesByType(tipo);
  });
});

function displayPokemonTypes(types) {
  const $select = $("nav #types-select");

//   const $allTypes = $("<button>", {
//     text: "Todos",
//     class: "toggle-button",
//     click: () => filterPokemonesByType(),
//   });
//   $select.append($allTypes);

  types.forEach((type) => {
    const $button = $("<button>", {
      text: type.english,
      class: "toggle-button",
      click: () => filterPokemonesByType(type.english),
    });
    $select.append($button);
  });
}

/**
 * @param {Array<string>} type The pokemon type to filter by.
 */
function filterPokemonesByType(type = []) {
  const normalizedType = type.toLowerCase();

  $("[data-ptype]").each((idx, element) => {
    const $pkmn = $(element);
    const types = $pkmn.data("ptype").map((e) => e.toLowerCase());

    if (types.includes(normalizedType)) {
      $pkmn.off("click").on("click", () => {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const embedUrl = getEmbedUrl(randomVideo.url);

        const $overlay = $(`
          <div class="video-overlay">
          <p>${randomVideo.name}</p>
            <iframe
              src="${embedUrl}"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
              class="video-fade-in">
            </iframe>
			<h6>Presiona ESC para cerrar</h6>
          </div>
        `);

        $("body").append($overlay);

        const closeVideo = () => {
          $overlay
            .find("iframe")
            .removeClass("video-fade-in")
            .addClass("video-fade-out");
          setTimeout(() => $overlay.remove(), 500);
        };

        $overlay.on("click", closeVideo);
        $(document).on("keydown.videoKey", (e) => {
          if (e.key === "Escape") {
            closeVideo();
            $(document).off("keydown.videoKey");
          }
        });
      });
    }

    $pkmn.attr("aria-selected", types.includes(normalizedType));
  });
}

function displayPokemones(pokemones) {
  let container = $("#card-container");
  container.empty();
  const template = document.querySelector("#pokemon-template");

  $.each(pokemones, function (index, pokemon) {
    let idPadded = String(pokemon.id).padStart(3, "0");
    let imgSrc = "pokemon.json-master/images/" + idPadded + ".png";

    let clone = $(template.content.cloneNode(true));

    clone.find(".card").attr("data-ptype", JSON.stringify(pokemon.type));

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

    clone.find(".card").on("dblclick", function () {
      $(this).toggleClass("flipped");
    });

    container.append(clone);
  });
}
