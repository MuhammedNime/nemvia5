import { QuizQuestion } from '../types';
import { saveOrShareBlobFile } from './native';

export interface UploadedAIPayload {
  base64: string;
  mimeType: string;
  name: string;
}

export function fileToBase64Payload(file: File): Promise<UploadedAIPayload> {
  if (file.size > 12 * 1024 * 1024) {
    return Promise.reject(new Error('حجم الملف أكبر من 12 ميجابايت'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      const base64 = res.includes(',') ? res.split(',').pop() || '' : res;
      resolve({
        base64,
        mimeType: file.type || 'application/octet-stream',
        name: file.name,
      });
    };
    reader.onerror = () => reject(new Error('تعذّر قراءة الملف المحدد'));
    reader.readAsDataURL(file);
  });
}

function escHtml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface WordExamOptions {
  title: string;
  classTitle?: string;
  ministryName?: string;
  schoolName?: string;
  instructions?: string;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  withAnswers?: boolean;
}

export function downloadQuizAsWordDoc(opts: WordExamOptions): void {
  const {
    title,
    classTitle = '',
    ministryName = 'وزارة التربية والتعليم / المجمع التعليمي',
    schoolName = 'منصة NEMVIA التعليمية',
    instructions = 'اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.',
    timeLimitMinutes = 20,
    questions,
    withAnswers = false,
  } = opts;

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
  const dateStr = new Date().toLocaleDateString('ar');

  const questionsHtml = questions
    .map((q, idx) => {
      const qType = q.type || 'mcq';
      const pts = q.points || 1;
      let answerArea = '';

      if (qType === 'mcq' || qType === 'multi_select' || qType === 'true_false') {
        const list = qType === 'true_false' ? ['صح', 'خطأ'] : q.options;
        const rows: string[] = [];
        for (let i = 0; i < list.length; i += 2) {
          const left = list[i];
          const right = list[i + 1];
          const isAnsL =
            withAnswers &&
            (qType === 'multi_select' ? (q.correctOptionIndices || []).includes(i) : q.correctOptionIndex === i);
          const isAnsR =
            right !== undefined &&
            withAnswers &&
            (qType === 'multi_select'
              ? (q.correctOptionIndices || []).includes(i + 1)
              : q.correctOptionIndex === i + 1);

          rows.push(`
            <tr>
              <td style="width:50%; padding:6px 10px; border:1px solid #cbd5e1; background:${isAnsL ? '#ecfdf5' : '#ffffff'}; font-weight:${isAnsL ? 'bold' : 'normal'}; color:${isAnsL ? '#065f46' : '#0f172a'};">
                ${qType === 'true_false' ? '&#9675;' : `${letters[i] || i + 1})`} ${escHtml(left)} ${isAnsL ? '&#10004;' : ''}
              </td>
              ${
                right !== undefined
                  ? `<td style="width:50%; padding:6px 10px; border:1px solid #cbd5e1; background:${isAnsR ? '#ecfdf5' : '#ffffff'}; font-weight:${isAnsR ? 'bold' : 'normal'}; color:${isAnsR ? '#065f46' : '#0f172a'};">
                      ${qType === 'true_false' ? '&#9675;' : `${letters[i + 1] || i + 2})`} ${escHtml(right)} ${isAnsR ? '&#10004;' : ''}
                    </td>`
                  : `<td style="width:50%; border:none;"></td>`
              }
            </tr>
          `);
        }
        answerArea = `<table dir="rtl" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:11pt;">${rows.join('')}</table>`;
      } else if (qType === 'short_answer' || qType === 'fill_blank') {
        if (withAnswers) {
          answerArea = `<div style="margin-top:8px; padding:8px 12px; background:#ecfdf5; border:1px solid #6ee7b7; color:#065f46; font-weight:bold; font-size:10.5pt;">الإجابة المعتمدة: ${escHtml((q.acceptedAnswers || []).join(' / ') || '—')}</div>`;
        } else {
          answerArea = `<div style="margin-top:12px; border-bottom:1px dashed #64748b; height:22px;"></div>`;
        }
      } else {
        if (withAnswers) {
          answerArea = `<div style="margin-top:8px; padding:10px 12px; background:#ecfdf5; border:1px solid #6ee7b7; color:#065f46; font-size:10.5pt; white-space:pre-line;"><b>الإجابة النموذجية:</b> ${escHtml(q.modelAnswer || 'تُقدّر حسب إجابة الطالب')}</div>`;
        } else {
          answerArea = `
            <div style="margin-top:10px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
            <div style="margin-top:6px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
            <div style="margin-top:6px; border-bottom:1px dashed #94a3b8; height:22px;"></div>
          `;
        }
      }

      const explanationBlock =
        withAnswers && q.explanation
          ? `<div style="margin-top:6px; font-size:10pt; color:#334155;"><b>التفسير العلمي:</b> ${escHtml(q.explanation)}</div>`
          : '';

      return `
        <div style="margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0; page-break-inside:avoid;">
          <table dir="rtl" style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="font-size:12pt; font-weight:bold; color:#0f172a; line-height:1.6;">
                س${idx + 1}: ${escHtml(q.question).replace(/\n/g, '<br/>')}
              </td>
              <td style="width:90px; text-align:left; font-size:10pt; font-weight:bold; color:#1677c7; white-space:nowrap; vertical-align:top;">
                (${pts} ${pts === 1 ? 'درجة' : 'درجات'})
              </td>
            </tr>
          </table>
          ${answerArea}
          ${explanationBlock}
        </div>
      `;
    })
    .join('');

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>${escHtml(title)}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page {
    size: A4 portrait;
    margin: 1.8cm 1.8cm 1.8cm 1.8cm;
  }
  body {
    font-family: 'Cairo', 'Simplified Arabic', 'Arial', sans-serif;
    direction: rtl;
    text-align: right;
    color: #0f172a;
    margin: 0;
    padding: 0;
  }
