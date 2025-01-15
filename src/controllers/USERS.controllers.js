import User from "../models/ModelUsers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "miClaveSecreta";

export const getUsers = async (req, res) => {
    try {
      const users = await User.findAll(); 
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  };

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { Uuid: req.params.Uuid }, 
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

export const postUser = async(req, res) => {
  try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(req.body.PasswordHash, 10);
      
      // Crear el usuario usando Sequelize sin especificar el UUID
      const newUser = await User.create({
          FullName: req.body.FullName,
          Email: req.body.Email,
          PhoneNumber: req.body.PhoneNumber,
          PasswordHash: hashedPassword,
          BirthDate: req.body.BirthDate,
          Rol: req.body.Rol
      });

      res.status(201).json({ message: "Usuario creado" });
  }
  catch(error) {
      console.error(error);
      // Si el error es por email duplicado
      if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ message: "El email ya está registrado" });
      }
      res.status(500).json({ message: "Error al crear usuario" });
  }
}

  export const putUser = async (req, res) => {
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(req.body.PasswordHash, 10);
        
        // Buscar y actualizar el usuario usando Sequelize
        const [updatedRows] = await User.update({
            FullName: req.body.FullName,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            PasswordHash: hashedPassword,
            BirthDate: req.body.BirthDate,
            Rol: req.body.Rol
        }, {
            where: {
                Uuid: req.params.Uuid
            }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al Editar usuario" });
    }
}

export const deleteUser = async (req, res) => {
    try {
      const { Uuid } = req.params;
  
      const user = await User.findOne({ where: { Uuid } });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      await user.destroy();
  
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  };

export const login = async (req, res) => {
    const { Email, Password } = req.body;
  
    try {
      // Busca el usuario por email
      const user = await User.findOne({ where: { Email } });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Verifica la contraseña
      const isPasswordValid = await bcrypt.compare(Password, user.PasswordHash);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
  
      // Genera el token JWT
      const token = jwt.sign(
        { email: user.Email, role: user.Rol },
        SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );
  
      res.json({ message: "Autenticación exitosa", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  };

export const getUserByEmail = async (req, res) => {
    const { Email } = req.body;
  
    if (!Email) {
      return res.status(400).json({ message: "El campo Email es obligatorio." });
    }
  
    try {
      // Busca el usuario por email usando Sequelize
      const user = await User.findOne({ where: { Email } });
  
      if (user) {
        res.json(user); // Devuelve el usuario si existe
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el usuario por email" });
    }
  };