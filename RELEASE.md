# The Primer v2 — Güvenli Dağıtım ve Sürüm Planı (RELEASE.md)

Bu doküman, **The Primer v1** ile **The Primer v2** arasındaki mimari farkları, model sürümleme stratejisini, Hugging Face commit hash sabitlemesini, geri alma (rollback) adımlarını ve üretim aşamasındaki dağıtım (deployment) modellerini tanımlar.

---

## 1. The Primer v1 ile v2 Arasındaki Değişiklikler

| Özellik / Kriter | The Primer v1 (Ekim 2026) | The Primer v2 (Kasım 2026) |
|---|---|---|
| **Kişiselleştirme Temeli** | Girişteki 3 statik soruya dayalı sabit kurallar | Gerçek zamanlı davranışsal Makine Öğrenmesi (`onnxruntime-web`) |
| **Model Türü** | Statik Sezgisel Kural Motoru + LLM Proxy | Tabular Karar Ağacı (`DecisionTreeClassifier` -> `model.onnx`) |
| **Girdi Davranışları** | Ölçülmüyordu | 8 metrik: Karar süresi, tereddüt/değiştirme, önceki hatalar, zorluk vb. |
| **Hedef Değişken** | Yok (doğrudan şık seçimi) | `destek_gerekli` (0 veya 1) |
| **Oyun Adaptasyonu** | Seviyeye göre statik ipucu/sayaç | Zorlanan oyuncuya proaktif Sokratik destek ve süre rahatlatması |
| **Veri Toplama** | Yok | Anonim KVKK uyumlu Veri Toplama Modu + CSV Dışa Aktarma |
| **Test Mimarisi** | Cypress E2E (16 test) | E2E + Python Oracle Diferansiyel Parite Testi (`abs(p) < 1e-4`) |
| **Model Dağıtımı** | Doğrudan kod içi kurallar | Hugging Face Hub (Sabit Commit Hash) + ONNX Runtime |

---

## 2. Model Sürümü ve Commit Hash Sabitleme

