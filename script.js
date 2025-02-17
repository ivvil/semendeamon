let pokemones;

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
		url: "pokemon.json-master/types.json",
		dataType: "json",
		success: (data) => {
			displayPokemonTypes(data);
		},
	});


	$("#filter-form").submit((evt) => {
		evt.preventDefault();
		let tipo = $("#tipos").val();
		displayPokemones(filterPokemonesByType(pokemones, tipo));
	});
});

function displayPokemonTypes(types) {
	/**
	 * @type {HTMLSelectElement} The select to display pokemon types for filtering
	 */
	const select = $("nav #tipos");
	select.empty();

	select.append(new Option("Select a type", ""));

	for (let type of types) {
		select.append(new Option(type.english, type.english));
	}
}

/**
 * @param {JSON} pokemones The pokemones to filter.
 * @param {string} type The pokemon type to filter by.
 */
function filterPokemonesByType(pokemones, type) {
	return pokemones.filter((pokemon) => pokemon.type.includes(type));
}

function displayPokemones(pokemones) {
	let container = $("#card-container")
	container.empty();
	const template = document.querySelector("#pokemon-template");

	$.each(pokemones, function (index, pokemon) {
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
}

