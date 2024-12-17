# Şikayet Yönetimi Modülü API Migrasyonu

Bu belge, şikayet yönetimi modülünün mock veriden SQL Server ve API entegrasyonuna geçiş sürecini yönetmek için oluşturulmuştur.

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

## 1. Veri Yapısı Analizi ve SQL Tablo Tasarımı
- [ ] Mock verilerden SQL tablo yapılarının belirlenmesi
- [ ] Ana tabloların tasarlanması:
  - [ ] `om_complaints`: Ana şikayet tablosu
  - [ ] `om_complaint_history`: Şikayet tarihçesi
  - [ ] `om_complaint_files`: Şikayet dosyaları
  - [ ] `om_complaint_observers`: Şikayet gözlemcileri

### Tablo Yapıları

#### om_complaints (Ana Şikayet Tablosu)
```sql
CREATE TABLE om_complaints (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    branch_id INT NOT NULL,  -- branches tablosuna referans
    source VARCHAR(20) NOT NULL,  -- website, email, sikayetvar, call_center, twitter, facebook, instagram
    status VARCHAR(20) NOT NULL,  -- open, in_progress, resolved, pending
    priority VARCHAR(10) NOT NULL,  -- high, medium, low
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    resolved_at DATETIME2 NULL,
    last_action_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    assigned_to INT NOT NULL,  -- users tablosuna referans
    customer_name NVARCHAR(100) NOT NULL,
    customer_contact NVARCHAR(100) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
)
```

#### om_complaint_history (Şikayet Tarihçesi)
```sql
CREATE TABLE om_complaint_history (
    id INT IDENTITY(1,1) PRIMARY KEY,
    complaint_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,  -- status_change, comment, assignment_change, etc.
    action_description NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    created_by INT NOT NULL,  -- users tablosuna referans
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
)
```

#### om_complaint_files (Şikayet Dosyaları)
```sql
CREATE TABLE om_complaint_files (
    id INT IDENTITY(1,1) PRIMARY KEY,
    complaint_id INT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    uploaded_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    uploaded_by INT NOT NULL,  -- users tablosuna referans
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
)
```

#### om_complaint_observers (Şikayet Gözlemcileri)
```sql
CREATE TABLE om_complaint_observers (
    complaint_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    assigned_by INT NOT NULL,  -- users tablosuna referans
    PRIMARY KEY (complaint_id, user_id),
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
)
```

### İndeksler
```sql
-- om_complaints tablosu için indeksler
CREATE INDEX IX_om_complaints_status ON om_complaints(status);
CREATE INDEX IX_om_complaints_branch_id ON om_complaints(branch_id);
CREATE INDEX IX_om_complaints_assigned_to ON om_complaints(assigned_to);
CREATE INDEX IX_om_complaints_created_at ON om_complaints(created_at DESC);

-- om_complaint_history tablosu için indeksler
CREATE INDEX IX_om_complaint_history_complaint_id ON om_complaint_history(complaint_id);
CREATE INDEX IX_om_complaint_history_created_at ON om_complaint_history(created_at DESC);

-- om_complaint_files tablosu için indeksler
CREATE INDEX IX_om_complaint_files_complaint_id ON om_complaint_files(complaint_id);

-- om_complaint_observers tablosu için indeksler
CREATE INDEX IX_om_complaint_observers_user_id ON om_complaint_observers(user_id);
```

### Notlar
- Tüm tablolarda NVARCHAR kullanıldı (Unicode desteği için)
- Tarih alanları için DATETIME2 kullanıldı (daha yüksek hassasiyet)
- İlişkisel bütünlük için foreign key'ler eklendi
- Performans için gerekli indeksler oluşturuldu
- Şikayet kaynakları (source) ve durumları (status) için enum benzeri kısıtlamalar eklendi

## 2. SQL Server Tablo Oluşturma

### Tablo Oluşturma Scripti
SQL script dosyası oluşturuldu: `/sql/create_complaint_tables.sql`

