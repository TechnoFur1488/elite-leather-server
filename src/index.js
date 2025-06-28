import express from "express"
import sequelize from "./lib/db.js"
import router from "./routes/routes.js"
import cookieParser from "cookie-parser"
import "./models/model.js"
import { fileURLToPath } from "url"
import path, { dirname } from "path"
import fileUpload from "express-fileupload"
import cors from "cors"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, "..", "static")))
app.use(fileUpload())

app.use(cors({
    origin: ["https://elite-leather-client-cjwvp3hfw-nikitas-projects-e30fe775.vercel.app/", "https://elite-leather-client.vercel.app/", "https://elite-leather-client-cjwvp3hfw-nikitas-projects-e30fe775.vercel.app/"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порут ${PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
}

start()