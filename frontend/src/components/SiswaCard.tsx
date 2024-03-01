import { studentType } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";

type Props = {
  tahunAjaran: string;
  kelas: string;
  siswa: studentType;
};

const SiswaCard = ({ tahunAjaran, kelas, siswa }: Props) => {
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.deleteStudentFromClass, {
    onSuccess: () => {
      showToast({ message: "Berhasil hapus siswa", type: "SUCCESS" });
      location.reload();
    },
    onError: (error: Error) => {
      showToast({
        message: `Gagal hapus siswa: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const handleDeleteStudent = async () => {
    try {
      await mutation.mutateAsync({
        tahunAjaranId: tahunAjaran,
        kelasId: kelas,
        siswaId: siswa._id,
      });
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };
  return (
    <div className="flex flex-1">
      <div className=" w-full font-bold text-3xl py-2 flex justify-center">
        {siswa.nama}
      </div>
      <button
        className="bg-red-500 font-bold text-3xl px-2"
        onClick={handleDeleteStudent}
      >
        X
      </button>
    </div>
  );
};

export default SiswaCard;
