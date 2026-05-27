const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

// Crear token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Crear REGISTRO del usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email ya registrado" });
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
    return res.status(500).json({ error: "Error de servidor" });
  }
};

// LOGIN del usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales invalidas" });
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
    return res.status(500).json({ error: "Error de servidor" });
  }
};

//RECORDAR LA CONTRASEÑA (forgot password)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "Si el correo existe, enviaremos instrucciones para restablecer la contraseña",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message:
        "Si el correo existe, enviaremos instrucciones para restablecer la contraseña",
      resetToken, // En producción, este token se enviaría por email, no se devolvería en la respuesta
    });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
};

// RESTABLECER CONTRASEÑA
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token requerido" });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          error: "La nueva contraseña debe tener al menos 8 caracteres",
        });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "Token invalido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
