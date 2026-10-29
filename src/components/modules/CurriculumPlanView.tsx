import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, CheckCircle2, BookOpenCheck, Target, HeartHandshake, Sparkles } from 'lucide-react';

export const CurriculumPlanView: React.FC = () => {
  const { schoolProfile, activeAcademicYear, setActiveMenu } = useApp();

  const profilLulusan = [
    { no: 1, title: 'Keimanan dan Ketakwaan kepada Tuhan YME', desc: 'Memiliki integritas moral, spiritual, dan budi pekerti luhur dalam kehidupan harian.' },
    { no: 2, title: 'Kewargaan dan Kebangsaan', desc: 'Mencintai tanah air, menjunjung tinggi persatuan, dan menghargai keragaman bangsa.' },
    { no: 3, title: 'Penalaran Kritis dan Pemecahan Masalah', desc: 'Mampu menganalisis informasi secara objektif dan memecahkan tantangan riil.' },
    { no: 4, title: 'Kreativitas dan Inovasi', desc: 'Menghasilkan gagasan orisinal, karya aplikatif, dan solusi bernilai tambah.' },
    { no: 5, title: 'Kolaborasi dan Gotong Royong (Mapalus)', desc: 'Mampu bekerja sama, berempati, dan berkontribusi aktif dalam masyarakat.' },
    { no: 6, title: 'Kemandirian dan Regulasi Diri', desc: 'Bertanggung jawab atas proses dan hasil belajarnya secara percaya diri.' },
    { no: 7, title: 'Komunikasi Efektif dan Literasi Multimodal', desc: 'Mampu menyampaikan ide secara lisan dan tulisan dalam berbagai konteks.' },
    { no: 8, title: 'Kepedulian Lingkungan dan Keberlanjutan', desc: 'Aktif menjaga kelestarian ekosistem danau, darat, dan laut di Minahasa.' }
  ];

  const tujuhKebiasaan = [
    'Bangun Pagi dan Menyiapkan Diri dengan Disiplin',
    'Beribadah dan Mengucap Syukur',
    'Membaca Buku dan Literasi Informasi Setiap Hari',
    'Berolahraga dan Menjaga Pola Hidup Sehat',
    'Makan Makanan Bergizi dan Bersih',
    'Gemar Membantu Orang Tua dan Masyarakat (Mapalus)',
    'Tidur Tepat Waktu untuk Pemulihan Fisik dan Mental'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-blue-800" />
            <span>PONDASI PERENCANAAN PEMBELAJARAN MENDALAM</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kerangka Kurikulum & Dimensi Kelulusan
          </h2>
          <p className="text-xs text-slate-500">
            SMA Negeri 1 Kakas · Harmonisasi 8 Dimensi Profil Lulusan & 7 Kebiasaan Anak Indonesia Hebat
          </p>
        </div>

        <button
          onClick={() => setActiveMenu('curriculum_ksp')}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>Buka Dokumen KSP Lengkap</span>
        </button>
      </div>

      {/* Grid: 8 Dimensi & 7 Kebiasaan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8 Dimensi Profil Lulusan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-800" />
                8 Dimensi Profil Lulusan SMAN 1 Kakas
              </h3>
              <p className="text-xs text-slate-500">Karakter dan kompetensi utuh yang ditumbuhkembangkan</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              Fase E & F
            </span>
          </div>

          <div className="space-y-2.5">
            {profilLulusan.map(item => (
              <div key={item.no} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-amber-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    {item.no}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 pl-7 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7 Kebiasaan Anak Indonesia Hebat & Pendekatan Deep Learning */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                7 Kebiasaan Anak Indonesia Hebat (Habituasi Sekolah)
              </h3>
              <p className="text-xs text-slate-500">Kebiasaan harian yang dipantau dalam jurnal pembiasaan</p>
            </div>

            <div className="space-y-2">
              {tujuhKebiasaan.map((kebiasaan, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-amber-50/30 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{kebiasaan}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Learning Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-xl border border-blue-900/50 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Pendekatan Pembelajaran Mendalam (Deep Learning)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Di SMA Negeri 1 Kakas, pembelajaran dirancang bergerak melampaui hafalan semata: menghubungkan konsep dengan kearifan alam Danau Tondano, melatih siswa berpikir tingkat tinggi (HOTS), serta memberikan ruang refleksi dan aplikasi nyata bagi kemaslahatan masyarakat sekitar Kakas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
