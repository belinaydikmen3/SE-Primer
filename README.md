# The Primer v2 — Makine Öğrenmesi ile Davranışsal Kişiselleştirilmiş Yazılım Mühendisliği Kriz Simülasyonu

[![Cypress E2E Tests](https://img.shields.io/badge/Cypress%20E2E-18%2F18%20Passed-10b981?style=flat-square&logo=cypress)](docs/testing.md)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX%20Runtime%20Web-v2.0%20WASM-blue?style=flat-square)](model/README.md)
[![Model Eval](https://img.shields.io/badge/Model%20F1-0.8636%20(%3E=0.70)-purple?style=flat-square)](model/config.json)
[![Differential Parity](https://img.shields.io/badge/Parity%20Tolerance-%3C1e--4%20Verified-success?style=flat-square)](tests/parite.json)
[![Live Demo](https://img.shields.io/badge/Vercel-Canl%C4%B1%20Yay%C4%B1n-black?style=flat-square&logo=vercel)](https://flying-iron-c566m6c.tmp.now)
[![GitHub](https://img.shields.io/badge/GitHub-belinaydikmen3%2FSE--Primer-blue?style=flat-square&logo=github)](https://github.com/belinaydikmen3/SE-Primer)

> **YZM301 Yazılım Mühendisliği Dersi Projesi**  
> *"08:00. Hastane randevu sistemi çöktü. Nöbetçi yazılım mühendisi sensin. 300 hasta bekliyor. Dün gece yeni sürüm yayımlandı. Ne yaparsın?"*

The Primer v2; yazılım mühendisliği kararlarını (Mimari Rollback, Test/Dağıtım Stratejileri, KVKK ve Veri Gizliliği) oyunlaştırarak öğreten, **tarayıcı içinde çalışan bir makine öğrenmesi modeliyle (`onnxruntime-web`)** oyuncunun davranışlarını anlık ölçümleyen ve zorlandığı anda **kişiselleştirilmiş Sokratik AI Tutor desteği** sunan mobil öncelikli bir simülasyondur.

---

## 1. The Primer v1 ile v2 Arasındaki Farklar

| Kriter | The Primer v1 | The Primer v2 |
|---|---|---|
| **Kişiselleştirme Motoru** | Başlangıçtaki 3 anket sorusuna dayalı sabit if/else kuralları | Oyuncunun sahnelerdeki anlık davranışlarını izleyen **ONNX Makine Öğrenmesi Modeli** |
| **Model Hedefi** | Yok | **"Oyuncunun mevcut sahnede zorlandığını ve desteğe ihtiyacı olup olmadığını tahmin etmek"** (`destek_gerekli`: 0 / 1) |
| **Girdi Davranışları** | Ölçülmüyordu | 8 metrik: `karar_suresi_sn`, `karar_degistirme_sayisi`, `onceki_basarisiz_karar_sayisi`, `ortalama_karar_suresi_sn`, `sahne_zorlugu`, `yardim_kullanim_sayisi`, `oyuncu_deneyim_seviyesi`, `sahne_ilerleme_orani` |
| **Oyun Adaptasyonu** | Statik ipucu ve sayaç | Model desteğe ihtiyaç olduğunu tahmin ettiğinde nazik AI Tutor desteği (`AdaptivePromptCard`) ve süre rahatlatması |
| **Veri Toplama Altyapısı** | Yok | Anonim KVKK uyumlu **Veri Toplama Modu**, `data/oturumlar.csv`, `data/SOZLUK.md` ve CSV dışa aktarımı |
| **Test Mimarisi** | Cypress E2E (16 test) | Cypress E2E (18 test) + Python Oracle ile **Diferansiyel Parite Testi** (`abs(p_python - p_browser) < 1e-4`) |
| **Model Dağıtımı** | Doğrudan kod içi kural | Hugging Face Hub (Commit Hash Sabitleme) + ONNX Runtime Web |

---

## 2. En Fazla 3 Komutla Temel Kurulum ve Çalıştırma

Projeyi yerel ortamınızda baştan sona ayağa kaldırmak için gereken 3 temel komut:

```bash
# 1. Bağımlılıkları yükleyin (Node.js ve Python)
npm install && python -m pip install -r requirements.txt

# 2. Makine öğrenmesi modelini eğitin, ONNX'e dönüştürün ve pariteyi doğrulayın
python train.py && python tests/parite.py

# 3. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı açabilirsiniz.

---

## 3. Makine Öğrenmesi Mimarisi ve Eğitim Süreci

### 3.1 Model ve Özellik Sözleşmesi
Model, scikit-learn ile eğitilmiş ve `skl2onnx` ile ONNX formatına (`model/model.onnx`) dönüştürülmüş şeffaf bir **Karar Ağacı (`DecisionTreeClassifier`, max_depth=3)** modelidir.

Modelin beklediği 8 öznitelik ve kesin sıralama:
1. `karar_suresi_sn` (float32): Karar ekranında geçen süre.
2. `karar_degistirme_sayisi` (float32): Şıklar arasındaki tereddüt/geçiş sayısı.
3. `onceki_basarisiz_karar_sayisi` (float32): Önceki adımlardaki hatalı seçim sayısı.
4. `ortalama_karar_suresi_sn` (float32): Oturumdaki ortalama karar süresi.
5. `sahne_zorlugu` (float32): Sahnenin zorluk katsayısı (0.50 - 0.80).
6. `yardim_kullanim_sayisi` (float32): Alınan ipucu/tutor danışma sayısı.
7. `oyuncu_deneyim_seviyesi` (float32): Junior=0, Mid=1, Senior=2.
8. `sahne_ilerleme_orani` (float32): Adım ilerlemesi (0.33, 0.67, 1.00).

### 3.2 Tekrarlanabilir Eğitim ve Oturum Sızıntısını Önleme
- **Komut:** `python train.py`
- **Tohum (Seed):** `random_state=42`
- **Bölümleme:** `GroupShuffleSplit` kullanılarak aynı oturuma ait kararların hem eğitim hem test setine dağılması (session leakage) engellenmiştir.
- **Kabul Eşiği:** $\text{F1} \ge 0.70$ (Eğitim öncesi tanımlanmıştır; eşik geçilemezse `train.py` başarısız çıkış koduyla durur).

**Gerçekleşen Eğitim Metrikleri:**
- F1 Skoru: **0.8636** (Kabul eşiği $\ge 0.70$ geçildi)
- Precision: **1.0000** | Recall: **0.7600** | Accuracy: **0.8667**
- Sklearn vs ONNX Sayısal Farkı: **$8.51 \times 10^{-9}$** ($< 10^{-4}$ tolerans sağlandı)
- Detaylı model kartı: [`model/README.md`](model/README.md)
- Model sözleşmesi: [`model/config.json`](model/config.json)

---

## 4. Tarayıcıda ONNX Çıkarımı ve Davranışsal Adaptasyon

- Tarayıcıda `onnxruntime-web` kütüphanesi WebAssembly (`wasm`) backend'i ile çalıştırılır.
- Oyuncu sahnede karar verirken geçen süre ve tereddütler ölçülür; model periyodik olarak çıkarım yapar.
- Model pozitif sınıf olasılığı $p \ge 0.50$ (`destek_gerekli = 1`) hesapladığında:
  - Ekranda mor renkli `[data-cy="adaptive-prompt-card"]` belirir:  
    *"Primer, bu kriz adımında karar verirken biraz zorlandığını fark etti. İstersen birlikte düşünelim; acele etmene gerek yok."*
  - Oyuncu *"💡 Birlikte Düşünelim"* diyerek ipuçlarını açabilir veya desteği reddedip normal devam edebilir.
  - Senior modda geri sayım sayacı 30 saniyenin altındaysa panik yaşanmaması için $+30$ saniye rahatlama süresi verilir.
- Model $p < 0.50$ hesapladığında oyuncunun deneyimi bölünmez; normal editoryal kriz akışı sürdürülür.

---

## 5. Veri Toplama Sistemi (Data Collection Mode)

- **Dosya:** `data/oturumlar.csv`
- **Sözlük:** [`data/SOZLUK.md`](data/SOZLUK.md)
- **KVKK ve Gizlilik İlkeleri:**
  - Ad, e-posta, IP, konum veya cihaz kimliği **kesinlikle toplanmaz**.
  - Oturum kimliği rastgele UUID ile üretilir (`ses_xxxxxxxx`).
  - Oyuncu onboarding ekranında "Anonim Veri Toplama Modu"nu açıp kapatabilir.
  - Simülasyon sonunda oyuncu kendi anonim oturum verisini tek tıkla CSV olarak indirebilir (`[data-cy="export-csv-btn"]`).
  - Gerçek oturumlar ile sentetik eğitim verileri `kaynak` sütunu altında (`gercek` / `sentetik`) şeffaf biçimde ayrılmıştır.

---

## 6. Python Test Oracle ve Cypress Diferansiyel Parite Testi

- **Python Oracle Betiği:** `python tests/parite.py`
  - `model/model.onnx` dosyasını `onnxruntime` ile çalıştırarak en az 5 farklı referans girdi vektörü için altın standart olasılıkları hesaplar ve `tests/parite.json` dosyasına yazar.
- **Geliştirici Denetleyicisi (Dev Inspector):**
  - Uygulama başlığındaki `⚙️ ML` butonu tıklandığında açılır.
  - Tahmin edilen anlık olasılık `data-cy="p"` seçicisiyle DOM'da erişilebilirdir.
- **Cypress Diferansiyel Testi (`08_v2_parity_and_differential.cy.ts`):**
  - `tests/parite.json` dosyasını okur, referans vektörleri tarayıcıya girer ve her girdi için $|p_{\text{python}} - p_{\text{browser}}| < 10^{-4}$ şartını uçtan uca doğrular.

---

## 7. Testleri Çalıştırma

```bash
# 1. Statik kod analizi (Oxlint)
npm run lint

# 2. TypeScript ve Vite derleme kontrolü
npm run build

# 3. AI Tutor etiketleme analizi (20 vaka)
npm run eval

# 4. Cypress E2E ve Diferansiyel Parite Testleri (Headless)
npm run test:e2e
```

**Cypress Test Kapsamı (18/18 Başarılı):**
1. `01_onboarding_and_personalization.cy.ts` (Form, rol, hedef ve v2 rozetleri)
2. `02_beginner_and_experienced_flows.cy.ts` (Junior ipucu, Senior 60s sayaç ve zaman aşımı)
3. `03_game_paths_and_outcomes.cy.ts` (Son A, Son B ve çift tıklama koruması)
4. `04_socratic_tutor_and_safety.cy.ts` (Sokratik Tutor ve cevap ele vermeme güvenlik bariyeri)
5. `05_mobile_viewport.cy.ts` (iPhone SE ve modern mobil ekranlarda sıfır yatay kaydırma)
6. `06_demo_walkthrough_40s.cy.ts` (Baştan sona kriz akışı)
7. `07_v2_model_inference_and_adaptation.cy.ts` (Model çıkarımı, adaptif kart tetiklenmesi, CSV dışa aktarımı)
8. `08_v2_parity_and_differential.cy.ts` (Python Oracle ile WebAssembly diferansiyel parite doğrulaması)

---

## 8. Hugging Face Model Yayınlama ve Sürüm Sabitleme

Model dosyaları Hugging Face Hub üzerinde herkese açık bir model deposunda yayınlanmaya hazır şekilde yapılandırılmıştır.

```bash
# Hugging Face yayınlama komutu:
python hf_cli.py --repo <kullanici_adi>/primer-v2-adaptive --token <HF_TOKEN>
```

**Sürüm Sabitleme (Commit Hash Pinning):**
Model tüketicisi asla dinamik `main` dalını değil, commit hash ile sabitlenmiş URL'yi kullanır:
`https://huggingface.co/<kullanici>/<repo>/resolve/<COMMIT_HASH>/model.onnx`

Ayrıntılı dağıtım, geri alma (rollback), gölge (shadow) ve kanarya (%5) dağıtım planı için: [`RELEASE.md`](RELEASE.md)

---

## 9. Model ve Veri Kısıtları

1. **Eğitim Verisi:** Başlangıç modeli 60 sentetik oturum (180 satır) üzerinden bootstrap edilmiştir. Gerçek kullanıcı testleri yapıldıkça `data/oturumlar.csv` dosyasına `kaynak="gercek"` satırları eklenecek ve model periyodik olarak güncellenecektir.
2. **Kullanım Kapsamı:** Model sadece oyunlaştırılmış kriz simülasyonu içinde pedagojik yönlendirme sağlamak amacıyla tasarlanmıştır; gerçek bir hastane acil durumunda otomatik karar verici olarak kullanılamaz.
3. **Kullanıcı İradesi:** Model desteğe ihtiyaç olduğunu tahmin etse dahi nihai mühendislik kararı ve desteği reddetme hakkı daima oyuncuya aittir.

---

## 10. Proje Teslim Belgeleri

- 📋 **Sistem Spesifikasyonu:** [`spec.md`](spec.md) (v1 temeli + v2 ML spesifikasyonu)
- 📊 **Veri Sözlüğü:** [`data/SOZLUK.md`](data/SOZLUK.md)
- 🏷️ **Model Kartı:** [`model/README.md`](model/README.md)
- 🚀 **Dağıtım ve Güvenli Sürüm Planı:** [`RELEASE.md`](RELEASE.md)
- 📝 **Vize / Sınav Sorusu Tasarımı:** [`SINAV_TASARIMI.md`](SINAV_TASARIMI.md)
- 🎬 **Demo Video Senaryosu (75 sn):** [`DEMO_SENARYOSU.md`](DEMO_SENARYOSU.md)
- 🤖 **Google AI Studio Konfigürasyonu:** [`ai-studio/prompt-config.json`](ai-studio/prompt-config.json)

---

## 11. AI Kullanım Beyanı

The Primer v2 projesinin geliştirilmesinde Google Antigravity yapay zeka kodlama asistanından aşağıdaki kapsamda faydalanılmıştır:

1. **Mimari Analiz ve Entegrasyon Tasarımı:** Mevcut The Primer v1 projesinin kod tabanı, spec'i ve testleri incelenmiş; v1 çalışan özelliklerine dokunulmadan v2 makine öğrenmesi ve veri toplama katmanlarının entegrasyon şeması tasarlanmıştır.
2. **Tabular ML ve ONNX Pipeline:** `train.py` betiğinde scikit-learn Karar Ağacı modelinin tekrarlanabilir eğitimi, `GroupShuffleSplit` ile oturum sızıntısının engellenmesi ve `skl2onnx` ile WebAssembly uyumlu ONNX dönüşümü Antigravity desteğiyle kodlanmıştır.
3. **Python Test Oracle ve Cypress Diferansiyel Parite:** `tests/parite.py` ve `08_v2_parity_and_differential.cy.ts` testlerinin matematiksel tolerans ($10^{-4}$) doğrulama mantığı oluşturulmuştur.
4. **Manuel İnceleme ve Denetim:** Üretilen tüm Python eğitim çıktıları, F1 eşik kontrolleri, ONNX çıkarım hızları ve Cypress test raporları geliştirici tarafından bizzat terminalde çalıştırılarak doğrulanmış; gerçek olmayan hiçbir veri veya sahte metrik kullanılmamıştır.
