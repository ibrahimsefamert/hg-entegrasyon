// popup.js

document.addEventListener("DOMContentLoaded", function () {
  const siparisButonu = document.getElementById("siparisOlustur");

  if (siparisButonu) {
    siparisButonu.addEventListener("click", () => {
      // Background.js'e mesaj gönder
      chrome.runtime.sendMessage({ action: "createPopupOrder" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Mesaj gönderilirken hata:", chrome.runtime.lastError);
        } else {
          console.log("Yanıt alındı:", response);
        }
        // Popup'u kapat
        window.close();
      });
    });
  }
});
