/* ==========================================================
   SITE CONTENT: edit this file to change text, links and images.
   Presentation lives in style.css / main.js. A future Admin Panel
   can read and write this same structure (as JSON from a backend).
   Empty url/email values render as clearly disabled placeholders.
   ========================================================== */
window.SITE = {
  name: "MD Shahadat Hossain",
  initials: "MSH",
  title: "Aspiring BIM Professional | Diploma in Civil Engineering",
  headline: "Building Better Ideas Through CAD, BIM & Civil Engineering.",
  intro: "I focus on CAD drafting, BIM workflows, structural documentation, and architectural modeling. I am continuously developing my technical capabilities through practical work, technical projects, and hands-on learning.",
  footerBlurb: "CAD drafting, BIM workflows, structural documentation, and architectural modeling, developed through practical work and hands-on learning.",
  photo: "assets/img/profile.jpg", // add your photo here; placeholder shows if the file is missing
  photoAlt: "Portrait of MD Shahadat Hossain (placeholder until a photo is added)",

  nav: [
    { label: "Home", href: "index.html#home" },
    { label: "About", href: "about.html" },          
    { label: "Skills", href: "index.html#skills" },
    { label: "Services", href: "services.html" },
    { label: "Portfolio", href: "portfolio.html" },  // page built in a later step
    { label: "Certificates", href: "certificates.html" },
    { label: "Contact", href: "contact.html" }
  ],
  portfolioHref: "portfolio.html",
  contactHref: "contact.html", // future Contact page route

  contact: {
    email: "s.h.rafi.exp@gmail.com",
    whatsapp: "+8801945141778",           // international format, used for the wa.me link
    whatsappDisplay: "+880 1945 141778",  // readable format shown on the page
    linkedin: "https://www.linkedin.com/in/md-shahadat-hossain-rafi/",
    location: "Dhaka, Bangladesh"
  },
  social: [ // add Instagram / YouTube here later by adding entries with a url
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/md-shahadat-hossain-rafi/" },
    { label: "WhatsApp", icon: "chat", url: "https://wa.me/8801945141778" },
    { label: "Email", icon: "mail", url: "mailto:s.h.rafi.exp@gmail.com" }
  ],

  highlights: [
    { icon: "cap", label: "Qualification", value: "Diploma in Civil Engineering" },
    { icon: "layers", label: "Professional Focus", value: "CAD & BIM" },
    { icon: "ruler", label: "Technical Focus", value: "Architectural & Structural Drafting" },
    { icon: "doc", label: "Practical Exposure", value: "Industrial Drawings & Documentation" }
  ],

  // status: "current" | "developing"
  skills: [
    { icon: "ruler", name: "AutoCAD", desc: "Architectural and structural 2D drafting.", cat: "Drafting", status: "current" },
    { icon: "building", name: "Revit Architecture", desc: "Architectural modeling for building projects.", cat: "BIM", status: "current" },
    { icon: "cube", name: "SketchUp", desc: "Interior and exterior 3D modeling.", cat: "3D Modeling", status: "current" },
    { icon: "calc", name: "RCC Estimation & BOQ", desc: "Quantity estimation for reinforced concrete work.", cat: "Estimation", status: "current" },
    { icon: "frame", name: "ETABS", desc: "Structural modeling and analysis.", cat: "Structural", status: "current" },
    { icon: "doc", name: "As-Built Documentation", desc: "Practical exposure to as-built and industrial building drawings.", cat: "Documentation", status: "current" },
    { icon: "steel", name: "Steel Fabrication Drawings", desc: "Learning to prepare fabrication drawings for steel structures.", cat: "Structural", status: "developing" },
    { icon: "layers", name: "Revit Structure", desc: "Learning structural modeling inside Revit.", cat: "BIM", status: "developing" }
  ],

  // Placeholders only: replace title, description, image and link with real project details.
  projects: [
    { category: "Architectural CAD Drawings", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual architectural drawing work.", img: "assets/img/placeholders/project-1.svg", href: "portfolio.html" },
    { category: "Structural CAD Drawings", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual structural drawing work.", img: "assets/img/placeholders/project-2.svg", href: "portfolio.html" },
    { category: "SketchUp 3D Models", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual SketchUp model.", img: "assets/img/placeholders/project-3.svg", href: "portfolio.html" },
    { category: "Revit Architecture Models", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual Revit model.", img: "assets/img/placeholders/project-4.svg", href: "portfolio.html" },
    { category: "RCC Estimation & BOQ", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual estimation work.", img: "assets/img/placeholders/project-5.svg", href: "portfolio.html" },
    { category: "Industrial Building & Steel Fabrication Drawings", title: "Project title placeholder", desc: "Placeholder description. Replace with details of your actual industrial drawing work.", img: "assets/img/placeholders/project-6.svg", href: "portfolio.html" }
  ],

  services: [
    { icon: "ruler", name: "Architectural 2D Drafting", desc: "Plans, elevations, sections and details drawn in AutoCAD." },
    { icon: "frame", name: "Structural 2D Drafting", desc: "Structural layouts and reinforcement details in AutoCAD." },
    { icon: "cube", name: "Architectural 3D Modeling", desc: "Interior and exterior models built in SketchUp." },
    { icon: "building", name: "Revit Architectural Modeling", desc: "Building models developed in Revit Architecture." },
    { icon: "calc", name: "RCC Quantity Estimation & BOQ", desc: "Quantities and bills of quantities for RCC work." },
    { icon: "doc", name: "Technical Drawing Documentation", desc: "Organized drawing sets and as-built documentation." }
  ],

  // No dates or employers: add them only when confirmed.
  journey: [
    { title: "Diploma in Civil Engineering", text: "A technical foundation in construction, structures and drawing." },
    { title: "AutoCAD drafting", text: "Developed architectural and structural 2D drafting skills." },
    { title: "3D modeling", text: "Built 3D models with SketchUp and Revit Architecture." },
    { title: "Industrial drawings", text: "Practical exposure to industrial drawings and as-built documentation." },
    { title: "Currently developing", text: "Steel fabrication drawings, Revit Structure and wider BIM workflows." }
  ],

  // Visual showcase. w/h are each image's own size, so ratios are preserved.
  preview: [
    { label: "Architectural 3D model", img: "assets/img/placeholders/preview-1.svg", w: 1200, h: 800 },
    { label: "CAD technical drawing", img: "assets/img/placeholders/preview-2.svg", w: 800, h: 1000 },
    { label: "Building exterior visualization", img: "assets/img/placeholders/preview-3.svg", w: 1200, h: 675 },
    { label: "Structural drawing detail", img: "assets/img/placeholders/preview-4.svg", w: 800, h: 800 },
    { label: "Revit model screenshot", img: "assets/img/placeholders/preview-5.svg", w: 1200, h: 800 },
    { label: "Industrial drawing documentation", img: "assets/img/placeholders/preview-6.svg", w: 800, h: 1000 }
  ]
};


/* ---- Portfolio page data (Step 3). Admin-ready: each entry has order + visible. ---- */
window.SITE.portfolioFilters = [
  {
    "key": "all",
    "label": "All Projects"
  },
  {
    "key": "cad",
    "label": "CAD & Technical Drawings"
  },
  {
    "key": "bim",
    "label": "BIM & 3D Modeling"
  },
  {
    "key": "est",
    "label": "Estimation & Engineering Documentation"
  }
];
// status: "Placeholder" | "Learning example" | "Completed" (use only for real finished work)
window.SITE.portfolio = [
  {
    "id": "p01",
    "title": "Architectural 2D Drafting",
    "category": "cad",
    "categoryLabel": "CAD & Technical Drawings",
    "thumbnail": "assets/img/placeholders/portfolio-01-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-01-1.svg",
        "alt": "Placeholder illustration for Architectural 2D Drafting, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-01-2.svg",
        "alt": "Placeholder illustration for Architectural 2D Drafting, sheet 2"
      }
    ],
    "description": "One-line sample card for architectural plan drafting work.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "AutoCAD"
    ],
    "status": "Placeholder",
    "order": 1,
    "visible": true
  },
  {
    "id": "p02",
    "title": "Structural 2D Drafting",
    "category": "cad",
    "categoryLabel": "CAD & Technical Drawings",
    "thumbnail": "assets/img/placeholders/portfolio-02-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-02-1.svg",
        "alt": "Placeholder illustration for Structural 2D Drafting, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-02-2.svg",
        "alt": "Placeholder illustration for Structural 2D Drafting, sheet 2"
      }
    ],
    "description": "One-line sample card for structural layout and detailing drawings.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "AutoCAD"
    ],
    "status": "Placeholder",
    "order": 2,
    "visible": true
  },
  {
    "id": "p03",
    "title": "Steel Structure Fabrication Drawings",
    "category": "cad",
    "categoryLabel": "CAD & Technical Drawings",
    "thumbnail": "assets/img/placeholders/portfolio-03-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-03-1.svg",
        "alt": "Placeholder illustration for Steel Structure Fabrication Drawings"
      }
    ],
    "description": "Learning example of steel fabrication drawing practice.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "AutoCAD"
    ],
    "status": "Learning example",
    "order": 3,
    "visible": true
  },
  {
    "id": "p04",
    "title": "Industrial Building Drawings",
    "category": "cad",
    "categoryLabel": "CAD & Technical Drawings",
    "thumbnail": "assets/img/placeholders/portfolio-04-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-04-1.svg",
        "alt": "Placeholder illustration for Industrial Building Drawings"
      }
    ],
    "description": "Learning example of industrial building drawing practice.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "AutoCAD"
    ],
    "status": "Learning example",
    "order": 4,
    "visible": true
  },
  {
    "id": "p05",
    "title": "As-Built Drawings and Documentation",
    "category": "cad",
    "categoryLabel": "CAD & Technical Drawings",
    "thumbnail": "assets/img/placeholders/portfolio-05-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-05-1.svg",
        "alt": "Placeholder illustration for As-Built Drawings and Documentation, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-05-2.svg",
        "alt": "Placeholder illustration for As-Built Drawings and Documentation, sheet 2"
      }
    ],
    "description": "One-line sample card for as-built drawing and documentation work.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "AutoCAD"
    ],
    "status": "Placeholder",
    "order": 5,
    "visible": true
  },
  {
    "id": "p06",
    "title": "Revit Architecture Modeling",
    "category": "bim",
    "categoryLabel": "BIM & 3D Modeling",
    "thumbnail": "assets/img/placeholders/portfolio-06-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-06-1.svg",
        "alt": "Placeholder illustration for Revit Architecture Modeling, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-06-2.svg",
        "alt": "Placeholder illustration for Revit Architecture Modeling, sheet 2"
      }
    ],
    "description": "One-line sample card for an architectural BIM model.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "Revit Architecture"
    ],
    "status": "Placeholder",
    "order": 6,
    "visible": true
  },
  {
    "id": "p07",
    "title": "Revit Structure Modeling",
    "category": "bim",
    "categoryLabel": "BIM & 3D Modeling",
    "thumbnail": "assets/img/placeholders/portfolio-07-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-07-1.svg",
        "alt": "Placeholder illustration for Revit Structure Modeling"
      }
    ],
    "description": "Learning example of structural modeling in Revit.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "Revit Structure"
    ],
    "status": "Learning example",
    "order": 7,
    "visible": true
  },
  {
    "id": "p08",
    "title": "SketchUp Interior 3D Modeling",
    "category": "bim",
    "categoryLabel": "BIM & 3D Modeling",
    "thumbnail": "assets/img/placeholders/portfolio-08-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-08-1.svg",
        "alt": "Placeholder illustration for SketchUp Interior 3D Modeling"
      }
    ],
    "description": "One-line sample card for an interior 3D model.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "SketchUp"
    ],
    "status": "Placeholder",
    "order": 8,
    "visible": true
  },
  {
    "id": "p09",
    "title": "SketchUp Exterior 3D Modeling",
    "category": "bim",
    "categoryLabel": "BIM & 3D Modeling",
    "thumbnail": "assets/img/placeholders/portfolio-09-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-09-1.svg",
        "alt": "Placeholder illustration for SketchUp Exterior 3D Modeling, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-09-2.svg",
        "alt": "Placeholder illustration for SketchUp Exterior 3D Modeling, sheet 2"
      }
    ],
    "description": "One-line sample card for an exterior building model.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "SketchUp"
    ],
    "status": "Placeholder",
    "order": 9,
    "visible": true
  },
  {
    "id": "p10",
    "title": "Architectural 3D Building Models",
    "category": "bim",
    "categoryLabel": "BIM & 3D Modeling",
    "thumbnail": "assets/img/placeholders/portfolio-10-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-10-1.svg",
        "alt": "Placeholder illustration for Architectural 3D Building Models"
      }
    ],
    "description": "One-line sample card for a 3D building model.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "SketchUp",
      "Revit Architecture"
    ],
    "status": "Placeholder",
    "order": 10,
    "visible": true
  },
  {
    "id": "p11",
    "title": "RCC Quantity Estimation",
    "category": "est",
    "categoryLabel": "Estimation & Engineering Documentation",
    "thumbnail": "assets/img/placeholders/portfolio-11-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-11-1.svg",
        "alt": "Placeholder illustration for RCC Quantity Estimation"
      }
    ],
    "description": "One-line sample card for RCC quantity take-off.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [],
    "status": "Placeholder",
    "order": 11,
    "visible": true
  },
  {
    "id": "p12",
    "title": "BOQ Preparation",
    "category": "est",
    "categoryLabel": "Estimation & Engineering Documentation",
    "thumbnail": "assets/img/placeholders/portfolio-12-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-12-1.svg",
        "alt": "Placeholder illustration for BOQ Preparation, sheet 1"
      },
      {
        "src": "assets/img/placeholders/portfolio-12-2.svg",
        "alt": "Placeholder illustration for BOQ Preparation, sheet 2"
      }
    ],
    "description": "One-line sample card for a bill of quantities.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [],
    "status": "Placeholder",
    "order": 12,
    "visible": true
  },
  {
    "id": "p13",
    "title": "ETABS Structural Modeling",
    "category": "est",
    "categoryLabel": "Estimation & Engineering Documentation",
    "thumbnail": "assets/img/placeholders/portfolio-13-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-13-1.svg",
        "alt": "Placeholder illustration for ETABS Structural Modeling"
      }
    ],
    "description": "One-line sample card for a structural analysis model.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "ETABS"
    ],
    "status": "Placeholder",
    "order": 13,
    "visible": true
  },
  {
    "id": "p14",
    "title": "ETABS Structural Analysis",
    "category": "est",
    "categoryLabel": "Estimation & Engineering Documentation",
    "thumbnail": "assets/img/placeholders/portfolio-14-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-14-1.svg",
        "alt": "Placeholder illustration for ETABS Structural Analysis"
      }
    ],
    "description": "One-line sample card for structural analysis results.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [
      "ETABS"
    ],
    "status": "Placeholder",
    "order": 14,
    "visible": true
  },
  {
    "id": "p15",
    "title": "Engineering Drawing Documentation",
    "category": "est",
    "categoryLabel": "Estimation & Engineering Documentation",
    "thumbnail": "assets/img/placeholders/portfolio-15-1.svg",
    "images": [
      {
        "src": "assets/img/placeholders/portfolio-15-1.svg",
        "alt": "Placeholder illustration for Engineering Drawing Documentation"
      }
    ],
    "description": "One-line sample card for an organized drawing set.",
    "details": "Placeholder details. Replace with a real description of the work, what you did, and what you learned.",
    "tools": [],
    "status": "Placeholder",
    "order": 15,
    "visible": true
  }
];


