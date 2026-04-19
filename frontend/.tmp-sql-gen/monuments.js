"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jaipurMonuments = exports.delhiMonuments = void 0;
exports.findMonumentByName = findMonumentByName;
exports.getAllMonuments = getAllMonuments;
exports.getNearbyMonuments = getNearbyMonuments;
exports.delhiMonuments = [
    {
        id: 'red-fort',
        name: 'Red Fort',
        nameHindi: 'लाल किला',
        nameFrench: 'Fort Rouge',
        location: 'Netaji Subhash Marg, Old Delhi',
        coordinates: { lat: 28.6562, lng: 77.2410 },
        historicalInfo: {
            en: 'Built in 1639 by Mughal Emperor Shah Jahan, the Red Fort served as the main residence of Mughal emperors. It is a UNESCO World Heritage Site and a symbol of India\'s rich history. The fort houses several museums and is famous for its red sandstone walls.',
            hi: '1639 में मुगल सम्राट शाहजहाँ द्वारा निर्मित, लाल किला मुगल सम्राटों का मुख्य निवास स्थान था। यह यूनेस्को विश्व धरोहर स्थल है और भारत के समृद्ध इतिहास का प्रतीक है।',
            fr: 'Construit en 1639 par l\'empereur moghol Shah Jahan, le Fort Rouge a servi de résidence principale aux empereurs moghols. C\'est un site du patrimoine mondial de l\'UNESCO.'
        },
        bestTime: 'Early morning (7-9 AM) or evening (4-6 PM)',
        crowdLevel: 'high',
        visitingHours: '9:30 AM - 4:30 PM (Closed on Mondays)',
        safetyAdvisory: {
            en: 'Wear comfortable shoes. Avoid peak hours. Photography allowed. Light and sound show available in evenings.',
            hi: 'आरामदायक जूते पहनें। चरम घंटों से बचें। फोटोग्राफी की अनुमति है।',
            fr: 'Portez des chaussures confortables. Évitez les heures de pointe. Photographie autorisée.'
        },
        category: 'fort'
    },
    {
        id: 'qutub-minar',
        name: 'Qutub Minar',
        nameHindi: 'कुतुब मीनार',
        nameFrench: 'Qutub Minar',
        location: 'Mehrauli, New Delhi',
        coordinates: { lat: 28.5245, lng: 77.1855 },
        historicalInfo: {
            en: 'Built in 1193 by Qutb-ud-din Aibak, Qutub Minar is a 73-meter tall minaret and a UNESCO World Heritage Site. It is the tallest brick minaret in the world and represents the beginning of Muslim rule in India.',
            hi: '1193 में कुतुब-उद-दीन ऐबक द्वारा निर्मित, कुतुब मीनार 73 मीटर ऊंची मीनार है और यूनेस्को विश्व धरोहर स्थल है। यह दुनिया की सबसे ऊंची ईंट की मीनार है।',
            fr: 'Construit en 1193 par Qutb-ud-din Aibak, Qutub Minar est un minaret de 73 mètres de haut et un site du patrimoine mondial de l\'UNESCO.'
        },
        bestTime: 'Early morning (8-10 AM)',
        crowdLevel: 'high',
        visitingHours: '7:00 AM - 5:00 PM',
        safetyAdvisory: {
            en: 'Entry to the minaret is restricted. Best viewed from the ground. Wear comfortable walking shoes.',
            hi: 'मीनार में प्रवेश प्रतिबंधित है। जमीन से सबसे अच्छा दृश्य। आरामदायक चलने वाले जूते पहनें।',
            fr: 'L\'entrée au minaret est restreinte. Meilleure vue depuis le sol.'
        },
        category: 'monument'
    },
    {
        id: 'india-gate',
        name: 'India Gate',
        nameHindi: 'इंडिया गेट',
        nameFrench: 'Porte de l\'Inde',
        location: 'Rajpath, New Delhi',
        coordinates: { lat: 28.6129, lng: 77.2295 },
        historicalInfo: {
            en: 'Built in 1931, India Gate is a war memorial dedicated to 70,000 Indian soldiers who died in World War I. Designed by Sir Edwin Lutyens, it stands 42 meters tall and is surrounded by lush green lawns.',
            hi: '1931 में निर्मित, इंडिया गेट प्रथम विश्व युद्ध में शहीद हुए 70,000 भारतीय सैनिकों को समर्पित एक युद्ध स्मारक है।',
            fr: 'Construit en 1931, l\'India Gate est un mémorial de guerre dédié aux 70 000 soldats indiens morts pendant la Première Guerre mondiale.'
        },
        bestTime: 'Evening (5-8 PM) for lighting',
        crowdLevel: 'high',
        visitingHours: 'Open 24 hours',
        safetyAdvisory: {
            en: 'Very popular in evenings. Great for photography. Food vendors available nearby. Well-lit area.',
            hi: 'शाम को बहुत लोकप्रिय। फोटोग्राफी के लिए बढ़िया। आस-पास खाने के विक्रेता उपलब्ध हैं।',
            fr: 'Très populaire le soir. Idéal pour la photographie.'
        },
        category: 'monument'
    },
    {
        id: 'lotus-temple',
        name: 'Lotus Temple',
        nameHindi: 'कमल मंदिर',
        nameFrench: 'Temple du Lotus',
        location: 'Bahapur, Kalkaji, New Delhi',
        coordinates: { lat: 28.5535, lng: 77.2588 },
        historicalInfo: {
            en: 'Completed in 1986, the Lotus Temple is a Bahá\'í House of Worship known for its flower-like architecture. It is one of the most visited buildings in the world, welcoming people of all faiths.',
            hi: '1986 में पूर्ण, कमल मंदिर अपनी फूल जैसी वास्तुकला के लिए जाना जाने वाला बहाई उपासना स्थल है।',
            fr: 'Terminé en 1986, le Temple du Lotus est une Maison d\'adoration bahá\'íe connue pour son architecture en forme de fleur.'
        },
        bestTime: 'Morning (9-11 AM) or evening (4-6 PM)',
        crowdLevel: 'medium',
        visitingHours: '9:00 AM - 7:00 PM (Closed on Mondays)',
        safetyAdvisory: {
            en: 'Maintain silence inside. Remove shoes before entry. Photography allowed outside only.',
            hi: 'अंदर शांति बनाए रखें। प्रवेश से पहले जूते उतारें। केवल बाहर फोटोग्राफी की अनुमति है।',
            fr: 'Maintenez le silence à l\'intérieur. Retirez les chaussures avant l\'entrée.'
        },
        category: 'temple'
    },
    {
        id: 'humayun-tomb',
        name: 'Humayun\'s Tomb',
        nameHindi: 'हुमायूं का मकबरा',
        nameFrench: 'Tombe de Humayun',
        location: 'Mathura Road, Nizamuddin, New Delhi',
        coordinates: { lat: 28.5933, lng: 77.2507 },
        historicalInfo: {
            en: 'Built in 1570, Humayun\'s Tomb is the first garden-tomb in India and a UNESCO World Heritage Site. It inspired the design of the Taj Mahal. The tomb is set in a beautiful Mughal garden.',
            hi: '1570 में निर्मित, हुमायूं का मकबरा भारत में पहला बगीचा-मकबरा है और यूनेस्को विश्व धरोहर स्थल है। इसने ताज महल के डिजाइन को प्रेरित किया।',
            fr: 'Construit en 1570, le Tombeau de Humayun est le premier tombeau-jardin en Inde et un site du patrimoine mondial de l\'UNESCO.'
        },
        bestTime: 'Early morning (8-10 AM)',
        crowdLevel: 'medium',
        visitingHours: '6:00 AM - 6:00 PM',
        safetyAdvisory: {
            en: 'Beautiful gardens for photography. Wear comfortable shoes. Best visited in winter months.',
            hi: 'फोटोग्राफी के लिए सुंदर बगीचे। आरामदायक जूते पहनें। सर्दियों के महीनों में सबसे अच्छा दौरा।',
            fr: 'Beaux jardins pour la photographie. Portez des chaussures confortables.'
        },
        category: 'monument'
    },
    {
        id: 'jama-masjid',
        name: 'Jama Masjid',
        nameHindi: 'जामा मस्जिद',
        nameFrench: 'Jama Masjid',
        location: 'Chandni Chowk, Old Delhi',
        coordinates: { lat: 28.6507, lng: 77.2334 },
        historicalInfo: {
            en: 'Built in 1656 by Shah Jahan, Jama Masjid is one of the largest mosques in India. It can accommodate 25,000 worshippers. The mosque features three domes, two minarets, and is made of red sandstone and white marble.',
            hi: '1656 में शाहजहाँ द्वारा निर्मित, जामा मस्जिद भारत की सबसे बड़ी मस्जिदों में से एक है। यह 25,000 उपासकों को समायोजित कर सकती है।',
            fr: 'Construite en 1656 par Shah Jahan, Jama Masjid est l\'une des plus grandes mosquées d\'Inde.'
        },
        bestTime: 'Early morning (6-8 AM) or evening (5-7 PM)',
        crowdLevel: 'high',
        visitingHours: '7:00 AM - 12:00 PM, 1:30 PM - 6:30 PM',
        safetyAdvisory: {
            en: 'Dress modestly. Remove shoes before entry. Non-Muslims can visit outside prayer times. Climb minaret for panoramic views.',
            hi: 'विनम्र कपड़े पहनें। प्रवेश से पहले जूते उतारें। गैर-मुस्लिम प्रार्थना के समय के बाहर जा सकते हैं।',
            fr: 'Habillez-vous modestement. Retirez les chaussures avant l\'entrée.'
        },
        category: 'temple'
    },
    {
        id: 'akshardham',
        name: 'Akshardham Temple',
        nameHindi: 'अक्षरधाम मंदिर',
        nameFrench: 'Temple Akshardham',
        location: 'Noida Mor, Pandav Nagar, New Delhi',
        coordinates: { lat: 28.6127, lng: 77.2773 },
        historicalInfo: {
            en: 'Opened in 2005, Akshardham is a modern Hindu temple complex showcasing Indian culture, spirituality, and architecture. It features intricate carvings, exhibitions, and a musical fountain show.',
            hi: '2005 में खोला गया, अक्षरधाम एक आधुनिक हिंदू मंदिर परिसर है जो भारतीय संस्कृति, आध्यात्मिकता और वास्तुकला को प्रदर्शित करता है।',
            fr: 'Ouvert en 2005, Akshardham est un complexe de temples hindous moderne présentant la culture, la spiritualité et l\'architecture indiennes.'
        },
        bestTime: 'Morning (9-11 AM) or evening (4-6 PM)',
        crowdLevel: 'high',
        visitingHours: '9:30 AM - 6:30 PM (Closed on Mondays)',
        safetyAdvisory: {
            en: 'No photography or mobile phones allowed inside. Free entry. Musical fountain show in evenings. Allow 3-4 hours for complete visit.',
            hi: 'अंदर फोटोग्राफी या मोबाइल फोन की अनुमति नहीं है। निःशुल्क प्रवेश।',
            fr: 'Aucune photographie ou téléphone portable autorisé à l\'intérieur. Entrée gratuite.'
        },
        category: 'temple'
    },
    {
        id: 'purana-qila',
        name: 'Purana Qila',
        nameHindi: 'पुराना किला',
        nameFrench: 'Purana Qila',
        location: 'Mathura Road, New Delhi',
        coordinates: { lat: 28.6092, lng: 77.2434 },
        historicalInfo: {
            en: 'Purana Qila (Old Fort) is one of the oldest forts in Delhi, believed to be the site of the ancient city of Indraprastha. The fort houses several historical structures and offers light and sound shows.',
            hi: 'पुराना किला दिल्ली के सबसे पुराने किलों में से एक है, जिसे प्राचीन शहर इंद्रप्रस्थ का स्थान माना जाता है।',
            fr: 'Purana Qila (Vieux Fort) est l\'un des plus anciens forts de Delhi, considéré comme le site de l\'ancienne ville d\'Indraprastha.'
        },
        bestTime: 'Evening (5-7 PM) for light show',
        crowdLevel: 'low',
        visitingHours: '7:00 AM - 5:00 PM',
        safetyAdvisory: {
            en: 'Less crowded than other monuments. Good for photography. Light and sound show available.',
            hi: 'अन्य स्मारकों की तुलना में कम भीड़। फोटोग्राफी के लिए अच्छा।',
            fr: 'Moins fréquenté que les autres monuments. Bon pour la photographie.'
        },
        category: 'fort'
    }
];
exports.jaipurMonuments = [
    {
        id: 'hawa-mahal',
        name: 'Hawa Mahal',
        nameHindi: 'हवा महल',
        nameFrench: 'Palais des Vents',
        location: 'Badi Choupad, Jaipur',
        coordinates: { lat: 26.9239, lng: 75.8267 },
        historicalInfo: {
            en: 'Built in 1799 by Maharaja Sawai Pratap Singh, this five-story palace features 953 small windows (jharokhas) designed for royal women to observe street festivals without being seen. The unique honeycomb structure allows cool air to flow through, giving it the name "Palace of Winds."',
            hi: '1799 में महाराजा सवाई प्रताप सिंह द्वारा निर्मित, यह पांच मंजिला महल 953 छोटी खिड़कियों (झरोखों) से सुसज्जित है, जो शाही महिलाओं के लिए बिना देखे गली के उत्सव देखने के लिए बनाई गई थीं।',
            fr: 'Construit en 1799 par le Maharaja Sawai Pratap Singh, ce palais de cinq étages compte 953 petites fenêtres (jharokhas) conçues pour que les femmes royales puissent observer les festivals de rue sans être vues.'
        },
        bestTime: 'Early morning (7-9 AM) or late afternoon (4-6 PM)',
        crowdLevel: 'high',
        visitingHours: '9:00 AM - 4:30 PM',
        safetyAdvisory: {
            en: 'Wear comfortable shoes for climbing. Avoid peak hours (11 AM - 2 PM) for better experience.',
            hi: 'चढ़ने के लिए आरामदायक जूते पहनें। बेहतर अनुभव के लिए चरम घंटों (11 AM - 2 PM) से बचें।',
            fr: 'Portez des chaussures confortables pour monter. Évitez les heures de pointe (11h-14h) pour une meilleure expérience.'
        },
        category: 'palace'
    },
    {
        id: 'amber-fort',
        name: 'Amber Fort',
        nameHindi: 'आमेर किला',
        nameFrench: 'Fort d\'Amber',
        location: 'Amer, Jaipur',
        coordinates: { lat: 26.9855, lng: 75.8513 },
        historicalInfo: {
            en: 'A magnificent fort built in 1592 by Raja Man Singh I. The fort complex includes the Diwan-i-Aam, Diwan-i-Khas, Sheesh Mahal (Palace of Mirrors), and Sukh Niwas. It showcases a blend of Hindu and Mughal architecture.',
            hi: '1592 में राजा मान सिंह प्रथम द्वारा निर्मित एक भव्य किला। किला परिसर में दीवान-ए-आम, दीवान-ए-खास, शीश महल और सुख निवास शामिल हैं।',
            fr: 'Un fort magnifique construit en 1592 par Raja Man Singh I. Le complexe du fort comprend le Diwan-i-Aam, Diwan-i-Khas, Sheesh Mahal et Sukh Niwas.'
        },
        bestTime: 'Early morning (8-10 AM)',
        crowdLevel: 'high',
        visitingHours: '8:00 AM - 6:00 PM',
        safetyAdvisory: {
            en: 'Elephant rides available but consider ethical alternatives. Wear comfortable walking shoes. Stay hydrated.',
            hi: 'हाथी की सवारी उपलब्ध है लेकिन नैतिक विकल्पों पर विचार करें। आरामदायक चलने वाले जूते पहनें। हाइड्रेटेड रहें।',
            fr: 'Balades à dos d\'éléphant disponibles mais considérez des alternatives éthiques. Portez des chaussures de marche confortables.'
        },
        category: 'fort'
    },
    {
        id: 'city-palace',
        name: 'City Palace',
        nameHindi: 'सिटी पैलेस',
        nameFrench: 'Palais de la Ville',
        location: 'Tulsi Marg, Jaipur',
        coordinates: { lat: 26.9258, lng: 75.8236 },
        historicalInfo: {
            en: 'Built between 1729-1732 by Maharaja Sawai Jai Singh II, the founder of Jaipur. The palace complex includes courtyards, gardens, and buildings. It houses museums with royal artifacts, weapons, and textiles.',
            hi: '1729-1732 में जयपुर के संस्थापक महाराजा सवाई जय सिंह द्वितीय द्वारा निर्मित। महल परिसर में आंगन, बगीचे और इमारतें शामिल हैं।',
            fr: 'Construit entre 1729-1732 par le Maharaja Sawai Jai Singh II, fondateur de Jaipur. Le complexe du palais comprend des cours, des jardins et des bâtiments.'
        },
        bestTime: 'Morning (9-11 AM)',
        crowdLevel: 'medium',
        visitingHours: '9:30 AM - 5:00 PM',
        safetyAdvisory: {
            en: 'Photography allowed in most areas. Guided tours recommended for better understanding.',
            hi: 'अधिकांश क्षेत्रों में फोटोग्राफी की अनुमति है। बेहतर समझ के लिए निर्देशित दौरे की सिफारिश की जाती है।',
            fr: 'Photographie autorisée dans la plupart des zones. Visites guidées recommandées.'
        },
        category: 'palace'
    },
    {
        id: 'jantar-mantar',
        name: 'Jantar Mantar',
        nameHindi: 'जंतर मंतर',
        nameFrench: 'Jantar Mantar',
        location: 'Gangori Bazaar, Jaipur',
        coordinates: { lat: 26.9247, lng: 75.8246 },
        historicalInfo: {
            en: 'An astronomical observatory built in 1734 by Maharaja Sawai Jai Singh II. It features 19 architectural astronomical instruments, including the world\'s largest stone sundial. A UNESCO World Heritage Site.',
            hi: '1734 में महाराजा सवाई जय सिंह द्वितीय द्वारा निर्मित एक खगोलीय वेधशाला। इसमें 19 वास्तुशिल्प खगोलीय उपकरण शामिल हैं।',
            fr: 'Un observatoire astronomique construit en 1734 par le Maharaja Sawai Jai Singh II. Il comprend 19 instruments astronomiques architecturaux.'
        },
        bestTime: 'Morning (9-11 AM) or late afternoon (4-5 PM)',
        crowdLevel: 'medium',
        visitingHours: '9:00 AM - 4:30 PM',
        safetyAdvisory: {
            en: 'Best visited with a guide to understand the astronomical instruments. Avoid midday sun.',
            hi: 'खगोलीय उपकरणों को समझने के लिए गाइड के साथ सबसे अच्छा दौरा। दोपहर की धूप से बचें।',
            fr: 'Meilleure visite avec un guide pour comprendre les instruments astronomiques.'
        },
        category: 'museum'
    },
    {
        id: 'nahargarh-fort',
        name: 'Nahargarh Fort',
        nameHindi: 'नाहरगढ़ किला',
        nameFrench: 'Fort de Nahargarh',
        location: 'Krishna Nagar, Jaipur',
        coordinates: { lat: 26.9364, lng: 75.8153 },
        historicalInfo: {
            en: 'Built in 1734, this fort offers panoramic views of Jaipur. It was originally named Sudarshangarh but later renamed Nahargarh. The fort houses Madhavendra Bhawan, a palace with suites for the king and his queens.',
            hi: '1734 में निर्मित, यह किला जयपुर का मनोरम दृश्य प्रस्तुत करता है। मूल रूप से सुदर्शनगढ़ नामित, बाद में नाहरगढ़ नाम दिया गया।',
            fr: 'Construit en 1734, ce fort offre une vue panoramique sur Jaipur. Il abrite Madhavendra Bhawan, un palais avec des suites pour le roi et ses reines.'
        },
        bestTime: 'Evening (5-7 PM) for sunset views',
        crowdLevel: 'low',
        visitingHours: '10:00 AM - 5:30 PM',
        safetyAdvisory: {
            en: 'Popular for sunset views. Arrive early to secure a good spot. Drive carefully on the winding road.',
            hi: 'सूर्यास्त के दृश्यों के लिए लोकप्रिय। अच्छी जगह सुरक्षित करने के लिए जल्दी पहुंचें।',
            fr: 'Populaire pour les vues sur le coucher du soleil. Arrivez tôt pour avoir une bonne place.'
        },
        category: 'fort'
    },
    {
        id: 'jal-mahal',
        name: 'Jal Mahal',
        nameHindi: 'जल महल',
        nameFrench: 'Palais de l\'Eau',
        location: 'Amer Road, Jaipur',
        coordinates: { lat: 26.9532, lng: 75.8467 },
        historicalInfo: {
            en: 'A palace built in the middle of Man Sagar Lake in 1799. The palace appears to float on water. Currently, entry inside is restricted, but the view from the banks is spectacular, especially during sunset.',
            hi: '1799 में मान सागर झील के बीच में बना एक महल। महल पानी पर तैरता हुआ दिखाई देता है।',
            fr: 'Un palais construit au milieu du lac Man Sagar en 1799. Le palais semble flotter sur l\'eau.'
        },
        bestTime: 'Early morning or evening for photography',
        crowdLevel: 'low',
        visitingHours: 'Viewing from banks: All day',
        safetyAdvisory: {
            en: 'Best viewed from the banks. Entry inside currently restricted. Great for photography during golden hour.',
            hi: 'किनारों से सबसे अच्छा दृश्य। अंदर प्रवेश वर्तमान में प्रतिबंधित है।',
            fr: 'Meilleure vue depuis les rives. Entrée à l\'intérieur actuellement restreinte.'
        },
        category: 'palace'
    }
];
function findMonumentByName(query, city = 'jaipur') {
    const lowerQuery = query.toLowerCase();
    const monuments = city.toLowerCase() === 'delhi' ? exports.delhiMonuments : exports.jaipurMonuments;
    return monuments.find(m => m.name.toLowerCase().includes(lowerQuery) ||
        m.nameHindi.includes(query) ||
        m.nameFrench.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(m.name.toLowerCase())) || null;
}
function getAllMonuments(city) {
    if (city && city.toLowerCase() === 'delhi') {
        return exports.delhiMonuments;
    }
    return exports.jaipurMonuments;
}
function getNearbyMonuments(lat, lng, limit = 3) {
    // Simple distance calculation (Haversine would be better, but for demo purposes)
    const monumentsWithDistance = exports.jaipurMonuments.map(monument => ({
        monument,
        distance: Math.sqrt(Math.pow(monument.coordinates.lat - lat, 2) +
            Math.pow(monument.coordinates.lng - lng, 2))
    }));
    return monumentsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(item => item.monument);
}
