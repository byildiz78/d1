export type ComplaintSource = 
  | "website"
  | "email"
  | "sikayetvar"
  | "call_center"
  | "twitter"
  | "facebook"
  | "instagram";

export const complaintSourceMap: Record<ComplaintSource, string> = {
  website: "Web Sitesi",
  email: "E-posta",
  sikayetvar: "Şikayetvar.com",
  call_center: "Çağrı Merkezi",
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram"
};

export interface Manager {
  id: string;
  name: string;
  role: string;
}

export interface Observer {
  id: string;
  name: string;
  role: string;
}