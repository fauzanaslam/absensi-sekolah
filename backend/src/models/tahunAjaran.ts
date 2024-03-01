import mongoose from "mongoose";

export type teacherType = {
  nama: string;
};

export type subjectType = {
  mataPelajaran: string;
  guru: teacherType;
};

export type dayType = {
  hari: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  mataPelajaran: subjectType[];
};

export type paymentType = {
  bulan: string;
  jumlahPembayaran: number;
};

export type studentType = {
  _id: string;
  nama: string;
  absenHarian: {
    tanggal: Date;
    presensi: boolean;
  }[];
  SPP: paymentType[];
};

export type classType = {
  _id: string;
  kelas: string;
  hariDanMapel: dayType[];
  siswa: studentType[];
};

export type academicYearType = {
  tahunAjaran: string;
  kelas: classType[];
};

const teacherSchema = new mongoose.Schema({
  nama: { type: String },
});

const subjectSchema = new mongoose.Schema({
  mataPelajaran: { type: String },
  guru: teacherSchema,
});

const daySchema = new mongoose.Schema({
  hari: {
    type: String,
    enum: ["Senin", "Selasa", "Rabu", "Kamis", "jumat"],
  },
  mataPelajaran: [subjectSchema],
});

const paymentSchema = new mongoose.Schema({
  bulan: { type: String },
  jumlahPembayaran: { type: Number },
});

const studentSchema = new mongoose.Schema({
  nama: { type: String },
  absenHarian: [
    {
      tanggal: { type: Date },
      presensi: { type: Boolean, default: false },
    },
  ],
  SPP: [paymentSchema],
});

const classSchema = new mongoose.Schema({
  kelas: { type: String, unique: true },
  hariDanMapel: [daySchema],
  siswa: [studentSchema],
});

const academicYearSchema = new mongoose.Schema({
  tahunAjaran: { type: String, required: true, unique: true },
  kelas: [classSchema],
});

studentSchema.pre("save", function (next) {
  if (
    this.isModified("absenHarian") &&
    this.absenHarian.some((day) => day.presensi === true)
  ) {
    const today = new Date();
    this.absenHarian
      .filter((day) => day.presensi === true && !day.tanggal)
      .forEach((day) => {
        day.tanggal = today;
      });
  }
  next();
});

const TahunAjaran = mongoose.model<academicYearType>(
  "TahunAjaran",
  academicYearSchema
);
export default TahunAjaran;
