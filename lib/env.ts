interface Env {
  API_URL?: string
  API_TOKEN?: string
}

export const env: Env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
}
