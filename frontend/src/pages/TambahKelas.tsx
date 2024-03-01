import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type TambahKelasFormData = {
  kelas: string;
};

const TambahKelas = () => {
  const { tahunAjaranId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TambahKelasFormData>();

  const mutation = useMutation(apiClient.tambahKelas, {
    onSuccess: async () => {
      showToast({ message: "Berhasil tambah kelas", type: "SUCCESS" });
      navigate(`/tahunAjaran/${tahunAjaranId}`);
    },
    onError: (error: Error) => {
      showToast({
        message: `Gagal menambahkan kelas: ${error.message}`,
        type: "ERROR",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({ tahunAjaranId: tahunAjaranId, newClassData: data });
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Tambah Kelas</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Nama Kelas
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("kelas", { required: "This field is required" })}
        ></input>
        {errors.kelas && (
          <span className="text-red-500">{errors.kelas.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Menambahkan..." : "Tambah Kelas"}
        </button>
      </span>
    </form>
  );
};

export default TambahKelas;
