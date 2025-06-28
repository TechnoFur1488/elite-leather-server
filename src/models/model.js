import User from "./user.model.js"
import Cart from "./cart.model.js"
import CartProduct from "./cart.product.model.js"
import OrderItem from "./order.item.model.js"
import Order from "./order.model.js"
import Product from "./product.model.js"
import Catalog from "./catalog.model.js"

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.hasMany(CartProduct)
CartProduct.belongsTo(Cart)

Product.hasOne(CartProduct)
CartProduct.belongsTo(Product)

Catalog.hasMany(Product, {onDelete: "CASCADE"})
Product.belongsTo(Catalog)

User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)