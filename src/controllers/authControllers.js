const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Crear token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Crear REGISTRO del usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email ya registrado" });
    }
    // aquí es donde se hashea la clave antes de guardarla en la base de datos,
    // utilizando bcrypt y el número de rondas definido en las variables de entorno.
    const hashed = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    const user = await User.create({ name, email, password: hashed });

    const token = createToken(user._id);

    res.status(201).json({
      message: "Usuario creado",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error completo:", error); // Ver en consola del servidor
    res
      .status(500)
      .json({ message: "Error en registro", error: error.message });
  }
};

// LOGIN del usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login correcto",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error completo:", error); // Ver en consola del servidor
  }
};

module.exports = { register, login };
