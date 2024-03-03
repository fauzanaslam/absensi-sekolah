import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useParams } from "react-router-dom";
import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import SiswaCard from "../components/SiswaCard";
import { useState } from "react";

const DetailKelas = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const { isLoggedIn } = useAppContext();

  const [highlightedStudents, setHighlightedStudents] = useState<string[]>([]);

  const { data: kelasDetails, isLoading } = useQuery(
    ["fetchKelasDetails", tahunAjaranId, kelasId],
    () => apiClient.fetchKelasDetails(tahunAjaranId ?? "", kelasId ?? ""),
    {
      enabled: !!tahunAjaranId && !!kelasId,
    }
  );

  if (!tahunAjaranId || !kelasId) {
    return <p>Data kelas tidak valid</p>;
  }

  if (!isLoggedIn) return <SignIn />;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!kelasDetails) {
    return <p>No data available</p>;
  }

  // const handleUpdatePresensi = async (studentId: string) => {
  //   try {
  //     await apiClient.updatePresensi(studentId);
  //   } catch (error) {
  //     console.error("Error updating presensi:", error);
  //   }
  // };

  const handleUpdatePresensi = async (studentId: string) => {
    try {
      setHighlightedStudents((prev) => [...prev, studentId]);

      await apiClient.updatePresensi(studentId);

      setTimeout(() => {
        setHighlightedStudents((prev) => prev.filter((id) => id !== studentId));
      }, 5000);
    } catch (error) {
      console.error("Error updating presensi:", error);
    }
  };

  return (
    <div>
      <SignOutButton />
      <div className="flex justify-between pt-2 my-2">
        {kelasDetails.kelas.map((kelas) => (
          <h2 className="text-3xl font-bold" key={kelas._id}>
            KELAS: {kelas.kelas}
          </h2>
        ))}
        <Link
          to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/absen`}
          className="flex bg-purple-800 text-white text-xl font-bold p-2 hover:bg-purple-500 rounded"
        >
          detail absen
        </Link>
        <Link
          to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/tambah-siswa`}
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
        >
          tambah siswa
        </Link>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {kelasDetails.siswa.map((nama) => (
          <div
            key={nama._id}
            className={`flex ${
              highlightedStudents.includes(nama._id)
                ? "bg-green-500" // Change to the desired highlight color
                : "bg-gray-500"
            }`}
          >
            <SiswaCard
              key={nama._id}
              siswa={nama}
              tahunAjaran={tahunAjaranId}
              kelas={kelasId}
            />
            <button
              onClick={() => handleUpdatePresensi(nama._id)}
              className="bg-yellow-500 font-bold text-3xl p-2"
            >
              Absen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailKelas;
