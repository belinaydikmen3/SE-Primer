# YZM301 Yazılım Mühendisliği — Klasik Vize / Final Sınav Sorusu Tasarımı (SINAV_TASARIMI.md)

**Ders:** YZM301 — Yazılım Mühendisliği  
**Konu:** Makine Öğrenmesi Entegreli Yazılım Sistemlerinde Doğrulama, Test Stratejileri ve Dağıtım Güvenliği  
**Hedef Süre:** 20-25 Dakika | **Puan Değeri:** 25 Puan  

---

## 1. Sınav Sorusu Metni

> **Senaryo:**  
> Bir sağlık kriz simülasyonu yazılımında, öğrencilerin karar anlarındaki davranışlarını (karar süresi, şık değiştirme sayısı, sahne zorluğu) girdi alarak öğrencinin desteğe ihtiyacı olup olmadığını tahmin eden bir tabular makine öğrenmesi modeli (`model.onnx`) kullanılmaktadır. Model, Python ortamında eğitilmiş ve tarayıcıda `onnxruntime-web` kütüphanesiyle çalıştırılmaktadır.
> 
> Mühendislik ekibi, modeli v1.0'dan v2.0'a güncellediğinde bazı kullanıcıların tarayıcılarında modelin Python ortamından farklı olasılıklar ürettiğini, bazı durumlarda ise ağ gecikmesi nedeniyle oyunun kilitlendiğini tespit etmiştir.
>
> **Sorular:**  
> **(a)** Bu sistem bağlamında **Verification (Doğrulama)** ile **Validation (Geçerleme)** arasındaki farkı somut birer örnek vererek açıklayınız. *(5 Puan)*  
> **(b)** Modelin Python'daki eğitimi ile tarayıcıdaki WebAssembly çıktısı arasında sayısal sapmalar olabileceği bilinmektedir. Bu sistemde bir **Test Oracle** problemi var mıdır? Mühendislik ekibi bu durumu tespit etmek için **Differential Testing (Diferansiyel Test)** yöntemini nasıl kurmalıdır? *(7 Puan)*  
> **(c)** Yeni model sürümü (v2.0) yayına alınırken mevcut oyun akışının bozulmadığını güvenceye almak için **Regression Testing** ve **Characterization Testing** yaklaşımları nasıl birlikte kullanılmalıdır? *(6 Puan)*  
> **(d)** Model dosyasının tarayıcıya indirilemediği veya WebAssembly motorunun çöktüğü bir sınır durumda sistemin **Fault Tolerance (Hata Toleransı)** mekanizması nasıl işlemelidir? Modelin istemcide sabitlenmesi (version pinning) ve aşamalı dağıtımı (Canary / Shadow) için en kritik iki mühendislik kuralını belirtiniz. *(7 Puan)*

---

## 2. Beklenen Temel Cevap Noktaları (Cevap Anahtarı)

### (a) Verification vs Validation (5 Puan)
- **Verification ("Ürünü doğru mu üretiyoruz?"):** Modelin ve yazılımın teknik spesifikasyona uygunluğu.  
  *Örnek:* ONNX modelinin beklenen 8 girdi özniteliğini doğru sırada alması, $10^{-4}$ sayısal toleransını sağlaması, Cypress testlerinin yeşil yanması.
- **Validation ("Doğru ürünü mü üretiyoruz?"):** Sistem çıktısının öğrencinin gerçek pedagojik ihtiyacını karşılayıp karşılamadığı.  
  *Örnek:* Modelin "destek gerekli" dediği anda AI Tutor'ın sunduğu ipucunun öğrencinin kriz anındaki kavramsal yanılgısını gerçekten çözüp çözmediği.

### (b) Test Oracle ve Differential Testing (7 Puan)
- **Test Oracle Problemi:** Karmaşık ML modellerinde bir girdi vektörünün "kesin teorik doğru olasılığının" analitik olarak önceden bilinmesi zordur (Oracle eksikliği).
- **Diferansiyel Test Çözümü:** Python `onnxruntime` çıktısı "Referans Oracle" (Altın Standart) kabul edilir. Aynı referans girdi seti (`parite.json`) hem Python ortamında hem de tarayıcıda (`onnxruntime-web`) çalıştırılır. İki ortam arasındaki olasılık farkı önceden belirlenen kabul edilebilir eşiğin ($|p_{\text{python}} - p_{\text{browser}}| < 10^{-4}$) altındaysa test başarılı sayılır.

### (c) Regression vs Characterization Testing (6 Puan)
- **Regression Testing:** v2 sürümü eklendiğinde v1'den kalan mevcut 3 soru, karar butonları, geri sayım sayaçları ve Son A / Son B ekranlarının kırılmadığının uçtan uca (E2E) doğrulanması.
- **Characterization Testing:** Eski sistemin mevcut ve belgelenmemiş davranışlarını (örneğin Senior modda 60 saniye dolunca oyunun ne tepki verdiği) bir güvenlik ağı olarak kaydedip yeni model entegrasyonu sonrasında bu davranışların korunduğunu garantiye alma.

### (d) Hata Toleransı ve Güvenli Dağıtım (7 Puan)
- **Hata Toleransı (Graceful Degradation):** Model yüklenemezse veya hata verirse oyun asla beyaz ekran vermez veya donmaz. Sistem arayüzde kullanıcıyı şeffafça bilgilendirerek (`⚠️ Yedek Sezgisel Mod`) kural tabanlı deterministik akışa geçer.
- **Sürüm Sabitleme ve Dağıtım Kuralları:**
  1. *Sabit Commit Hash:* Model istemcisi dinamik `latest` dalı yerine değişmez (immutable) Hugging Face commit hash URL'sini kullanmalıdır.
  2. *Gölge (Shadow) veya Kanarya (Canary %5) Dağıtım:* Yeni model önce oyuncu deneyimini etkilemeden arka planda çalıştırılmalı veya kullanıcıların yalnızca %5'ine açılarak F1 ve hata oranı doğrulanmalıdır.

---

## 3. Olası Öğrenci Kavram Yanılgıları (Common Misconceptions)

1. **"Verification ve Validation aynı şeydir":** Öğrenciler genellikle birim test yazmayı validation sanırlar; oysa birim test verification'dır, kullanıcının gerçekte neye ihtiyaç duyduğu validation'dır.
2. **"Test Oracle her zaman matematiksel bir formüldür":** Öğrenciler ML sistemlerinde her girdinin önceden bilinen kesin bir cevabı olduğunu varsayarlar. Oracle olmadığında diferansiyel testin iki bağımsız uygulayıcıyı yarıştırma gücünü kaçırırlar.
3. **"Hata toleransı hatayı try-catch ile yutmaktır":** Hata toleransı sadece exception yakalamak değil; sistemin temel işlevini (hastane kriz simülasyonu) alternatif güvenli bir mekanizma (fallback rule engine) ile sürdürebilmesidir.
4. **"Canary Deployment rastgele test yapmaktır":** Kanarya dağıtımı kontrolsüz rastgelelik değil; oturum bazlı deterministik hash bucket ile ayrılmış, ölçülebilir bir aşamalı yayın stratejisidir.

