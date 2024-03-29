type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

type SignInFormData = {
  email: string;
  password: string;
};

export type teacherType = {
  nama: string;
};

export type subjectType = {
  mataPelajaran: string;
  guru: teacherType;
};

export type dayType = {
  hari: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  mataPelajaran: subjectType[];
};

export type paymentType = {
  bulan: string;
  jumlahPembayaran: number;
};

export type studentType = {
  _id: string;
  nama: string;
  absenHarian: {
    tanggal: Date | string;
    presensi: boolean;
  }[];
  SPP: paymentType[];
};

export type absenHarianType = {
  tanggal: Date;
  presensi: boolean;
};

export type classType = {
  _id: string;
  kelas: string;
  hariDanMapel: dayType[];
  siswa: studentType[];
};

export type academicYearType = {
  _id: string;
  tahunAjaran: string;
  kelas: classType[];
};
export type addAcademicYearType = {
  tahunAjaran: string;
};
export type updateAcademicYearType = {
  tahunAjaranId: string | undefined;
  tahunAjaran: string;
};
export type updateKelasType = {
  tahunAjaranId: string | undefined;
  kelasId: string | undefined;
  kelas: string[];
};
export type updateSiswaType = {
  tahunAjaranId: string | undefined;
  kelasId: string | undefined;
  siswaId: string | undefined;
  nama: string;
};

export type NewClassType = {
  kelas: string;
};

export type NewStudentType = {
  nama: string;
};

export type TambahKelasRequestData = {
  tahunAjaranId: string | undefined;
  newClassData: NewClassType;
};

export type TambahSiswaRequestData = {
  tahunAjaranId: string | undefined;
  kelasId: string | undefined;
  newStudentData: NewStudentType;
};

export type DeleteKelasRequestData = {
  tahunAjaranId: string | undefined;
  kelasId: string | undefined;
};
export type DeleteSiswaRequestData = {
  tahunAjaranId: string | undefined;
  kelasId: string | undefined;
  siswaId: string | undefined;
};
export type AbsenSiswaType = {
  nama: string;
  absensi: boolean | null;
};
export type AbsenKelasType = {
  absensiSiswa: AbsenSiswaType[];
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  username: string;
  role: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const fetchTahunAjaran = async (): Promise<academicYearType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/tahun-ajaran/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Academic Years");
  }

  return response.json();
};

export const fetchTahunAjaranById = async (
  tahunAjaranId: string
): Promise<academicYearType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching tahun ajaran");
  }

  return response.json();
};

export const fetchKelas = async (tahunAjaranId: string): Promise<classType> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}/kelas`
    );

    if (!response.ok) {
      throw new Error(`Error fetching kelas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const fetchKelasDetails = async (
  tahunAjaranId: string,
  kelasId: string
): Promise<{
  siswa: studentType[];
  hariDanMapel: dayType[];
  kelas: classType[];
} | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/details`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching class details for ${kelasId}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error in fetchKelasDetails:", error);
    return null;
  }
};

export const tambahTahunAjaran = async (
  tahunAjaranBaru: addAcademicYearType
): Promise<addAcademicYearType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/tambah-tahun-ajaran`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tahunAjaranBaru),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Error adding new academic year");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in addNewTahunAjaran:", error);
    return null;
  }
};

export const editTahunAjaran = async (
  updatedData: updateAcademicYearType
): Promise<updateAcademicYearType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${updatedData.tahunAjaranId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error editing tahun ajaran: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing tahun ajaran:", error);
    throw error;
  }
};

export const tambahKelas = async (
  requestData: TambahKelasRequestData
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${requestData.tahunAjaranId}/kelas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData.newClassData),
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error in addNewClass:", error);
  }
};

export const editKelas = async (
  updatedData: updateKelasType
): Promise<updateKelasType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${updatedData.tahunAjaranId}/kelas/${updatedData.kelasId}/edit-kelas`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error editing kelas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing kelas:", error);
    throw error;
  }
};

export const tambahSiswa = async (
  requestData: TambahSiswaRequestData
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${requestData.tahunAjaranId}/kelas/${requestData.kelasId}/siswa`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData.newStudentData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error in tambahSiswa:", error);
  }
};

export const editSiswa = async (
  updatedData: updateSiswaType
): Promise<updateSiswaType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${updatedData.tahunAjaranId}/kelas/${updatedData.kelasId}/siswa/${updatedData.siswaId}/edit-siswa`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error editing kelas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing kelas:", error);
    throw error;
  }
};

export const hapusTahunAjaran = async (
  tahunAjaranId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error in hapusTahunAjaran:", error);
    throw error;
  }
};

export const deleteKelas = async (
  requestData: DeleteKelasRequestData
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${requestData.tahunAjaranId}/kelas/${requestData.kelasId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error in deleteKelas:", error);
  }
};

// api-client.tsx

export const deleteStudentFromClass = async (
  requestData: DeleteSiswaRequestData
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${requestData.tahunAjaranId}/kelas/${requestData.kelasId}/siswa/${requestData.siswaId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error in deleteStudentFromClass:", error);
  }
};

export const updatePresensi = async (studentId: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/update-presensi`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, presensi: true }),
    });
  } catch (error) {
    console.error("Error updating presensi:", error);
    throw error;
  }
};

export const fetchSiswaDetails = async (
  tahunAjaranId: string,
  kelasId: string,
  siswaId: string
): Promise<studentType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/siswa/${siswaId}/absen`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching class details for ${kelasId}`);
    }

    const data = await response.json();
    console.log("DATA SISWA", data);

    return data;
  } catch (error) {
    console.error("Error in fetchKelasDetails:", error);
    return null;
  }
};
export const fetchAbsensiKelas = async (
  tahunAjaranId: string,
  kelasId: string,
  tanggal: string
): Promise<AbsenKelasType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tahun-ajaran/${tahunAjaranId}/kelas/${kelasId}/absen?tanggal=${tanggal}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching class details for ${kelasId}`);
    }

    const data = await response.json();
    console.log("DATA SISWA", data);

    return data;
  } catch (error) {
    console.error("Error in fetchKelasDetails:", error);
    return null;
  }
};

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};
