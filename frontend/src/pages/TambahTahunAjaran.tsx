import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "../components/SignOutButton";

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
            <h2 className="text-2xl font-bold mb-5">tambah tahun ajaran</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tahun ajaran
                <input
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("tahunAjaran", {
                    required: "This field is required",
                  })}
                ></input>
                {errors.tahunAjaran && (
                  <span className="text-red-500">
                    {errors.tahunAjaran.message}
                  </span>
                )}
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                tambah tahun ajaran
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahTahunAjaran;
