import Catalog from "../models/catalog.model.js"
import Product from "../models/product.model.js"

class CatalogController {
    async createCatalog(req, res) {
        const { name } = req.body

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!name) {
            return res.status(400).json({ message: "Поля не заполнены" })
        }

        try {
            const catalog = await Catalog.create({ name })
            return res.status(200).json({ catalog })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getAllCatalog(req, res) {
        try {
            const catalog = await Catalog.findAll()
            return res.status(200).json({ catalog })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getProductsCatalogNew(req, res) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "такого каталога нету" })
            }

            const product = await Product.findAndCountAll({ limit: 3, order: [["createdAt", "DESC"]], where: { catalogId: catalog.id } })

            return res.status(200).json({ product })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async updateCatalog(req, res) {
        const { name } = req.body
        const { id } = req.params

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        if (!name) {
            return res.status(400).json({ message: "Поля не заполнены" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "такого каталога нету" })
            }

            await Catalog.update({ name }, { where: { id } })

            const catalogUpdate = await Catalog.findByPk(id)

            return res.status(200).json({ catalogUpdate })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async deleteCatalog(req, res) {
        const { id } = req.params

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        try {
            const catalog = await Catalog.findByPk(id)

            if (!catalog) {
                return res.status(404).json({ message: "такого каталога нету" })
            }

            await Catalog.destroy({ where: { id } })

            return res.status(200).json({ message: "Каталог удален" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }
}

export default new CatalogController()