# SE Primer — Tasarım Sistemi ve Mobil Ekran Dokümantasyonu (DESIGN.md)

**Proje:** SE Primer — Yazılım Mühendisliği Kriz Simülasyonu  
**Hedef Platform:** Mobil Öncelikli Web Uygulaması (375px - 430px telefon ekranları & Masaüstü Mobil Simülatör Kapsayıcısı)  
**Tasarım Dili:** Mission-Critical Software Operations Center (Editoryal, Minimalist, Yüksek Kontrastlı Siber Kriz Arayüzü)  
**Google Stitch Durumu:** Stitch doğrudan bir CLI/API entegrasyonuna sahip olmadığından, bu dokümanda her üç mobil ekran için Google Stitch'e doğrudan verilebilecek detaylı UI promptları hazırlanmış ve uygulamanın CSS tasarım sistemi bu kurallarla %100 uyumlu olarak kodlanmıştır.

---

## 1. Görsel Yaklaşım ve Tasarım Felsefesi

SE Primer, sıradan çocuksu oyunlaştırma ögelerinden (şatafatlı konfetiler, gereksiz zıplayan emojiler) kaçınır. Bunun yerine bir **Site Reliability Engineering (SRE) ve Kriz Yönetim Merkezi** atmosferi sunar:
- **Ciddiyet & Aciliyet:** 08:00 kriz zaman damgası, 300 hasta uyarısı ve yanıp sönen alarm göstergeleriyle gerçek mühendislik gerilimi.
- **Editoryal Okunabilirlik:** Uzun paragraflar yerine temiz hiyerarşik kartlar, monospaced sayaçlar ve teknik terim vurguları.
- **Duyarlı Dokunmatik Hedefler:** Mobil ekranda başparmak erişim bölgesi (thumb zone) hesaba katılarak en az 48px yükseklikte butonlar ve dokunmatik hedefler.
- **Sıfır Yatay Kaydırma (Zero Horizontal Scroll):** Tüm bileşenler `box-sizing: border-box` ve `max-width: 100%` kurallarına sıkı sıkıya bağlıdır.

---

## 2. Tasarım Belirteçleri (Design Tokens)

### 2.1 Renk Paleti (Color Palette)

| Belirteç (Token) | HEX / HSL | Anlamsal Kullanım |
|---|---|---|
| `--color-bg-base` | `#0B0F17` (Deep Obsidian) | Ana arka plan (karanlık kriz merkezi hissi) |
| `--color-bg-surface` | `#131B2B` (Navy Surface) | Kartlar, form kapsayıcıları ve paneller |
| `--color-bg-elevated` | `#1C263B` (Elevated Slate) | Seçili butonlar, modal katmanları ve popover'lar |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.08)` | Pasif kart kenarlıkları |
| `--color-border-focus` | `#3B82F6` (Electric Blue) | Odak halkaları ve birincil aksiyon kenarlıkları |
| `--color-text-primary` | `#F1F5F9` (Off-white / Slate 100) | Başlıklar ve birincil metinler |
| `--color-text-secondary` | `#94A3B8` (Muted Slate 400) | Açıklamalar, etiketler ve yardımcı bilgiler |
| `--color-accent-amber` | `#F59E0B` (Critical Warning) | Kriz alarmları, 60s sayaç uyarısı, ipucu rozetleri |
| `--color-accent-red` | `#EF4444` (Incident Danger) | Son B (Kötü Son), KVKK ihlal uyarısı, hata durumları |
| `--color-accent-green` | `#10B981` (Terminal Success) | Son A (Başarılı Son), sağlıklı servis rozeti |
| `--color-accent-tutor` | `#8B5CF6` (Socratic Violet) | AI Tutor paneli, akıllı yönlendirme rozeti |

