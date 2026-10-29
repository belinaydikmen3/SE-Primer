# SE Primer — Google AI Studio Sürümü ve Entegrasyon Kılavuzu

**Ders:** YZM301 — Yazılım Mühendisliği  
**Bileşen:** Sokratik AI Tutor (Google AI Studio Prompt & Agent Tanımı)  
**Tarih:** Ekim 2026

---

## 1. Google AI Studio Sürümünün Mahiyeti ve Web Uygulaması ile Farkı

Google AI Studio (`aistudio.google.com`), Google'ın Gemini modelleri üzerinde doğrudan prompt mühendisliği, sistem talimatları, yanıt şemaları ve test senaryoları tasarlamak için sunduğu geliştirici ortamıdır.

- **Vercel Canlı Web Uygulaması (`https://flying-iron-c566m6c.tmp.now`):** Kullanıcının 3 soruluk onboarding'i tamamladığı, 60s sayaçla kriz kararları aldığı, neden-sonuç kartlarını gördüğü tam yığın (full-stack) React/TypeScript arayüzüdür.
- **Google AI Studio Sürümü:** Bu simülasyonun beynini oluşturan **Sokratik AI Tutor'ın** doğrudan Google AI Studio üzerinde çalıştırılabilen, test edilebilen ve Google hesabı üzerinden paylaşılabilen bağımsız prompt/agent tanımıdır.

---

## 2. Google AI Studio'da Projeyi 3 Adımda Başlatma ve Paylaşılabilir Link Üretme

Google AI Studio bir Google oturumu ve hesap yetkisi gerektirdiğinden, paylaşılabilir URL üretmek için şu 3 basit adımı uygulayabilirsiniz:

1. **AI Studio'ya Giriş Yapın:**  
   Tarayıcınızda [https://aistudio.google.com/](https://aistudio.google.com/) adresine gidin ve Google hesabınızla giriş yapın.
2. **Yeni Bir "Chat Prompt" veya "Structured Prompt" Oluşturun:**  
   - Model olarak **Gemini 1.5 Flash** seçin.
   - **System Instructions** alanına [`ai-studio/prompt-config.json`](prompt-config.json) içindeki `systemInstruction` metnini yapıştırın.
   - **Advanced Settings -> Response Format** kısmından `JSON` seçin ve şemayı ekleyin.
   - **Temperature:** `0.3` olarak ayarlayın.
3. **Paylaşılabilir Link (Share URL) Üretin:**  
   - Sağ üstteki **"Get Link" / "Share"** butonuna tıklayın.
   - Üretilen bağlantıyı (`https://aistudio.google.com/prompts/...`) alıp `README.md` dosyasına ekleyebilirsiniz.
