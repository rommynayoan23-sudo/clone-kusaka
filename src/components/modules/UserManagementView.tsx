import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  History,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Key,
  Shield,
  Eye,
  Plus,
  X
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, currentUser, setCurrentUser, auditLogs, schoolProfile, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'roles_matrix' | 'audit_logs'>('users');

  const roleMatrix = [
    { module: 'Profil Sekolah & Legalitas', admin: 'Penuh', kepsek: 'Setujui', waka: 'Penuh', staff: 'Lihat', guru: 'Lihat' },
    { module: 'Tahun Pelajaran & Semester', admin: 'Penuh', kepsek: 'Setujui', waka: 'Penuh', staff: 'Lihat', guru: 'Lihat' },
    { module: 'Data Induk Guru & Mapel', admin: 'Penuh', kepsek: 'Lihat', waka: 'Penuh', staff: 'Penuh', guru: 'Lihat' },
    { module: 'Dokumen KSP Kurikulum', admin: 'Penuh', kepsek: 'Sah / Tanda Tangan', waka: 'Susun / Kelola', staff: 'Draf', guru: 'Lihat' },
    { module: 'Pembagian Tugas Mengajar', admin: 'Penuh', kepsek: 'Tetapkan SK', waka: 'Hitung & Susun', staff: 'Bantu Input', guru: 'Lihat Beban' },
    { module: 'Jadwal Pelajaran Bebas Benturan', admin: 'Penuh', kepsek: 'Setujui', waka: 'Penuh', staff: 'Penuh', guru: 'Lihat Jadwal' },
    { module: 'Supervisi Akademik', admin: 'Penuh', kepsek: 'Nilai & Observasi', waka: 'Dampingi & Nilai', staff: 'Jadwalkan', guru: 'Refleksi Diri' },
    { module: 'Penerbitan SK & Naskah Dinas', admin: 'Penuh', kepsek: 'Tanda Tangan', waka: 'Draf & Kelola', staff: 'Draf', guru: 'Lihat' },
    { module: 'Arsip Digital & Unduhan', admin: 'Penuh', kepsek: 'Akses Penuh', waka: 'Akses Penuh', staff: 'Unggah / Unduh', guru: 'Unduh Terbuka' },
    { module: 'Pengaturan Sistem & Cadangan', admin: 'Penuh', kepsek: 'Lihat Status', waka: 'Ekspor Cadangan', staff: 'Dibatasi', guru: 'Dibatasi' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span>MANAJEMEN PENGGUNA, OTORISASI & AUDIT LOG</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Hak Akses Berbasis Peran (RBAC) & Keamanan
          </h2>
          <p className="text-xs text-slate-500">
            Pemisahan wewenang antara Kepala Sekolah, Waka Kurikulum, Staf, dan Guru sesuai tata kelola naskah dinas.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Akun Pengguna Terdaftar ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('roles_matrix')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'roles_matrix'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Matriks Otorisasi Hak Akses (RBAC)
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'audit_logs'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Catatan Jejak Aktivitas (Audit Log) ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-10">No</th>
                  <th className="p-3">Nama Pengguna</th>
                  <th className="p-3">NIP / Identitas</th>
                  <th className="p-3">Surel (Email)</th>
                  <th className="p-3">Peran (Role)</th>
                  <th className="p-3 text-center">Status Sesi</th>
                  <th className="p-3 text-right">Simulasi Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{u.roleTitle}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.nip || '-'}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'principal' ? 'bg-purple-100 text-purple-900' :
                        u.role === 'vice_curriculum' ? 'bg-blue-100 text-blue-900' :
                        u.role === 'admin' ? 'bg-slate-800 text-amber-300' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {currentUser.id === u.id ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sedang Masuk
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Siap</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {currentUser.id !== u.id ? (
                        <button
                          onClick={() => setCurrentUser(u.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                        >
                          Beralih ke Akun Ini
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Akun Aktif</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'roles_matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            Matriks wewenang operasi sistem KuSaKA untuk menjamin akuntabilitas dokumen resmi dan kepatuhan tata kelola sekolah.
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3">Modul & Fungsi Sistem</th>
                <th className="p-3 text-center">Administrator</th>
                <th className="p-3 text-center">Kepala Sekolah</th>
                <th className="p-3 text-center">Wakasek Kurikulum</th>
                <th className="p-3 text-center">Staf Kurikulum</th>
                <th className="p-3 text-center">Guru Mapel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roleMatrix.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">{m.module}</td>
                  <td className="p-3 text-center font-medium text-slate-800">{m.admin}</td>
                  <td className="p-3 text-center font-bold text-purple-900">{m.kepsek}</td>
                  <td className="p-3 text-center font-bold text-blue-900">{m.waka}</td>
                  <td className="p-3 text-center font-medium text-slate-700">{m.staff}</td>
                  <td className="p-3 text-center font-medium text-slate-600">{m.guru}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Rekam jejak setiap tindakan perubahan data untuk akuntabilitas dan audit internal sekolah.</span>
            <span className="font-mono text-slate-500 font-semibold">{auditLogs.length} Entri Log</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {log.action} · <span className="text-blue-900 font-semibold">{log.targetEntity}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  <div className="text-[10px] text-slate-400">
                    Oleh: <strong className="text-slate-700">{log.userName}</strong> ({log.userRole})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
