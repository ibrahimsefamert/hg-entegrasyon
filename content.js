// hemen inject olduğumuzu göster
console.log('[Ext] content.js injected on', location.href);

(function() {
  // sipariş verilerini oku
  const orderData = {
    orderId:       document.getElementById('order-id')?.innerText.trim(),
    customerName:  document.getElementById('customer-name')?.innerText.trim(),
    phone:         document.getElementById('phone')?.innerText.trim(),
    address:       document.getElementById('address')?.innerText.trim(),
    amount:        document.getElementById('amount')?.innerText.replace('TL','').trim(),
    paymentMethod: document.getElementById('payment-method')?.innerText.trim(),
    note:          document.getElementById('note')?.innerText.trim()
  };

  console.log('[Ext] orderData:', orderData);

  // eğer kritik alan yoksa dur
  if (!orderData.orderId || !orderData.customerName) {
    console.warn('[Ext] sipariş verisi eksik, işlem iptal edildi.');
    return;
  }

  // background.js'e gönder
  chrome.runtime.sendMessage({
    action: 'sendOrder',
    data: orderData
  }, response => {
    console.log('[Ext] background yanıtı:', response);
  });
})();
