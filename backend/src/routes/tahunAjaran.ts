import express, { Request, Response, Router } from "express";
import TahunAjaran, {
  academicYearType,
  classType,
  studentType,
} from "../models/tahunAjaran";

const router = express.Router();

router.post("/tambah-tahun-ajaran", async (req: Request, res: Response) => {
  try {
    const newTahunAjaran: academicYearType = req.body;
    const tahunAjaran = new TahunAjaran(newTahunAjaran);

    await tahunAjaran.save();

    res.status(201).send(tahunAjaran);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const tahunAjaran = await TahunAjaran.find();
    res.json(tahunAjaran);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tahun ajaran" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const tahunAjaran = await TahunAjaran.findOne({
      _id: id,
    });
    res.json(tahunAjaran);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tahun ajaran" });
  }
});

router.get("/:tahunAjaranId/kelas", async (req: Request, res: Response) => {
  const tahunAjaranId = req.params.tahunAjaranId.toString();
  try {
    const tahunAjaran = await TahunAjaran.findById(tahunAjaranId);
    if (tahunAjaran) {
      res.status(200).json(tahunAjaran.kelas);
    } else {
      res.status(404).json({ message: "Tahun ajaran tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching tahun ajaran" });
  }
});

router.get(
  "/:tahunAjaranId/kelas/:kelasId/details",
  async (req: Request, res: Response) => {
    try {
      const tahunAjaranId = req.params.tahunAjaranId;
      const kelasId = req.params.kelasId;
      const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

      if (tahunAjaran) {
        const kelas: classType | undefined = tahunAjaran.kelas.find(
          (kelas) => kelas._id.toString() === kelasId
        );

        if (kelas) {
          res.status(200).json({
            kelas: [{ kelas: kelas.kelas, _id: kelas._id }],
            siswa: kelas.siswa,
            hariDanMapel: kelas.hariDanMapel,
          });
        } else {
          res
            .status(404)
            .json({ message: `Kelas ${kelasId} tidak ditemukan.` });
        }
      } else {
        res.status(404).json({ message: "Tahun ajaran tidak ditemukan." });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/:tahunAjaranId/kelas", async (req: Request, res: Response) => {
  try {
    const { tahunAjaranId } = req.params;
    const newKelasData: classType = req.body;
    const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun ajaran not found." });
    }

    const existingClass = tahunAjaran.kelas.find(
      (kelas) => kelas.kelas === newKelasData.kelas
    );

    if (existingClass) {
      return res.status(400).json({ message: "Class already exists." });
    }

    tahunAjaran.kelas.push(newKelasData);

    await TahunAjaran.findByIdAndUpdate(tahunAjaranId, {
      kelas: tahunAjaran.kelas,
    });

    res.status(201).json({ message: "Class added successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/:tahunAjaranId/kelas/:kelasId/siswa",
  async (req: Request, res: Response) => {
    try {
      const { tahunAjaranId, kelasId } = req.params;
      const newStudentData: studentType = req.body;
      const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

      if (!tahunAjaran) {
        return res.status(404).json({ message: "Tahun ajaran not found." });
      }

      const selectedClass = tahunAjaran.kelas.find(
        (kelas) => kelas._id.toString() === kelasId
      );

      if (!selectedClass) {
        return res.status(404).json({ message: "Class not found." });
      }

      const existingStudent = selectedClass.siswa.find(
        (siswa) => siswa._id.toString() === newStudentData._id
      );

      if (existingStudent) {
        return res
          .status(400)
          .json({ message: "Student already exists in the class." });
      }

      selectedClass.siswa.push(newStudentData);

      await TahunAjaran.findByIdAndUpdate(tahunAjaranId, {
        kelas: tahunAjaran.kelas,
      });

      res.status(201).json({ message: "Student added successfully." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete("/:tahunAjaranId", async (req: Request, res: Response) => {
  try {
    const { tahunAjaranId } = req.params;

    const tahunAjaran = await TahunAjaran.findById(tahunAjaranId);

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Academic year not found." });
    }

    await TahunAjaran.findByIdAndDelete(tahunAjaranId);

    res.status(200).json({ message: "Academic year deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:tahunAjaranId/kelas/:kelasId",
  async (req: Request, res: Response) => {
    try {
      const { tahunAjaranId, kelasId } = req.params;

      const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

      if (!tahunAjaran) {
        return res.status(404).json({ message: "Tahun ajaran not found." });
      }

      const updatedKelas = tahunAjaran.kelas.filter(
        (kelas) => kelas._id.toString() !== kelasId
      );

      if (updatedKelas.length === tahunAjaran.kelas.length) {
        return res.status(404).json({ message: "Kelas not found." });
      }

      await TahunAjaran.findByIdAndUpdate(tahunAjaranId, {
        kelas: updatedKelas,
      });

      res.status(200).json({ message: "Class deleted successfully." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete(
  "/:tahunAjaranId/kelas/:kelasId/siswa/:siswaId",
  async (req, res) => {
    try {
      const { tahunAjaranId, kelasId, siswaId } = req.params;

      // Find the corresponding academic year
      const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

      if (!tahunAjaran) {
        return res.status(404).json({ message: "Tahun ajaran not found." });
      }

      // Find the corresponding class
      const kelas = tahunAjaran.kelas.find(
        (kelas) => kelas._id.toString() === kelasId
      );

      if (!kelas) {
        return res.status(404).json({ message: "Class not found." });
      }

      // Find the student in the class
      const siswaIndex = kelas.siswa.findIndex(
        (siswa) => siswa._id.toString() === siswaId
      );

      if (siswaIndex === -1) {
        return res
          .status(404)
          .json({ message: "Student not found in the class." });
      }

      // Remove the student from the class
      kelas.siswa.splice(siswaIndex, 1);

      // Save the updated academic year
      await TahunAjaran.findByIdAndUpdate(tahunAjaranId, {
        kelas: tahunAjaran.kelas,
      });

      res.status(200).json({ message: "Student deleted successfully." });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:tahunAjaranId/kelas/:kelasId/siswa/:siswaId/absen",
  async (req: Request, res: Response) => {
    try {
      const tahunAjaranId = req.params.tahunAjaranId;
      const kelasId = req.params.kelasId;
      const siswaId = req.params.siswaId;

      const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

      if (tahunAjaran) {
        const kelas: classType | undefined = tahunAjaran.kelas.find(
          (kelas) => kelas._id.toString() === kelasId
        );

        if (kelas) {
          const siswa: studentType | undefined = kelas.siswa.find(
            (siswa) => siswa._id.toString() === siswaId
          );

          if (siswa) {
            res.status(200).json({
              nama: siswa.nama,
              absenHarian: siswa.absenHarian,
            });
          } else {
            res
              .status(404)
              .json({ message: `Siswa ${siswaId} tidak ditemukan.` });
          }
        } else {
          res
            .status(404)
            .json({ message: `Kelas ${kelasId} tidak ditemukan.` });
        }
      } else {
        res.status(404).json({ message: "Tahun ajaran tidak ditemukan." });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/:tahunAjaranId/kelas/:kelasId/absen", async (req, res) => {
  try {
    const tahunAjaranId = req.params.tahunAjaranId;
    const kelasId = req.params.kelasId;
    const tanggalParam = req.query.tanggal;

    // Handle the case where 'tanggal' is undefined
    if (!tanggalParam) {
      return res
        .status(400)
        .json({ message: "Query parameter tanggal is required." });
    }

    const tanggal = new Date(tanggalParam as string);

    // Temukan tahun ajaran
    const tahunAjaran = await TahunAjaran.findById(tahunAjaranId).lean();

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun ajaran tidak ditemukan." });
    }

    // Temukan kelas
    const kelas = tahunAjaran.kelas.find(
      (kelas) => kelas._id.toString() === kelasId
    );

    if (!kelas) {
      return res.status(404).json({ message: "Kelas tidak ditemukan." });
    }

    // Ambil data absensi seluruh siswa pada tanggal tertentu
    const absensiSiswa = kelas.siswa.map((siswa) => {
      const absensi = siswa.absenHarian.find(
        (absen) => absen.tanggal.toDateString() === tanggal.toDateString()
      );

      return {
        _id: siswa._id,
        nama: siswa.nama,
        absensi: absensi ? absensi.presensi : null,
      };
    });

    res.status(200).json({ absensiSiswa });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
