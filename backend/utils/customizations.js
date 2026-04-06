const CUSTOMIZATION_RULES = {
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

const getCustomizationsForCategory = (category) => {
  return CUSTOMIZATION_RULES[category] || [];
};

module.exports = {
  CUSTOMIZATION_RULES,
  getCustomizationsForCategory
};
