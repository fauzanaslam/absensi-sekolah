import { useQuery } from "react-query";
import SignOutButton from "../components/SignOutButton";
import * as apiClient from "../api-client";
import { useParams } from "react-router-dom";
import { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";

const DetailAbsen = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const { data: absensiSiswa, isLoading } = useQuery(
    ["fetchAbsensiSiswa", tahunAjaranId, kelasId, selectedDate.toISOString()],
    () =>
      apiClient.fetchAbsensiKelas(
        tahunAjaranId ?? "",
        kelasId ?? "",
        selectedDate.toISOString()
      ),
    {
      enabled: !!tahunAjaranId && !!kelasId,
    }
  );

  console.log("data: ", absensiSiswa);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!absensiSiswa) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <div className="bg-green-500 p-2">
        <SignOutButton />
      </div>
      <div className="p-2">
        <div className="container m-auto">
          <BreadCrumb
            items={[
              { label: "Tahun ajaran", to: "/home" },
              { label: "Kelas", to: `/tahunAjaran/${tahunAjaranId}` },
              {
                label: "siswa",
                to: `/tahunAjaran/${tahunAjaranId}/kelas/${kelasId}/siswa`,
              },
              {
                label: "absen",
                to: `/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/siswa`,
              },
            ]}
          />
        </div>
        <div className="container m-auto bg-yellow-400 rounded-lg my-3 shadow-xl flex justify-center">
          <input
            className="bg-purple-800 text-3xl font-bold text-white px-4 py-2 rounded-lg my-3"
            type="date"
            value={selectedDate.toISOString().split("T")[0]} // Format tanggal untuk input type date
            onChange={(e) => handleDateChange(new Date(e.target.value))}
          />
        </div>
        <div className="container m-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  no
                </th>
                <th scope="col" className="px-6 py-3">
                  Nama Siswa
                </th>
                <th scope="col" className="px-6 py-3">
                  Presensi
                </th>
              </tr>
            </thead>
            <tbody>
              {absensiSiswa.absensiSiswa.map((siswa, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{siswa.nama}</td>
                  <td className="px-6 py-4">
                    {siswa.absensi ? "Hadir" : "Tidak Hadir"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailAbsen;
