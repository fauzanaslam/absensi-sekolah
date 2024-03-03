import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import SignOutButton from "../components/SignOutButton";

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
      <SignOutButton />
      <h2 className="text-3xl font-bold">NAMA SISWA: {siswaDetails.nama}</h2>
      <table className="table-auto">
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
  );
};

export default DetailSiswa;
