import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useParams } from "react-router-dom";
import KelasCard from "../components/KelasCard";

const DetailTahunAjaran = () => {
  const { tahunAjaranId } = useParams();

  const { isLoggedIn } = useAppContext();

  const { data: tahunAjaran } = useQuery(
    "fetchTahunAjaranById",
    () => apiClient.fetchTahunAjaranById(tahunAjaranId || ""),
    {
      enabled: !!tahunAjaranId,
    }
  );

  if (!tahunAjaranId || !tahunAjaran) {
    return <p>Tahun Ajaran tidak valid</p>;
  }

  if (!isLoggedIn) return <SignIn />;

  return (
    <div>
      <SignOutButton />
      <div className="flex justify-between pt-2 my-2">
        <h2 className="text-3xl font-bold">
          tahun ajaran: {tahunAjaran.tahunAjaran}
        </h2>
        <Link
          to={`/tahun-ajaran/${tahunAjaranId}/tambah-kelas`}
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
        >
          tambah kelas
        </Link>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {tahunAjaran.kelas.map((kelas) => (
          <KelasCard key={kelas._id} tahunAjaran={tahunAjaran} kelas={kelas} />
        ))}
      </div>
    </div>
  );
};

export default DetailTahunAjaran;
