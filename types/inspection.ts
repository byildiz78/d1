export type InspectionRecord = {
  No: number
  Tarih: string
  Şube: string
  Form: string
  "Şube Sınıfı": string
  "Şube Tipi": string
  "Şube Kategorisi": string
  "Bölge Müdürü": string
  "Resim Linki": string
  "Onay Durumu": string
  Denetmen: string
  Açıklama: string
  Notlar: string
  "Şube Yetkilileri": string
}

export type InspectionDetail = {
  "Denetim No": number
  "Soru Grubu": string
  "Soru": string
  "Yanıt": string
  "Puan": number
  "Yorum": string
  "Resim1": string | null
  "Resim2": string | null
  "Resim3": string | null
  "Resim4": string | null
}
