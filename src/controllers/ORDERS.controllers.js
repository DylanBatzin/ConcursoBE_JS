import {conection} from "../database/conection.js";
import sql from 'mssql';
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
        .execute('DA.MANAGERORDERS')
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
        .execute('DA.MANAGERORDERS')
        res.status(200).json({message: "Orden actualizada"})
        
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar orden"})
    }   
}

export const deleteOrder = async (req, res) => {
    const pool = await conection();
    const { Uuid } = req.params;  // Extract Uuid from params
    console.log('Deleting order with UUID:', Uuid);  // Log UUID for debugging

    try {
        // Execute stored procedure to delete the order
        await pool.request()
            .input('Action', 'DELETE')
            .input('OrderUuid', sql.UniqueIdentifier, Uuid)  // Pass the correct parameter name
            .execute('DA.MANAGERORDERS');
        
        res.status(200).json({ message: "Orden eliminada" });
    } catch (error) {
        console.error('Error while deleting order:', error);
        res.status(500).json({ message: "Error al eliminar orden" });
    }
};

export const getOrdersByStatus = async (req, res) => {
    const pool = await conection();
    const fixedStatusUuid = '6EB91343-C1DD-4FE0-AD42-FD479D5575F2'; // UUID fijo

    try {
        const result = await pool.request()
            .input('StatusUuid', fixedStatusUuid)
            .execute('DA.GetOrdersByStatus');
        
        if (result.recordset.length > 0) {
            // Transformar datos
            const orders = result.recordset.reduce((acc, row) => {
                const orderIndex = acc.findIndex(o => o.OrderUuid === row.OrderUuid); // Agrupar por OrderUuid
                const orderDetail = {
                    ProductUuid: row.ProductUuuid,
                    Quantity: row.Quantity,
                    SubTotal: row.SubTotal
                };

                if (orderIndex > -1) {
                    // Si la orden ya existe, agrega el detalle
                    acc[orderIndex].OrderDetails.push(orderDetail);
                } else {
                    // Si es una nueva orden, crea la estructura
                    acc.push({
                        OrderUuid: row.OrderUuid,  // Ahora agrupamos por OrderUuid
                        UserUuid: row.UserUuid,
                        TotalAmount: row.TotalAmount,
                        StatusUuid: row.StatusUuid,
                        OrderDetails: row.ProductUuuid ? [orderDetail] : []
                    });
                }
                return acc;
            }, []);

            res.json(orders);
        } else {
            res.status(404).json({ message: "No se encontraron órdenes con el estado especificado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener órdenes" });
    }
}

export const getOrdersByUser = async (req, res) => {
    const pool = await conection();
    try {
        const result = await pool.request()
            .input('UserUuid', req.params.userUuid)
            .execute('DA.GetOrdersByUser');
        
        if (result.recordset.length > 0) {
            // Transformar datos usando el mismo patrón que getOrdersByStatus
            const orders = result.recordset.reduce((acc, row) => {
                const orderIndex = acc.findIndex(o => o.OrderUuid === row.OrderUuid);
                const orderDetail = {
                    ProductUuid: row.ProductUuuid,
                    Quantity: row.Quantity,
                    SubTotal: row.SubTotal
                };

                if (orderIndex > -1) {
                    // Si la orden ya existe, agrega el detalle
                    acc[orderIndex].OrderDetails.push(orderDetail);
                } else {
                    // Si es una nueva orden, crea la estructura
                    acc.push({
                        OrderUuid: row.OrderUuid,
                        UserUuid: row.UserUuid,
                        TotalAmount: row.TotalAmount,
                        StatusUuid: row.StatusUuid,
                        OrderDetails: row.ProductUuuid ? [orderDetail] : []
                    });
                }
                return acc;
            }, []);

            res.json(orders);
        } else {
            res.status(404).json({ message: "No se encontraron órdenes para este usuario" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener órdenes del usuario" });
    }
}