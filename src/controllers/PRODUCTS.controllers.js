import {conection} from "../database/conection.js";
import mssql from 'mssql';


export const getProducts = async (req, res) => {
    try {
        const pool = await conection();
        const result = await pool.request().query('SELECT * FROM PRODUCTS');
        const products = result.recordset.map((product) => ({
          ...product,
          Image: product.Image
            ? `data:image/jpeg;base64,${Buffer.from(product.Image).toString('base64')}`
            : null, 
        }));
    
        res.json(products);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
      }
    };


export const getProduct = async (req, res) => {    
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('SELECT * FROM PRODUCTS WHERE Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.recordset.length > 0) {
        res.json(result.recordset[0]);
    }
    else {
        res.status(404).json({message: "Producto no encontrado"})
    }
}

export const postProduct = async(req, res) => {
    const pool = await conection()
    try {
        const image = req.file?.buffer;
        await pool.request()
        .input('Code', req.body.Code)
        .input('Name', req.body.Name)
        .input('Brand', req.body.Brand)
        .input('stock', req.body.stock)
        .input('price', req.body.price)
        .input('Image', mssql.VarBinary,image)
        .input('Category', req.body.Category)
        .input('Status', req.body.Status)
        .query('EXEC DA.INSERTPRODUCT @Code = @Code, @Name = @Name, @Brand = @Brand, @stock = @stock, @price = @price, @Image = @Image, @Category = @Category, @Status = @Status')
        res.status(200).json({message: "Producto creado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al crear producto"})
    }

}
export const  putProduct = async(req, res) => {
    const pool = await conection()
    try {
        const image = req.file?.buffer;
        await pool.request()
        .input('ProductUuid', req.params.ProductUuid)
        .input('Code', req.body.Code)
        .input('Name', req.body.Name)
        .input('Brand', req.body.Brand)
        .input('stock', req.body.stock)
        .input('price', req.body.price)
        .input('Image', mssql.VarBinary,image)
        .input('Category', req.body.Category)
        .input('Status', req.body.Status)
        .query('EXEC DA.UPDATEPRODUCT  @ProductUuid = @ProductUuid, @Code = @Code, @Name = @Name,  @Brand = @Brand, @stock = @stock, @price = @price, @Image = @Image, @Category = @Category, @Status = @Status')
        res.status(200).json({message: "Producto actualizado"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error al editar producto"})
    }
}


export const deleteProduct = async (req, res) => {
    const pool = await conection()
    const result =  await pool.request()
    .input('Uuid', req.params.Uuid)
    .query('delete from PRODUCTS where Uuid = @Uuid', {Uuid: req.params.Uuid})
    
    if(result.rowsAffected[0] === 0) {
        res.status(404).json({message: "Producto no encontrado"})
    }
    
    return res.status(200).json({message: "Producto eliminado"})
}