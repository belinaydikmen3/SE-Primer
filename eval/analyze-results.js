import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const casesPath = path.join(__dirname, 'cases.json');

if (!fs.existsSync(casesPath)) {
  console.error(`Hata: ${casesPath} bulunamadı!`);
  process.exit(1);
}

const rawData = fs.readFileSync(casesPath, 'utf-8');
const cases = JSON.parse(rawData);

const totalCases = cases.length;

const errorCategories = {
  reveals_answer: 0,
  misleading_guidance: 0,
  unhelpful_hint: 0,
  out_of_context: 0,
  privacy_security_violation: 0,
  none: 0,
};

let totalErrorTags = 0;
let casesWithErrors = 0;

cases.forEach((c) => {
  const tags = c.human_assigned_error_tags || [];
  let hasRealError = false;

  tags.forEach((tag) => {
    if (tag in errorCategories) {
      errorCategories[tag]++;
    } else {
      console.warn(`Bilinmeyen etiket: ${tag} (${c.id})`);
    }

    if (tag !== 'none') {
      totalErrorTags++;
      hasRealError = true;
    }
  });

  if (hasRealError) {
    casesWithErrors++;
  }
});

const successfulCases = errorCategories.none;
const successRate = ((successfulCases / totalCases) * 100).toFixed(1);
const answerLeakRate = ((errorCategories.reveals_answer / totalCases) * 100).toFixed(1);

console.log('====================================================');
console.log('       SE PRIMER — AI TUTOR EVAL ANALİZ RAPORU      ');
console.log('====================================================\n');
console.log(`Değerlendirilen Toplam Örnek Sayısı : ${totalCases}`);
console.log(`Hatasız Başarılı Örnek Sayısı      : ${successfulCases} (%${successRate})`);
console.log(`Hata İçeren Örnek Sayısı           : ${casesWithErrors} (%${((casesWithErrors / totalCases) * 100).toFixed(1)})`);
console.log(`Atanan Toplam Hata Etiketi         : ${totalErrorTags}\n`);

console.log('--- Hata Türleri Dağılımı (Payda: Toplam 20 Örnek) ---');
console.log(`1. Cevabı Ele Verme (reveals_answer)             : ${errorCategories.reveals_answer} adet (%${((errorCategories.reveals_answer / totalCases) * 100).toFixed(1)})`);
console.log(`2. Yanıltıcı Yönlendirme (misleading_guidance)   : ${errorCategories.misleading_guidance} adet (%${((errorCategories.misleading_guidance / totalCases) * 100).toFixed(1)})`);
console.log(`3. Yetersiz / Boş İpucu (unhelpful_hint)         : ${errorCategories.unhelpful_hint} adet (%${((errorCategories.unhelpful_hint / totalCases) * 100).toFixed(1)})`);
console.log(`4. Bağlam Dışına Çıkma (out_of_context)          : ${errorCategories.out_of_context} adet (%${((errorCategories.out_of_context / totalCases) * 100).toFixed(1)})`);
console.log(`5. Güvenlik/Gizlilik İhlali (privacy_violation)  : ${errorCategories.privacy_security_violation} adet (%${((errorCategories.privacy_security_violation / totalCases) * 100).toFixed(1)})`);
console.log(`6. Hatasız Başarılı (none)                       : ${errorCategories.none} adet (%${successRate})\n`);

console.log('--- Kritik Başarı Göstergesi ---');
console.log(`Cevabı Doğrudan Ele Verme Oranı: %${answerLeakRate} (Hedef: <%10) -> ${parseFloat(answerLeakRate) < 10 ? '✓ BAŞARILI' : '✗ BAŞARISIZ'}`);
console.log('====================================================');
