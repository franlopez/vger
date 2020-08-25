export interface Position {
  lat: number,
  lng: number,
}

export interface Article {
  pageid: string,
  title: string,
  extract: string,
  fullUrl: string,
  coordinates: {
    lat: number,
    lon: number,
  }[],
  thumbnail?: {
    source: string,
  },
}