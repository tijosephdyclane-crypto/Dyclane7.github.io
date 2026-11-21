const COMMUNES_GUYANE = [
    {
        nom: "Cayenne",
        categorie: "Commune",
        lat: 4.9372,
        lng: -52.3260,
        image: "images/cayenne.jpg",
        anecdote: "Fondée au XVIIe siècle, Cayenne est célèbre pour son carnaval et sa place des Palmistes."
    },
    {
        nom: "Kourou",
        categorie: "Commune",
        lat: 5.1579834,
        lng: -52.6424204,
        image: "images/csg.jpg",
        anecdote: "Kourou accueille le Centre spatial guyanais, base de lancement européenne."
    },
    {
        nom: "Saint-Laurent-du-Maroni",
        categorie: "Commune",
        lat: 5.4976,
        lng: -54.0325,
        image: "images/slm.jpg",
        anecdote: "Située face au Suriname, Saint-Laurent-du-Maroni est la deuxième ville la plus peuplée de Guyane."
    },
    {
        nom: "Maripasoula",
        categorie: "Commune",
        lat: 3.6425,
        lng: -54.0289,
        image: "images/maripasoula.jpg",
        anecdote: "C'est la plus vaste commune de France avec plus de 18 000 km², accessible uniquement en avion ou en pirogue."
    },
    {
        nom: "Saint-Georges-de-l'Oyapock",
        categorie: "Commune",
        lat: 3.8908,
        lng: -51.8022,
        image: "images/saint-georges-de-l'oyapock.jpg",
        anecdote: "Reliée au Brésil par le pont binational sur l'Oyapock, c'est la porte d'entrée terrestre vers l'État de l'Amapá."
    },
    {
        nom: "Saül",
        categorie: "Commune",
        lat: 3.6225,
        lng: -53.2086,
        image: "images/saul.jpg",
        anecdote: "Cette commune isolée est située au cœur du Parc amazonien de Guyane."
    },
    {
        nom: "Rémire-Montjoly",
        categorie: "Commune",
        lat: 4.9051217,
        lng: -52.2772372,
        anecdote: "Voisine de Cayenne, cette commune côtière est connue pour ses plages et le sentier du Rorota."
    },
    {
        nom: "Apatou",
        categorie: "Commune",
        lat: 5.1551,
        lng: -54.3411,
        anecdote: "Apatou est une commune de l'ouest guyanais située sur le fleuve Maroni."
    },
    {
        nom: "Awala-Yalimapo",
        categorie: "Commune",
        lat: 5.7292,
        lng: -53.9362,
        anecdote: "Awala-Yalimapo est connue pour la plage des Hattes, un important site de ponte des tortues marines."
    },
    {
        nom: "Camopi",
        categorie: "Commune",
        lat: 3.1654,
        lng: -52.3260,
        anecdote: "Camopi se trouve sur l'Oyapock, à la frontière entre la Guyane et le Brésil."
    },
    {
        nom: "Grand-Santi",
        categorie: "Commune",
        lat: 4.2504,
        lng: -54.3812,
        anecdote: "Grand-Santi est une commune de l'ouest guyanais située le long du Maroni."
    },
    {
        nom: "Iracoubo",
        categorie: "Commune",
        lat: 5.4806,
        lng: -53.2066,
        anecdote: "L'église Saint-Joseph d'Iracoubo est célèbre pour ses peintures intérieures."
    },
    {
        nom: "Macouria",
        categorie: "Commune",
        lat: 5.0073,
        lng: -52.4803,
        anecdote: "Macouria, dont le bourg principal est Tonate, se situe entre Cayenne et Kourou."
    },
    {
        nom: "Mana",
        categorie: "Commune",
        lat: 5.6697,
        lng: -53.7770,
        anecdote: "Mana est une commune de l'ouest guyanais fondée au XIXe siècle par la mère Javouhey."
    },
    {
        nom: "Matoury",
        categorie: "Commune",
        lat: 4.8483,
        lng: -52.3297,
        anecdote: "L'aéroport international Félix-Éboué se trouve sur le territoire de Matoury."
    },
    {
        nom: "Montsinéry-Tonnegrande",
        categorie: "Commune",
        lat: 4.8579,
        lng: -52.4895,
        anecdote: "Montsinéry-Tonnegrande est une commune rurale située à proximité de l'agglomération de Cayenne."
    },
    {
        nom: "Ouanary",
        categorie: "Commune",
        lat: 4.2257,
        lng: -51.6699,
        anecdote: "Ouanary est une commune isolée de l'est guyanais, près de l'embouchure de l'Oyapock."
    },
    {
        nom: "Papaïchton",
        categorie: "Commune",
        lat: 3.8094,
        lng: -53.9947,
        anecdote: "Papaïchton est une commune de l'intérieur située sur le fleuve Maroni."
    },
    {
        nom: "Régina",
        categorie: "Commune",
        lat: 4.3149,
        lng: -52.1315,
        anecdote: "Régina est une vaste commune de l'est guyanais traversée par l'Approuague."
    },
    {
        nom: "Roura",
        categorie: "Commune",
        lat: 4.7264,
        lng: -52.3278,
        anecdote: "Roura est notamment connue pour les marais de Kaw, un site naturel remarquable."
    },
    {
        nom: "Saint-Élie",
        categorie: "Commune",
        lat: 4.8165,
        lng: -53.2762,
        anecdote: "Saint-Élie est une commune isolée de l'intérieur de la Guyane, accessible notamment par le lac de Petit-Saut."
    },
    {
        nom: "Sinnamary",
        categorie: "Commune",
        lat: 5.3784,
        lng: -52.9546,
        anecdote: "Sinnamary est une commune côtière traversée par le fleuve du même nom."
    }
];

