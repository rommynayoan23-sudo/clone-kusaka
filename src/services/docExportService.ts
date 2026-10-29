// KuSaKA Document Export Service
// Real DOCX and PDF file generation for official school decrees, assignments, and minutes
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Packer } from 'docx';
import jsPDF from 'jspdf';
import { OfficialDocument, SchoolProfile } from '../types';

export const DocExportService = {
  /**
   * Generates a genuine .docx file using Office Open XML standard
   */
  async exportToDocx(doc: OfficialDocument, schoolProfile: SchoolProfile): Promise<void> {
    const isSk = doc.documentType === 'sk_kepala_sekolah';
    const isSuratTugas = doc.documentType === 'surat_tugas';
    const isUndangan = doc.documentType === 'surat_undangan';
    const isBeritaAcara = doc.documentType === 'berita_acara';
    const isNotulen = doc.documentType === 'notulen_rapat';

    const content = doc.content || {};

    const children: (Paragraph | Table)[] = [];

    // 1. KOP SURAT (Heading text)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA',
            bold: true,
            size: 20, // 10pt
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH',
            bold: true,
            size: 22, // 11pt
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: schoolProfile.cabangDinas || 'CABANG DINAS PENDIDIKAN WILAYAH TOMOHON - MINAHASA',
            bold: true,
            size: 18, // 9pt
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: schoolProfile.name.toUpperCase(),
            bold: true,
            size: 26, // 13pt
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: '000000',
            space: 4,
            style: BorderStyle.DOUBLE,
            size: 12
          }
        },
        children: [
          new TextRun({
            text: `${schoolProfile.address} · NPSN: ${schoolProfile.npsn} · Kontak: ${schoolProfile.phone} · Surel: ${schoolProfile.email}`,
            size: 16, // 8pt
            font: 'Arial'
          })
        ]
      })
    );

    // 2. DOCUMENT TITLE & NUMBER
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 60 },
        children: [
          new TextRun({
            text: doc.title.toUpperCase(),
            bold: true,
            underline: {},
            size: 22,
            font: 'Times New Roman'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `NOMOR : ${doc.documentNumber}`,
            bold: true,
            size: 20,
            font: 'Times New Roman'
          })
        ]
      })
    );

    // 3. BODY CONTENT DEPENDING ON DOCUMENT TYPE
    if (isSk) {
      // Konsiderans Menimbang
      if (Array.isArray(content.menimbang) && content.menimbang.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({ text: 'Menimbang :', bold: true, size: 20, font: 'Times New Roman' })
            ]
          })
        );
        content.menimbang.forEach((item: string, idx: number) => {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${String.fromCharCode(97 + idx)}.  ${item}`, size: 20, font: 'Times New Roman' })
              ]
            })
          );
        });
      }

      // Konsiderans Mengingat
      if (Array.isArray(content.mengingat) && content.mengingat.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({ text: 'Mengingat :', bold: true, size: 20, font: 'Times New Roman' })
            ]
          })
        );
        content.mengingat.forEach((item: string, idx: number) => {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${idx + 1}.  ${item}`, size: 20, font: 'Times New Roman' })
              ]
            })
          );
        });
      }

      // Diktum Memutuskan
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 180, after: 120 },
          children: [
            new TextRun({ text: 'MEMUTUSKAN :', bold: true, size: 22, font: 'Times New Roman' })
          ]
        })
      );

      if (Array.isArray(content.memutuskan) && content.memutuskan.length > 0) {
        content.memutuskan.forEach((item: string, idx: number) => {
          const prefix = idx === 0 ? 'KESATU' : idx === 1 ? 'KEDUA' : idx === 2 ? 'KETIGA' : `KE-${idx + 1}`;
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: `${prefix} : `, bold: true, size: 20, font: 'Times New Roman' }),
                new TextRun({ text: item, size: 20, font: 'Times New Roman' })
              ]
            })
          );
        });
      }
    } else if (isSuratTugas) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: 'Yang bertanda tangan di bawah ini:', size: 20, font: 'Times New Roman' })
          ]
        }),
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: `Nama       : ${doc.signatoryName}\n`, bold: true, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: `NIP        : ${doc.signatoryNip || '-'}\n`, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: `Jabatan    : ${doc.signatoryTitle}\n`, size: 20, font: 'Times New Roman' }),
            new TextRun({ text: `Unit Kerja : ${schoolProfile.name}`, size: 20, font: 'Times New Roman' })
          ]
        }),
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [
            new TextRun({ text: 'Dengan ini memberikan tugas kepada:', size: 20, font: 'Times New Roman' })
          ]
        })
      );

      if (Array.isArray(content.assignedTeachers) && content.assignedTeachers.length > 0) {
        content.assignedTeachers.forEach((tch: any, idx: number) => {
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${idx + 1}. ${tch.name} (NIP: ${tch.nip || '-'}) - Tugas: ${tch.role || 'Pengawas'}`, size: 20, font: 'Times New Roman' })
              ]
            })
          );
        });
      }

      children.push(
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [
            new TextRun({ text: `Untuk : ${content.purpose || doc.title}`, size: 20, font: 'Times New Roman' })
          ]
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `Waktu Pelaksanaan : ${content.schedule || doc.date}`, size: 20, font: 'Times New Roman' })
          ]
        }),
        new Paragraph({
          spacing: { before: 120, after: 180 },
          children: [
            new TextRun({ text: 'Demikian surat tugas ini dibuat untuk dilaksanakan dengan sebaik-baiknya dan penuh rasa tanggung jawab.', size: 20, font: 'Times New Roman' })
          ]
        })
      );
    } else {
      // General Document / Berita Acara / Notulen
      if (content.hariTanggal) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `Hari / Tanggal : ${content.hariTanggal}`, size: 20, font: 'Times New Roman' })
            ]
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `Waktu          : ${content.waktu || '09.00 WITA - Selesai'}`, size: 20, font: 'Times New Roman' })
            ]
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `Tempat         : ${content.tempat || 'SMA Negeri 1 Kakas'}`, size: 20, font: 'Times New Roman' })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: `Agenda / Acara : ${content.agenda || doc.title}`, bold: true, size: 20, font: 'Times New Roman' })
            ]
          })
        );
      }

      if (content.text || content.hasilRapat) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: content.text || content.hasilRapat, size: 20, font: 'Times New Roman' })
            ]
          })
        );
      }
    }

    // 4. SIGNATURE BLOCK (TABLE WITH 2 COLUMNS)
    children.push(
      new Paragraph({ spacing: { before: 240 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Mengetahui,\n', size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: `${schoolProfile.viceCurriculumName ? 'Wakil Kepala Sekolah Bidang Kurikulum,' : ''}\n\n\n\n\n`, size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: schoolProfile.viceCurriculumName || '', bold: true, underline: {}, size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: `\nNIP. ${schoolProfile.viceCurriculumNip || '-'}`, size: 18, font: 'Times New Roman' })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Ditetapkan di : Kakas\nPada tanggal  : ${doc.date}\n`, size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: `${doc.signatoryTitle} SMA Negeri 1 Kakas,\n\n\n\n\n`, size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: doc.signatoryName, bold: true, underline: {}, size: 20, font: 'Times New Roman' }),
                      new TextRun({ text: `\nNIP. ${doc.signatoryNip || '-'}`, size: 18, font: 'Times New Roman' })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    );

    const docx = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440
              }
            }
          },
          children
        }
      ]
    });

    const blob = await Packer.toBlob(docx);
    const filename = `${doc.documentType.toUpperCase()}-${doc.documentNumber.replace(/[\/\\]/g, '_')}.docx`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Generates a genuine .pdf file using jsPDF
   */
  exportToPdf(doc: OfficialDocument, schoolProfile: SchoolProfile): void {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header Dinas
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA', pageWidth / 2, y, { align: 'center' });
    y += 5;
    pdf.setFontSize(11);
    pdf.text(schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH', pageWidth / 2, y, { align: 'center' });
    y += 5;
    pdf.setFontSize(9);
    pdf.text(schoolProfile.cabangDinas || 'CABANG DINAS PENDIDIKAN WILAYAH TOMOHON - MINAHASA', pageWidth / 2, y, { align: 'center' });
    y += 5;
    pdf.setFontSize(13);
    pdf.text(schoolProfile.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text(`${schoolProfile.address} · NPSN: ${schoolProfile.npsn} · Kontak: ${schoolProfile.phone}`, pageWidth / 2, y, { align: 'center' });
    y += 3;

    // Double Rule Under Kop
    pdf.setLineWidth(0.6);
    pdf.line(margin, y, pageWidth - margin, y);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + 0.8, pageWidth - margin, y + 0.8);
    y += 8;

    // Document Title & Number
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    const splitTitle = pdf.splitTextToSize(doc.title.toUpperCase(), contentWidth);
    pdf.text(splitTitle, pageWidth / 2, y, { align: 'center' });
    y += splitTitle.length * 5 + 1;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.text(`NOMOR : ${doc.documentNumber}`, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Content Body
    pdf.setFontSize(9.5);
    const content = doc.content || {};

    if (doc.documentType === 'sk_kepala_sekolah') {
      if (Array.isArray(content.menimbang) && content.menimbang.length > 0) {
        pdf.setFont('times', 'bold');
        pdf.text('Menimbang :', margin, y);
        pdf.setFont('times', 'normal');
        y += 5;

        content.menimbang.forEach((item: string, idx: number) => {
          const char = String.fromCharCode(97 + idx);
          const lines = pdf.splitTextToSize(`${char}.  ${item}`, contentWidth - 8);
          pdf.text(lines, margin + 8, y);
          y += lines.length * 4.5 + 1;
        });
        y += 3;
      }

      if (Array.isArray(content.mengingat) && content.mengingat.length > 0) {
        pdf.setFont('times', 'bold');
        pdf.text('Mengingat :', margin, y);
        pdf.setFont('times', 'normal');
        y += 5;

        content.mengingat.forEach((item: string, idx: number) => {
          const lines = pdf.splitTextToSize(`${idx + 1}.  ${item}`, contentWidth - 8);
          pdf.text(lines, margin + 8, y);
          y += lines.length * 4.5 + 1;
        });
        y += 4;
      }

      pdf.setFont('times', 'bold');
      pdf.text('MEMUTUSKAN :', pageWidth / 2, y, { align: 'center' });
      y += 6;

      if (Array.isArray(content.memutuskan) && content.memutuskan.length > 0) {
        content.memutuskan.forEach((item: string, idx: number) => {
          const prefix = idx === 0 ? 'KESATU' : idx === 1 ? 'KEDUA' : idx === 2 ? 'KETIGA' : `KE-${idx + 1}`;
          pdf.setFont('times', 'bold');
          pdf.text(`${prefix} :`, margin, y);
          pdf.setFont('times', 'normal');
          const lines = pdf.splitTextToSize(item, contentWidth - 22);
          pdf.text(lines, margin + 22, y);
          y += lines.length * 4.5 + 2;
        });
      }
    } else {
      // General content
      const textToRender = content.text || content.purpose || content.hasilRapat || 'Dokumen resmi terverifikasi SMA Negeri 1 Kakas.';
      const lines = pdf.splitTextToSize(textToRender, contentWidth);
      pdf.text(lines, margin, y);
      y += lines.length * 5 + 6;
    }

    // Check page overflow before signature
    if (y > 230) {
      pdf.addPage();
      y = 30;
    }

    // Signatures
    y += 10;
    const colRightX = pageWidth - margin - 65;

    pdf.setFont('times', 'normal');
    pdf.text(`Ditetapkan di : Kakas`, colRightX, y);
    y += 4.5;
    pdf.text(`Pada tanggal  : ${doc.date}`, colRightX, y);
    y += 5;
    pdf.text(`${doc.signatoryTitle} SMA Negeri 1 Kakas,`, colRightX, y);
    y += 24;
    pdf.setFont('times', 'bold');
    pdf.text(doc.signatoryName, colRightX, y);
    y += 4.5;
    pdf.setFont('times', 'normal');
    pdf.setFontSize(8.5);
    pdf.text(`NIP. ${doc.signatoryNip || '-'}`, colRightX, y);

    const filename = `${doc.documentType.toUpperCase()}-${doc.documentNumber.replace(/[\/\\]/g, '_')}.pdf`;
    pdf.save(filename);
  },

  /**
   * Generates a genuine .docx file for any generated text report
   */
  async exportReportToDocx(title: string, content: string, schoolProfile: SchoolProfile): Promise<void> {
    const children: (Paragraph | Table)[] = [];

    // Kop Surat
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA',
            bold: true,
            size: 20,
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH',
            bold: true,
            size: 22,
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: schoolProfile.name.toUpperCase(),
            bold: true,
            size: 26,
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: '000000',
            space: 4,
            style: BorderStyle.DOUBLE,
            size: 12
          }
        },
        children: [
          new TextRun({
            text: `${schoolProfile.address} · NPSN: ${schoolProfile.npsn} · Surel: ${schoolProfile.email}`,
            size: 16,
            font: 'Arial'
          })
        ]
      })
    );

    // Document Title
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 180 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            font: 'Arial'
          })
        ]
      })
    );

    // Body Paragraphs
    const lines = content.split('\n');
    lines.forEach(line => {
      const isHeader = line.startsWith('BAB ') || line.startsWith('===') || line.startsWith('---');
      const isSub = /^[A-Z0-9]\.\s/.test(line) || /^[0-9]+\.\s/.test(line);

      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: line,
              bold: isHeader || isSub,
              size: isHeader ? 20 : 18,
              font: 'Calibri'
            })
          ]
        })
      );
    });

    const file = new Document({
      sections: [{ children }]
    });

    const blob = await Packer.toBlob(file);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[\s\/\\:]+/g, '_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Generates official PDF for reports
   */
  exportReportToPDF(title: string, content: string, schoolProfile: SchoolProfile): void {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);
    let y = 14;

    // Kop
    pdf.setFont('times', 'bold');
    pdf.setFontSize(9);
    pdf.text((schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    pdf.setFontSize(10);
    pdf.text((schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5;
    pdf.setFontSize(13);
    pdf.text(schoolProfile.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 4;
    pdf.setFont('times', 'normal');
    pdf.setFontSize(7.5);
    pdf.text(`${schoolProfile.address} | Surel: ${schoolProfile.email}`, pageWidth / 2, y, { align: 'center' });
    y += 2.5;

    pdf.setLineWidth(0.7);
    pdf.line(margin, y, pageWidth - margin, y);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y + 0.8, pageWidth - margin, y + 0.8);
    y += 7;

    // Title
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    const titleLines = pdf.splitTextToSize(title.toUpperCase(), contentWidth);
    pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 5 + 4;

    // Content
    pdf.setFont('times', 'normal');
    pdf.setFontSize(8);

    const paragraphs = content.split('\n');
    for (const p of paragraphs) {
      if (y > 270) {
        pdf.addPage();
        y = 15;
      }

      if (p.startsWith('===') || p.startsWith('---')) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 4;
        continue;
      }

      const isBab = p.startsWith('BAB ');
      if (isBab) {
        pdf.setFont('times', 'bold');
        pdf.setFontSize(9);
      } else {
        pdf.setFont('times', 'normal');
        pdf.setFontSize(8);
      }

      const pLines = pdf.splitTextToSize(p, contentWidth);
      pdf.text(pLines, margin, y);
      y += pLines.length * 3.8 + 1.5;
    }

    pdf.save(`${title.replace(/[\s\/\\:]+/g, '_')}.pdf`);
  }
};

