import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Navigate,
} from "react-router-dom";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
import DetailTahunAjaran from "./pages/DetailTahunAjaran";
import DetailKelas from "./pages/DetailKelas";
import TambahTahunAjaran from "./pages/TambahTahunAjaran";
import TambahKelas from "./pages/TambahKelas";
import TambahSiswa from "./pages/TambahSiswa";
import DetailSiswa from "./pages/DetailSiswa";
import DetailAbsen from "./pages/DetailAbsen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/tahunAjaran/:tahunAjaranId"
          element={<DetailTahunAjaran />}
        />
        <Route
          path="/tahunAjaran/:tahunAjaranId/kelas/:kelasId/siswa"
          element={<DetailKelas />}
        />
        <Route
          path="/tahunAjaran/:tahunAjaranId/kelas/:kelasId/siswa/:siswaId/absen"
          element={<DetailSiswa />}
        />
        <Route
          path="/tahun-ajaran/:tahunAjaranId/kelas/:kelasId/absen"
          element={<DetailAbsen />}
        />
        <Route path="/tambah-tahun-ajaran" element={<TambahTahunAjaran />} />
        <Route
          path="/tahun-ajaran/:tahunAjaranId/tambah-kelas"
          element={<TambahKelas />}
        />
        <Route
          path="/tahun-ajaran/:tahunAjaranId/kelas/:kelasId/tambah-siswa"
          element={<TambahSiswa />}
        />
      </Routes>
    </Router>
  );
}

export default App;
