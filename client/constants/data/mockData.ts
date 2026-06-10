import { Site, Artisan, Event, SiteDetail } from "../../types/index";

export const allSites: SiteDetail[] = [
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
    summary: `Pashupatinath Temple is one of the most sacred Hindu temples in the world, dedicated to Lord Shiva in his manifestation as Pashupati. Located on the banks of the Bagmati River, it is the holiest of all Shiva temples on Earth.`,
    didYouKnow:
      "The temple complex spans 264 hectares and contains over 518 temples and monuments dating from the 5th century onwards.",
    nearbyArtisans: [],
    reviews: [
      {
        id: "1",
        author: "Sunny Shah",
        date: "22 Jul",
        rating: 5,
        text: "Amazing spiritual experience! The architecture is breathtaking.",
      },
    ],
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
    // isHiddenGem: true,
    image:
      "https://cms.holidaystonepal.in/media/Blogs/SwayambhunathStupa/swayambhunath-stupa.png",
    summary: `Swayambhunath Stupa, also known as the Monkey Temple, is an ancient religious architecture atop a hill in the Kathmandu Valley. It is one of the most sacred Buddhist sites in Nepal.`,
    didYouKnow:
      "The stupa is surrounded by monkeys, which are considered holy. The temple is over 2,000 years old!",
    nearbyArtisans: [],
    reviews: [
      {
        id: "2",
        author: "Maria Garcia",
        date: "15 Aug",
        rating: 4.5,
        text: "Beautiful views of Kathmandu valley! The monkeys are entertaining.",
      },
    ],
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
    summary: `Kopan Monastery is a Tibetan Buddhist monastery located on the outskirts of Kathmandu. It offers meditation courses and breathtaking views of the Kathmandu Valley.`,
    didYouKnow:
      "The monastery was established in 1969 and has since become a popular destination for tourists seeking spiritual retreats.",
    nearbyArtisans: [],
    isHiddenGem: true,
    reviews: [
      {
        id: "3",
        author: "John Smith",
        date: "3 Sep",
        rating: 5,
        text: "Peaceful atmosphere and great meditation sessions.",
      },
    ],
  },
  {
    id: "4",
    name: "Uku Bahal",
    type: "Monastery",
    location: "Lalitpur",
    distance: "1.4 Km",
    price: "Free Entry",
    rating: 4.5,
    image:
      "https://nepaltraveller.com/images/main/1687762720.sidetrackimageuku-bahal_monastery03.jpg",
    summary: `Uku Bahal is a hidden Buddhist monastery located in the heart of Lalitpur. This serene courtyard offers a peaceful escape from the bustling city streets and showcases exquisite Newari architecture.`,
    didYouKnow:
      "Uku Bahal is also known as 'Bahu Bahal' and dates back to the 13th century. It's one of the oldest Buddhist monasteries in the Patan area.",
    nearbyArtisans: [],
    reviews: [
      {
        id: "4",
        author: "Sunny Shah",
        date: "22 Jul",
        rating: 5,
        text: "A beautiful hidden gem in Patan! The architecture is stunning and the peaceful atmosphere is perfect for meditation.",
      },
    ],
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
    distance: "0.10 Km away",
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
// Add artisans to sites
allSites[0].nearbyArtisans = [localArtisans[1], localArtisans[2]];
allSites[1].nearbyArtisans = [localArtisans[0], localArtisans[2]];
allSites[2].nearbyArtisans = [localArtisans[1]];
allSites[3].nearbyArtisans = [localArtisans[2]];
// Helper functions
export const getHiddenGem = (): SiteDetail | undefined => {
  return allSites.find((site) => site.isHiddenGem === true);
};

export const getSiteById = (id: string): SiteDetail | null => {
  return allSites.find((site) => site.id === id) || null;
};

export const nearbySites = allSites; // For backward compatibility
export const siteDetail = allSites[0]; // For backward compatibility
export const hiddenGem = getHiddenGem();
