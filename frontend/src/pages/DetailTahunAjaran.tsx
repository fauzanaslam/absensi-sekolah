import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link, useParams } from "react-router-dom";
import KelasCard from "../components/KelasCard";
import BreadCrumb from "../components/BreadCrumb";

const DetailTahunAjaran = () => {
  const { tahunAjaranId } = useParams();

  const { isLoggedIn, userRole } = useAppContext();

  const isUserRole = userRole !== "admin";

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
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-green-500 shadow-xl">
        <SignOutButton />
      </div>
      <div className="container m-auto">
        <BreadCrumb
          items={[
            { label: "Tahun ajaran", to: "/home" },
            { label: "Kelas", to: "/about" },
          ]}
        />
      </div>
      <div className="container m-auto bg-yellow-400 rounded-full my-3 shadow-xl">
        <div className="flex justify-between p-4">
          <h2 className="text-3xl font-bold text-white">
            Tahun ajaran: {tahunAjaran.tahunAjaran}
          </h2>
          {isUserRole ? null : (
            <Link
              to={`/tahun-ajaran/${tahunAjaranId}/tambah-kelas`}
              className="flex bg-yellow-700 text-white text-xl font-bold px-5 py-2 hover:bg-yellow-600 rounded-full shadow-xl"
            >
              tambah kelas
            </Link>
          )}
        </div>
      </div>
      <div className="container m-auto grid md:grid-cols-3 grid-cols-1 gap-4">
        {tahunAjaran.kelas.map((kelas) => (
          <KelasCard key={kelas._id} tahunAjaran={tahunAjaran} kelas={kelas} />
        ))}
      </div>
    </div>
  );
};

export default DetailTahunAjaran;
