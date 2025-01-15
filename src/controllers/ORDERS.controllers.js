import sequelize from '../database/conection.js';
import { QueryTypes } from 'sequelize';


export const getOrders = async (req, res) => {
  try {
    const rawData = await sequelize.query(
      `EXEC DA.GetAllOrdersWithDetails`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (rawData.length > 0) {
      const orders = rawData.reduce((acc, row) => {
        const orderIndex = acc.findIndex(o => o.OrderUuid === row.OrderUuid);
        const orderDetail = {
          ProductUuid: row.ProductUuuid, // Asegúrate que este nombre sea correcto
          Quantity: row.Quantity,
          SubTotal: row.SubTotal
        };

        if (orderIndex > -1) {
          // Si la orden ya existe, agrega el detalle
          if (row.ProductUuuid) { // Solo agrega detalles si existen
            acc[orderIndex].OrderDetails.push(orderDetail);
          }
        } else {
          // Nueva orden con sus detalles
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
      res.status(404).json({ message: 'No se encontraron órdenes.' });
    }
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes.' });
  }
};

  export const getOrder = async (req, res) => {
    try {
      // Ejecutamos el stored procedure con parametros
      const results = await sequelize.query(
        'EXEC DA.GetOrderWithDetails @OrderUuid = :OrderUuid',
        {
          replacements: { OrderUuid: req.params.Uuid },
          type: QueryTypes.SELECT, // Tipo de operación
        }
      );
  
      // 'results' será un array con los registros retornados
      // Tomamos el primer elemento (si existe)
      const order = results.length > 0 ? results[0] : null;
  
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Orden no encontrado' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const postOrder = async (req, res) => {
    try {
      // Llamada al stored procedure con parámetros
      await sequelize.query(
        `EXEC DA.MANAGERORDERS
           @Action      = :Action,
           @UserUuid    = :UserUuid,
           @TotalAmount = :TotalAmount,
           @StatusUuid  = :StatusUuid,
           @OrderDetails= :OrderDetails
        `,
        {
          replacements: {
            Action: 'INSERT',
            UserUuid: req.body.UserUuid,
            TotalAmount: req.body.TotalAmount,
            StatusUuid: req.body.StatusUuid,
            OrderDetails: JSON.stringify(req.body.OrderDetails),
          },
          type: QueryTypes.RAW,  
        }
      );
      
      // Si todo salió bien
      res.status(200).json({ message: "Orden creada" });
    } catch (error) {
      console.error('Error al crear orden:', error);
      res.status(500).json({ message: "Error al crear orden" });
    }
  };

  export const putOrder = async (req, res) => {
    try {
      await sequelize.query(
        `EXEC DA.MANAGERORDERS
           @OrderUuid   = :OrderUuid,
           @Action      = :Action,
           @UserUuid    = :UserUuid,
           @TotalAmount = :TotalAmount,
           @StatusUuid  = :StatusUuid,
           @OrderDetails= :OrderDetails
        `,
        {
          replacements: {
            OrderUuid: req.params.Uuid,
            Action: 'UPDATE',
            UserUuid: req.body.UserUuid,
            TotalAmount: req.body.TotalAmount,
            StatusUuid: req.body.StatusUuid,
            OrderDetails: JSON.stringify(req.body.OrderDetails),
          },
          type: QueryTypes.RAW,
        }
      );
  
      return res.status(200).json({ message: 'Orden actualizada' });
    } catch (error) {
      console.error('Error al editar orden:', error);
      return res.status(500).json({ message: 'Error al editar orden' });
    }
  };


  export const deleteOrder = async (req, res) => {
    // Extraes el UUID de req.params
    const { Uuid } = req.params;  
    try {
      await sequelize.query(
        `EXEC DA.MANAGERORDERS
           @Action    = :Action,
           @OrderUuid = :OrderUuid
        `,
        {
          replacements: {
            Action: 'DELETE',
            OrderUuid: Uuid
          },
          type: QueryTypes.RAW
        }
      );
      res.status(200).json({ message: 'Orden eliminada' });
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      res.status(500).json({ message: 'Error al eliminar orden' });
    }
  };

  export const getOrdersByStatus = async (req, res) => {
    const fixedStatusUuid = '6EB91343-C1DD-4FE0-AD42-FD479D5575F2'; // UUID fijo
  
    try {
      // Usamos una consulta raw para invocar al SP
      const rawData = await sequelize.query(
        `EXEC DA.GetOrdersByStatus @StatusUuid = :StatusUuid`, 
        {
          replacements: { StatusUuid: fixedStatusUuid },
          type: QueryTypes.SELECT,  // Esperamos un SELECT
        }
      );
  
      if (rawData.length > 0) {
        // Transformar datos (similar a lo que hacías con result.recordset)
        const orders = rawData.reduce((acc, row) => {
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
            // Nueva orden
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
        res.status(404).json({ message: "No se encontraron órdenes con el estado especificado" });
      }
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      res.status(500).json({ message: "Error al obtener órdenes" });
    }
  };

  export const getOrdersByUser = async (req, res) => {
    try {
      // Ejecutamos el stored procedure con el parámetro :UserUuid
      const rawData = await sequelize.query(
        `EXEC DA.GetOrdersByUser @UserUuid = :UserUuid`,
        {
          replacements: { UserUuid: req.params.userUuid },
          type: QueryTypes.SELECT, // Esperamos filas (resultado tipo SELECT)
        }
      );
  
      if (rawData.length > 0) {
        // Transformar datos, igual que hacías con result.recordset
        const orders = rawData.reduce((acc, row) => {
          const orderIndex = acc.findIndex(o => o.OrderUuid === row.OrderUuid);
          const orderDetail = {
            ProductUuid: row.ProductUuuid,
            Quantity: row.Quantity,
            SubTotal: row.SubTotal
          };
  
          if (orderIndex > -1) {
            // La orden ya existe, agregamos detalle
            acc[orderIndex].OrderDetails.push(orderDetail);
          } else {
            // Nueva orden
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
      console.error("Error al obtener órdenes del usuario:", error);
      res.status(500).json({ message: "Error al obtener órdenes del usuario" });
    }
  };