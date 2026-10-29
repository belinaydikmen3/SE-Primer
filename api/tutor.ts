// Vercel Node.js Serverless Function for secure Gemini API proxy
const TUTOR_SYSTEM_PROMPT = `
Sen "SE Primer" projesinde görev yapan Kıdemli Yazılım Mimarı ve Sokratik AI Tutor'sın.
Amacın kullanıcıya ASLA doğrudan cevabı (Örn: "A şıkkını seç", "Rollback yap", "Cevap A", "Maskelemelisin") söylememektir.
Bunun yerine kullanıcının yazılım mühendisliği reflekslerini, kriz yönetimi muhakemesini ve etik/teknik analiz yeteneğini geliştirmelisin.

ZORUNLU KURALLAR:
1. Asla doğru şıkkı ("A" veya "B") veya doğrudan emir kipiyle yapılması gereken eylemi söyleme.
2. Kullanıcı "Hangi şıkkı seçmeliyim?", "Doğru cevap ne?" dese dahi asla cevabı ele verme; karar anında düşünmesi gereken kritik teknik açıyı sor.
3. Kullanıcının girdisini değerlendir; doğru bir sezisi varsa onayla, eksik veya tehlikeli varsayımını Sokratik bir soruyla sorgulat.
4. Cevabını MUTLAKA şu JSON şemasında üret:
{
  "feedback": "Kullanıcının mantığına ve kriz yaklaşımına yönelik 1-2 cümlelik yapıcı teknik analiz.",
  "question": "Kullanıcıyı doğru mühendislik dengesini kurmaya yönelten tek bir vurucu Sokratik soru.",
  "hint": "Cevabı fısıldamayan, sadece düşünülmesi gereken teknik mekanizmayı hatırlatan ipucu.",
  "reveals_answer": false
}
5. Yanıt dilin Türkçe, üslubun saygılı, profesyonel, merak uyandırıcı ve mühendisçe olmalıdır.
`;

function checkRevealsAnswer(content: string): boolean {
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return res.status(200).json({
      isFallback: true,
      message: 'No GEMINI_API_KEY configured on server. Use local fallback.',
    });
  }

  try {
    const { userInput, step, profile } = req.body || {};

    const systemPrompt = `${TUTOR_SYSTEM_PROMPT}
Bağlam Bilgisi:
- Kullanıcı Deneyimi: ${profile?.level}
- Rol: ${profile?.role}
- Öğrenme Hedefi: ${profile?.goal}
- Aktif Aşama: ${step?.phaseTitle} (${step?.scenarioTime})
- Kriz Olayı: ${step?.contextText}
- Senaryo İpucu Referansı (Bunu doğrudan söyleme, zihnine al): ${step?.hintText}
`;

    const userPrompt = `Öğrencinin Düşüncesi/Sorusu: "${userInput}"`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      apiKey.trim()
    )}`;

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.statusText}`);
    }

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini response was empty');
    }

    const parsed = JSON.parse(rawText);
    const combinedText = `${parsed.feedback} ${parsed.question} ${parsed.hint}`;
    const actuallyReveals = checkRevealsAnswer(combinedText);
    parsed.reveals_answer = Boolean(parsed.reveals_answer || actuallyReveals);

    if (parsed.reveals_answer) {
      parsed.question =
        'Doğrudan cevabı aramak yerine: Bu adımda sistem güvenliğini ve veri bütünlüğünü tehdit eden en büyük risk nedir?';
      parsed.hint =
        'Alternatif seçeneklerin her birinin teknik risklerini ve geri alınabilirlik maliyetini tart.';
    }

    return res.status(200).json({ response: parsed, isFallback: false });
  } catch (error: any) {
    return res.status(200).json({ isFallback: true, error: error?.message || 'Server error' });
  }
}
