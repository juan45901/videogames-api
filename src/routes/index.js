const { Router } = require("express");
//*Importar todos los routers;

const videogamesRoute = require("./Videogames.js");
const genresRoute = require("./Genres.js");
const videogameRoute = require("./Videogame.js");

const router = Router();

//*Configurar los routers

router.use("/Videogames", videogamesRoute);
router.use("/Genres", genresRoute);
router.use("/Videogame", videogameRoute);

module.exports = router;
