import e from "express";
import {conection} from "../database/conection.js";

export const getRoles = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request().query('SELECT * FROM ROLES')
    res.json(result.recordset);
}

export const getRole = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('SELECT * FROM ROLES WHERE Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Rol no encontrado"})
    }
}

export const postRole = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Name', req.body.Name)
        .query('EXEC DA.INSERTROLE   @Name = @Name')
        res.status(200).json({message: "Rol creado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear rol"})
    }

}

export const  putRole = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Uuid', req.params.Uuid)
        .input('Name', req.body.Name)
        .query('EXEC DA.UPDATEROLE   @RoleUuid = @Uuid, @Name = @Name')
        res.status(200).json({message: "Rol actualizado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar rol"})
    }
}

export const deleteRole = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('delete from ROLES where Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.rowsAffected[0] === 0) {
        res.status(404).json({message: "Rol no encontrado"})
    }
    
    return res.status(200).json({message: "Rol eliminado"})
}