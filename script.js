// Mengambil data jadwal dari Local Storage
let jadwal = JSON.parse(
  localStorage.getItem("jadwalKuliah")
) || [];

// Daftar nama hari
const urutanHari = [
  "Senin", "Selasa", "Rabu",
  "Kamis", "Jumat", "Sabtu"
];

// Menampilkan tanggal
document.getElementById("tanggal").textContent =
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

// Menyimpan jadwal
function simpan() {
  localStorage.setItem(
    "jadwalKuliah",
    JSON.stringify(jadwal)
  );
}

// Menampilkan semua jadwal
function tampilkan() {
  const daftar = document.getElementById("daftarJadwal");
  const kata = document.getElementById("cari").value.toLowerCase();
  const filter = document.getElementById("filterHari").value;

  daftar.innerHTML = "";

  const hasil = jadwal
    .filter(item =>
      (filter === "Semua" || item.hari === filter) &&
      (item.matkul.toLowerCase().includes(kata) ||
       item.dosen.toLowerCase().includes(kata))
    )
    .sort((a, b) => {
      const bedaHari =
        urutanHari.indexOf(a.hari) - urutanHari.indexOf(b.hari);
      return bedaHari || a.mulai.localeCompare(b.mulai);
    });

  if (hasil.length === 0) {
    daftar.innerHTML = "<p>Belum ada jadwal ditemukan.</p>";
  }

  hasil.forEach(item => {
    const div = document.createElement("div");

    div.className = "item" + (item.selesai ? " sudah" : "");

    const info = document.createElement("div");
    const judul = document.createElement("h3");
    judul.textContent = item.matkul;

    const detail = document.createElement("p");
    detail.textContent = "Dosen: " + item.dosen;

    const waktu = document.createElement("p");
    waktu.textContent = item.hari + " | " + item.mulai +
      " - " + item.akhir;

    const ruang = document.createElement("p");
    ruang.textContent = "Ruangan: " + item.ruang;

    info.append(judul, detail, waktu, ruang);

    const aksi = document.createElement("div");

    const tombolSelesai = document.createElement("button");
    tombolSelesai.className = "done";
    tombolSelesai.textContent =
      item.selesai ? "Sudah selesai" : "Tandai selesai";
    tombolSelesai.onclick = () => tandaiSelesai(item.id);

    const tombolHapus = document.createElement("button");
    tombolHapus.className = "hapus";
    tombolHapus.textContent = "Hapus";
    tombolHapus.onclick = () => hapus(item.id);

    aksi.append(tombolSelesai, tombolHapus);
    div.append(info, aksi);
    daftar.appendChild(div);
  });

  // Memperbarui angka statistik
  document.getElementById("total").textContent = jadwal.length;

  const hariSekarang = [
    "Minggu", "Senin", "Selasa", "Rabu",
    "Kamis", "Jumat", "Sabtu"
  ][new Date().getDay()];

  document.getElementById("hariIni").textContent =
    jadwal.filter(item => item.hari === hariSekarang).length;

  document.getElementById("selesai").textContent =
    jadwal.filter(item => item.selesai).length;
}

// Menambahkan jadwal baru
document.getElementById("formJadwal")
.addEventListener("submit", function(event) {
  event.preventDefault();

  const mulai = document.getElementById("mulai").value;
  const akhir = document.getElementById("akhir").value;

  if (akhir <= mulai) {
    alert("Jam selesai harus setelah jam mulai!");
    return;
  }

  const dataBaru = {
    id: Date.now(),
    matkul: document.getElementById("matkul").value.trim(),
    dosen: document.getElementById("dosen").value.trim(),
    hari: document.getElementById("hari").value,
    ruang: document.getElementById("ruang").value.trim(),
    mulai: mulai,
    akhir: akhir,
    selesai: false
  };

  jadwal.push(dataBaru);

  simpan();
  tampilkan();
  this.reset();

  alert("Jadwal berhasil ditambahkan!");
});

// Menandai jadwal selesai
function tandaiSelesai(id) {
  jadwal = jadwal.map(item =>
    item.id === id
      ? { ...item, selesai: !item.selesai }
      : item
  );

  simpan();
  tampilkan();
}

// Menghapus jadwal
function hapus(id) {
  if (confirm("Yakin ingin menghapus jadwal?")) {
    jadwal = jadwal.filter(item => item.id !== id);
    simpan();
    tampilkan();
  }
}

// Fitur pencarian dan filter hari
document.getElementById("cari")
.addEventListener("input", tampilkan);

document.getElementById("filterHari")
.addEventListener("change", tampilkan);

// Menampilkan jadwal ketika halaman dibuka
tampilkan();
function lihatStatistik(jenis) {
    let pesan = "";

    if (jenis === "total") {
        pesan = "Menampilkan semua jadwal kuliah";
        document.getElementById("filterHari").value = "Semua";
        document.getElementById("cari").value = "";
    }

    else if (jenis === "hariIni") {
        const hari = [
            "Minggu", "Senin", "Selasa",
            "Rabu", "Kamis", "Jumat", "Sabtu"
        ];

        const sekarang = hari[new Date().getDay()];

        document.getElementById("filterHari").value = sekarang;
        document.getElementById("cari").value = "";

        pesan = "Menampilkan jadwal hari ini: " + sekarang;
    }

    else if (jenis === "selesai") {
        pesan = "Menampilkan jadwal yang sudah selesai";
    }

    // Memperbarui tampilan daftar jadwal
    if (typeof tampilkanJadwal === "function") {
        tampilkanJadwal();
    }

    alert(pesan);
    
    document.querySelector(".jadwal-box")
        .scrollIntoView({ behavior: "smooth" });
}
