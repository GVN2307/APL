export const recipes = [
  {
    id: 'scrambled-eggs',
    title: 'Scrambled Eggs',
    time: '5 min',
    servings: 1,
    difficulty: 'Quick',
    icon: '🥚',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdKEh4Zi8Sk7hLwjPCGMblDWq7mtGJht764q93kO9gLKG4aUvRAsuyJl3l7w8XRUojPxlStFOywps0oKExT43JvLXbyqbrTHaQ9HRkrW_LlPR2gTm8SizfPMqj8T_5BGa-tidrVlGkIj59i01h8MNd5JGn1dEr5BmTaf8QuFY72mByPVzYveTn0-TImBWOCz4jLHQViZM1ds0f2n-ueremULrcR4NkGWV-p0rMeICrzDiAZg2dmPiA6VfMEDtgn5KcxRKVsr7NRos',
    ingredients: [
      { item: 'eggs', amount: '3', unit: 'large' },
      { item: 'butter', amount: '1', unit: 'tablespoon' },
      { item: 'salt', amount: '1', unit: 'pinch' },
      { item: 'black pepper', amount: '1', unit: 'pinch' }
    ],
    steps: [
      { id: 1, text: 'Crack 3 eggs into a bowl. Add a pinch of salt and pepper.', duration: null, note: null },
      { id: 2, text: 'Whisk the eggs until the yolks and whites are fully combined. About 30 seconds.', duration: 30, note: "Don't over-beat" },
      { id: 3, text: 'Melt butter in a non-stick pan over medium-low heat.', duration: 60, note: 'Low heat is key to prevent browning too quickly' },
      { id: 4, text: 'Pour in the eggs. Let them sit for a few seconds until edges start to set.', duration: 15, note: null },
      { id: 5, text: 'Gently stir with a spatula, pulling from edges to center. Repeat until soft curds form.', duration: 120, note: 'Keep it moving' },
      { id: 6, text: 'Remove from heat while still slightly wet. They will continue cooking. Serve immediately.', duration: null, note: 'Better underdone than overdone' }
    ]
  },
  {
    id: 'pasta-aglio',
    title: 'Pasta Aglio e Olio',
    time: '15 min',
    servings: 2,
    difficulty: 'Classic',
    icon: '🍝',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsyfyasvItyJi_JkpoZ2Gtqh7XYcwPNNCDrOwcvL46tqR7A5L1AK3h5Q2xhPy_0efVWIojtOqwOVsHYH66Rv3N7rqvar0yPUEbjo2J-BmiodeY5xxN678cbylCi9py9W8zgo3-oE8-Vp-rFaFUHIWV6uIHZo6YqGsJiFff6HyX-ThshiVcmwK-Ci6ev4ZDwTSKkCzJ1IqI9NMG7gnbFXOkeqK8n9VU6HKJvmDIQpn98MGyBWn8RE-IJz3U-IeUvdsm9LXD0x4Yj80',
    ingredients: [
      { item: 'spaghetti', amount: '400', unit: 'grams' },
      { item: 'garlic', amount: '6', unit: 'cloves' },
      { item: 'olive oil', amount: '1/2', unit: 'cup' },
      { item: 'red pepper flakes', amount: '1', unit: 'teaspoon' },
      { item: 'parsley', amount: '1/4', unit: 'cup chopped' }
    ],
    steps: [
      { id: 1, text: 'Bring a large pot of salted water to a boil. Add the spaghetti.', duration: 480, note: 'Salt the water well' },
      { id: 2, text: 'While pasta cooks, thinly slice 6 cloves of garlic.', duration: null, note: null },
      { id: 3, text: 'Heat olive oil in a large pan over medium heat. Add garlic and red pepper flakes.', duration: 120, note: "Don't let garlic brown" },
      { id: 4, text: 'Cook garlic until golden, about 2 minutes. Add a ladle of pasta water.', duration: 120, note: 'Pasta water is liquid gold' },
      { id: 5, text: 'Transfer pasta directly into the pan. Toss vigorously for 1 minute.', duration: 60, note: 'The tossing is the secret' },
      { id: 6, text: 'Remove from heat. Add chopped parsley. Toss once more. Serve immediately.', duration: null, note: 'Finish with more olive oil if desired' }
    ]
  }
];

export const substitutions = {
  'butter': ['olive oil', 'coconut oil'],
  'olive oil': ['vegetable oil', 'avocado oil'],
  'eggs': ['tofu scramble for vegan'],
  'parsley': ['basil', 'cilantro'],
  'spaghetti': ['linguine', 'fettuccine', 'any long pasta']
};
