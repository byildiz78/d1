# Denetim Uygulaması

Şube denetimlerinin yönetimi ve raporlanması için web tabanlı uygulama.

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd denetim
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevre değişkenlerini ayarlayın:
   - `.env.example` dosyasını `.env.local` olarak kopyalayın
   - `.env.local` dosyasındaki değişkenleri güncelleyin:
     - `API_URL`: API sunucu adresi
     - `API_TOKEN`: API erişim anahtarı
     - `DATABASE_URL`: Veritabanı bağlantı dizesi (isteğe bağlı)

4. Uygulamayı başlatın:
```bash
npm run dev
```

## Çevre Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|--------|
| API_URL | API sunucu adresi | http://49.13.74.24:5005 |
| API_TOKEN | API erişim anahtarı | 123 |
| DATABASE_URL | Veritabanı bağlantı dizesi | mssql+pyodbc://username:password@hostname,port/database |

## Geliştirme

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/byildiz78/d1)