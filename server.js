import cors from "cors";
import express from "express";
const app = express();
const PORT = 3003;
import {connectDB} from "./config/databaseConnection.js";
import {router} from "./routes/auth.routes.js";


connectDB()


app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use('/api', router);


const server = app.listen( PORT, () => {
    console.log(`App microservice listening on port ${PORT}`);
})

