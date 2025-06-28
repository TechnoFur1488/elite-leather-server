import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Order = sequelize.define("order", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    comment: {type: DataTypes.TEXT, allowNull: false},
    total: {type: DataTypes.INTEGER, allowNull: false}
})

export default Order