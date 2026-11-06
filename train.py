#!/usr/bin/env python3
"""
The Primer v2 — Adaptive Socratic AI Assistant Model Trainer
Eğitim Komutu: python train.py
Amaç: Oyuncunun kriz sahnesinde zorlanıp desteğe ihtiyaç duyup duymadığını tahmin etmek.
"""

import os
import sys
import json
import shutil
import numpy as np
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    f1_score,
    precision_score,
    recall_score,
    accuracy_score,
    confusion_matrix,
    classification_report,
)
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnxruntime as ort

RANDOM_STATE = 42
ACCEPTANCE_THRESHOLD = 0.70  # Önceden tanımlanmış F1 kabul eşiği
DECISION_THRESHOLD = 0.50

FEATURE_NAMES = [
    "karar_suresi_sn",
    "karar_degistirme_sayisi",
    "onceki_basarisiz_karar_sayisi",
    "ortalama_karar_suresi_sn",
    "sahne_zorlugu",
    "yardim_kullanim_sayisi",
    "oyuncu_deneyim_seviyesi",
    "sahne_ilerleme_orani",
]

def main():
    print("=" * 60)
    print("      THE PRIMER v2 — MAKİNE ÖĞRENMESİ MODEL EĞİTİMİ        ")
    print("=" * 60)

    # 1. Veri Yükleme
    csv_path = os.path.join("data", "oturumlar.csv")
    if not os.path.exists(csv_path):
        print(f"HATA: {csv_path} bulunamadı!")
        sys.exit(1)

    df = pd.read_csv(csv_path)
    total_rows = len(df)
    total_sessions = df["oturum_id"].nunique()
    print(f"\n[1/6] Veri Yüklendi:")
    print(f"  • Toplam Gözlem (Satır) Sayısı : {total_rows}")
    print(f"  • Toplam Oturum Sayısı        : {total_sessions}")
    print(f"  • Kaynak Dağılımı             : {dict(df['kaynak'].value_counts())}")

    # Sınıf Dağılımı
    class_counts = df["destek_gerekli"].value_counts().to_dict()
    pos_count = class_counts.get(1, 0)
    neg_count = class_counts.get(0, 0)
    pos_ratio = pos_count / total_rows
    print(f"  • Sınıf Dengesi: Destek Gerekli (1) = {pos_count} (%{pos_ratio*100:.1f}), Destek Yok (0) = {neg_count} (%{(1-pos_ratio)*100:.1f})")

    X = df[FEATURE_NAMES].values.astype(np.float32)
    y = df["destek_gerekli"].values.astype(np.int64)
    groups = df["oturum_id"].values

    # 2. Oturum Bazlı Veri Sızıntısını Önleyen Bölümleme (GroupShuffleSplit)
    print(f"\n[2/6] Tekrarlanabilir Oturum Bazlı Bölümleme (GroupShuffleSplit, random_state={RANDOM_STATE}):")
    gss = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=RANDOM_STATE)
    train_idx, test_idx = next(gss.split(X, y, groups))

    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    train_sessions = len(set(groups[train_idx]))
    test_sessions = len(set(groups[test_idx]))

    print(f"  • Eğitim Kümesi   : {len(X_train)} satır ({train_sessions} benzersiz oturum)")
    print(f"  • Değerlendirme   : {len(X_test)} satır ({test_sessions} benzersiz oturum)")
    overlap = set(groups[train_idx]).intersection(set(groups[test_idx]))
    print(f"  • Oturum Sızıntı Kontrolü (Train/Test Kesişim): {len(overlap)} oturum (Hedef: 0)")
    assert len(overlap) == 0, "HATA: Oturum sızıntısı tespit edildi!"

    # 3. Model Eğitimi (Şeffaf ve Yorumlanabilir Decision Tree)
    print(f"\n[3/6] Model Eğitiliyor (DecisionTreeClassifier, max_depth=3, min_samples_leaf=2):")
    model = DecisionTreeClassifier(
        max_depth=3,
        min_samples_leaf=2,
        random_state=RANDOM_STATE
    )
    model.fit(X_train, y_train)
    print("  • Model başarıyla eğitildi.")

    # 4. Değerlendirme Metrikleri
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    precision = float(precision_score(y_test, y_pred, zero_division=0))
    recall = float(recall_score(y_test, y_pred, zero_division=0))
    accuracy = float(accuracy_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    print(f"\n[4/6] Değerlendirme Sonuçları:")
    print(f"  • F1-Score      : {f1:.4f} (Kabul Eşiği: {ACCEPTANCE_THRESHOLD:.2f})")
    print(f"  • Precision     : {precision:.4f}")
    print(f"  • Recall        : {recall:.4f}")
    print(f"  • Accuracy      : {accuracy:.4f}")
    print(f"  • Karmaşıklık Matrisi (CM):\n    [TN: {cm[0][0]}, FP: {cm[0][1]}]\n    [FN: {cm[1][0]}, TP: {cm[1][1]}]")
    print("\nDetaylı Sınıflandırma Raporu:")
    print(classification_report(y_test, y_pred, target_names=["Destek Yok (0)", "Destek Gerekli (1)"]))

    # Kabul Eşiği Kontrolü
    if f1 < ACCEPTANCE_THRESHOLD:
        print(f"HATA: Model F1 skoru ({f1:.4f}) kabul eşiğinin ({ACCEPTANCE_THRESHOLD:.2f}) ALTINDA KALDI!")
        print("Model yayınlanmayacak ve işlem durdurulacaktır.")
        sys.exit(1)
    else:
        print(f"✓ KABUL EŞİĞİ GEÇİLDİ: {f1:.4f} >= {ACCEPTANCE_THRESHOLD:.2f}")

    # 5. ONNX Dönüştürme ve Tolerans Kontrolü
    print(f"\n[5/6] skl2onnx ile ONNX Biçimine Dönüştürülüyor:")
    os.makedirs("model", exist_ok=True)
    os.makedirs(os.path.join("public", "model"), exist_ok=True)

    initial_type = [("float_input", FloatTensorType([None, len(FEATURE_NAMES)]))]
    onx = convert_sklearn(
        model,
        initial_types=initial_type,
        options={type(model): {"zipmap": False}}  # JS için doğrudan tensör çıktı
    )

    onnx_file_path = os.path.join("model", "model.onnx")
    with open(onnx_file_path, "wb") as f:
        f.write(onx.SerializeToString())
    print(f"  • ONNX dosyası kaydedildi: {onnx_file_path}")

    # ONNX Runtime ile Tolerans Doğrulama
    sess = ort.InferenceSession(onnx_file_path)
    onnx_input_name = sess.get_inputs()[0].name
    onnx_output_names = [o.name for o in sess.get_outputs()]
    print(f"  • ONNX Giriş Adı: {onnx_input_name}, Çıkış Adları: {onnx_output_names}")

    onnx_res = sess.run(None, {onnx_input_name: X_test})
    onnx_probs = onnx_res[1][:, 1]

    max_prob_diff = float(np.max(np.abs(y_prob - onnx_probs)))
    print(f"  • Sklearn vs ONNX Olasılık Farkı: {max_prob_diff:.8e}")
    if max_prob_diff >= 1e-4:
        print(f"HATA: ONNX ile Scikit-Learn olasılık farkı ({max_prob_diff}) tolerans sınırını (1e-4) aşıyor!")
        sys.exit(1)
    print("  ✓ TOLERANS DOĞRULANDI: abs(sklearn - onnx) < 1e-4")

    # 6. config.json ve Model Kartı (README.md) Üretimi
    print(f"\n[6/6] Model Sözleşmesi (config.json) ve Model Kartı (model/README.md) Hazırlanıyor:")
    config_data = {
        "model_name": "The Primer Adaptive Socratic Assistant",
        "model_version": "v2.0",
        "architecture": "DecisionTreeClassifier",
        "max_depth": 3,
        "purpose": "Oyuncunun mevcut kriz sahnesinde zorlandığını ve kişiselleştirilmiş AI tutor desteğine ihtiyaç duyup duymadığını tahmin etmek.",
        "features": FEATURE_NAMES,
        "feature_count": len(FEATURE_NAMES),
        "data_types": {f: "float32" for f in FEATURE_NAMES},
        "classes": [0, 1],
        "positive_class": 1,
        "positive_class_meaning": "Destek Gerekli (Oyuncu Zorlanıyor)",
        "acceptance_threshold": ACCEPTANCE_THRESHOLD,
        "decision_threshold": DECISION_THRESHOLD,
        "random_state": RANDOM_STATE,
        "contract": {
            "input_name": onnx_input_name,
            "input_shape": [1, len(FEATURE_NAMES)],
            "input_type": "tensor(float)",
            "output_names": onnx_output_names,
            "probability_output_name": "probabilities",
            "probability_index": 1
        },
        "metrics": {
            "f1_score": round(f1, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "accuracy": round(accuracy, 4),
            "confusion_matrix": cm,
            "test_sample_count": len(X_test),
            "train_sample_count": len(X_train),
            "max_prob_diff_onnx_sklearn": max_prob_diff
        },
        "preprocessing": {
            "normalization": "none",
            "notes": "Decision Tree ağaç kuralları girdi ölçeğine duyarlı olmadığından doğrudan ham float32 değerleri işlenmektedir."
        }
    }

    config_path = os.path.join("model", "config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2, ensure_ascii=False)
    print(f"  • config.json yazıldı: {config_path}")

    # public/ klasörüne de kopyala (Vite statik sunucu erişimi için)
    shutil.copy(onnx_file_path, os.path.join("public", "model", "model.onnx"))
    shutil.copy(config_path, os.path.join("public", "model", "config.json"))
    print("  • public/model/ dizinine dosya kopyalaması tamamlandı.")

    # model/README.md (Model Card)
    model_card = f"""# The Primer v2 — Model Kartı (model/README.md)

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
- **Eğitim Seti Boyutu:** {len(X_train)} gözlem ({train_sessions} oturum)
- **Test Seti Boyutu:** {len(X_test)} gözlem ({test_sessions} oturum)
- **Veri Bölümleme Stratejisi:** `GroupShuffleSplit(test_size=0.25, random_state={RANDOM_STATE})` ile oturum sızıntısı (session leakage) engellenmiştir.
- **Kabul Eşiği (Önceden Tanımlanmış):** F1 >= {ACCEPTANCE_THRESHOLD:.2f}

## 5. Doğrulama Metrikleri
- **F1 Skoru:** {f1:.4f}
- **Precision:** {precision:.4f}
- **Recall:** {recall:.4f}
- **Accuracy:** {accuracy:.4f}
- **Karmaşıklık Matrisi (CM):** TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}
- **ONNX Sayısal Doğrulaması:** `abs(sklearn - onnx) = {max_prob_diff:.4e} < 1e-4`

## 6. Kısıtlar ve Kullanılmaması Gereken Durumlar
1. Bu model yalnızca The Primer kriz simülasyonu oyun bağlamında geliştirilmiştir; gerçek bir hastane krizinde karar verici olarak kullanılamaz.
2. Sentetik bootstrap verisiyle eğitilmiştir; gerçek oyuncu oturumları toplandıkça model periyodik olarak yeniden eğitilmelidir.
3. Model desteğe ihtiyaç olduğunu tahmin etse dahi oyuncunun seçimi reddetme ve kendi kararıyla devam etme özgürlüğü kısıtlanamaz.

## 7. Gizlilik ve Etik Değerlendirme
Model hiçbir kişisel tanımlayıcı (ad, IP, konum) kullanmaz. Tüm davranışsal değişkenler anonim oturum seviyesinde hesaplanır.
"""
    model_readme_path = os.path.join("model", "README.md")
    with open(model_readme_path, "w", encoding="utf-8") as f:
        f.write(model_card)
    print(f"  • model/README.md yazıldı: {model_readme_path}")

    print("\n" + "=" * 60)
    print("✓ EĞİTİM, ONNX DÖNÜŞTÜRME VE DOĞRULAMA TAMAMLANDI!")
    print("=" * 60)

if __name__ == "__main__":
    main()

