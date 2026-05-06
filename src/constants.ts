import { SeatingArea } from './types';

export const SEATING_AREAS: SeatingArea[] = [
  {
    id: 'main-hall',
    name: 'Historic Main Hall',
    description: 'Immerse yourself in history. The grand hall features original wooden beams, crystal chandeliers, and a massive stone fireplace.',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
    order: 1
  },
  {
    id: 'garden-terrace',
    name: 'Heirloom Garden',
    description: 'Al fresco dining at its finest. Surrounded by climbing ivy, heirloom herb gardens, and soft fairy lights.',
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
    order: 2
  },
  {
    id: 'vaulted-cellar',
    name: 'The Vaulted Cellar',
    description: 'An intimate, dimly lit space with brick-vaulted ceilings. Perfect for small gatherings and wine enthusiasts.',
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80',
    order: 3
  }
];

export const MENU_CATEGORIES = ['Appetizers', 'Heritage Mains', 'Sides', 'Crafted Desserts', 'Classic Cocktails'];

export const MENU_ITEMS = [
  {
    category: 'Heritage Mains',
    name: 'Slow-Roasted Lamb Shank',
    description: '12-hour braised lamb, heritage root vegetables, red wine reduction.',
    price: '$38'
  },
  {
    category: 'Heritage Mains',
    name: 'Wild Forest Risotto',
    description: 'Foraged mushrooms, truffle butter, aged parmesan, fresh thyme.',
    price: '$32'
  },
  {
    category: 'Appetizers',
    name: 'Bone Marrow on Sourdough',
    description: 'Roasted marrow, gremolata, sea salt, thick-cut heritage bread.',
    price: '$21'
  },
  {
    category: 'Crafted Desserts',
    name: 'Spiced Plum Tart',
    description: 'Heritage plums, vanilla bean custard, honey glaze.',
    price: '$16'
  }
];
