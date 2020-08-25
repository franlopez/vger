import { Article } from "../../types";

// these are all purposefully inside the bounds of -100 to 100 lat and lon
const wikiArticles: Article[] = [
  {
    pageid: '3',
    title: 'This is an Article',
    extract: 'This one is, absolutely, an article, but it has no thumbnail...',
    fullUrl: 'https://www.wikipedia.org/this_is_an_article',
    coordinates: [
      {
        lat: 34.21,
        lon: 0.11,
      }
    ],
  },
  {
    pageid: '7',
    title: 'Zonalized Fransterdom',
    extract: 'Wow, this Fran is really something, huh?',
    fullUrl: 'https://www.wikipedia.org/zonalized_fransterdom',
    thumbnail: {
      source: 'https://www.wikipedia.org/zonefran.jpg',
    },
    coordinates: [
      {
        lat: -100,
        lon: -12.23,
      }
    ],
  },
  {
    pageid: '2',
    title: 'Yes! Yes!',
    extract: 'Just a page that says yes, twice.',
    fullUrl: 'https://www.wikipedia.org/yes_yes',
    thumbnail: {
      source: 'https://www.wikipedia.org/yesyes.jpg',
    },
    coordinates: [
      {
        lat: 100,
        lon: 100,
      }
    ],
  },
  {
    pageid: '11',
    title: 'Amazing, Frannnn!',
    extract: 'Just, like, <em>really</em> amazing.',
    fullUrl: 'https://www.wikipedia.org/amazing_frannnn',
    thumbnail: {
      source: 'https://www.wikipedia.org/amazefran.jpg',
    },
    coordinates: [
      {
        lat: 11.01,
        lon: -100,
      }
    ],
  },
];

export default wikiArticles;