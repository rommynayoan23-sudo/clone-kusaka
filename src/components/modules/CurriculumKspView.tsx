import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KopSurat } from '../common/KopSurat';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Edit3,
  Award,
  Sparkles,
  BookOpen,
  Compass,
  Building,
  Target
} from 'lucide-react';

export const CurriculumKspView: React.FC = () => {
  const { schoolProfile, activeAcademicYear, currentUser, showToast } = useApp();
  const [activeSection, setActiveSection] = useState<'cover' | 'validation' | 'characteristics' | 'vision_mission' | 'organization' | 'p5_structure'>('characteristics');

  // Realistic editable content for SMAN 1 Kakas KSP
  const [kspData, setKspData] = useState({
    title: `KURIKULUM SATUAN PENDIDIKAN (KSP) SMA NEGERI 1 KAKAS TAHUN PELAJARAN ${activeAcademicYear.year}`,
    vision: 'Terwujudnya Peserta Didik yang Beriman dan Bertakwa, Berakhlak Mulia, Unggul dalam Prestasi Akademik, Berkarakter Wirausaha, Berbudaya Mapalus, dan Berwawasan Lingkungan.',
    missions: [
      'Menanamkan nilai-nilai keimanan, ketakwaan, dan budi pekerti luhur dalam seluruh ekosistem sekolah.',
      'Melaksanakan pembelajaran mendalam (deep learning) dan berdiferensiasi berbasis potensi lokal Minahasa.',
      'Mengembangkan kompetensi literasi, numerasi, dan berpikir komputasional peserta didik.',
      'Menguatkan karakter 8 Dimensi Profil Lulusan dan 7 Kebiasaan Anak Indonesia Hebat.',
      'Memupuk semangat gotong royong (Mapalus) dan kepedulian terhadap kelestarian ekosistem Danau Tondano dan lingkungan pesisir Kakas.',
      'Meningkatkan kompetensi profesional pendidik melalui komunitas belajar berkelanjutan.'
    ],
    schoolCharacteristics: 'SMA Negeri 1 Kakas terletak di kawasan strategis Danau Tondano, Kecamatan Kakas, Kabupaten Minahasa. Lingkungan sekolah dikelilingi oleh bentang alam pertanian subur, perikanan air tawar, dan sumber daya geotermal. Peserta didik memiliki latar belakang sosial budaya Minahasa yang kental dengan falsafah "Si Tou Timou Tumou Tou" (Manusia hidup untuk menghidupkan orang lain) serta kearifan gotong-royong Mapalus. Kondisi ini menjadi sumber inspirasi utama dalam pengorganisasian pembelajaran berbasis projek kontekstual.',
    studentCharacteristics: 'Peserta didik Fase E dan F sebagian besar berasal dari wilayah Kakas, Kakas Barat, Lembean Timur, dan Remboken. Mereka memiliki minat yang tinggi pada kegiatan olahraga air, kesenian Minahasa (musik bambu/kolintang), kepemimpinan OSIS, serta minat berkembang dalam teknologi informasi.',
    p5Themes: [
      {
        theme: 'Kearifan Lokal Minahasa',
        topic: 'Eksplorasi Budaya Mapalus dan Konservasi Kearifan Danau Kakas',
        phase: 'Fase E (Kelas X)',
        duration: '120 Jam Pelajaran (Sistem Blok)'
      },
      {
        theme: 'Gaya Hidup Berkelanjutan',
        topic: 'Pengelolaan Sampah Organik dan Pelestarian Sumber Air Bersih Kawasan Danau Tondano',
        phase: 'Fase E (Kelas X)',
        duration: '120 Jam Pelajaran'
      },
      {
        theme: 'Kewirausahaan Berbasis Potensi Lokal',
        topic: 'Inovasi Produk Olahan Ikan Mujair/Betutu dan Kerajinan Bambu Kakas',
        phase: 'Fase F (Kelas XI)',
        duration: '108 Jam Pelajaran'
      }
    ]
  });

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'principal';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-blue-800" />
            <span>DOKUMEN INDUK KURIKULUM SATUAN PENDIDIKAN</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            KSP SMA Negeri 1 Kakas TP {activeAcademicYear.year}
          </h2>
          <p className="text-xs text-slate-500">
            Disusun berdasarkan Permendikbudristek No. 12 Tahun 2024 dan Panduan BSKAP Kemendikbudristek.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen KSP</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSection('characteristics')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'characteristics'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Karakteristik Satuan Pendidikan
        </button>
        <button
          onClick={() => setActiveSection('vision_mission')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'vision_mission'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Visi, Misi & Tujuan
        </button>
        <button
          onClick={() => setActiveSection('organization')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'organization'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Pengorganisasian Pembelajaran
        </button>
        <button
          onClick={() => setActiveSection('p5_structure')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'p5_structure'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          4. Rencana Kokurikuler (P5)
        </button>
        <button
          onClick={() => setActiveSection('validation')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeSection === 'validation'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          5. Lembar Pengesahan Resmi
        </button>
      </div>

      {/* SECTION 1: CHARACTERISTICS */}
      {activeSection === 'characteristics' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                A. Analisis Karakteristik Lingkungan & Satuan Pendidikan
              </h3>
              <p className="text-xs text-slate-500">
                Penyelarasan konteks geografis, sosial budaya Minahasa, dan potensi danau Kakas.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Karakteristik Lingkungan Sosial, Budaya, dan Alam SMAN 1 Kakas:
              </label>
              <textarea
                rows={4}
                value={kspData.schoolCharacteristics}
                onChange={e => setKspData({ ...kspData, schoolCharacteristics: e.target.value })}
                disabled={!canEdit}
                className="w-full p-3 rounded-lg border border-slate-300 text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Analisis Karakteristik Peserta Didik:
              </label>
              <textarea
                rows={3}
                value={kspData.studentCharacteristics}
                onChange={e => setKspData({ ...kspData, studentCharacteristics: e.target.value })}
                disabled={!canEdit}
                className="w-full p-3 rounded-lg border border-slate-300 text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-950 block">Pendidik & Tendik (PTK)</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  22 Pendidik berkualifikasi S1 & S2, dengan tingkat sertifikasi pendidik mencapai 85% dan aktif dalam komunitas belajar internal "Mapalus Edukasi".
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-950 block">Sarana & Prasarana</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  7 Ruang kelas layak pakai, Lab Komputer dengan koneksi internet fiber, Lab IPA, Perpustakaan sekolah, Lapangan olahraga, dan jaringan listrik memadai.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block">Kemitraan Masyarakat</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Kemitraan erat dengan Komite Sekolah, Pemerintah Kecamatan Kakas, Puskesmas Kakas, Kepolisian Sektor Kakas, dan kelompok pembudidaya ikan air tawar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VISION & MISSION */}
      {activeSection === 'vision_mission' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              B. Visi, Misi, dan Tujuan SMA Negeri 1 Kakas
            </h3>
            <p className="text-xs text-slate-500">
              Diselaraskan dengan 8 Dimensi Profil Lulusan & 7 Kebiasaan Anak Indonesia Hebat.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                VISI SATUAN PENDIDIKAN
              </span>
              <p className="text-sm sm:text-base font-serif font-bold italic leading-relaxed">
                "{kspData.vision}"
              </p>
            </div>

            <div>
              <span className="block font-bold text-slate-800 mb-2">
                Misi SMA Negeri 1 Kakas:
              </span>
              <div className="space-y-2">
                {kspData.missions.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 leading-relaxed font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ORGANIZATION */}
      {activeSection === 'organization' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              C. Pengorganisasian Pembelajaran (Kurikulum Merdeka)
            </h3>
            <p className="text-xs text-slate-500">
              Struktur alokasi waktu Intrakurikuler, Kokurikuler (P5), dan Ekstrakurikuler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-800" />
                Fase E (Kelas X)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Fase fondasi SMA di mana seluruh peserta didik mengikuti kelompok mata pelajaran umum yang sama, bertujuan memberikan wawasan luas sebelum memilih pendalaman di Fase F.
              </p>
              <div className="bg-slate-50 p-3 rounded-md space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Beban Intrakurikuler:</span>
                  <span className="font-bold text-slate-900">38 Jam / Minggu</span>
                </div>
                <div className="flex justify-between">
                  <span>Beban Kokurikuler (P5):</span>
                  <span className="font-bold text-amber-800">8 Jam / Minggu (30%)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span>Total Jam Belajar:</span>
                  <span className="font-bold text-blue-900">46 Jam / Minggu</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-800" />
                Fase F (Kelas XI dan XII)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Fase peminatan dan penjurusan karier/perguruan tinggi. Terdiri atas Mata Pelajaran Umum (Wajib) ditambah 4-5 Mata Pelajaran Pilihan (Saintek / Soshum) sesuai bakat minat peserta didik.
              </p>
              <div className="bg-slate-50 p-3 rounded-md space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Mapel Umum Wajib:</span>
                  <span className="font-bold text-slate-900">18 Jam / Minggu</span>
                </div>
                <div className="flex justify-between">
                  <span>Mapel Pilihan Terpilih:</span>
                  <span className="font-bold text-slate-900">20 - 25 Jam / Minggu</span>
                </div>
                <div className="flex justify-between">
                  <span>Beban Kokurikuler (P5):</span>
                  <span className="font-bold text-amber-800">6 Jam / Minggu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: P5 THEMES */}
      {activeSection === 'p5_structure' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              D. Projek Penguatan Profil Pelajar Pancasila (P5) TP {activeAcademicYear.year}
            </h3>
            <p className="text-xs text-slate-500">
              Tema-tema pilihan kontekstual dengan isu kearifan lokal Minahasa dan kelestarian ekosistem Danau Tondano-Kakas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {kspData.p5Themes.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                  {item.phase}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{item.theme}</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Topik Modul:</strong> "{item.topic}"
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Alokasi Waktu: {item.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: VALIDATION SHEET */}
      {activeSection === 'validation' && (
        <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
          <KopSurat />

          <div className="text-center my-6 space-y-1">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 underline tracking-wide">
              LEMBAR PENGESAHAN DOKUMEN KURIKULUM SATUAN PENDIDIKAN (KSP)
            </h3>
            <div className="text-xs font-serif text-slate-700">
              SEKOLAH MENENGAH ATAS NEGERI 1 KAKAS TAHUN PELAJARAN {activeAcademicYear.year}
            </div>
          </div>

          <p className="text-xs text-justify leading-relaxed mb-6 font-serif">
            Setelah melalui proses penyusunan, telaah, dan verifikasi bersama oleh Tim Pengembang Kurikulum SMA Negeri 1 Kakas, Komite Sekolah, dan Pengawas Pembina Dinas Pendidikan Daerah Provinsi Sulawesi Utara, maka dengan ini Dokumen Kurikulum Satuan Pendidikan (KSP) SMA Negeri 1 Kakas Tahun Pelajaran {activeAcademicYear.year} disahkan dan dinyatakan berlaku sebagai pedoman penyelenggaraan pembelajaran.
          </p>

          <div className="grid grid-cols-2 gap-8 text-xs font-serif pt-4 mb-8">
            <div className="text-center space-y-16">
              <div>
                Menyetujui,<br />
                Ketua Komite SMA Negeri 1 Kakas,
              </div>
              <div>
                <div className="font-bold underline uppercase">Fentje Manoppo</div>
                <div className="text-[10px] text-slate-600">Tokoh Masyarakat Kakas</div>
              </div>
            </div>

            <div className="text-center space-y-16">
              <div>
                Ditetapkan di : Kakas<br />
                Pada tanggal : 10 Juli 2026<br />
                Kepala SMA Negeri 1 Kakas,
              </div>
              <div>
                <div className="font-bold underline uppercase">{schoolProfile.principalName}</div>
                <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.principalNip}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-6 text-center text-xs font-serif space-y-16">
            <div>
              Mengetahui dan Mengesahkan :<br />
              Kepala Cabang Dinas Pendidikan Wilayah Tomohon - Minahasa<br />
              Dinas Pendidikan Daerah Provinsi Sulawesi Utara
            </div>
            <div>
              <div className="font-bold underline uppercase">Drs. Fredy Kumeang, M.Pd.</div>
              <div className="text-[10px] font-mono text-slate-700">Pembina Utama Muda / IV c · NIP. 19690115 199412 1 002</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