### 2.2 Tipografi (Typography)
- **Başlık Fontu:** `Outfit`, sans-serif (modern, editoryal, dinamik)
- **Gövde Metni Fontu:** `Inter`, -apple-system, sans-serif (üstün okunabilirlik, optik mikrogözlük uyumu)
- **Metrik & Kod Fontu:** `JetBrains Mono`, `Consolas`, monospace (zaman damgaları, 60s sayaç, log kayıtları)
- **Hiyerarşi:**
  - `Display / H1`: 24px - 28px / Line Height 1.2 / Font Weight 700
  - `H2 / Section Title`: 18px - 20px / Line Height 1.3 / Font Weight 600
  - `H3 / Card Title`: 15px - 16px / Line Height 1.4 / Font Weight 600
  - `Body Regular`: 14px / Line Height 1.5 / Font Weight 400
  - `Small / Badge / Log`: 12px / Line Height 1.4 / Font Weight 500 (Monospace)

### 2.3 Boşluk ve Grid Sistemi (Spacing & Radius)
- **Boşluk Ölçeği:** 4px, 8px, 12px, 16px, 20px, 24px, 32px
- **Mobil Konteyner Genişliği:** `max-width: 440px` (Mobil ekranlarda `%100`, masaüstünde ortalı zarif telefon çerçevesi)
- **Köşe Yuvarlama (Border Radius):**
  - Kartlar: `12px`
  - Butonlar ve Seçim Çipleri: `8px`
  - Rozetler (Badges): `9999px` (Tam hap biçimi)

---

## 3. Üç Mobil Ekranın Mimari Tasarımı

### 3.1 Ekran 1 — Başlangıç ve Kişiselleştirme (Onboarding)
- **Header:** SE Primer logosu, "YZM301 Mühendislik Simülasyonu" etiketi ve durum rozeti.
- **Kriz Çağrısı:** *"08:00 Krizine Hazır mısın?"* başlığı ile nöbetçi mühendis çağrısı.
- **Etkileşimli Seçim Grupları (Segmented Chips):**
  1. *Deneyim Seviyen:*
     - `[🌱 Yeni Başladım]` (Alt not: Otomatik ipuçları açık)
     - `[⚡ Orta Seviyedeyim]` (Alt not: İsteğe bağlı ipucu)
     - `[🔥 Deneyimliyim]` (Alt not: 60 saniyelik kriz baskısı)
  2. *Mühendislik Rolün:*
     - `[💻 Yazılım Geliştirici]`
     - `[🧪 Test Mühendisi]`
     - `[⚙️ Sistem / DevOps]`
  3. *Öğrenme Odağın:*
     - `[🏛️ Mimari & Rollback]`
     - `[✅ Test & Dağıtım]`
     - `[🛡️ KVKK & Gizlilik]`
- **Birincil CTA:** `"Krize Müdahale Et →"` (Tüm seçimler yapılana kadar pasif veya belirgin uyarı veren yapıda).

### 3.2 Ekran 2 — Kriz Sahnesi, Karar Seçenekleri ve AI Tutor
- **Üst Kriz Çubuğu (Incident Bar):**
  - Sol: `⏰ 08:00 Olay Bildirimi` (Kırmızı yanıp sönen uyarı noktası)
  - Sağ: `👥 300 Hasta Bekliyor`
  - Orta / Kıdemli Modunda: Dairesel veya çubuklu `⏳ 60s` geri sayım sayacı (son 10 saniyede kırmızı nabız atışı).
- **Kriz Anlatı Kartı:**
  - Seçilen role ve hedefe özel giriş cümlesi.
  - Olay bağlamı: Dün gece 02:00'de v2.4.0 yayına alındı, sabah servis kesintiye uğradı.
- **Aktif Karar Kartı (Karar 1, 2 veya 3):**
  - Başlık: `Karar X/3 · [Konu]`
  - Seçenek A Butonu: Büyük dokunmatik kart, net eylem tanımı ve teknik özet.
  - Seçenek B Butonu: Karşıt alternatif eylem kartı.
  - *İpucu Paneli:* Junior kullanıcıda açık; Mid kullanıcıda "💡 İpucu İste" tıklandığında yumuşak açılan accordion.
