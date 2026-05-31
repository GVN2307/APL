#!/usr/bin/env python3
import json
import re
import random
import sys

# Define 20 static fallback recipes in case HuggingFace download fails or datasets package is missing
FALLBACK_RECIPES = [
  {
    "id": "scrambled-eggs",
    "title": "Scrambled Eggs",
    "time": "15 min",
    "servings": 2,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🥚",
    "ingredients": [
      { "item": "large eggs", "amount": "4", "unit": "" },
      { "item": "butter", "amount": "2", "unit": "tbsp" },
      { "item": "salt", "amount": "1/4", "unit": "tsp" },
      { "item": "black pepper", "amount": "1/4", "unit": "tsp" },
      { "item": "chives", "amount": "1", "unit": "tbsp" }
    ],
    "steps": [
      { "id": 1, "text": "Crack eggs into a bowl and whisk thoroughly until yolks and whites are fully blended.", "duration": 30, "note": "Whisk well for fluffiness" },
      { "id": 2, "text": "Melt butter in a non-stick pan over medium-low heat.", "duration": 60, "note": "Low heat prevents browning" },
      { "id": 3, "text": "Pour in the whisked eggs and let them cook undisturbed for 15 seconds.", "duration": 15, "note": "Let the edges set" },
      { "id": 4, "text": "Gently stir the eggs from the edges to the center using a spatula to form large curds.", "duration": 120, "note": "Keep stirring slowly" },
      { "id": 5, "text": "Garnish with freshly chopped chives, sprinkle salt and pepper, and serve immediately while hot.", "duration": None, "note": "Serve immediately" }
    ],
    "substitutions": {
      "butter": ["olive oil", "coconut oil"],
      "eggs": ["tofu scramble"],
      "chives": ["parsley"]
    }
  },
  {
    "id": "pasta-aglio",
    "title": "Pasta Aglio e Olio",
    "time": "20 min",
    "servings": 4,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🍝",
    "ingredients": [
      { "item": "spaghetti", "amount": "400", "unit": "g" },
      { "item": "garlic", "amount": "6", "unit": "cloves" },
      { "item": "olive oil", "amount": "1/3", "unit": "cup" },
      { "item": "red pepper flakes", "amount": "1/2", "unit": "tsp" },
      { "item": "parsley", "amount": "1/4", "unit": "cup" },
      { "item": "parmesan", "amount": "1/4", "unit": "cup" }
    ],
    "steps": [
      { "id": 1, "text": "Boil spaghetti in salted boiling water until al dente.", "duration": 480, "note": "Reserve 1 cup of pasta water before draining" },
      { "id": 2, "text": "Thinly slice garlic cloves and chop fresh parsley.", "duration": 120, "note": "Thin garlic slices brown evenly" },
      { "id": 3, "text": "Heat olive oil in a large pan, add garlic and red pepper flakes, cooking until garlic is golden.", "duration": 120, "note": "Do not let garlic burn" },
      { "id": 4, "text": "Add a ladle of pasta water, then toss spaghetti in garlic oil.", "duration": 60, "note": "Creates a perfect glossy emulsion" },
      { "id": 5, "text": "Stir in parsley and grated parmesan cheese, and serve hot.", "duration": None, "note": "Finish with olive oil" }
    ],
    "substitutions": {
      "olive oil": ["vegetable oil"],
      "parsley": ["basil"],
      "parmesan": ["pecorino"]
    }
  },
  {
    "id": "chicken-stir-fry",
    "title": "Chicken Stir Fry",
    "time": "25 min",
    "servings": 3,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🍗",
    "ingredients": [
      { "item": "chicken breast", "amount": "500", "unit": "g" },
      { "item": "soy sauce", "amount": "3", "unit": "tbsp" },
      { "item": "ginger", "amount": "1", "unit": "tbsp" },
      { "item": "garlic", "amount": "3", "unit": "cloves" },
      { "item": "vegetable oil", "amount": "2", "unit": "tbsp" },
      { "item": "broccoli", "amount": "2", "unit": "cups" },
      { "item": "bell pepper", "amount": "1", "unit": "large" }
    ],
    "steps": [
      { "id": 1, "text": "Cut chicken breast into bite-sized pieces and marinate with soy sauce and ginger.", "duration": 300, "note": "Chop veggies during marination" },
      { "id": 2, "text": "Heat vegetable oil in a large wok over high heat.", "duration": 60, "note": "Wok must be hot" },
      { "id": 3, "text": "Sear marinated chicken until cooked through and golden brown.", "duration": 300, "note": "Do not overcrowd the wok" },
      { "id": 4, "text": "Stir fry sliced bell pepper and broccoli florets until tender-crisp.", "duration": 180, "note": "Keep stir frying continuously" },
      { "id": 5, "text": "Combine chicken and vegetables in the wok, drizzle extra soy sauce, and serve.", "duration": None, "note": "Serve with warm rice" }
    ],
    "substitutions": {
      "soy sauce": ["tamari", "coconut aminos"],
      "chicken": ["tofu", "tempeh"],
      "broccoli": ["cauliflower"]
    }
  },
  {
    "id": "tomato-soup",
    "title": "Creamy Tomato Soup",
    "time": "35 min",
    "servings": 4,
    "difficulty": "Easy",
    "category": "Soup",
    "icon": "🍲",
    "ingredients": [
      { "item": "tomatoes", "amount": "6", "unit": "large" },
      { "item": "onion", "amount": "1", "unit": "medium" },
      { "item": "garlic", "amount": "3", "unit": "cloves" },
      { "item": "vegetable broth", "amount": "4", "unit": "cups" },
      { "item": "heavy cream", "amount": "1/2", "unit": "cup" },
      { "item": "basil", "amount": "1/4", "unit": "cup" }
    ],
    "steps": [
      { "id": 1, "text": "Chop onion, mince garlic, and dice fresh tomatoes.", "duration": 300, "note": "Tomatoes don't have to be peeled" },
      { "id": 2, "text": "Saute chopped onion and minced garlic in a pot with olive oil until soft.", "duration": 300, "note": "Onion turns translucent" },
      { "id": 3, "text": "Add diced tomatoes and vegetable broth, then simmer for 15 minutes.", "duration": 900, "note": "Simmer on low heat" },
      { "id": 4, "text": "Blend the soup using an immersion blender until completely smooth.", "duration": 120, "note": "Be careful with hot liquid" },
      { "id": 5, "text": "Stir in heavy cream and chopped basil, simmer 2 more minutes, and serve.", "duration": None, "note": "Excellent with grilled cheese" }
    ],
    "substitutions": {
      "heavy cream": ["coconut cream"],
      "basil": ["oregano"],
      "broth": ["chicken broth"]
    }
  },
  {
    "id": "caesar-salad",
    "title": "Classic Caesar Salad",
    "time": "15 min",
    "servings": 2,
    "difficulty": "Easy",
    "category": "Salad",
    "icon": "🥗",
    "ingredients": [
      { "item": "romaine lettuce", "amount": "2", "unit": "heads" },
      { "item": "parmesan", "amount": "1/2", "unit": "cup" },
      { "item": "croutons", "amount": "1", "unit": "cup" },
      { "item": "anchovy fillets", "amount": "4", "unit": "" },
      { "item": "garlic", "amount": "1", "unit": "clove" },
      { "item": "lemon juice", "amount": "2", "unit": "tbsp" },
      { "item": "olive oil", "amount": "1/3", "unit": "cup" },
      { "item": "egg yolk", "amount": "1", "unit": "large" }
    ],
    "steps": [
      { "id": 1, "text": "Wash romaine lettuce, dry thoroughly, and tear into bite-sized pieces.", "duration": 180, "note": "Wet lettuce ruins dressing" },
      { "id": 2, "text": "Mash anchovy fillets and garlic into a smooth paste in a small bowl.", "duration": 120, "note": "Use a fork to mash" },
      { "id": 3, "text": "Whisk egg yolk, lemon juice, anchovy paste, and slowly drizzle olive oil to emulsify.", "duration": 180, "note": "Whisk vigorously" },
      { "id": 4, "text": "Toss romaine lettuce with the prepared dressing until evenly coated.", "duration": 60, "note": "Toss gently" },
      { "id": 5, "text": "Top with grated parmesan and crispy croutons before serving.", "duration": None, "note": "Add fresh black pepper" }
    ],
    "substitutions": {
      "anchovy": ["Worcestershire sauce"],
      "egg yolk": ["mayonnaise"],
      "romaine": ["kale"]
    }
  },
  {
    "id": "chocolate-chip-cookies",
    "title": "Chocolate Chip Cookies",
    "time": "30 min",
    "servings": 12,
    "difficulty": "Medium",
    "category": "Dessert",
    "icon": "🍪",
    "ingredients": [
      { "item": "butter", "amount": "1", "unit": "cup" },
      { "item": "sugar", "amount": "3/4", "unit": "cup" },
      { "item": "brown sugar", "amount": "3/4", "unit": "cup" },
      { "item": "eggs", "amount": "2", "unit": "large" },
      { "item": "vanilla extract", "amount": "2", "unit": "tsp" },
      { "item": "flour", "amount": "2 1/4", "unit": "cups" },
      { "item": "baking soda", "amount": "1", "unit": "tsp" },
      { "item": "chocolate chips", "amount": "2", "unit": "cups" }
    ],
    "steps": [
      { "id": 1, "text": "Preheat oven to 375°F (190°C) and line baking sheets.", "duration": 300, "note": "Ensures even baking" },
      { "id": 2, "text": "Cream softened butter, white sugar, and brown sugar together until light and fluffy.", "duration": 300, "note": "Cream for about 3 minutes" },
      { "id": 3, "text": "Add eggs one at a time, whisking in the vanilla extract.", "duration": 120, "note": "Fully incorporate" },
      { "id": 4, "text": "Stir in flour, baking soda, and fold in sweet chocolate chips.", "duration": 180, "note": "Do not overmix flour" },
      { "id": 5, "text": "Drop spoonfuls of dough onto sheets, bake 10 minutes until golden, and cool.", "duration": 600, "note": "Let cool on a wire rack" }
    ],
    "substitutions": {
      "butter": ["coconut oil"],
      "eggs": ["flax eggs"],
      "chocolate chips": ["chopped dark chocolate"]
    }
  },
  {
    "id": "sourdough-bread",
    "title": "Simple Sourdough Bread",
    "time": "45 min",
    "servings": 8,
    "difficulty": "Advanced",
    "category": "Bakery",
    "icon": "🍞",
    "ingredients": [
      { "item": "sourdough starter", "amount": "100", "unit": "g" },
      { "item": "bread flour", "amount": "400", "unit": "g" },
      { "item": "water", "amount": "250", "unit": "ml" },
      { "item": "salt", "amount": "8", "unit": "g" }
    ],
    "steps": [
      { "id": 1, "text": "Mix flour and water and let sit for 30 minutes to autolyse.", "duration": 1800, "note": "Autolysing develops gluten structure" },
      { "id": 2, "text": "Incorporate sourdough starter and salt, knead until smooth, and bulk ferment.", "duration": 14400, "note": "Ferment at room temperature" },
      { "id": 3, "text": "Perform stretch and folds every 30 minutes for 2 hours.", "duration": 7200, "note": "Builds dough tension" },
      { "id": 4, "text": "Shape dough into a round boule and proof in basket overnight in the fridge.", "duration": 43200, "note": "Develops deep sourdough flavor" },
      { "id": 5, "text": "Score the loaf and bake in a preheated Dutch oven covered, then uncovered.", "duration": 2700, "note": "Bake covered for steam crust" }
    ],
    "substitutions": {
      "bread flour": ["all-purpose flour"],
      "sourdough starter": ["instant yeast (7g) + yogurt (50g)"]
    }
  },
  {
    "id": "beef-tacos",
    "title": "Spicy Beef Tacos",
    "time": "25 min",
    "servings": 4,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🌮",
    "ingredients": [
      { "item": "ground beef", "amount": "500", "unit": "g" },
      { "item": "taco seasoning", "amount": "2", "unit": "tbsp" },
      { "item": "onion", "amount": "1", "unit": "medium" },
      { "item": "garlic", "amount": "2", "unit": "cloves" },
      { "item": "tomato paste", "amount": "2", "unit": "tbsp" },
      { "item": "tortillas", "amount": "8", "unit": "small" },
      { "item": "cheddar cheese", "amount": "1", "unit": "cup" }
    ],
    "steps": [
      { "id": 1, "text": "Finely dice onion and mince garlic cloves.", "duration": 180, "note": "Preheat frying pan" },
      { "id": 2, "text": "Brown the ground beef in a pan, draining any excess grease.", "duration": 360, "note": "Break beef into small crumbles" },
      { "id": 3, "text": "Add taco seasoning, diced onion, garlic, and tomato paste with a splash of water.", "duration": 300, "note": "Let seasonings absorb" },
      { "id": 4, "text": "Warm tortillas in a dry skillet for 30 seconds on each side.", "duration": 120, "note": "Keeps tortillas soft" },
      { "id": 5, "text": "Assemble tacos with spicy beef, grated cheddar cheese, and fresh toppings.", "duration": None, "note": "Serve with hot sauce" }
    ],
    "substitutions": {
      "ground beef": ["ground turkey", "black beans"],
      "cheddar cheese": ["monterey jack"]
    }
  },
  {
    "id": "mushroom-risotto",
    "title": "Creamy Mushroom Risotto",
    "time": "40 min",
    "servings": 3,
    "difficulty": "Medium",
    "category": "Main",
    "icon": "🍚",
    "ingredients": [
      { "item": "arborio rice", "amount": "1.5", "unit": "cups" },
      { "item": "mushrooms", "amount": "300", "unit": "g" },
      { "item": "vegetable broth", "amount": "6", "unit": "cups" },
      { "item": "white wine", "amount": "1/2", "unit": "cup" },
      { "item": "onion", "amount": "1", "unit": "medium" },
      { "item": "parmesan", "amount": "1/2", "unit": "cup" },
      { "item": "butter", "amount": "3", "unit": "tbsp" }
    ],
    "steps": [
      { "id": 1, "text": "Keep vegetable broth warm in a separate saucepan over low heat.", "duration": 180, "note": "Adding cold broth slows cooking" },
      { "id": 2, "text": "Saute sliced mushrooms in a large pan with olive oil until brown.", "duration": 300, "note": "Set mushrooms aside" },
      { "id": 3, "text": "Saute diced onion, add arborio rice, and toast for 2 minutes.", "duration": 240, "note": "Rice turns slightly translucent" },
      { "id": 4, "text": "Pour in white wine, stirring constantly until completely absorbed.", "duration": 180, "note": "Wine deglazes the pan" },
      { "id": 5, "text": "Add warm broth ladle by ladle, stirring continuously until rice is creamy and tender.", "duration": 1200, "note": "Stirring releases starches" },
      { "id": 6, "text": "Stir in the cooked mushrooms, butter, and grated parmesan cheese.", "duration": None, "note": "Let rest for 2 minutes before serving" }
    ],
    "substitutions": {
      "white wine": ["extra broth + lemon juice"],
      "arborio rice": ["carnaroli rice"],
      "mushrooms": ["zucchini"]
    }
  },
  {
    "id": "greek-yogurt-parfait",
    "title": "Greek Yogurt Parfait",
    "time": "5 min",
    "servings": 1,
    "difficulty": "Easy",
    "category": "Dessert",
    "icon": "🍨",
    "ingredients": [
      { "item": "Greek yogurt", "amount": "1", "unit": "cup" },
      { "item": "granola", "amount": "1/4", "unit": "cup" },
      { "item": "mixed berries", "amount": "1/2", "unit": "cup" },
      { "item": "honey", "amount": "1", "unit": "tbsp" },
      { "item": "chia seeds", "amount": "1", "unit": "tsp" }
    ],
    "steps": [
      { "id": 1, "text": "Add half of the Greek yogurt to the bottom of a glass bowl or jar.", "duration": 30, "note": "Create clean visual layers" },
      { "id": 2, "text": "Layer half of the granola and mixed berries over the yogurt.", "duration": 30, "note": "Use fresh berries if available" },
      { "id": 3, "text": "Repeat layers with the remaining Greek yogurt, granola, and berries.", "duration": 30, "note": "Tamp down layers slightly" },
      { "id": 4, "text": "Drizzle honey over the top layer and sprinkle with chia seeds before serving.", "duration": None, "note": "Eat immediately to keep granola crunchy" }
    ],
    "substitutions": {
      "Greek yogurt": ["coconut yogurt"],
      "honey": ["maple syrup"],
      "granola": ["muesli"]
    }
  },
  {
    "id": "french-onion-soup",
    "title": "French Onion Soup",
    "time": "50 min",
    "servings": 4,
    "difficulty": "Medium",
    "category": "Soup",
    "icon": "🧅",
    "ingredients": [
      { "item": "yellow onions", "amount": "4", "unit": "large" },
      { "item": "butter", "amount": "3", "unit": "tbsp" },
      { "item": "beef broth", "amount": "6", "unit": "cups" },
      { "item": "white wine", "amount": "1/2", "unit": "cup" },
      { "item": "thyme", "amount": "3", "unit": "sprigs" },
      { "item": "baguette", "amount": "4", "unit": "slices" },
      { "item": "gruyere cheese", "amount": "1.5", "unit": "cups" }
    ],
    "steps": [
      { "id": 1, "text": "Slice yellow onions thinly from root to stem.", "duration": 300, "note": "Lots of onions—they cook down significantly" },
      { "id": 2, "text": "Melt butter in a large pot and cook onions slowly on low heat for 35 minutes until dark brown and caramelized.", "duration": 2100, "note": "Patience is key for sweet caramelization" },
      { "id": 3, "text": "Deglaze the pot with white wine, scraping up all browned bits.", "duration": 120, "note": "Adds crucial acidity" },
      { "id": 4, "text": "Add beef broth and thyme sprigs, simmer for 15 minutes.", "duration": 900, "note": "Discard thyme sprigs before serving" },
      { "id": 5, "text": "Ladle soup into oven-safe bowls, float toasted baguette slices on top, cover with grated gruyere cheese, and broil until bubbly.", "duration": 180, "note": "Broil under high heat" }
    ],
    "substitutions": {
      "gruyere cheese": ["swiss cheese", "mozzarella"],
      "white wine": ["sherry"],
      "beef broth": ["vegetable broth"]
    }
  },
  {
    "id": "avocado-toast",
    "title": "Ultimate Avocado Toast",
    "time": "10 min",
    "servings": 1,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🥑",
    "ingredients": [
      { "item": "sourdough bread", "amount": "2", "unit": "slices" },
      { "item": "avocado", "amount": "1", "unit": "large" },
      { "item": "lemon juice", "amount": "1", "unit": "tsp" },
      { "item": "red pepper flakes", "amount": "1/4", "unit": "tsp" },
      { "item": "sea salt", "amount": "1/4", "unit": "tsp" },
      { "item": "olive oil", "amount": "1", "unit": "tsp" }
    ],
    "steps": [
      { "id": 1, "text": "Toast sourdough slices until crisp and golden brown.", "duration": 120, "note": "Thicker slices hold avocado better" },
      { "id": 2, "text": "Halve and mash the ripe avocado in a bowl with lemon juice and salt.", "duration": 120, "note": "Leave some texture" },
      { "id": 3, "text": "Spread mashed avocado evenly across the toasted bread.", "duration": 60, "note": "Spread all the way to edges" },
      { "id": 4, "text": "Sprinkle red pepper flakes, drizzle extra virgin olive oil, and serve immediately.", "duration": None, "note": "Top with a poached egg if desired" }
    ],
    "substitutions": {
      "sourdough": ["whole grain bread"],
      "avocado": ["hummus"],
      "lemon juice": ["lime juice"]
    }
  },
  {
    "id": "pancakes",
    "title": "Fluffy Buttermilk Pancakes",
    "time": "20 min",
    "servings": 3,
    "difficulty": "Easy",
    "category": "Bakery",
    "icon": "🥞",
    "ingredients": [
      { "item": "flour", "amount": "2", "unit": "cups" },
      { "item": "buttermilk", "amount": "2", "unit": "cups" },
      { "item": "eggs", "amount": "2", "unit": "large" },
      { "item": "butter", "amount": "3", "unit": "tbsp" },
      { "item": "sugar", "amount": "2", "unit": "tbsp" },
      { "item": "baking powder", "amount": "2", "unit": "tsp" },
      { "item": "vanilla extract", "amount": "1", "unit": "tsp" }
    ],
    "steps": [
      { "id": 1, "text": "Whisk flour, sugar, and baking powder in a large bowl.", "duration": 120, "note": "Ensures even rise" },
      { "id": 2, "text": "Whisk buttermilk, eggs, melted butter, and vanilla in a separate bowl.", "duration": 120, "note": "Mix thoroughly" },
      { "id": 3, "text": "Fold wet ingredients into dry ingredients gently, leaving small lumps.", "duration": 60, "note": "Overmixing makes pancakes dense" },
      { "id": 4, "text": "Heat a greased griddle over medium heat, drop batter, and flip when bubbles form.", "duration": 480, "note": "Flip only once" },
      { "id": 5, "text": "Serve hot stacks with a pat of butter and maple syrup.", "duration": None, "note": "Add chocolate chips or blueberries if desired" }
    ],
    "substitutions": {
      "buttermilk": ["milk + lemon juice"],
      "eggs": ["flax eggs"],
      "butter": ["vegetable oil"]
    }
  },
  {
    "id": "shrimp-scampi",
    "title": "Lemon Garlic Shrimp Scampi",
    "time": "20 min",
    "servings": 3,
    "difficulty": "Easy",
    "category": "Main",
    "icon": "🍤",
    "ingredients": [
      { "item": "shrimp", "amount": "500", "unit": "g" },
      { "item": "linguine", "amount": "300", "unit": "g" },
      { "item": "butter", "amount": "4", "unit": "tbsp" },
      { "item": "garlic", "amount": "4", "unit": "cloves" },
      { "item": "lemon juice", "amount": "3", "unit": "tbsp" },
      { "item": "white wine", "amount": "1/4", "unit": "cup" },
      { "item": "parsley", "amount": "1/4", "unit": "cup" }
    ],
    "steps": [
      { "id": 1, "text": "Boil linguine in salted boiling water until al dente.", "duration": 540, "note": "Drain and toss with oil to avoid sticking" },
      { "id": 2, "text": "Melt butter in a large skillet, add minced garlic, and saute for 1 minute.", "duration": 60, "note": "Mouthwatering garlic aroma" },
      { "id": 3, "text": "Add peeled shrimp and cook until they turn pink on both sides.", "duration": 180, "note": "Cook shrimp for only 3 minutes" },
      { "id": 4, "text": "Pour in white wine and lemon juice, simmering for 2 minutes.", "duration": 120, "note": "Reduces down into a rich sauce" },
      { "id": 5, "text": "Toss hot linguine and chopped fresh parsley in the scampi sauce, and serve.", "duration": None, "note": "Top with lemon zest" }
    ],
    "substitutions": {
      "shrimp": ["chicken strips"],
      "linguine": ["spaghetti"],
      "white wine": ["chicken broth + lemon juice"]
    }
  },
  {
    "id": "caprese-salad",
    "title": "Classic Caprese Salad",
    "time": "10 min",
    "servings": 2,
    "difficulty": "Easy",
    "category": "Salad",
    "icon": "🍅",
    "ingredients": [
      { "item": "tomatoes", "amount": "3", "unit": "large" },
      { "item": "fresh mozzarella", "amount": "200", "unit": "g" },
      { "item": "fresh basil", "amount": "1", "unit": "bunch" },
      { "item": "balsamic glaze", "amount": "2", "unit": "tbsp" },
      { "item": "olive oil", "amount": "2", "unit": "tbsp" },
      { "item": "sea salt", "amount": "1/2", "unit": "tsp" }
    ],
    "steps": [
      { "id": 1, "text": "Slice fresh tomatoes and fresh mozzarella into thick rounds.", "duration": 120, "note": "Thicker slices look premium" },
      { "id": 2, "text": "Arrange alternating tomato and mozzarella slices on a serving platter.", "duration": 120, "note": "Overlapping style is classic" },
      { "id": 3, "text": "Tuck fresh whole basil leaves between the tomato and cheese slices.", "duration": 60, "note": "Use fresh green leaves" },
      { "id": 4, "text": "Drizzle olive oil and balsamic glaze over the arranged salad, season with sea salt, and serve.", "duration": None, "note": "Serve at room temperature" }
    ],
    "substitutions": {
      "mozzarella": ["burrata", "feta"],
      "balsamic glaze": ["balsamic vinegar + honey"],
      "tomatoes": ["heirloom tomatoes"]
    }
  },
  {
    "id": "beef-bourguignon",
    "title": "French Beef Bourguignon",
    "time": "3 hr",
    "servings": 6,
    "difficulty": "Advanced",
    "category": "Main",
    "icon": "🥩",
    "ingredients": [
      { "item": "beef chuck", "amount": "1", "unit": "kg" },
      { "item": "red wine", "amount": "750", "unit": "ml" },
      { "item": "beef broth", "amount": "2", "unit": "cups" },
      { "item": "bacon", "amount": "200", "unit": "g" },
      { "item": "pearl onions", "amount": "20", "unit": "whole" },
      { "item": "mushrooms", "amount": "300", "unit": "g" },
      { "item": "carrots", "amount": "3", "unit": "medium" },
      { "item": "tomato paste", "amount": "2", "unit": "tbsp" }
    ],
    "steps": [
      { "id": 1, "text": "Crisp chopped bacon in a large Dutch oven and set bacon pieces aside.", "duration": 300, "note": "Reserve bacon fat in pot" },
      { "id": 2, "text": "Sear cubes of beef chuck in hot bacon fat until brown on all sides.", "duration": 600, "note": "Sear in batches" },
      { "id": 3, "text": "Saute carrots and pearl onions, stir in tomato paste, and add beef back.", "duration": 300, "note": "Stir well" },
      { "id": 4, "text": "Pour in red wine and beef broth, cover and simmer slowly for 2.5 hours.", "duration": 9000, "note": "Low simmer makes beef tender" },
      { "id": 5, "text": "Fold in sauteed mushrooms, simmer uncovered 15 more minutes, top with cooked bacon, and serve.", "duration": 900, "note": "Serve with mashed potatoes" }
    ],
    "substitutions": {
      "beef chuck": ["short ribs"],
      "red wine": ["beef broth + vinegar"],
      "bacon": ["pancetta"]
    }
  },
  {
    "id": "tiramisu",
    "title": "Classic Tiramisu",
    "time": "30 min",
    "servings": 8,
    "difficulty": "Medium",
    "category": "Dessert",
    "icon": "🍰",
    "ingredients": [
      { "item": "mascarpone", "amount": "500", "unit": "g" },
      { "item": "espresso", "amount": "1.5", "unit": "cups" },
      { "item": "ladyfingers", "amount": "40", "unit": "cookies" },
      { "item": "eggs", "amount": "4", "unit": "large" },
      { "item": "sugar", "amount": "1/2", "unit": "cup" },
      { "item": "cocoa powder", "amount": "2", "unit": "tbsp" },
      { "item": "marsala wine", "amount": "2", "unit": "tbsp" }
    ],
    "steps": [
      { "id": 1, "text": "Brew strong espresso and let cool in a wide shallow dish.", "duration": 600, "note": "Add marsala wine to coffee" },
      { "id": 2, "text": "Beat egg yolks and sugar until thick and pale, then fold in mascarpone.", "duration": 300, "note": "Blend until silky" },
      { "id": 3, "text": "Whip egg whites until stiff peaks form, and fold gently into mascarpone mix.", "duration": 300, "note": "Folds make cream light" },
      { "id": 4, "text": "Quickly dip ladyfingers into cooled espresso and layer tightly in a pan.", "duration": 300, "note": "Do not soak ladyfingers—they get mushy" },
      { "id": 5, "text": "Spread half of mascarpone cream over ladyfingers, repeat layers, chill 4 hours, and dust with cocoa.", "duration": 14400, "note": "Chill thoroughly to set" }
    ],
    "substitutions": {
      "mascarpone": ["cream cheese + heavy cream"],
      "marsala": ["dark rum"],
      "ladyfingers": ["sponge cake"]
    }
  },
  {
    "id": "vegetable-curry",
    "title": "Thai Vegetable Curry",
    "time": "30 min",
    "servings": 4,
    "difficulty": "Easy",
    "category": "Soup",
    "icon": "🍲",
    "ingredients": [
      { "item": "coconut milk", "amount": "2", "unit": "cans" },
      { "item": "red curry paste", "amount": "3", "unit": "tbsp" },
      { "item": "tofu", "amount": "300", "unit": "g" },
      { "item": "bell pepper", "amount": "2", "unit": "large" },
      { "item": "snap peas", "amount": "1", "unit": "cup" },
      { "item": "bamboo shoots", "amount": "1", "unit": "can" },
      { "item": "fish sauce", "amount": "2", "unit": "tbsp" },
      { "item": "lime juice", "amount": "2", "unit": "tbsp" }
    ],
    "steps": [
      { "id": 1, "text": "Press and cube tofu, and slice bell peppers.", "duration": 180, "note": "Remove excess moisture from tofu" },
      { "id": 2, "text": "Fry red curry paste in coconut cream in a hot pot for 2 minutes.", "duration": 120, "note": "Releases aromatic spice oils" },
      { "id": 3, "text": "Stir in remaining coconut milk, fish sauce, cubed tofu, bell peppers, and bamboo shoots.", "duration": 180, "note": "Mix well" },
      { "id": 4, "text": "Simmer for 10 minutes on low heat, then fold in snap peas.", "duration": 600, "note": "Simmer gently" },
      { "id": 5, "text": "Remove from heat, stir in fresh lime juice, and serve hot over rice.", "duration": None, "note": "Garnish with fresh thai basil" }
    ],
    "substitutions": {
      "fish sauce": ["soy sauce"],
      "tofu": ["chicken strips"],
      "red curry paste": ["green curry paste"]
    }
  },
  {
    "id": "bagels",
    "title": "Homemade Bagels",
    "time": "2 hr",
    "servings": 6,
    "difficulty": "Advanced",
    "category": "Bakery",
    "icon": "🥖",
    "ingredients": [
      { "item": "bread flour", "amount": "4", "unit": "cups" },
      { "item": "water", "amount": "1.33", "unit": "cups" },
      { "item": "yeast", "amount": "2.25", "unit": "tsp" },
      { "item": "sugar", "amount": "2", "unit": "tbsp" },
      { "item": "salt", "amount": "2", "unit": "tsp" },
      { "item": "baking soda", "amount": "1", "unit": "tbsp" },
      { "item": "egg", "amount": "1", "unit": "large" }
    ],
    "steps": [
      { "id": 1, "text": "Knead bread flour, water, yeast, sugar, and salt together until stiff dough forms.", "duration": 600, "note": "Dough should be firm" },
      { "id": 2, "text": "Let the dough rise covered in a warm spot for 1 hour.", "duration": 3600, "note": "Dough will double in size" },
      { "id": 3, "text": "Punch down dough, divide into 6 portions, and shape into bagel rings.", "duration": 600, "note": "Let shaped bagels rest 10 minutes" },
      { "id": 4, "text": "Boil bagels in boiling water with baking soda for 1 minute on each side.", "duration": 120, "note": "Boiling gives bagels their signature chew" },
      { "id": 5, "text": "Brush bagels with whisked egg wash, apply toppings, and bake 20 minutes until dark golden.", "duration": 1200, "note": "Bake at 425°F (220°C)" }
    ],
    "substitutions": {
      "bread flour": ["all-purpose flour + wheat gluten"],
      "egg": ["milk"]
    }
  },
  {
    "id": "smoothie-bowl",
    "title": "Acai Smoothie Bowl",
    "time": "10 min",
    "servings": 1,
    "difficulty": "Easy",
    "category": "Dessert",
    "icon": "🫐",
    "ingredients": [
      { "item": "frozen acai puree", "amount": "1", "unit": "packet" },
      { "item": "frozen banana", "amount": "1", "unit": "medium" },
      { "item": "frozen mixed berries", "amount": "1/2", "unit": "cup" },
      { "item": "almond milk", "amount": "1/4", "unit": "cup" },
      { "item": "granola", "amount": "1/4", "unit": "cup" },
      { "item": "coconut flakes", "amount": "2", "unit": "tbsp" },
      { "item": "chia seeds", "amount": "1", "unit": "tsp" }
    ],
    "steps": [
      { "id": 1, "text": "Blend frozen acai packet, frozen banana, berries, and almond milk until smooth.", "duration": 180, "note": "Keep it thick like soft-serve" },
      { "id": 2, "text": "Pour the blended smoothie base immediately into a cold serving bowl.", "duration": 30, "note": "Work quickly before it melts" },
      { "id": 3, "text": "Arrange granola, sweet coconut flakes, and chia seeds in elegant rows on top.", "duration": 120, "note": "Add sliced fresh banana or strawberry" },
      { "id": 4, "text": "Drizzle honey or maple syrup and serve immediately.", "duration": None, "note": "Eat immediately with a spoon" }
    ],
    "substitutions": {
      "frozen acai puree": ["frozen blueberries + cocoa powder"],
      "almond milk": ["coconut water"],
      "granola": ["chopped nuts"]
    }
  }
]

