const iconRules = [
  {
    "keywords": [
      "yes"
    ],
    "icon": "fa-solid fa-check",
    "category": "response"
  },
  {
    "keywords": [
      "no"
    ],
    "icon": "fa-solid fa-xmark",
    "category": "response"
  },
  {
    "keywords": [
      "stop"
    ],
    "icon": "fa-solid fa-stop",
    "category": "response"
  },
  {
    "keywords": [
      "go",
      "come",
      "walk",
      "run",
      "jump",
      "hop",
      "step"
    ],
    "icon": "fa-solid fa-arrow-right",
    "category": "action"
  },
  {
    "keywords": [
      "help"
    ],
    "icon": "fa-solid fa-handshake",
    "category": "people"
  },
  {
    "keywords": [
      "listen",
      "hear"
    ],
    "icon": "fa-solid fa-ear",
    "category": "action"
  },
  {
    "keywords": [
      "talk",
      "speak",
      "voice"
    ],
    "icon": "fa-solid fa-comment",
    "category": "action"
  },
  {
    "keywords": [
      "wait"
    ],
    "icon": "fa-solid fa-hourglass",
    "category": "action"
  },
  {
    "keywords": [
      "sing",
      "song",
      "music"
    ],
    "icon": "fa-solid fa-music",
    "category": "play"
  },
  {
    "keywords": [
      "draw",
      "color",
      "paint",
      "crayon",
      "marker",
      "pencil",
      "paper",
      "note",
      "notes",
      "write",
      "spell"
    ],
    "icon": "fa-solid fa-pencil",
    "category": "learning"
  },
  {
    "keywords": [
      "count",
      "add",
      "numbers",
      "math",
      "compare"
    ],
    "icon": "fa-solid fa-calculator",
    "category": "learning"
  },
  {
    "keywords": [
      "time",
      "clock"
    ],
    "icon": "fa-solid fa-clock",
    "category": "learning"
  },
  {
    "keywords": [
      "money"
    ],
    "icon": "fa-solid fa-coins",
    "category": "learning"
  },
  {
    "keywords": [
      "door"
    ],
    "icon": "fa-solid fa-door-open",
    "category": "home"
  },
  {
    "keywords": [
      "light",
      "lamp"
    ],
    "icon": "fa-solid fa-lightbulb",
    "category": "home"
  },
  {
    "keywords": [
      "chair",
      "seat"
    ],
    "icon": "fa-solid fa-chair",
    "category": "home"
  },
  {
    "keywords": [
      "table"
    ],
    "icon": "fa-solid fa-table",
    "category": "home"
  },
  {
    "keywords": [
      "trash",
      "garbage"
    ],
    "icon": "fa-solid fa-trash-can",
    "category": "home"
  },
  {
    "keywords": [
      "box"
    ],
    "icon": "fa-solid fa-box-open",
    "category": "home"
  },
  {
    "keywords": [
      "bag"
    ],
    "icon": "fa-solid fa-backpack",
    "category": "school"
  },
  {
    "keywords": [
      "towel",
      "napkin",
      "tissue",
      "wipe",
      "hand",
      "hands"
    ],
    "icon": "fa-solid fa-hand",
    "category": "health"
  },
  {
    "keywords": [
      "hug",
      "kiss",
      "love"
    ],
    "icon": "fa-solid fa-heart",
    "category": "people"
  },
  {
    "keywords": [
      "bandage"
    ],
    "icon": "fa-solid fa-bandage",
    "category": "health"
  },
  {
    "keywords": [
      "outside",
      "playground",
      "park"
    ],
    "icon": "fa-solid fa-tree",
    "category": "outdoor"
  },
  {
    "keywords": [
      "home",
      "room",
      "house"
    ],
    "icon": "fa-solid fa-house",
    "category": "home"
  },
  {
    "keywords": [
      "duck",
      "bird"
    ],
    "icon": "fa-solid fa-dove",
    "category": "animals"
  },
  {
    "keywords": [
      "backpack"
    ],
    "icon": "fa-solid fa-backpack",
    "category": "school"
  },
  {
    "keywords": [
      "lunchbox",
      "lunch",
      "eat",
      "food",
      "soup"
    ],
    "icon": "fa-solid fa-utensils",
    "category": "food"
  },
  {
    "keywords": [
      "spoon",
      "fork",
      "plate"
    ],
    "icon": "fa-solid fa-utensils",
    "category": "food"
  },
  {
    "keywords": [
      "cup",
      "juice",
      "milk",
      "water",
      "drink",
      "bottle"
    ],
    "icon": "fa-solid fa-mug-hot",
    "category": "drink"
  },
  {
    "keywords": [
      "apple"
    ],
    "icon": "fa-solid fa-apple-whole",
    "category": "food"
  },
  {
    "keywords": [
      "banana"
    ],
    "icon": "fa-solid fa-banana",
    "category": "food"
  },
  {
    "keywords": [
      "cookie",
      "cracker",
      "snack",
      "yogurt",
      "bread"
    ],
    "icon": "fa-solid fa-cookie-bite",
    "category": "food"
  },
  {
    "keywords": [
      "bed",
      "sleep",
      "nap",
      "pillow",
      "blanket",
      "rest"
    ],
    "icon": "fa-solid fa-bed",
    "category": "home"
  },
  {
    "keywords": [
      "book",
      "read",
      "story",
      "stories"
    ],
    "icon": "fa-solid fa-book",
    "category": "learning"
  },
  {
    "keywords": [
      "bus"
    ],
    "icon": "fa-solid fa-bus",
    "category": "transport"
  },
  {
    "keywords": [
      "car"
    ],
    "icon": "fa-solid fa-car-side",
    "category": "transport"
  },
  {
    "keywords": [
      "truck"
    ],
    "icon": "fa-solid fa-truck",
    "category": "transport"
  },
  {
    "keywords": [
      "ball"
    ],
    "icon": "fa-solid fa-futbol",
    "category": "play"
  },
  {
    "keywords": [
      "teddy",
      "bear"
    ],
    "icon": "fa-solid fa-bear",
    "category": "play"
  },
  {
    "keywords": [
      "toy",
      "doll",
      "puzzle",
      "play",
      "game"
    ],
    "icon": "fa-solid fa-puzzle-piece",
    "category": "play"
  },
  {
    "keywords": [
      "tooth",
      "toothbrush",
      "teeth"
    ],
    "icon": "fa-solid fa-tooth",
    "category": "health"
  },
  {
    "keywords": [
      "soap",
      "wash",
      "bath",
      "clean",
      "tub"
    ],
    "icon": "fa-solid fa-soap",
    "category": "health"
  },
  {
    "keywords": [
      "potty",
      "toilet",
      "bathroom",
      "pee",
      "poop"
    ],
    "icon": "fa-solid fa-toilet",
    "category": "health"
  },
  {
    "keywords": [
      "diaper"
    ],
    "icon": "fa-solid fa-baby",
    "category": "people"
  },
  {
    "keywords": [
      "shirt",
      "pants",
      "shorts",
      "coat",
      "jacket",
      "zip",
      "button"
    ],
    "icon": "fa-solid fa-shirt",
    "category": "clothes"
  },
  {
    "keywords": [
      "sock",
      "socks"
    ],
    "icon": "fa-solid fa-socks",
    "category": "clothes"
  },
  {
    "keywords": [
      "shoe",
      "shoes"
    ],
    "icon": "fa-solid fa-shoe-prints",
    "category": "clothes"
  },
  {
    "keywords": [
      "hat"
    ],
    "icon": "fa-solid fa-hat-cowboy",
    "category": "clothes"
  },
  {
    "keywords": [
      "school",
      "class",
      "daycare"
    ],
    "icon": "fa-solid fa-school",
    "category": "school"
  },
  {
    "keywords": [
      "teacher"
    ],
    "icon": "fa-solid fa-chalkboard-user",
    "category": "school"
  },
  {
    "keywords": [
      "mom",
      "dad",
      "brother",
      "sister",
      "grandma",
      "grandpa",
      "friend",
      "helper",
      "grown"
    ],
    "icon": "fa-solid fa-user",
    "category": "people"
  },
  {
    "keywords": [
      "baby"
    ],
    "icon": "fa-solid fa-baby",
    "category": "people"
  },
  {
    "keywords": [
      "cat"
    ],
    "icon": "fa-solid fa-cat",
    "category": "animals"
  },
  {
    "keywords": [
      "dog"
    ],
    "icon": "fa-solid fa-dog",
    "category": "animals"
  },
  {
    "keywords": [
      "frog"
    ],
    "icon": "fa-solid fa-frog",
    "category": "animals"
  }
];