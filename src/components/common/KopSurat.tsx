import React from 'react';
import { useApp } from '../../context/AppContext';

export const KopSurat: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  const { schoolProfile } = useApp();

  return (
    <div className="border-b-[3px] border-slate-900 pb-3 mb-6 font-serif">
      <div className="flex items-center justify-between gap-4">
        {/* Logo Lambang Tut Wuri Handayani / Sulut */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-slate-800 rounded-lg p-1 bg-blue-50/50">
          <div className="text-center">
            <div className="text-[10px] font-bold tracking-tight text-blue-900">TUT WURI</div>
            <div className="text-sm font-extrabold text-amber-700">HANDAYANI</div>
            <div className="text-[9px] text-slate-600">SMAN 1 KKS</div>
          </div>
        </div>

        {/* Text Kop Surat Resmi */}
        <div className="text-center flex-1">
          <h4 className="text-sm tracking-wider font-bold text-slate-800 uppercase font-sans">
            {schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA'}
          </h4>
          <h3 className="text-base tracking-wide font-extrabold text-slate-900 uppercase font-sans">
            {schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH'}
          </h3>
          <h5 className="text-xs font-semibold text-slate-700 uppercase font-sans">
            {schoolProfile.cabangDinas || 'CABANG DINAS PENDIDIKAN WILAYAH TOMOHON - MINAHASA'}
          </h5>
          <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest mt-1 font-sans">
            {schoolProfile.name}
          </h2>
          <p className="text-[11px] text-slate-600 mt-0.5 font-sans leading-tight">
            {schoolProfile.address} · NPSN: {schoolProfile.npsn} · Kontak: {schoolProfile.phone} · Surel: {schoolProfile.email}
          </p>
        </div>

        {/* Logo Sekolah SMAN 1 Kakas */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-amber-600 rounded-lg p-1 bg-amber-50/40">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-800">KUSAKA</div>
            <div className="text-xs font-black text-blue-900">SMAN 1</div>
            <div className="text-[9px] font-semibold text-amber-700">KAKAS</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-900 mt-2"></div>
      {subtitle && (
        <div className="text-center text-xs font-sans text-slate-500 mt-1 italic">
          {subtitle}
        </div>
      )}
    </div>
  );
};
