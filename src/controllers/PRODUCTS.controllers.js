import Product from "../models/ModelProduct.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        
        const transformedProducts = products.map(product => {
            const plainProduct = product.get({ plain: true });
            return {
                ...plainProduct,
                Image: plainProduct.Image
                    ? `data:image/jpeg;base64,${Buffer.from(plainProduct.Image).toString('base64')}`
                    : null,
            };
        });

        res.json(transformedProducts);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

export const getProduct = async (req, res) => {    
    try {
        const product = await Product.findOne({
            where: {
                Uuid: req.params.Uuid
            }
        });
        
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener producto" });
    }
}

export const postProduct = async(req, res) => {
    try {
        const image = req.file?.buffer;
        const newProduct = await Product.create({
            Code: req.body.Code,
            Name: req.body.Name,
            Brand: req.body.Brand,
            Stock: req.body.stock,
            Price: req.body.price,
            Image: image,
            Category: req.body.Category,
            StatusUuid: req.body.Status,
            
        });

        res.status(201).json({ message: "Producto creado" });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "El código de producto ya existe" });
        }
        res.status(500).json({ 
            message: "Error al crear producto",
            error: error.message 
        });
    }
}

export const putProduct = async(req, res) => {
    try {
        const image = req.file?.buffer;
        
        const [updatedRows] = await Product.update({
            Code: req.body.Code,
            Name: req.body.Name,
            Brand: req.body.Brand,
            Stock: req.body.stock,
            Price: req.body.price,
            ...(image && { Image: image }), 
            Category: req.body.Category,
            Status: req.body.Status
        }, {
            where: {
                Uuid: req.params.ProductUuid
            }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado" });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "El código de producto ya existe" });
        }
        res.status(500).json({ message: "Error al editar producto" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const deletedRows = await Product.destroy({
            where: {
                Uuid: req.params.Uuid
            }
        });
        
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
}

export const getAvailableProducts = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          StatusUuid: 'F190BE66-3B22-4E7D-85FC-C9C79E908642',
        },
      });
  
      const transformedProducts = products.map((product) => {
        const plainProduct = product.get({ plain: true });
        return {
          ...plainProduct,
          Image: plainProduct.Image
            ? `data:image/jpeg;base64,${Buffer.from(plainProduct.Image).toString('base64')}`
            : null,
        };
      });
  
      res.json(transformedProducts);
    } catch (error) {
      console.error('Error al obtener productos con StatusUuid=F190BE66-3B22-4E7D-85FC-C9C79E908642:', error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  };