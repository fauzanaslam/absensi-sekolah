import { Link } from "react-router-dom";
import { academicYearType, classType } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";

type Props = {
  tahunAjaran: academicYearType;
  kelas: classType;
};

const KelasCard = ({ tahunAjaran, kelas }: Props) => {
  const { showToast } = useAppContext();

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
    <div className="flex">
      <Link
        to={`/tahunAjaran/${tahunAjaran._id}/kelas/${kelas._id}/siswa`}
        className="bg-gray-500 w-full font-bold text-3xl py-2 flex justify-center rounded-l-lg text-white h-52 hover:bg-gray-400 items-center shadow-xl"
      >
        {kelas.kelas}
      </Link>
      <button
        className="bg-red-500 font-bold px-2 rounded-r-lg text-white hover:bg-red-400"
        onClick={handleDeleteClass}
      >
        hapus
      </button>
    </div>
  );
};

export default KelasCard;