/* ---- About page data (Step 4). Story, focus cards, timeline and skill groups are all editable here. ---- */
window.SITE.about = {
  "eyebrow": "About Me",
  "heading": "Engineering Ideas Into Digital Models",
  "intro": "I'm passionate about Civil Engineering, technical drafting, and BIM workflows. My focus is on developing accurate drawings, structured building models, and clear engineering documentation using modern design and analysis software.",
  "story": [
    "My journey in Civil Engineering has helped me develop an interest in technical drawing, building modeling, and engineering documentation. Through working with software such as AutoCAD, SketchUp, Revit, and ETABS, I have been developing my skills across architectural drafting, structural drafting, 3D modeling, quantity estimation, and structural analysis.",
    "I enjoy turning building concepts and technical information into organized drawings and digital models. I am particularly interested in BIM workflows and how accurate models and documentation can support better coordination throughout a building project.",
    "I continue to strengthen my technical knowledge through practice and learning. I am also developing my skills in steel structure fabrication drawings and industrial building drawings using AutoCAD. My goal is to grow as a BIM and Civil Engineering professional while producing clear, accurate, and useful technical work."
  ],
  "focus": [
    {
      "icon": "ruler",
      "title": "CAD Drafting",
      "text": "Architectural and structural 2D drawings using AutoCAD."
    },
    {
      "icon": "building",
      "title": "BIM Modeling",
      "text": "Building modeling and digital documentation using Revit Architecture and Revit Structure."
    },
    {
      "icon": "cube",
      "title": "3D Modeling",
      "text": "Interior and exterior building visualization using SketchUp."
    },
    {
      "icon": "calc",
      "title": "Engineering Estimation & Analysis",
      "text": "RCC estimation, BOQ preparation, and structural modeling and analysis using ETABS."
    }
  ],
  "timeline": [
    {
      "title": "Civil Engineering Foundation",
      "text": "Developing technical knowledge in Civil Engineering and construction-related subjects."
    },
    {
      "title": "CAD Drafting Skills",
      "text": "Building skills in architectural and structural drafting with AutoCAD."
    },
    {
      "title": "3D Modeling",
      "text": "Developing interior and exterior modeling skills using SketchUp."
    },
    {
      "title": "BIM Modeling",
      "text": "Working with Revit Architecture and developing skills in Revit Structure."
    },
    {
      "title": "Estimation & Structural Analysis",
      "text": "Practicing RCC estimation, BOQ preparation, and ETABS modeling and analysis."
    },
    {
      "title": "Expanding Technical Skills",
      "text": "Currently learning steel structure fabrication drawings and industrial building drawings using AutoCAD."
    }
  ],
  "skillGroups": [
    {
      "icon": "ruler",
      "title": "CAD Drafting",
      "software": "AutoCAD",
      "items": [
        "AutoCAD Architectural Drafting",
        "AutoCAD Structural Drafting"
      ],
      "developing": false
    },
    {
      "icon": "building",
      "title": "BIM",
      "software": "Revit",
      "items": [
        "Revit Architecture",
        "Revit Structure"
      ],
      "developing": false
    },
    {
      "icon": "cube",
      "title": "3D Modeling",
      "software": "SketchUp",
      "items": [
        "SketchUp Interior Modeling",
        "SketchUp Exterior Modeling"
      ],
      "developing": false
    },
    {
      "icon": "calc",
      "title": "Engineering",
      "software": "ETABS",
      "items": [
        "RCC Estimation",
        "BOQ Preparation",
        "ETABS Structural Modeling",
        "ETABS Structural Analysis"
      ],
      "developing": false
    },
    {
      "icon": "steel",
      "title": "Currently Developing",
      "software": "AutoCAD",
      "items": [
        "Steel Structure Fabrication Drawings",
        "Industrial Building Drawings using AutoCAD"
      ],
      "developing": true
    }
  ]
};


