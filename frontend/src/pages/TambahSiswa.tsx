import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type TambahSiswaFormData = {
  nama: string;
};

const TambahSiswa = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TambahSiswaFormData>();

  const mutation = useMutation(apiClient.tambahSiswa, {
    onSuccess: async () => {
      showToast({ message: "Berhasil tambah kelas", type: "SUCCESS" });
      navigate(`/tahunAjaran/${tahunAjaranId}/kelas/${kelasId}/siswa`);
    },
    onError: (error: Error) => {
      showToast({
        message: `Gagal menambahkan kelas: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({
      tahunAjaranId: tahunAjaranId,
      kelasId: kelasId,
      newStudentData: data,
    });
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Tambah Siswa</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Nama Siswa
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("nama", { required: "This field is required" })}
        ></input>
        {errors.nama && (
          <span className="text-red-500">{errors.nama.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Menambahkan..." : "Tambah Siswa"}
        </button>
      </span>
    </form>
  );
};

export default TambahSiswa;
