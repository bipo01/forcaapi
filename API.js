import express from "express";
import pg from "pg";
import cors from "cors";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.use(cors());

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM forcaAPI");
    const data = result.rows;

    res.json(data);
});

app.get("/add", async (req, res) => {
    const palavra = req.query.palavra;
    const categoria = req.query.categoria;
    const dica = req.query.dica;

    const result = await db.query("SELECT * FROM forcaAPI WHERE palavra = $1", [
        palavra,
    ]);
    const data = result.rows[0];

    console.log(data);

    if (!data) {
        db.query(
            "INSERT INTO forcaAPI (palavra, categoria, dica) VALUES($1, $2, $3)",
            [palavra, categoria, dica]
        );

        res.json("Adicionado");
    } else {
        res.json("Palavra já existe");
    }
});

app.get("/random", async (req, res) => {
    const result = await db.query("SELECT * FROM forcaAPI");
    const data = result.rows;

    const randomNum = Math.floor(Math.random() * data.length);

    res.json(data[randomNum]);
});

app.get("/delete", async (req, res) => {
    const result = await db.query("select * from forcaAPI where palavra = $1", [
        req.query.palavra,
    ]);
    const data = result.rows[0];

    if (data) {
        db.query("DELETE FROM forcaAPI WHERE palavra = $1", [
            req.query.palavra,
        ]);

        res.json("Deletada");
    } else {
        res.json("Palavra não encontrada");
    }
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
