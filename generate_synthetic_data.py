import numpy as np
import pandas as pd
import random

np.random.seed(42)
random.seed(42)

scenes = [
    {"id": "arch", "zorluk": 0.70, "ilerleme": 0.33},
    {"id": "test", "zorluk": 0.50, "ilerleme": 0.67},
    {"id": "privacy", "zorluk": 0.80, "ilerleme": 1.00},
]

records = []
num_sessions = 60

for s_idx in range(num_sessions):
    session_id = f"ses_synth_{s_idx+1:03d}"
    # Randomly assign experience level (0: junior, 1: mid, 2: senior)
    exp_level = random.choice([0, 1, 2])
    
    # Track cumulative state across the 3 scenes
    cum_decision_times = []
    prev_failed = 0
    cum_help_used = 0
    
    for step_num, scene in enumerate(scenes):
        scene_id = scene["id"]
        scene_difficulty = scene["zorluk"]
        progress = scene["ilerleme"]
        
        # Base decision time depends on experience and difficulty
        if exp_level == 0: # Junior
            base_time = np.random.normal(32, 10)
            switch_prob = 0.45
            help_prob = 0.50
        elif exp_level == 1: # Mid
            base_time = np.random.normal(24, 8)
            switch_prob = 0.30
            help_prob = 0.30
        else: # Senior
            base_time = np.random.normal(18, 6)
            switch_prob = 0.20
            help_prob = 0.15
            
        # Add difficulty factor
        decision_time = max(4.0, round(float(base_time * (1 + (scene_difficulty - 0.5) * 0.6)), 2))
        
        # Decision changes count
        if random.random() < switch_prob:
            changes = random.choice([1, 2, 3])
        else:
            changes = 0
            
        # Help usage count
        if random.random() < help_prob:
            cum_help_used += 1
            
        # Cumulative average decision time so far
        cum_decision_times.append(decision_time)
        avg_time = round(float(np.mean(cum_decision_times)), 2)
        
        # Ground truth rule for destek_gerekli
        # Rule conditions:
        is_struggling = False
        if decision_time > 35.0:
            is_struggling = True
        elif changes >= 2:
            is_struggling = True
        elif prev_failed >= 1 and decision_time > 25.0:
            is_struggling = True
        elif exp_level == 0 and scene_difficulty >= 0.70 and cum_help_used == 0 and decision_time > 20.0:
            is_struggling = True
            
        target = 1 if is_struggling else 0
        
        # Simulate choice outcome for next step
        # If struggling or junior, higher risk of suboptimal choice
        fail_prob = 0.40 if is_struggling else (0.30 if exp_level == 0 else 0.10)
        is_choice_failed = random.random() < fail_prob
        
        records.append({
            "oturum_id": session_id,
            "sahne_id": scene_id,
            "karar_suresi_sn": decision_time,
            "karar_degistirme_sayisi": changes,
            "onceki_basarisiz_karar_sayisi": prev_failed,
            "ortalama_karar_suresi_sn": avg_time,
            "sahne_zorlugu": scene_difficulty,
            "yardim_kullanim_sayisi": cum_help_used,
            "oyuncu_deneyim_seviyesi": exp_level,
            "sahne_ilerleme_orani": progress,
            "destek_gerekli": target,
            "kaynak": "sentetik"
        })
        
        if is_choice_failed:
            prev_failed += 1

df = pd.DataFrame(records)
df.to_csv("data/oturumlar.csv", index=False)
print(f"Generated {len(df)} rows across {num_sessions} sessions.")
print(f"Target distribution:\n{df['destek_gerekli'].value_counts(normalize=True)}")

