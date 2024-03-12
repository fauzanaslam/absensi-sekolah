import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
import icon1 from "../assets/pictures/icon11.png";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Berhasil keluar!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <div className="container m-auto bg-green-500 flex justify-between py-1 items-center">
      <div>
        <Link to={"/home"} className="flex items-center">
          <img src={icon1} alt="tes" width={"30px"} />
          <span className="font-bold px-2 text-white text-2xl">
            E-School Attendence
          </span>
        </Link>
      </div>
      <div>
        <button
          onClick={handleClick}
          className="text-white px-3 font-bold hover:underline text-xl"
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default SignOutButton;
