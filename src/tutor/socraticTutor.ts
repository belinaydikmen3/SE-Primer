import type { DecisionStep, TutorResponse, UserProfile } from '../types';

export const TUTOR_SYSTEM_PROMPT = `
Sen "SE Primer" projesinde görev yapan Kıdemli Yazılım Mimarı ve Sokratik AI Tutor'sın.
Amacın kullanıcıya ASLA doğrudan cevabı (Örn: "A şıkkını seç", "Rollback yap", "Cevap A", "Maskelemelisin") söylememektir.
Bunun yerine kullanıcının yazılım mühendisliği reflekslerini, kriz yönetimi muhakemesini ve etik/teknik analiz yeteneğini geliştirmelisin.

ZORUNLU KURALLAR:
1. Asla doğru şıkkı ("A" veya "B") veya doğrudan emir kipiyle yapılması gereken eylemi ("Hemen rollback seç") söyleme.
2. Kullanıcı "Hangi şıkkı seçmeliyim?", "Doğru cevap ne?", "Lütfen söyle" dese dahi asla cevabı ele verme; karar anında düşünmesi gereken kritik teknik açıyı sor.
3. Kullanıcının girdisini değerlendir; doğru bir sezisi varsa onayla ("Geri dönmenin güvenli olduğunu düşünmen doğru bir başlangıç..."), eksik veya tehlikeli varsayımını Sokratik bir soruyla sorgulat ("Peki ya veritabanında gece eklenen bir kolon eski kod tarafından beklenmiyorsa ne olur?").
4. Cevabını MUTLAKA aşağıdaki JSON şemasında üret:
{
  "feedback": "Kullanıcının mantığına ve kriz yaklaşımına yönelik 1-2 cümlelik yapıcı teknik analiz.",
  "question": "Kullanıcıyı doğru mühendislik dengesini kurmaya yönelten tek bir vurucu Sokratik soru.",
  "hint": "Cevabı fısıldamayan, sadece düşünülmesi gereken teknik mekanizmayı (Örn: şema uyumluluğu, duman testi maliyeti, PII minimizasyonu) hatırlatan ipucu.",
  "reveals_answer": false
}
5. Yanıt dilin Türkçe, üslubun saygılı, profesyonel, merak uyandırıcı ve mühendisçe olmalıdır.
`;

/**
 * Checks whether text inadvertently reveals the direct answer
 */
export function checkRevealsAnswer(content: string): boolean {
  const normalized = content.toLowerCase();
  const forbiddenPatterns = [
    /a şıkkı/i,
    /b şıkkı/i,
    /a seçeneği/i,
    /b seçeneği/i,
    /doğru cevap a/i,
    /doğru cevap b/i,
    /kesinlikle a/i,
    /kesinlikle b/i,
    /a'yı seç/i,
    /b'yi seç/i,
    /a yı seç/i,
    /b yi seç/i,
    /rollback yapmalısın/i,
    /eski sürüme geri dönmelisin/i,
    /maskele seçeneğini seç/i,
    /doğru şık a/i,
    /cevap: a/i,
  ];

  return forbiddenPatterns.some((pattern) => pattern.test(normalized));
}

/**
 * Fallback Socratic responses when no Gemini API key is provided
 * Provides realistic Socratic mentor interaction tailored to the step and user prompt
 */
