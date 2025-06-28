import Cart from "../models/cart.model.js"
import CartProduct from "../models/cart.product.model.js"
import Product from "../models/product.model.js"

class CartController {
    async addCart(req, res) {
        const { productId } = req.params
        const userId = req.user.id
        const quantity = 1

        if (!productId) {
            return res.status(400).json({ message: "ID не указан" })
        }

        if (!quantity) {
            return res.status(400).json({ message: "Количество не указано" })
        }

        try {
            const product = await Product.findOne({ where: { id: productId } })

            if (!product) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            const cart = await Cart.findOne({ where: { userId } })

            if (!cart) {
                await Cart.create({ userId })
            }

            const cartItem = await CartProduct.findOne({ where: { productId, cartId: cart.id } })

            if (cartItem) {
                return res.status(409).json({ message: "Товар уже в корзине" })
            }

            const totalPrice = product.price * quantity

            const cartProduct = await CartProduct.create({ cartId: cart.id, productId: product.id, name: product.name, price: totalPrice, quantity, img: product.img[0] })

            return res.status(200).json({ cartProduct })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async getAllCart(req, res) {
        const userId = req.user.id

        try {
            const cart = await Cart.findOne({ where: { userId } })

            if (!cart) {
                await Cart.create({ userId })
            }

            const cartItem = await CartProduct.findAll({ where: { cartId: cart.id }, order: [["createdAt", "DESC"]] })

            return res.status(200).json({ cartItem })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }

    }

    async updateCart(req, res) {
        const { id } = req.params
        const { quantity } = req.body

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        if (!quantity) {
            return res.status(400).json({ message: "Количество не указано" })
        }

        try {
            const cartItem = await CartProduct.findByPk(id)

            if (!cartItem) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            const product = await Product.findOne({ where: { id: cartItem.productId } })

            const priceTotal = quantity * product.price

            await CartProduct.update({ quantity, price: priceTotal }, { where: { id } })

            const updateCartProduct = await CartProduct.findByPk(id)

            return res.status(200).json({ updateCartProduct })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }

    async deleteCart(req, res) {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "ID не указан" })
        }

        try {
            const cartItem = await CartProduct.findByPk(id)

            if (!cartItem) {
                return res.status(404).json({ message: "Товар не найден" })
            }

            await CartProduct.destroy({ where: { id } })

            return res.status(200).json({ message: "Товар удален" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }
}

export default new CartController()