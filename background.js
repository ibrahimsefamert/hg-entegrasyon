// background.js

console.log('[Ext] 🔌 background.js loaded');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[Ext] 📥 onMessage received', msg);

  if (msg.action === 'sendOrder' && msg.data) {
    // 1) Tutarı "185,50 TL" → 185.50 olarak parse et
    let rawAmount = msg.data.amount;                  // e.g. "185,50 TL"
    // Nokta bin ayırıcısını kaldır, virgülü ondalık ayırıcısına çevir
    let normalized = rawAmount
      .replace(/\./g, '')   // tüm noktaları kaldır
      .replace(/,/g, '.')  // tüm virgülleri nokta yap
      .replace(/[^\d\.]/g, '') // sadece rakam ve nokta bırak
    ;
    let tutar = parseFloat(normalized) || 0;

    // 2) Ödeme yöntemini uygun koda map et
    let pm = msg.data.paymentMethod.toLowerCase();
    let odeme_yontemi = 'nakit';
    if (pm.includes('kredi')) {
      odeme_yontemi = 'kredi_karti';
    } else if (pm.includes('ön ödeme') || pm.includes('on odemeli')) {
      odeme_yontemi = 'on_odemeli';
    } else if (pm.includes('nakit')) {
      odeme_yontemi = 'nakit';
    }

    // 3) URL parametrelerini hazırla
    const params = new URLSearchParams({
      musteri_adi:   msg.data.customerName,
      musteri_tel:   msg.data.phone,
      musteri_adres: msg.data.address,
      tutar:         tutar.toString(),
      odeme_yontemi: odeme_yontemi,
      musteri_notu:  msg.data.note || ''
    });

    // 4) ext_create.php sayfasını açarak kaydetme + yazdırma akışını başlat
    chrome.tabs.create({
      url: `https://hizlagel.com/isletme/entegrasyon_paket_olustur.php?${params.toString()}`
    }, tab => {
      console.log('[Ext] 📑 ext_create.php tab opened, id=', tab.id);
    });

    // 5) İçerik script’ine dönüş yap
    sendResponse({ triggered: true });
    return true;  // async cevap için gerekli
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("popup.html")
  });
});