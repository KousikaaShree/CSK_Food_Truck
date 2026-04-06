export const CUSTOMIZATION_RULES = {
  Shawarma: [
    { id: 'plateShawarma', name: 'Plate Shawarma', price: 30 },
    { id: 'extraKuboos', name: 'Extra Kuboos', price: 15 }
  ],
  Barbeque: [
    { id: 'extraKuboos', name: 'Extra Kuboos', price: 15 }
  ],
  Kebab: [],
  Desert: []
};

export const getCustomizationsForCategory = (category) => {
  return CUSTOMIZATION_RULES[category] || [];
};