</style>
</head>
<body>
  <!-- Official 3-column Letterhead -->
  <table dir="rtl" style="width:100%; border-collapse:collapse; border:2px solid #0f233a; margin-bottom:14px;">
    <tr>
      <td style="width:34%; padding:10px 12px; vertical-align:top; border-left:1px solid #cbd5e1; font-size:10.5pt; line-height:1.6;">
        <div style="font-weight:bold; color:#0f233a;">${escHtml(ministryName)}</div>
        <div style="font-weight:bold; color:#1677c7;">${escHtml(schoolName)}</div>
        ${classTitle ? `<div>المادة / الصف: ${escHtml(classTitle)}</div>` : ''}
      </td>
      <td style="width:32%; padding:10px; text-align:center; vertical-align:middle; border-left:1px solid #cbd5e1; background:#f8fafc;">
        <div style="font-size:13pt; font-weight:bold; color:#0f233a;">${escHtml(title)}</div>
        <div style="font-size:9.5pt; color:#475569; margin-top:4px;">${withAnswers ? 'نموذج الإجابة المعتمد للمعلم' : 'ورقة أسئلة الطالب'}</div>
      </td>
      <td style="width:34%; padding:10px 12px; vertical-align:top; font-size:10.5pt; line-height:1.6;">
        <div><b>الزمن المحدد:</b> ${timeLimitMinutes} دقيقة</div>
        <div><b>الدرجة الكاملة:</b> ${totalPoints} درجة</div>
        <div><b>التاريخ:</b> ${escHtml(dateStr)}</div>
      </td>
    </tr>
  </table>

  ${
    !withAnswers
      ? `<table dir="rtl" style="width:100%; border-collapse:collapse; border:1px solid #94a3b8; background:#f8fafc; margin-bottom:14px; font-size:10.5pt;">
          <tr>
            <td style="padding:8px 12px; border-left:1px solid #cbd5e1; width:45%;"><b>اسم الطالب/ـة:</b> ........................................</td>
            <td style="padding:8px 12px; border-left:1px solid #cbd5e1; width:30%;"><b>الشعبة:</b> ......................</td>
            <td style="padding:8px 12px; width:25%;"><b>الدرجة:</b> ....... / ${totalPoints}</td>
          </tr>
        </table>`
      : ''
  }

  ${
    instructions
      ? `<div style="margin-bottom:14px; padding:7px 12px; background:#eff6ff; border-right:3px solid #1677c7; font-size:10pt; color:#1e3a8a;">
          <b>تعليمات الاختبار:</b> ${escHtml(instructions)}
        </div>`
      : ''
  }

  <!-- Questions Section -->
  <div>
    ${questionsHtml}
  </div>

  <div style="margin-top:20px; text-align:center; font-size:9.5pt; color:#64748b; border-top:1px solid #cbd5e1; padding-top:8px;">
    انتهت الأسئلة مع تمنياتنا بالنجاح والتوفيق — تم الإعداد عبر منصة NEMVIA التعليمية
  </div>
</body>
</html>`.trim();

  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const safeName = (title || 'exam').replace(/[^\w\u0600-\u06FF-]+/g, '_');
  const filename = `${safeName}${withAnswers ? '_نموذج_الحل' : ''}.doc`;
  void saveOrShareBlobFile(blob, filename);
}
