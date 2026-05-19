# TRUST EXPO - LED Video Wall Hire Project

## Proje Özeti
- **Marka:** Trust Expo
- **Domain:** trust-expo.com (Cloudflare üzerinden alındı)
- **Email:** sales@trust-expo.com (Cloudflare Email Routing → kişisel Gmail'e yönleniyor)
- **SMTP:** Brevo üzerinden Gmail "Send mail as" ayarlandı (sales@trust-expo.com olarak mail atılabiliyor)
- **İş Modeli:** LED video wall kiralama - fuarlarda exhibitor'lara
- **Yapı:** Komisyon bazlı - Kutay (sales/marketing), Fatih abi (operasyon/ekipman)
- **Hedef Fuar:** Autumn Fair, 6-9 Eylül 2026, NEC Birmingham

## Teknik Bilgiler
- P1.8 fine-pitch indoor LED video wall
- 277,778 pixels/m², 3840Hz refresh rate, 800-1200 nits
- Die-cast aluminium cabinet, ~8kg per cabinet
- Paketler: Compact (2.5m²), Standard (4m²), Premium (6m²)
- Fiyatlar henüz belirlenmedi (Fatih ile görüşme yapılmadı)

## Tamamlanan Adımlar
- [x] Domain alındı: trust-expo.com (Cloudflare)
- [x] Cloudflare Email Routing kuruldu: sales@trust-expo.com
- [x] Brevo SMTP ayarlandı (smtp-relay.brevo.com, port 587)
- [x] Gmail "Send mail as" ayarlandı - sales@trust-expo.com olarak mail atılabiliyor
- [x] Brevo domain doğrulaması yapıldı (DKIM, SPF, DMARC)
- [x] Email signature oluşturuldu (email_signature.html)
- [x] Spec sheet taslağı hazırlandı (Trust_Expo_Spec_Sheet.md)
- [x] Figma'da spec sheet tasarımı başlatıldı (küçük düzeltmeler kaldı)
- [x] Outreach mail template'leri hazırlandı

## Bekleyen Adımlar
- [ ] Fatih abi ile görüşme (fiyatlama, teknik doğrulama, komisyon yapısı)
- [ ] Figma spec sheet son düzeltmeleri (LED wall görseli, NEC Birmingham notu, fiyatlar)
- [ ] Website oluşturma (Google Sites tasarım + Cloudflare'de domain yönlendirme)
- [ ] Exhibitor listesi genişletme (Autumn Fair + diğer fuarlar)
- [ ] Outreach başlatma (ilk dalga 50 firma)
- [ ] Pricing matrix oluşturma (Fatih ile)
- [ ] WhatsApp Business hesabı açma
- [ ] LinkedIn profili güncelleme

## Outreach Yapılan Firmalar

| # | Firma | Kişi | Email | Sektör | Durum |
|---|-------|------|-------|--------|-------|
| 1 | Adhock Homeware | Nick Hocking | hello@adhock.co.uk | Mum/ev aksesuarı | Mail hazır |
| 2 | Aquarelle Home | - | office@aquarlhome.co.uk | El yapımı ev dekor | Mail hazır |
| 3 | Beau Moda Collections | Tim | tim.beaumoda@yahoo.com | İtalyan çanta/aksesuar | Mail hazır |
| 4 | Blue Lily 925 Silver | - | sales@1962.me.uk | Gümüş takı | Mail hazır |
| 5 | Candlelight Products | - | contact@candlelight.co.uk | Mum/ev dekor/hediye | Mail hazır |

## Brevo SMTP Bilgileri
- Server: smtp-relay.brevo.com
- Port: 587
- Login: abdd54001@smtp-brevo.com

## Email Template Formatı
- Kısa, akıcı paragraflar (Gmail'de boşluk sorunu yaşandı, düzeltildi)
- Her firma için özelleştirilmiş açılış cümlesi
- Spec sheet PDF ek olarak eklenmeli
- Signature Gmail'de otomatik ekleniyor

## Dosyalar
- LED_Wall_Hire_Test_Plan.md — Ana plan dökümanı (12 haftalık timeline)
- Trust_Expo_Spec_Sheet.md — Spec sheet içeriği
- email_signature.html — Gmail email signature

## Hedef Fuarlar (NEC Birmingham)
| Fuar | Tarih | Exhibitor Sayısı |
|------|-------|-----------------|
| Autumn Fair | 6-9 Eylül 2026 | 800+ |
| Glee | 8-10 Eylül 2026 | 400+ |
| RWM Expo | 16-17 Eylül 2026 | - |
| Solar & Storage Live | 22-24 Eylül 2026 | 200+ |
| Grand Designs Live | 2-4 Ekim 2026 | - |
| Advanced Engineering | 4-5 Kasım 2026 | - |
