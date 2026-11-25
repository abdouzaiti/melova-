import type { Dish } from "../components/DishOrbitCarousel"

import margheritaImg from "../assets/images/pizza_margherita_verace_1794586909462.jpg"
import verdePistacchioImg from "../assets/images/pizza_verde_pistacchio_1794586910133.jpg"
import diavolaImg from "../assets/images/pizza_diavola_piccante_1794586910746.jpg"
import tartufoImg from "../assets/images/pizza_tartufo_bianca_1794586911043.jpg"
import quattroImg from "../assets/images/pizza_quattro_formaggi_1794586911687.jpg"
import woodfireBackdropImg from "../assets/images/delizia_woodfire_backdrop_1794586912165.jpg"

export type PizzaSize = "normal" | "geante" | "mega"

export const PIZZA_SIZE_LABELS: Record<PizzaSize, string> = {
  normal: "Normal",
  geante: "Géante",
  mega: "Méga",
}

export type SizePrices = {
  normal: number
  geante: number
  mega: number
}

export type SupplementItem = {
  id: string
  name: string
  price: number
}

export type PrepStep = {
  time: string
  stage: string
  detail: string
  temp?: string
}

export type KitchenDish = Dish & {
  id: string
  prices: SizePrices
  price: number
  prepMinutes: number
  course: string
  ingredientsText: string
  steps: PrepStep[]
}

export const MELOVA_BACKDROP = woodfireBackdropImg

export const SUPPLEMENTS: SupplementItem[] = [
  { id: "bordure-fromage", name: "Bordure fromage", price: 100 },
  { id: "camembert", name: "Camembert", price: 150 },
  { id: "gruyere", name: "Gruyère", price: 150 },
  { id: "dinde-fume", name: "Dinde fumé", price: 150 },
]

