# SE Primer — Kişiselleştirilmiş Yazılım Mühendisliği Kriz Simülasyonu

[![Cypress E2E Tests](https://img.shields.io/badge/Cypress%20E2E-16%2F16%20Passed-10b981?style=flat-square&logo=cypress)](docs/testing.md)
[![Tutor Evaluation](https://img.shields.io/badge/Tutor%20Eval-20%20Cases%20Etiketlendi-8b5cf6?style=flat-square)](eval/results.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](tsconfig.json)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)](vite.config.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **YZM301 Yazılım Mühendisliği Dersi Projesi**  
> *"08:00. Hastane randevu sistemi çöktü. Nöbetçi yazılım mühendisi sensin. 300 hasta bekliyor. Dün gece yeni sürüm yayımlandı. Ne yaparsın?"*

SE Primer; yazılım mühendisliği kararlarını (Mimari Rollback, Test/Dağıtım Stratejileri, KVKK ve Veri Gizliliği) oyunlaştırarak öğreten, **mobil öncelikli (mobile-first)** ve **Sokratik AI Tutor** destekli interaktif bir web simülasyonudur.

---

## 1. Problem ve Çözüm Yaklaşımı

- **Geleneksel Yaklaşım:** Yazılım mühendisliği teorisi genellikle statik slaytlar ve izole kod ödevleriyle öğretilir. Öğrenciler üretim (production) krizlerindeki ödünleşimleri (trade-offs), zaman baskısını ve veri mahremiyeti risklerini deneyimleyemezler.
- **SE Primer Yaklaşımı:** Kullanıcıyı acil bir sağlık krizinin ortasına yerleştirir. Yapılan her seçimin teknik, operasyonel ve etik sonucunu anında gösterir. AI Tutor doğru cevabı fısıldamak yerine kullanıcının analitik düşünmesini sağlayan Sokratik sorular sorar.

---

## 2. Temel Özellikler

1. **Girişte 3 Soruluk Kişiselleştirme:**
   - *Deneyim Seviyesi:*
     - **Yeni Başladım (Junior):** Her kararda mimari ipuçları otomatik olarak açık gelir.
     - **Orta Seviyedeyim (Mid):** İpuçları gizlidir; kullanıcı ihtiyaç duyduğunda "İpucu İste" butonuyla açar.
     - **Deneyimliyim (Senior):** Her karar aşamasında 60 saniyelik gerçek zamanlı kriz sayacı çalışır. Süre dolduğunda güvenli zaman aşımı devreye girer.
   - *Rol:* Yazılım Geliştirici, Test Mühendisi veya Sistem/DevOps Mühendisi (anlatı ve odak noktası uyarlanır).
   - *Öğrenme Hedefi:* Mimari Kararlar, Test ve Kalite veya Güvenlik & KVKK.
2. **Tek Kurgusal Sağlık Krizi ve 3 Kritik Karar:**
   - **Karar 1 (Mimari & Geri Dönüş):** Eski sürüme dön (Rollback) vs Canlıda yama yap (Hotfix).
   - **Karar 2 (Test & Dağıtım):** Kısa duman testlerini (Smoke Test) çalıştır vs Testleri atlayıp hemen aç.
   - **Karar 3 (KVKK & Gizlilik):** Logdaki hasta adını maskele (PII Masking) vs Olduğu gibi ekibe at.
3. **Neden-Sonuç Kartları:** Her seçimden sonra "Ne oldu?" (operasyonel etki) ve "Neden oldu?" (teknik gerekçe) kartı gösterilir.
4. **İki Belirgin Son:**
   - **Son A (Başarılı Kriz Yönetimi):** `08:25 Sistem Ayakta, Veri Güvende` (Rollback + Duman Testi + Maskeleme).
   - **Son B (Olumsuz Sonuç):** `KVKK İhlali & Ağır Operasyonel Risk` (Canlıda yama, testsiz dağıtım veya ham log paylaşımı).
5. **Sokratik AI Tutor & Güvenlik Bariyeri:**
   - Kullanıcıya asla doğrudan cevabı söylemez; yönlendirici sorular ve teknik ipuçları sunar.
   - `reveals_answer` tespit mekanizmasıyla cevap sızıntılarını engeller.
   - Google Gemini API desteği + Çevrimdışı/Yedek Sokratik Kural Motoru.

---

## 3. Yapılmayan 3 Özellik ve Nedenleri (Kapsam Dışı)

Ödev dokümanı (`SE Primer — Ödev.pdf`, Sayfa 3) gereğince aşağıdaki özellikler bilinçli olarak kapsam dışı bırakılmıştır:

1. **Kullanıcı Hesabı ve Giriş Sistemi (Auth/Login):** Tek oturumluk ve anında oynanabilir bir eğitim simülasyonu hedeflendiği için kullanıcı kaydı sürtünmesi yaratmamak adına kapsam dışı bırakılmıştır.
2. **Native Mobil Uygulama (iOS/Android):** Öğrencilerin herhangi bir kurulum yapmadan tarayıcı üzerinden anında erişebilmesi için mobil öncelikli responsive Web App mimarisi tercih edilmiştir.
3. **İkinci Bölüm / Çoklu Senaryolar:** Projenin pedagojik derinliğini ve test kapsamını tek bir kriz senaryosu (hastane randevu sistemi) üzerinde en yüksek kalitede yoğunlaştırmak amacıyla ikinci bir bölüm geliştirilmemiştir.

---

## 4. Teknoloji Yığını

- **Kullanıcı Arayüzü & Mantık:** React 19, TypeScript 5, Vite 6
- **Tasarım & Stil:** Vanilla Modern CSS (Mission-Critical Ops Center Tasarım Sistemi, Sıfır Yatay Kaydırma)
- **Yapay Zekâ Entegrasyonu:** Google Gemini 1.5 Flash API + Dayanıklı Yerel Sokratik Kural Motoru
- **Test Otomasyonu:** Cypress 16.2.1 (E2E Test Paketi)
- **Tasarım Spesifikasyonu:** Google Stitch UI Promptları (`DESIGN.md`)

---

## 5. Uygulama Mimarisi

```
/
├── README.md                 # Ana dokümantasyon
├── spec.md                   # 12 bölümlük detaylı ürün spesifikasyonu
├── DESIGN.md                 # Tasarım belirteçleri ve Google Stitch promptları
├── package.json              # Bağımlılıklar ve npm scriptleri
├── cypress.config.ts         # Cypress E2E test yapılandırması
├── src/
│   ├── types/index.ts        # TypeScript tip tanımları (GameState, Outcome, Profile)
│   ├── scenario/data.ts      # Kriz anlatısı, kararlar ve 2 farklı son verisi
│   ├── engine/gameEngine.ts  # Durum makinesi, sayaç ve sonuç hesaplama motoru
│   ├── tutor/socraticTutor.ts# Sokratik AI Tutor, Gemini çağrısı ve regex denetçisi
│   ├── components/           # Header, HintCard, TutorPanel, CauseEffectModal
│   ├── screens/              # OnboardingScreen, CrisisScreen, OutcomeScreen
│   ├── styles/index.css      # Mobil öncelikli CSS tasarım sistemi
│   └── App.tsx               # Ana uygulama kapsayıcısı ve reaktif durum yönetimi
├── cypress/
│   ├── e2e/                  # 5 adet E2E test spec dosyası (16 test)
│   └── videos/               # Test koşusu mp4 video kayıtları
├── eval/
│   ├── cases.json            # 20 adet etiketlenmiş öğrenci değerlendirme vakası
│   ├── labeling-guide.md     # 5 hata türünün kılavuzu ve ölçütleri
│   ├── results.md            # Değerlendirme analiz raporu
│   └── analyze-results.js    # Otomatik analiz betiği (npm run eval)
└── docs/
    ├── testing.md            # Cypress test sonuçları ve kapsam matrisi
    └── demo-script.md        # 60 saniyelik YouTube demo video senaryosu ve Türkçe seslendirme
```

---

## 6. Kurulum ve Çalıştırma Adımları

### 6.1 Gereksinimler
- Node.js (v18 veya üzeri — v24 önerilir)
- npm veya pnpm

### 6.2 Kurulum
```bash
# Depoyu klonlayın veya proje dizinine geçin
git clone <GITHUB_REPO_URL>
cd SE-PRİMER

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

## 7. AI Tutor Yapılandırması

AI Tutor iki farklı çalışma moduna sahiptir:

1. **Canlı Google Gemini API Modu:**
   - İsteğe bağlı olarak kök dizinde `.env` dosyası oluşturup anahtarınızı tanımlayabilirsiniz:
     ```env
     VITE_GEMINI_API_KEY=AIzaSy...
     ```
   - Veya uygulama açıkken Tutor panelindeki **`⚙️ API`** butonuna tıklayarak anahtarınızı oturum bazlı yapıştırabilirsiniz (anahtar asla sunucuya gitmez, kaynak koduna gömülmez).
2. **Dayanıklı Yerel Sokratik Mod (Offline Fallback):**
   - API anahtarı girilmediğinde veya kota/bağlantı hatası oluştuğunda uygulama çökmeyip otomatik olarak yerel kural motoruna geçer. Arayüzde `"⚠️ Yerel Sokratik Mod"` rozetiyle durum şeffafça kullanıcıya gösterilir.

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

## 10. Teslim Bağlantıları ve Yer Tutucular

Aşağıdaki bağlantılar teslim gereksinimleri için yapılandırılmıştır:

- **GitHub Deposu:** Depo yerel olarak Git ile başlatılmıştır. Uzak repoya gönderme adımları aşağıda açıklanmıştır.
  - `GitHub Repo Linki:` `[GitHub Deposu Oluşturulduktan Sonra Buraya Yapıştırılacaktır]`
- **Google AI Studio Uygulama Bağlantısı:**
  - `AI Studio Linki:` `[Google AI Studio üzerinden yayımlandığında buraya eklenecektir]`
- **60 Saniyelik YouTube Demo Videosu:**
  - Video sahne planı, Türkçe seslendirme metni ve kayıt hazırlık listesi [`docs/demo-script.md`](docs/demo-script.md) dosyasında eksiksiz hazırdır.
  - `YouTube Demo Linki:` `[Video YouTube'a yüklendiğinde buraya eklenecektir]`

### GitHub Uzak Depoya Gönderme Adımları
```bash
git remote add origin https://github.com/<KULLANICI_ADINIZ>/SE-PRIMER.git
git branch -M main
git push -u origin main
```

---

## 11. Mobil Ekran Görüntüleri (Screenshots)

| Ekran 1 — Kişiselleştirme | Ekran 2 — Kriz & AI Tutor | Ekran 3 — Sonuç Raporu |
|:---:|:---:|:---:|
| `![Ekran 1](docs/screenshots/screen1.png)` | `![Ekran 2](docs/screenshots/screen2.png)` | `![Ekran 3](docs/screenshots/screen3.png)` |

---

## 12. Bilinen Sınırlılıklar

1. **Gemini API Kotası:** Ücretsiz AI Studio katmanında dakikada 15 istek sınırı bulunmaktadır; kota aşıldığında uygulama yerel Sokratik motora kesintisiz geçmektedir.
2. **Tek Oturumluk Bellek:** Skorlar ve kararlar oturum bazlı saklanır; tarayıcı tamamen kapatıldığında kriz sıfırlanır.
