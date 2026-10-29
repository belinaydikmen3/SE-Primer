import type { DecisionStep, OutcomeDetail, Role, LearningGoal } from '../types';

export const DECISION_STEPS: DecisionStep[] = [
  {
    id: 'arch',
    stepNumber: 1,
    totalSteps: 3,
    phaseTitle: 'KARAR 1 · MİMARİ & GERİ DÖNÜŞ',
    scenarioTime: '08:00',
    headline: '08:00 — Randevu Sistemi Çöktü. Nöbetçi Mühendis Sensin!',
    contextText:
      'Hastanede 300 hasta poliklinik önlerinde kayıt açtırmayı bekliyor. Dün gece 02:00\'de yayımlanan v2.4.0 sürümü sonrası veritabanı bağlantı havuzu (connection pool) tükendi ve API servisleri 500 hatası üretmeye başladı.',
    hintText:
      'Mimari İpucu: Üretim krizinde öncelik servisi bilinen en son stabil duruma çekmektir. Ancak geri dönmeden önce gece yapılan sürümde geriye dönük uyumsuz (breaking) veritabanı şema değişikliği olup olmadığı muhakkak kontrol edilmelidir.',
    options: {
      A: {
        id: 'A',
        title: 'Eski Sürüme Geri Dön (Rollback to v2.3.9)',
        badge: 'Mimari Güvenlik Tercihi',
        description: 'En son kararlı sürüme (v2.3.9) geri dön ve veritabanı migrasyon kilitlerini doğrula.',
        consequence:
          'Sistem kontrollü şekilde v2.3.9 sürümüne döndürüldü. Veritabanı şema kilitleri kontrol edildi, bağlantı havuzu rahatladı ve servis ayakta.',
        justification:
          'Üretim krizinde ilk kural bilinmeyen yeni kod yerine bilinen kararlı sürüme dönmektir (Fail-safe rollback). Veritabanı şeması geriye dönük uyumlu olduğu için veri kaybı önlendi.',
        isRecommended: true,
      },
      B: {
        id: 'B',
        title: 'Canlıda Doğrudan Yama Uygula (Hotfix on Production)',
        badge: 'Yüksek Riskli Müdahale',
        description: 'Servisi durdurmadan canlı sunucuda anlık kod yaması yap ve havuz boyutunu artır.',
        consequence:
          'Canlı ortamda anlık yama yapıldı ancak bağlantı sızıntısı çözen kod yeni bir bellek tüketimi (memory leak) tetikledi. Kesinti süresi 25 dakika daha uzadı.',
        justification:
          'Canlı ortamda test edilmemiş sıcak yama (hotfix), öngörülemeyen yan etkilere yol açar. Rollback mekanizmasını devre dışı bırakarak krizi derinleştirir.',
        isRecommended: false,
      },
    },
  },
  {
    id: 'test',
    stepNumber: 2,
    totalSteps: 3,
    phaseTitle: 'KARAR 2 · TEST & YAYIN GÜVENLİĞİ',
    scenarioTime: '08:12',
    headline: 'Servis Ayağa Kaldırıldı. Trafiği Doğrudan Açalım mı?',
    contextText:
      'Sürüm müdahalesi tamamlandı. Ancak ön uç randevu alma akışının ve kimlik doğrulama servisinin kusursuz çalıştığından emin olunması gerekiyor. 300 hasta kuyrukta sabırsızlanıyor.',
    hintText:
      'Kalite İpucu: Kriz anında tüm regresyon paketini (2 saat) çalıştırmak imkansızdır. Fakat kritik hasta akışını doğrulayan 10-15 dakikalık odaklı duman testleri (smoke/sanity suite) büyük felaketleri önler.',
    options: {
      A: {
        id: 'A',
        title: 'Önce Kısa Ama Kritik Testleri Koş (Smoke Test Suite)',
        badge: 'Kalite Güvencesi',
        description: 'Temel randevu alma ve doğrulama akışını kapsayan 10 dakikalık duman testlerini çalıştır.',
        consequence:
          '10 dakikalık kritik testler başarıyla koşuldu. Randevu kayıt ve SMS onay döngüsünün çalıştığı doğrulandıktan sonra trafik güvenle açıldı.',
        justification:
          'Kriz baskısında zaman kıymetlidir ancak duman testleri (smoke testing) hizmet sürekliliğini garantiye alır. 10 dakikalık kontrollü gecikme, saatler sürebilecek çift randevu krizini engelledi.',
        isRecommended: true,
      },
      B: {
        id: 'B',
        title: 'Testleri Atlayıp Hemen Yayına Al (Bypass Tests)',
        badge: 'Zaman Kurtarma / Yüksek Risk',
        description: 'Hastalar bekliyor, testleri atlayarak trafiği doğrudan canlıya yönlendir.',
        consequence:
          'Trafik anında açıldı ancak arka plandaki bildirim kuyruğu kilitlendi. 45 hastaya mükerrer randevu verildi ve veznede hasta kaosu oluştu.',
        justification:
          'Testleri atlamak anlık zaman kazandırır gibi görünse de regresyon riskini maksimize eder. Hatanın müşteriye/hastaya ulaşması teknik borcu ve itibar kaybını katlar.',
        isRecommended: false,
      },
    },
  },
  {
    id: 'privacy',
    stepNumber: 3,
    totalSteps: 3,
    phaseTitle: 'KARAR 3 · KVKK & VERİ GİZLİLİĞİ',
    scenarioTime: '08:22',
    headline: 'Hata Ayıklama Logunda Kişisel Sağlık Verisi Tespit Edildi!',
    contextText:
      'Geliştirici ekibi kök neden analizi için acil sunucu loglarını talep ediyor. Log dosyasını incelerken aşağıdaki satır göze çarptı:',
    logSnippet:
      '[ERROR] 08:04:12 - PatientID: 88412 | Name: Ahmet Yılmaz | TC: 12345678901 | Diagnostic: Akut Pankreatit | Err: Connection pool exhausted',
    hintText:
      'Gizlilik İpucu: 6698 sayılı KVKK m.4 uyarınca veriler işlendikleri amaçla bağlantılı, sınırlı ve ölçülü olmalıdır. Sağlık verileri özel nitelikli kişisel veridir. Log paylaşırken PII maskeleme zorunludur.',
    options: {
      A: {
        id: 'A',
        title: 'Kişisel Veriyi Maskeleyerek Paylaş (PII Masking & Anonymization)',
        badge: 'KVKK & Gizlilik Uyumu',
        description: 'Hasta adı, TC kimlik ve tanı bilgilerini maskele (Ahmet Y*****, TC: 123*****901) ve ekiple güvenli paylaş.',
        consequence:
          'Log kayıtları SHA-256 / yıldızlama yöntemiyle maskelendi. Teknik ekip ihtiyacı olan hata kodunu aldı, hasta mahremiyeti korundu.',
        justification:
          'Kişisel Verilerin Korunması Kanunu (KVKK) veri minimizasyonunu şart koşar. Hata ayıklama için hastanın açık kimliğine ihtiyaç yoktur; teknik hata izi yeterlidir.',
        isRecommended: true,
      },
      B: {
        id: 'B',
        title: 'Logu Hiçbir Değişiklik Yapmadan Ekibe Gönder (Raw Log Sharing)',
        badge: 'Ağır İhlal Riski',
        description: 'Vakit kaybetmemek için log dosyasını 40 kişilik şirket içi mesajlaşma kanalına doğrudan yükle.',
        consequence:
          'Hasta Ahmet Yılmaz\'ın teşhis ve TC kimlik bilgisi şirket içi genel kanala saçıldı. Güvenlik birimi KVKK ihlali raporladı, resmi soruşturma başlatıldı.',
        justification:
          'Özel nitelikli sağlık verisinin yetkisiz kişilerce erişilebilir kanallarda açıkça paylaşılması 6698 sayılı kanuna göre doğrudan ihlaldir ve ağır idari para cezası doğurur.',
        isRecommended: false,
      },
    },
  },
];

