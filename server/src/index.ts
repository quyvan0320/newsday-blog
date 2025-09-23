import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route";
const app = express();
const port = process.env.PORT || 8080;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/auth", authRoute);

app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}`));
