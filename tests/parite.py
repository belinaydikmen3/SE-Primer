#!/usr/bin/env python3
"""
The Primer v2 — Parite Testi ve Python Test Oracle
Bu betik model/model.onnx dosyasını onnxruntime ile çalıştırır.
En az 5 farklı referans girdi vektörü için pozitif sınıf olasılığını (p)
hesaplar ve tests/parite.json dosyasına kaydeder.
Cypress diferansiyel testi bu JSON dosyasındaki olasılıkları tarayıcıdaki
onnxruntime-web çıktısı ile karşılaştırır (tolerans < 1e-4).
"""

import os
import json
import numpy as np
import onnxruntime as ort

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

REFERENCE_CASES = [
    {
        "id": "case_1_junior_struggling",
        "description": "Zorlanan Junior: Uzun karar süresi (45s), 3 kez şık değiştirmiş, yardım almamış",
        "features": {
            "karar_suresi_sn": 45.0,
            "karar_degistirme_sayisi": 3.0,
            "onceki_basarisiz_karar_sayisi": 0.0,
            "ortalama_karar_suresi_sn": 45.0,
            "sahne_zorlugu": 0.70,
            "yardim_kullanim_sayisi": 0.0,
            "oyuncu_deneyim_seviyesi": 0.0,
            "sahne_ilerleme_orani": 0.33
        }
    },
    {
        "id": "case_2_senior_fluent",
        "description": "Seri Karar Veren Senior: Hızlı karar (12s), tereddütsüz, önceki hata yok",
        "features": {
            "karar_suresi_sn": 12.0,
            "karar_degistirme_sayisi": 0.0,
            "onceki_basarisiz_karar_sayisi": 0.0,
            "ortalama_karar_suresi_sn": 12.0,
            "sahne_zorlugu": 0.70,
            "yardim_kullanim_sayisi": 0.0,
            "oyuncu_deneyim_seviyesi": 2.0,
            "sahne_ilerleme_orani": 0.33
        }
    },
    {
        "id": "case_3_mid_prev_failed",
        "description": "Orta Seviye: 1 önceki başarısız karar, 28s süre, 2 tereddüt",
        "features": {
            "karar_suresi_sn": 28.0,
            "karar_degistirme_sayisi": 2.0,
            "onceki_basarisiz_karar_sayisi": 1.0,
            "ortalama_karar_suresi_sn": 25.0,
            "sahne_zorlugu": 0.50,
            "yardim_kullanim_sayisi": 1.0,
            "oyuncu_deneyim_seviyesi": 1.0,
            "sahne_ilerleme_orani": 0.67
        }
    },
    {
        "id": "case_4_senior_stage3_pressure",
        "description": "Senior KVKK Aşaması: 38s süre, 1 tereddüt, yüksek sahne zorluğu (0.80)",
        "features": {
            "karar_suresi_sn": 38.0,
            "karar_degistirme_sayisi": 1.0,
            "onceki_basarisiz_karar_sayisi": 0.0,
            "ortalama_karar_suresi_sn": 22.0,
            "sahne_zorlugu": 0.80,
            "yardim_kullanim_sayisi": 0.0,
            "oyuncu_deneyim_seviyesi": 2.0,
            "sahne_ilerleme_orani": 1.00
        }
    },
    {
        "id": "case_5_junior_fast_helped",
        "description": "Destek Alan Junior: 16s süre, 0 tereddüt, önceden 2 kez yardım almış",
        "features": {
            "karar_suresi_sn": 16.0,
            "karar_degistirme_sayisi": 0.0,
            "onceki_basarisiz_karar_sayisi": 0.0,
            "ortalama_karar_suresi_sn": 18.0,
            "sahne_zorlugu": 0.50,
            "yardim_kullanim_sayisi": 2.0,
            "oyuncu_deneyim_seviyesi": 0.0,
            "sahne_ilerleme_orani": 0.67
        }
    },
    {
        "id": "case_6_edge_boundary_high",
        "description": "Sınır Durumu: Tam 35s süre ve 2 tereddüt",
        "features": {
            "karar_suresi_sn": 35.0,
            "karar_degistirme_sayisi": 2.0,
            "onceki_basarisiz_karar_sayisi": 1.0,
            "ortalama_karar_suresi_sn": 30.0,
            "sahne_zorlugu": 0.70,
            "yardim_kullanim_sayisi": 1.0,
            "oyuncu_deneyim_seviyesi": 1.0,
            "sahne_ilerleme_orani": 0.67
        }
    }
]

def main():
    onnx_path = os.path.join("model", "model.onnx")
    if not os.path.exists(onnx_path):
        print(f"HATA: {onnx_path} bulunamadı! Önce python train.py çalıştırın.")
        return 1

    session = ort.InferenceSession(onnx_path)
    input_name = session.get_inputs()[0].name
    output_names = [o.name for o in session.get_outputs()]

    results = []
    print("=" * 60)
    print("      PYTHON ORACLE PARİTE HESAPLAMA (tests/parite.py)      ")
    print("=" * 60)

    for case in REFERENCE_CASES:
        vec = [float(case["features"][name]) for name in FEATURE_NAMES]
        input_tensor = np.array([vec], dtype=np.float32)

        raw_outputs = session.run(None, {input_name: input_tensor})
        # Output 0: label (int64 array [1])
        # Output 1: probabilities (float32 array [1, 2])
        predicted_label = int(raw_outputs[0][0])
        probabilities = raw_outputs[1][0].tolist()
        positive_prob = float(probabilities[1])

        print(f"\n[Oracle] Vaka: {case['id']}")
        print(f"  • Açıklama : {case['description']}")
        print(f"  • Vektör   : {vec}")
        print(f"  • Tahmin   : Label={predicted_label}, Prob(1)={positive_prob:.6f}")

        results.append({
            "id": case["id"],
            "description": case["description"],
            "features": case["features"],
            "vector": vec,
            "predicted_label": predicted_label,
            "positive_probability": round(positive_prob, 6),
            "probabilities": [round(p, 6) for p in probabilities]
        })

    os.makedirs("tests", exist_ok=True)
    out_json_path = os.path.join("tests", "parite.json")
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "model_version": "v2.0",
            "feature_order": FEATURE_NAMES,
            "cases": results,
            "parity_tolerance": 1e-4
        }, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Referans parite sonuçları kaydedildi: {out_json_path}")
    print("=" * 60)
    return 0

if __name__ == "__main__":
    exit(main())

