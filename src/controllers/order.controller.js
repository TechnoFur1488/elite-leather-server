import Cart from "../models/cart.model.js"
import CartProduct from "../models/cart.product.model.js"
import Order from "../models/order.model.js"
import OrderItem from "../models/order.item.model.js"

class OrderController {
    async createOrders(req, res) {
        const { name, email, phone, comment } = req.body
        const userId = req.user.id

        try {
            const cart = await Cart.findOne({ where: { userId } })

            const cartItem = await CartProduct.findAll({ where: { cartId: cart.id } })

            if (!cartItem || cartItem.length === 0) {
                return res.status(400).json({ message: "Корзина пуста" })
            }

            const total = cartItem.reduce((sum, i) => sum + i.price, 0)

            const order = await Order.create({ name, email, phone, comment, total, userId })

            for (const item of cartItem) {
                await OrderItem.create({ orderId: order.id, name: item.name, productId: item.productId, quantity: item.quantity, price: item.price })
            }

            await CartProduct.destroy({ where: { cartId: cart.id } })

            return res.status(200).json({ message: "Заказ успешно создан" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllOrders(req, res) {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Недостаточно прав" })
        }

        try {
            const orders = await Order.findAll({order: [["createdAt", "DESC"]]})
            return res.status(200).json({ orders })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Произошла ошибка" })
        }
    }
}

export default new OrderController()