export function getLocalSocraticResponse(
  userInput: string,
  step: DecisionStep,
  profile: UserProfile
): TutorResponse {
  const inputLower = userInput.toLowerCase();
  const roleLabel =
    profile.role === 'developer'
      ? 'geliştirici'
      : profile.role === 'qa'
      ? 'test mühendisi'
      : 'DevOps / SRE';

  if (step.id === 'arch') {
    if (
      inputLower.includes('cevap') ||
      inputLower.includes('hangisi') ||
      inputLower.includes('ne yapayım') ||
      inputLower.includes('a mı b mi')
    ) {
      return {
        feedback: `Bir ${roleLabel} olarak kriz anında kararı başkasına bırakmak yerine teknik göstergeleri değerlendirmelisin.`,
        question:
          'Gece yapılan sürümde veritabanına yeni bir tablo ya da kısıt (constraint) eklendiyse, eski sürüme dönmek veriyi bozar mı?',
        hint: 'Geriye dönük uyumluluk (backward compatibility) ve migrasyon kilitleri, rollback kararlarının en kritik ön koşuludur.',
        reveals_answer: false,
      };
    }

    if (
      inputLower.includes('yama') ||
      inputLower.includes('hotfix') ||
      inputLower.includes('canlı') ||
      inputLower.includes('kod')
    ) {
      return {
        feedback:
          'Canlıda anlık müdahale kulağa en hızlı çözüm gibi gelebilir; fakat baskı altındaki düzeltmeler yeni hatalar doğurabilir.',
        question:
          'Canlı ortamda test edilmemiş bir yamanın bellek sızıntısına veya veritabanı kilitlenmesine yol açma riskini nasıl ölçersin?',
        hint: 'Bilinmeyen yeni bir hata riski mi, yoksa bilinen ve daha önce test edilmiş kararlı sürüme dönmek mi daha kontrollüdür?',
        reveals_answer: false,
      };
    }

    return {
      feedback:
        'Kriz anında sistem durumunu ve bağlantı havuzu tükenmesini doğru okumak ilk adımdır.',
      question:
        'Geri dönüş (rollback) yapmadan önce veritabanı şemasının geriye dönük uyumlu olup olmadığını nasıl doğrularsın?',
      hint: 'Stateless servisleri geri almak kolaydır; ancak stateful (veritabanı) bağımlılıklar özel dikkat gerektirir.',
      reveals_answer: false,
    };
  }

  if (step.id === 'test') {
    if (
      inputLower.includes('cevap') ||
      inputLower.includes('hangisi') ||
      inputLower.includes('ne yapayım') ||
      inputLower.includes('a mı b mi')
    ) {
      return {
        feedback: `Zaman baskısı 300 hastanın beklediği bir anda çok yüksektir; ancak test kararları risk yönetimidir.`,
        question:
          'Tüm regresyon testlerini (2 saat) beklemek yerine, sadece kritik randevu kaydını test etmek (10 dk) operasyonu nasıl etkiler?',
        hint: 'Duman testi (smoke test), sistemin temel fonksiyonlarının ayakta olduğunu en az maliyetle doğrular.',
        reveals_answer: false,
      };
    }

    if (
      inputLower.includes('bekle') ||
      inputLower.includes('atla') ||
      inputLower.includes('hızlı') ||
      inputLower.includes('hemen')
    ) {
      return {
        feedback:
          'Testleri atlayıp hemen yayına almak veznedeki kuyruğu anlık olarak rahatlatabilir gibi hissettirebilir.',
        question:
          'Yayına aldığın kod randevuları çift kaydediyor veya SMS servisini kilitliyorsa, bunu hastalar fark etmeden önce nasıl anlarsın?',
        hint: 'Hatanın müşteriye/hastaya ulaşması, 10 dakikalık bir test gecikmesinden çok daha ağır maliyet yaratır.',
        reveals_answer: false,
      };
    }

    return {
      feedback:
        'Test kapsamı ile hizmete açılma hızı arasında sürekli bir mühendislik takası (trade-off) bulunur.',
      question:
        'Hangi test seviyesi (unit, smoke, full regression) kriz anında en yüksek güveni en kısa sürede sağlar?',
      hint: 'Kritik başarı kriteri (Happy Path) duman testleri, felaketleri önlemenin en hızlı sigortasıdır.',
      reveals_answer: false,
    };
  }

  // step.id === 'privacy'
  if (
    inputLower.includes('cevap') ||
    inputLower.includes('hangisi') ||
    inputLower.includes('ne yapayım') ||
    inputLower.includes('a mı b mi')
  ) {
    return {
      feedback:
        'Kriz ne kadar büyük olursa olsun, yasal ve etik sorumluluklar mühendisin omzundadır.',
      question:
        'Geliştirici ekibinin hatayı çözebilmesi için hastanın TC kimlik numarasına ve hastalığının adına gerçekten ihtiyacı var mı?',
      hint: '6698 sayılı KVKK veri minimizasyonu ilkesini (yalnızca amaca yetecek kadar veri) zorunlu kılar.',
      reveals_answer: false,
    };
  }

  if (
    inputLower.includes('ekip') ||
    inputLower.includes('slack') ||
    inputLower.includes('hızlı') ||
    inputLower.includes('kanal')
  ) {
    return {
      feedback:
        'Ekiple log paylaşmak sorunun hızlı çözülmesi için değerlidir; fakat kanalın yetkilendirme sınırlarını düşündün mü?',
      question:
        'Bir genel mesajlaşma kanalına hassas sağlık verisi düştüğünde, bu verinin sızmadığını kanıtlayabilir misin?',
      hint: 'Özel nitelikli kişisel veriler şifrelenmeli veya kimliksizleştirilmelidir (pseudonymization).',
      reveals_answer: false,
    };
  }

  return {
    feedback:
      'Log kayıtlarında hastanın adı, TC kimliği ve tanısı gibi hassas kişisel veriler (PII) yer alıyor.',
    question:
      'Hata ayıklama logunu maskelemekle hiç maskelemeden paylaşmak arasındaki teknik ve hukuki fark nedir?',
    hint: 'Veri minimizasyonu gereği loglardaki kişisel bilgileri yıldızlamak veya hashlemek yasal koruma sağlar.',
    reveals_answer: false,
  };
}

