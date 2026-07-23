export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index de la bonne réponse
  category: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- Cameroun ---
  { q: "Quelle est la capitale politique du Cameroun ?", options: ["Douala", "Yaoundé", "Garoua", "Bamenda"], answer: 1, category: "Cameroun" },
  { q: "Quelle est la capitale économique du Cameroun ?", options: ["Yaoundé", "Douala", "Bafoussam", "Maroua"], answer: 1, category: "Cameroun" },
  { q: "En quelle année le Cameroun a-t-il obtenu son indépendance ?", options: ["1958", "1960", "1962", "1965"], answer: 1, category: "Cameroun" },
  { q: "Quel est le plus long fleuve du Cameroun ?", options: ["Le Nil", "La Sanaga", "Le Congo", "Le Niger"], answer: 1, category: "Cameroun" },
  { q: "Quelle est la monnaie utilisée au Cameroun ?", options: ["Le Cedi", "Le Franc CFA", "Le Naira", "Le Dollar"], answer: 1, category: "Cameroun" },
  { q: "Quel sport est le plus populaire au Cameroun ?", options: ["Basketball", "Football", "Rugby", "Tennis"], answer: 1, category: "Cameroun" },
  { q: "Quelle montagne est le point culminant du Cameroun ?", options: ["Mont Cameroun", "Mont Manengouba", "Mont Bamboutos", "Mont Oku"], answer: 0, category: "Cameroun" },
  { q: "Combien de régions compte le Cameroun ?", options: ["8", "10", "12", "15"], answer: 1, category: "Cameroun" },
  { q: "Quelles sont les langues officielles du Cameroun ?", options: ["Anglais et Espagnol", "Français et Anglais", "Français seul", "Anglais seul"], answer: 1, category: "Cameroun" },
  { q: "Le Cameroun est surnommé « l'Afrique en... » quoi ?", options: ["Grand", "Miniature", "Couleur", "Modèle"], answer: 1, category: "Cameroun" },
  { q: "Quelle ville camerounaise est connue pour son port ?", options: ["Bafoussam", "Douala", "Ngaoundéré", "Ebolowa"], answer: 1, category: "Cameroun" },
  { q: "Quel plat est typiquement camerounais ?", options: ["Couscous", "Ndolé", "Tajine", "Fufu nigérian"], answer: 1, category: "Cameroun" },

  // --- Tech / Informatique ---
  { q: "Que signifie « HTTP » ?", options: ["HyperText Transfer Protocol", "High Tech Transfer Point", "Home Tool Transfer Program", "Hyperlink Text Tool Process"], answer: 0, category: "Tech" },
  { q: "Combien y a-t-il de Go dans 1 To ?", options: ["100", "1000", "10000", "10"], answer: 1, category: "Tech" },
  { q: "Quel langage structure une page web ?", options: ["CSS", "Python", "HTML", "SQL"], answer: 2, category: "Tech" },
  { q: "Quelle entreprise a créé JavaScript ?", options: ["Microsoft", "Netscape", "Google", "Apple"], answer: 1, category: "Tech" },
  { q: "Que veut dire « Wi-Fi » à l'origine ?", options: ["Wireless Fidelity", "Wire Free", "Wide Field", "Web Finder"], answer: 0, category: "Tech" },
  { q: "Quel composant est le « cerveau » d'un ordinateur ?", options: ["RAM", "Disque dur", "CPU", "Carte graphique"], answer: 2, category: "Tech" },
  { q: "Que signifie « URL » ?", options: ["Uniform Resource Locator", "Universal Result Link", "United Ram Location", "User Reference Log"], answer: 0, category: "Tech" },
  { q: "Quel est le langage de programmation créé par Anthropic-adjacent Google pour le web ?", options: ["Dart", "Ruby", "Swift", "Kotlin"], answer: 0, category: "Tech" },
  { q: "Que signifie « CPU » ?", options: ["Central Processing Unit", "Computer Power Unit", "Central Program Utility", "Core Processing Unity"], answer: 0, category: "Tech" },
  { q: "Quel protocole sécurise les sites web (le petit cadenas) ?", options: ["FTP", "HTTPS", "SMTP", "SSH"], answer: 1, category: "Tech" },
  { q: "Quel format de fichier est le plus compressé pour les photos ?", options: ["BMP", "PNG", "JPEG", "TIFF"], answer: 2, category: "Tech" },
  { q: "Que signifie « RAM » ?", options: ["Random Access Memory", "Read Access Memory", "Rapid Access Module", "Run Access Memory"], answer: 0, category: "Tech" },
  { q: "Quelle entreprise a créé le système Android ?", options: ["Apple", "Google", "Samsung", "Microsoft"], answer: 1, category: "Tech" },
  { q: "Quel est le nom du navigateur développé par Google ?", options: ["Edge", "Safari", "Chrome", "Firefox"], answer: 2, category: "Tech" },
  { q: "Que signifie « USB » ?", options: ["Universal Serial Bus", "United System Board", "Unique Storage Base", "Universal System Bus"], answer: 0, category: "Tech" },
  { q: "Quel réseau social a été créé en premier ?", options: ["Instagram", "Facebook", "Twitter", "TikTok"], answer: 1, category: "Tech" },
  { q: "Combien de bits font un octet ?", options: ["4", "8", "16", "10"], answer: 1, category: "Tech" },
  { q: "Quel type de logiciel protège contre les virus ?", options: ["Antivirus", "Navigateur", "Compilateur", "Éditeur"], answer: 0, category: "Tech" },

  // --- Géographie ---
  { q: "Quel est le plus grand pays d'Afrique par superficie ?", options: ["Nigeria", "Algérie", "Égypte", "RDC"], answer: 1, category: "Géographie" },
  { q: "Quelle est la capitale du Nigeria ?", options: ["Lagos", "Abuja", "Kano", "Ibadan"], answer: 1, category: "Géographie" },
  { q: "Quel est le plus grand désert du monde ?", options: ["Sahara", "Gobi", "Kalahari", "Antarctique"], answer: 3, category: "Géographie" },
  { q: "Quel océan est le plus grand ?", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], answer: 2, category: "Géographie" },
  { q: "Quel pays a pour capitale Paris ?", options: ["Belgique", "France", "Suisse", "Italie"], answer: 1, category: "Géographie" },
  { q: "Combien de pays composent l'Afrique ?", options: ["44", "54", "64", "34"], answer: 1, category: "Géographie" },
  { q: "Quel fleuve traverse l'Égypte ?", options: ["Le Congo", "Le Niger", "Le Nil", "Le Zambèze"], answer: 2, category: "Géographie" },
  { q: "Quelle est la plus grande ville d'Afrique par population ?", options: ["Le Caire", "Lagos", "Kinshasa", "Johannesburg"], answer: 1, category: "Géographie" },
  { q: "Quel pays est surnommé « le pays du matin calme » ?", options: ["Japon", "Chine", "Corée du Sud", "Thaïlande"], answer: 2, category: "Géographie" },
  { q: "Quelle chaîne de montagnes sépare l'Europe de l'Asie ?", options: ["Les Alpes", "L'Oural", "Les Andes", "L'Himalaya"], answer: 1, category: "Géographie" },

  // --- Histoire ---
  { q: "En quelle année a eu lieu la Seconde Guerre mondiale (début) ?", options: ["1935", "1939", "1941", "1945"], answer: 1, category: "Histoire" },
  { q: "Qui a été le premier président des États-Unis ?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], answer: 1, category: "Histoire" },
  { q: "En quelle année l'Union Africaine a-t-elle été créée ?", options: ["1963", "2002", "1990", "1975"], answer: 1, category: "Histoire" },
  { q: "Quel empire a construit les pyramides de Gizeh ?", options: ["L'Empire romain", "L'Égypte antique", "L'Empire perse", "L'Empire ottoman"], answer: 1, category: "Histoire" },
  { q: "Qui a été le premier président du Cameroun indépendant ?", options: ["Paul Biya", "Ahmadou Ahidjo", "Ruben Um Nyobé", "André-Marie Mbida"], answer: 1, category: "Histoire" },
  { q: "En quelle année le mur de Berlin est-il tombé ?", options: ["1985", "1989", "1991", "1993"], answer: 1, category: "Histoire" },

  // --- Sciences ---
  { q: "Quelle est la formule chimique de l'eau ?", options: ["CO2", "H2O", "O2", "NaCl"], answer: 1, category: "Sciences" },
  { q: "Combien de planètes compte le système solaire ?", options: ["7", "8", "9", "10"], answer: 1, category: "Sciences" },
  { q: "Quel organe pompe le sang dans le corps ?", options: ["Le foie", "Le cœur", "Le poumon", "Le rein"], answer: 1, category: "Sciences" },
  { q: "Quelle planète est la plus proche du Soleil ?", options: ["Vénus", "Mercure", "Mars", "Terre"], answer: 1, category: "Sciences" },
  { q: "Quel gaz les plantes absorbent-elles principalement ?", options: ["Oxygène", "Azote", "CO2", "Hydrogène"], answer: 2, category: "Sciences" },
  { q: "Quelle est la vitesse de la lumière (arrondie) ?", options: ["300 000 km/s", "150 000 km/s", "1 000 000 km/s", "30 000 km/s"], answer: 0, category: "Sciences" },
  { q: "Combien d'os compte le corps humain adulte ?", options: ["186", "206", "226", "246"], answer: 1, category: "Sciences" },
  { q: "Quel est l'élément chimique le plus léger ?", options: ["Hélium", "Hydrogène", "Carbone", "Oxygène"], answer: 1, category: "Sciences" },

  // --- Culture générale / Sport ---
  { q: "Combien de joueurs a une équipe de football sur le terrain ?", options: ["9", "10", "11", "12"], answer: 2, category: "Sport" },
  { q: "Tous les combien d'années ont lieu les Jeux Olympiques d'été ?", options: ["2 ans", "4 ans", "5 ans", "6 ans"], answer: 1, category: "Sport" },
  { q: "Quel pays a remporté la Coupe du Monde 2022 ?", options: ["France", "Brésil", "Argentine", "Allemagne"], answer: 2, category: "Sport" },
  { q: "Combien de continents y a-t-il sur Terre ?", options: ["5", "6", "7", "8"], answer: 2, category: "Culture générale" },
  { q: "Quelle est la langue la plus parlée au monde (locuteurs natifs) ?", options: ["Anglais", "Espagnol", "Mandarin", "Hindi"], answer: 2, category: "Culture générale" },
  { q: "Combien de jours compte une année bissextile ?", options: ["364", "365", "366", "367"], answer: 2, category: "Culture générale" },
  { q: "Quel est le plus grand mammifère du monde ?", options: ["L'éléphant", "La baleine bleue", "Le rhinocéros", "La girafe"], answer: 1, category: "Culture générale" },
  { q: "Combien de couleurs compte l'arc-en-ciel traditionnellement ?", options: ["5", "6", "7", "8"], answer: 2, category: "Culture générale" },
  { q: "Quel instrument mesure la température ?", options: ["Baromètre", "Thermomètre", "Altimètre", "Hygromètre"], answer: 1, category: "Culture générale" },
  { q: "Quelle est la monnaie du Japon ?", options: ["Yuan", "Won", "Yen", "Ringgit"], answer: 2, category: "Culture générale" },
  { q: "Quel est le plus petit pays du monde ?", options: ["Monaco", "Vatican", "Saint-Marin", "Liechtenstein"], answer: 1, category: "Culture générale" },
  { q: "Combien de temps la Terre met-elle à faire le tour du Soleil ?", options: ["24 heures", "30 jours", "365 jours", "12 jours"], answer: 2, category: "Culture générale" },
  { q: "Quel animal est le roi de la savane ?", options: ["Le tigre", "Le lion", "L'éléphant", "Le léopard"], answer: 1, category: "Culture générale" },
  { q: "Quelle est la plus haute montagne du monde ?", options: ["Kilimandjaro", "Mont Blanc", "Everest", "K2"], answer: 2, category: "Culture générale" },
  { q: "Quel métal est liquide à température ambiante ?", options: ["Fer", "Mercure", "Plomb", "Cuivre"], answer: 1, category: "Culture générale" },
  { q: "Combien de dents a un adulte en moyenne ?", options: ["28", "30", "32", "34"], answer: 2, category: "Culture générale" },
  { q: "Quel pays a inventé le football moderne ?", options: ["Brésil", "Angleterre", "Espagne", "Italie"], answer: 1, category: "Culture générale" },
  { q: "Quelle est la capitale de l'Italie ?", options: ["Milan", "Venise", "Rome", "Naples"], answer: 2, category: "Culture générale" },
  { q: "Combien de temps dure un match de football (temps réglementaire) ?", options: ["60 min", "90 min", "100 min", "120 min"], answer: 1, category: "Sport" },
  { q: "Quel fruit est riche en vitamine C ?", options: ["La banane", "L'orange", "La pomme", "La mangue"], answer: 1, category: "Culture générale" },
  { q: "Quelle est la plus grande île du monde ?", options: ["Madagascar", "Groenland", "Bornéo", "Sumatra"], answer: 1, category: "Culture générale" },
  { q: "Quel est le symbole chimique de l'or ?", options: ["Go", "Or", "Au", "Ag"], answer: 2, category: "Sciences" },
  { q: "Combien de temps met la lumière du Soleil pour atteindre la Terre ?", options: ["8 minutes", "8 secondes", "8 heures", "8 jours"], answer: 0, category: "Sciences" },
  { q: "Quelle est la devise olympique ?", options: ["Plus vite, plus haut, plus fort", "Ensemble on gagne", "Sport et paix", "Fair-play toujours"], answer: 0, category: "Sport" },
  { q: "Quel pays organise la Coupe d'Afrique des Nations 2025 ?", options: ["Cameroun", "Maroc", "Côte d'Ivoire", "Ghana"], answer: 1, category: "Sport" },
  { q: "Quelle planète est surnommée la « planète rouge » ?", options: ["Vénus", "Jupiter", "Mars", "Saturne"], answer: 2, category: "Sciences" },
  { q: "Quel est le plus grand organe du corps humain ?", options: ["Le foie", "Le cerveau", "La peau", "Le cœur"], answer: 2, category: "Sciences" },
  { q: "Quelle ville abrite la Tour Eiffel ?", options: ["Lyon", "Marseille", "Paris", "Nice"], answer: 2, category: "Culture générale" },
  { q: "Combien de cordes a une guitare classique ?", options: ["4", "5", "6", "7"], answer: 2, category: "Culture générale" },
];
