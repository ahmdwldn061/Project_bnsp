import { Request, Response } from "express";
import db from "../config/database";

// GET: Menampilkan semua data siswa
export const getSiswa = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      "SELECT * FROM siswa ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data siswa",
    });
  }
};

// POST: Menambahkan data siswa
export const tambahSiswa = async (req: Request, res: Response) => {
  try {
    const {
      kode_siswa,
      nama_siswa,
      alamat_siswa,
      tgl_siswa,
      jurusan_siswa,
    } = req.body;

    if (
      !kode_siswa ||
      !nama_siswa ||
      !alamat_siswa ||
      !tgl_siswa ||
      !jurusan_siswa
    ) {
      return res.status(400).json({
        message: "Semua data siswa wajib diisi",
      });
    }

    const result = await db.query(
      `INSERT INTO siswa
      (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        kode_siswa,
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa,
      ]
    );

    res.status(201).json({
      message: "Data siswa berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(error);

    res.status(error.code === "23505" ? 409 : 500).json({
      message:
        error.code === "23505"
          ? "Kode siswa sudah digunakan"
          : "Gagal menambahkan data siswa",
    });
  }
};

// PUT: Mengedit data siswa
export const updateSiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      kode_siswa,
      nama_siswa,
      alamat_siswa,
      tgl_siswa,
      jurusan_siswa,
    } = req.body;

    if (
      !kode_siswa ||
      !nama_siswa ||
      !alamat_siswa ||
      !tgl_siswa ||
      !jurusan_siswa
    ) {
      return res.status(400).json({
        message: "Semua data siswa wajib diisi",
      });
    }

    const result = await db.query(
      `UPDATE siswa SET
      kode_siswa = $1,
      nama_siswa = $2,
      alamat_siswa = $3,
      tgl_siswa = $4,
      jurusan_siswa = $5
      WHERE id = $6
      RETURNING *`,
      [
        kode_siswa,
        nama_siswa,
        alamat_siswa,
        tgl_siswa,
        jurusan_siswa,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    res.json({
      message: "Data siswa berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(error);

    res.status(error.code === "23505" ? 409 : 500).json({
      message:
        error.code === "23505"
          ? "Kode siswa sudah digunakan"
          : "Gagal memperbarui data siswa",
    });
  }
};

// DELETE: Menghapus data siswa
export const hapusSiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM siswa WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    res.json({
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Gagal menghapus data siswa",
    });
  }
};