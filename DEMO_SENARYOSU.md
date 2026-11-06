# The Primer v2 — 60-90 Saniyelik Demo Video Senaryosu (DEMO_SENARYOSU.md)

**Ders:** YZM301 — Yazılım Mühendisliği  
**Proje:** The Primer v2 (Makine Öğrenmesi & Davranışsal Adaptasyon)  
**Hedef Süre:** 75 Saniye (01:15)  
**Format:** Bölünmüş Ekran (Split Screen / A-B Kurgusu) veya Sıralı İki Oyuncu Karşılaştırması  
**Ses:** Profesyonel Türkçe dış ses + hafif tempolu operasyonel siber müzik  

---

## 1. Temel Odak ve Karşılaştırma Kurgusu

The Primer v2 demosunun ana mesajı:  
**"Aynı kriz sahnesinde (Karar 1: Mimari Rollback), oyuncunun davranışsal tepkilerine göre yapay zeka modelinin dinamik olarak farklı tepkiler vermesi."**

- **Oyuncu 1 (Zorlanan / Kararsız Öğrenci):** 40 saniye boyunca karar veremez, şıklar arasında geçiş yapar. Model $p > 0.50$ hesaplar; ekranda proaktif Sokratik destek kartı belirir ve süre baskısı hafifletilir.
- **Oyuncu 2 (Kendinden Emin / Hızlı SRE):** 12 saniyede tereddütsüz kararını verir. Model $p < 0.50$ hesaplar; normal kriz akışı hiçbir uyarı açılmadan kesintisiz devam eder.

---

## 2. Saniye Saniye Sahne Planı ve Seslendirme Metni

| Zaman Aralığı | Sahne No | Görsel Eylem / Ekran | Türkçe Dış Ses (Voiceover) | Kurgu & Teknik Not |
|:---:|:---:|---|---|---|
| **00:00 - 00:10** (10 sn) | Sahne 1 | Açılış logosu: *"The Primer v2 · ML Adaptive"*. Onboarding ekranında anonim veri toplama modu gösterilir. | "The Primer v2'ye hoş geldiniz. v1'deki kriz simülasyonumuzu, oyuncunun davranışlarını ölçümleyen gerçek zamanlı bir makine öğrenmesi modeliyle buluşturduk." | "v2 ML Adaptive" rozeti ve "Veri Toplama Modu" kartına zoom-in. |
| **00:10 - 00:35** (25 sn) | Sahne 2: Oyuncu 1 (Zorlanma) | **Karar 1 (Mimari):** Oyuncu ekranda bekler, önce A'ya sonra B'ye tıklar, süre 40s'yi geçer. Arka planda `onnxruntime-web` $p=1.00$ çıkarımı yapar. Ekranda mor parıltılı `[data-cy="adaptive-prompt-card"]` açılır: *"Primer zorlandığını fark etti..."* Öğrenci desteği kabul eder ve ipucu açılır. | "İşte ilk senaryo: Öğrencimiz krizde tereddüt yaşıyor, şıklar arasında gidip geliyor ve süre 40 saniyeyi aşıyor. Model, oyuncunun zorlandığını anında tahmin ediyor ve AI Tutor nazik bir destekle devreye giriyor." | Sayaç hareketi ve `AdaptivePromptCard` animasyonu gösterilir. |
| **00:35 - 00:55** (20 sn) | Sahne 3: Oyuncu 2 (Akıcı Akış) | **Aynı Karar 1 (Mimari):** İkinci oyuncu 12. saniyede tereddütsüz A şıkkına basar. Model $p=0.00$ hesaplar. Hiçbir destek kartı açılmaz, doğrudan Neden-Sonuç analizine geçilir. | "Şimdi aynı sahneyi deneyimli bir mühendisin gözünden izliyoruz. Hızlı ve kararlı adımlarla ilerlendiğinde model desteğe gerek olmadığını biliyor; oyuncunun seçim özgürlüğünü bölmeden normal hikaye akışını sürdürüyor." | Bölünmüş ekran (split-screen) ile Oyuncu 1 ve Oyuncu 2 yan yana gösterilir. |
| **00:55 - 01:10** (15 sn) | Sahne 4: Parite & Veri | Header'dan `⚙️ ML` butonu tıklanır. Geliştirici denetleyicisinde `data-cy="p"` ve Python Oracle ile tarayıcı parite testi gösterilir. Oturum sonunda CSV indirme butonu tıklanır. | "Sistemin arkasında Python'da eğitilip ONNX'e dönüştürülen ve tarayıcıda WebAssembly ile çalışan bir karar ağacı var. Python Oracle ile diferansiyel paritemiz 10 üzeri eksi 4 toleransında kusursuz uyum sağlıyor." | ML Inspector modalındaki `data-cy="p"` ve terminaldeki parite testi çıktısı. |
| **01:10 - 01:15** (5 sn) | Sahne 5 | Terminalde yeşil Cypress E2E testleri (tüm spec'ler geçti) ve GitHub repo kapanışı. | "The Primer v2: Gerçek veriye dayalı, güvenli ve kişiselleştirilmiş yazılım mühendisliği eğitimi." | Bitiş ekranı ve GitHub repo bağlantısı. |

---

## 3. Ekran Kaydı Alacak Kişi İçin Uygulama Adımları

1. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
2. **Tarayıcı Görünümü:**
   Chrome DevTools açın (Ctrl+Shift+I), Cihaz Modunu açın (iPhone 14 Pro - 390x844).
3. **Oyuncu 1 Kaydı:**
   - Onboarding'de "Krize Müdahale Et"e basın.
   - Karar 1'de 40 saniye bekleyin veya header'daki `⚙️ ML` butonuna basıp parite test kutusuna `45.0, 3.0, 0.0, 45.0, 0.7, 0.0, 0.0, 0.33` yazıp "Çalıştır"a basın.
   - Ekranda açılan "Primer zorlandığını fark etti" kartındaki "Birlikte Düşünelim" butonuna tıklayın.
4. **Oyuncu 2 Kaydı:**
   - Yeniden başlatın. Karar 1 ekranı gelir gelmez 5. saniyede doğrudan "A) Eski Sürüme Geri Dön"e basın. Destek kartı çıkmadan Neden-Sonuç kartının açıldığını gösterin.
5. **Diferansiyel Test & CSV:**
   - Debrief ekranına ulaşıp "Anonim Oturum Verisini Dışa Aktar (CSV)" butonuna basın ve inen CSV dosyasını gösterin.