- **Mevcut Model Sürümü:** `v2.0`
- **Hugging Face Model Deposu:** [`blny66/the-primer-v2`](https://huggingface.co/blny66/the-primer-v2)
- **Doğrulanmış Commit Hash:** `c9118676b7c410e948b73155e10e22b43561def9`
- **Sözleşme Dosyaları:** `model/model.onnx`, `model/config.json`, `model/README.md`
- **Dağıtım Kuralı (Immutability):**
  Model istemcisi (browser runtime) asla `main` veya `latest` gibi hareketli (mutable) dalları hedeflemez. Model ve konfigürasyon dosyaları **tam commit hash** ile sabitlenmiş URL üzerinden çekilir:

```text
https://huggingface.co/blny66/the-primer-v2/resolve/c9118676b7c410e948b73155e10e22b43561def9/model.onnx
https://huggingface.co/blny66/the-primer-v2/resolve/c9118676b7c410e948b73155e10e22b43561def9/config.json
```

Bu yöntem, üretim ortamında istemcilerin farklı zamanlarda farklı model ağırlıklarını yüklemesini (model drift / cache poisoning) kesin olarak engeller.

---

## 3. Dağıtım Stratejileri ve The Primer'a Uygulanması

### 3.1 Shadow Deployment (Gölge Dağıtım)
- **Amaç:** Yeni eğitilen modelin (`v2.1`) oyun davranışını değiştirmeden arka planda sessizce çalıştırılarak gerçek kullanıcı verisindeki tahmin performansının izlenmesi.
- **The Primer Uygulaması:**
  1. Kullanıcı sahnede karar verdiğinde hem mevcut üretim modeli (`v2.0`) hem de gölge model (`v2.1`) aynı girdi tensörüyle tetiklenir.
  2. Kullanıcıya yalnızca `v2.0` modelinin önerisi gösterilir.
  3. `v2.1` modelinin ürettiği olasılık (`p_shadow`), hesaplama süresi ve bellek tüketimi `console` / analitik günlüğüne anonim olarak kaydedilir.
  4. Gölge modelin F1 ve karar tutarlılığı doğrulanana kadar oyuncu arayüzüne hiçbir etkisi olmaz.

### 3.2 Canary Deployment (%5 Kanarya Yayını)
- **Amaç:** Yeni model sürümünü ilk olarak kullanıcıların yalnızca %5'lik küçük bir dilimine açarak olası çökme veya pedagojik anomalileri erken yakalamak.
- **The Primer Uygulaması:**
  1. Oturum başladığında üretilen rastgele `oturum_id` (UUID) kullanılarak deterministik bir hash hesaplanır:
     $$\text{bucket} = \text{hash}(\text{oturum\_id}) \pmod{100}$$
  2. $\text{bucket} < 5$ olan oturumlar için `v2.1` modeli yüklenir; diğer %95 kullanıcı için kararlı `v2.0` modeli çalışmaya devam eder.
  3. Kanarya grubunda kullanıcı geri bildirimleri (desteği reddetme oranı, oturumu tamamlama oranı) izlenir.

### 3.3 Progressive Rollout (Kademeli Dağıtım: %25 -> %50 -> %100)
- **Geçiş Kriterleri:**
  - Kanarya fazında hata oranı $< \%0.1$,
  - Model çıkarım süresi $< 15$ ms,
  - Oyuncuların desteği kabul etme oranı $> \%60$.
- **Takvim:**
  - **Aşama 1 (%25):** 24 saat izleme. Sokratik Tutor yanıt kalitesi ve kullanıcı memnuniyeti doğrulanır.
  - **Aşama 2 (%50):** 48 saat izleme. Çeşitli cihaz ve tarayıcılarda WebAssembly bellek kararlılığı izlenir.
  - **Aşama 3 (%100):** Tüm kullanıcılara yeni sürüm sunulur; eski model arşive alınır.

---

## 4. Geri Alma (Rollback) Planı

Eğer yeni model sürümünde beklenmedik bir anomali (aşırı yanlış alarm, tarayıcıda WebAssembly çökmesi veya parite hatası) saptanırsa:

1. **Anında Sabit Versiyona Dönüş:**
   İstemci kodundaki `MODEL_CONFIG.modelPath` veya Hugging Face URL commit hash'i bir önceki kararlı commit hash değerine (`v2.0`) çekilir.
2. **Yedek Sezgisel Mod (Fail-Safe Heuristic Mode):**
   ONNX modeli ağ hatası veya dosya bozulması nedeniyle yüklenemezse oyun motoru çökmeyecek şekilde tasarlanmıştır. Sistem arayüzde `"⚠️ Yedek Sezgisel Mod"` uyarısıyla kural tabanlı deterministik desteğe geçer.
3. **Sıfır Kesinti:** Tarayıcı tabanlı statik dağıtımda rollback süresi 1 dakikadan azdır (Vercel Instant Rollback veya CDN commit güncellemesi).

---

## 5. Üç Farklı Mimari Seçeneğinin Karşılaştırmalı Analizi

| Karşılaştırma Kriteri | Seçenek 1: Tarayıcı İçi (`onnxruntime-web`) [Seçilen] | Seçenek 2: Mobil Cihaz İçi (React Native / Expo) | Seçenek 3: Merkezi Sunucu (FastAPI / Python) |
|---|---|---|---|
| **İnternet Gereksinimi** | **Yalnızca ilk yüklemede.** Model yüklendikten sonra %100 çevrimdışı (offline) çalışır. | **Yok.** Model APK/IPA bundle içinde gömülü gelir, tamamen internetsiz çalışır. | **Zorunlu ve Sürekli.** Her karar adımında sunucuya ağ isteği atılmalıdır. |
| **Gecikme (Latency)** | **Çok Düşük (<5 ms).** Çıkarım doğrudan yerel CPU/WASM üzerinde gerçekleşir; ağ gecikmesi yoktur. | **Çok Düşük (<3 ms).** Mobil NPU veya yerel C++ runtime üzerinde ultra hızlı çalışır. | **Orta / Yüksek (50 - 300 ms).** Ağ gidiş-dönüş süresi (RTT) ve sunucu yüküne bağlıdır. |
| **Verilerin Cihaz Dışına Çıkması (Gizlilik)** | **Tam Gizlilik.** Oyuncunun karar süreleri ve tereddütleri cihazda işlenir, sunucuya aktarılmaz. | **Tam Gizlilik.** Hiçbir davranışsal telemetri cihaz dışına çıkmak zorunda değildir. | **Gizlilik Riski.** Oyuncunun tüm anlık kararları ve zaman damgaları sunucuya gönderilir (KVKK riski). |
| **Model Fikri Mülkiyetinin Gizliliği (IP)** | **Düşük.** `.onnx` dosyası istemciye indirildiği için tersine mühendislikle incelenebilir. | **Orta.** Paket içine gömülüdür ancak decompile edilerek çıkarılabilir. | **Tam Koruma.** Model sunucuda saklanır; istemci yalnızca girdi gönderip çıktı alır. |
| **Altyapı ve Sunucu Maliyeti** | **Sıfır.** Sunucu CPU/GPU maliyeti yoktur. Statik dosya barındırma yeterlidir. | **Sıfır.** İşlem tamamen kullanıcının mobil cihazının donanımında gerçekleşir. | **Yüksek.** Eşzamanlı öğrenci sayısı arttıkça sunucu ölçekleme ve GPU/CPU maliyeti doğar. |
| **Uygulama Karmaşıklığı** | **Düşük / Orta.** Vite ve WebAssembly entegrasyonu kolaydır; tek bir kod tabanıyla tüm cihazlarda çalışır. | **Yüksek.** Mobil derleme, iOS/Android izinleri, mağaza yayın süreçleri gerektirir. | **Orta.** Backend API, rate limiting, oturum yönetimi ve CORS konfigürasyonu gerektirir. |

### Seçim Gerekçesi:
The Primer v2 projesinde **Seçenek 1 (Tarayıcı İçi onnxruntime-web)** tercih edilmiştir. Sıfır sunucu maliyeti, sıfır ağ gecikmesi, KVKK uyarınca kullanıcı verilerinin cihaz dışına çıkmaması ve üniversite öğrencilerinin herhangi bir mobil kurulum yapmadan tarayıcıdan anında oynayabilmesi bu kararın başlıca gerekçeleridir.

