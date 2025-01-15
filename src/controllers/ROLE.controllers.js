import Role from "../models/ModelRole.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los roles" });
    }
};

export const getRole = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: { Uuid: req.params.Uuid }
        });

        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ message: "Rol no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el rol" });
    }
};

export const postRole = async (req, res) => {
    try {
        const { Name } = req.body;

        const newRole = await Role.create({
            Name,
            CreatedAt: new Date(),
            UpdateAt: new Date()
        });

        res.status(201).json({ 
            message: "Rol creado", 
            role: newRole 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el rol" });
    }
};

export const putRole = async (req, res) => {
    try {
        const { Uuid } = req.params;
        const { Name } = req.body;

        const role = await Role.findOne({ where: { Uuid } });

        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }

        await role.update({
            Name,
            UpdateAt: new Date()
        });

        res.json({ 
            message: "Rol actualizado correctamente", 
            role 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el rol" });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { Uuid } = req.params;

        const role = await Role.findOne({ where: { Uuid } });

        if (!role) {
            return res.status(404).json({ message: "Rol no encontrado" });
        }

        await role.destroy();

        res.json({ message: "Rol eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el rol" });
    }
};