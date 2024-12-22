import {conection} from "../database/conection.js";

export const getOrders = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request().query('SELECT * FROM DA.AllOrdersWithDetails')
    res.json(result.recordset);
}

export const getOrder = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('EXEC DA.GetOrderWithDetails @OrderUuid  = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Orden no encontrado"})
    }
}

export const postOrder = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Action', 'INSERT')
        .input('UserUuid', req.body.UserUuid)
        .input('TotalAmount', req.body.TotalAmount)
        .input('StatusUuid', req.body.StatusUuid)
        .input('OrderDetails', JSON.stringify(req.body.OrderDetails))
        .execute('DA.ManageOrders')
        res.status(200).json({message: "Orden creada"})
        
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear orden"})
    }   
}

export const  putOrder = async(req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('OrderUuid', req.params.Uuid)
        .input('Action', 'UPDATE')
        .input('UserUuid', req.body.UserUuid)
        .input('TotalAmount', req.body.TotalAmount)
        .input('StatusUuid', req.body.StatusUuid)
        .input('OrderDetails', JSON.stringify(req.body.OrderDetails))
        .execute('DA.ManageOrders')
        res.status(200).json({message: "Orden actualizada"})
        
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar orden"})
    }   
}

export const deleteOrder = async (req, res) => {
    const pool = await conection()
    try {
        await pool.request()
        .input('Action', 'DELETE')
        .input('Uuid', req.params.Uuid)
        .execute('DA.ManageOrders')
        res.status(200).json({message: "Orden eliminada"})
        
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al eliminar orden"})
    }   
}