### Yapılan İyileştirmeler
1. Enum Değer Kontrolleri
   - `fn_check_complaint_source`: Şikayet kaynaklarını kontrol eden fonksiyon
   - `fn_check_complaint_status`: Şikayet durumlarını kontrol eden fonksiyon
   - `fn_check_complaint_priority`: Öncelik değerlerini kontrol eden fonksiyon

2. Triggerlar
   - `tr_complaint_update_last_action`: Son işlem tarihini otomatik güncelleyen trigger
   - `tr_complaint_status_history`: Durum değişikliklerini otomatik olarak history tablosuna ekleyen trigger

3. Constraint ve İndeksler
   - Her tabloya gerekli foreign key constraintler eklendi
   - Performans için önemli alanlara indeksler eklendi
   - Check constraintler ile veri bütünlüğü sağlandı

### Bağımlılıklar
Script çalıştırılmadan önce aşağıdaki tabloların mevcut olması gerekiyor:
- `branches`: Şube bilgileri tablosu
- `users`: Kullanıcı bilgileri tablosu

## 3. Örnek Verilerin Hazırlanması

### Veri Ekleme Scripti
SQL script dosyası oluşturuldu: `/sql/insert_complaint_data.sql`

### Örnek Veri İçeriği
1. Ana Şikayet Kayıtları
   - 5 farklı örnek şikayet kaydı
   - Farklı şubeler, durumlar ve öncelikler
   - Gerçekçi tarih ve kullanıcı bilgileri

2. Şikayet Tarihçesi
   - Her şikayet için başlangıç durumu kaydı
   - Gözlemci atama kayıtları
   - Durum değişikliği kayıtları

3. Dosya Kayıtları
   - 3 farklı şikayet için örnek dosya kayıtları
   - Gerçekçi dosya isimleri ve boyutları

4. Gözlemci Kayıtları
   - 3 farklı şikayet için gözlemci atamaları
   - Her atama için ilgili tarihçe kayıtları

### Önemli Notlar
- Script çalıştırılmadan önce:
  1. `branches` tablosundaki gerçek şube ID'leri
  2. `users` tablosundaki gerçek kullanıcı ID'leri
  ile güncellenmelidir
- Tarih değerleri örnek amaçlıdır, gerekirse güncellenebilir
- Dosya yolları örnek olarak verilmiştir, gerçek sistem yapısına göre düzenlenmelidir

## 4. SQL Sorgu Hazırlığı

### SQL Sorgu Dosyası
SQL script dosyası oluşturuldu: `/sql/complaint_queries.sql`

### Hazırlanan Sorgular

#### Veri Okuma Sorguları
1. Şikayet Listesi Sorgusu
   - Filtreleme özellikleri: durum, şube, atanan kişi, arama terimi, tarih aralığı
   - Sayfalama ve sıralama desteği
   - İlişkili tablo verileri (şube adı, atanan kişi adı)

2. Tekil Şikayet Detayı Sorgusu
   - Tüm şikayet bilgileri
   - Dosya sayısı
   - Gözlemci listesi
   - İlişkili tablo verileri

3. Şikayet Tarihçesi Sorgusu
   - Tüm tarihçe kayıtları
   - İşlem türü ve açıklaması
   - İşlemi yapan kullanıcı bilgisi

4. Şikayet Dosyaları Sorgusu
   - Dosya bilgileri
   - Yüklenme tarihi
   - Yükleyen kullanıcı bilgisi

#### Veri Yazma Sorguları
5. Yeni Şikayet Ekleme Sorgusu
   - Ana şikayet kaydı
   - Gözlemci kayıtları
   - İlk tarihçe kaydı

6. Şikayet Güncelleme Sorgusu
   - Tüm alanların güncellenmesi
   - Gözlemci listesinin güncellenmesi
   - Tarihçe kaydı eklenmesi
   - Çözüldü durumu için tarih yönetimi

7. Yeni Dosya Ekleme Sorgusu
   - Dosya kaydı
   - İlgili tarihçe kaydı

8. Yeni Yorum Ekleme Sorgusu
   - Tarihçe tablosuna yorum kaydı

