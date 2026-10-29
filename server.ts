import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: 'KuSaKA - SMA Negeri 1 Kakas',
  });
});

/**
 * AI Report & Document Generator Endpoint
 * Strictly grounded on stored school data, flags missing data, avoids hallucination
 */
app.post('/api/gemini/generate-report', async (req: Request, res: Response) => {
  try {
    const { reportType, period, contextData, userPrompt, customNotes } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        isFallback: true,
        message: 'GEMINI_API_KEY belum dikonfigurasi di secrets. Menggunakan mode analisis terstruktur lokal.',
      });
    }

    const systemInstruction = `Anda adalah KuSaKA AI Intelligence Engine, asisten resmi kurikulum SMA Negeri 1 Kakas, Minahasa, Sulawesi Utara (dipimpin oleh Kepala Sekolah Moreine Elmaja Pangalila dan Wakasek Kurikulum Rommy Senfrie Najoan, S.Pd.).

PRINSIP KETAT GENERATOR LAPORAN & DOKUMEN RESMI (ZERO HALLUCINATION):
1. HANYA gunakan fakta, angka, nama guru, mata pelajaran, rombel, dan data supervisi yang secara eksplisit diberikan dalam CONTEXT DATA.
2. DILARANG KERAS mengarang fakta, dasar hukum fiktif, angka nilai yang belum ada, atau kesimpulan supervisi yang tidak tercatat.
3. JIKA ADA DATA YANG BELUM LENGKAP ATAU KOSONG: Anda WAJIB secara tegas mencantumkan bagian khusus "[DATA BELUM LENGKAP / PERLU DILENGKAPI]" dan merinci data apa saja yang belum terisi di basis data (misalnya: guru yang belum dinilai supervisi, program kerja yang belum terisi realisasi fisiknya, atau alokasi jam yang masih defisit).
4. DASAR HUKUM RESMI SMAN 1 KAKAS:
   - UU No. 20 Tahun 2003 tentang Sistem Pendidikan Nasional
   - UU No. 14 Tahun 2005 tentang Guru dan Dosen
   - Permendikbudristek No. 12 Tahun 2024 tentang Kurikulum pada PAUD, Dikdas, dan Dikmen (Kurikulum Merdeka)
   - Permendikbud No. 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah (Minimal 24 JJM)
   - Kepmendikbudristek No. 262/M/2022 tentang Perubahan atas Kepmendikbudristek No. 56/M/2022
5. Format bahasa: Bahasa Indonesia baku, formal kedinasan, elegan, sistematis dengan penomoran bab yang jelas dan siap dipublikasikan/dicetak sebagai dokumen dinas resmi.`;

    const promptText = `TUGAS: Susun ${reportType} untuk periode ${period} SMA Negeri 1 Kakas.

KONTEKS DATA INDUK AKTUAL DARI DATABASE KUSAKA:
${JSON.stringify(contextData, null, 2)}

CATATAN KHUSUS / PETUNJUK TAMBAHAN:
${customNotes || userPrompt || 'Susun laporan formal menyeluruh berdasarkan data di atas dengan transparansi sumber data dan inventarisasi data yang belum lengkap.'}

FORMAT KELUARAN YANG DIWAJIBKAN:
I. IDENTITAS LAPORAN & KOP DINAS
II. DASAR HUKUM RESMI (Gunakan hanya regulasi valid Kurikulum Merdeka)
III. SUMBER DATA INDUK TERKAIT (Sebutkan modul asal data di KuSaKA)
IV. PAPARAN DATA FAKTUAL & ANALISIS KINERJA (Rinci angka nyata: guru, rombel, alokasi jam, supervisi, kalender)
V. INVENTARISASI DATA BELUM LENGKAP / TERTUNDA (Rinci tegas apa saja yang belum terisi di database)
VI. KESIMPULAN & REKOMENDASI TINDAK LANJUT BERBASIS DATA
VII. PENGESAHAN DOKUMEN (Kepala Sekolah & Wakasek Kurikulum)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high precision and zero hallucination
      },
    });

    const outputText = response.text || '';

    return res.json({
      success: true,
      isFallback: false,
      text: outputText,
    });
  } catch (error: any) {
    console.error('Error generating AI report:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses dokumen dengan AI',
    });
  }
});

/**
 * Start Server with Vite Middlewares in Development
 */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KuSaKA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
