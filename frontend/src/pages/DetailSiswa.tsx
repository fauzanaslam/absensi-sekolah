import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import SignOutButton from "../components/SignOutButton";
import BreadCrumb from "../components/BreadCrumb";

const DetailSiswa = () => {
  const { tahunAjaranId, kelasId, siswaId } = useParams();
  const { isLoggedIn } = useAppContext();

  const { data: siswaDetails, isLoading } = useQuery(
    ["fetchSiswaDetails", tahunAjaranId, kelasId, siswaId],
    () =>
      apiClient.fetchSiswaDetails(
        tahunAjaranId ?? "",
        kelasId ?? "",
        siswaId ?? ""
      ),
    {
      enabled: !!tahunAjaranId && !!kelasId && !!siswaId,
    }
  );

  if (!isLoggedIn) return <SignIn />;
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!siswaDetails) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <div className="bg-green-500 shadow-xl p-2">
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
        <div className="container m-auto bg-yellow-400 rounded-lg my-3 shadow-xl">
          <h2 className="text-3xl font-bold text-white p-4">
            Nama siswa: {siswaDetails.nama}
          </h2>
        </div>
        <div className="flex container m-auto justify-center my-7">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Presensi</th>
              </tr>
            </thead>
            <tbody>
              {siswaDetails.absenHarian.map((absen, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {absen.tanggal.toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {absen.presensi ? "Hadir" : "Tidak Hadir"}
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

export default DetailSiswa;
