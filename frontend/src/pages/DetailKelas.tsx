import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useParams } from "react-router-dom";
import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import BreadCrumb from "../components/BreadCrumb";
import { useState } from "react";

const DetailKelas = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const { isLoggedIn, userRole } = useAppContext();
  const [isNameSortedAsc, setIsNameSortedAsc] = useState(true);

  const isUserRole = userRole !== "admin";

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

  const handleUpdatePresensi = async (studentId: string) => {
    try {
      await apiClient.updatePresensi(studentId);
    } catch (error) {
      console.error("Error updating presensi:", error);
    }
  };

  const handleSortByName = () => {
    setIsNameSortedAsc((prev) => !prev);
  };

  const sortedSiswa = [...kelasDetails.siswa].sort((a, b) => {
    const nameA = a.nama.toUpperCase();
    const nameB = b.nama.toUpperCase();

    if (isNameSortedAsc) {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-green-500 shadow-xl">
        <SignOutButton />
      </div>
      <div className="container m-auto">
        <BreadCrumb
          items={[
            { label: "Tahun ajaran", to: "/home" },
            { label: "Kelas", to: `/tahunAjaran/${tahunAjaranId}` },
            { label: "siswa", to: "/about" },
          ]}
        />
      </div>
      <div className="container m-auto bg-yellow-400 rounded-full my-3 shadow-xl">
        <div className="flex justify-between p-4">
          {kelasDetails.kelas.map((kelas) => (
            <h2 className="text-3xl font-bold text-white" key={kelas._id}>
              KELAS: {kelas.kelas}
            </h2>
          ))}
          <Link
            to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/absen`}
            className="flex bg-purple-800 text-white text-xl font-bold hover:bg-purple-500 rounded-full items-center px-5 py-2 shadow-xl"
          >
            detail absen
          </Link>
          {isUserRole ? null : (
            <Link
              to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/tambah-siswa`}
              className="flex bg-yellow-700 text-white text-xl font-bold items-center px-5 py-2 hover:bg-yellow-600 rounded-full shadow-xl"
            >
              tambah siswa
            </Link>
          )}
        </div>
      </div>
      <div className="container m-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                no
              </th>
              <th scope="col" className="px-6 py-3">
                <button
                  className="focus:outline-none"
                  onClick={handleSortByName}
                >
                  Nama Siswa
                  {isNameSortedAsc ? " ▲" : " ▼"}
                </button>
              </th>
              {isUserRole ? null : (
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedSiswa.map((User, index) => (
              <tr
                key={index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/tahunAjaran/${tahunAjaranId}/kelas/${kelasId}/siswa/${User._id}/absen`}
                    className="text-blue-500 underline hover:text-blue-400"
                  >
                    {User.nama}
                  </Link>
                </td>
                {isUserRole ? null : (
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white p-2 font-bold rounded"
                      onClick={() =>
                        apiClient
                          .deleteStudentFromClass({
                            tahunAjaranId: tahunAjaranId,
                            kelasId: kelasId,
                            siswaId: User._id,
                          })
                          .then(() => {
                            window.location.reload();
                          })
                      }
                    >
                      hapus
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 text-white p-2 font-bold rounded"
                      onClick={() => handleUpdatePresensi(User._id)}
                    >
                      absen
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailKelas;
