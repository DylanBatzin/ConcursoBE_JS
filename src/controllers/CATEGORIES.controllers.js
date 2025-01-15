import Category from "../models/ModelCategory.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las categorías" });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: { Uuid: req.params.Uuid }
        });

        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: "Categoría no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la categoría" });
    }
};

export const postCategory = async (req, res) => {
    try {
        const { Name } = req.body;

        const newCategory = await Category.create({
            Name,
            CreatedAt: new Date(),
            UpdateAt: new Date()
        });

        res.status(201).json({ 
            message: "Categoría creada", 
            category: newCategory 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la categoría" });
    }
};

export const putCategory = async (req, res) => {
    try {
        const { Uuid } = req.params;
        const { Name } = req.body;

        const category = await Category.findOne({ where: { Uuid } });

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await category.update({
            Name,
            UpdateAt: new Date()
        });

        res.json({ 
            message: "Categoría actualizada correctamente", 
            category 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la categoría" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { Uuid } = req.params;

        const category = await Category.findOne({ where: { Uuid } });

        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await category.destroy();

        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la categoría" });
    }
};