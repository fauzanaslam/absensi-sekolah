import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type TahunAjaranFormData = {
  tahunAjaran: string;
};

const TambahTahunAjaran = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TahunAjaranFormData>();

  const mutation = useMutation(apiClient.tambahTahunAjaran, {
    onSuccess: async () => {
      showToast({ message: "Berhasil tambah tahun ajaran", type: "SUCCESS" });
      navigate(location.state?.from?.pathname || "/home");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">tambah tahun ajaran</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Tahun ajaran
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("tahunAjaran", { required: "This field is required" })}
        ></input>
        {errors.tahunAjaran && (
          <span className="text-red-500">{errors.tahunAjaran.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Tambah tahun ajaran
        </button>
      </span>
    </form>
  );
};

export default TambahTahunAjaran;
