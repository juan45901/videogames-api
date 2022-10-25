const axios = require("axios");
const { Router } = require("express");
const { Genres } = require("../db.js");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const respuesta = await axios.get(
      `https://api.rawg.io/api/genres?key=00dd3ade32d2440e8b5debb2960f6c95`
    );
    const genresApi = await respuesta.data.results.map((g) => g.name);

    genresApi.map((e) =>
      Genres.findOrCreate({
        //* Guardo todos los generos que vienen de la API en la DB
        where: { name: e }, //
      })
    );

    const allGenres = await Genres.findAll(); //* Traigo todos los generos que existen, tanto de la API como de la DB. Porque los que venian de la API, ya fueron anteriormente guardados en la DB.
    res.json(allGenres);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