def parse_ingredient(text):
    patterns = [
        r'^(\d+(?:\/\d+)?(?:\.\d+)?)\s*(\w+)\s+(.+)$',
        r'^(\d+(?:\/\d+)?(?:\.\d+)?)\s*(\w+)$',
    ]
    for pattern in patterns:
        match = re.match(pattern, text.strip())
        if match:
            groups = match.groups()
            if len(groups) == 3:
                return {"amount": groups[0], "unit": groups[1], "item": groups[2]}
            elif len(groups) == 2:
                return {"amount": groups[0], "unit": "", "item": groups[1]}
    return {"amount": "", "unit": "", "item": text.strip()}

def clean_text(text):
    if not isinstance(text, str):
        return text
    # Map unicode fractions to standard plain text fractions
    fractions_map = {
        '\u00bd': '1/2',
        '\u00bc': '1/4',
        '\u00be': '3/4',
        '\u2153': '1/3',
        '\u2154': '2/3',
        '\u2155': '1/5',
        '\u2156': '2/5',
        '\u2157': '3/5',
        '\u2158': '4/5',
        '\u2159': '1/6',
        '\u215a': '5/6',
        '\u215b': '1/8',
        '\u215c': '3/8',
        '\u215d': '5/8',
        '\u215e': '7/8',
        '\ufffd': ' ',
    }
    for char, replacement in fractions_map.items():
        text = text.replace(char, replacement)
    # Replace common encoding glitches from scraping / datasets
    text = text.replace('34', '3/4')
    text = text.replace('12', '1/2')
    text = text.replace('14', '1/4')
    return text.strip()