### Sorgu Özellikleri
- Parametrik sorgular (SQL injection koruması)
- İlişkisel veri bütünlüğü
- Otomatik tarihçe kayıtları
- Performans optimizasyonları

## 5. Frontend Entegrasyonu

### API Client Oluşturma
API client dosyası oluşturuldu: `/lib/complaint-api.ts`

#### Eklenen Fonksiyonlar
1. Veri Okuma Fonksiyonları:
   - `getComplaints`: Şikayet listesi
   - `getComplaintDetail`: Tekil şikayet detayı
   - `getComplaintHistory`: Şikayet tarihçesi
   - `getComplaintFiles`: Şikayet dosyaları

2. Veri Yazma Fonksiyonları:
   - `createComplaint`: Yeni şikayet oluşturma
   - `updateComplaint`: Şikayet güncelleme
   - `addComplaintFile`: Dosya ekleme
   - `addComplaintComment`: Yorum ekleme

#### Tip Tanımlamaları
- `ComplaintFilters`: Liste filtreleme parametreleri
- `ComplaintInput`: Şikayet oluşturma/güncelleme parametreleri
- `FileInput`: Dosya ekleme parametreleri

#### Güvenlik ve Hata Yönetimi
- SQL injection koruması
- Retry mekanizması (api-client.ts'den miras)
- Hata durumlarının ele alınması

### Component Güncellemeleri
Aşağıdaki componentlerin mock veriden gerçek API'ye geçişi yapılacak:
- [x] `page.tsx`: Ana liste sayfası
- [x] `[id]/page.tsx`: Detay sayfası
- [x] `new/page.tsx`: Yeni şikayet sayfası
- [x] `[id]/edit/page.tsx`: Düzenleme sayfası
- [x] `ComplaintForm.tsx`: Form componenti
- [x] `ComplaintHistory.tsx`: Tarihçe componenti
- [x] `file-upload.tsx`: Dosya yükleme componenti

## İlerleme Durumu ve Notlar

### [Tarih: 2024-12-07]
- Migrasyon planı oluşturuldu
- Belge yapısı hazırlandı
- Veri yapısı analizi tamamlandı
- SQL tablo tasarımları oluşturuldu
- SQL Server tablo oluşturma scriptleri hazırlandı
- Veri bütünlüğü için kontroller ve triggerlar eklendi
- Örnek veri ekleme scriptleri hazırlandı
- Frontend için SQL sorguları hazırlandı
- API client fonksiyonları oluşturuldu
- Ana liste sayfası API entegrasyonu tamamlandı
- Detay sayfası API entegrasyonu tamamlandı
- Yeni şikayet oluşturma sayfası API entegrasyonu tamamlandı
- Şikayet formu componenti oluşturuldu ve API entegrasyonu tamamlandı
- Şube ve kullanıcı listeleme API fonksiyonları eklendi
- Şikayet düzenleme sayfası API entegrasyonu tamamlandı
- Tarihçe componenti oluşturuldu ve API entegrasyonu tamamlandı
- Dosya yükleme componenti oluşturuldu ve API entegrasyonu tamamlandı

## Tamamlanan Görevler
- [x] Migrasyon planının oluşturulması
- [x] Belgenin hazırlanması
- [x] Veri yapısı analizi
- [x] SQL tablo tasarımı
- [x] SQL Server tablo oluşturma scriptlerinin hazırlanması
- [x] Örnek verilerin hazırlanması
- [x] SQL sorgu hazırlığı
- [x] API client fonksiyonlarının oluşturulması
- [x] Ana liste sayfası API entegrasyonu
- [x] Detay sayfası API entegrasyonu
- [x] Yeni şikayet sayfası API entegrasyonu
- [x] Şikayet formu componenti oluşturulması
- [x] Şikayet düzenleme sayfası API entegrasyonu
- [x] Tarihçe componenti oluşturulması
- [x] Dosya yükleme componenti oluşturulması

## Devam Eden Görevler
- [ ] Test ve doğrulama

## Bekleyen Görevler
