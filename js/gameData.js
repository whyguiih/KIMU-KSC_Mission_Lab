window.GAME_DATA = {
  specialists: [
    {
      id: 'char1',
      num: 1,
      startRoom: 1,
      startX: 350,
      startY: 470,
      coatColor: '#2563eb',
      accentColor: '#60a5fa',
      capColor: '#dbeafe',
      hairColor: '#5c3a21',
      skinColor: '#f3c6a0',
      segment: { 'pt-BR': 'Segmento de Ciência', 'en-US': 'Science Segment' },
      roomLabel: { 'pt-BR': 'Sala 1: Ciência', 'en-US': 'Room 1: Science' }
    },
    {
      id: 'char2',
      num: 2,
      startRoom: 1,
      startX: 530,
      startY: 470,
      coatColor: '#0d9488',
      accentColor: '#2dd4bf',
      capColor: '#ccfbf1',
      hairColor: '#1e293b',
      skinColor: '#eab68c',
      segment: { 'pt-BR': 'Segmento do Satélite', 'en-US': 'Spacecraft Segment' },
      roomLabel: { 'pt-BR': 'Sala 2: Satélite', 'en-US': 'Room 2: Satellite' }
    },
    {
      id: 'char3',
      num: 3,
      startRoom: 1,
      startX: 750,
      startY: 470,
      coatColor: '#d97706',
      accentColor: '#fbbf24',
      capColor: '#fef3c7',
      hairColor: '#3f2314',
      skinColor: '#d6986a',
      segment: { 'pt-BR': 'Segmento de Solo', 'en-US': 'Ground Segment' },
      roomLabel: { 'pt-BR': 'Sala 3: Rádio e Clima', 'en-US': 'Room 3: Radio & Weather' }
    },
    {
      id: 'char4',
      num: 4,
      startRoom: 1,
      startX: 930,
      startY: 470,
      coatColor: '#dc2626',
      accentColor: '#f87171',
      capColor: '#fee2e2',
      hairColor: '#9a3412',
      skinColor: '#f5ccb0',
      segment: { 'pt-BR': 'Segmento de Lançamento', 'en-US': 'Launch Segment' },
      roomLabel: { 'pt-BR': 'Sala 4: Foguete', 'en-US': 'Room 4: Rocket' }
    }
  ],

  rooms: {
    1: {
      id: 1,
      cml: 'ETAPA 1',
      stage: 1,
      floorColor: '#e9dcc4',
      floorTileAlt: '#dfd0b4',
      wallColor: '#4a6b82',
      wallTrim: '#8b5a2b',
      kscNumbers: [11, 15, 8, 17],
      kscFacilitiesList: [
        { num: 11, name: { 'pt-BR': 'Headquarters (Administração Central KSC)', 'en-US': 'Headquarters (KSC Central Admin)' } },
        { num: 15, name: { 'pt-BR': 'SLSL (Laboratório de Ciências da Vida Espacial)', 'en-US': 'SLSL (Space Life Sciences Lab)' } },
        { num: 8, name: { 'pt-BR': 'O&C (Alojamento de Astronautas e Trajes)', 'en-US': 'O&C (Astronaut Quarters & Suit Room)' } },
        { num: 17, name: { 'pt-BR': 'Visitor Complex (Divulgação Pública e Educação)', 'en-US': 'Visitor Complex (Public Outreach & Education)' } }
      ],
      props: [
        {
          id: 'prop_science',
          sprite: 'prop_science',
          x: 340,
          y: 250,
          w: 144,
          h: 144,
          modalId: 'modal_science',
          label: {
            'pt-BR': 'Bancada 1: Escolher Missão e Sensor',
            'en-US': 'Bench 1: Select Mission & Sensor',
            'es-ES': 'Mesa 1: Elegir Misión y Sensor',
            'fr-FR': 'Poste 1 : Choisir Mission et Capteur',
            'it-IT': 'Banco 1: Scegli Missione e Sensore',
            'de-DE': 'Station 1: Mission & Sensor wählen'
          }
        },
        {
          id: 'prop_board',
          sprite: 'prop_board',
          x: 800,
          y: 250,
          w: 144,
          h: 144,
          modalId: 'modal_board',
          label: {
            'pt-BR': 'Bancada 2: Aprovar Orçamento e Licenças',
            'en-US': 'Bench 2: Approve Budget & Licenses',
            'es-ES': 'Mesa 2: Aprobar Presupuesto y Licencias',
            'fr-FR': 'Poste 2 : Approuver Budget et Licences',
            'it-IT': 'Banco 2: Approva Budget e Licenze',
            'de-DE': 'Station 2: Budget & Lizenzen genehmigen'
          }
        }
      ],
      door: { x: 640, y: 635, w: 180, h: 52 }
    },
    2: {
      id: 2,
      cml: 'ETAPA 2',
      stage: 2,
      floorColor: '#dbeafe',
      floorTileAlt: '#cfe2fc',
      wallColor: '#1e3a5f',
      wallTrim: '#0284c7',
      kscNumbers: [9, 10, 6, 16],
      kscFacilitiesList: [
        { num: 9, name: { 'pt-BR': 'SSPF (Sala Limpa de Montagem de Satélites)', 'en-US': 'SSPF (Space Station Processing Facility)' } },
        { num: 10, name: { 'pt-BR': 'MPPF (Processamento de Cargas Úteis)', 'en-US': 'MPPF (Multi-Payload Processing Facility)' } },
        { num: 6, name: { 'pt-BR': 'LETF (Laboratório de Cabos e Equipamentos)', 'en-US': 'LETF (Launch Equipment Test Facility)' } },
        { num: 16, name: { 'pt-BR': 'Laboratório de Vácuo Térmico e Vibração', 'en-US': 'Thermal Vacuum & Vibration Test Lab' } }
      ],
      props: [
        {
          id: 'prop_cleanroom',
          sprite: 'prop_cleanroom',
          x: 340,
          y: 250,
          w: 144,
          h: 144,
          modalId: 'modal_cleanroom',
          label: {
            'pt-BR': 'Bancada 1: Montar Peças do Satélite',
            'en-US': 'Bench 1: Assemble Satellite Parts',
            'es-ES': 'Mesa 1: Montar Piezas del Satélite',
            'fr-FR': 'Poste 1 : Assembler les Pièces du Satellite',
            'it-IT': 'Banco 1: Assembla Componenti del Satellite',
            'de-DE': 'Station 1: Satellitenteile montieren'
          }
        },
        {
          id: 'prop_shaker',
          sprite: 'prop_shaker',
          x: 800,
          y: 250,
          w: 144,
          h: 144,
          modalId: 'modal_shaker',
          label: {
            'pt-BR': 'Bancada 2: Testes de Vibração e Vácuo',
            'en-US': 'Bench 2: Vibration & Vacuum Tests',
            'es-ES': 'Mesa 2: Pruebas de Vibración y Vacío',
            'fr-FR': 'Poste 2 : Tests de Vibration et Vide',
            'it-IT': 'Banco 2: Test di Vibrazione e Vuoto',
            'de-DE': 'Station 2: Vibrations- & Vakuumtests'
          }
        }
      ],
      door: { x: 640, y: 635, w: 180, h: 52 }
    },
    3: {
      id: 3,
      cml: 'ETAPA 3',
      stage: 3,
      floorColor: '#cbd5e1',
      floorTileAlt: '#bcc8d8',
      wallColor: '#1e293b',
      wallTrim: '#d97706',
      kscNumbers: [12, 2, 13],
      kscFacilitiesList: [
        { num: 12, name: { 'pt-BR': 'CIF (Central de Antenas e Telemetria)', 'en-US': 'CIF (Central Instrumentation Facility)' } },
        { num: 2, name: { 'pt-BR': 'LCC (Centro de Controle de Lançamento)', 'en-US': 'LCC (Launch Control Center)' } },
        { num: 13, name: { 'pt-BR': 'LTA (Radar Meteorológico do Cabo Canaveral)', 'en-US': 'LTA (Weather Radar & Air Traffic)' } }
      ],
      props: [
        {
          id: 'prop_comms',
          sprite: 'prop_comms',
          x: 570,
          y: 245,
          w: 144,
          h: 144,
          modalId: 'modal_comms',
          label: {
            'pt-BR': 'Console Central: Antenas, Clima e Checklist',
            'en-US': 'Central Console: Antennas, Weather & Poll',
            'es-ES': 'Consola Central: Antenas, Clima y Checklist',
            'fr-FR': 'Console Centrale : Antennes, Météo et Checklist',
            'it-IT': 'Console Centrale: Antenne, Meteo e Checklist',
            'de-DE': 'Zentralkonsole: Antennen, Wetter & Checkliste'
          }
        }
      ],
      door: { x: 640, y: 635, w: 180, h: 52 }
    },
    4: {
      id: 4,
      cml: 'ETAPA 4',
      stage: 4,
      floorColor: '#d6d3d1',
      floorTileAlt: '#c7c3c0',
      wallColor: '#334155',
      wallTrim: '#dc2626',
      kscNumbers: [1, 5, 7, 14, 4, 3],
      kscFacilitiesList: [
        { num: 1, name: { 'pt-BR': 'VAB (Prédio de Montagem Vertical de Foguetes)', 'en-US': 'VAB (Vehicle Assembly Building)' } },
        { num: 5, name: { 'pt-BR': 'OPF (Hangar de Processamento Orbital)', 'en-US': 'OPF (Orbiter Processing Facility)' } },
        { num: 7, name: { 'pt-BR': 'RPSF (Preparação de Segmentos de Foguete)', 'en-US': 'RPSF (Rotation & Processing Facility)' } },
        { num: 14, name: { 'pt-BR': 'Dispositivo de Integração Aeroespacial', 'en-US': 'Mate-Demate Device' } },
        { num: 4, name: { 'pt-BR': 'Crawler (Trator Esteira Gigante até a Plataforma)', 'en-US': 'Crawler-Transporter to Launch Pad' } },
        { num: 3, name: { 'pt-BR': 'Plataforma de Lançamento 39A', 'en-US': 'Launch Complex 39A' } }
      ],
      props: [
        {
          id: 'prop_launch',
          sprite: 'prop_launch',
          x: 570,
          y: 245,
          w: 144,
          h: 144,
          modalId: 'modal_launch',
          label: {
            'pt-BR': 'Plataforma 39A: Escolher Foguete e Lançar',
            'en-US': 'Pad 39A: Select Rocket & Launch',
            'es-ES': 'Plataforma 39A: Elegir Cohete y Lanzar',
            'fr-FR': 'Pas de Tir 39A : Choisir Fusée et Lancer',
            'it-IT': 'Rampa 39A: Scegli Razzo e Lancia',
            'de-DE': 'Rampe 39A: Rakete wählen & starten'
          }
        }
      ],
      door: { x: 640, y: 635, w: 180, h: 52 }
    }
  },

  missions: [
    {
      id: 'bisonsat',
      name: { 'pt-BR': 'BisonSat: Florestas e Clima da Terra', 'en-US': 'BisonSat: Earth Forests & Climate' },
      shortTitle: { 'pt-BR': 'BisonSat (Clima e Vegetação)', 'en-US': 'BisonSat (Climate & Forests)' },
      category: { 'pt-BR': 'Ciências da Terra e Meio Ambiente', 'en-US': 'Earth & Environmental Science' },
      budget: 120000,
      allowedOrbits: ['leo', 'polar'],
      requiredPayload: 'cam_vis',
      requiresNOAA: true,
      requiresCMG: false,
      requiresDoubleBurn: false,
      requiredRocket: null,
      description: {
        'pt-BR': 'Observa a superfície terrestre do espaço para medir a saúde das florestas, o derretimento de neve nas montanhas e o uso do solo.',
        'en-US': 'Observes Earth’s surface from space to measure forest health, mountain snowpack melt, and land use.'
      },
      plainWhy: {
        'pt-BR': 'Por que esta missão existe? Cientistas e comunidades indígenas de Montana precisavam monitorar secas, incêndios florestais e o nível de neve nas montanhas usando um satélite pequeno e acessível.',
        'en-US': 'Why does this mission exist? Scientists and Indigenous students in Montana needed an affordable satellite to monitor droughts, forest fires, and mountain snowpack.'
      },
      realStoryWho: {
        'pt-BR': 'Projetado e construído por estudantes universitários do Salish Kootenai College (Montana, EUA), tornando-se o primeiro satélite de uma universidade indígena norte-americana selecionado pela NASA.',
        'en-US': 'Designed and built by students at Salish Kootenai College (Montana, USA), becoming the first Native American Tribal College satellite selected by NASA.'
      },
      realStoryLaunch: {
        'pt-BR': 'Foi lançado em 8 de outubro de 2015 a bordo de um foguete Atlas V na missão ELaNa XI da NASA, entrando em órbita Polar entre 500 e 800 km de altitude.',
        'en-US': 'Launched on October 8, 2015 aboard an Atlas V rocket on NASA’s ELaNa XI mission into a Polar orbit between 500 and 800 km altitude.'
      },
      realStoryImpact: {
        'pt-BR': 'Provou que um pequeno cubo de 10 cm (1U) feito em alumínio com câmera óptica e rádio UHF consegue gerar mapas ambientais reais de 100 metros de resolução.',
        'en-US': 'Proved that a 10 cm (1U) aluminum cube with an optical camera and UHF radio can deliver real 100-meter resolution environmental imagery.'
      },
      nasaRealBenchmark: {
        'pt-BR': 'Na vida real, o BisonSat usou um chassi 1U de Alumínio, Câmera de Luz Visível (100m), rádio UHF e voou em órbita Polar com licença da NOAA.',
        'en-US': 'In real life, BisonSat used a 1U Aluminum chassis, Visible Light Camera (100m), UHF radio, and flew in Polar orbit with a NOAA license.'
      }
    },
    {
      id: 'minxss',
      name: { 'pt-BR': 'MinXSS: Tempestades Solares em Raios-X', 'en-US': 'MinXSS: Solar Storms in X-Rays' },
      shortTitle: { 'pt-BR': 'MinXSS (Tempestades do Sol)', 'en-US': 'MinXSS (Solar Storms)' },
      category: { 'pt-BR': 'Estudo do Sol e Clima Espacial', 'en-US': 'Heliophysics & Space Weather' },
      budget: 180000,
      allowedOrbits: ['leo', 'polar'],
      requiredPayload: 'xray_spec',
      requiresNOAA: false,
      requiresCMG: false,
      requiresDoubleBurn: false,
      requiredRocket: null,
      description: {
        'pt-BR': 'Observa explosões e tempestades na coroa do Sol que podem interferir em sinais de GPS, satélites e redes elétricas na Terra.',
        'en-US': 'Observes solar flares and coronal storms that can disrupt GPS signals, satellites, and power grids on Earth.'
      },
      plainWhy: {
        'pt-BR': 'Por que esta missão existe? Quando o Sol sofre tempestades magnéticas, ele emite raios-X que alteram a atmosfera da Terra e atrapalham comunicações de aviões e sinais de GPS.',
        'en-US': 'Why does this mission exist? When the Sun erupts, it emits X-rays that disturb Earth’s upper atmosphere and disrupt aviation radio and GPS signals.'
      },
      realStoryWho: {
        'pt-BR': 'Construído por mais de 40 estudantes e pesquisadores do laboratório LASP da Universidade do Colorado em Boulder, com apoio da NASA.',
        'en-US': 'Built by over 40 students and researchers at the University of Colorado Boulder (LASP) with NASA support.'
      },
      realStoryLaunch: {
        'pt-BR': 'Lançado em dezembro de 2015 até a Estação Espacial Internacional e ejetado no espaço em maio de 2016 como um CubeSat de tamanho 3U (30 cm) com painéis solares dobráveis.',
        'en-US': 'Launched in December 2015 to the International Space Station and deployed in May 2016 as a 3U (30 cm) CubeSat with foldable solar panels.'
      },
      realStoryImpact: {
        'pt-BR': 'Operou por quase um ano inteiro medindo a temperatura do plasma solar com precisão inédita para um satélite do tamanho de uma caixa de sapatos.',
        'en-US': 'Operated for nearly a year measuring solar flare plasma temperatures with unprecedented precision for a shoebox-sized satellite.'
      },
      nasaRealBenchmark: {
        'pt-BR': 'Na vida real, o MinXSS-1 usou um chassi 3U, Painéis Solares Dobráveis, Bateria Certificada UL e o Espectrômetro Solar de Raios-X.',
        'en-US': 'In real life, MinXSS-1 used a 3U chassis, Foldable Solar Panels, UL-Certified Battery, and the Solar X-Ray Spectrometer.'
      }
    },
    {
      id: 'bionutrients',
      name: { 'pt-BR': 'BioNutrients: Vitaminas no Espaço (ISS)', 'en-US': 'BioNutrients: Space Vitamins (ISS)' },
      shortTitle: { 'pt-BR': 'BioNutrients (Biologia na ISS)', 'en-US': 'BioNutrients (ISS Biology)' },
      category: { 'pt-BR': 'Biologia Espacial para Astronautas', 'en-US': 'Space Biology for Astronauts' },
      budget: 150000,
      allowedOrbits: ['iss'],
      requiredPayload: 'bio_pack',
      requiresNOAA: false,
      requiresCMG: false,
      requiresDoubleBurn: false,
      requiredRocket: 'iss_cargo',
      description: {
        'pt-BR': 'Testa microrganismos em microgravidade capazes de produzir nutrientes e vitaminas frescas para alimentar astronautas em missões longas.',
        'en-US': 'Tests microorganisms in microgravity capable of producing fresh nutrients and vitamins to keep astronauts healthy on long missions.'
      },
      plainWhy: {
        'pt-BR': 'Por que esta missão existe? Vitaminas em comprimidos perdem o efeito após alguns anos. Para viagens de 3 anos a Marte, os astronautas precisarão produzir nutrientes frescos a bordo!',
        'en-US': 'Why does this mission exist? Vitamin pills degrade over time. For multi-year missions to Mars, astronauts need a way to produce fresh nutrients on demand!'
      },
      realStoryWho: {
        'pt-BR': 'Desenvolvido pelo centro NASA Ames Research Center em parceria com o Laboratório de Ciências da Vida Espacial (SLSL) do Kennedy Space Center.',
        'en-US': 'Developed by NASA Ames Research Center in partnership with the Space Life Sciences Lab (SLSL) at Kennedy Space Center.'
      },
      realStoryLaunch: {
        'pt-BR': 'Enviado diretamente para a Estação Espacial Internacional (ISS, a 400 km de altura) a bordo de cápsulas de carga comercial (Cargo Dragon e Cygnus).',
        'en-US': 'Delivered directly to the International Space Station (ISS, at 400 km altitude) aboard commercial resupply spacecraft (Cargo Dragon and Cygnus).'
      },
      realStoryImpact: {
        'pt-BR': 'Demonstrou por 5 anos que leveduras especiais guardadas em pacotes leves (<250g) conseguem ser ativadas com água morna e produzir antioxidantes vitais no espaço.',
        'en-US': 'Demonstrated over 5 years that engineered yeast in lightweight packs (<250g) can be hydrated in microgravity to produce vital antioxidants.'
      },
      nasaRealBenchmark: {
        'pt-BR': 'Na vida real, o BioNutrients voou em cápsula de carga da ISS (400 km) com pacotes biológicos leves (<250g) e sem tanques pressurizados.',
        'en-US': 'In real life, BioNutrients flew on ISS Cargo resupply (400 km) with lightweight biological packs (<250g) and zero pressurized tanks.'
      }
    },
    {
      id: 'halosat',
      name: { 'pt-BR': 'HaloSat: Caçador de Matéria na Via Láctea', 'en-US': 'HaloSat: Milky Way Matter Hunter' },
      shortTitle: { 'pt-BR': 'HaloSat (Astrofísica)', 'en-US': 'HaloSat (Astrophysics)' },
      category: { 'pt-BR': 'Astrofísica e Mistérios do Universo', 'en-US': 'Astrophysics & Cosmic Mysteries' },
      budget: 250000,
      allowedOrbits: ['leo', 'deep'],
      requiredPayload: 'xray_halo',
      requiresNOAA: false,
      requiresCMG: true,
      requiresDoubleBurn: false,
      requiredRocket: null,
      description: {
        'pt-BR': 'Investiga o halo de gás quente de oxigênio ao redor da Via Láctea no espaço profundo, exigindo alta estabilidade de apontamento.',
        'en-US': 'Investigates the hot oxygen gas halo surrounding the Milky Way galaxy in deep space, requiring high pointing stability.'
      },
      plainWhy: {
        'pt-BR': 'Por que esta missão existe? Os astrônomos sabiam que metade da matéria normal do universo estava "escondida". O HaloSat foi criado para achar essa matéria na nuvem quente que envolve a Via Láctea.',
        'en-US': 'Why does this mission exist? Astronomers knew half of the normal matter in the universe was "missing". HaloSat looked for it in the hot gas halo around the Milky Way.'
      },
      realStoryWho: {
        'pt-BR': 'Liderado pela Universidade de Iowa em parceria com o centro Goddard da NASA e a Blue Canyon Technologies, sendo o primeiro CubeSat da divisão de Astrofísica da NASA.',
        'en-US': 'Led by the University of Iowa with NASA Goddard and Blue Canyon Technologies as the first CubeSat funded by NASA’s Astrophysics Division.'
      },
      realStoryLaunch: {
        'pt-BR': 'Lançado em maio de 2018 a partir da Virgínia/KSC como um satélite de 6U (tamanho de uma maleta) equipado com controle de direção de 3 eixos de alta precisão.',
        'en-US': 'Launched in May 2018 as a 6U briefcase-sized satellite equipped with high-precision 3-axis attitude control and deployable solar panels.'
      },
      realStoryImpact: {
        'pt-BR': 'Descobriu que o halo de gás quente da Via Láctea é denso e irregular, ajudando a explicar onde está grande parte da matéria bariônica da nossa galáxia!',
        'en-US': 'Discovered that the Milky Way’s hot gas halo is clumpy and dense, helping account for our galaxy’s missing baryonic matter!'
      },
      nasaRealBenchmark: {
        'pt-BR': 'Na vida real, o HaloSat usou um chassi grande de 6U, Painéis Solares Dobráveis, Giroscópio de 3 Eixos (CMG) e Antena S-Band rápida.',
        'en-US': 'In real life, HaloSat used a large 6U chassis, Foldable Solar Panels, 3-Axis CMG Gyroscope, and a fast S-Band Antenna.'
      }
    },
    {
      id: 'lightsail',
      name: { 'pt-BR': 'LightSail: Navegando com a Luz do Sol', 'en-US': 'LightSail: Sailing on Sunlight' },
      shortTitle: { 'pt-BR': 'LightSail (Vela Solar)', 'en-US': 'LightSail (Solar Sail)' },
      category: { 'pt-BR': 'Novas Tecnologias de Viagem Espacial', 'en-US': 'Next-Gen Space Propulsion' },
      budget: 220000,
      allowedOrbits: ['leo', 'polar'],
      requiredPayload: 'solar_sail',
      requiresNOAA: true,
      requiresCMG: false,
      requiresDoubleBurn: true,
      requiredRocket: null,
      description: {
        'pt-BR': 'Desdobra uma grande vela espelhada no espaço para impulsionar a espaçonave utilizando a pressão da radiação solar e monitorar a abertura com câmeras.',
        'en-US': 'Unfurls a large mirror-like sail in space to propel the spacecraft using solar radiation pressure while monitoring deployment with cameras.'
      },
      plainWhy: {
        'pt-BR': 'Por que esta missão existe? Foguetes precisam carregar muito combustível pesado. Já a luz do Sol empurra objetos suavemente o tempo todo: com uma vela espelhada gigante, um satélite pode viajar sem combustível!',
        'en-US': 'Why does this mission exist? Rockets carry heavy fuel that runs out. Sunlight exerts a gentle, endless push: with a giant mirror sail, a spacecraft can cruise without fuel!'
      },
      realStoryWho: {
        'pt-BR': 'Criado pela organização científica The Planetary Society (fundada por Carl Sagan e liderada por Bill Nye), financiado por mais de 40.000 cidadãos do mundo todo via campanha pública.',
        'en-US': 'Created by The Planetary Society (founded by Carl Sagan and led by Bill Nye), crowdfunded by over 40,000 space enthusiasts worldwide.'
      },
      realStoryLaunch: {
        'pt-BR': 'Lançado a partir do complexo 39A no Kennedy Space Center em junho de 2019 (LightSail 2), abrindo sua vela brilhante de 32 m² a 720 km de altitude.',
        'en-US': 'Launched from Pad 39A at Kennedy Space Center in June 2019 (LightSail 2), unfurling its 32 m² reflective sail at 720 km altitude.'
      },
      realStoryImpact: {
        'pt-BR': 'Tornou-se a primeira espaçonave em órbita da Terra a elevar sua altitude usando exclusivamente a pressão da luz solar, abrindo caminho para futuras sondas solares da NASA.',
        'en-US': 'Became the first spacecraft in Earth orbit to raise its orbit solely using sunlight pressure, paving the way for future NASA solar sail probes.'
      },
      nasaRealBenchmark: {
        'pt-BR': 'Na vida real, o LightSail usou um chassi 3U, Vela Solar de 32 m², Trava Dupla (Double Burn Wire), Campanha Pública e Licença NOAA para suas câmeras.',
        'en-US': 'In real life, LightSail used a 3U chassis, 32 m² Solar Sail, Double Burn Wire retention, Public Crowdfunding, and a NOAA camera license.'
      }
    }
  ],

  chassis: [
    {
      id: '1U',
      name: {
        'pt-BR': '1U (Cubo de 10 cm)',
        'en-US': '1U (10 cm Cube)',
        'es-ES': '1U (Cubo de 10 cm)',
        'fr-FR': '1U (Cube de 10 cm)',
        'it-IT': '1U (Cubo da 10 cm)',
        'de-DE': '1U (10 cm Würfel)'
      },
      units: 1,
      maxMass: 1.33,
      cost: 10000,
      dispenser: 'PPOD',
      desc: {
        'pt-BR': 'Tamanho de uma caneca (10x10x10 cm). Leve e barato, suporta até 1,33 kg.',
        'en-US': 'Coffee-mug size (10x10x10 cm). Light and affordable, holds up to 1.33 kg.',
        'es-ES': 'Tamaño de una taza (10x10x10 cm). Ligero y económico, soporta hasta 1,33 kg.',
        'fr-FR': 'Taille d’une tasse (10x10x10 cm). Léger et économique, supporte jusqu’à 1,33 kg.',
        'it-IT': 'Dimensioni di una tazza (10x10x10 cm). Leggero ed economico, supporta fino a 1,33 kg.',
        'de-DE': 'Tassengröße (10x10x10 cm). Leicht und günstig, trägt bis zu 1,33 kg.'
      }
    },
    {
      id: '1.5U',
      name: {
        'pt-BR': '1.5U (Cubo Médio 17 cm)',
        'en-US': '1.5U (Medium 17 cm Cube)',
        'es-ES': '1.5U (Cubo Medio 17 cm)',
        'fr-FR': '1.5U (Cube Moyen 17 cm)',
        'it-IT': '1.5U (Cubo Medio 17 cm)',
        'de-DE': '1.5U (Mittlerer 17 cm Würfel)'
      },
      units: 1.5,
      maxMass: 2.00,
      cost: 15000,
      dispenser: 'PPOD',
      desc: {
        'pt-BR': 'Um cubo e meio de altura. Suporta até 2,00 kg.',
        'en-US': 'One and a half units tall. Holds up to 2.00 kg.',
        'es-ES': 'Un cubo y medio de altura. Soporta hasta 2,00 kg.',
        'fr-FR': 'Un cube et demi de hauteur. Supporte jusqu’à 2,00 kg.',
        'it-IT': 'Un cubo e mezzo di altezza. Supporta fino a 2,00 kg.',
        'de-DE': 'Eineinhalb Einheiten hoch. Trägt bis zu 2,00 kg.'
      }
    },
    {
      id: '2U',
      name: {
        'pt-BR': '2U (Bloco Duplo 22 cm)',
        'en-US': '2U (Double Block 22 cm)',
        'es-ES': '2U (Bloque Doble 22 cm)',
        'fr-FR': '2U (Bloc Double 22 cm)',
        'it-IT': '2U (Blocco Doppio 22 cm)',
        'de-DE': '2U (Doppelblock 22 cm)'
      },
      units: 2,
      maxMass: 2.66,
      cost: 22000,
      dispenser: 'PPOD',
      desc: {
        'pt-BR': 'Dois cubos empilhados. Suporta até 2,66 kg.',
        'en-US': 'Two stacked cubes. Holds up to 2.66 kg.',
        'es-ES': 'Dos cubos apilados. Soporta hasta 2,66 kg.',
        'fr-FR': 'Deux cubes empilés. Supporte jusqu’à 2,66 kg.',
        'it-IT': 'Due cubi impilati. Supporta fino a 2,66 kg.',
        'de-DE': 'Zwei gestapelte Würfel. Trägt bis zu 2,66 kg.'
      }
    },
    {
      id: '3U',
      name: {
        'pt-BR': '3U (Caixa de Sapatos 34 cm)',
        'en-US': '3U (Shoebox 34 cm)',
        'es-ES': '3U (Caja de Zapatos 34 cm)',
        'fr-FR': '3U (Boîte à Chaussures 34 cm)',
        'it-IT': '3U (Scatola da Scarpe 34 cm)',
        'de-DE': '3U (Schuhkarton 34 cm)'
      },
      units: 3,
      maxMass: 4.00,
      cost: 35000,
      dispenser: 'PPOD',
      desc: {
        'pt-BR': 'Três cubos empilhados (30 cm de comprimento). Suporta até 4,00 kg.',
        'en-US': 'Three stacked cubes (30 cm length). Holds up to 4.00 kg.',
        'es-ES': 'Tres cubos apilados (30 cm de longitud). Soporta hasta 4,00 kg.',
        'fr-FR': 'Trois cubes empilés (30 cm de long). Supporte jusqu’à 4,00 kg.',
        'it-IT': 'Tre cubi impilati (30 cm di lunghezza). Supporta fino a 4,00 kg.',
        'de-DE': 'Drei gestapelte Würfel (30 cm Länge). Trägt bis zu 4,00 kg.'
      }
    },
    {
      id: '6U',
      name: {
        'pt-BR': '6U (Maleta Espacial 36 cm)',
        'en-US': '6U (Space Briefcase 36 cm)',
        'es-ES': '6U (Maletín Espacial 36 cm)',
        'fr-FR': '6U (Mallette Spatiale 36 cm)',
        'it-IT': '6U (Valigetta Spaziale 36 cm)',
        'de-DE': '6U (Raumkoffer 36 cm)'
      },
      units: 6,
      maxMass: 8.00,
      cost: 65000,
      dispenser: 'SSOD_6U',
      desc: {
        'pt-BR': 'Chassi amplo de seis unidades para instrumentos de maior porte. Suporta até 8,00 kg.',
        'en-US': 'Large six-unit frame for heavier instruments. Holds up to 8.00 kg.',
        'es-ES': 'Chasis amplio de seis unidades para instrumentos mayores. Soporta hasta 8,00 kg.',
        'fr-FR': 'Grand châssis de six unités pour instruments plus lourds. Supporte jusqu’à 8,00 kg.',
        'it-IT': 'Ampio telaio da sei unità per strumenti più grandi. Supporta fino a 8,00 kg.',
        'de-DE': 'Großes Sechs-Einheiten-Gehäuse für schwerere Instrumente. Trägt bis zu 8,00 kg.'
      }
    }
  ],

  structures: [
    {
      id: 'al6061',
      name: { 'pt-BR': 'Alumínio Aeroespacial 6061-T6', 'en-US': 'Aerospace Aluminum 6061-T6' },
      mass: 0.25,
      cost: 5000,
      odarPenalty: 0,
      passesODAR: true,
      desc: {
        'pt-BR': 'Liga metálica leve que se desintegra por completo na reentrada atmosférica ao fim da vida útil.',
        'en-US': 'Lightweight alloy that vaporizes completely upon atmospheric reentry at the end of mission life.'
      }
    },
    {
      id: 'titanium',
      name: { 'pt-BR': 'Titânio de Alta Fusão', 'en-US': 'High-Melt Titanium Alloy' },
      mass: 0.40,
      cost: 12000,
      odarPenalty: 15000,
      passesODAR: false,
      desc: {
        'pt-BR': 'Metal de altíssimo ponto de fusão que resiste intacto ao calor da reentrada atmosférica.',
        'en-US': 'Ultra-high melting point metal that survives atmospheric reentry heat intact.'
      }
    }
  ],

  solarPanels: [
    {
      id: 'fixed',
      name: { 'pt-BR': 'Painéis Solares Fixos nas Laterais', 'en-US': 'Fixed Side-Mounted Solar Panels' },
      mass: 0.15,
      powerGen: 4,
      cost: 8000,
      requiresDoubleBurn: false,
      desc: {
        'pt-BR': 'Células solares fixadas diretamente nas paredes do cubo. Geram +4W brutos.',
        'en-US': 'Solar cells mounted directly on the cube walls. Generates +4W raw.'
      }
    },
    {
      id: 'foldable',
      name: { 'pt-BR': 'Painéis Solares Dobráveis (Asas Abertas)', 'en-US': 'Foldable Solar Panel Wings' },
      mass: 0.35,
      powerGen: 10,
      cost: 18000,
      requiresDoubleBurn: true,
      desc: {
        'pt-BR': 'Asas articuladas que se abrem em órbita e geram +10W brutos de potência elétrica.',
        'en-US': 'Hinged wings that unfold in orbit to generate +10W raw electrical power.'
      }
    }
  ],

  batteries: [
    {
      id: 'ul_listed',
      name: { 'pt-BR': 'Bateria de Lítio com Proteção Térmica (UL 1642)', 'en-US': 'Thermal-Protected Lithium Battery (UL 1642)' },
      mass: 0.25,
      cost: 10000,
      ulPenalty: 0,
      isUL: true,
      desc: {
        'pt-BR': 'Células de íons de lítio com circuito integrado de proteção contra sobrecarga e curto-circuito.',
        'en-US': 'Lithium-ion cells with integrated overcharge and short-circuit protection circuitry.'
      }
    },
    {
      id: 'non_ul',
      name: { 'pt-BR': 'Bateria Comercial Compacta', 'en-US': 'Compact Commercial Battery' },
      mass: 0.20,
      cost: 3000,
      ulPenalty: 15000,
      isUL: false,
      desc: {
        'pt-BR': 'Bateria de baixo custo inicial sem certificação prévia de isolamento espacial.',
        'en-US': 'Low upfront cost battery without prior spaceflight containment certification.'
      }
    }
  ],

  adcs: [
    {
      id: 'passive_mag',
      name: { 'pt-BR': 'Ímã Passivo de Alinhamento Magnético', 'en-US': 'Passive Magnetic Alignment Bar' },
      mass: 0.15,
      powerUse: 0,
      cost: 6000,
      solarEfficiency: 0.65,
      highPrecision: false,
      desc: {
        'pt-BR': 'Alinha o satélite pelo campo magnético da Terra sem consumir energia (0W), com 65% de eficiência solar.',
        'en-US': 'Aligns the satellite along Earth’s magnetic field using 0W power, with 65% solar efficiency.'
      }
    },
    {
      id: 'cmg_3axis',
      name: { 'pt-BR': 'Giroscópio 3 Eixos + Sensor de Estrelas (CMG)', 'en-US': '3-Axis Gyroscope + Star Tracker (CMG)' },
      mass: 0.45,
      powerUse: 2,
      cost: 25000,
      solarEfficiency: 1.0,
      highPrecision: true,
      desc: {
        'pt-BR': 'Sistema ativo de apontamento fino em 3 eixos com 100% de eficiência solar e consumo de 2W.',
        'en-US': 'Active 3-axis fine pointing system with 100% solar efficiency and 2W power consumption.'
      }
    }
  ],

  payloads: [
    {
      id: 'cam_vis',
      name: { 'pt-BR': 'Câmera Óptica de Luz Visível (100m)', 'en-US': 'Visible Light Optical Camera (100m)' },
      mass: 0.30,
      powerUse: 2,
      dataMB: 50,
      basePoints: 150,
      cost: 20000,
      requiresNOAA: true,
      forMissionId: 'bisonsat',
      desc: {
        'pt-BR': 'Captura imagens ópticas de superfície, vegetação e cobertura de neve. Gera 50 MB de dados por dia.',
        'en-US': 'Captures optical imagery of surface terrain, vegetation, and snow cover. Generates 50 MB/day.'
      }
    },
    {
      id: 'xray_spec',
      name: { 'pt-BR': 'Espectrômetro Solar de Raios-X', 'en-US': 'Solar X-Ray Spectrometer' },
      mass: 0.50,
      powerUse: 4,
      dataMB: 80,
      basePoints: 220,
      cost: 35000,
      requiresNOAA: false,
      forMissionId: 'minxss',
      desc: {
        'pt-BR': 'Mede o espectro de raios-X emitido por erupções e tempestades solares. Gera 80 MB de dados por dia.',
        'en-US': 'Measures the X-ray spectrum emitted by solar flares and storms. Generates 80 MB/day.'
      }
    },
    {
      id: 'bio_pack',
      name: { 'pt-BR': 'Incubadora Biológica Microbiana (<250g)', 'en-US': 'Microbial Biological Incubator (<250g)' },
      mass: 0.24,
      powerUse: 3,
      dataMB: 25,
      basePoints: 200,
      cost: 30000,
      requiresNOAA: false,
      forMissionId: 'bionutrients',
      desc: {
        'pt-BR': 'Câmara de hidratação e cultivo de microrganismos produtores de nutrientes. Gera 25 MB/dia.',
        'en-US': 'Hydration and growth chamber for nutrient-producing microorganisms. Generates 25 MB/day.'
      }
    },
    {
      id: 'xray_halo',
      name: { 'pt-BR': 'Detector Astrofísico de Halo Galáctico', 'en-US': 'Galactic Halo Astrophysical Detector' },
      mass: 0.65,
      powerUse: 5,
      dataMB: 140,
      basePoints: 300,
      cost: 45000,
      requiresNOAA: false,
      forMissionId: 'halosat',
      desc: {
        'pt-BR': 'Sensor de campo amplo para mapear emissões de oxigênio quente no espaço profundo. Gera 140 MB/dia.',
        'en-US': 'Wide-field sensor to map hot oxygen emissions in deep space. Generates 140 MB/day.'
      }
    },
    {
      id: 'solar_sail',
      name: { 'pt-BR': 'Vela Solar Espelhada de 32 m² + Câmera', 'en-US': '32 m² Mirror Solar Sail + Camera' },
      mass: 0.80,
      powerUse: 2,
      dataMB: 60,
      basePoints: 260,
      cost: 40000,
      requiresNOAA: true,
      forMissionId: 'lightsail',
      desc: {
        'pt-BR': 'Membrana refletora ultrafina de Mylar impulsionada pela luz solar com câmera de diagnóstico. Gera 60 MB/dia.',
        'en-US': 'Ultra-thin reflective Mylar membrane propelled by sunlight with diagnostic camera. Generates 60 MB/day.'
      }
    }
  ],

  groundStations: [
    {
      id: 'vhf',
      name: { 'pt-BR': 'Antena VHF 140 MHz (Baixa Potência)', 'en-US': 'VHF 140 MHz Antenna (Low Power)' },
      downlinkMB: 25,
      powerUse: 1,
      cost: 5000,
      desc: {
        'pt-BR': 'Rádio de baixo consumo (-1W) com taxa de transmissão de até 25 MB por dia.',
        'en-US': 'Low-power radio (-1W) with a downlink rate of up to 25 MB per day.'
      }
    },
    {
      id: 'uhf',
      name: { 'pt-BR': 'Antena UHF 437 MHz (Média Capacidade)', 'en-US': 'UHF 437 MHz Antenna (Medium Capacity)' },
      downlinkMB: 85,
      powerUse: 2,
      cost: 12000,
      desc: {
        'pt-BR': 'Transmissor intermediário (-2W de consumo) capaz de enviar até 85 MB de dados por dia.',
        'en-US': 'Medium-rate transmitter (-2W draw) capable of sending up to 85 MB of data per day.'
      }
    },
    {
      id: 'sband',
      name: { 'pt-BR': 'Antena S-Band 2.4 GHz (Alta Velocidade)', 'en-US': 'S-Band 2.4 GHz Antenna (High Speed)' },
      downlinkMB: 200,
      powerUse: 4,
      cost: 35000,
      desc: {
        'pt-BR': 'Link de alta largura de banda (-4W de consumo) capaz de transmitir até 200 MB por dia.',
        'en-US': 'High-bandwidth link (-4W draw) capable of transmitting up to 200 MB per day.'
      }
    }
  ],

  orbits: [
    {
      id: 'iss',
      name: { 'pt-BR': 'Órbita da Estação Espacial ISS (400 km)', 'en-US': 'Space Station ISS Orbit (400 km)' },
      shortName: { 'pt-BR': 'ISS (400 km)', 'en-US': 'ISS (400 km)' },
      altitudeKm: 400,
      inclinationDeg: 51.6,
      lifetime: { 'pt-BR': '6 a 18 meses no espaço', 'en-US': '6 to 18 months in space' },
      radiation: { 'pt-BR': 'Baixa radiação (protegida pelo campo da Terra)', 'en-US': 'Low radiation (protected by Earth’s field)' },
      coverage: { 'pt-BR': 'Acompanha a altitude da Estação Espacial Internacional a 400 km.', 'en-US': 'Follows the altitude of the International Space Station at 400 km.' }
    },
    {
      id: 'leo',
      name: { 'pt-BR': 'Órbita Baixa da Terra: LEO (550 km)', 'en-US': 'Low Earth Orbit: LEO (550 km)' },
      shortName: { 'pt-BR': 'LEO (550 km)', 'en-US': 'LEO (550 km)' },
      altitudeKm: 550,
      inclinationDeg: 45.0,
      lifetime: { 'pt-BR': '3 a 7 anos no espaço', 'en-US': '3 to 7 years in space' },
      radiation: { 'pt-BR': 'Radiação moderada', 'en-US': 'Moderate radiation' },
      coverage: { 'pt-BR': 'Passa sobre regiões de média latitude várias vezes ao dia.', 'en-US': 'Passes over mid-latitude regions multiple times a day.' }
    },
    {
      id: 'polar',
      name: { 'pt-BR': 'Órbita Polar Sol-Síncrona: SSO (680 km)', 'en-US': 'Sun-Synchronous Polar Orbit: SSO (680 km)' },
      shortName: { 'pt-BR': 'Polar (680 km)', 'en-US': 'Polar (680 km)' },
      altitudeKm: 680,
      inclinationDeg: 98.1,
      lifetime: { 'pt-BR': '10 a 18 anos no espaço', 'en-US': '10 to 18 years in space' },
      radiation: { 'pt-BR': 'Moderada a alta nos polos', 'en-US': 'Moderate-high over the poles' },
      coverage: { 'pt-BR': 'Cruza de polo a polo cobrindo toda a superfície planetária sob iluminação constante.', 'en-US': 'Flies pole-to-pole covering the entire planetary surface under consistent lighting.' }
    },
    {
      id: 'deep',
      name: { 'pt-BR': 'Órbita Lunar / Espaço Profundo (384.400 km)', 'en-US': 'Lunar / Deep Space Orbit (384,400 km)' },
      shortName: { 'pt-BR': 'Espaço Profundo', 'en-US': 'Deep Space' },
      altitudeKm: 384400,
      inclinationDeg: 28.5,
      lifetime: { 'pt-BR': 'Permanente', 'en-US': 'Permanent' },
      radiation: { 'pt-BR': 'Alta radiação espacial', 'en-US': 'High deep-space radiation' },
      coverage: { 'pt-BR': 'Trajetória além da magnetosfera terrestre, longe da interferência luminosa da Terra.', 'en-US': 'Trajectory beyond Earth’s magnetosphere, far from terrestrial light interference.' }
    }
  ],

  rockets: [
    {
      id: 'iss_cargo',
      name: { 'pt-BR': 'Cápsula de Carga da ISS (Dragon / Cygnus)', 'en-US': 'ISS Cargo Capsule (Dragon / Cygnus)' },
      allowedOrbits: ['iss'],
      maxUnits: 6,
      cost: 0,
      csliCovered: true,
      desc: {
        'pt-BR': 'Transporte pressurizado de carga até a Estação Espacial (400 km), para satélites de até 6U.',
        'en-US': 'Pressurized cargo transport to the Space Station (400 km), for satellites up to 6U.'
      }
    },
    {
      id: 'minotaur',
      name: { 'pt-BR': 'Foguete Minotaur IV (Carona até 3U)', 'en-US': 'Minotaur IV Rocket (Rideshare up to 3U)' },
      allowedOrbits: ['leo', 'polar'],
      maxUnits: 3,
      cost: 0,
      csliCovered: true,
      desc: {
        'pt-BR': 'Vai para órbita LEO ou Polar com custo $0 (pago pela NASA), mas só aceita satélites pequenos de até 3U.',
        'en-US': 'Flies to LEO or Polar orbit at $0 cost (NASA covered), but only fits satellites up to 3U.'
      }
    },
    {
      id: 'falcon9',
      name: { 'pt-BR': 'Falcon 9 / Atlas V (Carona Espacial NASA)', 'en-US': 'Falcon 9 / Atlas V (NASA Rideshare)' },
      allowedOrbits: ['leo', 'polar'],
      maxUnits: 6,
      cost: 0,
      csliCovered: true,
      desc: {
        'pt-BR': 'O mais versátil! Leva satélites de 1U até 6U para órbita LEO ou Polar com custo $0 (100% coberto pelo patrocínio CSLI da NASA).',
        'en-US': 'Most versatile! Carries 1U up to 6U satellites to LEO or Polar orbit at $0 cost (100% covered by NASA CSLI grant).'
      }
    },
    {
      id: 'electron',
      name: { 'pt-BR': 'Rocket Lab Electron (Voo Comercial Dedicado)', 'en-US': 'Rocket Lab Electron (Dedicated Commercial)' },
      allowedOrbits: ['leo', 'polar'],
      maxUnits: 6,
      cost: 60000,
      csliCovered: false,
      desc: {
        'pt-BR': 'Foguete exclusivo para pequenos satélites em órbita LEO ou Polar (até 6U). Custa $60.000 do orçamento da missão.',
        'en-US': 'Dedicated small-satellite launcher for LEO or Polar orbit (up to 6U). Costs $60,000 from mission budget.'
      }
    },
    {
      id: 'sls',
      name: { 'pt-BR': 'Superfoguete NASA SLS (Missões Artemis)', 'en-US': 'NASA SLS Mega-Rocket (Artemis Missions)' },
      allowedOrbits: ['deep', 'leo'],
      maxUnits: 6,
      cost: 110000,
      csliCovered: false,
      desc: {
        'pt-BR': 'O maior foguete da NASA na Plataforma 39B/39A! Único capaz de levar seu CubeSat para a Órbita Lunar / Espaço Profundo ($110.000).',
        'en-US': 'NASA’s mega-rocket at Pad 39B/39A! The only vehicle able to send your CubeSat to Lunar / Deep Space orbit ($110,000).'
      }
    }
  ],

  glossaryTerms: [
    {
      id: 'term_cubesat',
      title: { 'pt-BR': 'O que é 1U, 3U e 6U?', 'en-US': 'What are 1U, 3U, and 6U?' },
      text: {
        'pt-BR': 'É o tamanho do satélite! "1U" significa 1 Unidade: um cubo de 10x10x10 cm (até 1,33 kg). Um "3U" equivale a 3 cubos empilhados (como uma caixa de sapatos, até 4 kg) e "6U" tem o tamanho de uma maleta (até 8 kg).',
        'en-US': 'It is the satellite size! "1U" means 1 Unit: a 10x10x10 cm cube (up to 1.33 kg). A "3U" is 3 stacked cubes (shoebox size, up to 4 kg) and "6U" is briefcase-sized (up to 8 kg).'
      }
    },
    {
      id: 'term_power',
      title: { 'pt-BR': 'Como funciona a Energia (W)?', 'en-US': 'How does Power (W) work?' },
      text: {
        'pt-BR': 'Os painéis solares geram energia em Watts (+W), enquanto a câmera, o giroscópio e a antena gastam energia (-W). Se o saldo ficar negativo (ex: -2W), a bateria descarrega no espaço! Para resolver, use Painéis Dobráveis na Sala 2.',
        'en-US': 'Solar panels generate power in Watts (+W), while the camera, gyroscope, and antenna consume power (-W). If the balance is negative (e.g. -2W), the battery dies in space! Fix it by picking Foldable Solar Panels in Room 2.'
      }
    },
    {
      id: 'term_orbit',
      title: { 'pt-BR': 'O que são Órbitas ISS, LEO e Polar?', 'en-US': 'What are ISS, LEO, and Polar Orbits?' },
      text: {
        'pt-BR': 'É o caminho que o satélite faz ao redor da Terra. A órbita da ISS fica a 400 km de altura; a LEO fica a 550 km; e a Polar (680 km) passa pelos polos Norte e Sul, permitindo fotografar o planeta inteiro.',
        'en-US': 'It is the path the satellite takes around Earth. ISS orbit is at 400 km altitude; LEO is at 550 km; and Polar (680 km) flies over the North and South poles to photograph the entire planet.'
      }
    },
    {
      id: 'term_tests',
      title: { 'pt-BR': 'Por que fazemos testes Shaker e TVAC?', 'en-US': 'Why run Shaker and TVAC tests?' },
      text: {
        'pt-BR': 'O Shaker sacode o satélite com força para simular o tremor do foguete na decolagem. Já a câmara TVAC retira todo o ar e alterna frio e calor extremos (-40°C a +80°C) para garantir que nada vai travar no vácuo do espaço.',
        'en-US': 'The Shaker violently vibrates the satellite to simulate rocket launch tremors. The TVAC chamber removes all air and cycles extreme temperatures (-40°C to +80°C) so nothing freezes or overheats in space.'
      }
    },
    {
      id: 'term_licenses',
      title: { 'pt-BR': 'O que são as licenças NOAA e FCC?', 'en-US': 'What are NOAA and FCC licenses?' },
      text: {
        'pt-BR': 'Todo satélite precisa seguir leis internacionais: a NOAA autoriza câmeras que tiram fotos da Terra, e a FCC/IARU reserva a frequência de rádio para o seu satélite não interferir em outros.',
        'en-US': 'Every satellite follows space law: NOAA authorizes cameras that photograph Earth, and the FCC/IARU coordinates radio frequencies so your satellite does not jam others.'
      }
    }
  ],

  nasaFacts: [
    {
      title: { 'pt-BR': 'O que significa CSLI na NASA?', 'en-US': 'What is NASA’s CSLI?' },
      text: {
        'pt-BR': 'A sigla CSLI significa "CubeSat Launch Initiative". Por meio desse programa no Kennedy Space Center, a NASA oferece carona gratuita em foguetes reais para satélites construídos por estudantes e universidades!',
        'en-US': 'CSLI stands for "CubeSat Launch Initiative". Through this program at Kennedy Space Center, NASA provides free rocket rideshares for satellites built by students and universities!'
      }
    },
    {
      title: { 'pt-BR': 'Por que existe o pino "Remova Antes do Voo"?', 'en-US': 'Why the "Remove Before Flight" pin?' },
      text: {
        'pt-BR': 'O pino RBF com fita vermelha trava toda a bateria do satélite enquanto os engenheiros trabalham nele. Antes de fechar a porta do foguete, é obrigatório retirar esse pino para o satélite poder ligar no espaço!',
        'en-US': 'The red-tagged RBF pin disconnects the battery while engineers work on the satellite. Before closing the rocket fairing, technicians must pull this pin so the satellite can turn on in space!'
      }
    },
    {
      title: { 'pt-BR': 'O Prédio VAB tem seu próprio clima!', 'en-US': 'The VAB Building has its own weather!' },
      text: {
        'pt-BR': 'O prédio de montagem de foguetes (Vehicle Assembly Building) no Kennedy Space Center é tão alto (160 metros) que, em dias úmidos na Flórida, nuvens de chuva podiam se formar perto do teto se a ventilação fosse desligada.',
        'en-US': 'The Vehicle Assembly Building at Kennedy Space Center is so tall (160 meters) that on humid Florida days, rain clouds can form near the ceiling without its giant air conditioners!'
      }
    },
    {
      title: { 'pt-BR': 'A regra dos 25 anos contra o lixo espacial', 'en-US': 'The 25-year space debris rule' },
      text: {
        'pt-BR': 'A NASA exige o relatório ODAR: todo CubeSat precisa ser feito de materiais como o Alumínio, que derretem completamente ao cair de volta na atmosfera, evitando que pedaços atinjam o solo.',
        'en-US': 'NASA enforces the ODAR debris rule: CubeSats must use materials like Aluminum that vaporize completely when reentering the atmosphere, ensuring zero debris hits the ground.'
      }
    },
    {
      title: { 'pt-BR': 'O Trator Crawler pesa 2.700 toneladas', 'en-US': 'The Crawler weighs 2,700 tons' },
      text: {
        'pt-BR': 'Para levar o foguete do hangar VAB até a Plataforma 39A sem derrubá-lo, o trator de esteiras Crawler anda a apenas 1,6 km/h sobre um caminho de pedras de rio do Alabama que absorvem faíscas e vibrações.',
        'en-US': 'To carry the rocket from the VAB to Pad 39A without tipping it over, the Crawler-Transporter creeps at just 1 mph over a roadbed of Alabama river rock.'
      }
    }
  ],

  getSpecialistGuidance(roomNum, state, evalData) {
    if (!evalData.powerOk) {
      return {
        charId: 'char2',
        mood: 'warn',
        text: {
          'pt-BR': `Atenção! O saldo de energia está negativo (${evalData.powerBalanceW}W): os componentes consomem mais potência do que o sistema gera. Ajuste os equipamentos na Sala 2 ou Sala 3.`,
          'en-US': `Warning! Power balance is negative (${evalData.powerBalanceW}W): components draw more power than the system generates. Adjust your configuration in Room 2 or Room 3.`
        }
      };
    }

    if (!evalData.massOk) {
      return {
        charId: 'char2',
        mood: 'warn',
        text: {
          'pt-BR': `Cuidado! O satélite pesa ${evalData.totalMass} kg, acima do limite de ${evalData.maxMass} kg do chassi atual. Revise o chassi ou os componentes na Sala 2.`,
          'en-US': `Careful! The satellite weighs ${evalData.totalMass} kg, exceeding the ${evalData.maxMass} kg limit of the current chassis. Review the chassis or components in Room 2.`
        }
      };
    }

    if (roomNum === 1) {
      if (!state.meritReviewPassed || !state.feasibilityReviewPassed || (evalData.noaaRequired && !state.noaaLicenseApproved)) {
        return {
          charId: 'char1',
          mood: 'normal',
          text: {
            'pt-BR': `Olá! Eu sou a Dra. Elena. Na Bancada 1 (esquerda) você escolhe qual missão da NASA vamos construir e o sensor dela. Depois, clique na Bancada 2 (direita) para aprovar as revisões e a licença NOAA!`,
            'en-US': `Hi! I'm Dr. Elena. At Bench 1 (left) you choose which NASA mission we're building and its sensor. Then click Bench 2 (right) to approve the reviews and NOAA license!`
          }
        };
      }
      return {
        charId: 'char1',
        mood: 'ok',
        text: {
          'pt-BR': `Excelente! A parte científica e as licenças da Sala 1 já estão aprovadas. Agora clique no botão "2. Satélite" lá no topo (ou vá até a porta) para montar o satélite na Sala 2!`,
          'en-US': `Great job! Room 1 science and licenses are approved. Now click "2. Satellite" on the top bar (or walk to the door) to assemble the satellite in Room 2!`
        }
      };
    }

    if (roomNum === 2) {
      if (!evalData.allTestsPassed) {
        return {
          charId: 'char2',
          mood: 'normal',
          text: {
            'pt-BR': `Oi, sou o Dr. Marcus! Na Bancada 1 (esquerda) você escolhe o tamanho do cubo e os painéis solares. Quando terminar, vá na Bancada 2 (direita) e clique em "Aprovar Todos os Testes" para certificar o satélite!`,
            'en-US': `Hi, I'm Dr. Marcus! At Bench 1 (left) you pick the cube size and solar panels. Once done, open Bench 2 (right) and click "Run All Tests" to certify the satellite!`
          }
        };
      }
      return {
        charId: 'char2',
        mood: 'ok',
        text: {
          'pt-BR': `Tudo aprovado na Sala 2! Nosso CubeSat passou nos 4 testes ambientais sem quebrar. Clique em "3. Testes" no topo para configurar o rádio e o clima na Sala 3!`,
          'en-US': `Everything passed in Room 2! Our CubeSat survived all 4 environmental tests. Click "3. Testing" on the top bar to configure radio and weather in Room 3!`
        }
      };
    }

    if (roomNum === 3) {
      if (!state.fccLicenseApproved || state.weatherStatus !== 'clear') {
        return {
          charId: 'char3',
          mood: 'normal',
          text: {
            'pt-BR': `Bem-vindo ao Controle, sou a Com. Sarah! Abra o Console Central: na aba "Rádio" aprove a Licença FCC, e na aba "Clima" clique em aguardar janela limpa para afastar a tempestade da plataforma!`,
            'en-US': `Welcome to Control, I'm Cmdr. Sarah! Open the Central Console: in the "Radio" tab approve the FCC License, and in the "Weather" tab clear the storm over the launch pad!`
          }
        };
      }
      return {
        charId: 'char3',
        mood: 'ok',
        text: {
          'pt-BR': `Frequência de rádio autorizada e céu limpo no Cabo Canaveral! Agora clique em "4. Foguete" na barra superior para ir ao hangar de lançamento na Sala 4!`,
          'en-US': `Radio frequency cleared and blue skies over Cape Canaveral! Now click "4. Rocket" on the top bar to head to the launch hangar in Room 4!`
        }
      };
    }

    if (!evalData.readyForLaunch) {
      return {
        charId: 'char4',
        mood: 'normal',
        text: {
          'pt-BR': `Aqui é o Eng. Roberto na Plataforma 39A! Abra a bancada do foguete: confira se a órbita e o foguete combinam com a missão e clique nos 3 botões de preparação final (Dispensador, Pino RBF e Trator Crawler).`,
          'en-US': `Eng. Roberto at Pad 39A here! Open the rocket bench: verify the orbit and rocket match our mission, then click the 3 final prep steps (Dispenser, RBF Pin, and Crawler).`
        }
      };
    }

    return {
      charId: 'char4',
      mood: 'ok',
      text: {
        'pt-BR': `TUDO PRONTO PARA DECOLAGEM! Todos os 8 sistemas da NASA estão "GO". Abra a bancada da Plataforma 39A e aperte o botão de Lançamento para ver nosso satélite subir ao espaço!`,
        'en-US': `READY FOR LIFTOFF! All 8 NASA systems are "GO". Open the Pad 39A bench and press Launch to watch our satellite blast into orbit!`
      }
    };
  },

  createInitialMissionState() {
    return {
      sandboxMode: false,
      missionDay: 1,
      factIndex: 0,
      introSeen: false,

      missionId: 'bisonsat',
      payloadId: 'cam_vis',
      customGrantBonus: 0,
      customOrbitOverride: '',
      meritReviewPassed: false,
      feasibilityReviewPassed: false,
      outreachCompleted: false,
      noaaLicenseApproved: false,

      chassisId: '1U',
      structureId: 'al6061',
      solarId: 'fixed',
      batteryId: 'ul_listed',
      adcsId: 'passive_mag',
      hasPropulsion: false,
      rbfInstalledInLab: true,
      separationSwitches: true,
      cdhInstalled: true,
      burnWireType: 'double',
      shakerReworkPenalty: 0,
      testsInvalidatedByChange: false,
      tests: {
        cac: false,
        shaker: false,
        tvac: false,
        ditl: false
      },

      groundStationId: 'vhf',
      fccLicenseApproved: false,
      weatherStatus: 'storm',
      weatherScrubCount: 0,
      activeCommsTab: 'comms',

      orbitId: 'polar',
      rocketId: 'falcon9',
      dispenserLoaded: false,
      rbfRemovedAtPad: false,
      crawlerTransported: false,
      launched: false,
      firstContactDecoded: false
    };
  },

  evaluateSimulation(state) {
    const mission = this.missions.find((m) => m.id === state.missionId) || this.missions[0];
    const payload = this.payloads.find((p) => p.id === state.payloadId) || this.payloads[0];
    const chassis = this.chassis.find((c) => c.id === state.chassisId) || this.chassis[0];
    const structure = this.structures.find((s) => s.id === state.structureId) || this.structures[0];
    const solar = this.solarPanels.find((s) => s.id === state.solarId) || this.solarPanels[0];
    const battery = this.batteries.find((b) => b.id === state.batteryId) || this.batteries[0];
    const adcs = this.adcs.find((a) => a.id === state.adcsId) || this.adcs[0];
    const ground = this.groundStations.find((g) => g.id === state.groundStationId) || this.groundStations[0];
    const orbit = this.orbits.find((o) => o.id === state.orbitId) || this.orbits[0];
    const rocket = this.rockets.find((r) => r.id === state.rocketId) || this.rockets[0];

    const propulsionMass = state.hasPropulsion ? 0.35 : 0;
    const totalMass = Number(
      (structure.mass + solar.mass + battery.mass + adcs.mass + payload.mass + propulsionMass).toFixed(2)
    );
    const maxMass = chassis.maxMass;
    const massOk = totalMass <= maxMass;

    const effectiveSolarW = Math.round(solar.powerGen * adcs.solarEfficiency);
    const totalPowerUseW = adcs.powerUse + payload.powerUse + ground.powerUse;
    const powerBalanceW = effectiveSolarW - totalPowerUseW;
    const powerOk = powerBalanceW >= 0;

    const generatedMB = payload.dataMB;
    const downlinkMB = ground.downlinkMB;
    const dataEfficiency = Math.min(1.0, downlinkMB / Math.max(1, generatedMB));
    const dataEfficiencyPct = Math.round(dataEfficiency * 100);

    const partsCost =
      chassis.cost +
      structure.cost +
      solar.cost +
      battery.cost +
      adcs.cost +
      payload.cost +
      ground.cost +
      (state.hasPropulsion ? 15000 : 0);

    const penaltiesCost =
      structure.odarPenalty +
      battery.ulPenalty +
      (state.shakerReworkPenalty || 0);

    const mrrTravelCost = 5000;
    const rocketCost = rocket.cost;
    const totalCost = partsCost + penaltiesCost + rocketCost + mrrTravelCost;

    const totalBudget =
      mission.budget +
      (state.outreachCompleted ? 40000 : 0) +
      (Number(state.customGrantBonus) || 0);

    const remainingBudget = totalBudget - totalCost;
    const reserveRatio = totalBudget > 0 ? remainingBudget / totalBudget : 0;
    const reservePct = Number((reserveRatio * 100).toFixed(1));
    const budgetOk = state.sandboxMode ? true : remainingBudget >= 0;
    const reserveOk = state.sandboxMode ? true : reserveRatio >= 0.10;

    const payloadMatchesMission = state.payloadId === mission.requiredPayload;
    const noaaRequired = Boolean(mission.requiresNOAA || payload.requiresNOAA);
    const noaaOk = !noaaRequired || state.noaaLicenseApproved;
    const cmgOk = !mission.requiresCMG || adcs.highPrecision;
    const doubleBurnRequired = Boolean(mission.requiresDoubleBurn || solar.requiresDoubleBurn);
    const burnWireOk = !doubleBurnRequired || state.burnWireType === 'double';

    const effectiveAllowedOrbits = state.customOrbitOverride
      ? [state.customOrbitOverride]
      : mission.allowedOrbits;
    const orbitMatchesMission = effectiveAllowedOrbits.includes(state.orbitId);
    const rocketSupportsOrbit = rocket.allowedOrbits.includes(state.orbitId);
    const rocketSupportsSize = chassis.units <= rocket.maxUnits;
    const rocketMatchesMissionRule = !mission.requiredRocket || state.rocketId === mission.requiredRocket;
    const propulsionAllowedOnRocket = !(state.hasPropulsion && state.rocketId === 'iss_cargo');

    const allTestsPassed =
      state.tests.cac &&
      state.tests.shaker &&
      state.tests.tvac &&
      state.tests.ditl &&
      !state.testsInvalidatedByChange;

    const stageWord = typeof window.t === 'function' ? window.t('hud_stage') : 'ETAPA';
    let stageNum = 1;
    if (state.meritReviewPassed && state.feasibilityReviewPassed && payloadMatchesMission) {
      stageNum = 2;
    }
    if (stageNum === 2 && allTestsPassed && massOk && powerOk) {
      stageNum = 3;
    }
    if (
      stageNum === 3 &&
      state.fccLicenseApproved &&
      state.weatherStatus === 'clear' &&
      state.dispenserLoaded &&
      state.rbfRemovedAtPad &&
      state.crawlerTransported
    ) {
      stageNum = 4;
    }
    const currentCML = `${stageWord} ${stageNum}`;

    const pollGates = [
      {
        id: 'gate_science',
        station: 'Sala 1: Ciência',
        ok: state.meritReviewPassed && state.feasibilityReviewPassed && payloadMatchesMission,
        label: {
          'pt-BR': 'Sala 1: Revisões científicas aprovadas e sensor correto escolhido',
          'en-US': 'Room 1: Science reviews approved and matching sensor selected'
        }
      },
      {
        id: 'gate_noaa',
        station: 'Sala 1: Licença NOAA',
        ok: noaaOk,
        label: {
          'pt-BR': noaaRequired
            ? 'Sala 1: Licença de câmera NOAA aprovada'
            : 'Sala 1: Licença NOAA (isenta para esta missão)',
          'en-US': noaaRequired
            ? 'Room 1: NOAA camera license approved'
            : 'Room 1: NOAA license (exempt for this mission)'
        }
      },
      {
        id: 'gate_mel',
        station: 'Sala 2: Montagem',
        ok: massOk && powerOk && cmgOk && budgetOk && reserveOk,
        label: {
          'pt-BR': 'Sala 2: Peso dentro do limite, Energia positiva e Orçamento com 10% de reserva',
          'en-US': 'Room 2: Mass within limit, positive Power, and 10% budget reserve'
        }
      },
      {
        id: 'gate_tests',
        station: 'Sala 2: 4 Testes',
        ok: allTestsPassed,
        label: {
          'pt-BR': 'Sala 2: Todos os 4 testes ambientais aprovados (Checklist, Vibração, Vácuo e Bateria)',
          'en-US': 'Room 2: All 4 environmental tests approved (Checklist, Shaker, Vacuum, and Battery)'
        }
      },
      {
        id: 'gate_comms',
        station: 'Sala 3: Rádio FCC',
        ok: state.fccLicenseApproved,
        label: {
          'pt-BR': 'Sala 3: Frequência de rádio FCC registrada',
          'en-US': 'Room 3: FCC radio frequency registered'
        }
      },
      {
        id: 'gate_weather',
        station: 'Sala 3: Clima',
        ok: state.weatherStatus === 'clear',
        label: {
          'pt-BR': 'Sala 3: Céu limpo no radar meteorológico da plataforma',
          'en-US': 'Room 3: Clear weather radar over the launch pad'
        }
      },
      {
        id: 'gate_vehicle',
        station: 'Sala 4: Foguete',
        ok:
          orbitMatchesMission &&
          rocketSupportsOrbit &&
          rocketSupportsSize &&
          rocketMatchesMissionRule &&
          propulsionAllowedOnRocket,
        label: {
          'pt-BR': 'Sala 4: Órbita e Foguete compatíveis com o tamanho do satélite',
          'en-US': 'Room 4: Orbit and Rocket compatible with satellite size'
        }
      },
      {
        id: 'gate_pad',
        station: 'Sala 4: Plataforma 39A',
        ok: state.dispenserLoaded && state.rbfRemovedAtPad && state.crawlerTransported,
        label: {
          'pt-BR': 'Sala 4: Satélite no ejetor, pino RBF removido e foguete levado à Plataforma 39A',
          'en-US': 'Room 4: Loaded in dispenser, RBF pin removed, and rocket moved to Pad 39A'
        }
      }
    ];

    const readyForLaunch = pollGates.every((g) => g.ok);
    const completedGatesCount = pollGates.filter((g) => g.ok).length;
    const overallProgressPct = Math.round((completedGatesCount / pollGates.length) * 100);

    let scienceScore = payloadMatchesMission ? payload.basePoints : Math.round(payload.basePoints * 0.45);
    if (orbitMatchesMission && cmgOk) {
      scienceScore = Math.min(300, scienceScore + (300 - payload.basePoints));
    }

    const dataScore = Math.round(200 * dataEfficiency);

    let engScore = 0;
    if (massOk) engScore += 35;
    if (powerOk) engScore += 35;
    if (structure.passesODAR) engScore += 25;
    if (battery.isUL) engScore += 25;
    if (burnWireOk) engScore += 20;
    if (state.tests.cac) engScore += 20;
    if (state.tests.shaker) engScore += 20;
    if (state.tests.tvac) engScore += 20;
    if (state.tests.ditl) engScore += 20;

    let opsScore = 0;
    if (state.meritReviewPassed && state.feasibilityReviewPassed) opsScore += 35;
    if (noaaOk) opsScore += 30;
    if (state.fccLicenseApproved) opsScore += 35;
    if (state.weatherStatus === 'clear') opsScore += 20;
    if (state.rbfRemovedAtPad && state.dispenserLoaded && state.crawlerTransported) opsScore += 20;

    let financeScore = 0;
    if (budgetOk) financeScore += 60;
    if (reserveRatio >= 0.10) financeScore += 55;
    else if (reserveRatio >= 0) financeScore += Math.round(reserveRatio * 500);
    if (state.outreachCompleted) financeScore += 25;

    const totalScore = Math.max(0, Math.min(1000, scienceScore + dataScore + engScore + opsScore + financeScore));

    return {
      mission,
      payload,
      chassis,
      structure,
      solar,
      battery,
      adcs,
      ground,
      orbit,
      rocket,
      totalMass,
      maxMass,
      massOk,
      effectiveSolarW,
      totalPowerUseW,
      powerBalanceW,
      powerOk,
      generatedMB,
      downlinkMB,
      dataEfficiency,
      dataEfficiencyPct,
      partsCost,
      penaltiesCost,
      mrrTravelCost,
      rocketCost,
      totalCost,
      totalBudget,
      remainingBudget,
      reserveRatio,
      reservePct,
      budgetOk,
      reserveOk,
      payloadMatchesMission,
      noaaRequired,
      noaaOk,
      cmgOk,
      doubleBurnRequired,
      burnWireOk,
      orbitMatchesMission,
      rocketSupportsOrbit,
      rocketSupportsSize,
      rocketMatchesMissionRule,
      propulsionAllowedOnRocket,
      allTestsPassed,
      currentCML,
      pollGates,
      completedGatesCount,
      overallProgressPct,
      readyForLaunch,
      scoreBreakdown: {
        scienceScore,
        dataScore,
        engScore,
        opsScore,
        financeScore,
        totalScore
      }
    };
  },

  generateTLE(state) {
    const evalData = this.evaluateSimulation(state);
    const satName = `${evalData.mission.id.toUpperCase()}-KSC (${state.chassisId})`;
    const inc = evalData.orbit.inclinationDeg.toFixed(4).padStart(8, '0');
    const meanMotion =
      state.orbitId === 'iss'
        ? '15.50103421'
        : state.orbitId === 'leo'
          ? '15.05421890'
          : state.orbitId === 'polar'
            ? '14.63891204'
            : '01.00273791';
    const line1 = `1 99401U 26088A   26319.54218750  .00004182  00000-0  19420-3 0  9994`;
    const line2 = `2 99401 ${inc} 214.8320 0006412 128.4510 231.7105 ${meanMotion}000018`;
    return { satName, line1, line2 };
  }
};