def split_instructions(instructions_text):
    cleaned_text_val = clean_text(instructions_text)
    # Try splitting by newlines first
    lines = [l.strip() for l in re.split(r'[\r\n]+', cleaned_text_val) if l.strip()]
    cleaned_lines = []
    for line in lines:
        cleaned = re.sub(r'^(?:step\s*\d+\s*:?|\d+[\.\s\-:]+)\s*', '', line, flags=re.IGNORECASE).strip()
        if cleaned:
            cleaned_lines.append(cleaned)
    if len(cleaned_lines) >= 3:
        return cleaned_lines[:8]

    # Sentence-based fallback
    sentences = re.split(r'(?<=[.!?])\s+', cleaned_text_val)
    steps = []
    current_step = ""
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        if len(current_step) < 120:
            current_step += " " + sentence if current_step else sentence
        else:
            if current_step:
                steps.append(current_step.strip())
            current_step = sentence
    if current_step:
        steps.append(current_step.strip())
    if len(steps) < 3:
        new_steps = []
        for step in steps:
            parts = [p.strip() for p in step.split('. ') if p.strip()]
            for part in parts:
                if part:
                    new_steps.append(part + ('.' if not part.endswith('.') else ''))
        steps = new_steps
    return steps[:8]

def estimate_duration(step_text):
    text_lower = step_text.lower()
    hour_match = re.search(r'(\d+)\s*(?:hour|hr)', text_lower)
    if hour_match:
        return int(hour_match.group(1)) * 60
    min_match = re.search(r'(\d+)\s*(?:minute|min)', text_lower)
    if min_match:
        return int(min_match.group(1))
    if any(w in text_lower for w in ['preheat', 'heat', 'melt', 'sauté', 'brown']):
        return 5
    elif any(w in text_lower for w in ['bake', 'roast', 'simmer', 'cook', 'boil']):
        return 15
    elif any(w in text_lower for w in ['whisk', 'mix', 'stir', 'combine', 'blend']):
        return 3
    elif any(w in text_lower for w in ['chop', 'slice', 'dice', 'mince', 'cut']):
        return 4
    elif any(w in text_lower for w in ['rest', 'cool', 'chill', 'marinate', 'rise']):
        return 30
    elif any(w in text_lower for w in ['serve', 'garnish', 'top', 'drizzle']):
        return 2
    else:
        return 5

