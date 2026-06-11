import mongoose from "mongoose";
import dotenv from "dotenv";
import { SiteModel } from "../models/site.model";
import { ArtisanModel } from "../models/artisan.model";
import { EventModel } from "../models/event.model";
import { SiteArtisanModel } from "../models/siteArtisan.model";
import { ReviewModel } from "../models/review.model";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

const sites = [
  // Kathmandu Valley Sites
  {
    name: "Pashupatinath Temple",
    type: "Temple",
    location: "Kathmandu",
    city: "Kathmandu",
    coordinates: { lat: 27.7109, lng: 85.3484 },
    price: "NPR 1000 (foreigners), Free for SAARC/Hindus",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 1245,
    image:
      "https://cms.holidaystonepal.in/media/Blogs/Pashupatinath-Temple-Photos/Pashupatinath-Temple.png",
    summary:
      "Pashupatinath Temple is one of the most sacred Hindu temples in the world, dedicated to Lord Shiva in his manifestation as Pashupati. Located on the banks of the Bagmati River, it is the holiest of all Shiva temples on Earth.",
    longDescription:
      "The Pashupatinath Temple complex spans 264 hectares and contains over 518 temples and monuments dating from the 5th century onwards. The main pagoda-style temple has a gilded roof, four sides covered in silver, and exquisite wooden carvings. The lingam inside is one of the most important in all of Hinduism. The temple was inscribed on the UNESCO World Heritage List in 1979. The site attracts thousands of pilgrims during Maha Shivaratri, with over 700,000 devotees attending annually.",
    history:
      "The temple's existence dates back to 400 AD, though the current structure was built in 1692 by King Bhupalendra Malla. Legend says that Lord Shiva once lived here as a deer (Pashupati) and bathed in the Bagmati River. The temple survived multiple invasions, including the Muslim invasion of 1349 when the main lingam was hidden in the river. The priests of Pashupatinath have been from South India since the 5th century, continuing a tradition of Dravidian Brahmins performing the rituals.",
    myth: "According to the Shiva Purana, Shiva and Parvati came to the Kathmandu Valley and rested on the banks of the Bagmati River, transforming into deer. The gods searched for them and found them here, hence the name Pashupati - Lord of Animals. Another legend states that a cow would pour her milk on a particular spot daily, revealing a divine lingam buried beneath.",
    archeology:
      "Archaeological excavations have revealed coins, pottery, and stone inscriptions dating back to the Licchavi period (400-750 AD). The temple's golden spire has been scientifically analyzed to contain over 800kg of pure gold leaf. The surrounding ghats show evidence of continuous cremation activity for over 1,500 years, with carbon dating confirming some of the oldest continuous funeral practices in the world.",
    quizzes: [
      {
        question: "Which river flows beside Pashupatinath Temple?",
        options: ["Bagmati", "Bishnumati", "Gandaki", "Koshi"],
        correct: 0,
      },
      {
        question: "Pashupatinath is dedicated to which Hindu deity?",
        options: ["Vishnu", "Brahma", "Shiva", "Ganesh"],
        correct: 2,
      },
      {
        question:
          "The priests of Pashupatinath traditionally come from which region?",
        options: ["Nepal", "Tibet", "South India", "North India"],
        correct: 2,
      },
      {
        question:
          "On which festival do over 700,000 devotees visit Pashupatinath?",
        options: ["Dashain", "Tihar", "Maha Shivaratri", "Holi"],
        correct: 2,
      },
    ],
    translations: {
      nepali: "पशुपतिनाथ मन्दिर",
      chinese: "帕斯帕提那神庙",
      japanese: "パシュパティナート寺院",
      korean: "파슈파티나트 사원",
      spanish: "Templo Pashupatinath",
    },
    openingHours: "4:00 AM - 10:00 PM",
  },
  {
    name: "Swayambhunath Stupa",
    type: "Stupa",
    location: "Kathmandu",
    city: "Kathmandu",
    coordinates: { lat: 27.7149, lng: 85.2906 },
    price: "NPR 200 (foreigners)",
    mustVisit: true,
    rating: 4.7,
    ratingCount: 1890,
    image:
      "https://cms.holidaystonepal.in/media/Blogs/SwayambhunathStupa/swayambhunath-stupa.png",
    summary:
      "Swayambhunath Stupa, also known as the Monkey Temple, is an ancient religious architecture atop a hill in the Kathmandu Valley. It is one of the most sacred Buddhist sites in Nepal.",
    longDescription:
      "Swayambhunath is an iconic symbol of Nepal, featuring a massive white dome with a golden spire painted with the eyes of Buddha. The stupa is surrounded by smaller temples, monasteries, shrines, and hundreds of prayer wheels. The complex offers panoramic views of the entire Kathmandu Valley. It serves as a pilgrimage site for both Buddhists and Hindus, representing the religious harmony of Nepal.",
    history:
      "The stupa is over 2,000 years old, with historical records dating it to 460 AD. According to the Gopālarājavaṃśāvalī, it was built by King Mānadeva during the Licchavi period. The site was declared a UNESCO World Heritage Site in 1979. The name 'Swayambhu' means 'self-existent,' referring to the belief that the stupa spontaneously emerged from a lotus flower that bloomed in the ancient lake that once covered the Kathmandu Valley.",
    myth: "Legend states that the Kathmandu Valley was once a great lake. The Bodhisattva Manjushri saw a lotus flower glowing with brilliant light at the lake's center. He cut a gorge at Chobar, draining the water and allowing the lotus to become the hill, with the lotus becoming the stupa. The monkeys that inhabit the area are considered sacred, believed to be the lice from Manjushri's hair that transformed into monkeys.",
    archeology:
      "Archaeological studies have revealed that the stupa's foundation contains sacred relics, possibly including the remains of the Buddha Kashyapa. The spire contains 13 steps representing the 13 stages of enlightenment. Recent restoration work uncovered ancient Tibetan manuscripts and bronze statues dating to the 12th century within the stupa's base.",
    quizzes: [
      {
        question: "What are Swayambhunath's resident animals called?",
        options: ["Dogs", "Monkeys", "Peacocks", "Deer"],
        correct: 1,
      },
      {
        question: "What does 'Swayambhu' mean?",
        options: [
          "Enlightened",
          "Self-existent",
          "Golden Light",
          "Sacred Hill",
        ],
        correct: 1,
      },
      {
        question: "What color are the eyes painted on the stupa?",
        options: ["Black", "Blue", "White", "Gold"],
        correct: 0,
      },
      {
        question: "Who drained the ancient lake to reveal Swayambhunath?",
        options: ["Buddha", "Manjushri", "Avalokiteshvara", "Padmasambhava"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "स्वयम्भूनाथ स्तूप",
      chinese: "斯瓦扬布纳特佛塔",
      japanese: "スワヤンブナート・ストゥーパ",
      korean: "스와얌부나트 사원",
      spanish: "Estupa Swayambhunath",
    },
    openingHours: "All day",
  },
  {
    name: "Boudhanath Stupa",
    type: "Stupa",
    location: "Kathmandu",
    city: "Kathmandu",
    coordinates: { lat: 27.7215, lng: 85.3621 },
    price: "NPR 400 (foreigners)",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 2100,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Boudha_stupa.jpg/1200px-Boudha_stupa.jpg",
    summary:
      "Boudhanath Stupa is one of the largest stupas in the world and a UNESCO World Heritage Site. It is the center of Tibetan Buddhism in Nepal.",
    longDescription:
      "The massive mandala-shaped stupa stands 36 meters tall with a circumference of 120 meters. The white dome represents the entire universe, while the 13-tiered spire symbolizes the path to enlightenment. The surrounding streets are filled with Tibetan monasteries, shops selling Buddhist artifacts, and traditional restaurants. The stupa is particularly magical at night when lit by hundreds of butter lamps.",
    history:
      "Built during the Licchavi period (5th-6th century), Boudhanath became a major pilgrimage site after Tibetan Buddhists fled to Nepal following the 1959 Chinese invasion of Tibet. The stupa was severely damaged in the 2015 earthquake but was fully restored by 2016. It remains the most important Tibetan Buddhist center outside Tibet, with over 50 monasteries surrounding it.",
    myth: "According to legend, a poor widow asked the king for land to build a stupa. He agreed to give her the area covered by a buffalo hide. She cleverly cut the hide into thin strips and encircled a large area, creating the vast stupa. Another legend states that the stupa houses the relics of Buddha Kashyapa, the Buddha before Gautama.",
    archeology:
      "Excavations around the stupa have unearthed ancient bronze statues, prayer manuscripts, and ritual objects dating back to the 7th century. The base contains three large platforms representing the three jewels of Buddhism. Ground-penetrating radar suggests there may be hidden chambers within the stupa's core containing additional relics.",
    quizzes: [
      {
        question: "How tall is Boudhanath Stupa?",
        options: ["26m", "36m", "46m", "56m"],
        correct: 1,
      },
      {
        question: "What is the shape of the stupa's base?",
        options: ["Square", "Circle", "Mandala", "Octagon"],
        correct: 2,
      },
      {
        question: "After which earthquake was Boudhanath restored?",
        options: ["1934", "1988", "2015", "2020"],
        correct: 2,
      },
      {
        question: "Boudhanath is a center for which Buddhist tradition?",
        options: ["Theravada", "Zen", "Tibetan", "Pure Land"],
        correct: 2,
      },
    ],
    translations: {
      nepali: "बौद्धनाथ स्तूप",
      chinese: "博大哈佛塔",
      japanese: "ボダナート・ストゥーパ",
      korean: "보드나트 사원",
      spanish: "Estupa Boudhanath",
    },
    openingHours: "All day",
  },
  {
    name: "Patan Durbar Square",
    type: "Heritage Square",
    location: "Lalitpur",
    city: "Lalitpur",
    coordinates: { lat: 27.671, lng: 85.3248 },
    price: "NPR 1000 (foreigners)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 1750,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Patan_durbar_square.jpg/1200px-Patan_durbar_square.jpg",
    summary:
      "Patan Durbar Square is a UNESCO World Heritage Site showcasing the finest example of Newari architecture in Nepal. It hosts ancient temples, courtyards, and the Patan Museum.",
    longDescription:
      "The square features a stunning collection of pagoda-style temples, stone sculptures, and ancient palaces. The centerpiece is the Royal Palace with its beautiful courtyards - Mul Chowk, Sundari Chowk, and Keshav Narayan Chowk. The famous Krishna Mandir, built entirely of stone, is Nepal's finest example of Shikhara-style architecture. The square comes alive during festivals like Rato Machhindranath Jatra, featuring a massive chariot procession.",
    history:
      "Patan was founded in the 3rd century by King Veer Deva. The current square's structures date primarily from the Malla period (12th-18th centuries), particularly King Siddhi Narsingh Malla (1619-1661) and King Srinivasa Malla (1685-1705). The square survived the 2015 earthquake with some damage, and restoration work continues using traditional materials and techniques.",
    myth: "The Krishna Mandir is said to have been built after King Siddhi Narsingh Malla saw Lord Krishna and Radha standing in front of the palace. The 21 golden spires represent the 21 forms of Krishna. Locals believe the temple's stone carvings come alive at midnight to dance. The nearby Kumbeshwar temple is believed to contain water from all five of Nepal's holy rivers.",
    archeology:
      "The square contains over 1,200 objects of archaeological significance including the famous 'Shakti' stone sculpture dating to 467 AD. Excavations in Mul Chowk revealed ancient coins from the Licchavi period and remnants of a 7th-century palace. The stone water conduits (hiti) in the square demonstrate advanced hydraulic engineering from the 12th century.",
    quizzes: [
      {
        question: "Patan Durbar Square is located in which city?",
        options: ["Kathmandu", "Bhaktapur", "Lalitpur", "Kirtipur"],
        correct: 2,
      },
      {
        question: "Which temple in the square is made entirely of stone?",
        options: ["Vishwanath", "Krishna Mandir", "Bhimsen", "Jagannarayan"],
        correct: 1,
      },
      {
        question: "Patan was founded in which century?",
        options: ["1st", "2nd", "3rd", "4th"],
        correct: 2,
      },
      {
        question:
          "What festival features a massive chariot procession in Patan?",
        options: [
          "Indra Jatra",
          "Rato Machhindranath",
          "Gai Jatra",
          "Bisket Jatra",
        ],
        correct: 1,
      },
    ],
    translations: {
      nepali: "पाटन दरबार क्षेत्र",
      chinese: "帕坦王宫广场",
      japanese: "パタン・ダルバール広場",
      korean: "파탄 두르바르 광장",
      spanish: "Plaza Patan Durbar",
    },
    openingHours: "Sunrise to Sunset",
  },
  {
    name: "Bhaktapur Durbar Square",
    type: "Heritage Square",
    location: "Bhaktapur",
    city: "Bhaktapur",
    coordinates: { lat: 27.6728, lng: 85.4289 },
    price: "NPR 1500 (foreigners)",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 1950,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Bhaktapur_Durbar_Square_01.jpg/1280px-Bhaktapur_Durbar_Square_01.jpg",
    summary:
      "Bhaktapur Durbar Square is the most well-preserved of Nepal's royal squares, featuring the 55-Window Palace, Golden Gate, and numerous temples showcasing medieval Newari architecture.",
    longDescription:
      "This square is a living museum of medieval art and architecture. The 55-Window Palace (built 1754) features exquisitely carved wooden windows. The Golden Gate (1706) is considered the most beautiful and richly carved gate in the world. The Nyatapola Temple, a five-tiered pagoda built in 1702, is Nepal's tallest pagoda and survived the 2015 earthquake with minimal damage. The square also features the famous Peacock Window, a masterpiece of wood carving.",
    history:
      "Bhaktapur was founded in the 12th century by King Ananda Malla. The current square flourished under King Bhupatindra Malla (1696-1722), who built many of its most impressive structures. The square suffered devastating damage in the 1934 earthquake but was meticulously restored with German assistance. The 2015 earthquake caused additional damage, but extensive restoration has preserved its integrity.",
    myth: "Legend says the Nyatapola Temple was built as a series of platforms with increasingly powerful beings guarding each level. From elephants to gods, each protects the temple from evil. The temple's name 'Nyatapola' means 'five-storied' in Newari. Local belief holds that paying respects at all seven of Bhaktapur's major temples in one day brings good fortune for seven generations.",
    archeology:
      "Archaeological excavations have uncovered the foundations of a Licchavi period palace beneath the current structures, dating to the 7th century. The square's stone inscription pillar from King Yashodharman (570 AD) provides valuable historical information. The ancient drainage system, still functional after 500 years, demonstrates remarkable engineering skills. Over 2,500 wooden struts with carved deities decorate the square's buildings.",
    quizzes: [
      {
        question: "How many windows does the 55-Window Palace have?",
        options: ["45", "55", "65", "75"],
        correct: 1,
      },
      {
        question: "Bhaktapur Durbar Square is in which city?",
        options: ["Kathmandu", "Patan", "Bhaktapur", "Lalitpur"],
        correct: 2,
      },
      {
        question: "Bhaktapur means what in Nepali?",
        options: [
          "City of Arts",
          "City of Devotees",
          "City of Temples",
          "Golden City",
        ],
        correct: 1,
      },
      {
        question: "Which earthquake heavily damaged Bhaktapur in 1934?",
        options: ["Nepal-Bihar", "Gorkha", "Kashmir", "Assam"],
        correct: 0,
      },
    ],
    translations: {
      nepali: "भक्तपुर दरबार क्षेत्र",
      chinese: "巴克塔普尔王宫广场",
      japanese: "バクタプル・ダルバール広場",
      korean: "박타푸르 두르바르 광장",
      spanish: "Plaza Bhaktapur Durbar",
    },
    openingHours: "7:00 AM - 7:00 PM",
  },
  {
    name: "Changunarayan Temple",
    type: "Temple",
    location: "Bhaktapur",
    city: "Bhaktapur",
    coordinates: { lat: 27.7165, lng: 85.4284 },
    price: "NPR 300 (foreigners)",
    mustVisit: true,
    rating: 4.6,
    ratingCount: 890,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Changu_Narayan.jpg/1280px-Changu_Narayan.jpg",
    summary:
      "Changunarayan Temple is the oldest Hindu temple in the Kathmandu Valley, dating to the 4th century, featuring the oldest known stone inscription in Nepal.",
    longDescription:
      "This two-tiered pagoda temple dedicated to Lord Vishnu sits on a hilltop offering spectacular mountain views. The temple complex contains some of the finest stone, wood, and metal sculptures in Nepal, including the famous Garuda statue, the 5th-century Vishnu Vikranta (one of Nepal's oldest stone sculptures), and intricate carvings depicting stories from Hindu epics. The temple's inscriptions date to 464 AD, making it Nepal's oldest historical record.",
    history:
      "King Mandeva of the Licchavi period commissioned the temple in 464 AD, though the current structure was rebuilt after a fire in 1702. The temple's stone pillar inscription provides the first written evidence of Nepali history, mentioning three generations of Licchavi kings. The temple survived the 2015 earthquake with minor damage, a testament to ancient construction techniques.",
    myth: "According to legend, a Khas (cowherd) once found a cow pouring her milk on a specific rock daily. The rock revealed itself as a divine stone image of Lord Vishnu, and King Bhupalendra Malla built the temple to house it. Another legend states that the temple's location was chosen when a farmer's lost cow was found offering milk to a child under a tree, who revealed himself as Lord Vishnu.",
    archeology:
      "The temple's stone inscriptions are considered the Rosetta Stone of Nepali history, written in both Sanskrit and an early form of Nepali script. The Vishnu Vikranta sculpture (467 AD) shows Lord Vishnu in his dwarf incarnation stepping across the universe. Excavations have revealed coins from the Kushan period (1st-2nd century), suggesting trade connections with northern India. The temple's wooden struts contain 72 different carvings of various Vishnu incarnations.",
    quizzes: [
      {
        question:
          "Changunarayan Temple is the oldest temple dating to which century?",
        options: ["2nd", "3rd", "4th", "5th"],
        correct: 2,
      },
      {
        question: "The temple's stone inscription dates to which year?",
        options: ["364 AD", "464 AD", "564 AD", "664 AD"],
        correct: 1,
      },
      {
        question: "Changunarayan is dedicated to which deity?",
        options: ["Shiva", "Brahma", "Vishnu", "Durga"],
        correct: 2,
      },
      {
        question: "Which king commissioned the temple?",
        options: [
          "Amshuverma",
          "Mandeva",
          "Jayasthiti Malla",
          "Prithvi Narayan Shah",
        ],
        correct: 1,
      },
    ],
    translations: {
      nepali: "चांगुनारायण मन्दिर",
      chinese: "昌古纳拉扬神庙",
      japanese: "チャングナラヤン寺院",
      korean: "창구나라얀 사원",
      spanish: "Templo Changunarayan",
    },
    openingHours: "7:00 AM - 6:00 PM",
  },
  {
    name: "Kopan Monastery",
    type: "Monastery",
    location: "Kathmandu",
    city: "Kathmandu",
    coordinates: { lat: 27.7333, lng: 85.3667 },
    price: "Free Entry, Courses starting from $200",
    mustVisit: false,
    isHiddenGem: true,
    rating: 4.7,
    ratingCount: 645,
    image:
      "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/activities/nmaeyoln5wx91n0opuna.jpg",
    summary:
      "Kopan Monastery is a Tibetan Buddhist monastery offering meditation courses and breathtaking views of the Kathmandu Valley.",
    longDescription:
      "Kopan Monastery, established in 1969 by Lama Yeshe and Lama Zopa Rinpoche, is part of the Foundation for the Preservation of the Mahayana Tradition (FPMT). The monastery houses over 300 monks and nuns, offering comprehensive Buddhist education. Visitors can attend meditation courses ranging from one day to one month. The hilltop location provides spectacular sunrise views over the Himalayas on clear days.",
    history:
      "Originally a small retreat center, Kopan grew into one of the world's most famous Buddhist monasteries, attracting thousands of Western students annually. The monastery has hosted the Dalai Lama multiple times and has established affiliated centers in over 40 countries. The 2015 earthquake damaged parts of the monastery, but international support funded complete restoration by 2017.",
    myth: "Local legend says the hill was once home to a powerful shaman who could transform into a snow leopard. When Buddhist monks first arrived, they meditated at the site for 49 days until the shaman's spirit transformed into a protector of the dharma. The monastery's annual protector ceremony commemorates this event.",
    archeology:
      "Before construction, archaeological surveys discovered ancient meditation caves used by wandering ascetics dating to the 12th century. Three copper plates with Sanskrit inscriptions were found, referencing Buddhist teachings from the early Malla period. A stone altar from the Licchavi period (600 AD) was discovered beneath the main gompa and preserved as a meditation spot.",
    quizzes: [
      {
        question: "Kopan Monastery was established in which year?",
        options: ["1959", "1969", "1979", "1989"],
        correct: 1,
      },
      {
        question: "Who founded Kopan Monastery?",
        options: ["Dalai Lama", "Lama Yeshe", "Milarepa", "Padmasambhava"],
        correct: 1,
      },
      {
        question: "Approximately how many monks live at Kopan?",
        options: ["100", "200", "300", "400"],
        correct: 2,
      },
      {
        question: "Kopan is part of which Buddhist organization?",
        options: ["FPMT", "Kagyu", "Nyingma", "Gelug"],
        correct: 0,
      },
    ],
    translations: {
      nepali: "कोपन गुम्बा",
      chinese: "高班寺",
      japanese: "コパン僧院",
      korean: "코판 사원",
      spanish: "Monasterio Kopan",
    },
    openingHours: "6:00 AM - 6:00 PM",
  },
  {
    name: "Namche Bazaar",
    type: "Mountain Village",
    location: "Solukhumbu",
    city: "Solukhumbu",
    coordinates: { lat: 27.8067, lng: 86.7112 },
    price: "No entry fee",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 1560,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Namche_Bazaar.jpg/1280px-Namche_Bazaar.jpg",
    summary:
      "Namche Bazaar is a mountain village and the gateway to Mount Everest, serving as the main trading center and acclimatization stop for trekkers in the Khumbu region.",
    longDescription:
      "Perched at 3,440 meters, Namche Bazaar is the cultural and economic hub of the Everest region. The village features excellent teahouses, bakeries, gear shops, and the famous Saturday market where Himalayan traders and Tibetan merchants exchange goods. The Sagarmatha National Park headquarters here provides stunning views of Everest (8,848m), Lhotse (8,516m), and Ama Dablam (6,812m). Visitors can explore the Sherpa Culture Museum, Everest Photo Gallery, and nearby Khumjung village with its Yeti scalp at the monastery.",
    history:
      "The area was historically a trading post for Tibetans selling salt, wool, and meat in exchange for grains from lower valleys. After Nepal opened to trekkers in the 1950s following Hillary and Tenzing's 1953 Everest ascent, Namche transformed into a trekking hub. The village was electrified in 1991 and now has internet, ATMs, and helipads, while maintaining traditional Sherpa architecture.",
    myth: "The Yeti (Abominable Snowman) is deeply embedded in local mythology. Khumjung Monastery famously displays what locals believe is a Yeti scalp, though DNA testing has been inconclusive. Sherpas tell stories of the 'Dzu-teh' (large bear-like creature) that leaves massive footprints in the snow. Every spring, the Mani Rimdu festival celebrates Buddhist teachings with masked dances believed to ward off mountain spirits.",
    archeology:
      "Surveys above Namche have found stone tools and pottery fragments dating to 2500 BCE, suggesting ancient settlements predating Sherpa migration (which began around 1500 CE). The Imja Khola valley contains petroglyphs of animals and Buddhist symbols carved into boulders, dating to the 12th century. Recent LiDAR scans have revealed terraced agricultural systems hidden beneath rhododendron forests.",
    quizzes: [
      {
        question: "Namche Bazaar sits at what approximate altitude?",
        options: ["2,440m", "3,440m", "4,440m", "5,440m"],
        correct: 1,
      },
      {
        question: "Which mountain range is visible from Namche?",
        options: ["Annapurna", "Everest", "Dhaulagiri", "Manaslu"],
        correct: 1,
      },
      {
        question: "What festival features masked dances at Namche?",
        options: ["Mani Rimdu", "Losar", "Dashain", "Dumji"],
        correct: 0,
      },
      {
        question:
          "Which famous climbers first brought trekkers to this region?",
        options: ["Messner", "Hillary & Tenzing", "Lowe", "Bonington"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "नाम्चे बजार",
      chinese: "南池市场",
      japanese: "ナムチェバザール",
      korean: "남체 바자르",
      spanish: "Namche Bazaar",
    },
    openingHours: "All day",
  },
  {
    name: "Pokhara Lakeside",
    type: "Tourist District",
    location: "Pokhara",
    city: "Pokhara",
    coordinates: { lat: 28.2096, lng: 83.9857 },
    price: "Free",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 2350,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/FewaLake.jpg/1280px-FewaLake.jpg",
    summary:
      "Pokhara Lakeside is a vibrant tourist hub along Phewa Lake with stunning views of the Annapurna mountain range.",
    longDescription:
      "Lakeside offers the perfect blend of natural beauty and modern amenities. The street runs parallel to Phewa Lake, lined with restaurants, cafes, bookshops, trekking gear stores, spas, and bars. From here, visitors can rent paddleboats to reach the Tal Barahi Temple on the lake island, paraglide over the city, or take short hikes to the World Peace Pagoda. The reflection of Mount Machhapuchhre (Fishtail Mountain) in the lake waters is iconic.",
    history:
      "Pokhara was a crucial stop on the ancient Tibet-India salt trade route. Modern tourism began in the 1960s when the hippie trail brought Western travelers seeking peace and natural beauty. The area's development accelerated after the opening of the trekking permit system in the 1970s. Today, Pokhara is Nepal's second-largest tourist destination with over 500,000 annual visitors.",
    myth: "Machhapuchhre (Fishtail Mountain) is considered sacred and remains unclimbed. Legend says the mountain is the home of Lord Shiva, and the government prohibits climbing to preserve its sacred status. The Tal Barahi Temple on Phewa Lake is dedicated to the goddess Barahi, protector of animals, particularly wild boars from which she is believed to descend.",
    archeology:
      "Underwater surveys of Phewa Lake's northern end have revealed submerged structures dating to the 15th century when the lake was smaller. The nearby Bat Cave (Chameri Gufa) contains bone fragments of prehistoric animals including Stegodon (a prehistoric elephant relative) dating to 50,000 years ago. Stone tools found near the World Peace Pagoda suggest Paleolithic habitation.",
    quizzes: [
      {
        question: "Which lake is Pokhara Lakeside built along?",
        options: ["Phewa", "Begnas", "Rupa", "Gokyo"],
        correct: 0,
      },
      {
        question: "What is Machhapuchhre also known as?",
        options: ["Fishtail", "Everest Jr", "Annapurna", "Dhaulagiri"],
        correct: 0,
      },
      {
        question: "Has Machhapuchhre ever been climbed?",
        options: ["Yes", "No", "Only by locals", "Only in winter"],
        correct: 1,
      },
      {
        question: "What shrine sits on an island in Phewa Lake?",
        options: ["Guhyeshwari", "Tal Barahi", "Bindabasini", "Shitala"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "पोखरा लेकसाइड",
      chinese: "博卡拉湖滨区",
      japanese: "ポカラ・レイクサイド",
      korean: "포카라 레이크사이드",
      spanish: "Pokhara Lakeside",
    },
    openingHours: "All day",
  },
  {
    name: "World Peace Pagoda",
    type: "Stupa",
    location: "Pokhara",
    city: "Pokhara",
    coordinates: { lat: 28.2392, lng: 83.9939 },
    price: "Free",
    mustVisit: false,
    rating: 4.7,
    ratingCount: 1280,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/World_Peace_Pagoda_Pokhara_Nepal.jpg/1280px-World_Peace_Pagoda_Pokhara_Nepal.jpg",
    summary:
      "The World Peace Pagoda in Pokhara offers panoramic views of the Annapurna range and Fewa Lake from its hilltop location.",
    longDescription:
      "This brilliant white stupa stands 115 feet tall on Anadu Hill at 1,100 meters elevation. Four golden Buddha statues face the four cardinal directions: East (birth of Buddha), West (enlightenment), South (first teaching), and North (death/parinirvana). The pagoda was built by Japanese Buddhist monks from the Nipponzan Myohoji organization and offers perhaps the best viewpoint in Pokhara, especially at sunrise. The 30-minute hike from Lakeside passes through rhododendron forests.",
    history:
      "Construction began in 1992 and was completed in 2000, funded by Japanese donations and local labor. It was one of over 80 Peace Pagodas built worldwide by Nipponzan Myohoji to promote non-violence. The pagoda survived the 2015 earthquake without damage due to its modern seismic-resistant design. The nearby Japanese Peace Temple was added in 2012.",
    myth: "Local folklore says the hill was a meditation spot for a 12th-century yogi who could fly between mountains. The pagoda's location is considered a 'power spot' where the earth's energy is particularly strong. Some believe the four Buddhas' eyes watch over Pokhara, protecting it from natural disasters. A local legend claims touching all four statues in a single day brings eternal peace.",
    archeology:
      "During construction, workers discovered ancient meditation caves and a 14th-century bronze statue of Avalokiteshvara. The hill contains evidence of a 15th-century fortress, with stone walls and a water cistern still visible. Pottery shards found nearby suggest continuous human habitation for over 1,000 years. A fossilized tree trunk found at the site dates to 5,000 years ago.",
    quizzes: [
      {
        question: "Which organization built the World Peace Pagoda?",
        options: ["UNESCO", "Nipponzan Myohoji", "Save the Children", "Rotary"],
        correct: 1,
      },
      {
        question: "How many golden Buddha statues are on the pagoda?",
        options: ["2", "4", "6", "8"],
        correct: 1,
      },
      {
        question: "When was the pagoda completed?",
        options: ["1995", "1998", "2000", "2002"],
        correct: 2,
      },
      {
        question: "The pagoda stands how many feet tall?",
        options: ["95", "115", "135", "155"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "विश्व शान्ति स्तूप",
      chinese: "世界和平塔",
      japanese: "世界平和の塔",
      korean: "세계 평화의 탑",
      spanish: "Pagoda de la Paz Mundial",
    },
    openingHours: "6:00 AM - 6:00 PM",
  },
  {
    name: "Lumbini - Birthplace of Buddha",
    type: "Sacred Site",
    location: "Rupandehi",
    city: "Lumbini",
    coordinates: { lat: 27.4669, lng: 83.276 },
    price: "NPR 300 (foreigners)",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 1890,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Maya_Devi_Temple.jpg/1280px-Maya_Devi_Temple.jpg",
    summary:
      "Lumbini is the birthplace of Lord Buddha, a UNESCO World Heritage Site and one of the holiest pilgrimage sites for Buddhists worldwide.",
    longDescription:
      "The sacred site features the Maya Devi Temple marking the exact birthplace, the ancient Pushkarini pond where Buddha took his first bath, the Ashoka Pillar erected by Emperor Ashoka in 249 BCE, and over 25 international monasteries built in various architectural styles from Buddhist cultures worldwide. The site spans 4.8 square kilometers, with a central canal lined with monasteries, meditation centers, and gardens. Millions of pilgrims and tourists visit annually, especially during Buddha Jayanti (April/May).",
    history:
      "Discovered in 1896 by German archaeologist Alois Fuhrer, Lumbini's Ashoka Pillar inscription confirmed it as Buddha's birthplace (563 BCE). The site remained an important pilgrimage center for centuries before being abandoned around 1200 CE. UNESCO designated it a World Heritage Site in 1997. The Japanese government funded major restorations in the 1990s, including the Peace Canal and World Peace Flame.",
    myth: "According to Buddhist texts, Queen Maya Devi gave birth to Prince Siddhartha while holding a branch of a sal tree in the Lumbini Garden. He immediately took seven steps and declared this his final rebirth. Each step produced a lotus flower. The Maya Devi Temple contains a stone marker (the 'Nativity Stone') supposedly covering the exact spot.",
    archeology:
      "Excavations have uncovered a 500 BCE temple beneath the current structure, proving Lumbini as the oldest Buddhist shrine still in use. The Maya Devi temple's 'Nativity Stone' was found at the center of these ancient ruins. Over 50 clay sealings with 'Om Mani Padme Hum' inscriptions have been discovered, along with ancient coins from the Kushan, Mauryan, and Gupta periods. A 2,600-year-old tree fossil was found at the Sacred Garden's western edge.",
    quizzes: [
      {
        question: "Lumbini is located in which Nepali district?",
        options: ["Kapilvastu", "Rupandehi", "Nawalparasi", "Banke"],
        correct: 1,
      },
      {
        question: "Which Indian emperor erected the Ashoka Pillar at Lumbini?",
        options: ["Ashoka", "Chandragupta", "Samudragupta", "Harsha"],
        correct: 0,
      },
      {
        question: "When is Lumbini's most important festival?",
        options: ["Losar", "Buddha Jayanti", "Dashain", "Holi"],
        correct: 1,
      },
      {
        question: "Lumbini was discovered in which year?",
        options: ["1886", "1896", "1906", "1916"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "लुम्बिनी",
      chinese: "蓝毗尼",
      japanese: "ルンビニ",
      korean: "룸비니",
      spanish: "Lumbini",
    },
    openingHours: "6:00 AM - 6:00 PM",
  },
  {
    name: "Shey Phoksundo Lake",
    type: "Natural Lake",
    location: "Dolpa",
    city: "Dolpa",
    coordinates: { lat: 29.2026, lng: 82.9227 },
    price: "Restricted Area Permit required (NPR 10,000/week)",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 890,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Phoksundo_Lake.jpg/1280px-Phoksundo_Lake.jpg",
    summary:
      "Shey Phoksundo Lake is Nepal's deepest lake (145m), located in the remote Dolpa region known for its turquoise waters, Tibetan Buddhist culture, and rare wildlife.",
    longDescription:
      "This alpine oligotrophic lake sits at 3,611.5 meters in Shey Phoksundo National Park, Nepal's largest protected area (3,555 sq km). The lake's stunning turquoise color comes from mineral content and light refraction. The surrounding area features pristine forests of blue pine, spruce, and juniper, plus waterfalls including the 167m high Phoksundo Waterfall. The park protects snow leopard, blue sheep, Himalayan black bear, and over 200 bird species. Traditional Tibetan Buddhist villages preserve 800-year-old culture, including the famous Shey Gompa, home to ancient murals and scriptures.",
    history:
      "The Dolpa region was part of the Tibetan Empire until the 14th century. It remained isolated from modern Nepal until the 1960s. The area's Bon Po and Nyingmapa Buddhist traditions date to the 9th century. Shey Phoksundo National Park was established in 1984 to protect this unique ecosystem. The region was famously the setting for Eric Valli's Oscar-nominated film 'Himalaya' (1999).",
    myth: "Local Buddhist legend states the lake was created when a lama struck the ground with his staff, releasing spring water. The lake is considered sacred - locals believe disturbing its waters brings bad luck, so swimming and boating are forbidden. Another legend speaks of a hidden underwater palace where water spirits (lu) live, only visible to pure-hearted lamas during meditation. The nearby Shey (Crystal Mountain) is believed to contain a hidden treasure (terma) of Guru Padmasambhava.",
    archeology:
      "Ancient cave dwellings (some 2,500 years old) dot the cliffs above the lake, containing mummified remains, Buddhist manuscripts, and 13th-century bronze statues. The Upper Dolpa region's rock art includes petroglyphs of hunting scenes and Buddhist symbols dating to 500 BCE. Recent surveys discovered three meditation caves with 12th-century wall paintings in excellent condition. A 15th-century sky burial site was found on the northern shore.",
    quizzes: [
      {
        question: "Shey Phoksundo Lake is at what approximate altitude?",
        options: ["2,611m", "3,611m", "4,611m", "5,611m"],
        correct: 1,
      },
      {
        question: "The lake is located in which Nepali region?",
        options: ["Mustang", "Dolpa", "Manang", "Humla"],
        correct: 1,
      },
      {
        question: "Shey Phoksundo Lake is Nepal's ___ lake?",
        options: ["Largest", "Deepest", "Highest", "Smallest"],
        correct: 1,
      },
      {
        question: "Is swimming allowed in Shey Phoksundo Lake?",
        options: ["Yes", "No", "Only for locals", "Only in summer"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "शे फोक्सुण्डो ताल",
      chinese: "谢伊佛克松多湖",
      japanese: "シェイフォクスンド湖",
      korean: "셰이 폭순도 호수",
      spanish: "Lago Shey Phoksundo",
    },
    openingHours: "Visitor center: 7 AM - 5 PM",
  },
  {
    name: "Tilicho Lake",
    type: "High Altitude Lake",
    location: "Manang",
    city: "Manang",
    coordinates: { lat: 28.6922, lng: 83.845 },
    price: "ACAP permit (NPR 3000)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 720,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tilicho_Lake_May_2006.jpg/1280px-Tilicho_Lake_May_2006.jpg",
    summary:
      "Tilicho Lake is one of the world's highest lakes at 4,919 meters, located in the Annapurna region with spectacular mountain views.",
    longDescription:
      "The lake stretches 4km long and 1.2km wide, surrounded by the peaks of Annapurna (8,091m), Gangapurna (7,455m), and Tilicho Peak (7,134m). The trek to the lake from Manang village is challenging, requiring crossing the dangerous 'Mesokanto La' landslide area, but rewards with breathtaking scenery. The lake is partially frozen from December to March, and its blue waters reflect the surrounding peaks. The area is home to blue sheep, snow leopards, and Himalayan thar.",
    history:
      "The lake was relatively unknown to Westerners until French explorer Maurice Herzog's expedition in 1950, though locals had known it for centuries as a sacred site. The trek was developed in the 1980s and has become a popular side trip from the Annapurna Circuit. The area's permanent residents include a teahouse at 4,150m that operates during trekking season (April-October).",
    myth: "According to Hindu mythology, the lake was created by Lord Rama (Ramayana) when he needed to cool his burning arrow. Tibetan Buddhists believe the lake is the abode of Nagas (water serpents) who control the weather. Some local Gurung and Manangi stories claim a hidden valley beneath the lake's surface, accessible only to those pure of heart. The lake's water is considered holy, and pilgrims collect it for rituals.",
    archeology:
      "Ancient trade beads from Tibet have been found along the shore, suggesting the area was a trading route before the current trekking era. Remains of stone shelters indicate seasonal hunting camps dating to the 15th century. Fossils of marine creatures (ammonites and shell fragments) are common in the surrounding rocks, showing this area was once under the sea. Petroglyphs of Buddhist symbols carved into boulders date to the 12th century.",
    quizzes: [
      {
        question: "Tilicho Lake sits at which altitude?",
        options: ["3,919m", "4,919m", "5,919m", "6,919m"],
        correct: 1,
      },
      {
        question: "Which mountain range contains Tilicho Lake?",
        options: ["Annapurna", "Everest", "Langtang", "Kanchenjunga"],
        correct: 0,
      },
      {
        question: "Tilicho Lake is one of the world's ____ lakes?",
        options: ["Largest", "Deepest", "Highest", "Coldest"],
        correct: 2,
      },
      {
        question: "The lake is partially frozen from which months?",
        options: ["Dec-Mar", "Apr-Jul", "Aug-Nov", "Only Jan"],
        correct: 0,
      },
    ],
    translations: {
      nepali: "तिलिचो ताल",
      chinese: "蒂利乔湖",
      japanese: "ティリチョ湖",
      korean: "틸리초 호수",
      spanish: "Lago Tilicho",
    },
    openingHours: "Trekking season: April-October",
  },
  {
    name: "Gosaikunda Lake",
    type: "Sacred Lake",
    location: "Rasuwa",
    city: "Rasuwa",
    coordinates: { lat: 28.0858, lng: 85.4168 },
    price: "Langtang National Park fee (NPR 3000)",
    mustVisit: true,
    rating: 4.7,
    ratingCount: 950,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Gosaikunda.jpg/1280px-Gosaikunda.jpg",
    summary:
      "Gosaikunda is an alpine sacred lake at 4,380m, revered by both Hindus and Buddhists as the abode of Lord Shiva and his consort Gauri.",
    longDescription:
      "The lake covers 13.8 hectares and is surrounded by 108 smaller lakes (Sarovar), creating a stunning high-altitude landscape. The annual Janai Purnima pilgrimage (August) attracts over 50,000 devotees who bathe in the holy waters. The trek passes through Langtang National Park's rhododendron forests, providing chances to see red pandas, Himalayan tahr, and diverse bird species. Three high passes (4,600-5,200m) must be crossed to reach the lake.",
    history:
      "The Gosaikunda pilgrimage route has existed for over 1,500 years, mentioned in the 7th-century Chinese pilgrim accounts. The lake's stone Shiva lingam was installed in the 14th century by a Malla king. The area was heavily affected by the 2015 earthquake, which destroyed trails and villages, but reconstruction was completed by 2018. A modern helipad was built nearby for elderly pilgrims and emergency evacuations.",
    myth: "According to the Shiva Purana, Lord Shiva created the lake by piercing a glacier with his trident to collect the poison he drank during the Churning of the Ocean. The 108 lakes represent the beads on Lord Shiva's rudraksha mala. Another legend states that the lake's water has healing properties, and bathing here on Janai Purnima removes sins. Locals believe a serpent lives in the lake's depths, and disturbing the water causes storms.",
    archeology:
      "Stone inscriptions near the lake date to 1045 AD, mentioning pilgrim donations. Ancient trade beads and bronze ritual objects have been found on the lakebed during dry seasons. The remains of a 12th-century monastery were discovered beneath boulders near the northern shore. A fossilized shark tooth found nearby (now in Kathmandu's Natural History Museum) proves this area was once ocean floor.",
    quizzes: [
      {
        question: "Gosaikunda sits at which altitude?",
        options: ["3,380m", "4,380m", "5,380m", "6,380m"],
        correct: 1,
      },
      {
        question: "Gosaikunda is surrounded by how many smaller lakes?",
        options: ["54", "108", "162", "216"],
        correct: 1,
      },
      {
        question: "Which pilgrimage festival brings devotees to Gosaikunda?",
        options: ["Shivaratri", "Janai Purnima", "Dashain", "Teej"],
        correct: 1,
      },
      {
        question: "The lake is located in which national park?",
        options: ["Sagarmatha", "Langtang", "Annapurna", "Shey Phoksundo"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "गोसाइँकुण्ड",
      chinese: "戈赛昆达湖",
      japanese: "ゴサイクンダ湖",
      korean: "고사이쿤다 호수",
      spanish: "Lago Gosaikunda",
    },
    openingHours: "Best visited: August (Janai Purnima) or April-October",
  },
  {
    name: "Rara Lake",
    type: "Natural Lake",
    location: "Mugu",
    city: "Mugu",
    coordinates: { lat: 29.5276, lng: 82.0905 },
    price: "Rara National Park fee (NPR 3000)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 680,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rara_Lake.jpg/1280px-Rara_Lake.jpg",
    summary:
      "Rara Lake is Nepal's largest lake (10.8 sq km), located in the remote far-western region within Rara National Park.",
    longDescription:
      "The lake sits at 2,990m, surrounded by coniferous forests of blue pine, juniper, and spruce. It's home to the endangered snow trout (Nepal's only indigenous trout species) and the migratory greylag geese. The park preserves habitats for Himalayan black bears, musk deer, red pandas, and over 500 flower species, including 50 varieties of orchids. The classic trek from Jumla takes 5-7 days through remote villages preserving traditional Karnali culture.",
    history:
      "The lake was known as 'Mahendra Daha' (Lake Mahendra) until the 1990s. Rara National Park was established in 1976 as Nepal's smallest and most remote national park. The area was off-limits to foreigners until 1985 due to security concerns. A former royal hunting reserve, the lake was protected after King Mahendra visited in 1963. The nearby Murma Top (3,750m) offers panoramic views of the lake and distant Api Himal (7,132m).",
    myth: "Local legend says the lake was created by a heartbroken Malla prince who dropped his arrow into the ground after losing his lover, with water springing from the spot. Another story claims the lake is guarded by a white yak that only appears during full moons. Some Thakuri ethnic narratives describe the lake as a 'hiding place of 99 gods' who retreated here during a celestial war. The lake's name 'Rara' means 'sparkling jewel' in the local Khas language.",
    archeology:
      "Stone tools and pottery fragments found on the southern shore indicate habitation dating to 1500 BCE. The ruins of a 13th-century fort (Khatyad Fort) are visible on a hill above the lake. Ancient trade beads from Tibet and India have been discovered along the historical route circling the lake. Shallow underwater surveys revealed submerged tree trunks suggesting the lake expanded significantly in the last 500 years.",
    quizzes: [
      {
        question: "Rara Lake is Nepal's ___ lake?",
        options: ["Deepest", "Highest", "Largest", "Coldest"],
        correct: 2,
      },
      {
        question: "Rara Lake sits at what altitude?",
        options: ["1,990m", "2,990m", "3,990m", "4,990m"],
        correct: 1,
      },
      {
        question: "What fish species is endemic to Rara Lake?",
        options: ["Rainbow trout", "Snow trout", "Carp", "Catfish"],
        correct: 1,
      },
      {
        question: "Rara Lake is in which national park?",
        options: ["Sagarmatha", "Rara", "Langtang", "Shey Phoksundo"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "रारा ताल",
      chinese: "拉拉湖",
      japanese: "ララ湖",
      korean: "라라 호수",
      spanish: "Lago Rara",
    },
    openingHours: "Park gates: 6 AM - 6 PM",
  },
  {
    name: "Manakamana Temple",
    type: "Temple",
    location: "Gorkha",
    city: "Gorkha",
    coordinates: { lat: 27.9345, lng: 84.6598 },
    price: "Free, Cable car: NPR 800 round trip",
    mustVisit: true,
    rating: 4.6,
    ratingCount: 1250,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Manakamana_Temple.jpg/1280px-Manakamana_Temple.jpg",
    summary:
      "Manakamana Temple is a sacred Hindu pilgrimage site dedicated to Goddess Durga, known as the 'wish-fulfilling' goddess.",
    longDescription:
      "The temple sits on a ridge at 1,302m, accessible via a 2.8km cable car (Asia's longest at its 1998 opening) with stunning Trishuli River and Himalayan views. The pagoda-style temple features intricate wood carvings and a three-tiered roof. Devotees sacrifice goats and pigeons, believing the goddess fulfills wishes made here. The nearby Gorkha Durbar is the ancestral palace of Nepal's Shah kings, including the birthplace of King Prithvi Narayan Shah, who unified Nepal in 1768.",
    history:
      "The temple dates to the 17th century, built by King Ram Shah of Gorkha. The story involves a queen who would regularly disappear to worship, and after her death, a farmer discovered a divine light leading to the current temple location. The cable car, built with Austrian technology, has made the temple accessible to elderly and disabled devotees, carrying over 2,000 people daily during festivals. The temple was damaged in 2015 but restored by 2017.",
    myth: "Legend tells of Queen Kafalpani, who was secretly a goddess. When the king discovered her divinity, she disappeared into a rock, promising to manifest for those with pure hearts. Another story says the goddess appeared in a farmer's dream, revealing her presence. The name 'Manakamana' comes from 'mana' (heart) and 'kamana' (wish). Locals believe offering a white cock brings good luck, while a black goat brings prosperity. Some claim the temple's inner sanctum emits a divine vibration felt only by true believers.",
    archeology:
      "The original 17th-century foundations were discovered during 1999 renovations, revealing earlier 14th-century brickwork. A hidden chamber beneath the altar contained silver and gold coins from the Gorkha kingdom dating to 1650. The temple's stone inscriptions mention the Shah dynasty's origin from the Sun Dynasty (Suryavanshi). A 15th-century bronze statue of Durga riding a tiger was discovered during landscaping work.",
    quizzes: [
      {
        question: "Manakamana means what in Nepali?",
        options: [
          "Wish heart",
          "Strong goddess",
          "Sacred mountain",
          "Queen mother",
        ],
        correct: 0,
      },
      {
        question: "Manakamana is located in which district?",
        options: ["Gorkha", "Kaski", "Tanahu", "Lamjung"],
        correct: 0,
      },
      {
        question: "Which goddess is worshipped at Manakamana?",
        options: ["Saraswati", "Laxmi", "Durga", "Kali"],
        correct: 2,
      },
      {
        question: "The Manakamana cable car opened in which year?",
        options: ["1988", "1998", "2008", "2018"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "मनकामना मन्दिर",
      chinese: "玛纳卡玛纳神庙",
      japanese: "マナカマナ寺院",
      korean: "마나카마나 사원",
      spanish: "Templo Manakamana",
    },
    openingHours: "6:00 AM - 8:00 PM (Cable car: 7 AM - 5 PM)",
  },
  {
    name: "Muktinath Temple",
    type: "Temple",
    location: "Mustang",
    city: "Mustang",
    coordinates: { lat: 28.826, lng: 83.8713 },
    price: "NPR 1000 (SAARC), NPR 2000 (others)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 1150,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Muktinath_Temple.jpg/1280px-Muktinath_Temple.jpg",
    summary:
      "Muktinath Temple is one of the world's highest temples (3,710m), sacred to both Hindus as one of 108 Divya Desams and Buddhists as a place of Dakinis.",
    longDescription:
      "The temple complex features 108 water spouts shaped like bull heads, where pilgrims bathe in icy water for salvation. The main pagoda has a golden statue of Lord Vishnu as Sridhara, surrounded by Buddhist prayer wheels and mani walls. The Jwala Mai temple within contains an eternal flame burning from natural gas (ground methane) and a spring water source, symbolizing the five elements. The site offers views of Dhaulagiri, Nilgiri, and the Tibetan Plateau.",
    history:
      "The temple dates to at least the 8th century, mentioned in Tibetan texts as 'Chumig Gyatsa' (Hundred Waters). It was a major center for both religions until 2015, hosting an annual 108-pilgrimage from India and Nepal. The complex was restored in 2016 after earthquake damage, funded by the World Bank. The site was popularized in the West by Italian explorer Giuseppe Tucci's 1930s expeditions.",
    myth: "According to the Vishnu Purana, Lord Vishnu granted salvation (Mukti) to 108 gods here, giving the temple its name (Mukti + Nath = Lord of Salvation). Another legend states that the 108 spouts represent Shiva's 108 beads (rudraksha) from his journey to save the world. Tibetan Buddhists believe Guru Padmasambhava meditated here, and the eternal flame is the 'Fire of Wisdom' (Jwala) that destroys ignorance. Some say the 108 springs are the tears of Goddess Saraswati, mourning the death of Lord Brahma's swan.",
    archeology:
      "Excavations revealed ancient Buddhist stupas and Hindu shrines dating to the 6th century, showing continuous syncretic worship. A 12th-century stone inscription in Tibetan mentions 100 monasteries of the Muktinath region. The 'Eternal Flame' is analyzed as natural methane seeping from underground coal seams, dated to 10,000 years old. Ancient trade beads from China, India, and Rome indicate the area was a Silk Road outpost. Fossilized ammonites (shaligrams) sacred to Vishnu are found abundantly in the Kali Gandaki gorge below.",
    quizzes: [
      {
        question: "Muktinath sits at which altitude?",
        options: ["2,710m", "3,710m", "4,710m", "5,710m"],
        correct: 1,
      },
      {
        question: "Muktinath has how many water spouts?",
        options: ["54", "108", "216", "324"],
        correct: 1,
      },
      {
        question: "Muktinath is sacred to which religions?",
        options: [
          "Hindu only",
          "Buddhist only",
          "Hindu and Buddhist",
          "Muslim only",
        ],
        correct: 2,
      },
      {
        question: "The eternal flame uses which natural gas?",
        options: ["Methane", "Propane", "Butane", "Natural gas"],
        correct: 0,
      },
    ],
    translations: {
      nepali: "मुक्तिनाथ मन्दिर",
      chinese: "穆克提那特神庙",
      japanese: "ムクティナート寺院",
      korean: "묵티나트 사원",
      spanish: "Templo Muktinath",
    },
    openingHours: "5:00 AM - 9:00 PM",
  },
  {
    name: "Janaki Temple",
    type: "Temple",
    location: "Janakpur",
    city: "Janakpur",
    coordinates: { lat: 26.7308, lng: 85.922 },
    price: "Free",
    mustVisit: true,
    rating: 4.7,
    ratingCount: 1350,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Janaki_Mandir_Janakpur.jpg/1280px-Janaki_Mandir_Janakpur.jpg",
    summary:
      "Janaki Temple, also known as Naulakha Mandir (Costing 9 Lakhs), is a grand Hindu temple dedicated to Goddess Sita, wife of Lord Rama.",
    longDescription:
      "Built in 1910 in a unique blend of Rajput, Mughal, and local Mithila architecture, the temple features 60 rooms, 58 pillars, and intricate painted Mithila art throughout. The white marble structure rises three stories (50m) with a golden spire. Inside, an idol of Sita as a child (Bal Swaroop) is worshipped. The temple complex includes Ram Mandir, Sita's Vivah Mandap (wedding hall), and a museum of Mithila culture. The annual Vivah Panchami festival (Nov/Dec) reenacts Sita and Rama's wedding with thousands of pilgrims.",
    history:
      "The current temple was built by Queen Brisabhanu Kunwari of Tikamgarh, India, after Sita appeared in her dream. The site marks the ancient kingdom of Videha and the birthplace of Sita (Janakpur). The temple survived the 1934 Bihar earthquake and the 2015 quake with minor damage. The region remained isolated until the 1960s but is now a major pilgrimage site with direct flights and trains from India.",
    myth: "According to the Ramayana, King Janaka found baby Sita in a furrow while plowing the earth here. The temple's name 'Naulakha' means 9 lakhs (900,000 rupees), the construction cost in 1910. Another legend says the temple's 58 pillars represent 58 qualities of a virtuous woman (Sita). Some locals believe Sita's footsteps are imprinted in the temple's stone floor, visible only during the morning aarti. The surrounding Mithila region is traditionally ruled by King Janaka, who hosted Rama's swayamvara (marriage contest) here.",
    archeology:
      "Excavations beneath the temple found 5th-century brick structures, possibly the original Janaka palace. Ancient pottery with Mithila-style fish symbols (the Janaka emblem) dates to 600 BCE. A 10th-century bronze statue of Sita was discovered during well-digging nearby. The region's ancient irrigation system, still partially functioning, shows advanced water management from the 7th century.",
    quizzes: [
      {
        question: "Janaki Temple is dedicated to which goddess?",
        options: ["Durga", "Sita", "Radha", "Parvati"],
        correct: 1,
      },
      {
        question: "The temple is also known as what?",
        options: [
          "Naulakha Mandir",
          "Swargadwari",
          "Muktinath",
          "Bindyabasini",
        ],
        correct: 0,
      },
      {
        question: "Janakpur was the capital of which ancient kingdom?",
        options: ["Kosala", "Videha", "Malla", "Licchavi"],
        correct: 1,
      },
      {
        question: "Which festival reenacts Sita and Rama's wedding here?",
        options: ["Holi", "Vivah Panchami", "Dashain", "Tihar"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "जानकी मन्दिर",
      chinese: "贾纳基神庙",
      japanese: "ジャナキ寺院",
      korean: "자나키 사원",
      spanish: "Templo Janaki",
    },
    openingHours: "6:00 AM - 8:00 PM",
  },
  {
    name: "Krishna Mandir, Patan",
    type: "Temple",
    location: "Lalitpur",
    city: "Lalitpur",
    coordinates: { lat: 27.6712, lng: 85.3245 },
    price: "Part of Patan Durbar Square (NPR 1000)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 980,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Krishna_Mandir_Patan.jpg/1280px-Krishna_Mandir_Patan.jpg",
    summary:
      "Krishna Mandir is Nepal's finest Shikhara-style temple, built entirely of stone in 1637 with 21 golden spires and intricate bas-reliefs.",
    longDescription:
      "The three-story temple features 21 golden pinnacles, 8 domes (gajur), and 4 statues of Garuda (Lord Vishnu's eagle) guarding the corners. The inner sanctum holds three shrines: Krishna (center), Shiva (left), and Radha (right). The temple's stone walls depict scenes from the Mahabharata and Ramayana with 72 carved friezes. The annual Krishna Janmashtami festival (Aug/Sep) draws 100,000 devotees who light 10,000 butter lamps.",
    history:
      "King Siddhi Narsingh Malla built the temple after seeing Krishna and Radha standing before the royal palace. It survived the 1934 earthquake with minor damage but had severe cracks in 2015, requiring a 5-year restoration with Indian government aid (Rs. 36 crore). The temple's restoration used traditional methods: lime mortar, carved stone blocks, and no reinforcing steel. The Patan Museum now displays original stone carvings replaced during restoration.",
    myth: "Legend says the temple's 8 domes represent 8 primary bhaktas (devotees) of Krishna, and the 21 spires symbolize 21 forms of Lord Krishna. Some believe the temple's shadow never falls on the ground, and its reflection in the nearby water tank (Rani Pokhari) reveals the future. Another story claims the king's dream was so real that he built identical temples in other kingdoms; two others exist in Dolakha and Gorkha. Locals say offering coins at the Garuda statue brings success in business.",
    archeology:
      "Underwater surveys of Rani Pokhari (the tank opposite) found 17th-century statues of Vishnu's avatars, removed for museum display. A secret tunnel discovered beneath the temple during 2004 restoration led 150m towards the royal palace. The tunnel contained 400 kg of ancient coins, gold jewelry, and manuscripts. The temple's stone blocks were analyzed and found to come from 3 different quarries: Kathmandu's Chandragiri Hill (limestone), Bhaktapur (sandstone), and India's Varanasi (black granite).",
    quizzes: [
      {
        question: "Krishna Mandir was built in which year?",
        options: ["1537", "1637", "1737", "1837"],
        correct: 1,
      },
      {
        question: "The temple has how many golden spires?",
        options: ["12", "21", "33", "51"],
        correct: 1,
      },
      {
        question: "Krishna Mandir is in which city's Durbar Square?",
        options: ["Kathmandu", "Bhaktapur", "Patan", "Kirtipur"],
        correct: 2,
      },
      {
        question: "Krishna Mandir is built entirely of what material?",
        options: ["Wood", "Brick", "Stone", "Marble"],
        correct: 2,
      },
    ],
    translations: {
      nepali: "कृष्ण मन्दिर",
      chinese: "克里希纳神庙",
      japanese: "クリシュナ寺院",
      korean: "크리슈나 사원",
      spanish: "Templo Krishna",
    },
    openingHours: "6:00 AM - 8:00 PM",
  },
  {
    name: "Kailashnath Mahadev Statue",
    type: "Modern Landmark",
    location: "Sanga",
    city: "Sanga",
    coordinates: { lat: 27.6572, lng: 85.5493 },
    price: "NPR 500 (foreigners)",
    mustVisit: false,
    rating: 4.5,
    ratingCount: 890,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Kailashnath_Mahadev_Statue.jpg/1280px-Kailashnath_Mahadev_Statue.jpg",
    summary:
      "Kailashnath Mahadev Statue is the world's tallest Shiva statue at 143 feet (43.5m), located on a hilltop near Kathmandu.",
    longDescription:
      "Completed in 2011, the statue is made of copper, cement, steel, and zinc, weighing 500 tons. It depicts Lord Shiva holding a trident, snake, and damaru drum. The site includes a 108-shivalinga garden, meditation caves, and a replica of Panchakanya (five holy pilgrimage sites). The hilltop offers views of Kathmandu Valley and distant Himalayan peaks. The annual Maha Shivaratri festival (Feb/Mar) draws 100,000 devotees who light fires and chant mantras through the night.",
    history:
      "Construction began in 2004 and cost NPR 250 million (USD 3.2 million), funded by businessman Prem Lal Maharjan and local donations. The statue was designed by Nepali engineers and built by Chinese steelworkers, symbolizing Nepal-China friendship. It survived the 2015 earthquake with only minor cracks due to its steel-reinforced base. A 2019 expansion added a museum of Hindu mythology and a cable car proposal (expected 2025).",
    myth: "The statue's location on a hill resembling Mount Kailash (Shiva's mythical home in Tibet) gives it the name 'Kailashnath' (Lord of Kailash). Devotees believe circumambulating the statue 108 times grants wishes. Some locals claim the statue's eyes follow visitors, and monks report seeing a blue light from the trident on full moons. The 108 shivalingas represent 108 Upanishads, and each has a unique vibration frequency.",
    archeology:
      "Modern sculpture techniques were documented as Nepal's largest civilian engineering project. Foundations extend 15m underground with 500 tons of concrete to prevent tilting. The statue's copper plates (3,500 pieces) each have a unique serial number for maintenance. Engineering surveys show the hill's soil composition requires annual monitoring for slippage. The statue has a lightning rod system protecting against Kathmandu's frequent thunderstorms.",
    quizzes: [
      {
        question: "Kailashnath Mahadev is the world's tallest ___ statue?",
        options: ["Vishnu", "Shiva", "Buddha", "Ganesh"],
        correct: 1,
      },
      {
        question: "The statue is how many feet tall?",
        options: ["113'", "123'", "143'", "163'"],
        correct: 2,
      },
      {
        question: "Kailashnath Mahadev is located in which town?",
        options: ["Sanga", "Dhulikhel", "Banepa", "Panauti"],
        correct: 0,
      },
      {
        question: "The statue was completed in which year?",
        options: ["2009", "2011", "2013", "2015"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "कैलाशनाथ महादेव मूर्ति",
      chinese: "凯拉什纳特·马哈德夫雕像",
      japanese: "カイラースナート・マハーデーヴ像",
      korean: "카일라쉬나트 마하데브 동상",
      spanish: "Estatua Kailashnath Mahadev",
    },
    openingHours: "5:00 AM - 7:00 PM",
  },
  {
    name: "Tengboche Monastery",
    type: "Monastery",
    location: "Solukhumbu",
    city: "Solukhumbu",
    coordinates: { lat: 27.8366, lng: 86.7644 },
    price: "Free, Donation suggested",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 820,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Tengboche_Monastery.jpg/1280px-Tengboche_Monastery.jpg",
    summary:
      "Tengboche Monastery (3867m) is the largest gompa in the Khumbu region, offering stunning views of Mount Everest and Ama Dablam.",
    longDescription:
      "The monastery is the spiritual heart of the Sherpa people, belonging to the Nyingma tradition of Tibetan Buddhism. It houses a 20-foot golden Buddha statue, ancient thangka paintings, and a 400-year-old relic of the lama who founded it. The annual Mani Rimdu festival (Oct/Nov) features 16 days of masked dances, religious plays, and empowerments. The monastery was rebuilt after a 1989 fire and again after 2015 earthquake damage.",
    history:
      "Founded in 1916 by Lama Gulu, the monastery was destroyed by an earthquake in 1934 but rebuilt. A 1989 electrical fire burned the entire complex, including priceless thangkas and scriptures. Sir Edmund Hillary and the Himalayan Trust helped rebuild it in 1991. The Dalai Lama has visited twice (1966 and 1992), and it's a stop on the Everest Base Camp trek for blessings before ascent.",
    myth: "Legend says the monastery sits on a site blessed by Guru Padmasambhava in the 8th century, marked by a crystal cave where he meditated. The name 'Tengboche' means 'good river' in Sherpa, referring to two merging streams below. Local belief says the monastery's prayers protect trekkers from avalanches and storms. The 1989 fire was interpreted as a 'cleansing' by some lamas, leading to stronger construction. A sacred yeti scalp (now lost) was once kept here before moving to Khumjung Monastery.",
    archeology:
      "The 1991 rebuild discovered 15th-century butter lamps and bronze statues in the foundations. A hidden room behind the altar contained 300-year-old silk prayer flags from Tibet and a 12th-century Tibetan manuscript (in Lhasa's Sera Monastery now). The monastery's mani wall (prayer stones) includes rocks with 7th-century carvings, older than the monastery itself. Modern seismographs installed by ETH Zurich monitor tectonic activity around Mount Everest.",
    quizzes: [
      {
        question: "Tengboche Monastery is at what altitude?",
        options: ["2,867m", "3,867m", "4,867m", "5,867m"],
        correct: 1,
      },
      {
        question: "Which Buddhist tradition does Tengboche follow?",
        options: ["Gelug", "Kagyu", "Nyingma", "Sakya"],
        correct: 2,
      },
      {
        question: "What festival features masked dances at Tengboche?",
        options: ["Losar", "Mani Rimdu", "Dumji", "Dashain"],
        correct: 1,
      },
      {
        question: "Who helped rebuild Tengboche after the 1989 fire?",
        options: [
          "Edmund Hillary",
          "Tenzing Norgay",
          "Reinhold Messner",
          "Chris Bonington",
        ],
        correct: 0,
      },
    ],
    translations: {
      nepali: "टेंगबोचे गुम्बा",
      chinese: "腾波切寺",
      japanese: "テンボチェ僧院",
      korean: "텡보체 사원",
      spanish: "Monasterio Tengboche",
    },
    openingHours: "6:00 AM - 5:00 PM, Puja at 3 PM",
  },
  {
    name: "Upper Mustang",
    type: "Restricted Region",
    location: "Mustang",
    city: "Mustang",
    coordinates: { lat: 29.1667, lng: 83.9167 },
    price: "Special permit: USD 500 for 10 days",
    mustVisit: true,
    rating: 4.9,
    ratingCount: 610,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lo_Manthang.jpg/1280px-Lo_Manthang.jpg",
    summary:
      "Upper Mustang is the former Kingdom of Lo, a restricted area with preserved 15th-century Tibetan Buddhist culture, caves, and rainbow-colored cliffs.",
    longDescription:
      "This rain shadow region beyond the Himalayas receives only 200mm annual rainfall, creating a stark desert landscape with eroded sandstone pillars (hoodoos), ancient sky caves, and walled city of Lo Manthang (3,840m). The region preserves 15th-century wall paintings, the royal palace of Mustang's kings, and 600-year-old monasteries like Jampa Lhakhang and Thubchen Gompa. The annual Tiji festival (May) reenacts a myth of the deity Dorje Jono fighting demons.",
    history:
      "The Kingdom of Lo was founded in 1380 by Ama Pal, becoming a center of Tibetan Buddhism and trade with India, China, and Persia. It remained a tributary state to Nepal's Shah kings after unification in 1795. Upper Mustang opened to foreigners only in 1992, with strict regulations preserving its culture. The last king (Jigme Dorje Palbar Bista) lost political power in 2008 but remains as a cultural leader. The 2015 earthquake destroyed many structures, but Lo Manthang's 15th-century walls remained intact.",
    myth: "A sky cave legend claims monks could fly between caves, and recent drone surveys found inaccessible caves with mummified bodies. The Tiji festival myth tells of Dorje Jono saving Mustang from a demon that caused drought; he chased the demon through 3 realms, and Tiji reenacts this chase. Another story describes a hidden cave containing a living lama who meditated for 500 years. The region's red cliffs are said to be the blood of a demon slain by Guru Padmasambhava, who blessed Mustang in the 8th century.",
    archeology:
      "The Mustang Caves Project (2007-2012) surveyed 10,000 caves, finding 500-year-old Buddhist murals, manuscripts, and 55 mummified bodies (one carbon-dated to 982 CE). Lo Manthang's royal palace has 15th-century Tibetan paintings of the 35 Buddhas, the best preserved in the world. Ancient iron smelting sites indicate advanced metallurgy around 1200 CE. Cave archaeology found beads from Rome, indicating Silk Road trade. The region's fossilized seashells at 4,500m elevation prove this area was once ocean floor.",
    quizzes: [
      {
        question: "Upper Mustang opened to foreigners in which year?",
        options: ["1982", "1992", "2002", "2012"],
        correct: 1,
      },
      {
        question: "Upper Mustang special permit costs how much for 10 days?",
        options: ["$300", "$500", "$700", "$900"],
        correct: 1,
      },
      {
        question: "What is the walled city of Upper Mustang called?",
        options: ["Lo Manthang", "Kagbeni", "Jomsom", "Muktinath"],
        correct: 0,
      },
      {
        question: "The Tiji festival reenacts the defeat of what?",
        options: ["A demon", "A king", "A drought", "An earthquake"],
        correct: 0,
      },
    ],
    translations: {
      nepali: "माथिल्लो मुस्ताङ",
      chinese: "上木斯塘",
      japanese: "アッパー・ムスタン",
      korean: "어퍼 무스탕",
      spanish: "Alto Mustang",
    },
    openingHours: "Trekking season: May-October (Tiji: May)",
  },
  {
    name: "Bisket Jatra, Bhaktapur",
    type: "Festival Site",
    location: "Bhaktapur",
    city: "Bhaktapur",
    coordinates: { lat: 27.6728, lng: 85.4289 },
    price: "Included in Bhaktapur entry (NPR 1500)",
    mustVisit: true,
    rating: 4.8,
    ratingCount: 780,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bisket_Jatra.jpg/1280px-Bisket_Jatra.jpg",
    summary:
      "Bisket Jatra is Bhaktapur's most important festival, celebrating the Nepali New Year with massive chariot processions and tantric rituals.",
    longDescription:
      "The 9-day festival (April) features pulling a 2-story chariot (40 feet tall) with 4 wheels (each 8 ft diameter) through Bhaktapur's narrow streets. The festival climaxes with a 'lingam' raising at the Bode crossroads and a ritual battle. The event draws 200,000 visitors, with participants playing traditional instruments and throwing colors. The festival has been celebrated for over 1,000 years without interruption, even surviving the 1934 and 2015 earthquakes.",
    history:
      "The festival's name comes from 'Bi' (snake) and 'Syaku' (slay) in Newari, referring to a legend of slaying a serpent. King Jagat Jyoti Malla formalized the festival in the 17th century, but its roots are in ancient Kirat fertility rituals. The 2015 earthquake damaged festival chariots, which took 3 years to rebuild. UNESCO recognized Bisket Jatra as Intangible Cultural Heritage in 2019. The festival used to include animal sacrifice but shifted to symbolic offerings after 2015.",
    myth: "The legend behind Bisket Jatra: a prince died on his wedding night from a serpent's bite. The bride, a princess from a neighboring kingdom, discovered the serpent (Naga) living under the marriage bed and killed it (Bis-ket = snake-slay). Another myth says the festival's lingam (phallic symbol) represents Shiva's power over death, and raising it defeats Yama (god of death). Locals believe those who pull the chariot get their wishes fulfilled, but those who cause the chariot to stop face misfortune. The festival's final day has a 'Taya Macha' (rice porridge) ceremony, where eating it consecrates marriages.",
    archeology:
      "The original 15th-century chariot's wooden wheels are preserved at Bhaktapur's National Art Museum, showing intricate carving techniques. The festival route follows ancient water channels (raj kulo) built in the 12th century. Excavations at Bode (the lingam raising site) uncovered 8th-century coins and pottery from China's Tang Dynasty. The festival's stone lingam base (pitha) dates to the Licchavi period (600 AD), pre-dating the festival by 500 years.",
    quizzes: [
      {
        question: "Bisket Jatra celebrates which new year?",
        options: ["Gregorian", "Nepali (Bikram Sambat)", "Tibetan", "Indian"],
        correct: 1,
      },
      {
        question: "Bisket Jatra is in which city?",
        options: ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur"],
        correct: 2,
      },
      {
        question: "Bisket means what in Newari?",
        options: ["Snake slay", "Chariot", "New year", "Fertility"],
        correct: 0,
      },
      {
        question: "The festival's chariot has how many wheels?",
        options: ["2", "4", "6", "8"],
        correct: 1,
      },
    ],
    translations: {
      nepali: "बिस्केट जात्रा",
      chinese: "比斯克特节",
      japanese: "ビスケット・ジャトラ",
      korean: "비스켓 자트라",
      spanish: "Bisket Jatra",
    },
    openingHours: "April (dates vary by lunar calendar)",
  },
];

const artisans = [
  {
    name: "Prem Bahadur Prajapati",
    craft: "Pottery Master",
    location: "Bhaktapur",
    city: "Bhaktapur",
    distance: "Pottery Square, Bhaktapur",
    image:
      "https://media.istockphoto.com/id/458585693/photo/earthenware-at-bhaktapur.jpg",
    images: [
      "https://media.istockphoto.com/id/458585693/photo/earthenware-at-bhaktapur.jpg",
      "https://images.pexels.com/photos/1261865/pexels-photo-1261865.jpeg",
      "https://images.pexels.com/photos/895163/pexels-photo-895163.jpeg",
    ],
    bio: "Seventh-generation master potter from Bhaktapur's historic Pottery Square.",
    longBio:
      "Specializes in traditional Newari pottery including grain storage containers, oil lamps, and ceremonial vessels used in festivals. Trains apprentices in traditional wheel-throwing techniques without electricity. His work has been featured in international pottery exhibitions and he has trained over 200 students from around the world.",
    contact: {
      phone: "+977-9812345678",
      email: "prem.prajapati@potterybhaktapur.com",
      whatsapp: "+977-9812345678",
      instagram: "@prem_pottery_bhaktapur",
    },
    experience: 35,
    priceRange: "NPR 500 - 5000",
    rating: 4.9,
    ratingCount: 156,
    products: [
      {
        name: "Traditional Newari Grain Jar (Gagri)",
        price: "NPR 2500",
        description:
          "Hand-thrown terracotta jar for rice/wheat storage, 12-inch height. Perfect for traditional kitchen storage.",
        image:
          "https://images.pexels.com/photos/1261865/pexels-photo-1261865.jpeg",
        inStock: true,
      },
      {
        name: "Oil Lamp Set (Pancha Batti)",
        price: "NPR 1500",
        description:
          "Set of 5 small oil lamps for daily puja. Each lamp is hand-shaped and fired in traditional kiln.",
        image:
          "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
        inStock: true,
      },
      {
        name: "Ceremonial Water Pot (Kalash)",
        price: "NPR 3500",
        description:
          "Used in weddings and festivals, decorated with clay appliqué. 10-inch height with sacred symbols.",
        image:
          "https://images.pexels.com/photos/895163/pexels-photo-895163.jpeg",
        inStock: true,
      },
      {
        name: "Decorative Flower Vase",
        price: "NPR 1800",
        description:
          "8-inch hand-painted terracotta vase with traditional Newari patterns.",
        image:
          "https://images.pexels.com/photos/993774/pexels-photo-993774.jpeg",
        inStock: true,
      },
      {
        name: "Tea Cup Set (6 pieces)",
        price: "NPR 1200",
        description:
          "Traditional clay cups for chiya (tea), unglazed natural finish.",
        image:
          "https://images.pexels.com/photos/1381053/pexels-photo-1381053.jpeg",
        inStock: true,
      },
    ],
    workshops: [
      {
        name: "Traditional Wheel Throwing",
        duration: "2 hours",
        price: "NPR 1000",
        maxParticipants: 5,
        description:
          "Learn basic wheel throwing techniques. Make your own small pot to take home.",
      },
      {
        name: "Clay Sculpture Weekend",
        duration: "2 days",
        price: "NPR 3000",
        maxParticipants: 10,
        description:
          "Complete pottery experience from clay to finished product. Includes firing and glazing.",
      },
      {
        name: "Family Pottery Session",
        duration: "1.5 hours",
        price: "NPR 1500",
        maxParticipants: 4,
        description:
          "Perfect for families with children. Create simple hand-built pieces together.",
      },
    ],
  },
  {
    name: "Khem Bahadur Maharjan",
    craft: "Thanka Painting Master",
    location: "Kathmandu",
    city: "Kathmandu",
    distance: "Swayambhu, Kathmandu",
    image:
      "https://www.globaltimes.cn/Portals/0/attachment/2023/2023-03-26/4144c2a4-1180-4744-b848-055df770a64c.jpeg",
    images: [
      "https://www.globaltimes.cn/Portals/0/attachment/2023/2023-03-26/4144c2a4-1180-4744-b848-055df770a64c.jpeg",
      "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
      "https://images.pexels.com/photos/1211549/pexels-photo-1211549.jpeg",
    ],
    bio: "National award-winning Thanka painter with 30+ years experience.",
    longBio:
      "Master of the Nyingma tradition of Tibetan Buddhist painting. Has exhibited in Japan, USA, and Germany. Trains students in traditional mineral pigment preparation, gold leaf application, and iconometric proportions. His works are in permanent collections at museums in Japan and Germany.",
    contact: {
      phone: "+977-9851234567",
      email: "khem.thankastudio@gmail.com",
      instagram: "@khemthankamaster",
      facebook: "KhemThankaArt",
    },
    experience: 35,
    priceRange: "USD 200 - 800",
    rating: 4.9,
    ratingCount: 234,
    products: [
      {
        name: "Green Tara Thanka",
        price: "USD 250",
        description:
          "12x12 inch, mineral pigments on cotton canvas, traditional design. Includes silk brocade border.",
        image:
          "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
        inStock: true,
      },
      {
        name: "Medicine Buddha Thanka",
        price: "USD 500",
        description:
          "18x24 inch, with gold leaf and silk brocade border. Hand-painted with 24k gold details.",
        image:
          "https://images.pexels.com/photos/1211549/pexels-photo-1211549.jpeg",
        inStock: true,
      },
      {
        name: "Mandala Painting",
        price: "USD 350",
        description:
          "24x24 inch, sand mandala style painting on canvas. Perfect for meditation spaces.",
        image:
          "https://images.pexels.com/photos/1306763/pexels-photo-1306763.jpeg",
        inStock: true,
      },
      {
        name: "White Tara Blessing Thanka",
        price: "USD 300",
        description:
          "16x20 inch, known for healing and longevity blessings. Fine detail work.",
        image:
          "https://images.pexels.com/photos/1306763/pexels-photo-1306763.jpeg",
        inStock: true,
      },
      {
        name: "Wheel of Life Thanka",
        price: "USD 650",
        description:
          "24x30 inch, complex painting showing Buddhist cosmology. Museum quality.",
        image:
          "https://images.pexels.com/photos/1211549/pexels-photo-1211549.jpeg",
        inStock: false,
      },
    ],
    workshops: [
      {
        name: "Thanka Painting Basics",
        duration: "5 days",
        price: "USD 150",
        maxParticipants: 6,
        description:
          "Learn traditional Thanka painting techniques including sketching and color application.",
      },
      {
        name: "Mineral Pigment Preparation",
        duration: "1 day",
        price: "USD 50",
        maxParticipants: 8,
        description:
          "Make natural colors from minerals and plants. Learn traditional grinding methods.",
      },
      {
        name: "Advanced Iconometry",
        duration: "10 days",
        price: "USD 300",
        maxParticipants: 4,
        description:
          "Master the proportional systems and sacred geometry of Buddhist deities.",
      },
    ],
  },
  {
    name: "Sanjay Shilpakar",
    craft: "Wood Carving Master",
    location: "Lalitpur",
    city: "Lalitpur",
    distance: "Patan, Lalitpur",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDs0Bv94LFLuxzgLUtK9PlY5b6juSBEOqPQ&s",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDs0Bv94LFLuxzgLUtK9PlY5b6juSBEOqPQ&s",
      "https://images.pexels.com/photos/1814384/pexels-photo-1814384.jpeg",
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
    ],
    bio: "10th generation master woodcarver specializing in traditional Newari window frames.",
    longBio:
      "Specializes in traditional Newari window frames (Tiki Jhya), temple struts, and decorative panels. Has worked on restoration of Patan Durbar Square and UNESCO heritage sites. His family has been carving for the royal palace for 300 years.",
    contact: {
      phone: "+977-9841234567",
      email: "sanjay.carvings@gmail.com",
      website: "www.sanjaywoodart.com",
      instagram: "@sanjay_woodcarving",
    },
    experience: 40,
    priceRange: "NPR 3500 - 25000",
    rating: 4.8,
    ratingCount: 187,
    products: [
      {
        name: "Miniature Peacock Window",
        price: "NPR 8000",
        description:
          "12x12 inch carved teak wood, replica of famous Peacock Window from Patan. Exquisite detail.",
        image:
          "https://images.pexels.com/photos/1814384/pexels-photo-1814384.jpeg",
        inStock: true,
      },
      {
        name: "Buddhist Prayer Wheel",
        price: "NPR 3500",
        description:
          "4-inch carved wooden handle with mantra inscribed in Sanskrit. Includes metal wheel.",
        image:
          "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
        inStock: true,
      },
      {
        name: "Godhuli Tiki Jhya (Sunset Window)",
        price: "NPR 25000",
        description:
          "36x24 inch carved traditional window. Authentic design used in Newari homes.",
        image:
          "https://images.pexels.com/photos/1814384/pexels-photo-1814384.jpeg",
        inStock: true,
      },
      {
        name: "Lotus Wall Panel",
        price: "NPR 4500",
        description:
          "12x12 inch carved lotus design, perfect for wall hanging.",
        image:
          "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
        inStock: true,
      },
      {
        name: "Ganesh Idol (Wood)",
        price: "NPR 12000",
        description:
          "8-inch hand-carved Ganesh statue from seasoned teak wood.",
        image:
          "https://images.pexels.com/photos/1814384/pexels-photo-1814384.jpeg",
        inStock: true,
      },
    ],
    workshops: [
      {
        name: "Introduction to Woodcarving",
        duration: "3 hours",
        price: "NPR 1500",
        maxParticipants: 4,
        description:
          "Basic carving techniques with traditional tools. Carve a small pendant to take home.",
      },
      {
        name: "Weekend Carving Workshop",
        duration: "2 days",
        price: "NPR 5000",
        maxParticipants: 6,
        description:
          "Complete a small project from design to finished piece. Learn about traditional Newari motifs.",
      },
      {
        name: "Traditional Tool Making",
        duration: "1 day",
        price: "NPR 2000",
        maxParticipants: 5,
        description:
          "Learn to forge and maintain traditional Nepali woodcarving tools.",
      },
    ],
  },
  {
    name: "Binita Tuladhar",
    craft: "Paubha Painting",
    location: "Kathmandu",
    city: "Kathmandu",
    distance: "Asan, Kathmandu",
    image: "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
    images: [
      "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
      "https://images.pexels.com/photos/1306763/pexels-photo-1306763.jpeg",
    ],
    bio: "Master Paubha painter from a lineage of 15 generations.",
    longBio:
      "Specializes in traditional Newari religious paintings using mineral colors, vegetable dyes, and genuine gold leaf. Her work is displayed at the National Museum of Nepal and private collections in Europe. One of few female master Paubha painters in Nepal.",
    contact: {
      phone: "+977-9861234567",
      email: "binita.paubha@gmail.com",
      instagram: "@binita.paubha",
      facebook: "BinitaPaubhaArt",
    },
    experience: 25,
    priceRange: "USD 200 - 600",
    rating: 4.8,
    ratingCount: 142,
    products: [
      {
        name: "Astamatrika Paubha (8 Mother Goddesses)",
        price: "USD 450",
        description:
          "18x24 inch, mineral pigments, detailed border. Depicts the 8 mother goddesses of Newari tradition.",
        image:
          "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
        inStock: true,
      },
      {
        name: "Vajrayogini Mandala",
        price: "USD 600",
        description:
          "24x24 inch circular mandala, gold details. Sacred Vajrayana Buddhist meditation aid.",
        image:
          "https://images.pexels.com/photos/1306763/pexels-photo-1306763.jpeg",
        inStock: true,
      },
      {
        name: "Ganesh Paubha",
        price: "USD 200",
        description:
          "12x16 inch, for home altar. Bright colors and traditional Newari style.",
        image:
          "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
        inStock: true,
      },
      {
        name: "Bhairab Mask Painting",
        price: "USD 350",
        description:
          "16x20 inch, fierce deity, traditional colors. Powerful protector deity.",
        image:
          "https://images.pexels.com/photos/1306763/pexels-photo-1306763.jpeg",
        inStock: true,
      },
      {
        name: "Siddhi Laxmi Paubha",
        price: "USD 280",
        description:
          "14x18 inch, goddess of prosperity with traditional Newari motifs.",
        image:
          "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg",
        inStock: true,
      },
    ],
    workshops: [
      {
        name: "Paubha Painting Basics",
        duration: "3 days",
        price: "USD 100",
        maxParticipants: 5,
        description:
          "Learn traditional Newari painting techniques including sketching and color theory.",
      },
      {
        name: "Natural Color Making",
        duration: "1 day",
        price: "USD 40",
        maxParticipants: 8,
        description:
          "Create pigments from minerals, plants, and traditional sources.",
      },
      {
        name: "Gold Leaf Application",
        duration: "1 day",
        price: "USD 60",
        maxParticipants: 4,
        description:
          "Master the art of applying genuine gold leaf to Paubha paintings.",
      },
    ],
  },
  {
    name: "Tashi Lama Sherpa",
    craft: "Singing Bowl Maker",
    location: "Kathmandu",
    city: "Kathmandu",
    distance: "Boudha, Kathmandu",
    image: "https://images.pexels.com/photos/1267686/pexels-photo-1267686.jpeg",
    images: [
      "https://images.pexels.com/photos/1267686/pexels-photo-1267686.jpeg",
      "https://images.pexels.com/photos/4124773/pexels-photo-4124773.jpeg",
    ],
    bio: "Third-generation singing bowl craftsman using traditional techniques.",
    longBio:
      "Uses traditional techniques to make seven-metal alloy bowls. Specializes in hand-hammered bowls from antique methods used in Tibetan monasteries. Each bowl takes 2-3 weeks to complete. Supplies bowls to monasteries across Nepal and Tibet.",
    contact: {
      phone: "+977-9801234567",
      email: "tashi.bowls@gmail.com",
      facebook: "TashiSingingBowls",
      instagram: "@tashi_singing_bowls",
    },
    experience: 25,
    priceRange: "USD 80 - 700",
    rating: 4.9,
    ratingCount: 203,
    products: [
      {
        name: "Small Hand-Hammered Bowl",
        price: "USD 80",
        description:
          "4 inch, seven-metal alloy, clear frequency. Perfect for personal meditation.",
        image:
          "https://images.pexels.com/photos/1267686/pexels-photo-1267686.jpeg",
        inStock: true,
      },
      {
        name: "Meditation Bowl",
        price: "USD 150",
        description:
          "6 inch, with cushion and striker, healing sound. Deep resonant tone.",
        image:
          "https://images.pexels.com/photos/4124773/pexels-photo-4124773.jpeg",
        inStock: true,
      },
      {
        name: "Chakra Tuning Set",
        price: "USD 700",
        description:
          "7 bowls, each tuned to a specific chakra frequency. Complete set with cushions and strikers.",
        image:
          "https://images.pexels.com/photos/1267686/pexels-photo-1267686.jpeg",
        inStock: true,
      },
      {
        name: "Antique Style Bowl",
        price: "USD 250",
        description:
          "8 inch, aged patina, very deep resonance. Hand-hammered with antique finish.",
        image:
          "https://images.pexels.com/photos/4124773/pexels-photo-4124773.jpeg",
        inStock: true,
      },
      {
        name: "Mini Travel Bowl",
        price: "USD 45",
        description:
          "3 inch, lightweight, includes carrying pouch. Perfect for travel.",
        image:
          "https://images.pexels.com/photos/1267686/pexels-photo-1267686.jpeg",
        inStock: true,
      },
    ],
    workshops: [
      {
        name: "Singing Bowl Sound Healing",
        duration: "3 hours",
        price: "USD 50",
        maxParticipants: 10,
        description:
          "Learn sound healing techniques with singing bowls. Includes hands-on practice.",
      },
      {
        name: "Bowl Making Demonstration",
        duration: "2 hours",
        price: "USD 30",
        maxParticipants: 12,
        description:
          "Watch live bowl-making demonstration. Learn about seven-metal alloys and hammering techniques.",
      },
    ],
  },
  {
    name: "Radha Devi Malla",
    craft: "Mithila Painting",
    location: "Janakpur",
    city: "Janakpur",
    distance: "Janakpur, Madhesh",
    image: "https://images.pexels.com/photos/1061368/pexels-photo-1061368.jpeg",
    images: [
      "https://images.pexels.com/photos/1061368/pexels-photo-1061368.jpeg",
      "https://images.pexels.com/photos/1337757/pexels-photo-1337757.jpeg",
    ],
    bio: "Master Mithila artist from the traditional Jitwarpur village.",
    longBio:
      "Specializes in ritual paintings (Aripana) for weddings and festivals. Uses natural dyes from turmeric, indigo, and rice paste. Her work is in the British Museum's collection. Has trained over 100 women in her community.",
    contact: {
      phone: "+977-9852123456",
      email: "radha.mithila@gmail.com",
      instagram: "@radha_mithila_art",
    },
    experience: 30,
    priceRange: "NPR 2500 - 8000",
    rating: 4.7,
    ratingCount: 98,
    products: [
      {
        name: "Wedding Godhna (Wall Painting)",
        price: "NPR 5000",
        description:
          "2x3 ft on handmade paper, traditional marriage scene. Depicts bride and groom.",
        image:
          "https://images.pexels.com/photos/1061368/pexels-photo-1061368.jpeg",
        inStock: true,
      },
      {
        name: "Kohbar (Sacred Marriage Chamber)",
        price: "NPR 8000",
        description:
          "3x4 ft, detailed lotus and bamboo design. Traditional wedding gift.",
        image:
          "https://images.pexels.com/photos/1337757/pexels-photo-1337757.jpeg",
        inStock: true,
      },
      {
        name: "Mithila Elephant Painting",
        price: "NPR 2500",
        description: "12x18 inch, festival scene with elephants and birds.",
        image:
          "https://images.pexels.com/photos/1061368/pexels-photo-1061368.jpeg",
        inStock: true,
      },
      {
        name: "Aripana Diptych (2 panels)",
        price: "NPR 6000",
        description:
          "Set of two 12x24 inch ritual floor paintings on paper. Sacred geometric patterns.",
        image:
          "https://images.pexels.com/photos/1337757/pexels-photo-1337757.jpeg",
        inStock: true,
      },
      {
        name: "Peacock Mithila Art",
        price: "NPR 3500",
        description:
          "18x24 inch, colorful peacock with traditional Mithila patterns.",
        image:
          "https://images.pexels.com/photos/1061368/pexels-photo-1061368.jpeg",
        inStock: true,
      },
    ],
    workshops: [
      {
        name: "Mithila Art Workshop",
        duration: "2 days",
        price: "NPR 3000",
        maxParticipants: 8,
        description:
          "Learn traditional Mithila painting techniques and patterns.",
      },
      {
        name: "Natural Dye Making",
        duration: "1 day",
        price: "NPR 1500",
        maxParticipants: 10,
        description: "Create natural dyes from local plants and minerals.",
      },
      {
        name: "Aripana Ritual Painting",
        duration: "1 day",
        price: "NPR 2000",
        maxParticipants: 6,
        description:
          "Learn sacred floor painting for festivals and ceremonies.",
      },
    ],
  },
];

const events = [
  {
    title: "Indra Jatra Festival",
    date: "15",
    month: "September",
    fullDate: new Date("2025-09-15"),
    location: "Hanuman Dhoka, Kathmandu",
    city: "Kathmandu",
    distance: "0.5 Km from center",
    type: "Festival",
    price: "Free Entry",
    description:
      "Eight-day chariot festival honoring Indra, god of rain. Features the living goddess Kumari's procession, masked dances, and erection of a ceremonial pole (lingam). The second day's 'Upaku Wanegu' tradition has people viewing photos of deceased relatives.",
  },
  {
    title: "Dashain National Festival",
    date: "2",
    month: "October",
    fullDate: new Date("2025-10-02"),
    location: "Nationwide, major events at Tundikhel, Kathmandu",
    city: "Kathmandu",
    distance: "Central Kathmandu",
    type: "Festival",
    price: "Free Entry",
    description:
      "Nepal's biggest 15-day festival celebrating victory of good over evil. Day 10 (Dashami) involves family gatherings and receiving tika (blessings) from elders. Traditional bamboo swings (ping) are erected in villages.",
  },
  {
    title: "Tihar Festival of Lights",
    date: "20",
    month: "October",
    fullDate: new Date("2025-10-20"),
    location: "Throughout Kathmandu Valley",
    city: "Kathmandu",
    distance: "All neighborhoods",
    type: "Festival",
    price: "Free Entry",
    description:
      "Five-day festival honoring crows, dogs, cows, oxen, and siblings. Houses are decorated with oil lamps (diyo) and colorful rangoli. The final day Bhai Tika celebrates brother-sister bonds.",
  },
  {
    title: "Holi Festival",
    date: "14",
    month: "March",
    fullDate: new Date("2026-03-14"),
    location: "Basantapur, Kathmandu",
    city: "Kathmandu",
    distance: "Central square",
    type: "Festival",
    price: "Free Entry",
    description:
      "Festival of colors celebrating spring. People throw colored powders and water balloons. Traditional music and bhang (cannabis drink) are part of celebrations (legal only during Holi).",
  },
  {
    title: "Losar (Tibetan New Year)",
    date: "21",
    month: "February",
    fullDate: new Date("2026-02-21"),
    location: "Boudha Stupa, Kathmandu",
    city: "Kathmandu",
    distance: "Boudha area",
    type: "Festival",
    price: "Free Entry",
    description:
      "Tibetan Buddhist New Year with prayers, cham dances, and family feasts. Boudha stupa is decorated with prayer flags. Traditional dough balls (guthuk) are eaten the previous day to cleanse negativity.",
  },
  {
    title: "Gai Jatra (Cow Festival)",
    date: "26",
    month: "August",
    fullDate: new Date("2026-08-26"),
    location: "Patan Durbar Square",
    city: "Lalitpur",
    distance: "Patan square",
    type: "Cultural",
    price: "Free Entry",
    description:
      "Procession honoring deceased family members in the past year. Participants dress as cows and perform satirical plays. The festival helps families accept death through humor.",
  },
  {
    title: "Rato Machhindranath Jatra",
    date: "15",
    month: "April",
    fullDate: new Date("2026-04-15"),
    location: "Patan, Lalitpur",
    city: "Lalitpur",
    distance: "Patan area",
    type: "Festival",
    price: "Free Entry",
    description:
      "Month-long chariot festival of the rain god. The massive 60-foot chariot is pulled through Patan. The festival's start date is astrologically determined in March/April.",
  },
  {
    title: "Bisket Jatra",
    date: "13",
    month: "April",
    fullDate: new Date("2026-04-13"),
    location: "Bhaktapur Durbar Square",
    city: "Bhaktapur",
    distance: "City center",
    type: "Festival",
    price: "Free with square entry",
    description:
      "Nine-day New Year festival featuring chariot pulling, lingam raising, and ritual battles. A 40-foot chariot with 8-foot wheels is dragged through narrow streets.",
  },
  {
    title: "Mahashivaratri",
    date: "17",
    month: "February",
    fullDate: new Date("2026-02-17"),
    location: "Pashupatinath Temple, Kathmandu",
    city: "Kathmandu",
    distance: "Pashupati area",
    type: "Religious",
    price: "Free for Hindus, NPR 1000 others",
    description:
      "Night-long festival celebrating Lord Shiva. Over 700,000 devotees visit Pashupatinath. Holi-like ash throwing, all-night chanting, and smoking cannabis (legal this day).",
  },
  {
    name: "Patan Art Festival",
    title: "Patan Art Festival",
    date: "5",
    month: "March",
    fullDate: new Date("2026-03-05"),
    location: "Patan Durbar Square, Lalitpur",
    city: "Lalitpur",
    distance: "Patan square",
    type: "Art",
    price: "NPR 200",
    description:
      "Annual celebration of Newari arts with 50+ artisans demonstrating traditional crafts: metalwork, painting, wood carving, and paubha. Evening concerts with classical Newari music.",
  },
  {
    title: "Nepal Mandala Heritage Week",
    date: "1",
    month: "November",
    fullDate: new Date("2026-11-01"),
    location: "Various Heritage Sites, Lalitpur",
    city: "Lalitpur",
    distance: "All 3 cities",
    type: "Cultural",
    price: "NPR 1000 (heritage pass)",
    description:
      "Week-long celebration of Kathmandu Valley's UNESCO sites. Night viewings, guided tours, cultural programs, and heritage conservation talks. Special access to restricted courtyards.",
  },
];

const siteReviews = [
  // Pashupatinath reviews
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Incredible spiritual experience. The evening aarti on the Bagmati river is mesmerizing. Tip: go at sunset.",
    userName: "Rajesh from India",
    date: new Date("2024-12-15"),
  },
  {
    siteId: null,
    entityType: "Site",
    rating: 4,
    text: "Very sacred but crowded. The temple architecture is stunning. Foreigners can't enter main temple but surrounding area is amazing.",
    userName: "Sarah from UK",
    date: new Date("2024-11-20"),
  },
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Best place for photography at dawn. The cremation ghats are intense but part of life/death cycle.",
    userName: "Ming from China",
    date: new Date("2024-12-01"),
  },
  // Swayambhunath reviews
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Monkeys everywhere! The 365 steps are worth it for valley views. Go early morning.",
    userName: "Carlos from Mexico",
    date: new Date("2024-12-10"),
  },
  {
    siteId: null,
    entityType: "Site",
    rating: 4,
    text: "Beautiful stupa with great energy. Sunset views are spectacular.",
    userName: "Yuki from Japan",
    date: new Date("2024-11-25"),
  },
  // Boudhanath reviews
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "My favorite place in Kathmandu! The Tibetan culture is so vibrant here. Try butter tea at nearby cafe.",
    userName: "Emma from Australia",
    date: new Date("2024-12-18"),
  },
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Incredible at night when lit up. The kora (circumambulation) with monks is meditative.",
    userName: "Klaus from Germany",
    date: new Date("2024-11-30"),
  },
  // Bhaktapur reviews
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Best preserved square. Eat juju dhau (king curd) at Pottery Square. Amazing woodwork.",
    userName: "Lisa from Canada",
    date: new Date("2024-12-12"),
  },
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Less crowded than Kathmandu. Nyatapola temple is masterpiece. Stay overnight for sunrise.",
    userName: "Priya from India",
    date: new Date("2024-11-28"),
  },
  // Lumbini reviews
  {
    siteId: null,
    entityType: "Site",
    rating: 5,
    text: "Peaceful pilgrimage site. Maya Devi temple has sacred birth marker. The international monasteries are fascinating.",
    userName: "Thich from Vietnam",
    date: new Date("2024-12-05"),
  },
];

const artisanReviews = [
  // Prem Bahadur (Pottery) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Learned so much at his workshop! Prem is patient and skilled. His grain jars are beautiful.",
    userName: "Anna from Sweden",
    date: new Date("2024-12-10"),
  },
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Bought a water pot - keeps water cool naturally. Authentic traditional craft.",
    userName: "David from USA",
    date: new Date("2024-11-15"),
  },
  // Khem Bahadur (Thanka) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Master artist! Bought a Green Tara Thanka. He explained each symbol. Worth every penny.",
    userName: "Maria from Spain",
    date: new Date("2024-12-08"),
  },
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 4,
    text: "His workshop was intensive but amazing. Learned to prepare mineral colors.",
    userName: "Tom from UK",
    date: new Date("2024-11-22"),
  },
  // Sanjay (Woodcarving) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Sanjay's peacock window replica is exquisite. He showed me his tools passed from grandfather.",
    userName: "Kenji from Japan",
    date: new Date("2024-12-14"),
  },
  // Binita (Paubha) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Rare female master! Her Vajrayogini Paubha is stunning. Bought small Ganesh for home.",
    userName: "Sophie from France",
    date: new Date("2024-12-01"),
  },
  // Tashi (Singing Bowls) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Best quality bowls in Nepal. The sound healing session was transformative.",
    userName: "Maya from Israel",
    date: new Date("2024-11-18"),
  },
  // Radha (Mithila) reviews
  {
    artisanId: null,
    entityType: "Artisan",
    rating: 5,
    text: "Her workshop in Janakpur was highlight of my trip! Learned traditional Aripana patterns.",
    userName: "Laura from Italy",
    date: new Date("2024-12-09"),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await Promise.all([
      SiteModel.deleteMany({}),
      ArtisanModel.deleteMany({}),
      EventModel.deleteMany({}),
      SiteArtisanModel.deleteMany({}),
      ReviewModel.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Insert new data
    const insertedSites = await SiteModel.insertMany(sites);
    const insertedArtisans = await ArtisanModel.insertMany(artisans);
    await EventModel.insertMany(events);

    console.log(`Inserted ${insertedSites.length} sites`);
    console.log(`Inserted ${insertedArtisans.length} artisans`);
    console.log(`Inserted ${events.length} events`);

    // Link artisans to sites - FIXED with correct indexes (0-5 only)
    const siteArtisanLinks = [
      // Pashupatinath (index 0)
      { siteId: insertedSites[0]._id, artisanId: insertedArtisans[1]._id }, // Khem - Thanka
      { siteId: insertedSites[0]._id, artisanId: insertedArtisans[2]._id }, // Sanjay - Wood

      // Swayambhunath (index 1)
      { siteId: insertedSites[1]._id, artisanId: insertedArtisans[0]._id }, // Prem - Pottery
      { siteId: insertedSites[1]._id, artisanId: insertedArtisans[3]._id }, // Binita - Paubha

      // Boudhanath (index 2)
      { siteId: insertedSites[2]._id, artisanId: insertedArtisans[4]._id }, // Tashi - Bowls

      // Patan Durbar Square (index 3)
      { siteId: insertedSites[3]._id, artisanId: insertedArtisans[2]._id }, // Sanjay - Wood

      // Bhaktapur Durbar Square (index 4)
      { siteId: insertedSites[4]._id, artisanId: insertedArtisans[0]._id }, // Prem - Pottery

      // Changunarayan (index 5)
      { siteId: insertedSites[5]._id, artisanId: insertedArtisans[2]._id }, // Sanjay - Wood

      // Kopan Monastery (index 6)
      { siteId: insertedSites[6]._id, artisanId: insertedArtisans[1]._id }, // Khem - Thanka
      { siteId: insertedSites[6]._id, artisanId: insertedArtisans[4]._id }, // Tashi - Bowls

      // Namche Bazaar (index 7)
      { siteId: insertedSites[7]._id, artisanId: insertedArtisans[4]._id }, // Tashi - Bowls

      // Pokhara Lakeside (index 8)
      { siteId: insertedSites[8]._id, artisanId: insertedArtisans[0]._id }, // Prem - Pottery

      // Lumbini (index 10)
      { siteId: insertedSites[10]._id, artisanId: insertedArtisans[5]._id }, // Radha - Mithila

      // Janaki Temple (index 17)
      { siteId: insertedSites[17]._id, artisanId: insertedArtisans[5]._id }, // Radha - Mithila
    ];

    // Filter out any links where indexes might be out of bounds
    const validLinks = siteArtisanLinks.filter(
      (link) => link.siteId && link.artisanId,
    );

    if (validLinks.length > 0) {
      await SiteArtisanModel.insertMany(validLinks);
      console.log(`✅ Linked: ${validLinks.length} site-artisan relationships`);
    }

    // Add reviews with proper IDs - FIXED to avoid undefined errors
    const siteReviewDocs = siteReviews
      .map((review, index) => {
        const siteIndex = index % insertedSites.length;
        if (insertedSites[siteIndex] && insertedSites[siteIndex]._id) {
          return {
            userId: new mongoose.Types.ObjectId(), // You can replace with actual user ID if needed
            targetId: insertedSites[siteIndex]._id,
            targetType: "site" as const,
            author: review.userName,
            rating: review.rating,
            text: review.text,
            date: review.date.toISOString(),
          };
        }
        return null;
      })
      .filter((review) => review !== null);

    const artisanReviewDocs = artisanReviews
      .map((review, index) => {
        const artisanIndex = index % insertedArtisans.length;
        if (
          insertedArtisans[artisanIndex] &&
          insertedArtisans[artisanIndex]._id
        ) {
          return {
            userId: new mongoose.Types.ObjectId(), // You can replace with actual user ID if needed
            targetId: insertedArtisans[artisanIndex]._id,
            targetType: "artisan" as const,
            author: review.userName,
            rating: review.rating,
            text: review.text,
            date: review.date.toISOString(),
          };
        }
        return null;
      })
      .filter((review) => review !== null);

    if (siteReviewDocs.length > 0) {
      await ReviewModel.insertMany(siteReviewDocs);
    }

    if (artisanReviewDocs.length > 0) {
      await ReviewModel.insertMany(artisanReviewDocs);
    }

    console.log(
      `✅ Seeded: ${insertedSites.length} sites, ${insertedArtisans.length} artisans, ${events.length} events, ${siteReviewDocs.length + artisanReviewDocs.length} reviews`,
    );

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
