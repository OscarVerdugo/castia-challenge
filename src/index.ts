import dotenv from "dotenv";
dotenv.config();

import express from "express";

import router from "./routes/router";

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/api",router);

app.get("/",(_req, res)=>{
    res.send("Hello!!");
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});