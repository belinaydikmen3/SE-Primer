# SE Primer — Kişiselleştirilmiş Yazılım Mühendisliği Kriz Simülasyonu

[![Cypress E2E Tests](https://img.shields.io/badge/Cypress%20E2E-16%2F16%20Passed-10b981?style=flat-square&logo=cypress)](docs/testing.md)
[![Tutor Evaluation](https://img.shields.io/badge/Tutor%20Eval-20%20Cases%20Etiketlendi-8b5cf6?style=flat-square)](eval/results.md)
[![Live Demo](https://img.shields.io/badge/Vercel-Canl%C4%B1%20Yay%C4%B1n-black?style=flat-square&logo=vercel)](https://flying-iron-c566m6c.tmp.now)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Demo%20Video-red?style=flat-square&logo=youtube)](https://youtu.be/quWFpJckWok)
[![GitHub](https://img.shields.io/badge/GitHub-belinaydikmen3%2FSE--Primer-blue?style=flat-square&logo=github)](https://github.com/belinaydikmen3/SE-Primer)

> **YZM301 Yazılım Mühendisliği Dersi Projesi**  
> *"08:00. Hastane randevu sistemi çöktü. Nöbetçi yazılım mühendisi sensin. 300 hasta bekliyor. Dün gece yeni sürüm yayımlandı. Ne yaparsın?"*

SE Primer; yazılım mühendisliği kararlarını (Mimari Rollback, Test/Dağıtım Stratejileri, KVKK ve Veri Gizliliği) oyunlaştırarak öğreten, **mobil öncelikli (mobile-first)** ve **Sokratik AI Tutor** destekli interaktif bir web simülasyonudur.

---

## 1. Hızlı Bağlantılar ve Teslim Bilgileri

- 🌐 **Canlı Uygulama (Vercel):** [https://flying-iron-c566m6c.tmp.now](https://flying-iron-c566m6c.tmp.now)  
  *(Vercel Claim Linki: [https://vercel.com/claim-deployment?code=59b5a20c-7baf-4d0d-b5b9-3ef82453bd5f](https://vercel.com/claim-deployment?code=59b5a20c-7baf-4d0d-b5b9-3ef82453bd5f))*
- 🎬 **YouTube Demo Videosu:** [https://youtu.be/quWFpJckWok](https://youtu.be/quWFpJckWok)
- 💻 **GitHub Deposu:** [https://github.com/belinaydikmen3/SE-Primer](https://github.com/belinaydikmen3/SE-Primer)
- 🤖 **Google AI Studio Sürümü Dokümantasyonu:** [`ai-studio/README.md`](ai-studio/README.md) ve [`ai-studio/prompt-config.json`](ai-studio/prompt-config.json)

---

## 2. Problem ve Çözüm Yaklaşımı

- **Geleneksel Yaklaşım:** Yazılım mühendisliği teorisi genellikle statik slaytlar ve izole kod ödevleriyle öğretilir. Öğrenciler üretim (production) krizlerindeki ödünleşimleri (trade-offs), zaman baskısını ve veri mahremiyeti risklerini deneyimleyemezler.
- **SE Primer Yaklaşımı:** Kullanıcıyı acil bir sağlık krizinin ortasına yerleştirir. Yapılan her seçimin teknik, operasyonel ve etik sonucunu anında gösterir. AI Tutor doğru cevabı fısıldamak yerine kullanıcının analitik düşünmesini sağlayan Sokratik sorular sorar.

---

## 3. Temel Özellikler

1. **Girişte 3 Soruluk Kişiselleştirme:**
   - *Deneyim Seviyesi:*
     - **Yeni Başladım (Junior):** Her kararda mimari ipuçları otomatik olarak açık gelir.
     - **Orta Seviyedeyim (Mid):** İpuçları gizlidir; kullanıcı ihtiyaç duyduğunda "İpucu İste" butonuyla açar.
     - **Deneyimliyim (Senior):** Her karar aşamasında 60 saniyelik gerçek zamanlı kriz sayacı çalışır. Süre dolduğunda güvenli zaman aşımı devreye girer.
   - *Rol:* Yazılım Geliştirici, Test Mühendisi veya Sistem/DevOps Mühendisi (anlatı ve odak noktası uyarlanır).
   - *Öğrenme Hedefi:* Mimari Kararlar, Test ve Kalite veya Güvenlik & KVKK.
2. **Tek Kurgusal Sağlık Krizi ve 3 Kritik Karar:**
   - **Karar 1 (Mimari & Geri Dönüş):** Eski sürüme dön (Rollback to v2.3.9) vs Canlıda yama yap (Hotfix).
   - **Karar 2 (Test & Dağıtım):** Kısa duman testlerini (Smoke Test) çalıştır vs Testleri atlayıp hemen aç.
   - **Karar 3 (KVKK & Gizlilik):** Logdaki hasta adını maskele (PII Masking) vs Olduğu gibi ekibe at.
3. **Neden-Sonuç Kartları:** Her seçimden sonra "Ne oldu?" (operasyonel etki) ve "Neden oldu?" (teknik gerekçe) kartı gösterilir.
4. **İki Belirgin Son:**
   - **Son A (Başarılı Kriz Yönetimi):** `08:25 Sistem Ayakta, Veri Güvende` (Rollback + Duman Testi + Maskeleme).
   - **Son B (Olumsuz Sonuç):** `KVKK İhlali & Ağır Operasyonel Risk` (Canlıda yama, testsiz dağıtım veya ham log paylaşımı).
5. **Sokratik AI Tutor & Güvenlik Bariyeri:**
   - Kullanıcıya asla doğrudan cevabı söylemez; yönlendirici sorular ve teknik ipuçları sunar.
   - `reveals_answer` tespit mekanizmasıyla cevap sızıntılarını engeller.
   - Google Gemini API desteği (Serverless Proxy) + Çevrimdışı/Yedek Sokratik Kural Motoru.

---

## 4. Yapılmayan 3 Özellik ve Nedenleri (Kapsam Dışı)

Ödev dokümanı (`SE Primer — Ödev.pdf`, Sayfa 3) gereğince aşağıdaki özellikler bilinçli olarak kapsam dışı bırakılmıştır:

1. **Kullanıcı Hesabı ve Giriş Sistemi (Auth/Login):** Tek oturumluk ve anında oynanabilir bir eğitim simülasyonu hedeflendiği için kullanıcı kaydı sürtünmesi yaratmamak adına kapsam dışı bırakılmıştır.
2. **Native Mobil Uygulama (iOS/Android):** Öğrencilerin herhangi bir kurulum yapmadan tarayıcı üzerinden anında erişebilmesi için mobil öncelikli responsive Web App mimarisi tercih edilmiştir.
3. **İkinci Bölüm / Çoklu Senaryolar:** Projenin pedagojik derinliğini ve test kapsamını tek bir kriz senaryosu (hastane randevu sistemi) üzerinde en yüksek kalitede yoğunlaştırmak amacıyla ikinci bir bölüm geliştirilmemiştir.

---

## 5. Teknoloji Yığını

- **Kullanıcı Arayüzü & Mantık:** React 19, TypeScript 5, Vite 8
- **Tasarım & Stil:** Vanilla Modern CSS (Mission-Critical Ops Center Tasarım Sistemi, Sıfır Yatay Kaydırma)
- **Yapay Zekâ Entegrasyonu:** Google Gemini 1.5 Flash API + Vercel Node.js Serverless Proxy (`/api/tutor`) + Dayanıklı Yerel Sokratik Kural Motoru
- **Test Otomasyonu:** Cypress 16.2.1 (E2E Test Paketi)
- **Tasarım Spesifikasyonu:** Google Stitch UI Promptları (`DESIGN.md`)
- **Canlı Dağıtım:** Vercel

---

## 6. Kurulum ve Yerel Çalıştırma Adımları

### 6.1 Gereksinimler
- Node.js (v18 veya üzeri — v24 önerilir)
- npm veya pnpm

### 6.2 Kurulum
```bash
# Depoyu klonlayın
git clone https://github.com/belinaydikmen3/SE-Primer.git
cd SE-Primer

# Bağımlılıkları yükleyin
npm install
```

### 6.3 Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı açabilirsiniz.

### 6.4 Üretim Sürümü (Build)
```bash
npm run build
npm run preview
```

---

## 7. Ortam Değişkenleri (Environment Variables) ve Güvenlik

Gemini API anahtarları asla istemci kaynak koduna hardcode edilmez ve GitHub deposuna gönderilmez. Uygulama üç katmanlı güvenli bir yapıya sahiptir:

| Ortam Değişkeni | Bulunduğu Yer | Açıklama |
|---|---|---|
| `GEMINI_API_KEY` | **Vercel Proje Ayarları** (Server-side) | En güvenli yöntemdir. Vercel sunucusunda saklanır, istemciye sızmaz. `/api/tutor` serverless endpoint'i tarafından kullanılır. |
| `VITE_GEMINI_API_KEY` | `.env.local` (Yerel Geliştirme) | Yerel testlerde Vite istemci tarafında opsiyonel olarak kullanılabilir. Git'e dahil edilmez (`.gitignore`). |
| *Anahtarsız Mod* | Otomatik (Her ortamda) | Herhangi bir anahtar girilmediğinde sistem çökmez; arayüzde `"⚠️ Yerel Sokratik Mod"` rozetiyle deterministik kural motoru devreye girer. |

---

## 8. Cypress E2E Testleri

Tüm oyun yolları, zamanlayıcılar, ipucu davranışları ve mobil uyumluluk Cypress ile test edilmiştir:

```bash
# Terminalden headless testleri koşturun
npm run test:e2e

# Veya etkileşimli Cypress arayüzünü açın
npm run test:e2e:open
```

**Gerçek Test Durumu (Ekim 2026):**
- Toplam Test: **16**
- Başarılı: **16 (%100 Başarı)**
- Hatalı: **0**
- Test Koşu Süresi: **18 saniye**
- Ayrıntılı test raporu: [`docs/testing.md`](docs/testing.md)

---

## 9. AI Tutor Değerlendirmesi (25 Puanlık Teslim)

AI Tutor'ın pedagojik doğruluğunu ve cevap sızdırma riskini sınayan 20 vakalık veri kümesini analiz etmek için:

```bash
npm run eval
```

**Özet Sonuçlar:**
- Değerlendirilen Vaka Sayısı: **20**
- Hatasız Sokratik Rehberlik: **18 (%90.0)**
- Cevabı Ele Verme Oranı (`reveals_answer`): **%5.0 (Hedef: <%10)** ✓ Başarılı
- Ayrıntılı etiketleme kılavuzu: [`eval/labeling-guide.md`](eval/labeling-guide.md)
- Ayrıntılı analiz raporu: [`eval/results.md`](eval/results.md)

---

## 10. Google AI Studio Sürümü

Google AI Studio (`aistudio.google.com`), Gemini modelleri üzerinde doğrudan prompt mühendisliği ve test yapılmasına olanak tanıyan geliştirici ortamıdır.

- SE Primer'ın Sokratik AI Tutor bileşeni için hazırlanan tam parametreli model konfigürasyonu ve JSON şeması [`ai-studio/prompt-config.json`](ai-studio/prompt-config.json) dosyasında yer almaktadır.
- Projeyi Google AI Studio üzerinde kendi Google hesabınızla içe aktarmak ve paylaşılabilir bir prompt bağlantısı oluşturmak için adım adım talimatlar [`ai-studio/README.md`](ai-studio/README.md) dosyasında açıklanmıştır.

---

## 11. Mobil Ekran Görüntüleri (Screenshots)

| Ekran 1 — Kişiselleştirme | Ekran 2 — Kriz & AI Tutor | Ekran 3 — Sonuç Raporu |
|:---:|:---:|:---:|
| `![Ekran 1](docs/screenshots/screen1.png)` | `![Ekran 2](docs/screenshots/screen2.png)` | `![Ekran 3](docs/screenshots/screen3.png)` |

---

## 12. Bilinen Sınırlılıklar

1. **Gemini API Kotası:** Ücretsiz AI Studio katmanında dakikada 15 istek sınırı bulunmaktadır; kota aşıldığında uygulama yerel Sokratik motora kesintisiz geçmektedir.
2. **Tek Oturumluk Bellek:** Skorlar ve kararlar oturum bazlı saklanır; tarayıcı tamamen kapatıldığında kriz sıfırlanır.