export const OUTCOME_A: OutcomeDetail = {
  type: 'outcome_a',
  title: '08:25 — Sistem Ayakta, Veri Güvende',
  badge: 'SON A · BAŞARILI KRİZ YÖNETİMİ',
  statusBadge: 'Mükemmel Mühendislik Refleksi',
  summary:
    'Tebrikler! 08:25 itibarıyla hastane randevu sistemi kontrollü biçimde ayağa kaldırıldı. 300 hasta güvenle poliklinik kayıtlarını tamamladı. Mimari geri dönüş, duman testleri ve KVKK maskeleme adımları standartlara tam uyumla yönetildi.',
  metrics: {
    recoveryTime: '25 Dakika (Hedef: <30 dk)',
    dataLoss: '%0 (Kayıp Yok)',
    kvkkStatus: 'Tam Uyumlu (İhlal Yok)',
    availability: '%99.98',
  },
  recommendation:
    'Örnek bir SRE müdahalesi sergiledin. Acil durumlarda hız uğruna güvenlik ve test adımlarından taviz vermemek, krizin kalıcı hasara dönüşmesini engelledi.',
};

export const OUTCOME_B: OutcomeDetail = {
  type: 'outcome_b',
  title: 'Sistem Ayakta Ama KVKK İhlali & Ağır Operasyonel Risk',
  badge: 'SON B · OLUMSUZ SONUÇ',
  statusBadge: 'Kritik Güvenlik & Süreç İhlali',
  summary:
    'Sistem saatler sonra kısmen randevu kabul etmeye başlasa da; canlıda yapılan anlık yamalar, atlanan testler veya açık log paylaşımı nedeniyle kurum ağır bir KVKK ihlali ve veri kirliliği ile karşı karşıya kaldı.',
  metrics: {
    recoveryTime: '75+ Dakika (Ciddi Gecikme)',
    dataLoss: '%14 Tutarsız Kayıt',
    kvkkStatus: 'AĞIR İHLAL (Resmi Soruşturma)',
    availability: '%72.40 (Düşük)',
  },
  recommendation:
    'Kriz anında yapılan seçimler anlık panikle verilmiş. Canlıda yama yapmak, testleri atlamak veya logları maskelemeden paylaşmak anlık hız sağlasa da orta vadede kurumu felakete sürükler.',
};

export function getRolePerspective(role: Role): string {
  switch (role) {
    case 'developer':
      return 'Geliştirici Gözüyle: Kod bütünlüğü, geriye dönük uyumluluk ve istisna yönetimi odaklısın.';
    case 'qa':
      return 'Test Mühendisi Gözüyle: Regresyon riski, uçtan uca senaryolar ve duman testleri odaklısın.';
    case 'devops':
      return 'SRE / DevOps Gözüyle: Bağlantı havuzları, deployment geri alma hızları ve servis izlenebilirliği odaklısın.';
  }
}

export function getGoalHighlight(goal: LearningGoal): string {
  switch (goal) {
    case 'technical':
      return 'Öğrenme Hedefi: Mimari kararlar ve sistem direnci (resilience).';
    case 'testing':
      return 'Öğrenme Hedefi: Hızlı doğrulama, duman testleri ve regresyon engelleme.';
    case 'security':
      return 'Öğrenme Hedefi: Veri mahremiyeti, PII maskeleme ve KVKK uyumu.';
  }
}
