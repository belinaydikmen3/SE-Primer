#!/usr/bin/env python3
"""
The Primer v2 — Hugging Face Model Yayınlama Aracı (hf_cli.py)
Kullanım:
    python hf_cli.py --repo <kullanici_adi>/<repo_adi> [--token <HF_TOKEN>]

Açıklama:
    Bu betik model/model.onnx, model/config.json ve model/README.md dosyalarını
    Hugging Face Hub model deposuna yükler ve yükleme sonrası oluşan
    kesin COMMIT HASH'i ekrana yazdırarak model tüketicisinin sabitlenmesini sağlar.
    
    Örnek Sabitlenmiş URL:
    https://huggingface.co/<kullanici>/<repo>/resolve/<commit>/model.onnx
"""

import os
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="The Primer v2 - Hugging Face Model Dağıtım Aracı")
    parser.add_argument("--repo", type=str, required=True, help="Hugging Face model deposu (örn: belinay/primer-v2-adaptive)")
    parser.add_argument("--token", type=str, default=None, help="Hugging Face Write Token (veya HF_TOKEN ortam değişkeni)")
    parser.add_argument("--private", action="store_true", help="Depoyu gizli olarak oluştur (varsayılan: public)")
    args = parser.parse_args()

    token = args.token or os.environ.get("HF_TOKEN")
    if not token:
        print("\n" + "!" * 65)
        print("BİLGİLENDİRME: Hugging Face erişim token'ı (HF_TOKEN) bulunamadı.")
        print("Gerçek dağıtım gerçekleştirmek için:")
        print("  1. https://huggingface.co/settings/tokens adresinden 'Write' yetkili bir token alın.")
        print(f"  2. Komutu token ile çalıştırın:")
        print(f"     python hf_cli.py --repo {args.repo} --token hf_yourTokenHere")
        print("  VEYA ortam değişkeni tanımlayın:")
        print("     $env:HF_TOKEN = 'hf_yourTokenHere'")
        print(f"     python hf_cli.py --repo {args.repo}")
        print("!" * 65 + "\n")
        return 1

    try:
        from huggingface_hub import HfApi, create_repo
    except ImportError:
        print("huggingface_hub kütüphanesi yükleniyor...")
        os.system("python -m pip install huggingface_hub")
        from huggingface_hub import HfApi, create_repo

    api = HfApi(token=token)

    print(f"\n[1/3] Hugging Face deposu doğrulanıyor/oluşturuluyor: {args.repo}")
    try:
        create_repo(repo_id=args.repo, token=token, repo_type="model", exist_ok=True, private=args.private)
        print("  ✓ Depo hazır.")
    except Exception as e:
        print(f"  Depo erişim bilgisi: {e}")

    files_to_upload = [
        ("model/model.onnx", "model.onnx"),
        ("model/config.json", "config.json"),
        ("model/README.md", "README.md"),
    ]

    print(f"\n[2/3] Model dosyaları yükleniyor...")
    for local_path, repo_path in files_to_upload:
        if not os.path.exists(local_path):
            print(f"  HATA: Yerel dosya bulunamadı: {local_path}")
            return 1
        print(f"  • Yükleniyor: {local_path} -> {repo_path}")
        api.upload_file(
            path_or_fileobj=local_path,
            path_in_repo=repo_path,
            repo_id=args.repo,
            repo_type="model",
            commit_message=f"feat(v2.0): publish {repo_path} [The Primer v2 ML Adaptive Model]"
        )

    print(f"\n[3/3] En son commit hash alınıyor...")
    repo_info = api.repo_info(repo_id=args.repo, repo_type="model")
    commit_hash = repo_info.sha
    print("\n" + "=" * 65)
    print("✓ MODEL BAŞARIYLA HUGGING FACE'E YAYINLANDI!")
    print(f"  • Repo        : https://huggingface.co/{args.repo}")
    print(f"  • Commit Hash : {commit_hash}")
    print(f"  • Sabitlenmiş ONNX URL:")
    print(f"    https://huggingface.co/{args.repo}/resolve/{commit_hash}/model.onnx")
    print(f"  • Sabitlenmiş Config URL:")
    print(f"    https://huggingface.co/{args.repo}/resolve/{commit_hash}/config.json")
    print("=" * 65)
    return 0

if __name__ == "__main__":
    sys.exit(main())