- **Sokratik AI Tutor Paneli (Sabit veya Çekilebilir Kart):**
  - Avatar: `🤖 Sokratik Tutor (Kıdemli Mimar)`
  - Düşünce Balonu: Kullanıcının seçim yapmadan önce düşünmesini sağlayan soru.
  - Soru/Düşünce Giriş Alanı: *"Bir fikir yaz veya danış..."* + Gönder butonu.
  - Tutor Cevap Kutusu: `question`, `hint`, `feedback` ayrıştırılmış blokları.
- **Neden-Sonuç Kartı (Seçim Yapıldıktan Sonra Açılır):**
  - `📋 Ne Oldu?` (Operasyonel etki)
  - `🔬 Neden Oldu?` (Teknik gerekçe & mimari analiz)
  - `[Sonraki Adıma Geç →]` butonu.

### 3.3 Ekran 3 — Sonuç Ekranı (Mission Debrief & Analytics)
- **Nihai Kriz Durum Rozeti:**
  - **Son A:** `🟢 BAŞARILI KRİZ YÖNETİMİ — 08:25 Sistem Ayakta, Veri Güvende`
  - **Son B:** `🔴 OPERASYONEL KRİZ & KVKK İHLALİ — Sistem Ayakta Ama Yasal Risk`
- **Operasyonel Metrik Kartları:**
  - Kriz Çözüm Süresi (Örn: 25 dk vs 85 dk)
  - Servis Sürekliliği Skoru (%98 vs %62)
  - Veri Mahremiyeti Uyumu (Tam Uyumlu vs Ağır İhlal)
- **Üç Kararın Detaylı Dökümü (Decision Log Table):**
  - Karar 1 (Mimari): Seçim + Teknik Gerekçe
  - Karar 2 (Test): Seçim + Teknik Gerekçe
  - Karar 3 (KVKK): Seçim + Yasal/Teknik Gerekçe
- **Eğitsel Çıkarım & Özet Tavsiye:** AI Tutor'ın kullanıcının genel yaklaşımına (rol ve hedefine göre) ürettiği özet değerlendirme.
- **İkincil Eylem CTA:** `"🔄 Simülasyonu Yeniden Başlat"` (State'i temizler, Ekran 1'e döner).

---

## 4. Google Stitch Tasarım Promptları (Ready-to-Paste)

Aşağıdaki 3 prompt, Google Stitch (`stitch.withgoogle.com`) üzerinde birebir kullanılarak yüksek kaliteli Figma/HTML prototipleri üretmek için hazırlanmıştır:

### Prompt 1 — Google Stitch: Onboarding & Personalization Screen
```text
Mobile-first app screen design for "SE Primer - Software Engineering Crisis Simulator".
Viewport: 390x844px (iPhone 14/15/16).
Dark mode aesthetic with deep navy background (#0B0F17) and elevated slate cards (#131B2B).
Top navigation: Subtle text logo "SE PRIMER" with an incident-ready status badge "YZM301 SIMULATION".
Hero section: Heading "08:00 On-Call Crisis. Are you ready?", subtitle "Make high-stakes architectural, testing, and privacy decisions under pressure."
Form sections using sleek segmented chip selectors:
1. Experience Level: 3 toggle chips [🌱 Junior (Auto-hints)], [⚡ Mid-level (Hints on demand)], [🔥 Senior (60s timer)]. Selected chip has blue border and glowing background.
2. Engineering Role: 3 toggle chips [💻 Software Developer], [🧪 QA Engineer], [⚙️ DevOps / SRE].
3. Learning Goal: 3 toggle chips [🏛️ Architecture & Rollback], [✅ Testing & Reliability], [🛡️ Privacy & Compliance].
Bottom CTA: Full-width high-contrast rounded primary button "Enter the Crisis Room →", height 52px, active glow effect.
Typography: Clean modern sans-serif (Inter/Outfit), crisp white headings, muted secondary text (#94A3B8). Zero horizontal overflow.
```

