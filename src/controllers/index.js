const axios = require("axios");
const { Videogame, Genres } = require("../db.js");

//*SOLICITUD LA API
const infoApi = async () => {
  let url = `https://api.rawg.io/api/games?key=00dd3ade32d2440e8b5debb2960f6c95`;
  //* CREAMOS UN ARRAY DONDE VAMOS A IR PUSHEANDO TODOS LOS VIDEOJUEGOS.
  let videojuegos = [];
  try {
    //* CON EL FOR RECORRO MI API,Y ENCONTRAMOS DOS OBJETOS. EL OBJETO RESULT QUE ES UN ARRAY Y ES EL QUE VOY A MAPEAR
    for (let i = 0; i < 5; i++) {
      const respuesta = await axios.get(url);
      //* TRABAJAMOS DE FORMA ASINCRONA PORQUE NO SABEMOS CUANTO VA TARDAR LA RESPUESTA.
      //* A LA RESPUESTA LE HACEMOS UN MAP PARA PODER PUSHEAR LOS ELEMENTOS.
      respuesta.data.results.map((v) => {
        videojuegos.push({
          id: v.id,
          name: v.name,
          image: v.background_image,
          rating: v.rating,
          platforms: v.platforms?.map((el) => el.platform.name),
          genres: v.genres?.map((el) => el.name),
          //* TANTO PLATAFORMAS COMO GENEROS, AL TENER OTRO ARRAY ADENTRO, LES APLICAMOS UN SUB MAPEO.
        });
      });
      //*EN EL NEXT VOY A PASAR A LA SIGUIENTE PAGINA.
      url = respuesta.data.next;
    }
    return videojuegos;
  } catch (e) {
    console.log(e);
  }
};

//A MI DB
const infoDB = async () => {
  try {
    return await Videogame.findAll({
      //*SELECT * FROM Videogame
      include: [
        {
          //* INCLUIMOS EL MODELO GENEROS CON EL ATRIBUTO NOMBRE
          model: Genres,
          atributes: ["name"],
          throught: {
            attributes: [],
          },
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

//*UNO MIS DOS SOLICITUDES
const infoTotal = async () => {
  //*PARA UNIR MIS 2 SOLICITUDES, LAS EJECUTO COMO UNA FUNCION ASINCRONA
  const apiData = await infoApi();
  const dbData = await infoDB();
  //ahora uno mis dos constantes contenedoras de funciones
  const infoCompleta = dbData.concat(apiData);
  return infoCompleta;
};
//* ------------------------------------------------------------------------------------------------------------->

//*SOLICITUD PARA MIS REQUEST POR QUERY
//*A MI API
const nameApi = async (name) => {
  const infoSearch = await axios.get(
    `https://api.rawg.io/api/games?search=${name}&key=00dd3ade32d2440e8b5debb2960f6c95`
  );
  //*infoSearch = {infoSearch{data[results]}} => Llega un objeto, que tiene una propiedad data y que a su vez tiene una propiedad results que es un [].

  try {
    const vgSearch = await infoSearch.data.results.map((el) => {
      //*[{}, {}, {}]
      return {
        id: el.id,
        name: el.name,
        image: el.background_image,
        rating: el.rating,
        platforms: el.platforms?.map((el) => el.platform.name),
        genres: el.genres?.map((el) => el.name),
      };
    });
    return vgSearch; //*=> [{}]
  } catch (e) {
    console.error(e);
  }
};
//!-------------------------------------------------------------------------------------------------------------->

//*SOLICITUD PARA MIS REQUEST POR PARAMS
//*A MI ENDPOINT: https://api.rawg.io/api/games/{id}
const idApi = async (id) => {
  try {
    const rtaApi = await axios.get(
      `https://api.rawg.io/api/games/${id}?key=00dd3ade32d2440e8b5debb2960f6c95`
    );
    if (rtaApi) {
      const vgId = await rtaApi.data;
      const info = {
        id: vgId.id,
        name: vgId.name,
        image: vgId.background_image,
        genres: vgId.genres?.map((g) => g.name),
        description: vgId.description,
        released: vgId.released,
        rating: vgId.rating,
        platforms: vgId.platforms?.map((el) => el.platform.name),
      };
      return info;
    } else {
      return "No hay un videojuego con ese id";
    }
  } catch (e) {
    console.error(e);
  }
};

//*A MI DB
const idDb = async (id) => {
  try {
    return await Videogame.findByPk(id, {
      include: [
        {
          model: Genres,
          atributes: ["name"],
          throught: {
            attributes: [],
          },
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

//*UNO MIS DOS SOLICITUDES
const videogame = async (id) => {
  const dbID = id.includes("-");
  if (dbID) {
    //* Como el id de la base de datos, se genera con numeros,letras y separados por un -. Usamos esta forma para detectar la informacion.

    const vgDb = await idDb(id);
    return vgDb;
  } else {
    const vgApi = await idApi(id);
    return vgApi;
  }
};

module.exports = {
  infoTotal,
  videogame,
  infoApi,
  infoDB,
  nameApi,
};
