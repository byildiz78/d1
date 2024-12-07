# API Migration Plan

Bu belge, mevcut SQL sorgularının API endpoint'ine taşınması sürecini yönetmek için oluşturulmuştur.

## Hedef API Endpoint

```
URL: http://49.13.74.24:5005/api/query
Method: POST
Headers:
  - Accept: application/json
  - Authorization: Bearer 123
  - Content-Type: application/json
Body:
  {
    "query": "SQL_QUERY"
  }
```

## 1. Mevcut Yapı Analizi

### 1.1 Temel Bileşenler
- `database.ts` dosyası server-side kod içeriyor
- SQL bağlantı yönetimi ve sorgu yürütme altyapısı mevcut

### 1.2 Mevcut Fonksiyonlar
1. `executeQuery`: Genel sorgu yürütme fonksiyonu
2. `getActiveBranchCount`: Aktif şube sayısı
3. `getRecentInspections`: Son denetimler
4. `getTotalInspectionCount`: Toplam denetim sayısı
5. `getCurrentMonthInspectionCount`: Bu ayki denetim sayısı
6. `getCurrentWeekInspectionCount`: Bu haftaki denetim sayısı
7. `getNotifications`: Bildirimler
8. `getMonthlyInspectionCounts`: Aylık denetim sayıları
9. `getFormDistribution`: Form dağılımı
10. `getInspectionHeader`: Denetim başlık bilgileri
11. `getInspectionDetails`: Denetim detayları
12. `getAllInspectionIds`: Tüm denetim ID'leri

## 2. API Geçiş Stratejisi

### 2.1 API İstemci Katmanı
```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl = 'http://49.13.74.24:5005';
  private token = '123';

  async executeQuery(query: string) {
    const response = await fetch(`${this.baseUrl}/api/query`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
}
```

### 2.2 Fonksiyon Dönüşüm Planı
Her fonksiyon için:
1. SQL sorgusunu API'ye gönder
2. Yanıtı mevcut veri yapısına dönüştür
3. Hata yönetimini koru

## 3. Güvenlik ve Yapılandırma

### 3.1 Güvenlik
- [x] API token'ı `.env` dosyasında sakla
- [ ] Token rotasyonu planı oluştur
- [ ] SSL/TLS kullanımını kontrol et

### 3.2 Hata Yönetimi
- [ ] Rate limiting stratejisi
- [ ] Retry mekanizması
- [ ] Hata loglama sistemi
- [ ] Timeout yönetimi

## 4. Test Stratejisi

### 4.1 Test Türleri
- [ ] Birim testleri
- [ ] Entegrasyon testleri
- [ ] Performans testleri
- [ ] Yük testleri

### 4.2 Test Senaryoları
- [ ] Başarılı sorgu senaryoları
- [ ] Hata senaryoları
- [ ] Timeout senaryoları
- [ ] Ağ kesintisi senaryoları

## 5. Geçiş Sırası

### 5.1 Aşama 1: Basit Sorgular
- [x] getActiveBranchCount
- [x] getTotalInspectionCount
- [x] getCurrentMonthInspectionCount
- [x] getCurrentWeekInspectionCount

### 5.2 Aşama 2: Liste Sorguları
- [x] getRecentInspections
- [x] getNotifications
- [x] getMonthlyInspectionCounts
- [x] getFormDistribution

### 5.3 Aşama 3: Detay Sorguları
- [x] getInspectionHeader
- [x] getInspectionDetails
- [x] getAllInspectionIds

## 6. İzleme ve Bakım

### 6.1 Metrikler
- [ ] API yanıt süreleri
- [ ] Hata oranları
- [ ] Kaynak kullanımı
- [ ] Başarılı/başarısız sorgu oranları

### 6.2 Bakım Planı
- [ ] Günlük log analizi
- [ ] Haftalık performans raporu
- [ ] Aylık güvenlik taraması

## 7. İlerleme Durumu

### Tamamlanan Görevler
- [x] Mevcut yapı analizi
- [x] Geçiş planı oluşturma
- [x] API İstemci katmanı oluşturma
- [x] API token'ı `.env` dosyasında saklama
- [x] İlk fonksiyon dönüşümleri (getActiveBranchCount, getTotalInspectionCount)

### Devam Eden Görevler
- [ ] Test ortamı hazırlama
- [ ] Fonksiyon dönüşümleri
- [ ] Test senaryoları yazımı

### Bekleyen Görevler
- [ ] Canlıya geçiş planı

## 8. Notlar ve Güncellemeler

### [Tarih: 2024-01-24]
- İlk plan oluşturuldu
- Mevcut yapı analizi tamamlandı
- Geçiş stratejisi belirlendi

### [Tarih: 2024-01-24 - API İstemci Katmanı]
- `lib/api-client.ts` dosyası oluşturuldu
  - Retry mekanizması eklendi
  - Hata yönetimi eklendi
  - Timeout yönetimi eklendi
- `.env` dosyasına API yapılandırması eklendi
  - API_URL ve API_TOKEN değişkenleri tanımlandı

### [Tarih: 2024-01-24 - İlk Fonksiyon Dönüşümleri]
- `getActiveBranchCount` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - ApiClient import edildi
  - executeQuery yerine apiClient.executeQuery kullanıldı
  - Hata yönetimi güncellendi
- `getTotalInspectionCount` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - Aynı hata yönetimi ve API istemci yapısı uygulandı
  - Tip güvenliği korundu

### [Tarih: 2024-01-24 - API İstemci Katmanı Düzeltmesi]
- API istemcisi class yapısından fonksiyon tabanlı yapıya dönüştürüldü
  - "use server" uyumluluğu için class yerine fonksiyonlar kullanıldı
  - Sabit değişkenler tanımlandı
  - Retry ve hata yönetimi fonksiyonları ayrıldı
