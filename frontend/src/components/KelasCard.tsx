import { Link } from "react-router-dom";
import { academicYearType, classType } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import kelasPict from "../assets/pictures/kelas.png";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

type Props = {
  tahunAjaran: academicYearType;
  kelas: classType;
};

const KelasCard = ({ tahunAjaran, kelas }: Props) => {
  const { showToast, userRole } = useAppContext();

  const isUserRole = userRole !== "admin";

  const mutation = useMutation(apiClient.deleteKelas, {
    onSuccess: () => {
      showToast({ message: "Berhasil hapus kelas", type: "SUCCESS" });
      location.reload();
    },
    onError: (error: Error) => {
      showToast({
        message: `Gagal hapus kelas: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const handleDeleteClass = async () => {
    try {
      await mutation.mutateAsync({
        tahunAjaranId: tahunAjaran._id,
        kelasId: kelas._id,
      });
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className="">
      <Link
        to={`/tahunAjaran/${tahunAjaran._id}/kelas/${kelas._id}/siswa`}
        className={`bg-green-500 w-full font-bold text-xl py-2 grid justify-center text-white h-36 hover:bg-green-400 items-center shadow-xl ${
          isUserRole ? "rounded-lg" : "rounded-t-lg"
        }`}
      >
        <img src={kelasPict} alt="tes" width={"75px"} className="mx-auto" />
        {kelas.kelas}
      </Link>
      {isUserRole ? null : (
        <div className="flex">
          <button
            className="bg-red-500 font-bold px-2 rounded-bl-lg text-white hover:bg-red-400 flex-1"
            onClick={handleDeleteClass}
          >
            <TrashIcon className="w-4 h-6 m-auto" />
          </button>
          <Link
            to={`/tahunAjaran/${tahunAjaran._id}/kelas/${kelas._id}/edit-kelas`}
            className="bg-blue-500 font-bold px-2 rounded-br-lg text-white hover:bg-blue-400 flex-1"
            onClick={window.location.reload}
          >
            <PencilSquareIcon className="h-full w-4 m-auto" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default KelasCard;