export const DISHES: KitchenDish[] = [
  {
    id: "marguerite",
    title: "Pizza",
    subtitle: "MARGUERITE",
    eyebrow: "#01 Classique · 450da / 900da / 1300da",
    label: "Marguerite",
    image: margheritaImg,
    alt: "Pizza Marguerite — Sauce tomate, cheddar, mozzarella",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Classique · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella",
    ingredientsText: "Sauce tomate, cheddar, mozzarella",
    likes: 412,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella"],
    accent: "#F5B700",
    prices: { normal: 450, geante: 900, mega: 1300 },
    price: 450,
    prepMinutes: 8,
    course: "Classique",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Pâte maison étalée à la main sur plan fariné." },
      { time: "0:02", stage: "Base Tomate", detail: "Nappage généreux de sauce tomate assaisonnée." },
      { time: "0:04", stage: "Duo Fromages", detail: "Couche fondante de cheddar et mozzarella râpés." },
      { time: "0:07", stage: "Cuisson Four", detail: "Cuisson vive jusqu'à bord doré et fromage gratiné.", temp: "420°C" },
    ],
  },
  {
    id: "vegetarienne",
    title: "Pizza",
    subtitle: "VÉGÉTARIENNE",
    eyebrow: "#02 Jardin · 550da / 1200da / 1600da",
    label: "Végétarienne",
    image: verdePistacchioImg,
    alt: "Pizza Végétarienne — Sauce tomate, cheddar, mozzarella, légumes, champignons, maïs",
    rating: 4.8,
    chef: "Pizzeria Melova",
    kitchen: "Jardin · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, légumes, champignons, maïs",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, légumes, champignons, maïs",
    likes: 348,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Légumes", "Champignons", "Maïs"],
    accent: "#00A850",
    prices: { normal: 550, geante: 1200, mega: 1600 },
    price: 550,
    prepMinutes: 9,
    course: "Végétarienne",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Abaisse régulière en format Normal, Géante ou Méga." },
      { time: "0:02", stage: "Base Fromages", detail: "Sauce tomate maison, cheddar et mozzarella." },
      { time: "0:05", stage: "Garniture Jardin", detail: "Légumes frais, champignons émincés et maïs doux." },
      { time: "0:08", stage: "Cuisson Four", detail: "Four chaud pour légumes tendres et croûte croustillante.", temp: "410°C" },
    ],
  },
  {
    id: "thon",
    title: "Pizza",
    subtitle: "THON",
    eyebrow: "#03 Marine · 700da / 1300da / 1900da",
    label: "Thon",
    image: tartufoImg,
    alt: "Pizza Thon — Sauce tomate, cheddar, mozzarella, thon",
    rating: 4.8,
    chef: "Pizzeria Melova",
    kitchen: "Classique · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, thon",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, thon",
    likes: 389,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Thon"],
    accent: "#F5B700",
    prices: { normal: 700, geante: 1300, mega: 1900 },
    price: 700,
    prepMinutes: 8,
    course: "Poissons & Mer",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Pâte façonnée à la commande." },
      { time: "0:02", stage: "Base Tomate", detail: "Sauce tomate, cheddar fondant et mozzarella." },
      { time: "0:04", stage: "Thon Émietté", detail: "Généreuse garniture de thon répartie uniformément." },
      { time: "0:07", stage: "Cuisson Four", detail: "Passage rapide au four pour préserver le moelleux.", temp: "420°C" },
    ],
  },
  {
    id: "carne",
    title: "Pizza",
    subtitle: "CARNE",
    eyebrow: "#04 Bouchère · 750da / 1400da / 2000da",
    label: "Carne",
    image: diavolaImg,
    alt: "Pizza Carne — Sauce tomate, cheddar, mozzarella, viande hachée, poivron vert",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Viandes · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, viande hachée, poivron vert",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, viande hachée, poivron vert",
    likes: 465,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Viande hachée", "Poivron vert"],
    accent: "#E03A46",
    prices: { normal: 750, geante: 1400, mega: 2000 },
    price: 750,
    prepMinutes: 10,
    course: "Viandes",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Façonnage de la pâte et bordure dorée." },
      { time: "0:02", stage: "Base Tomate", detail: "Sauce tomate, cheddar et mozzarella." },
      { time: "0:05", stage: "Viande & Poivron", detail: "Viande hachée assaisonnée et lamelles de poivron vert." },
      { time: "0:09", stage: "Cuisson Four", detail: "Gratinage intense jusqu'à coloration parfaite.", temp: "420°C" },
    ],
  },
  {
    id: "poulet",
    title: "Pizza",
    subtitle: "POULET",
    eyebrow: "#05 Gourmande · 700da / 1300da / 1900da",
    label: "Poulet",
    image: verdePistacchioImg,
    alt: "Pizza Poulet — Sauce tomate, cheddar, mozzarella, poulet, gruyère",
    rating: 4.8,
    chef: "Pizzeria Melova",
    kitchen: "Viandes · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, poulet, gruyère",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, poulet, gruyère",
    likes: 430,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Poulet", "Gruyère"],
    accent: "#F5B700",
    prices: { normal: 700, geante: 1300, mega: 1900 },
    price: 700,
    prepMinutes: 9,
    course: "Viandes",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Étalage souple de la pâte artisanale." },
      { time: "0:02", stage: "Base Tomate", detail: "Sauce tomate, cheddar et mozzarella." },
      { time: "0:05", stage: "Poulet & Gruyère", detail: "Émincé de poulet tendre recouvert de gruyère." },
      { time: "0:08", stage: "Cuisson Four", detail: "Gratinée au four jusqu'à bulles dorées.", temp: "415°C" },
    ],
  },
  {
    id: "fumato",
    title: "Pizza",
    subtitle: "FUMATO",
    eyebrow: "#06 Fumée · 800da / 1400da / 2200da",
    label: "Fumato",
    image: diavolaImg,
    alt: "Pizza Fumato — Sauce tomate, cheddar, mozzarella, dinde fumé, viande hachée",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Spéciale · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, dinde fumé, viande hachée",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, dinde fumé, viande hachée",
    likes: 452,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Dinde fumé", "Viande hachée"],
    accent: "#E03A46",
    prices: { normal: 800, geante: 1400, mega: 2200 },
    price: 800,
    prepMinutes: 10,
    course: "Spécialités",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Base croustillante étirée à la main." },
      { time: "0:02", stage: "Base Tomate", detail: "Sauce tomate, cheddar fondant et mozzarella." },
      { time: "0:05", stage: "Dinde & Viande", detail: "Tranches de dinde fumée et viande hachée savoureuse." },
      { time: "0:09", stage: "Cuisson Four", detail: "Cuisson au four pour exhaler les notes fumées.", temp: "420°C" },
    ],
  },
  {
    id: "champignon",
    title: "Pizza",
    subtitle: "CHAMPIGNON",
    eyebrow: "#07 Forestière · 650da / 1100da / 1900da",
    label: "Champignon",
    image: margheritaImg,
    alt: "Pizza Champignon — Sauce tomate, cheddar, mozzarella, champignon",
    rating: 4.7,
    chef: "Pizzeria Melova",
    kitchen: "Classique · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, champignon",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, champignon",
    likes: 318,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Champignon"],
    accent: "#F5B700",
    prices: { normal: 650, geante: 1100, mega: 1900 },
    price: 650,
    prepMinutes: 8,
    course: "Classique",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Abaisse fine avec rebord aérien." },
      { time: "0:02", stage: "Base Fromages", detail: "Sauce tomate, cheddar et mozzarella." },
      { time: "0:04", stage: "Champignons", detail: "Champignons frais finement tranchés sur toute la surface." },
      { time: "0:07", stage: "Cuisson Four", detail: "Saisie rapide au four à haute température.", temp: "420°C" },
    ],
  },
  {
    id: "4-fromages",
    title: "Pizza",
    subtitle: "4 FROMAGES",
    eyebrow: "#08 Fromagère · 800da / 1500da / 2300da",
    label: "4 Fromages",
    image: quattroImg,
    alt: "Pizza 4 Fromages — Sauce tomate, cheddar, mozzarella, gruyère, camembert",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Fromages · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, gruyère, camembert",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, gruyère, camembert",
    likes: 514,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Gruyère", "Camembert"],
    accent: "#F5B700",
    prices: { normal: 800, geante: 1500, mega: 2300 },
    price: 800,
    prepMinutes: 9,
    course: "Fromages",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Pâte préparée pour supporter quatre fromages généreux." },
      { time: "0:02", stage: "Cheddar & Mozza", detail: "Base tomate nappée de cheddar et mozzarella." },
      { time: "0:05", stage: "Gruyère & Camembert", detail: "Ajout généreux de gruyère et tranches de camembert." },
      { time: "0:08", stage: "Cuisson Four", detail: "Fondu crémeux et gratinage doré à cœur.", temp: "415°C" },
    ],
  },
  {
    id: "3-viandes",
    title: "Pizza",
    subtitle: "3 VIANDES",
    eyebrow: "#09 Carnivore · 900da / 1700da / 2500da",
    label: "3 Viandes",
    image: diavolaImg,
    alt: "Pizza 3 Viandes — Sauce tomate, cheddar, mozzarella, viande hachée, merguez, poulet",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Spéciale · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, viande hachée, merguez, poulet",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, viande hachée, merguez, poulet",
    likes: 540,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Viande hachée", "Merguez", "Poulet"],
    accent: "#E03A46",
    prices: { normal: 900, geante: 1700, mega: 2500 },
    price: 900,
    prepMinutes: 11,
    course: "Viandes",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Pâte épaisse prête pour une garniture généreuse." },
      { time: "0:02", stage: "Base Fromages", detail: "Sauce tomate, cheddar et mozzarella." },
      { time: "0:05", stage: "Trio de Viandes", detail: "Viande hachée, rondelles de merguez et dés de poulet." },
      { time: "0:10", stage: "Cuisson Four", detail: "Cuisson complète et croûte bien dorée.", temp: "420°C" },
    ],
  },
  {
    id: "chef",
    title: "Pizza",
    subtitle: "CHEF",
    eyebrow: "#10 Signature · 1000da / 1800da / 2700da",
    label: "Chef",
    image: quattroImg,
    alt: "Pizza Chef — Sauce au choix, cheddar, mozzarella, tous les ingrédients",
    rating: 5.0,
    chef: "Chef Melova",
    kitchen: "Signature · Normal / Géante / Méga",
    description: "Sauce au choix, cheddar, mozzarella, tous les ingrédients",
    ingredientsText: "Sauce au choix, cheddar, mozzarella, tous les ingrédients",
    likes: 608,
    ingredients: ["Sauce au choix", "Cheddar", "Mozzarella", "Tous les ingrédients"],
    accent: "#F5B700",
    prices: { normal: 1000, geante: 1800, mega: 2700 },
    price: 1000,
    prepMinutes: 12,
    course: "Signature",
    steps: [
      { time: "0:00", stage: "Pâte Signature", detail: "Pâte pétrie pour porter la garniture complète du chef." },
      { time: "0:02", stage: "Sauce au choix", detail: "Sauce au choix selon votre envie, cheddar et mozzarella." },
      { time: "0:06", stage: "Garniture Totale", detail: "Tous les ingrédients sélectionnés par le chef Melova." },
      { time: "0:11", stage: "Cuisson Four", detail: "Cuisson maîtrisée pour un équilibre fondant et croustillant.", temp: "420°C" },
    ],
  },
  {
    id: "crevette",
    title: "Pizza",
    subtitle: "CREVETTE",
    eyebrow: "#11 Prestige · 1200da / 2000da / 3000da",
    label: "Crevette",
    image: tartufoImg,
    alt: "Pizza Crevette — Sauce tomate, cheddar, mozzarella, thon au choix, crevettes, gruyère",
    rating: 4.9,
    chef: "Pizzeria Melova",
    kitchen: "Fruits de mer · Normal / Géante / Méga",
    description: "Sauce tomate, cheddar, mozzarella, thon au choix, crevettes, gruyère",
    ingredientsText: "Sauce tomate, cheddar, mozzarella, thon au choix, crevettes, gruyère",
    likes: 492,
    ingredients: ["Sauce tomate", "Cheddar", "Mozzarella", "Thon au choix", "Crevettes", "Gruyère"],
    accent: "#00A850",
    prices: { normal: 1200, geante: 2000, mega: 3000 },
    price: 1200,
    prepMinutes: 10,
    course: "Poissons & Mer",
    steps: [
      { time: "0:00", stage: "Pâte fraîche", detail: "Pâte fine et légère étalée à la main." },
      { time: "0:02", stage: "Base Tomate", detail: "Sauce tomate, cheddar et mozzarella fondante." },
      { time: "0:05", stage: "Crevettes & Gruyère", detail: "Crevettes généreuses, thon au choix et gruyère râpé." },
      { time: "0:09", stage: "Cuisson Four", detail: "Finition dorée préservant la tendreté des crevettes.", temp: "415°C" },
    ],
  },
]
