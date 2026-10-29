# SE Primer — 60 Saniyelik YouTube Demo Video Senaryosu (docs/demo-script.md)

**Ders:** YZM301 — Yazılım Mühendisliği  
**Proje:** SE Primer — Yazılım Mühendisliği Kriz Simülasyonu & Sokratik AI Tutor  
**Hedef Süre:** Tam 60 Saniye (00:00 - 01:00)  
**Format:** Dikey Mobil Ekran Kaydı (9:16 / 1080x1920) veya Ortalı Mobil Kart (16:9 / 1920x1080)  
**Ses:** Türkçe profesyonel anlatım + hafif tempolu arka plan müziği (teknik kriz operasyonu hissi)

---

## 1. Ekran Kaydı Öncesi Hazırlık Kontrol Listesi

1. **Geliştirme Sunucusu:** `npm run dev` çalışır durumda olmalı (`http://localhost:5173`).
2. **Ekran Boyutu:** Chrome DevTools üzerinden iPhone 14 Pro (390x844) mobil görünümüne alınmalı.
3. **Temizlik:** Tarayıcı sekmeleri, yer imleri çubuğu ve masaüstü bildirimleri kapatılmalı.
4. **Gizlilik:** Ekranda hiçbir kişisel e-posta, API anahtarı veya Windows kullanıcı yolu görünmemeli.
5. **Kayıt Aracı:** OBS Studio veya Windows Game Bar (Win + G) ile 60 FPS, yüksek bit hızında kayıt ayarlanmalı.

---

## 2. Saniye Saniye Sahne Planı ve Seslendirme Metni

| Zaman Aralığı | Sahne No | Ekranda Gösterilen İçerik (Görsel Eylem) | Türkçe Seslendirme Metni (Voiceover) | Kurgu & Geçiş Notu |
|:---:|:---:|---|---|---|
| **00:00 - 00:05** (5 sn) | Sahne 1 | Açılış logosu "SE PRIMER", alarm göstergesi: *"08:00 Randevu sistemi çöktü, 300 hasta bekliyor!"* | "08:00. Hastane randevu sistemi çöktü, 300 hasta kapıda bekliyor. Nöbetçi yazılım mühendisi sensin. Ne yaparsın?" | Kırmızı kriz rozeti vurgusu, dikkat çekici giriş. |
| **00:05 - 00:12** (7 sn) | Sahne 2 | Ekran 1 (Kişiselleştirme): Seviye: Deneyimliyim (60s süre), Rol: Geliştirici, Hedef: Mimari seçilir. "Krize Müdahale Et" butonuna tıklanır. | "SE Primer'da deneyim seviyeni ve rolünü seçiyorsun. Deneyimli modda her karar için 60 saniyelik gerçek kriz baskısı başlıyor." | Hızlı tıklamalarla chip seçimleri gösterilir. |
| **00:12 - 00:24** (12 sn) | Sahne 3 | Ekran 2 (Karar 1 - Mimari): 60s sayaç geri sayıyor. "A) Eski Sürüme Geri Dön" seçilir. Neden-Sonuç Kartı açılır (v2.3.9'a dönüldü, şema kontrolü yapıldı). "Devam Et"e basılır. | "İlk karar: Mimari geri dönüş mü, canlıda sıcak yama mı? Rollback'i seçtiğimizde sistem, şema uyumluluğu kontrolüyle güvenli şekilde v2.3.9'a dönüyor." | Sayaç hareketi ve Neden-Sonuç kartı netçe görünür. |
| **00:24 - 00:36** (12 sn) | Sahne 4 | Ekran 2 (Karar 2 - Test): "A) Kısa Ama Kritik Testleri Koş" seçilir. Neden-Sonuç kartında 10 dakikalık duman testinin regresyonu önlediği görülür. | "İkinci karar: Hastalar beklerken testleri atlayalım mı? 10 dakikalık kritik duman testleri, çift randevu felaketini canlıya çıkmadan engelliyor." | Hızlı geçiş, teknik gerekçe vurgusu. |
| **00:36 - 00:46** (10 sn) | Sahne 5 | Ekran 2 (Karar 3 - KVKK): Logda hasta Ahmet Yılmaz'ın TC'si görünür. AI Tutor'a "Slack'e atsam olur mu?" yazılır. Tutor "Veri minimizasyonuna uyar mı?" diye sorar. "Maskele" seçilir. | "Üçüncü karar: Logda hasta TC'si var! Sokratik AI Tutor cevabı fısıldamıyor; veri minimizasyonunu düşündürüyor. Kişisel veriyi maskeleyerek güvenle paylaşıyoruz." | Sokratik Tutor paneli ve chat baloncuğu yakınlaşır (zoom-in). |
| **00:46 - 00:54** (8 sn) | Sahne 6 | Ekran 3 (Sonuç): Yeşil parlak banner açılır: *"08:25 Sistem Ayakta, Veri Güvende (Son A)"*. Metrik kartları (%99.98 erişilebilirlik, KVKK tam uyumlu). Kısaca Son B görseli gösterilir. | "Ve sonuç: 08:25'te sistem ayakta, veri güvende! Yanlış kararlar alsaydık Son B'de ağır bir KVKK ihlaliyle karşılaşacaktık." | Son A ekranı ve alternatif Son B split-cut gösterimi. |
| **00:54 - 01:00** (6 sn) | Sahne 7 | Terminalde koşan Cypress testleri (16/16 All specs passed!) ve GitHub depo kapanış kartı. | "16 uçtan uca Cypress testiyle doğrulanan SE Primer, yazılım mühendisliğini yaşayarak öğretiyor." | Cypress yeşil onay tikleri ve proje kapanışı. |

---

## 3. 60 Saniyeyi Aşmama Kurgu Notları

1. **Tempo (Pacing):** Seslendirme metni toplam 114 kelimedir. Normal konuşma hızında (~130 kelime/dk) yaklaşık 52 saniye sürer; sahne geçişleri ve ara nefeslerle tam 58-60 saniyeye oturur.
2. **Jump-Cut Kullanımı:** Form seçimleri ve metin yazma kısımlarındaki fare hareketleri aralıksız hızlandırılmalı (1.5x speed-up), duraksama payı bırakılmamalıdır.
3. **Alt Yazı (Captions):** Sosyal medya ve sessiz izlemeler için CapCut, Premiere veya DaVinci Resolve ile büyük, yüksek kontrastlı Türkçe dinamik altyazı eklenmelidir.
4. **Teslimat Durumu:** Bu senaryo hazırlandıktan sonra ekran kaydı alınıp YouTube'a Unlisted (Liste Dışı) olarak yüklenecek ve bağlantısı `README.md` dosyasına eklenecektir. Henüz video kaydedilmediyse README'de açıkça adımlar belirtilmelidir.
