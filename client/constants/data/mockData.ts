import { Site, Artisan, Event, HiddenGem, SiteDetail } from "../../types/index";

export const hiddenGem: HiddenGem = {
  id: "1",
  title: "Uku Bahal, Lalitpur",
  distance: "1.4 Km",
  price: "Free Entry",
  image:
    "https://nepaltraveller.com/images/main/1687762720.sidetrackimageuku-bahal_monastery03.jpg",
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
      "https://cms.holidaystonepal.in/media/Blogs/Pashupatinath-Temple-Photos/Pashupatinath-Temple.png",
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
      "https://cms.holidaystonepal.in/media/Blogs/SwayambhunathStupa/swayambhunath-stupa.png",
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
      "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/nmaeyoln5wx91n0opuna.jpg",
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
      "https://media.istockphoto.com/id/458585693/photo/earthenware-at-bhaktapur.jpg?s=612x612&w=0&k=20&c=SSMF5VlhI0NHz5h4ZsV990ShmyVsJlbqSrNXbXmo5kE=",
  },
  {
    id: "2",
    name: "Khem Bahadur Maharjan",
    craft: "Thanka Artist",
    location: "Kathmandu",
    distance: "3.5 Km away",
    image:
      "https://www.globaltimes.cn/Portals/0/attachment/2023/2023-03-26/4144c2a4-1180-4744-b848-055df770a64c.jpeg",
  },
  {
    id: "3",
    name: "Sanjay Shilpakar",
    craft: "Wood Crafter",
    location: "Lalitpur",
    distance: "3.2 Km away",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDs0Bv94LFLuxzgLUtK9PlY5b6juSBEOqPQ&s",
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
