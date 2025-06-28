import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Product = sequelize.define("product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
})

export default Product