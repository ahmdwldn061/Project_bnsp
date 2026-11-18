import { useEffect, useState } from "react";

interface Siswa {
  id: number;
  kode_siswa: string;
  nama_siswa: string;
  alamat_siswa: string;
  tgl_siswa: string;
  jurusan_siswa: string;
}

const API = "http://localhost:5001/api/siswa";

const formAwal = {
  kode_siswa: "",
  nama_siswa: "",
  alamat_siswa: "",
  tgl_siswa: "",
  jurusan_siswa: "",
};

function App() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [form, setForm] = useState(formAwal);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchSiswa = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Gagal mengambil data");
      setSiswa(await response.json());
    } catch {
      setMessage("Backend belum terhubung. Periksa server.");
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("DATA YANG DIKIRIM:", form);
  
    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
  
      const result = await response.json();
  
      console.log("STATUS SERVER:", response.status);
      console.log("RESPONS SERVER:", result);
  
      if (!response.ok) {
        setMessage(
          `Gagal (${response.status}): ${result.message || "Terjadi kesalahan"}`
        );
        return;
      }
  
      setMessage(result.message || "Berhasil menyimpan data!");
  
      setForm(formAwal);
      setEditId(null);
      setShowForm(false);
  
      await fetchSiswa();
    } catch (error) {
      console.error("ERROR SIMPAN:", error);
      setMessage("Tidak dapat menghubungi backend. Periksa server.");
    }
  };
  


  const handleEdit = (data: Siswa) => {
    setForm({
      kode_siswa: data.kode_siswa,
      nama_siswa: data.nama_siswa,
      alamat_siswa: data.alamat_siswa,
      tgl_siswa: data.tgl_siswa.slice(0, 10),
      jurusan_siswa: data.jurusan_siswa,
    });

    setEditId(data.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus data siswa?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setMessage(result.message);
      fetchSiswa();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal menghapus data"
      );
    }
  };

  const dataFilter = siswa.filter((item) =>
    [
      item.kode_siswa,
      item.nama_siswa,
      item.jurusan_siswa,
    ].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen">
      <header className="bg-blue-700 p-6 text-white shadow-lg">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">SISTEM DATA SISWA</h1>
          <p className="mt-1 text-blue-100">
            Aplikasi Pengelolaan Data Siswa
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-slate-500">Total Siswa</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-700">
              {siswa.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-slate-500">Total Jurusan</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-700">
              {new Set(siswa.map((s) => s.jurusan_siswa)).size}
            </h2>
          </div>
        </div>

        <section className="rounded-xl bg-white p-6 shadow">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Daftar Siswa</h2>
              <p className="text-sm text-slate-500">
                Kelola data siswa di sini
              </p>
            </div>

            <button
              onClick={() => {
                setForm(formAwal);
                setEditId(null);
                setShowForm(true);
                setMessage("");
              }}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              + Tambah Siswa
            </button>
          </div>

          {message && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-blue-700">
              {message}
            </div>
          )}

          {showForm && (
            <form
            noValidate
            onSubmit={handleSubmit}
              className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5"
            >
              <h3 className="mb-4 text-lg font-bold">
                {editId ? "Edit Data Siswa" : "Tambah Data Siswa"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["kode_siswa", "Kode Siswa", "text"],
                  ["nama_siswa", "Nama Siswa", "text"],
                  ["alamat_siswa", "Alamat Siswa", "text"],
                  ["tgl_siswa", "Tanggal Siswa", "date"],
                  ["jurusan_siswa", "Jurusan Siswa", "text"],
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-1 block text-sm font-medium">
                      {label}
                    </label>

                    <input
                      type={type}
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2 text-white"
                >
                  {editId ? "Update" : "Simpan"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                    setForm(formAwal);
                  }}
                  className="rounded-lg border bg-white px-5 py-2"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <input
            type="text"
            placeholder="Cari kode, nama, atau jurusan siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-5 w-full rounded-lg border border-slate-300 p-3 outline-blue-500"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {[
                    "No",
                    "Kode",
                    "Nama",
                    "Alamat",
                    "Tanggal",
                    "Jurusan",
                    "Aksi",
                  ].map((heading) => (
                    <th key={heading} className="p-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dataFilter.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.kode_siswa}</td>
                    <td className="p-3">{item.nama_siswa}</td>
                    <td className="p-3">{item.alamat_siswa}</td>
                    <td className="p-3">{item.tgl_siswa.slice(0, 10)}</td>
                    <td className="p-3">{item.jurusan_siswa}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded bg-amber-100 px-3 py-2 text-amber-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded bg-red-100 px-3 py-2 text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {dataFilter.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Belum ada data siswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Menampilkan {dataFilter.length} dari {siswa.length} siswa
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;