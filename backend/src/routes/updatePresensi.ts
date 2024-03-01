import express, { Request, Response } from "express";
import TahunAjaran, { studentType } from "../models/tahunAjaran"; // Replace 'yourModel' with your actual model file

const router = express.Router();

router.patch("/", async (req: Request, res: Response) => {
  try {
    const { studentId, presensi } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "StudentId is required." });
    }

    const tahunAjaran = await TahunAjaran.findOne({
      "kelas.siswa._id": studentId,
    });

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun ajaran not found." });
    }

    let foundStudent: studentType | null = null;

    tahunAjaran.kelas.forEach((kelas) => {
      const student = kelas.siswa.find((s) => s._id.toString() === studentId);
      if (student) {
        foundStudent = student;
        student.absenHarian.push({ tanggal: new Date(), presensi });
      }
    });

    if (!foundStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    await tahunAjaran.save();

    res.status(200).json({ message: "Presensi updated successfully." });
  } catch (error) {
    console.error("Error updating presensi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
