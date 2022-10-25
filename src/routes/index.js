const { Router } = require("express");
//*Importar todos los routers;

const videogamesRoute = require("./videogames.js");
const genresRoute = require("./genres.js");
const videogameRoute = require("./videogame.js");

const router = Router();

//*Configurar los routers

router.use("/videogames", videogamesRoute);
router.use("/genres", genresRoute);
router.use("/videogame", videogameRoute);

module.exports = router;