def categorize_recipe(title, ingredients):
    title_lower = title.lower()
    ing_count = len(ingredients)
    if any(w in title_lower for w in ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'shrimp', 'tofu', 'steak', 'turkey']):
        cat = 'Main'
    elif any(w in title_lower for w in ['soup', 'stew', 'curry', 'broth', 'chowder', 'bisque']):
        cat = 'Soup'
    elif any(w in title_lower for w in ['salad', 'slaw', 'greens', 'caesar']):
        cat = 'Salad'
    elif any(w in title_lower for w in ['cake', 'pie', 'cookie', 'brownie', 'parfait', 'mousse', 'tiramisu', 'pudding', 'trifle', 'donut', 'muffin']):
        cat = 'Dessert'
    elif any(w in title_lower for w in ['bread', 'bagel', 'pita', 'granola', 'bar', 'pancake', 'waffle', 'croissant', 'roll']):
        cat = 'Bakery'
    else:
        cat = 'Main'
    if ing_count <= 5:
        diff = 'Easy'
    elif ing_count <= 10:
        diff = 'Medium'
    else:
        diff = 'Advanced'
    time_map = {'Easy': '20 min', 'Medium': '35 min', 'Advanced': '50 min'}
    return cat, diff, time_map[diff]

def get_icon(category):
    icons = {'Main': '🍗', 'Soup': '🍲', 'Salad': '🥗', 'Dessert': '🍰', 'Bakery': '🥖'}
    return icons.get(category, '🍽️')

