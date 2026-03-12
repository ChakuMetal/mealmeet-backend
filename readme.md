Estrcutura del backend:

├── src/
│ ├── models/ (Mongoose schemas)
│ ├── routes/ (Express routes)
│ ├── controllers/ (Business logic)
│ ├── config/ (DB connection)
│ └── server.js (Entry point)
├── .env
├── package.json
|--.gitignore
└── README.md

-- EXPRESS: pruebas en puerto 5000

-- MODELO/ESQUEMA
Creación en "models" / "Recipe.js" para crear el modelo de la receta.

Las recetas se guardan en la base de datos, con Mongoose. Cada receta es un documento con un esquema.

Los campos que pueden actualizarse en función de las necesidades de control o comercial son por ahora, title (título de la receta), time (tiempo de preparación), ingredients (ingredientes), instructions (instrucciones),image (imagen), categoría (vegano, veraniego... son las tags) y level (facil, medio, dificil).

Creación de User, con nombre, email y password. Uso de bycryptjs para encriptar password y JWT.

✅ Servidor Express
✅ MongoDB conectado
✅ Modelo User con validaciones
✅ Registro de usuarios (hashea password)
✅ Login (devuelve JWT token)
✅ Middleware de autenticación
✅ Rutas de recetas (CRUD)

Pruebas con Postman:

- Registro: POST http://localhost:5000/api/auth/register
- Login: POST http://localhost:5000/api/auth/login

Recetas, pruebas con postman:

- Creación de un user (POST)
- Obtención de token
- Login OK
- Creación de receta OK (POST)
- Obtención de un listado de todas las recetas del user: OK (GET)
- Obtener una receta en concreto por la id de la receta: OK (GET)
- Hacer Update de la receta (200): OK (PUT)
- Eliminar una receta realizado (200): (OK) (DELETE)

Subida a GITHUB de ficheros
