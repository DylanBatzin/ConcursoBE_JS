import {conection} from "../database/conection.js";

export const getCategories = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request().query('SELECT * FROM CATEGORIES')
    res.json(result.recordset);
}

export const getCategory = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('SELECT * FROM CATEGORIES WHERE Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Categoría no encontrado"})
    }
}

export const postCategory = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Name', req.body.Name)
        .query('EXEC DA.INSERTCATEGORY   @Name = @Name')
        res.status(200).json({message: "Categoría creada"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear categoría"})
    }

}

export const  putCategory = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Uuid', req.params.Uuid)
        .input('Name', req.body.Name)
        .query('EXEC DA.UPDATECATEGORY   @Uuid = @Uuid, @Name = @Name')
        res.status(200).json({message: "Categoría actualizada"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar categoría"})
    }
}

export const deleteCategory = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('delete from CATEGORIES where Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.rowsAffected[0] === 0) {
        res.status(404).json({message: "Categoría no encontrado"})
    }
    
    return res.status(200).json({message: "Categoría eliminada"})
}