def generate_substitutions(ingredients):
    sub_map = {
        'butter': ['olive oil', 'coconut oil', 'ghee', 'vegan butter'],
        'olive oil': ['vegetable oil', 'avocado oil', 'grapeseed oil', 'coconut oil'],
        'eggs': ['flax eggs (1 tbsp flax + 3 tbsp water)', 'applesauce', 'mashed banana', 'aquafaba'],
        'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
        'flour': ['almond flour', 'oat flour', 'gluten-free blend', 'spelt flour'],
        'sugar': ['honey', 'maple syrup', 'coconut sugar', 'stevia', 'monk fruit'],
        'salt': ['sea salt', 'kosher salt', 'soy sauce'],
        'garlic': ['garlic powder', 'shallots', 'garlic paste', 'roasted garlic'],
        'onion': ['shallots', 'leeks', 'onion powder', 'green onions'],
        'lemon juice': ['lime juice', 'vinegar', 'white wine', 'verjuice'],
        'soy sauce': ['tamari', 'coconut aminos', 'worcestershire sauce', 'liquid aminos'],
        'yogurt': ['sour cream', 'coconut cream', 'buttermilk', 'Greek yogurt'],
        'cream': ['coconut cream', 'evaporated milk', 'half-and-half', 'cashew cream'],
        'cheese': ['nutritional yeast', 'vegan cheese', 'cashew cream', 'tahini'],
        'chicken': ['tofu', 'tempeh', 'seitan', 'chickpeas', 'jackfruit'],
        'beef': ['mushrooms', 'lentils', 'beyond meat', 'portobello'],
        'pork': ['tempeh', 'jackfruit', 'mushrooms', 'seitan'],
        'fish': ['tofu', 'hearts of palm', 'chickpeas', 'tempeh'],
        'rice': ['quinoa', 'cauliflower rice', 'barley', 'couscous', 'farro'],
        'pasta': ['zucchini noodles', 'spaghetti squash', 'rice noodles', 'kelp noodles'],
        'bread': ['lettuce wraps', 'corn tortillas', 'rice cakes', 'portobello caps'],
        'potatoes': ['sweet potatoes', 'cauliflower', 'turnips', 'parsnips'],
        'tomatoes': ['red bell peppers', 'sun-dried tomatoes', 'tomato paste + water', 'roasted peppers'],
        'spinach': ['kale', 'swiss chard', 'arugula', 'bok choy'],
        'basil': ['cilantro', 'parsley', 'oregano', 'mint'],
        'parsley': ['cilantro', 'basil', 'chives', 'dill'],
        'cilantro': ['parsley', 'basil', 'mint', 'culantro'],
        'ginger': ['ground ginger', 'galangal', 'allspice', 'crystallized ginger'],
        'honey': ['maple syrup', 'agave nectar', 'brown rice syrup', 'date syrup'],
        'vanilla extract': ['vanilla bean', 'almond extract', 'maple syrup', 'vanilla paste'],
        'baking powder': ['1/4 tsp baking soda + 1/2 tsp cream of tartar', 'self-rising flour'],
        'baking soda': ['3x baking powder (reduce salt)', 'potassium bicarbonate'],
    }
    substitutions = {}
    for ing in ingredients:
        item_lower = ing['item'].lower()
        for key, values in sub_map.items():
            if key in item_lower:
                substitutions[ing['item']] = values
                break
    return substitutions