/* ---- Services page data (Step 5). price: "" shows "Pricing on Request"; add a confirmed price string later. status: "Current" | "Developing". ---- */
window.SITE.servicesPage = {
  "eyebrow": "What I Do",
  "heading": "My Services",
  "intro": "I work with CAD drafting, BIM modeling, 3D modeling, and engineering documentation to help communicate building ideas through clear technical drawings and organized digital models.",
  "scopeNote": "My work is part of an ongoing learning and technical development path. It does not carry professional engineering approval or responsibility for final structural design.",
  "actionLabel": "Discuss a Project",
  "actionHref": "contact.html",
  "pricingLabel": "Pricing on Request",
  "closing": {
    "heading": "Have a Project in Mind?",
    "text": "Let's discuss your CAD drafting, BIM modeling, 3D modeling, or engineering documentation requirements.",
    "button": "Contact Me",
    "href": "contact.html"
  },
  "items": [
    {
      "id": "s1",
      "icon": "ruler",
      "title": "Architectural 2D Drafting",
      "description": "Architectural drafting and drawing preparation using AutoCAD, with a focus on clear layouts and organized technical documentation.",
      "tools": [
        "AutoCAD"
      ],
      "developingTools": [],
      "status": "Current",
      "price": "",
      "order": 1,
      "visible": true
    },
    {
      "id": "s2",
      "icon": "layers",
      "title": "Structural 2D Drafting",
      "description": "Preparation and organization of structural 2D drawings in AutoCAD based on the available project information and design requirements.",
      "tools": [
        "AutoCAD"
      ],
      "developingTools": [],
      "status": "Current",
      "price": "",
      "order": 2,
      "visible": true
    },
    {
      "id": "s3",
      "icon": "building",
      "title": "BIM Modeling",
      "description": "Building modeling and digital documentation using Revit Architecture, with Revit Structure included as part of my developing BIM skill set.",
      "tools": [
        "Revit Architecture"
      ],
      "developingTools": [
        "Revit Structure"
      ],
      "status": "Current",
      "price": "",
      "order": 3,
      "visible": true
    },
    {
      "id": "s4",
      "icon": "cube",
      "title": "Interior & Exterior 3D Modeling",
      "description": "Creating interior and exterior building models using SketchUp to communicate spatial layouts, forms, and design concepts.",
      "tools": [
        "SketchUp"
      ],
      "developingTools": [],
      "status": "Current",
      "price": "",
      "order": 4,
      "visible": true
    },
    {
      "id": "s5",
      "icon": "calc",
      "title": "RCC Estimation & BOQ",
      "description": "RCC quantity estimation and BOQ preparation based on available drawings and project information.",
      "tools": [
        "RCC Estimation",
        "BOQ"
      ],
      "developingTools": [],
      "status": "Current",
      "price": "",
      "order": 5,
      "visible": true
    },
    {
      "id": "s6",
      "icon": "frame",
      "title": "ETABS Structural Modeling & Analysis",
      "description": "Structural modeling and analysis using ETABS as part of my Civil Engineering technical workflow.",
      "tools": [
        "ETABS"
      ],
      "developingTools": [],
      "status": "Current",
      "price": "",
      "order": 6,
      "visible": true
    },
    {
      "id": "s7",
      "icon": "steel",
      "title": "Steel Fabrication & Industrial Drawing Development",
      "description": "Currently developing practical skills in AutoCAD steel structure fabrication drawings and industrial building drawings.",
      "tools": [],
      "developingTools": [
        "AutoCAD"
      ],
      "status": "Developing",
      "price": "",
      "order": 7,
      "visible": true
    }
  ]
};


