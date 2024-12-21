import {conection} from "../database/conection.js";


export const getStatus = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request().query('SELECT * FROM STATUS')
    res.json(result.recordset);
}

export const getStatusById = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('SELECT * FROM STATUS WHERE Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Estatus no encontrado"})
    }
}

export const postStatus = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Name', req.body.Name)
        .query('EXEC DA.INSERTESTATUS   @Name = @Name')
        res.status(200).json({message: "Estatus creado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear estatus"})
    }

}

export const  putStatus = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Uuid', req.params.Uuid)
        .input('Name', req.body.Name)
        .query('EXEC DA.UPDATESTATUS   @Uuid = @Uuid, @Name = @Name')
        res.status(200).json({message: "Estatus actualizado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar estatus"})
    }

}

export const deleteStatus = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('delete from STATUS where Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.rowsAffected[0] === 0) {
        res.status(404).json({message: "Estatus no encontrado"})
    }
    
    return res.status(200).json({message: "Estatus eliminado"})     
}