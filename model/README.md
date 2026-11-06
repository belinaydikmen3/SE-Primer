# The Primer v2 — Model Kartı (model/README.md)

## 1. Model Özeti
- **Model Adı:** The Primer Adaptive Socratic Assistant
- **Sürüm:** v2.0
- **Model Türü:** Açıklanabilir Karar Ağacı (`DecisionTreeClassifier(max_depth=3)`)
- **Format:** ONNX (`model.onnx`, ZipMap=False)
- **Hedef Değişken:** `destek_gerekli` (0: Normal akış, 1: Kişiselleştirilmiş AI Tutor desteği gerekli)

## 2. Amaç ve Kullanım Senaryosu
Bu model, The Primer kriz simülasyonunu oynayan mühendislik öğrencilerinin karar anlarındaki davranışlarını (karar süresi, şık değiştirme sıklığı, önceki başarısızlıklar, deneyim düzeyi) anlık olarak izleyerek öğrencinin sahnede **bocalayıp bocaladığını** tahmin eder.
- Model `1` (Destek Gerekli) tahmin ettiğinde AI Tutor nazikçe devreye girer: *"Primer bu bölümde biraz zorlandığını fark etti. Birlikte düşünelim mi?"*
- Model `0` tahmin ettiğinde oyunun editoryal temposu bozulmaz; normal kriz akışı sürdürülür.

## 3. Girdi Özellikleri (Feature Contract)
Model tam olarak aşağıdaki 8 özniteliği, belirtilen kesin sırada ve `float32` tipinde bekler:

| Sıra | Özellik Adı | Veri Tipi | Açıklama |
|:---:|---|---|---|
| 1 | `karar_suresi_sn` | float32 | Sahne karar süresi (sn) |
| 2 | `karar_degistirme_sayisi` | float32 | Karar değiştirmeler (tereddüt) |
| 3 | `onceki_basarisiz_karar_sayisi` | float32 | Önceki adımlardaki hatalar |
| 4 | `ortalama_karar_suresi_sn` | float32 | Oturumdaki ortalama süre |
| 5 | `sahne_zorlugu` | float32 | Sahne zorluğu (0.50 - 0.80) |
| 6 | `yardim_kullanim_sayisi` | float32 | Alınan ipucu/tutor sayısı |
| 7 | `oyuncu_deneyim_seviyesi` | float32 | Onboarding seviyesi (0, 1, 2) |
| 8 | `sahne_ilerleme_orani` | float32 | Hikayedeki ilerleme oranı (0.33, 0.67, 1.0) |

## 4. Eğitim ve Değerlendirme Verisi
- **Eğitim Seti Boyutu:** 135 gözlem (45 oturum)
- **Test Seti Boyutu:** 45 gözlem (15 oturum)
- **Veri Bölümleme Stratejisi:** `GroupShuffleSplit(test_size=0.25, random_state=42)` ile oturum sızıntısı (session leakage) engellenmiştir.
- **Kabul Eşiği (Önceden Tanımlanmış):** F1 >= 0.70

## 5. Doğrulama Metrikleri
- **F1 Skoru:** 0.8636
- **Precision:** 1.0000
- **Recall:** 0.7600
- **Accuracy:** 0.8667
- **Karmaşıklık Matrisi (CM):** TN=20, FP=0, FN=6, TP=19
- **ONNX Sayısal Doğrulaması:** `abs(sklearn - onnx) = 8.5149e-09 < 1e-4`

## 6. Kısıtlar ve Kullanılmaması Gereken Durumlar
1. Bu model yalnızca The Primer kriz simülasyonu oyun bağlamında geliştirilmiştir; gerçek bir hastane krizinde karar verici olarak kullanılamaz.
2. Sentetik bootstrap verisiyle eğitilmiştir; gerçek oyuncu oturumları toplandıkça model periyodik olarak yeniden eğitilmelidir.
3. Model desteğe ihtiyaç olduğunu tahmin etse dahi oyuncunun seçimi reddetme ve kendi kararıyla devam etme özgürlüğü kısıtlanamaz.

## 7. Gizlilik ve Etik Değerlendirme
Model hiçbir kişisel tanımlayıcı (ad, IP, konum) kullanmaz. Tüm davranışsal değişkenler anonim oturum seviyesinde hesaplanır.
