import { Site, Artisan, Event, HiddenGem, SiteDetail } from "../../types/index";

export const hiddenGem: HiddenGem = {
  id: "1",
  title: "Uku Bahal, Lalitpur",
  distance: "1.4 Km",
  price: "Free Entry",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Uku_Bahal%2C_Patan.jpg/1280px-Uku_Bahal%2C_Patan.jpg",
};

export const nearbySites: Site[] = [
  {
    id: "1",
    name: "Pashupatinath Temple",
    type: "Temple",
    location: "Kathmandu",
    distance: "1.4 Km away",
    price: "Varied fees",
    mustVisit: true,
    rating: 4.8,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pashupatinath_Temple.jpg/800px-Pashupatinath_Temple.jpg",
  },
  {
    id: "2",
    name: "Swayambhunath Temple",
    type: "Temple",
    location: "Kathmandu",
    distance: "3.4 Km away",
    price: "Varied fees",
    mustVisit: true,
    rating: 4.7,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Swayambhunath_stupa.jpg/800px-Swayambhunath_stupa.jpg",
  },
  {
    id: "3",
    name: "Kopan Monastery",
    type: "Monastery",
    location: "Kathmandu",
    distance: "5.0 Km away",
    price: "Free Entry",
    mustVisit: false,
    rating: 4.6,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Kopan_Monastery.jpg/800px-Kopan_Monastery.jpg",
  },
];

export const localArtisans: Artisan[] = [
  {
    id: "1",
    name: "Sanu Maya Shrestha",
    craft: "Pottery Artisan",
    location: "Bhaktapur",
    distance: "7.0 Km away",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Khem Bahadur Ma...",
    craft: "Thanka Artist",
    location: "Kathmandu",
    distance: "3.5 Km away",
    image:
      "https://images.unsplash.com/photo-1607346704520-5aac7c9af9af?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Sanjay Shilpakar",
    craft: "Wood Crafter",
    location: "Lalitpur",
    distance: "3.2 Km away",
    image:
      "https://images.unsplash.com/photo-1613979820001-fc6d2ee2d56e?w=200&h=200&fit=crop",
  },
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Nepali New Year Concert",
    date: "15",
    month: "April",
    location: "Kathmandu",
    distance: "0.9 Km away",
    type: "Concert",
    price: "Free Entry",
  },
  {
    id: "2",
    title: "Nepali New Year Concert",
    date: "15",
    month: "April",
    location: "Kathmandu",
    distance: "0.9 Km away",
    type: "Concert",
    price: "Free Entry",
  },
  {
    id: "3",
    title: "Nepali New Year Concert",
    date: "15",
    month: "April",
    location: "Kathmandu",
    distance: "0.9 Km away",
    type: "Concert",
    price: "Free Entry",
  },
];

export const siteDetail: SiteDetail = {
  id: "1",
  name: "Uku Bahal",
  location: "Lalitpur",
  distance: "1.4 Km",
  rating: 4.5,
  price: "Free Entry",
  badge: "Hidden gem of the week",
  summary: `Pashupatinath Temple is one of the most sacred Hindu temples in the world, dedicated to Lord Shiva in his manifestation as Pashupati. Located on the banks of the Bagmati River, it is the holiest of all Shiva temples on Earth.`,
  didYouKnow:
    "The temple complex spans 264 hectares and contains over 518 temples and monuments dating from the 5th century onwards.",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Uku_Bahal%2C_Patan.jpg/1280px-Uku_Bahal%2C_Patan.jpg",
  type: "Temple",
  nearbyArtisans: [
    {
      id: "3",
      name: "Sanjay Shilpakar",
      craft: "Wood Crafter",
      location: "Lalitpur",
      distance: "3.2 Km away",
      image:
        "https://images.unsplash.com/photo-1613979820001-fc6d2ee2d56e?w=200&h=200&fit=crop",
    },
  ],
  reviews: [
    {
      id: "1",
      author: "Sunny Shah",
      date: "22 Jul",
      rating: 5,
      text: "Patan is a place full of historical heritage. Many monasteries...",
    },
  ],
};