def process_recipe(raw):
    title = clean_text(raw.get('Title', raw.get('title', raw.get('name', 'Unknown Recipe'))))
    ingredients_raw = raw.get('Cleaned_Ingredients', raw.get('Ingredients', raw.get('ingredients', [])))
    instructions_raw = raw.get('Instructions', raw.get('instructions', raw.get('steps', '')))
    
    if isinstance(ingredients_raw, str):
        ingredients_raw = ingredients_raw.strip()
        if ingredients_raw.startswith('[') and ingredients_raw.endswith(']'):
            try:
                import ast
                ingredients_raw = ast.literal_eval(ingredients_raw)
            except Exception:
                ingredients_raw = [i.strip(" '\"[]") for i in ingredients_raw.split(',') if i.strip()]
        else:
            ingredients_raw = [i.strip(" '\"[]") for i in ingredients_raw.split(',') if i.strip()]
    elif isinstance(ingredients_raw, list) and len(ingredients_raw) > 0:
        if isinstance(ingredients_raw[0], dict):
            ingredients_raw = [i.get('text', i.get('item', str(i))) for i in ingredients_raw]
            
    ingredients = [parse_ingredient(clean_text(str(i))) for i in ingredients_raw if i]
    category, difficulty, time = categorize_recipe(title, ingredients)
    
    if isinstance(instructions_raw, list):
        steps_text = [clean_text(str(s)) for s in instructions_raw]
    else:
        steps_text = split_instructions(str(instructions_raw))
        
    steps = []
    for i, step_text in enumerate(steps_text):
        duration = estimate_duration(step_text)
        note = None
        if i == 0:
            note = f"{len(ingredients)} ingredients prepared"
        elif i == len(steps_text) - 1:
            note = "Serve immediately for best results"
        steps.append({"id": i + 1, "text": step_text, "duration": duration if duration > 0 else None, "note": note})
        
    substitutions = generate_substitutions(ingredients)
    return {
        "id": re.sub(r'[^\w-]', '-', title.lower())[:40],
        "title": title,
        "time": time,
        "servings": raw.get('servings', 4),
        "difficulty": difficulty,
        "category": category,
        "icon": get_icon(category),
        "ingredients": ingredients,
        "steps": steps,
        "substitutions": substitutions
    }

