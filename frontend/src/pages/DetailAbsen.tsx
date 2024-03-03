import { useQuery } from "react-query";
import SignOutButton from "../components/SignOutButton";
import * as apiClient from "../api-client";
import { useParams } from "react-router-dom";
import { useState } from "react";

const DetailAbsen = () => {
  const { tahunAjaranId, kelasId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const { data: absensiSiswa, isLoading } = useQuery(
    ["fetchAbsensiSiswa", tahunAjaranId, kelasId, selectedDate.toISOString()],
    () =>
      apiClient.fetchAbsensiKelas(
        tahunAjaranId ?? "",
        kelasId ?? "",
        selectedDate.toISOString()
      ),
    {
      enabled: !!tahunAjaranId && !!kelasId,
    }
  );

  console.log("data: ", absensiSiswa);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!absensiSiswa) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <SignOutButton />
      <input
        type="date"
        value={selectedDate.toISOString().split("T")[0]} // Format tanggal untuk input type date
        onChange={(e) => handleDateChange(new Date(e.target.value))}
      />
      <ul>
        <ul>
          {absensiSiswa.absensiSiswa.map((siswa, index) => (
            <li key={index}>
              {siswa.nama} - Presensi: {siswa.absensi ? "Hadir" : "Tidak Hadir"}
            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
};

export default DetailAbsen;
