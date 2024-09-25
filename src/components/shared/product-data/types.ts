export interface ProductType {
  id: number;
  name: string;
  title: string;
  description: DescriptionType;
  price: string;
  unit: UnitType;
  stats: StatType[];

  tags: string[];
  footerText: string;
  locations: string[];
  materials: string[];
  public: string;
  tasks: string[];
  duration: "string";
}

export type StatType = {
  label: "difficulté";
  value: string;
};

type DescriptionType = {
  short: string;
  long: string;
};

export type UnitType = "group" | "person" | "enfant" | "nuit" | "journée";

export type MainProductType = {
  id: number;
  title: string;
  description: string;
  price: string | number;
  locations: string | string[];
  program?: string | string[];
  audience?: string;
  tags?: string[];
};

/**
 * {
  "products": [
    {
      "id": 1,
      "title": "Evenementiel",
      "tags": ["création", "rêve, fascinant"],
      "description": "Nous proposerons des animations lors d’événements locaux (atelier de grimpe simple, aménagement d'espace convivial perché, atelier à sensations fortes), mais aussi la création d'ateliers sur mesure pour tout type de festivals, les anniversaires, les enterrements de vie de jeunes filles ou de garçons, etc. Nous avons également pour projet de proposer nos propres événements avec des partenaires par la suite.",
      "price": "nous contacter afin d'établir un devis",
      "program": "sur-mesure pour vous",
      "public": "Tout publique",
      "locations": "lieu qu'on conventionnera dans le futur, si vous avez un déjà un lieu a nous proposer nous nous déplaçons. Notre déplacement comprend une étude de faisabilité, un diagnostic des arbres , et établir une convention pour autorisation d'usage du site ainsi que l'installation et l'encadrement de l'animation"
    },
    {
      "id": 2,
      "title": "Sensoriel et sensibilisation",
      "tags": ["Echange", "bienveillance", "éducation"],
      "description": "Nous souhaitons mettre en place des ateliers sensoriels, adaptés aux jeunes enfants et aux personnes en situation de handicap, tels que des après-midi « bibliothèque perchée », de l’éveil-musical en filet, des siestes aériennes musicales, ou des lectures de contes. Sur du plus long terme, nous souhaitons également travailler avec les écoles et avec les communes pour organiser des ateliers de sensibilisation sur la protection de l'environnement.",
      "price": "nous contacter afin d'établir un devis",
      "public": "Tout publique",
      "locations": "lieux en cours de convention, si vous souhaitez réaliser une activité au sein de votre structure, contactez-nous pour que nous puissions réaliser un repérage (comprend une étude de faisabilité et un diagnostic des arbres) , puis établir une convention d'occupation pour autorisation d'usage du site.",
      "program": "sur-mesure pour vous"
    },
    {
      "id": 3,
      "title": "Recherche",
      "description": "Pour compléter la veille scientifique que nous menons sur les bienfaits psychologiques de la grimpe d'arbre, nous aimerions développer des projets de recherche en partenariat avec les universités pour enrichir la littérature scientifique sur ce sujet. Enfin, ce pôle permettra également d'intervenir sur des projets de recherche existants concernant la faune et la flore des milieux forestiers (inventaire, suivi d'espèces protégées, installation de matériel tel que des pièges photos, etc.).",
      "price": "nous contacter afin d'établir un devis",
      "locations": "nous nous déplaçons sur le lieu ou vous avez besoin de nos compétences. Notre déplacement comprend une étude de faisabilité, un diagnostic des arbres , et établir une convention pour autorisation d'usage du site ainsi que l'installation de matériel, etc..."
    }

  ]
}
 * 
 */
