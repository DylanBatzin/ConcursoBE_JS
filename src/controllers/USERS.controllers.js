import {conection} from "../database/conection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "miClaveSecreta";

export const getUsers = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request().query('SELECT * FROM USERS')
    res.json(result.recordset);
}

export const getUser = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('SELECT * FROM USERS WHERE Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Usuario no encontrado"})
    }
}

export const postUser = async(req, res) => {
    const pool = await conection()
    try {
        const hashedPassword = await bcrypt.hash(req.body.PasswordHash, 10);
        await pool.request()
        .input('FullName', req.body.FullName)
        .input('Email', req.body.Email)
        .input('PhoneNumber', req.body.PhoneNumber)
        .input('PasswordHash', hashedPassword)
        .input('BirthDate', req.body.BirthDate)
        .input('Rol', req.body.Rol)
        .query('EXEC DA.INSERTUSER @FullName = @FullName, @Email = @Email, @PhoneNumber = @PhoneNumber, @PasswordHash = @PasswordHash, @BirthDate = @BirthDate, @Rol = @Rol')
        res.status(200).json({message: "Usuario creado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear usuario"})
    }

}

export const putUser = async(req, res) => {
    const pool = await conection()
    try {
        const hashedPassword = await bcrypt.hash(req.body.PasswordHash, 10);
        await pool.request()
        .input('UserUuid', req.params.Uuid)
        .input('FullName', req.body.FullName)
        .input('Email', req.body.Email)
        .input('PhoneNumber', req.body.PhoneNumber)
        .input('PasswordHash', hashedPassword)
        .input('BirthDate', req.body.BirthDate)
        .input('Rol', req.body.Rol)
        .query('EXEC DA.UPDATEUSER @UserUuid = @UserUuid, @FullName = @FullName, @Email = @Email, @PhoneNumber = @PhoneNumber, @PasswordHash = @PasswordHash, @BirthDate = @BirthDate, @Rol = @Rol')
        res.status(200).json({message: "Usuario actualizado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al Editar usuario"})
    }
}

export const deleteUser = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('delete from USERS where Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.rowsAffected[0] === 0) {
        res.status(404).json({message: "Usuario no encontrado"})
    }
    
    return res.status(200).json({message: "Usuario eliminado"})
}

export const login = async (req, res) => {
    const pool = await conection();
    const { Email, Password } = req.body;

    try {
        const result = await pool.request()
        .input('Email', Email)
        .query('SELECT * FROM USERS WHERE Email = @Email');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const isPasswordValid = await bcrypt.compare(Password, user.PasswordHash);

            if (isPasswordValid) {
                const token = jwt.sign({ email: user.Email, role: user.Rol }, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
                return res.json({ message: "Autenticación exitosa", token });
            } else {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al autenticar usuario" });
    }
};

export const getUserByEmail = async (req, res) => {
    const pool = await conection();
    const { Email } = req.body; 

    if (!Email) {
        return res.status(400).json({ message: "El campo Email es obligatorio." });
    }

    try {
        const result = await pool.request()
            .input('Email', Email) 
            .query('SELECT * FROM DA.USERS WHERE Email = @Email'); 

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); 
        } else {
            res.status(404).json({ message: "Usuario no encontrado" }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario por email" }); 
    }
};
