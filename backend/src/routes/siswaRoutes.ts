import { Router } from "express";

import {
  getSiswa,
  tambahSiswa,
  updateSiswa,
  hapusSiswa,
} from "../controllers/siswaController";

const router = Router();

router.get("/", getSiswa);
router.post("/", tambahSiswa);
router.put("/:id", updateSiswa);
router.delete("/:id", hapusSiswa);

export default router;