/**
 * Calls Gemini API if an API key is available, otherwise gracefully falls back to local Socratic engine
 */
export async function querySocraticTutor(
  userInput: string,
  step: DecisionStep,
  profile: UserProfile,
  apiKey?: string
): Promise<{ response: TutorResponse; isFallback: boolean }> {
  // If no API key provided, immediately use local engine
  if (!apiKey || apiKey.trim() === '') {
    const fallbackResponse = getLocalSocraticResponse(userInput, step, profile);
    return { response: fallbackResponse, isFallback: true };
  }

  try {
    const systemPrompt = `${TUTOR_SYSTEM_PROMPT}
Bağlam Bilgisi:
- Kullanıcı Deneyimi: ${profile.level}
- Rol: ${profile.role}
- Öğrenme Hedefi: ${profile.goal}
- Aktif Aşama: ${step.phaseTitle} (${step.scenarioTime})
- Kriz Olayı: ${step.contextText}
- Senaryo İpucu Referansı (Bunu doğrudan söyleme, zihnine al): ${step.hintText}
`;

    const userPrompt = `Öğrencinin Düşüncesi/Sorusu: "${userInput}"`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      apiKey.trim()
    )}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini response was empty');
    }

    const parsed: TutorResponse = JSON.parse(rawText);

    // Independent answer revelation check
    const combinedText = `${parsed.feedback} ${parsed.question} ${parsed.hint}`;
    const actuallyReveals = checkRevealsAnswer(combinedText);

    parsed.reveals_answer = Boolean(parsed.reveals_answer || actuallyReveals);

    // If inadvertently leaked, sanitize question to protect pedagogical value
    if (parsed.reveals_answer) {
      parsed.question =
        'Doğrudan cevabı aramak yerine: Bu adımda sistem güvenliğini ve veri bütünlüğünü tehdit eden en büyük risk nedir?';
      parsed.hint =
        'Alternatif seçeneklerin her birinin teknik risklerini ve geri alınabilirlik maliyetini tart.';
    }

    return { response: parsed, isFallback: false };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local engine:', err);
    const fallbackResponse = getLocalSocraticResponse(userInput, step, profile);
    return { response: fallbackResponse, isFallback: true };
  }
}
