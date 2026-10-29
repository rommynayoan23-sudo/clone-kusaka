import React from 'react';
import { useApp } from '../../context/AppContext';

export const KopSurat: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  const { schoolProfile } = useApp();

  return (
    <div className="border-b-[3px] border-slate-900 pb-3 mb-6 font-serif">
      <div className="flex items-center justify-between gap-4">
        {/* Logo Provinsi Sulawesi Utara (Kiri) */}
        <div className="w-20 h-24 flex-shrink-0 flex items-center justify-center">
          <img
            src="/assets/aistudio/logo_provinsi_c9769acf.png"
            alt="Logo Pemerintah Provinsi Sulawesi Utara"
            className="w-full h-full object-contain drop-shadow-xs"
          />
        </div>

        {/* Text Kop Surat Resmi */}
        <div className="text-center flex-1 px-2">
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

        {/* Logo SMA Negeri 1 Kakas (Kanan) */}
        <div className="w-20 h-24 flex-shrink-0 flex items-center justify-center">
          <img
            src="/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"
            alt="Logo SMA Negeri 1 Kakas"
            className="w-full h-full object-contain drop-shadow-xs"
          />
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
