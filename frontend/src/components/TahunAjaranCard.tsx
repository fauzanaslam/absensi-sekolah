import { Link } from "react-router-dom";
import { academicYearType } from "../api-client";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import tahunAjaranPict from "../assets/pictures/tahunAjaran3.png";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/20/solid";

type Props = {
  tahunAjaran: academicYearType;
};

const TahunAjaranCard = ({ tahunAjaran }: Props) => {
  const { showToast, userRole } = useAppContext();

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

  const isUserRole = userRole !== "admin";

  const handleDelete = () => {
    mutation.mutate(tahunAjaran._id);
  };

  return (
    <div className="">
      <Link
        to={`/tahunAjaran/${tahunAjaran._id}`}
        className={`bg-green-500 w-full font-bold md:text-xl py-2 grid justify-center text-white h-36 hover:bg-green-400 items-center shadow-xl ${
          isUserRole ? "rounded-lg" : "rounded-t-lg"
        }`}
      >
        <img
          src={tahunAjaranPict}
          alt="tes"
          width={"75px"}
          className="mx-auto"
        />
        {tahunAjaran.tahunAjaran}
      </Link>
      {isUserRole ? null : (
        <div className="flex">
          <button
            className="bg-red-500 font-bold text-white hover:bg-red-400 flex-1 rounded-bl-lg"
            onClick={handleDelete}
          >
            <TrashIcon className="h-6 w-4 m-auto" />
          </button>
          <Link
            to={`/tahunAjaran/${tahunAjaran._id}/edit-tahun-ajaran`}
            className="bg-blue-500 font-bold rounded-br-lg text-white hover:bg-blue-400 flex-1"
            onClick={window.location.reload}
          >
            <PencilSquareIcon className="h-full w-4 m-auto" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TahunAjaranCard;
