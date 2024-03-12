import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useParams } from "react-router-dom";
import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import BreadCrumb from "../components/BreadCrumb";
import { useState } from "react";
import { PlusCircleIcon, ArchiveBoxIcon } from "@heroicons/react/20/solid";
const DetailKelas = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const { isLoggedIn, userRole } = useAppContext();
  const [isNameSortedAsc, setIsNameSortedAsc] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredSiswa = sortedSiswa.filter((user) =>
    user.nama.toLowerCase().includes(searchInput.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSiswa.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-green-500 shadow-xl p-2">
        <SignOutButton />
      </div>
      <div className="p-2">
        <div className="container m-auto">
          <BreadCrumb
            items={[
              { label: "Tahun ajaran", to: "/home" },
              { label: "Kelas", to: `/tahunAjaran/${tahunAjaranId}` },
              { label: "siswa", to: "/about" },
            ]}
          />
        </div>
        <div className="container m-auto bg-yellow-400 rounded-lg my-3 shadow-xl">
          <div className="flex justify-between p-4">
            {kelasDetails.kelas.map((kelas) => (
              <h2 className="text-3xl font-bold text-white" key={kelas._id}>
                KELAS: {kelas.kelas}
              </h2>
            ))}
            <Link
              to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/absen`}
              className="flex bg-purple-800 text-white text-xl font-bold hover:bg-purple-500 rounded-lg items-center px-5 py-2 shadow-xl"
            >
              <ArchiveBoxIcon className="w-6 h-full mr-2" />
              detail absen
            </Link>
            {isUserRole ? null : (
              <Link
                to={`/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/tambah-siswa`}
                className="flex bg-yellow-700 text-white text-xl font-bold items-center px-5 py-2 hover:bg-yellow-600 rounded-lg shadow-xl"
              >
                <PlusCircleIcon className="w-6 h-full mr-2" />
                tambah siswa
              </Link>
            )}
          </div>
        </div>
        <div className="container m-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="p-2 border border-gray-300 rounded-md mb-3 w-full"
          />
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
              {currentItems.map((User, index) => (
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
                      <Link
                        to={`/tahunAjaran/${tahunAjaranId}/kelas/${kelasId}/siswa/${User._id}/edit-siswa`}
                        className="bg-blue-500 hover:bg-blue-400 text-white
                        p-2 font-bold rounded"
                        onClick={window.location.reload}
                      >
                        edit
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 w-full">
            <ul className="flex space-x-2 justify-center">
              {Array.from({
                length: Math.ceil(filteredSiswa.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`bg-blue-500 text-white p-2 font-bold rounded ${
                      currentPage === index + 1 ? "bg-blue-700" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
