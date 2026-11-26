/* =========================================================
   AUTHENTIC SEED DATA — SALUD & BELLEZA SPA BETTY (LIMA)
   Based on real Facebook & TikTok research (C.C. Barrio Chino)
========================================================= */

window.SPA_BETTY_SEED = {
  services: [
    {
      id: "srv-podo-laser",
      name: "Podología Integral + Láser",
      category: "podologia",
      categoryLabel: "Podología",
      cabin: "Tda. 2015",
      defaultStaffId: "stf-rosario",
      duration: "50 min",
      price: 50.0,
      oldPrice: 75.0,
      promo: "Oferta",
      featured: true,
      description: "Profilaxis clínica + láser terapéutico para hongos y uñas."
    },
    {
      id: "srv-masaje-integral",
      name: "Masaje Integral + Ventosas & TENS",
      category: "masajes",
      categoryLabel: "Fisio & Masajes",
      cabin: "Tda. 2100",
      defaultStaffId: "stf-carlos",
      duration: "60 min",
      price: 50.0,
      oldPrice: 60.0,
      promo: "Más Pedido",
      featured: true,
      description: "Descontracturante completo con compresas calientes y electroterapia."
    },
    {
      id: "srv-facial-diamante",
      name: "Limpieza Facial Punta de Diamante",
      category: "cosmiatria",
      categoryLabel: "Cosmiatría",
      cabin: "Tda. 2101",
      defaultStaffId: "stf-valeria",
      duration: "60 min",
      price: 50.0,
      oldPrice: 70.0,
      promo: "2x1 Disp.",
      featured: true,
      description: "Microdermoabrasión, vapor ozono, máscara LED y colágeno."
    },
    {
      id: "srv-descarga",
      name: "Descarga Muscular Deportiva",
      category: "masajes",
      categoryLabel: "Fisio & Masajes",
      cabin: "Tda. 2100",
      defaultStaffId: "stf-carlos",
      duration: "60 min",
      price: 65.0,
      oldPrice: 80.0,
      promo: "Ciclistas",
      featured: true,
      description: "Liberación miofascial profunda + TENS para ciclistas y atletas."
    },
    {
      id: "srv-pestanas-2x1",
      name: "Extensiones de Pestañas (2x1)",
      category: "mirada",
      categoryLabel: "Cejas & Pestañas",
      cabin: "Tda. 3100",
      defaultStaffId: "stf-andrea",
      duration: "90 min",
      price: 120.0,
      oldPrice: 140.0,
      promo: "2x1",
      featured: true,
      description: "Aplicación pelo a pelo efecto natural o volumen para 2 personas."
    },
    {
      id: "srv-quiro",
      name: "Ajuste Quiropráctico & Terapia",
      category: "masajes",
      categoryLabel: "Fisio & Masajes",
      cabin: "Tda. 2013",
      defaultStaffId: "stf-carlos",
      duration: "45 min",
      price: 70.0,
      oldPrice: null,
      promo: "Eval. Gratis",
      featured: true,
      description: "Corrección vertebral para lumbalgia, cervicalgia y postura."
    },
    {
      id: "srv-podo-integral",
      name: "Podología Integral Clínica",
      category: "podologia",
      categoryLabel: "Podología",
      cabin: "Tda. 2015",
      defaultStaffId: "stf-rosario",
      duration: "45 min",
      price: 35.0,
      oldPrice: null,
      promo: null,
      featured: false,
      description: "Profilaxis podal, atención de uñeros, helomas y callosidades."
    },
    {
      id: "srv-ortonixia",
      name: "Ortonixia & Pie Diabético",
      category: "podologia",
      categoryLabel: "Podología",
      cabin: "Tda. 2015",
      defaultStaffId: "stf-rosario",
      duration: "60 min",
      price: 80.0,
      oldPrice: null,
      promo: null,
      featured: false,
      description: "Corrección de uña encarnada y cuidado clínico preventivo."
    },
    {
      id: "srv-reflexologia",
      name: "Reflexología Podal + Parafina",
      category: "podologia",
      categoryLabel: "Podología",
      cabin: "Tda. 2015",
      defaultStaffId: "stf-rosario",
      duration: "40 min",
      price: 45.0,
      oldPrice: null,
      promo: null,
      featured: false,
      description: "Puntos reflejos plantares + baño hidratante de parafina tibia."
    },
    {
      id: "srv-hidro-dermapen",
      name: "Hidrodermoabrasión & Colágeno",
      category: "cosmiatria",
      categoryLabel: "Cosmiatría",
      cabin: "Tda. 2101",
      defaultStaffId: "stf-valeria",
      duration: "75 min",
      price: 85.0,
      oldPrice: 110.0,
      promo: "Antiedad",
      featured: false,
      description: "Hidratación hidrofacial profunda, radiofrecuencia y luminosidad."
    },
    {
      id: "srv-lifting",
      name: "Lifting de Pestañas + Cejas Hilo",
      category: "mirada",
      categoryLabel: "Cejas & Pestañas",
      cabin: "Tda. 3100",
      defaultStaffId: "stf-andrea",
      duration: "45 min",
      price: 30.0,
      oldPrice: 45.0,
      promo: "Oferta",
      featured: false,
      description: "Rizado natural nutritivo + diseño de cejas con hilo hindú."
    },
    {
      id: "srv-microblading",
      name: "Microblading / Microshading",
      category: "mirada",
      categoryLabel: "Cejas & Pestañas",
      cabin: "Tda. 3100",
      defaultStaffId: "stf-andrea",
      duration: "90 min",
      price: 100.0,
      oldPrice: 150.0,
      promo: null,
      featured: false,
      description: "Diseño visagismo pelo a pelo con pigmentos certificados."
    }
  ],

  products: [
    {
      id: "prd-talco-menta",
      name: "Talco Crema de Menta · 150g",
      category: "Podología",
      price: 35.0,
      stock: 18,
      minStock: 6,
      icon: "droplets",
      image: "assets/prod-talco-menta.jpg",
      description: "Terbinafina, óxido de zinc y aloe vera antimicótico."
    },
    {
      id: "prd-ortesis",
      name: "Kit Órtesis de Silicona",
      category: "Podología",
      price: 28.0,
      stock: 12,
      minStock: 5,
      icon: "shield",
      image: "assets/prod-ortesis.jpg",
      description: "Separadores médicos lavables para alivio diario."
    },
    {
      id: "prd-aceite-masaje",
      name: "Aceite Árnica & Eucalipto · 250ml",
      category: "Fisioterapia",
      price: 42.0,
      stock: 9,
      minStock: 5,
      icon: "flame",
      image: "assets/prod-aceite-masaje.jpg",
      description: "Fórmula botánica para descarga muscular y relax."
    },
    {
      id: "prd-serum-facial",
      name: "Kit Sérum Hialurónico + Colágeno",
      category: "Cosmiatría",
      price: 65.0,
      stock: 4,
      minStock: 5,
      icon: "sparkles",
      image: "assets/prod-serum-facial.jpg",
      description: "Hidratación y firmeza domiciliaria post-facial."
    },
    {
      id: "prd-crema-urea",
      name: "Crema Reparadora Urea 10%",
      category: "Podología",
      price: 38.0,
      stock: 14,
      minStock: 5,
      icon: "heart-pulse",
      image: "assets/prod-crema-urea.jpg",
      description: "Hidratación intensiva apta para pie diabético."
    },
    {
      id: "prd-compresa",
      name: "Compresa Térmica de Semillas",
      category: "Fisioterapia",
      price: 45.0,
      stock: 3,
      minStock: 4,
      icon: "sun",
      image: "assets/prod-compresa.jpg",
      description: "Termoterapia cervical y lumbar con lavanda natural."
    }
  ],

  staff: [
    {
      id: "stf-rosario",
      name: "Pod. Rosario Vargas",
      role: "Especialista en Podología Clínica & Láser",
      cabin: "Tda. 2015",
      initials: "RV",
      commissionRate: 0.25,
      specialty: "podologia"
    },
    {
      id: "stf-carlos",
      name: "Lic. Carlos Mendoza",
      role: "Fisioterapeuta & Quiropráctico Deportivo",
      cabin: "Tda. 2013 / 2100",
      initials: "CM",
      commissionRate: 0.30,
      specialty: "masajes"
    },
    {
      id: "stf-valeria",
      name: "Lic. Valeria Quispe",
      role: "Cosmiatra Estética & Aparatología Facial",
      cabin: "Tda. 2101",
      initials: "VQ",
      commissionRate: 0.25,
      specialty: "cosmiatria"
    },
    {
      id: "stf-andrea",
      name: "Andrea Rojas",
      role: "Lashista & Especialista en Micropigmentación",
      cabin: "Tda. 3100",
      initials: "AR",
      commissionRate: 0.28,
      specialty: "mirada"
    },
    {
      id: "stf-beatriz",
      name: "Beatriz Córdova",
      role: "Directora General & Atención al Cliente",
      cabin: "Recepción Central",
      initials: "BC",
      commissionRate: 0.0,
      specialty: "all"
    }
  ],

  clients: [
    {
      id: "cli-1",
      name: "Nancy Berhua Paredes",
      phone: "984 210 331",
      email: "nancy.berhua@gmail.com",
      tier: "Club Ciclista",
      visits: 9,
      totalSpent: 540.0,
      points: 270,
      lastVisit: "Hoy",
      lastService: "Descarga Muscular Deportiva",
      notes: "Triatleta / Club Ciclista Lima. Prefiere sesiones post-ruta con Lic. Carlos y compresas calientes.",
      history: [
        { date: "Hoy", item: "Descarga Muscular Deportiva", amount: 65.0 },
        { date: "Hace 12 días", item: "Ajuste Quiropráctico + TENS", amount: 70.0 },
        { date: "Hace 28 días", item: "Aceite Terapéutico Árnica 250ml", amount: 42.0 }
      ]
    },
    {
      id: "cli-2",
      name: "Rosa Elena Huamán",
      phone: "991 452 819",
      email: "rosa.huaman@hotmail.com",
      tier: "VIP Oro",
      visits: 14,
      totalSpent: 895.0,
      points: 445,
      lastVisit: "Hoy",
      lastService: "Podología + Láser (Sesión 4)",
      notes: "Cliente frecuente desde 2024. Tratamiento láser en pie derecho + compra mensual de Talco Crema de Menta.",
      history: [
        { date: "Hoy", item: "Podología Integral + Láser", amount: 50.0 },
        { date: "Hoy", item: "Talco Crema de Menta (150 gr)", amount: 35.0 },
        { date: "Hace 21 días", item: "Podología Integral + Láser", amount: 50.0 }
      ]
    },
    {
      id: "cli-3",
      name: "Ricardo Vidal Soto",
      phone: "976 301 554",
      email: "rvidal.mtb@gmail.com",
      tier: "Club Ciclista",
      visits: 6,
      totalSpent: 390.0,
      points: 195,
      lastVisit: "Ayer",
      lastService: "Ajuste Quiropráctico & Terapia Física",
      notes: "Team Aquiles Callao. Rehabilitación de rodilla izquierda + descarga mensual.",
      history: [
        { date: "Ayer", item: "Ajuste Quiropráctico & Terapia Física", amount: 70.0 },
        { date: "Hace 18 días", item: "Descarga Muscular Deportiva", amount: 65.0 }
      ]
    },
    {
      id: "cli-4",
      name: "Camila Delgado Ríos",
      phone: "955 812 040",
      email: "camila.delgado@gmail.com",
      tier: "Frecuente",
      visits: 5,
      totalSpent: 415.0,
      points: 205,
      lastVisit: "Hoy",
      lastService: "Limpieza Facial Profunda + LED",
      notes: "Piel mixta sensible. Llegó por promo TikTok 2x1; interesada en Microblading el próximo mes.",
      history: [
        { date: "Hoy", item: "Limpieza Facial Profunda + Punta de Diamante", amount: 50.0 },
        { date: "Hace 30 días", item: "Lifting de Pestañas + Diseño de Cejas", amount: 30.0 }
      ]
    },
    {
      id: "cli-5",
      name: "Jorge Luis Espinoza",
      phone: "942 118 902",
      email: "jespinoza@empresa.pe",
      tier: "VIP Oro",
      visits: 11,
      totalSpent: 720.0,
      points: 360,
      lastVisit: "Hace 25 días",
      lastService: "Ortonixia & Pie Diabético",
      notes: "Control podológico mensual obligatorio (pie diabético). Pendiente recordatorio por WhatsApp.",
      history: [
        { date: "Hace 25 días", item: "Ortonixia & Cuidado Pie Diabético", amount: 80.0 },
        { date: "Hace 55 días", item: "Crema Reparadora Urea 10%", amount: 38.0 }
      ]
    },
    {
      id: "cli-6",
      name: "Fiorella Castro Vega",
      phone: "963 774 128",
      email: "fiorella.cv@gmail.com",
      tier: "Frecuente",
      visits: 4,
      totalSpent: 340.0,
      points: 170,
      lastVisit: "Hoy",
      lastService: "Extensiones de Pestañas 2x1",
      notes: "Trajo a su hermana para promo 2x1. Alta probabilidad de recompra en retoque a los 21 días.",
      history: [
        { date: "Hoy", item: "Extensiones de Pestañas Pelo a Pelo (2x1)", amount: 120.0 }
      ]
    }
  ],

  appointments: [
    {
      id: "APT-101",
      date: "Hoy",
      time: "10:30",
      clientName: "Rosa Elena Huamán",
      clientPhone: "991 452 819",
      serviceId: "srv-podo-laser",
      serviceName: "Podología Integral + Podología Láser",
      cabin: "Tda. 2015",
      staffId: "stf-rosario",
      staffName: "Pod. Rosario Vargas",
      channel: "Web Online",
      paymentMethod: "Yape",
      paid: true,
      amount: 50.0,
      status: "Completada"
    },
    {
      id: "APT-102",
      date: "Hoy",
      time: "11:30",
      clientName: "Nancy Berhua Paredes",
      clientPhone: "984 210 331",
      serviceId: "srv-descarga",
      serviceName: "Descarga Muscular Deportiva",
      cabin: "Tda. 2100",
      staffId: "stf-carlos",
      staffName: "Lic. Carlos Mendoza",
      channel: "WhatsApp",
      paymentMethod: "Plin",
      paid: true,
      amount: 65.0,
      status: "Completada"
    },
    {
      id: "APT-103",
      date: "Hoy",
      time: "12:30",
      clientName: "Camila Delgado Ríos",
      clientPhone: "955 812 040",
      serviceId: "srv-facial-diamante",
      serviceName: "Limpieza Facial Profunda + Punta de Diamante",
      cabin: "Tda. 2101",
      staffId: "stf-valeria",
      staffName: "Lic. Valeria Quispe",
      channel: "TikTok",
      paymentMethod: "Yape",
      paid: true,
      amount: 50.0,
      status: "En Atención"
    },
    {
      id: "APT-104",
      date: "Hoy",
      time: "14:00",
      clientName: "Fiorella Castro Vega",
      clientPhone: "963 774 128",
      serviceId: "srv-pestanas-2x1",
      serviceName: "Extensiones de Pestañas Pelo a Pelo (2x1)",
      cabin: "Tda. 3100",
      staffId: "stf-andrea",
      staffName: "Andrea Rojas",
      channel: "Web Online",
      paymentMethod: "Tarjeta",
      paid: true,
      amount: 120.0,
      status: "Confirmada"
    },
    {
      id: "APT-105",
      date: "Hoy",
      time: "15:30",
      clientName: "Carlos Augusto Neyra",
      clientPhone: "988 123 410",
      serviceId: "srv-quiro",
      serviceName: "Ajuste Quiropráctico & Terapia Física",
      cabin: "Tda. 2013",
      staffId: "stf-carlos",
      staffName: "Lic. Carlos Mendoza",
      channel: "Presencial",
      paymentMethod: "Efectivo",
      paid: false,
      amount: 70.0,
      status: "Confirmada"
    },
    {
      id: "APT-106",
      date: "Hoy",
      time: "17:00",
      clientName: "Patricia Morales Cruz",
      clientPhone: "947 605 220",
      serviceId: "srv-hidro-dermapen",
      serviceName: "Hidrodermoabrasión + Radiofrecuencia",
      cabin: "Tda. 2101",
      staffId: "stf-valeria",
      staffName: "Lic. Valeria Quispe",
      channel: "Web Online",
      paymentMethod: "Yape",
      paid: true,
      amount: 85.0,
      status: "Confirmada"
    }
  ],

  sales: [
    {
      id: "VTA-2041",
      time: "10:48",
      clientName: "Rosa Elena Huamán",
      concept: "Podología Integral + Podología Láser",
      type: "Servicio",
      category: "Podología",
      staffId: "stf-rosario",
      staffName: "Pod. Rosario Vargas",
      method: "Yape",
      channel: "Web Online",
      amount: 50.0
    },
    {
      id: "VTA-2042",
      time: "11:15",
      clientName: "Rosa Elena Huamán",
      concept: "Talco Crema de Menta (150 gr)",
      type: "Producto",
      category: "Tienda Productos",
      staffId: "stf-rosario",
      staffName: "Pod. Rosario Vargas",
      method: "Yape",
      channel: "Caja Local",
      amount: 35.0
    },
    {
      id: "VTA-2043",
      time: "12:20",
      clientName: "Nancy Berhua Paredes",
      concept: "Descarga Muscular Deportiva",
      type: "Servicio",
      category: "Fisio & Masajes",
      staffId: "stf-carlos",
      staffName: "Lic. Carlos Mendoza",
      method: "Plin",
      channel: "Caja Local",
      amount: 65.0
    },
    {
      id: "VTA-2044",
      time: "12:40",
      clientName: "Camila Delgado Ríos",
      concept: "Limpieza Facial Profunda + Punta de Diamante",
      type: "Servicio",
      category: "Cosmiatría",
      staffId: "stf-valeria",
      staffName: "Lic. Valeria Quispe",
      method: "Yape",
      channel: "Caja Local",
      amount: 50.0
    },
    {
      id: "VTA-2045",
      time: "13:05",
      clientName: "Fiorella Castro Vega",
      concept: "Extensiones de Pestañas Pelo a Pelo (2x1)",
      type: "Servicio",
      category: "Cejas & Pestañas",
      staffId: "stf-andrea",
      staffName: "Andrea Rojas",
      method: "Tarjeta",
      channel: "Web Online",
      amount: 120.0
    },
    {
      id: "VTA-2046",
      time: "13:32",
      clientName: "Miguel Ángel Torres",
      concept: "Masaje Relajante Integral + Ventosas & TENS",
      type: "Servicio",
      category: "Fisio & Masajes",
      staffId: "stf-carlos",
      staffName: "Lic. Carlos Mendoza",
      method: "Efectivo",
      channel: "Caja Local",
      amount: 50.0
    },
    {
      id: "VTA-2047",
      time: "13:55",
      clientName: "Patricia Morales Cruz",
      concept: "Hidrodermoabrasión + Radiofrecuencia",
      type: "Servicio",
      category: "Cosmiatría",
      staffId: "stf-valeria",
      staffName: "Lic. Valeria Quispe",
      method: "Yape",
      channel: "Web Online",
      amount: 85.0
    },
    {
      id: "VTA-2048",
      time: "14:10",
      clientName: "Lucía Fernández",
      concept: "Kit Sérum Hialurónico + Velo de Colágeno",
      type: "Producto",
      category: "Tienda Productos",
      staffId: "stf-valeria",
      staffName: "Lic. Valeria Quispe",
      method: "Plin",
      channel: "Tienda Online",
      amount: 65.0
    }
  ]
};
