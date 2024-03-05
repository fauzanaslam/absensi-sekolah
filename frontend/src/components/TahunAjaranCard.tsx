import { Link } from "react-router-dom";
import { academicYearType } from "../api-client";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

type Props = {
  tahunAjaran: academicYearType;
};

const TahunAjaranCard = ({ tahunAjaran }: Props) => {
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.hapusTahunAjaran, {
    onSuccess: () => {
      showToast({ message: "Berhasil hapus tahun ajaran", type: "SUCCESS" });
      location.reload();
    },
    onError: (error: Error) => {
      showToast({
        message: `Gagal menambahkan kelas: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate(tahunAjaran._id);
  };

  return (
    <div className="flex">
      <Link
        to={`/tahunAjaran/${tahunAjaran._id}`}
        className="bg-gray-500 w-full font-bold text-3xl py-2 flex justify-center rounded-l-lg text-white h-52 hover:bg-gray-400 items-center shadow-xl"
      >
        {tahunAjaran.tahunAjaran}
      </Link>

      <button
        className="bg-red-500 font-bold  px-2 rounded-r-lg text-white hover:bg-red-400"
        onClick={handleDelete}
      >
        hapus
      </button>
    </div>
  );
};

export default TahunAjaranCard;
