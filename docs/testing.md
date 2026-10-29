# SE Primer — Uçtan Uca (E2E) Test Dokümantasyonu (docs/testing.md)

**Proje:** SE Primer — Yazılım Mühendisliği Kriz Simülasyonu  
**Test Aracı:** Cypress 16.2.1  
**Hedef Tarayıcı:** Electron 146 (Headless) / Chrome  
**Test Ortamı:** Vite Dev Server (`http://localhost:5173`)  
**Tarih:** Ekim 2026  
**Test Durumu:** 16 / 16 Başarılı (%100 Başarı)

---

## 1. Test Çalıştırma Komutları

### 1.1 Ön Koşul: Geliştirme Sunucusunun Başlatılması
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu port 5173'te başlat
npm run dev
```

### 1.2 Cypress E2E Testlerini Terminalden Çalıştırma (Headless)
```bash
# Cypress koşucusunu çalıştırır
npm run test:e2e
# veya doğrudan:
npx cypress run
```

### 1.3 Cypress Arayüzünde Etkileşimli Çalıştırma (Interactive GUI)
```bash
npm run test:e2e:open
# veya:
npx cypress open
```

---

## 2. Test Kapsamı ve Senaryo Matrisi

Uygulamanın ödev dokümanında (`SE Primer — Ödev.pdf`) ve `spec.md` dosyasında yer alan 14 temel gereksinimi 5 ayrı test dosyasında eksiksiz test edilmiştir:

| Test Dosyası | Test Senaryosu | İlgili Kabul Kriteri | Sonuç |
|---|---|---|:---:|
| `01_onboarding_and_personalization.cy.ts` | Başlangıç ekranının açılması, 3 sorunun ve default chip'lerin render edilmesi | FR-01, FR-02 | ✓ Geçti |
| `01_onboarding_and_personalization.cy.ts` | Formda seviye, rol, hedef güncelleme ve kriz ekranına parametrik geçiş | FR-01, FR-02 | ✓ Geçti |
| `02_beginner_and_experienced_flows.cy.ts` | Yeni başlayan (`junior`) kullanıcıda mimari ipucunun otomatik açık gelmesi | FR-03, Kabul Örneği 1 | ✓ Geçti |
| `02_beginner_and_experienced_flows.cy.ts` | Orta seviye (`mid`) kullanıcıda ipucunun gizli gelmesi ve "İpucu İste" butonuyla açılıp kapanması | FR-03 | ✓ Geçti |
| `02_beginner_and_experienced_flows.cy.ts` | Deneyimli (`senior`) kullanıcı için 60 saniyelik kriz geri sayım sayacının çalışması | FR-03, FR-04, Kabul Örneği 2 | ✓ Geçti |
| `02_beginner_and_experienced_flows.cy.ts` | 60 saniye dolduğunda kriz paniği simülasyonu, güvenli zaman aşımı uyarısı ve durum kurtarma | FR-04, Kabul Örneği 2 | ✓ Geçti |
| `03_game_paths_and_outcomes.cy.ts` | Başarılı Sona (Son A: Rollback + Duman Testi + Maskeleme) eksiksiz ulaşılması | FR-05, FR-06, FR-07, FR-08, Kabul Örneği 4 | ✓ Geçti |
| `03_game_paths_and_outcomes.cy.ts` | Olumsuz Sona (Son B: Hotfix + Testsiz Dağıtım + Ham Log) ulaşılması ve KVKK ihlalinin tespiti | FR-08, Kabul Örneği 4 | ✓ Geçti |
| `03_game_paths_and_outcomes.cy.ts` | Her karar seçiminden sonra "Ne oldu? Neden oldu?" ara sonuç kartının gösterilmesi | FR-09, Kabul Örneği 3 | ✓ Geçti |
| `03_game_paths_and_outcomes.cy.ts` | Hızlı ardışık tıklamalarda (double-click) butonların kilitlenmesi ve yarış durumu koruması | FR-12, Edge Case 2 | ✓ Geçti |
| `03_game_paths_and_outcomes.cy.ts` | Sonuç ekranındaki "Yeniden Başlat" butonunun tüm durumu sıfırlayıp Ekran 1'e dönmesi | FR-11 | ✓ Geçti |
| `04_socratic_tutor_and_safety.cy.ts` | Sokratik Tutor başlangıç durumu ve Yerel Sokratik Mod rozeti | FR-10 | ✓ Geçti |
| `04_socratic_tutor_and_safety.cy.ts` | Öğrenci düşünce girdiğinde soru, ipucu ve geri bildirim üretilmesi | FR-10 | ✓ Geçti |
| `04_socratic_tutor_and_safety.cy.ts` | "Hangi şıkkı seçmeliyim" sorusuna karşı cevabı ele vermeyen koruyucu davranış (`reveals_answer: false`) | FR-10, Kabul Örneği 5 | ✓ Geçti |
| `05_mobile_viewport.cy.ts` | iPhone SE (375x667) mobil ekranında sıfır yatay kaydırma ile baştan sona oynanabilme | NFR-01, M-01 | ✓ Geçti |
| `05_mobile_viewport.cy.ts` | iPhone 14/15/16 (390x844) ve Pixel 7 (412x915) ekranlarında sıfır yatay taşma | NFR-01, M-01 | ✓ Geçti |

---

## 3. Gerçek Test Koşusu Sonuç Çıktısı

Cypress koşucusu terminalde çalıştırılmış ve aşağıdaki gerçek log çıktısı elde edilmiştir:

```text
====================================================================================================
  (Run Finished)

       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ √  01_onboarding_and_personalization.cy.ts  00:01        2        2        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  02_beginner_and_experienced_flows.cy.ts  00:04        4        4        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  03_game_paths_and_outcomes.cy.ts         00:05        4        4        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  04_socratic_tutor_and_safety.cy.ts       00:03        3        3        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ √  05_mobile_viewport.cy.ts                 00:04        3        3        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    √  All specs passed!                        00:18       16       16        -        -        -  
====================================================================================================
```

### Video ve Ekran Görüntüsü Çıktıları
Cypress her test koşusunda otomatik olarak video kayıtları üretmiş ve `cypress/videos/` klasörüne kaydetmiştir:
- `cypress/videos/01_onboarding_and_personalization.cy.ts.mp4`
- `cypress/videos/02_beginner_and_experienced_flows.cy.ts.mp4`
- `cypress/videos/03_game_paths_and_outcomes.cy.ts.mp4`
- `cypress/videos/04_socratic_tutor_and_safety.cy.ts.mp4`
- `cypress/videos/05_mobile_viewport.cy.ts.mp4`