const LIEUX_EMBLEMATIQUES_GUYANE = [
    {
        nom: "Université de Guyane — campus de Troubiran",
        categorie: "Éducation",
        lat: 4.9325789,
        lng: -52.3022177,
        commune: "Cayenne",
        anecdote: "Le campus de Troubiran est situé à Cayenne et accueille notamment le siège de l'Université de Guyane."
    },
    {
        nom: "Centre spatial guyanais",
        categorie: "Science & espace",
        lat: 5.2360,
        lng: -52.7686,
        commune: "Kourou",
        image: "images/csg.jpg",
        anecdote: "Le Centre spatial guyanais est la base de lancement européenne, choisie notamment pour sa proximité avec l'équateur."
    },
    {
        nom: "Camp de la Transportation",
        categorie: "Patrimoine",
        lat: 5.5035928,
        lng: -54.0318363,
        commune: "Saint-Laurent-du-Maroni",
        image: "images/camp.jpg",
        anecdote: "Ancien pénitencier de Saint-Laurent-du-Maroni, le site est aujourd'hui un lieu de mémoire."
    },
    {
        nom: "Place des Palmistes",
        categorie: "Patrimoine",
        lat: 4.9395938,
        lng: -52.3338290,
        commune: "Cayenne",
        image: "images/palmistes.jpg",
        anecdote: "Cette place emblématique de Cayenne est bordée de palmiers et animée toute l'année."
    },
    {
        nom: "Les Îles du Salut",
        categorie: "Patrimoine & nature",
        lat: 5.2869,
        lng: -52.5886,
        commune: "Kourou",
        image: "images/iles-du-salut.jpg",
        anecdote: "Archipel composé de l'île Royale, l'île Saint-Joseph et l'île du Diable, célèbre pour son histoire et ses tortues marines."
    },
    {
        nom: "Pont sur l'Oyapock",
        categorie: "Ouvrage d'art",
        lat: 3.8577658,
        lng: -51.8259343,
        commune: "Saint-Georges-de-l'Oyapock",
        image: "images/saint-georges-de-l'oyapock.jpg",
        anecdote: "Ce pont relie la Guyane française à l'État brésilien de l'Amapá."
    }
];
