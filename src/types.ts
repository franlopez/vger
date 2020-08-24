export interface Position {
  lat: number,
  lng: number,
}

export interface Article {
  pageid: string,
  title: string,
  extract: string,
  fullUrl: string,
  thumbnail: {
    source: string,
  },
  coordinates: {
    lat: number,
    lon: number,
  }[],
}