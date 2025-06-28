import sequelize from "../lib/db.js";
import { DataTypes } from "sequelize";

const OrderItem = sequelize.define("order-item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.INTEGER, defaultValue: 0 },
})

export default OrderItem