import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import siswaRoutes from "./routes/siswaRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Data Siswa berhasil berjalan",
  });
});

app.use("/api/siswa", siswaRoutes);

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});