# SE Primer v2 — Veri Sözlüğü (data/SOZLUK.md)

Bu doküman, The Primer v2 projesinde makine öğrenmesi modelinin eğitimi ve çıkarımı (inference) için toplanan davranışsal verilerin şemasını, ölçüm metotlarını, hedef değişken etiketleme kuralını ve etik/gizlilik ilkelerini tanımlar.

---

## 1. Veri Şeması ve Özellik Tanımları

`data/oturumlar.csv` dosyasındaki her bir satır, tek bir oyuncunun belirli bir kriz sahnesinde (Karar 1, 2 veya 3) verdiği **tek bir karara** karşılık gelen davranışsal gözlemdir. Bir oturum (session) genellikle 3 karar satırından oluşur.

| Sütun Adı | Veri Tipi | Ölçü Birimi / Değer Aralığı | Açıklama | Nasıl Ölçülür / Üretilir? |
|---|---|---|---|---|
| `oturum_id` | `string` | UUID / Hex string (Örn: `ses_8f2a1b9c`) | Oturuma özgü anonim kimlik. | Tarayıcı oturumu başladığında rastgele (`crypto.randomUUID()` veya zaman damgalı rastgele dizi) üretilir. Asla kullanıcı hesabı veya kimliğiyle eşleştirilmez. |
| `sahne_id` | `string` | `arch`, `test`, `privacy` | Kararın verildiği kriz aşaması. | Oyun motorunun o anki sahne kimliğinden (`DecisionId`) doğrudan alınır. |
| `karar_suresi_sn` | `float` | Saniye ($0.0$ - $120.0+$) | Oyuncunun mevcut sahne yüklendiği andan bir seçeneği nihai olarak onayladığı ana kadar geçen süre. | Sahne mount olduğunda başlatılan yüksek çözünürlüklü zamanlayıcı (`performance.now()`) ile seçim anı arasındaki farkın saniyeye dönüştürülmesiyle ölçülür. |
| `karar_degistirme_sayisi` | `integer` | Adet ($0, 1, 2, \dots$) | Oyuncunun nihai seçimi yapmadan önce A ve B şıkları arasında yaptığı geçiş/tıklama sayısı. | Seçenek butonlarına yapılan her tıklama ve seçim değişikliği sayaçta artırılır. |
| `onceki_basarisiz_karar_sayisi` | `integer` | Adet ($0, 1, 2$) | Mevcut sahneden önceki kararlarda seçilmiş riskli / başarısız (Son B'ye götüren) seçenek sayısı. | Sahne 1'de daima $0$'dır. Sahne 2'de Karar 1 başarısızsa $1$, Sahne 3'te önceki iki karardaki riskli seçimlerin toplamıdır. |
| `ortalama_karar_suresi_sn` | `float` | Saniye ($0.0$ - $120.0+$) | Oturumda o ana kadar verilen tüm kararların ortalama süresi. | İlk sahnede `karar_suresi_sn` değerine eşittir; sonraki sahnelerde önceki sahnelerin sürelerinin kümülatif aritmetik ortalamasıdır. |
| `sahne_zorlugu` | `float` | $0.0 - 1.0$ Katsayı | Sahnenin kavramsal / teknik zorluk düzeyi. | Alan uzmanı değerlendirmesiyle statik atanmıştır: <br>• `arch` (Mimari Rollback): $0.70$ <br>• `test` (Yayın & Test): $0.50$ <br>• `privacy` (KVKK & Log): $0.80$ |
| `yardim_kullanim_sayisi` | `integer` | Adet ($0, 1, 2, \dots$) | Oyuncunun o ana kadar açtığı ipucu sayısı ve AI Tutor'a sorduğu soru sayısı toplamı. | İpucu kartının manuel açılması veya Tutor paneline soru gönderilmesiyle artan sayaçtır. |
| `oyuncu_deneyim_seviyesi` | `integer` | $0, 1, 2$ Kategorik | Başlangıç onboarding formunda seçilen deneyim düzeyi. | Kodlama: <br>• `junior` (Yeni başladım) = $0$ <br>• `mid` (Orta seviyedeyim) = $1$ <br>• `senior` (Deneyimliyim) = $2$ |
| `sahne_ilerleme_orani` | `float` | $0.0 - 1.0$ Oran | Oyuncunun hikâyedeki ilerleme konumu. | Formül: $\frac{\text{stepNumber}}{\text{totalSteps}}$ <br>• Karar 1 (Mimari): $0.33$ <br>• Karar 2 (Test): $0.67$ <br>• Karar 3 (KVKK): $1.00$ |
| `destek_gerekli` | `integer` | `0` veya `1` | **Hedef Değişken (Ground Truth).** Oyuncunun bu sahnede zorlanıp kişiselleştirilmiş desteğe ihtiyaç duyup duymadığı. | Denetlenebilir kural: Uzun karar süresi ($>35$ sn veya $60$ sn kriz süresinin $\%60$'ı), yüksek tereddüt (`karar_degistirme_sayisi >= 2`), önceki adımlarda başarısızlık veya junior seviyede zor sahnede uzun süre kalma durumlarında $1$; aksi halde $0$. |
| `kaynak` | `string` | `gercek` veya `sentetik` | Verinin gerçek oyuncu testinden mi yoksa simüle edilmiş sentetik üreticiden mi geldiğini belirtir. | Gerçek oyuncu oturumları tarayıcıda `gercek` etiketiyle toplanır; eğitim modeli için oluşturulan simülasyon verileri `sentetik` olarak kaydedilir. |

---

## 2. Model Girdi Özellikleri Sıralaması (Feature Order Sözleşmesi)

Modelin beklediği 8 öznitelik ve kesin sırası aşağıdadır:

1. `karar_suresi_sn` (float32)
2. `karar_degistirme_sayisi` (float32)
3. `onceki_basarisiz_karar_sayisi` (float32)
4. `ortalama_karar_suresi_sn` (float32)
5. `sahne_zorlugu` (float32)
6. `yardim_kullanim_sayisi` (float32)
7. `oyuncu_deneyim_seviyesi` (float32)
8. `sahne_ilerleme_orani` (float32)

---

## 3. Hedef Değişken ve Etiketleme Metodolojisi

Hedef değişken `destek_gerekli` binary (ikili) bir sınıftır:
- **`0` (Destek Gerekmiyor):** Oyuncu sahneyi beklenen süre içerisinde, aşırı kararsızlık yaşamadan ve önceki hataları biriktirmeden başarıyla yönetmektedir. Normal hikâye akışı sürdürülür.
- **`1` (Destek Gerekli):** Oyuncu karar vermekte bariz bir zorluk yaşamakta, süre baskısı altında bocalamakta, kararları arasında sıkça gidip gelmekte veya kavramsal olarak desteğe ihtiyaç duymaktadır. Model bu tahmini yaptığında AI Tutor sahneye özel yönlendirici rehberlik sunar.

### Denetlenebilir Etiketleme Kuralı (Heuristic Labeling Rule):
Gerçek kullanıcı oturumlarında ve sentetik üretimde aşağıdaki bileşik koşul `destek_gerekli = 1` olarak etiketlenir:
1. `karar_suresi_sn > 35.0` (Standart ortalama olan 15-20 saniyenin belirgin üzerinde kalma) **VEYA**
2. `karar_degistirme_sayisi >= 2` (Seçimler arasında kararsız kalıp en az 2 kez geçiş yapma) **VEYA**
3. `onceki_basarisiz_karar_sayisi >= 1` ve `karar_suresi_sn > 25.0` (Önceki hatanın üzerine bu sahnede de gecikme) **VEYA**
4. `oyuncu_deneyim_seviyesi == 0` (Junior) ve `sahne_zorlugu >= 0.7` ve `yardim_kullanim_sayisi == 0` ve `karar_suresi_sn > 20.0` (Yardım istemeyen ama zorlanan acemi kullanıcı).

Bu kural, veri sızıntısına (data leakage) yol açmaz; gelecekteki kararları değil yalnızca o anki sahneye kadar gerçekleşen ölçülebilir davranışları kullanır.

---

## 4. Etik, Mahremiyet ve KVKK Uyumu

The Primer projesi 6698 sayılı KVKK ilkelerine sıkı sıkıya bağlıdır:
1. **Sıfır Kişisel Veri (Zero PII):** Ad, soyad, e-posta, telefon, IP adresi, coğrafi konum veya cihaz parmak izi **kesinlikle toplanmaz**.
2. **Anonim Oturum Kimliği:** Oturum kimlikleri tamamen rastgele üretilir ve cihazda kalıcı izleme çerezi bırakılmaz.
3. **Kullanıcı Onayı ve Şeffaflık:** Oyuncuya onboarding ekranında veya ayarlar menüsünde "Anonim Veri Toplama Modu" açıkça sunulur. Kullanıcı dilediğinde bu modu kapatabilir veya oturum sonunda toplanan anonim verilerini CSV olarak indirebilir.
4. **Kaynak Ayrımı:** Gerçek veriler ile sentetik geliştirme verileri `kaynak` sütunu altında açıkça ayrılır; asla sentetik veri gerçekmiş gibi sunulmaz.

