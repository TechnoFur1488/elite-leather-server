import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Catalog = sequelize.define("catalog", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

export default Catalog