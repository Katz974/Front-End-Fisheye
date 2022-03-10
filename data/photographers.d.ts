export interface Data {
  photographers: Photographer[]
  media: Media[]
}

export interface Photographer {
  name: string
  id: number
  city: string
  country: string
  tagline: string
  price: number
  portrait: string
}

export interface Media {
  id: number
  photographerId: number
  title: string
  image: string
  likes: number
  date: string
  price: number
}

type Handler = (photographers: Photographer[]) => void

// type composite
export type Color = Rgb | Rbgs | string


