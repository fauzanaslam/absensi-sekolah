import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "../components/SignOutButton";

export type EditKelasFormData = {
  nama: string;
};

const EditSiswa = () => {
  const { tahunAjaranId, kelasId, siswaId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditKelasFormData>();

  const mutation = useMutation(apiClient.editSiswa, {
    onSuccess: async () => {
      showToast({ message: "Berhasil edit kelas", type: "SUCCESS" });
      navigate(
        location.state?.from?.pathname ||
          `/tahunAjaran/${tahunAjaranId}/kelas/${kelasId}/siswa`
      );
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const { data: siswaDetails, isLoading } = useQuery(
    ["fetchSiswaDetails", tahunAjaranId, kelasId, siswaId],
    () =>
      apiClient.fetchSiswaDetails(
        tahunAjaranId ?? "",
        kelasId ?? "",
        siswaId ?? ""
      ),
    {
      enabled: !!tahunAjaranId && !!kelasId && !!siswaId,
    }
  );

  if (!tahunAjaranId || !kelasId) {
    return <p>Data kelas tidak valid</p>;
  }

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({
      tahunAjaranId: tahunAjaranId,
      kelasId: kelasId,
      siswaId: siswaId,
      ...data,
    });
  });

  if (!isLoading && siswaDetails) {
    setValue("nama", siswaDetails.nama);
  }

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
            <h2 className="text-2xl font-bold mb-5">Edit siswa</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                siswa
                <input
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("nama", {
                    required: "This field is required",
                  })}
                ></input>
                {errors.nama && (
                  <span className="text-red-500">{errors.nama.message}</span>
                )}
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Edit siswa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSiswa;