def main():
    print("Attempting to load recipe datasets from HuggingFace...")
    all_recipes = []
    
    try:
        from datasets import load_dataset
        datasets_to_try = [
            ("Hieu-Pham/kaggle_food_recipes", "train"),
            ("m3hrdadfi/recipe_nlg_lite", "train"),
            ("datahiveai/recipes-with-nutrition", "train"),
        ]
        for dataset_name, split in datasets_to_try:
            try:
                print(f"Trying {dataset_name}...")
                dataset = load_dataset(dataset_name, split=split)
                for recipe in dataset:
                    try:
                        processed = process_recipe(recipe)
                        if (len(processed['ingredients']) >= 3 and 
                            len(processed['steps']) >= 3 and
                            len(processed['title']) > 5):
                            all_recipes.append(processed)
                    except Exception as e:
                        continue
                print(f"  Loaded {len(all_recipes)} recipes from {dataset_name}")
                if len(all_recipes) >= 120:
                    break
            except Exception as e:
                print(f"  Failed to load {dataset_name}: {e}")
                continue
    except Exception as e:
        print(f"Failed to load HF datasets: {e}. Falling back to 20 rich static recipes.")

    if len(all_recipes) < 20:
        print("Using FALLBACK_RECIPES static database...")
        selected = FALLBACK_RECIPES
    else:
        print(f"\nTotal online recipes loaded: {len(all_recipes)}")
        selected = []
        category_counts = {}
        random.shuffle(all_recipes)
        # Fetch even more recipes (up to 100) if online
        max_recipes = 100
        for recipe in all_recipes:
            cat = recipe['category']
            if category_counts.get(cat, 0) < 25 and len(selected) < max_recipes:
                selected.append(recipe)
                category_counts[cat] = category_counts.get(cat, 0) + 1
        
        difficulty_order = {'Easy': 0, 'Medium': 1, 'Advanced': 2}
        selected.sort(key=lambda x: difficulty_order.get(x['difficulty'], 1))

    # ── Normalize to App.jsx data contract ─────────────────────────────────
    def normalize(r):
        """Convert internal dict to the shape App.jsx expects."""
        # steps: id/text/duration → instruction/timerSeconds
        raw_steps = r.get('steps', [])
        steps = []
        for s in raw_steps:
            text = s.get('text') or s.get('instruction', '')
            dur  = s.get('duration') or s.get('timerSeconds')
            steps.append({
                'instruction': text,
                'timerSeconds': int(dur) if dur else None,
                'note': s.get('note'),
            })
        # parse totalTime from '20 min' / '35 min' string
        time_str = r.get('time', '')
        mins_match = re.search(r'(\d+)', time_str)
        total_time = int(mins_match.group(1)) if mins_match else None
        # ingredients: list of {amount,unit,item} → flat strings
        raw_ing = r.get('ingredients', [])
        ingredients = []
        for i in raw_ing:
            if isinstance(i, dict):
                parts = [i.get('amount',''), i.get('unit',''), i.get('item','')]
                ingredients.append(' '.join(p for p in parts if p).strip())
            else:
                ingredients.append(str(i))
        # difficulty normalise
        diff_raw = r.get('difficulty', 'Easy')
        diff_map = {'easy':'easy','medium':'medium','advanced':'hard','hard':'hard'}
        difficulty = diff_map.get(diff_raw.lower(), 'easy')
        # category normalise
        cat_raw = r.get('category', 'dinner')
        cat_map = {'main':'dinner','soup':'dinner','salad':'lunch','dessert':'dessert',
                   'bakery':'breakfast','snack':'snack'}
        category = cat_map.get(cat_raw.lower(), 'dinner')
        return {
            'id': r.get('id', re.sub(r'[^\w-]', '-', r.get('title','').lower())[:40]),
            'name': r.get('title', r.get('name', 'Unknown')),
            'emoji': r.get('icon', r.get('emoji', '🍽️')),
            'description': r.get('description', ''),
            'category': category,
            'difficulty': difficulty,
            'totalTime': total_time,
            'prepTime': r.get('prepTime'),
            'cookTime': r.get('cookTime'),
            'servings': r.get('servings', 4),
            'ingredients': ingredients,
            'steps': steps,
        }

    normalized = [normalize(r) for r in selected]

    # Write output to src/recipeData.js
    lines = []
    lines.append("// Auto-generated by fetch_recipes.py")
    lines.append("// Source: HuggingFace recipe datasets / Static fallbacks")
    lines.append(f"// Total recipes: {len(normalized)}")
    lines.append("")
    lines.append("export const recipes = ")
    lines.append(json.dumps(normalized, indent=2, ensure_ascii=False))
    lines.append(";")
    lines.append("")
    lines.append("export default recipes;")
    lines.append("")

    all_subs = {}
    for r in selected:
        all_subs.update(r['substitutions'])

    lines.append("export const substitutions = ")
    lines.append(json.dumps(all_subs, indent=2, ensure_ascii=False))
    lines.append(";")
    lines.append("")
    lines.append("export const categories = ['All', 'Main', 'Soup', 'Salad', 'Dessert', 'Bakery'];")
    lines.append("export const difficulties = ['Easy', 'Medium', 'Advanced'];")
    lines.append("")
    lines.append("export function searchRecipes(query) {")
    lines.append("  const lower = query.toLowerCase();")
    lines.append("  return recipes.filter(r =>")
    lines.append("    r.name.toLowerCase().includes(lower) ||")
    lines.append("    r.ingredients.some(i => i.toLowerCase().includes(lower)) ||")
    lines.append("    r.category.toLowerCase().includes(lower) ||")
    lines.append("    r.difficulty.toLowerCase().includes(lower)")
    lines.append("  );")
    lines.append("}")
    lines.append("")
    lines.append("export function filterByCategory(category) {")
    lines.append("  if (category.toLowerCase() === 'all') return recipes;")
    lines.append("  return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());")
    lines.append("}")
    lines.append("")
    lines.append("export function filterByDifficulty(difficulty) {")
    lines.append("  return recipes.filter(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());")
    lines.append("}")
    lines.append("")
    lines.append("export function getFavorites() {")
    lines.append("  try { return JSON.parse(localStorage.getItem('cheffear_favIds') || '[]'); } catch { return []; }")
    lines.append("}")
    lines.append("")
    lines.append("export function toggleFavorite(recipeId) {")
    lines.append("  const favorites = getFavorites();")
    lines.append("  const idx = favorites.indexOf(recipeId);")
    lines.append("  if (idx > -1) favorites.splice(idx, 1);")
    lines.append("  else favorites.push(recipeId);")
    lines.append("  localStorage.setItem('cheffear_favIds', JSON.stringify(favorites));")
    lines.append("  return favorites;")
    lines.append("}")
    lines.append("")
    lines.append("export function isFavorite(recipeId) {")
    lines.append("  return getFavorites().includes(recipeId);")
    lines.append("}")
    lines.append("")
    lines.append("export function getHistory() {")
    lines.append("  try { return JSON.parse(localStorage.getItem('cheffear_history') || '[]'); } catch { return []; }")
    lines.append("}")
    lines.append("")
    lines.append("export function saveCookingSession(recipeId, completed, durationMinutes) {")
    lines.append("  const history = getHistory();")
    lines.append("  history.unshift({ recipeId, completed, duration: durationMinutes, date: new Date().toISOString() });")
    lines.append("  localStorage.setItem('cheffear_history', JSON.stringify(history.slice(0, 50)));")
    lines.append("}")
    lines.append("")
    lines.append("export function getRecipeById(id) {")
    lines.append("  return recipes.find(r => r.id === id);")
    lines.append("}")
    lines.append("")
    lines.append("export function getRecentRecipes(limit = 5) {")
    lines.append("  const history = getHistory();")
    lines.append("  const recentIds = [...new Set(history.map(h => h.recipeId))].slice(0, limit);")
    lines.append("  return recentIds.map(id => getRecipeById(id)).filter(Boolean);")
    lines.append("}")
    lines.append("")
    lines.append("export function getFavoriteRecipes() {")
    lines.append("  const favIds = getFavorites();")
    lines.append("  return favIds.map(id => getRecipeById(id)).filter(Boolean);")
    lines.append("}")
    lines.append("")
    lines.append("export function trackEvent(event, data = {}) {")
    lines.append("  try {")
    lines.append("    const events = JSON.parse(localStorage.getItem('cheffear_events') || '[]');")
    lines.append("    events.push({ event, data, timestamp: Date.now() });")
    lines.append("    localStorage.setItem('cheffear_events', JSON.stringify(events.slice(-100)));")
    lines.append("  } catch {}")
    lines.append("}")

    import os
    os.makedirs('src', exist_ok=True)
    with open('src/recipeData.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"\nGenerated src/recipeData.js with {len(normalized)} recipes")

if __name__ == '__main__':
    main()
