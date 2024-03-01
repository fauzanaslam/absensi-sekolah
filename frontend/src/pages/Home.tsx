import SignOutButton from "../components/SignOutButton";
import { useAppContext } from "../contexts/AppContext";
import SignIn from "./SignIn";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import TahunAjaranCard from "../components/TahunAjaranCard";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: tahunAjaran } = useQuery("fetchQuery", () =>
    apiClient.fetchTahunAjaran()
  );

  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) return <SignIn />;
  return (
    <div>
      <SignOutButton />
      <div className="space-y-3">
        <div className="flex justify-between pt-2">
          <h2 className="text-3xl font-bold">TAHUN AJARAN</h2>
          <Link
            to="/tambah-tahun-ajaran"
            className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
          >
            tambah tahun ajaran
          </Link>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {tahunAjaran?.map((tahunAjaran) => (
            <TahunAjaranCard tahunAjaran={tahunAjaran} key={tahunAjaran._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
