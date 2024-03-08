import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import TahunAjaranCard from "../components/TahunAjaranCard";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

const Home = () => {
  const { data: tahunAjaran } = useQuery("fetchQuery", () =>
    apiClient.fetchTahunAjaran()
  );

  const { isLoggedIn, userRole } = useAppContext();

  if (!isLoggedIn) return <SignIn />;

  const isUserRole = userRole !== "admin";

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-green-500 rounded shadow-xl">
        <SignOutButton />
      </div>
      <div className="container m-auto">
        <BreadCrumb items={[{ label: "Tahun Ajaran", to: "/home" }]} />
      </div>
      <div className="container m-auto bg-yellow-400 rounded-full my-3 shadow-xl">
        <div className="flex justify-between p-4">
          <h2 className="text-3xl font-bold text-white">Tahun ajaran</h2>
          {isUserRole ? null : (
            <Link
              to="/tambah-tahun-ajaran"
              className="flex bg-yellow-700 text-white text-xl font-bold px-5 py-2 hover:bg-yellow-600 rounded-full shadow-xl"
            >
              tambah tahun ajaran
            </Link>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 container m-auto">
        {tahunAjaran?.map((tahunAjaran) => (
          <TahunAjaranCard tahunAjaran={tahunAjaran} key={tahunAjaran._id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
