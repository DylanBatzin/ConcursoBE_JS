import Status from "../models/ModelStatus.js";

export const getStatus = async (req, res) =>{
    try {
        const status = await Status.findAll();
        res.json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los estatus" });
    }
};


export const getStatusById = async (req, res) => {
    try {
        const status = await Status.findOne({
            where: { Uuid: req.params.Uuid }
        });

        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ message: "Estatus no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el estatus" });
    }
};

export const postStatus = async(req, res) => {
    try {
        const { Name } = req.body;

        const newStatus = await Status.create({
            Name,
            CreatedAt: new Date(),
            UpdateAt: new Date()
        });

        res.status(201).json({ message: "Estatus creado", status: newStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el estatus" });
    }
};

export const  putStatus = async(req, res) => {
    try {
        const { Uuid } = req.params;
        const { Name } = req.body;

        const status = await Status.findOne({ where: { Uuid } });

        if (!status) {
            return res.status(404).json({ message: "Estatus no encontrado" });
        }

        await status.update({
            Name,
            UpdateAt: new Date()
        });

        res.json({ message: "Estatus actualizado correctamente", status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estatus" });
    }
};

export const deleteStatus = async (req, res) => {
    try {
        const { Uuid } = req.params;

        const status = await Status.findOne({ where: { Uuid } });

        if (!status) {
            return res.status(404).json({ message: "Estatus no encontrado" });
        }

        await status.destroy();

        res.json({ message: "Estatus eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el estatus" });
    }
};