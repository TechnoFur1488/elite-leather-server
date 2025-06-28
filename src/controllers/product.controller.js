import { v4 as uuidv4 } from "uuid"
import { fileURLToPath } from "url"
import Product from "../models/product.model.js"
import path, { dirname } from "path"
import { promises as fs } from "fs"
import CartProduct from "../models/cart.product.model.js"

const __filename = (fileURLToPath(import.meta.url))
const __dirname = dirname(__filename)

class ProductController {
    async createProduct(req, res) {
        const { name, description, price, catalogId } = req.body
        const { img } = req.files

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!name || !description || !price || !catalogId) {
            return res.status(400).json({ message: "Поля не заполнены" })
        }

        if (!img || img.length === 0) {
            return res.status(400).json({ message: "Фото не загружено" })
        }

        try {
            const fileNames = img.map(file => {
                const fileName = uuidv4() + ".webp"
                file.mv(path.resolve(__dirname, "..", "..", "static", fileName))
                return fileName
            })

            const product = await Product.create({ name, description, price, catalogId, img: fileNames })

            return res.status(200).json({ product })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getAllProduct(req, res) {
        try {
            const allProduct = await Product.findAll()
            return res.status(200).json({ allProduct })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getAllNewProduct(req, res) {
        try {
            const products = await Product.findAndCountAll({ limit: 6, order: [["createdAt", "DESC"]] })
            return res.status(200).json({ products })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getOneProduct(req, res) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        try {
            const oneProduct = await Product.findByPk(id)

            if (!oneProduct) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            return res.status(200).json({ oneProduct })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params
        const { name, description, price, catalogId } = req.body
        const { img } = req.files

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        if (!name || !description || !price || !catalogId) {
            return res.status(400).json({ message: "Поля не заполнены" })
        }

        if (!img || img === 0) {
            return res.status(400).json({ message: "Фото не загружено" })
        }

        try {
            const product = await Product.findByPk(id)

            if (!product) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            if (product.img?.length) {
                await Promise.all(
                    product.img.map(async (fileName) => {
                        const filePath = path.resolve(__dirname, "..", "..", "static", fileName)
                        try {
                            await fs.unlink(filePath)
                        } catch (err) {
                            console.error(err)
                        }
                    })
                )
            }

            const fileNames = img.map(file => {
                const fileName = uuidv4() + ".webp"
                file.mv(path.resolve(__dirname, "..", "..", "static", fileName))
                return fileName
            })

            await Product.update({ name, description, price, catalogId, img: fileNames }, { where: { id } })

            const cartItem = await CartProduct.findOne({ where: { productId: id } })

            if (cartItem > 0) {
                const totalPriceCartUser = price * cartItem.quantity

                await CartProduct.update({ price, price: totalPriceCartUser }, { where: { productId: id } })
            }

            const updateProduct = await Product.findByPk(id)

            return res.status(200).json({ updateProduct, message: "Товар обновлен" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }

    }

    async deleteProduct(req, res) {
        const { id } = req.params
        const userRole = req.user.role

        if (userRole !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        try {

            const product = await Product.findByPk(id)

            if (!product) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            if (product.img?.length) {
                await Promise.all(
                    product.img.map(async (fileName) => {
                        const filePath = path.resolve(__dirname, "..", "..", "static", fileName)
                        try {
                            await fs.unlink(filePath)
                        } catch (err) {
                            console.error(err)
                        }
                    })
                )
            }

            await Product.destroy({ where: { id } })

            return res.status(200).json({ message: "Товар удален" })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }
}

export default new ProductController()