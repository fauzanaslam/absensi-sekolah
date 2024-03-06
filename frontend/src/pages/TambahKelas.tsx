import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "../components/SignOutButton";

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
    <div className="bg-gray-200 min-h-screen">
      <div className="bg-green-500">
        <SignOutButton />
      </div>
      <div>
        <div className="container m-auto w-full max-w-xs mt-32">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={onSubmit}
          >
            <h2 className="text-2xl font-bold mb-5">tambah Kelas</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Kelas
                <input
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("kelas", {
                    required: "This field is required",
                  })}
                ></input>
                {errors.kelas && (
                  <span className="text-red-500">{errors.kelas.message}</span>
                )}
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                tambah kelas
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahKelas;
