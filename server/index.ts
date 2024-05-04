import express from "express";
const app = express();

app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: 'VC server running successfully' });
});

app.listen(8800, () => {
    console.log("Connected!");
});