import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KopSurat } from '../common/KopSurat';
import { School, Save, RotateCcw, CheckCircle2, ShieldCheck, FileText, Building2, UserCheck } from 'lucide-react';

export const SchoolProfileView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, currentUser } = useApp();
  const [formData, setFormData] = useState(schoolProfile);
  const [activeTab, setActiveTab] = useState<'profile' | 'officials' | 'kop_format' | 'preview'>('profile');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
  };

  const handleReset = () => {
    setFormData(schoolProfile);
  };

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'principal';

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <School className="w-4 h-4 text-blue-800" />
            <span>PENGATURAN IDENTITAS RESMI LEMBAGA</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            {schoolProfile.name}
          </h2>
          <p className="text-xs text-slate-500">
            Kecamatan {schoolProfile.subdistrict}, Kabupaten {schoolProfile.regency}, Provinsi {schoolProfile.province} · NPSN: {schoolProfile.npsn}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Identitas</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Akses Baca Saja</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Identitas Pokok & Alamat
        </button>
        <button
          onClick={() => setActiveTab('officials')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'officials'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Pejabat & Penandatangan
        </button>
        <button
          onClick={() => setActiveTab('kop_format')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'kop_format'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Format Kop & Nomor Surat
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'preview'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          4. Pratinjau Kop Surat Resmi
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Data Satuan Pendidikan (Dinas Pendidikan Daerah Prov. Sulut)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Sekolah *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Pokok Sekolah Nasional (NPSN) *
                </label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan *
                </label>
                <input
                  type="text"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kabupaten *
                </label>
                <input
                  type="text"
                  name="regency"
                  value={formData.regency}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provinsi *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!canEdit}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / Kontak
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surel Resmi (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Akreditasi
                </label>
                <input
                  type="text"
                  name="accreditation"
                  value={formData.accreditation}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kurikulum Diterapkan
                </label>
                <input
                  type="text"
                  name="curriculumType"
                  value={formData.curriculumType}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden disabled:bg-slate-50 font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'officials' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Pejabat Penandatangan Dokumen Resmi Kurikulum
            </h3>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-4">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-800" />
                Data Kepala Sekolah
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Kepala Sekolah *
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleChange}
                    disabled={!canEdit}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    name="principalNip"
                    value={formData.principalNip}
                    onChange={handleChange}
                    disabled={!canEdit}
                    placeholder="Kosongkan jika belum tersedia"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan Ruang
                  </label>
                  <input
                    type="text"
                    name="principalRank"
                    value={formData.principalRank}
                    onChange={handleChange}
                    disabled={!canEdit}
                    placeholder="misal: Pembina Tk. I / IV b"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-4">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-800" />
                Data Wakil Kepala Sekolah Bidang Kurikulum
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Waka Kurikulum *
                  </label>
                  <input
                    type="text"
                    name="viceCurriculumName"
                    value={formData.viceCurriculumName}
                    onChange={handleChange}
                    disabled={!canEdit}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Waka Kurikulum
                  </label>
                  <input
                    type="text"
                    name="viceCurriculumNip"
                    value={formData.viceCurriculumNip}
                    onChange={handleChange}
                    disabled={!canEdit}
                    placeholder="Kosongkan jika belum tersedia"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan Ruang
                  </label>
                  <input
                    type="text"
                    name="viceCurriculumRank"
                    value={formData.viceCurriculumRank}
                    onChange={handleChange}
                    disabled={!canEdit}
                    placeholder="misal: Penata Tk. I / III d"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kop_format' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Tata Naskah Dinas & Format Kop Surat
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Instansi Atas (Baris 1) *
                </label>
                <input
                  type="text"
                  name="dinasProvinsi"
                  value={formData.dinasProvinsi}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 uppercase font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dinas Pendidikan (Baris 2) *
                </label>
                <input
                  type="text"
                  name="dinasPendidikan"
                  value={formData.dinasPendidikan}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 uppercase font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cabang Dinas / Wilayah Kerja (Baris 3) *
                </label>
                <input
                  type="text"
                  name="cabangDinas"
                  value={formData.cabangDinas}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 uppercase font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Awalan Format Nomor Surat Resmi
                </label>
                <input
                  type="text"
                  name="letterNumberPrefix"
                  value={formData.letterNumberPrefix}
                  onChange={handleChange}
                  disabled={!canEdit}
                  placeholder="misal: 421/SMAN1-KKS/"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Standar kode klasifikasi 421 untuk urusan pendidikan SMA.
                </span>
              </div>

              {/* Logo Resmi Aktif */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Logo Resmi Kepala Naskah Dinas Terpasang
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <img
                      src="/assets/aistudio/logo_provinsi_c9769acf.png"
                      alt="Logo Provinsi Sulawesi Utara"
                      className="w-12 h-14 object-contain flex-shrink-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Sisi Kiri: Logo Provinsi</div>
                      <div className="text-[11px] text-slate-500">Pemerintah Provinsi Sulawesi Utara</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"
                      alt="Logo SMA Negeri 1 Kakas"
                      className="w-12 h-14 object-contain flex-shrink-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Sisi Kanan: Logo Sekolah</div>
                      <div className="text-[11px] text-slate-500">SMA Negeri 1 Kakas (09/11/1983)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau KOP SURAT Resmi SMA Negeri 1 Kakas
              </span>
              <span className="text-[11px] text-slate-400">
                Sesuai standar Permendagri / Tata Naskah Dinas Pendidikan Sulut
              </span>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm max-w-4xl mx-auto">
              <KopSurat subtitle="Pratinjau Tata Letak Kepala Naskah Dinas Resmi" />

              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                [ Area Badan Dokumen Resmi: SK Kepala Sekolah / Surat Tugas / Berita Acara ]
              </div>

              <div className="mt-8 flex justify-end">
                <div className="text-center w-64 space-y-12">
                  <div className="text-xs text-slate-700">
                    Kakas, ......................... 2026<br />
                    Kepala SMA Negeri 1 Kakas,
                  </div>
                  <div className="pt-8">
                    <div className="font-bold text-xs underline text-slate-900 uppercase">
                      {formData.principalName || '(Nama Kepala Sekolah)'}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      NIP. {formData.principalNip || '....................................'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {canEdit && activeTab !== 'preview' && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Simpan Identitas
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