- `database.ts` fonksiyonları güncellendi
  - ApiClient yerine executeQuery fonksiyonu import edildi
  - Fonksiyonlar sadeleştirildi

### [Tarih: 2024-01-24 - Fonksiyon Dönüşümleri]
- `getCurrentMonthInspectionCount` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - Hata yönetimi API yanıtlarına uygun şekilde güncellendi
  - SQL sorgusu ve veri yapısı korundu
  - Tip güvenliği sağlandı
- `getCurrentWeekInspectionCount` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - Direkt SQL bağlantısı yerine API istemcisi kullanıldı
  - Hata yönetimi ve veri yapısı standardize edildi
  - Tip güvenliği sağlandı

### [Tarih: 2024-01-24 - Liste Sorguları Dönüşümü]
- `getRecentInspections` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - RecentInspection interface'i eklenerek tip güvenliği sağlandı
  - Hata yönetimi ve loglama geliştirildi
  - SQL sorgusu korundu
  - Dönüş tipi açıkça belirtildi
- `getNotifications` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - Direkt SQL bağlantısı yerine API istemcisi kullanıldı
  - Mevcut Notification interface'i kullanıldı
  - Hata yönetimi geliştirildi
  - Tip güvenliği korundu
- `getMonthlyInspectionCounts` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - MonthlyInspection interface'i eklenerek tip güvenliği sağlandı
  - Direkt SQL bağlantısı yerine API istemcisi kullanıldı
  - Veri dönüşüm mantığı (ay isimleri) korundu
  - Hata yönetimi geliştirildi
- `getFormDistribution` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - FormDistribution interface'i eklenerek tip güvenliği sağlandı
  - Direkt SQL bağlantısı yerine API istemcisi kullanıldı
  - Veri dönüşüm mantığı korundu
  - Hata yönetimi geliştirildi

### Aşama 1 İlerleme Durumu
- [x] getActiveBranchCount 
- [x] getTotalInspectionCount 
- [x] getCurrentMonthInspectionCount
- [x] getCurrentWeekInspectionCount

### Aşama 1 Tamamlandı! 
Tüm basit sorgular başarıyla API istemcisine taşındı.

### Aşama 2 İlerleme Durumu
- [x] getRecentInspections 
- [x] getNotifications
- [x] getMonthlyInspectionCounts
- [x] getFormDistribution

### Aşama 2 Tamamlandı! 
Tüm liste sorguları başarıyla API istemcisine taşındı.

### Sonraki Adım
Aşama 3'e geçiş: Detay Sorguları
- getInspectionHeader fonksiyonunun dönüşümü

### [Tarih: 2024-01-24 - Detay Sorguları Dönüşümü]
- `getInspectionHeader` fonksiyonu API istemcisini kullanacak şekilde güncellendi
  - InspectionHeader interface'i güncellendi ve tip güvenliği artırıldı
  - Onay durumu için literal union type kullanıldı ('Onaylandı' | 'Onay Bekliyor' | 'Belirsiz')
  - SQL sorgusu temizlendi ve formatlandı
  - API istemcisi entegrasyonu tamamlandı
  - Hata yönetimi ve loglama geliştirildi

- `getInspectionDetails` fonksiyonu iyileştirildi
  - InspectionDetail interface'i eklendi
  - Resim alanları için null değer desteği eklendi
  - SQL sorgusu temizlendi ve formatlandı
  - Hata yönetimi ve loglama geliştirildi
  - Tip güvenliği artırıldı (Promise return type)
  - Hata mesajları iyileştirildi

- `getAllInspectionIds` fonksiyonu iyileştirildi
  - SQL sorgusu formatlandı
  - Tip güvenliği artırıldı (record tipi tanımlandı)
  - Hata yönetimi geliştirildi
  - Kod formatı tutarlı hale getirildi
  - result.error kullanımı düzeltildi

### Aşama 3 İlerleme Durumu
- [x] getInspectionHeader 
- [x] getInspectionDetails
- [x] getAllInspectionIds

### Aşama 3 Tamamlandı! 
Tüm detay sorguları başarıyla API istemcisine taşındı.

### Sonraki Adım
Aşama 4'e geçiş: Raporlama Sorguları
- getInspectionReport fonksiyonunun dönüşümü

### [Tarih: 2024-01-24 - Raporlama Sorguları Dönüşümü]
- `getInspectionReport` fonksiyonu oluşturuldu
  - InspectionReport interface'i eklendi
  - Kompleks SQL sorgusu CTE (Common Table Expression) kullanılarak yazıldı
  - Puan hesaplamaları için CAST ve DECIMAL kullanıldı
  - Tip güvenliği sağlandı
  - Hata yönetimi ve loglama eklendi
  - API istemcisi entegrasyonu tamamlandı

### Aşama 4 İlerleme Durumu
- [x] getInspectionReport 

### Aşama 4 Tamamlandı! 
Tüm raporlama sorguları başarıyla API istemcisine taşındı.

### API Migrasyonu Tamamlandı! 
Tüm sorgular başarıyla API istemcisine taşındı. Özetlersek:

#### Aşama 1: Sayım Sorguları 
- getActiveBranchCount
- getTotalInspectionCount
- getCurrentMonthInspectionCount
- getCurrentWeekInspectionCount

#### Aşama 2: Liste Sorguları 
- getRecentInspections
- getNotifications
- getMonthlyInspectionCounts
- getFormDistribution

#### Aşama 3: Detay Sorguları 
- getInspectionHeader
- getInspectionDetails
- getAllInspectionIds

#### Aşama 4: Raporlama Sorguları 
- getInspectionReport

### Sonraki Adım
- Tüm fonksiyonların test edilmesi
- Performans izleme
- Hata durumlarının kontrolü