/* ---- Certificates page data (Step 6) ----
   Add a real certificate by pushing an object into `certificates`, e.g.:
   { id:"c1", title:"", category:"cad|bim|est|model", issuer:"", date:"", description:"",
     image:"assets/img/certificates/your-file.jpg", pdf:"", credentialUrl:"", order:1, visible:true }
   Only fill in what the real certificate shows. Empty fields are not displayed.
   Awards use: { id, title, issuer, date, description, order, visible }. */
window.SITE.certificatesPage = {
  "eyebrow": "Professional Development",
  "heading": "Certificates & Achievements",
  "intro": "My learning journey includes developing technical skills in CAD drafting, BIM modeling, 3D modeling, quantity estimation, and structural analysis. This page is designed to showcase my course certificates, training, and professional development.",
  "categories": [
    {
      "key": "cad",
      "title": "CAD Drafting",
      "topics": [
        "AutoCAD Training",
        "Architectural and Structural Drafting Courses"
      ]
    },
    {
      "key": "bim",
      "title": "BIM & Revit",
      "topics": [
        "Revit Architecture Training",
        "Revit Structure Training",
        "BIM-Related Courses"
      ]
    },
    {
      "key": "est",
      "title": "Estimation & Engineering",
      "topics": [
        "RCC Estimation",
        "BOQ Preparation",
        "Quantity Estimation Training"
      ]
    },
    {
      "key": "model",
      "title": "3D Modeling & Structural Analysis",
      "topics": [
        "SketchUp Interior and Exterior Modeling",
        "ETABS Structural Modeling and Analysis"
      ]
    }
  ],
  "certificates": [],
  "emptyIntro": "Certificates will be added soon. The categories below show how they will be organized; they are not a list of certificates held.",
  "filledIntro": "Certificates are grouped by category.",
  "timeline": [
    {
      "title": "CAD Drafting",
      "text": "Developing skills in AutoCAD architectural and structural drafting.",
      "ongoing": false
    },
    {
      "title": "3D Modeling",
      "text": "Practicing interior and exterior modeling with SketchUp.",
      "ongoing": false
    },
    {
      "title": "BIM Modeling",
      "text": "Working with Revit Architecture and developing Revit Structure skills.",
      "ongoing": false
    },
    {
      "title": "Estimation & Analysis",
      "text": "Developing skills in RCC estimation, BOQ preparation, and ETABS modeling and analysis.",
      "ongoing": false
    },
    {
      "title": "Expanding Technical Knowledge",
      "text": "Currently learning steel structure fabrication and industrial building drawings using AutoCAD.",
      "ongoing": true
    }
  ],
  "awards": [],
  "awardsEmpty": "Professional awards and verified achievements will be added here when available.",
  "awardsNote": "Awards are kept separate from course certificates: completing a course is not the same as receiving a competitive award or professional honor."
};


