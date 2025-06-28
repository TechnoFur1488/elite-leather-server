import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Cart = sequelize.define("cart", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

export default Cart