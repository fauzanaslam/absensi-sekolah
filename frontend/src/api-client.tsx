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
    tanggal: Date;
    presensi: boolean;
  }[];
  SPP: paymentType[];
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

// Update your API function
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