/* ---- Contact page data (Step 7). Contact details come from SITE.contact above. ---- */
window.SITE.contactPage = {
  "heading": "Let’s Discuss Your Project",
  "intro": "Have a project, technical drawing requirement, or collaboration idea? Feel free to contact me. I’m interested in CAD drafting, BIM modeling, 3D modeling, and civil engineering documentation opportunities.",
  "inquiryTypes": [
    {
      "label": "Architectural 2D Drafting"
    },
    {
      "label": "Structural 2D Drafting"
    },
    {
      "label": "BIM / Revit Modeling"
    },
    {
      "label": "SketchUp 3D Modeling"
    },
    {
      "label": "RCC Estimation & BOQ"
    },
    {
      "label": "ETABS Structural Modeling & Analysis"
    },
    {
      "label": "Steel Structure / Industrial Drawings",
      "note": "This is an area I am currently learning and developing."
    },
    {
      "label": "Internship or Career Opportunity"
    },
    {
      "label": "General Inquiry"
    },
    {
      "label": "Other"
    }
  ],
  "defaultType": "General Inquiry",
  "formNote": "Your message is sent securely to my dashboard. If sending fails, an email draft opens as a fallback.",
  "closing": {
    "heading": "Have a Question or Collaboration Idea?",
    "text": "Let’s connect and discuss how CAD drafting, BIM workflows, and technical documentation can support your project.",
    "emailLabel": "Email Me",
    "linkedinLabel": "Connect on LinkedIn"
  }
};