### Prompt 2 — Google Stitch: Crisis Scene, Decisions & AI Tutor Screen
```text
Mobile-first crisis decision screen for "SE Primer - Hospital Appointment System Outage".
Viewport: 390x844px. Dark slate emergency operations center UI (#0B0F17).
Top Incident Header: Sticky bar with pulsing red dot "08:00 CRITICAL INCIDENT", badge "300 Patients Waiting", and an amber countdown ring timer "⏳ 54s remaining".
Context Card: Dark card with subtle border: "Yesterday midnight v2.4.0 deployed. Database connection pool exhausted. Appointment service is dropping requests."
Active Decision Section:
Header: "Decision 1 of 3: Architectural Strategy"
Option A Card (Tappable, 64px min-height): "A) Rollback to Previous Stable Release (v2.3.9)" with subtitle "Safe route. Requires verification of schema migrations."
Option B Card (Tappable, 64px min-height): "B) Apply Hotfix Directly on Production" with subtitle "Fastest bypass. High risk of data inconsistency and cascading failures."
Collapsible Socratic AI Tutor Drawer at bottom:
Header: "🤖 Senior Architect Tutor", subtext "I won't give you the answer. Ask me to reflect."
Tutor Thought bubble with violet accent border: "Before rolling back, what command or schema check tells you whether stateful data will corrupt?"
Input row with pill field "Ask tutor or type your reasoning..." and arrow send button.
Clean touch targets, high contrast, WCAG AA compliant.
```

### Prompt 3 — Google Stitch: Mission Debrief & Outcome Screen
```text
Mobile-first outcome debrief screen for "SE Primer - Crisis Simulation".
Viewport: 390x844px. Dark theme (#0B0F17).
Outcome Hero Banner:
State A (Success): Emerald green glow border (#10B981), large icon checkmark, title "CRISIS RESOLVED: 08:25 System Healthy & Data Secure", badge "Outcome A: High Engineering Integrity".
Metrics Row: 3 compact stat cards [Recovery: 25 min] [Data Loss: 0%] [KVKK Compliance: 100% Passed].
Decision Review List:
- Card 1: "Architectural Rollback" -> "✅ Correctly reverted code and validated zero pending schema locks."
- Card 2: "Smoke Testing" -> "✅ Ran 10-minute critical booking path tests before DNS traffic flip."
- Card 3: "Privacy Masking" -> "✅ Replaced patient PII in incident logs with SHA-256 tokens before Slack share."
Bottom Action: High-contrast secondary outline button "🔄 Restart Simulation & Test Another Path", height 50px.
Clean editorial design, professional SRE post-mortem aesthetic.
```

---

## 5. Erişilebilirlik ve Etkileşim Kuralları (Accessibility & Interaction)

1. **Focus Rings:** Klavye veya ekran okuyucu gezintisinde tüm odaklanabilir elemanlar `outline: 2px solid #3B82F6` ve `outline-offset: 2px` ile net şekilde görünür.
2. **Renk Bağımsızlığı:** Hiçbir bilgi salt renkle aktarılmaz. Kırmızı/Yeşil göstergelerin yanında mutlaka ikonlar (`✓`, `⚠️`, `✕`) ve metinsel durum rozetleri kullanılır.
3. **Sayacın Durdurulması:** Kullanıcı karar verdiği anda sayaç anında dondurulur; işlem sırasında gereksiz sayaç taşması engellenir.
4. **Haptic & Feedback Hissi:** Buton tıklamalarında hafif `transform: scale(0.98)` ve renk koyulaşması uygulanarak dokunmatik ekran tatmini sağlanır.
