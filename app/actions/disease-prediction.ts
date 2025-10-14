'use server'

import { prisma } from '@/app/lib/prisma'
import { getFarmRecords } from './farm-records'
import { createAlert, AlertInput } from './alerts'

// Disease patterns and symptoms database
interface DiseasePattern {
  name: string
  symptoms: string[]
  affectedSpecies: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  deathRateThreshold: number // percentage
  recommendations: string[]
  vaccinationRequired?: string
}

const DISEASE_PATTERNS: DiseasePattern[] = [
  // CRITICAL POULTRY DISEASES
  {
    name: 'Avian Influenza (Bird Flu)',
    symptoms: [
      // Respiratory
      'coughing', 'sneezing', 'nasal discharge', 'mucus', 'gurgling', 'rattling sounds', 
      'open-mouth breathing', 'gasping for air', 'swollen face', 'swollen wattles', 'swollen sinuses',
      'watery eyes', 'conjunctivitis', 'respiratory distress',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'reduced water consumption', 
      'ruffled feathers', 'drooping wings', 'depression', 'sitting alone', 'sudden death',
      // Digestive
      'diarrhea', 'greenish droppings', 'whitish droppings',
      // Skin
      'bluish discoloration', 'cyanosis', 'pale comb', 'pale wattles',
      // Egg production
      'drop in egg production', 'soft-shelled eggs', 'shell-less eggs', 'deformed eggs', 'discolored eggs'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'critical',
    deathRateThreshold: 2,
    vaccinationRequired: 'Avian Influenza',
    recommendations: [
      'IMMEDIATE ACTION: Contact veterinarian or animal health department immediately',
      'Isolate affected birds from the rest of the flock',
      'Implement strict biosecurity measures - no visitors allowed',
      'Wear protective clothing and disinfect after handling birds',
      'Report to local animal health authorities',
      'Consider culling if HPAI (High Pathogenic Avian Influenza) is confirmed',
      'Monitor all birds for respiratory symptoms',
      'Disinfect all equipment and facilities',
      'Restrict movement of birds and people'
    ]
  },
  {
    name: 'Newcastle Disease',
    symptoms: [
      // Respiratory
      'coughing', 'sneezing', 'nasal discharge', 'gurgling', 'rattling sounds',
      'open-mouth breathing', 'gasping', 'watery eyes', 'conjunctivitis',
      // Nervous
      'twisting of neck', 'star gazing', 'paralysis', 'loss of balance', 'tremors',
      'drooping head', 'inability to stand', 'circling movements', 'wing paralysis', 'leg paralysis',
      // Digestive
      'green diarrhea', 'greenish droppings', 'watery droppings', 'loss of appetite',
      // General
      'lethargy', 'weakness', 'ruffled feathers', 'drooping wings', 'depression',
      'sudden death', 'reduced feed intake', 'reduced growth rate',
      // Egg production
      'drop in egg production', 'soft-shelled eggs', 'deformed eggs', 'poor egg quality'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 5,
    vaccinationRequired: 'Newcastle Disease',
    recommendations: [
      'Vaccinate all birds immediately if not already vaccinated',
      'Isolate affected birds from healthy ones',
      'Contact veterinarian for proper diagnosis',
      'Maintain clean water sources - clean daily',
      'Control wild bird access to prevent spread',
      'Monitor flock health daily for new cases',
      'Practice strict biosecurity measures',
      'Disinfect equipment and facilities regularly'
    ]
  },
  {
    name: 'Infectious Bronchitis (IB)',
    symptoms: [
      // Respiratory
      'coughing', 'sneezing', 'nasal discharge', 'gurgling', 'rattling sounds',
      'open-mouth breathing', 'gasping', 'watery eyes', 'conjunctivitis',
      // General
      'lethargy', 'ruffled feathers', 'depression', 'reduced feed intake',
      // Egg production
      'drop in egg production', 'soft-shelled eggs', 'shell-less eggs', 
      'deformed eggs', 'discolored eggs', 'thin albumen', 'pale yolk', 'poor egg quality'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 1,
    vaccinationRequired: 'Infectious Bronchitis',
    recommendations: [
      'Vaccinate all birds with IB vaccine',
      'Isolate affected birds',
      'Contact veterinarian for proper treatment',
      'Improve ventilation in the poultry house',
      'Reduce stress on birds',
      'Provide clean, fresh water',
      'Monitor egg production closely',
      'Practice good biosecurity'
    ]
  },
  {
    name: 'Chronic Respiratory Disease (CRD)',
    symptoms: [
      // Respiratory
      'coughing', 'sneezing', 'nasal discharge', 'mucus', 'gurgling', 'rattling sounds',
      'open-mouth breathing', 'gasping', 'swollen sinuses', 'watery eyes', 'conjunctivitis',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'ruffled feathers', 
      'drooping wings', 'depression', 'weight loss', 'poor body condition',
      // Egg production
      'drop in egg production', 'reduced growth rate'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 2,
    recommendations: [
      'Improve ventilation and reduce ammonia levels',
      'Reduce overcrowding in poultry house',
      'Contact veterinarian for antibiotic treatment',
      'Isolate affected birds',
      'Maintain clean, dry litter',
      'Provide clean water and feed',
      'Reduce stress factors',
      'Practice good biosecurity'
    ]
  },
  {
    name: 'Coccidiosis',
    symptoms: [
      // Digestive
      'diarrhea', 'bloody diarrhea', 'watery droppings', 'greenish droppings',
      'soiled feathers around vent', 'loss of appetite', 'dehydration',
      // General
      'lethargy', 'weakness', 'ruffled feathers', 'depression', 'sitting alone',
      'reduced feed intake', 'reduced growth rate', 'weight loss', 'poor body condition',
      // Skin
      'pale comb', 'pale wattles', 'sunken eyes', 'dry comb'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 5,
    recommendations: [
      'Treat with coccidiostat medication immediately',
      'Contact veterinarian for proper diagnosis and treatment',
      'Clean and disinfect litter thoroughly',
      'Keep litter dry - change wet bedding',
      'Provide clean, fresh water',
      'Isolate affected birds if possible',
      'Prevent access to contaminated areas',
      'Use anticoccidial feed additives for prevention'
    ]
  },
  {
    name: 'Fowl Pox',
    symptoms: [
      // Skin
      'scabs', 'wart-like lesions', 'lesions on comb', 'lesions on wattles', 
      'lesions on eyelids', 'feather loss', 'poor plumage',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'ruffled feathers',
      'depression', 'reduced growth rate', 'weight loss',
      // Respiratory (wet form)
      'nasal discharge', 'coughing', 'difficulty breathing'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 3,
    vaccinationRequired: 'Fowl Pox',
    recommendations: [
      'Vaccinate all birds with fowl pox vaccine',
      'Isolate affected birds',
      'Contact veterinarian for proper treatment',
      'Keep lesions clean and prevent secondary infections',
      'Control mosquitoes (vectors of fowl pox)',
      'Practice good biosecurity',
      'Provide supportive care (water, feed)',
      'Monitor for secondary bacterial infections'
    ]
  },
  {
    name: 'Marek\'s Disease',
    symptoms: [
      // Nervous
      'paralysis', 'wing paralysis', 'leg paralysis', 'loss of balance',
      'drooping head', 'inability to stand', 'twisting of neck',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'ruffled feathers',
      'depression', 'weight loss', 'poor body condition', 'reduced growth rate',
      // Skin
      'feather loss', 'poor plumage',
      // Eye
      'blindness', 'gray eye', 'irregular pupil'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 5,
    vaccinationRequired: 'Marek\'s Disease',
    recommendations: [
      'Vaccinate chicks at day 1 with Marek\'s vaccine',
      'Isolate affected birds immediately',
      'Contact veterinarian for proper diagnosis',
      'Practice strict biosecurity - highly contagious',
      'Clean and disinfect all equipment',
      'Separate age groups to prevent spread',
      'Monitor flock for new cases',
      'Consider culling severely affected birds'
    ]
  },
  {
    name: 'Avian Encephalomyelitis (AE)',
    symptoms: [
      // Nervous
      'tremors', 'loss of balance', 'paralysis', 'drooping head',
      'inability to stand', 'circling movements', 'twisting of neck',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'depression',
      'reduced growth rate', 'weight loss'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 3,
    vaccinationRequired: 'Avian Encephalomyelitis',
    recommendations: [
      'Vaccinate breeding stock to protect chicks',
      'Isolate affected birds',
      'Contact veterinarian for proper diagnosis',
      'Provide supportive care (water, feed)',
      'Reduce stress on birds',
      'Practice good biosecurity',
      'Monitor flock for new cases',
      'Prevent spread to other flocks'
    ]
  },
  {
    name: 'Egg Peritonitis',
    symptoms: [
      // Reproductive
      'drop in egg production', 'swollen abdomen', 'fluid buildup',
      'soft-shelled eggs', 'shell-less eggs',
      // General
      'lethargy', 'weakness', 'reduced feed intake', 'ruffled feathers',
      'depression', 'sitting alone', 'weight loss'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 2,
    recommendations: [
      'Contact veterinarian for proper diagnosis',
      'Isolate affected birds',
      'Review feeding practices - ensure balanced diet',
      'Check for underlying reproductive issues',
      'Provide clean, fresh water',
      'Reduce stress on birds',
      'Monitor egg production',
      'Consider culling chronically affected birds'
    ]
  },
  {
    name: 'Necrotic Enteritis',
    symptoms: [
      // Digestive
      'diarrhea', 'bloody diarrhea', 'dark droppings', 'loss of appetite',
      'dehydration', 'soiled feathers around vent',
      // General
      'lethargy', 'weakness', 'ruffled feathers', 'depression',
      'reduced feed intake', 'reduced growth rate', 'sudden death',
      // Skin
      'pale comb', 'pale wattles'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 5,
    recommendations: [
      'Treat with antibiotics immediately (under veterinarian guidance)',
      'Contact veterinarian for proper diagnosis',
      'Improve feed quality - reduce protein levels if too high',
      'Keep litter dry and clean',
      'Prevent coccidiosis (predisposing factor)',
      'Provide clean, fresh water',
      'Isolate affected birds',
      'Practice good biosecurity'
    ]
  },
  {
    name: 'Salmonellosis',
    symptoms: [
      // Digestive
      'diarrhea', 'watery droppings', 'loss of appetite', 'dehydration',
      'soiled feathers around vent',
      // General
      'lethargy', 'weakness', 'ruffled feathers', 'depression',
      'reduced feed intake', 'reduced growth rate', 'weight loss',
      // Reproductive
      'drop in egg production', 'poor egg quality'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 3,
    recommendations: [
      'Contact veterinarian immediately - zoonotic disease',
      'Practice strict biosecurity - wear protective clothing',
      'Isolate affected birds',
      'Clean and disinfect all equipment thoroughly',
      'Practice good hygiene when handling birds and eggs',
      'Monitor flock for new cases',
      'Consider vaccination if available',
      'Report to animal health authorities if required'
    ]
  },
  {
    name: 'Gumboro Disease (IBD)',
    symptoms: [
      // General
      'lethargy', 'weakness', 'ruffled feathers', 'depression',
      'reduced feed intake', 'reduced water consumption', 'sudden death',
      'reduced growth rate',
      // Digestive
      'diarrhea', 'watery droppings', 'loss of appetite', 'dehydration',
      // Skin
      'pale comb', 'pale wattles', 'soiled feathers around vent'
    ],
    affectedSpecies: ['Poultry'],
    severity: 'high',
    deathRateThreshold: 5,
    vaccinationRequired: 'Gumboro Disease',
    recommendations: [
      'Vaccinate all birds with IBD vaccine',
      'Contact veterinarian for proper diagnosis',
      'Isolate affected birds',
      'Practice strict biosecurity',
      'Clean and disinfect all equipment',
      'Provide supportive care',
      'Monitor flock for new cases',
      'Reduce stress on birds'
    ]
  },
  // PIG DISEASES
  {
    name: 'African Swine Fever',
    symptoms: ['fever', 'loss of appetite', 'lethargy', 'weakness', 'reddening', 
      'vomiting', 'diarrhea', 'depression', 'sudden death', 'reduced feed intake'],
    affectedSpecies: ['Pig'],
    severity: 'critical',
    deathRateThreshold: 5,
    recommendations: [
      'IMMEDIATE ACTION: Contact veterinary services immediately',
      'Isolate affected pigs from healthy ones',
      'Avoid feeding kitchen waste or any pork products',
      'Implement vehicle disinfection protocols',
      'Restrict all access to farm',
      'Report to animal health authorities',
      'Monitor all pigs closely for symptoms',
      'Practice strict biosecurity measures'
    ]
  },
  {
    name: 'Foot and Mouth Disease',
    symptoms: ['lameness', 'blisters', 'mouth lesions', 'fever', 'drooling', 'reluctance to move'],
    affectedSpecies: ['Cattle', 'Pig', 'Sheep', 'Goats'],
    severity: 'high',
    deathRateThreshold: 2,
    vaccinationRequired: 'Foot and Mouth Disease',
    recommendations: [
      'Ensure vaccination is up to date',
      'Implement footbath disinfection',
      'Isolate affected animals',
      'Contact veterinarian',
      'Report to animal health department',
      'Monitor for mouth lesions and lameness'
    ]
  },
  {
    name: 'Brucellosis',
    symptoms: ['abortion', 'reproductive', 'fever', 'weakness', 'joint swelling'],
    affectedSpecies: ['Cattle', 'Pig', 'Sheep', 'Goats'],
    severity: 'medium',
    deathRateThreshold: 1,
    vaccinationRequired: 'Brucellosis',
    recommendations: [
      'Vaccinate all animals',
      'Isolate affected animals',
      'Practice good hygiene',
      'Contact veterinarian',
      'Monitor reproductive health',
      'Test for brucellosis'
    ]
  },
  {
    name: 'Anthrax',
    symptoms: ['sudden death', 'bleeding', 'swelling', 'difficulty breathing', 'fever'],
    affectedSpecies: ['Cattle', 'Pig', 'Sheep', 'Goats'],
    severity: 'critical',
    deathRateThreshold: 10,
    vaccinationRequired: 'Anthrax',
    recommendations: [
      'Immediate isolation',
      'Contact veterinary services immediately',
      'Do not open carcasses',
      'Implement strict biosecurity',
      'Vaccinate remaining animals',
      'Report to authorities immediately'
    ]
  },
  {
    name: 'Swine Fever',
    symptoms: ['fever', 'loss of appetite', 'depression', 'constipation', 'diarrhea', 'reddening'],
    affectedSpecies: ['Pig'],
    severity: 'high',
    deathRateThreshold: 5,
    vaccinationRequired: 'Swine Fever',
    recommendations: [
      'Vaccinate all pigs',
      'Isolate affected pigs',
      'Contact veterinarian',
      'Improve biosecurity measures',
      'Monitor pig health closely',
      'Practice good hygiene'
    ]
  },
  // GENERAL HEALTH CONCERNS
  {
    name: 'High Mortality Rate',
    symptoms: [],
    affectedSpecies: [],
    severity: 'high',
    deathRateThreshold: 10,
    recommendations: [
      'Contact veterinarian immediately for investigation',
      'Review recent changes in feed, water, or environment',
      'Check for signs of disease in dead birds',
      'Isolate affected animals if possible',
      'Review biosecurity measures',
      'Check for environmental stressors',
      'Monitor remaining animals closely',
      'Consider post-mortem examination'
    ]
  },
  {
    name: 'Nutritional Deficiency',
    symptoms: ['reduced growth rate', 'weight loss', 'poor body condition', 
      'feather loss', 'poor plumage', 'reduced feed intake', 'weakness',
      'pale comb', 'pale wattles'],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 2,
    recommendations: [
      'Review feed quality and composition',
      'Ensure balanced diet with proper vitamins and minerals',
      'Contact veterinarian or nutritionist for feed analysis',
      'Provide access to clean, fresh water',
      'Check for feed spoilage or contamination',
      'Consider supplementing with vitamins',
      'Monitor feed intake and growth rates',
      'Improve feeding practices'
    ]
  },
  {
    name: 'Parasite Infestation',
    symptoms: ['pale comb', 'pale wattles', 'weight loss', 'poor body condition',
      'reduced feed intake', 'lethargy', 'ruffled feathers', 'feather loss',
      'lice', 'mites', 'soiled feathers around vent', 'reduced growth rate'],
    affectedSpecies: ['Poultry'],
    severity: 'medium',
    deathRateThreshold: 2,
    recommendations: [
      'Treat with appropriate antiparasitic medication',
      'Contact veterinarian for proper diagnosis and treatment',
      'Clean and disinfect poultry house thoroughly',
      'Replace litter and bedding',
      'Treat all birds, not just affected ones',
      'Repeat treatment as recommended',
      'Practice good hygiene and sanitation',
      'Monitor for reinfestation'
    ]
  },
  {
    name: 'Stress-Related Health Issue',
    symptoms: ['lethargy', 'weakness', 'reduced feed intake', 'ruffled feathers',
      'depression', 'sitting alone', 'reduced growth rate', 'weight loss',
      'reduced egg production'],
    affectedSpecies: ['Poultry'],
    severity: 'low',
    deathRateThreshold: 3,
    recommendations: [
      'Identify and eliminate stress factors',
      'Ensure adequate space for birds',
      'Maintain proper temperature and ventilation',
      'Provide clean, fresh water and feed',
      'Reduce noise and disturbances',
      'Ensure proper lighting schedule',
      'Monitor flock behavior',
      'Contact veterinarian if issues persist'
    ]
  },
  {
    name: 'General Health Concern',
    symptoms: [],
    affectedSpecies: [],
    severity: 'medium',
    deathRateThreshold: 5,
    recommendations: [
      'Monitor animals closely for any changes',
      'Contact veterinarian for consultation',
      'Review feeding practices and diet',
      'Check environmental conditions (temperature, ventilation, humidity)',
      'Improve biosecurity measures',
      'Ensure clean water and feed',
      'Reduce stress factors',
      'Keep detailed records of symptoms and treatments'
    ]
  }
]

interface FarmRecordAnalysis {
  recordId: string
  animalType: string
  quantity: number
  deaths: number
  deathRate: number
  symptoms: string
  vaccinations: string
  date: Date
  riskFactors: string[]
}

export interface PredictedAlert {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  date: Date
  source: string
  affectedSpecies: string[]
  recommendations: string[]
  confidence: number // 0-100
  basedOnRecords: number // number of records that triggered this alert
}

// Analyze farm records for disease patterns
export async function analyzeFarmRecordsForDiseases(
  userId?: string | null
): Promise<PredictedAlert[]> {
  try {
    // Get farm records
    const records = await getFarmRecords(userId || undefined)
    
    if (records.length === 0) {
      return []
    }

    // Analyze records
    const analyses: FarmRecordAnalysis[] = records.map(record => {
      const deathRate = record.quantity > 0 
        ? (record.deaths / record.quantity) * 100 
        : 0
      
      const symptomsLower = record.symptoms.toLowerCase()
      const riskFactors: string[] = []
      
      if (deathRate > 5) {
        riskFactors.push('High death rate')
      }
      if (record.deaths > 0 && deathRate > 0) {
        riskFactors.push('Recent deaths')
      }
      if (!record.vaccinations || record.vaccinations.toLowerCase() === 'none' || record.vaccinations === '') {
        riskFactors.push('No vaccinations recorded')
      }
      
      return {
        recordId: record.id,
        animalType: record.animalType,
        quantity: record.quantity,
        deaths: record.deaths,
        deathRate,
        symptoms: record.symptoms,
        vaccinations: record.vaccinations,
        date: record.date,
        riskFactors
      }
    })

    // Match patterns
    const predictedAlerts: PredictedAlert[] = []
    const alertMap = new Map<string, {
      pattern: DiseasePattern
      matchingRecords: FarmRecordAnalysis[]
      confidence: number
    }>()

    // Helper function to normalize symptom text for better matching
    const normalizeSymptom = (text: string): string => {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
    }
    
    // Helper function to check if symptom is present (handles variations and partial matches)
    const symptomMatches = (symptomsText: string, patternSymptom: string): boolean => {
      const normalizedText = normalizeSymptom(symptomsText)
      const normalizedPattern = normalizeSymptom(patternSymptom)
      
      // Exact match
      if (normalizedText.includes(normalizedPattern)) {
        return true
      }
      
      // Partial word matches (for multi-word symptoms)
      const patternWords = normalizedPattern.split(' ')
      if (patternWords.length > 1) {
        // Check if all words in pattern are present
        return patternWords.every(word => 
          word.length > 3 && normalizedText.includes(word)
        )
      }
      
      // Check for common variations and synonyms
      const synonyms: Record<string, string[]> = {
        // General symptoms
        'lethargy': ['tired', 'weak', 'sluggish', 'listless', 'inactive', 'exhausted', 'fatigued'],
        'weakness': ['weak', 'feeble', 'fragile', 'debilitated'],
        'depression': ['depressed', 'listless', 'inactive', 'sad', 'down'],
        'ruffled feathers': ['ruffled', 'puffed up', 'fluffed up', 'feathers raised', 'ruffled plumage'],
        'drooping wings': ['drooping', 'hanging wings', 'wings down', 'drooped wings'],
        'sitting alone': ['isolated', 'separated', 'away from flock', 'sitting apart'],
        'sudden death': ['died suddenly', 'unexpected death', 'mortality', 'dead', 'death', 'died'],
        'reduced growth rate': ['slow growth', 'stunted growth', 'poor growth', 'growth issues'],
        'weight loss': ['losing weight', 'thin', 'underweight', 'poor condition', 'emaciated'],
        'poor body condition': ['poor condition', 'thin', 'underweight', 'weak body'],
        
        // Feed and water
        'reduced feed intake': ['not eating', 'eating less', 'poor appetite', 'loss of appetite', 
          'refusing feed', 'anorexia', 'not feeding', 'low feed consumption'],
        'reduced water consumption': ['not drinking', 'drinking less', 'low water intake', 
          'decreased water', 'refusing water'],
        'loss of appetite': ['not eating', 'poor appetite', 'anorexia', 'refusing feed'],
        
        // Respiratory symptoms
        'respiratory': ['breathing', 'respiration', 'respiratory issues', 'breathing problems'],
        'respiratory distress': ['difficulty breathing', 'breathing difficulty', 'labored breathing', 
          'struggling to breathe', 'breathing problems'],
        'coughing': ['cough', 'hacking', 'coughing fits'],
        'sneezing': ['sneeze', 'sneezing fits'],
        'nasal discharge': ['runny nose', 'nose discharge', 'mucus', 'snot', 'nasal mucus', 
          'runny nostrils', 'discharge from nose'],
        'mucus': ['mucus', 'phlegm', 'snot', 'nasal discharge'],
        'gurgling': ['gurgling sounds', 'gurgling', 'rattling', 'wet sounds'],
        'rattling sounds': ['rattling', 'gurgling', 'wet sounds', 'crackling'],
        'open-mouth breathing': ['mouth breathing', 'gasping', 'panting', 'open mouth'],
        'gasping for air': ['gasping', 'panting', 'struggling to breathe', 'labored breathing'],
        'gasping': ['gasping', 'panting', 'struggling', 'labored breathing'],
        'swollen face': ['face swelling', 'facial swelling', 'swollen head', 'puffy face'],
        'swollen wattles': ['wattle swelling', 'swollen wattle', 'enlarged wattles'],
        'swollen sinuses': ['sinus swelling', 'swollen sinuses', 'sinusitis'],
        'watery eyes': ['tearing', 'watery discharge', 'excessive tearing', 'eye discharge'],
        'conjunctivitis': ['pink eye', 'eye infection', 'red eyes', 'swollen eyes', 'eye inflammation'],
        
        // Digestive symptoms
        'diarrhea': ['diarrhoea', 'loose stools', 'watery stools', 'runny droppings', 
          'loose droppings', 'watery feces', 'liquid droppings'],
        'bloody diarrhea': ['blood in stool', 'bloody droppings', 'hemorrhagic diarrhea', 
          'blood in feces', 'red droppings'],
        'watery droppings': ['watery stools', 'liquid droppings', 'runny droppings'],
        'greenish droppings': ['green droppings', 'green feces', 'green stools'],
        'whitish droppings': ['white droppings', 'white feces', 'chalky droppings'],
        'dark droppings': ['dark feces', 'black droppings', 'dark stools'],
        'soiled feathers around vent': ['dirty vent', 'soiled vent', 'wet vent', 'feathers dirty'],
        'dehydration': ['dehydrated', 'dry', 'thirsty', 'lack of water'],
        'sunken eyes': ['sunken', 'deep set eyes', 'hollow eyes'],
        'dry comb': ['dry', 'dehydrated comb', 'crispy comb'],
        
        // Nervous system symptoms
        'twisting of neck': ['twisted neck', 'wry neck', 'neck twisting', 'torticollis', 'star gazing'],
        'star gazing': ['star gazing', 'looking up', 'head back', 'neck twisted back'],
        'paralysis': ['paralyzed', 'cannot move', 'unable to move', 'immobile', 'paralysed'],
        'wing paralysis': ['wings paralyzed', 'cannot move wings', 'drooping wings', 'paralyzed wings'],
        'leg paralysis': ['legs paralyzed', 'cannot stand', 'cannot walk', 'paralyzed legs'],
        'loss of balance': ['unbalanced', 'falling over', 'imbalance', 'off balance'],
        'tremors': ['trembling', 'shaking', 'shivering', 'trembling fits'],
        'drooping head': ['head down', 'head drooping', 'head hanging'],
        'inability to stand': ['cannot stand', 'unable to stand', 'lying down'],
        'circling movements': ['circling', 'spinning', 'rotating', 'turning in circles'],
        
        // Skin and external symptoms
        'pale comb': ['pale', 'white comb', 'anemic comb', 'pale colored comb', 'whitish comb'],
        'pale wattles': ['pale', 'white wattles', 'anemic wattles'],
        'bluish discoloration': ['blue', 'cyanosis', 'bluish', 'blue colored', 'cyanotic'],
        'cyanosis': ['blue', 'bluish', 'blue colored'],
        'scabs': ['scabs', 'crusts', 'lesions', 'sores'],
        'wart-like lesions': ['warts', 'warty growths', 'papules', 'nodules'],
        'lesions on comb': ['comb lesions', 'comb sores', 'comb scabs'],
        'lesions on wattles': ['wattle lesions', 'wattle sores', 'wattle scabs'],
        'lesions on eyelids': ['eyelid lesions', 'eyelid sores', 'eyelid scabs'],
        'feather loss': ['feather missing', 'bald spots', 'feathers falling', 'molting issues'],
        'poor plumage': ['poor feathers', 'bad feathers', 'rough feathers', 'dull feathers'],
        'lice': ['lice infestation', 'lice visible', 'parasites'],
        'mites': ['mite infestation', 'mites visible', 'parasites'],
        
        // Egg production symptoms
        'drop in egg production': ['fewer eggs', 'no eggs', 'egg production down', 'low egg production', 
          'decreased eggs', 'reduced eggs', 'egg drop'],
        'soft-shelled eggs': ['soft eggs', 'thin shelled eggs', 'weak shells'],
        'shell-less eggs': ['no shell', 'membrane only', 'shell missing'],
        'deformed eggs': ['misshapen eggs', 'abnormal eggs', 'irregular eggs'],
        'discolored eggs': ['abnormal color', 'weird color', 'off color eggs'],
        'thin albumen': ['watery egg white', 'thin white', 'runny albumen'],
        'pale yolk': ['light yolk', 'pale colored yolk', 'whitish yolk'],
        'poor egg quality': ['bad eggs', 'low quality eggs', 'defective eggs'],
        'swollen abdomen': ['swollen belly', 'enlarged abdomen', 'bloated', 'fluid buildup'],
        'fluid buildup': ['fluid', 'water', 'ascites', 'bloated'],
        
        // Other symptoms
        'fever': ['high temperature', 'hot', 'elevated temperature', 'pyrexia'],
        'lameness': ['limping', 'lame', 'difficulty walking', 'unable to walk'],
        'blisters': ['blisters', 'vesicles', 'bumps'],
        'mouth lesions': ['mouth sores', 'mouth ulcers', 'oral lesions'],
        'drooling': ['salivating', 'excessive saliva', 'foaming'],
        'reluctance to move': ['not moving', 'unwilling to move', 'stationary'],
        'abortion': ['miscarriage', 'aborted', 'premature birth'],
        'reproductive': ['breeding issues', 'reproduction problems', 'fertility issues'],
        'joint swelling': ['swollen joints', 'joint inflammation', 'arthritis'],
        'vomiting': ['vomiting', 'throwing up', 'regurgitation'],
        'reddening': ['red', 'reddish', 'red colored', 'erythema']
      }
      
      // Check synonyms
      if (synonyms[normalizedPattern]) {
        return synonyms[normalizedPattern].some(synonym => 
          normalizedText.includes(normalizeSymptom(synonym))
        )
      }
      
      return false
    }
    
    // Check each disease pattern
    for (const pattern of DISEASE_PATTERNS) {
      const matchingRecords: FarmRecordAnalysis[] = []
      
      for (const analysis of analyses) {
        let symptomScore = 0
        let totalChecks = 0
        let matchedSymptoms: string[] = []
        
        // Check if animal type matches
        const animalTypeMatches = pattern.affectedSpecies.length === 0 || 
            pattern.affectedSpecies.some(species => 
              analysis.animalType.toLowerCase().includes(species.toLowerCase())
            )
        
        if (!animalTypeMatches) {
          continue // Skip this pattern if animal type doesn't match
        }
        
        totalChecks++
        
        // Check symptoms (more comprehensive matching)
        if (pattern.symptoms.length > 0) {
          const symptomsLower = analysis.symptoms.toLowerCase()
          
          // Count matching symptoms
          for (const symptom of pattern.symptoms) {
            if (symptomMatches(symptomsLower, symptom)) {
              matchedSymptoms.push(symptom)
              symptomScore++
            }
          }
          
          // Calculate symptom match percentage
          const symptomMatchPercentage = (symptomScore / pattern.symptoms.length) * 100
          
          // Higher weight for more specific symptoms (longer symptom lists indicate more specific disease)
          const symptomWeight = pattern.symptoms.length > 10 ? 60 : 
                                pattern.symptoms.length > 5 ? 50 : 40
          
          symptomScore = symptomMatchPercentage * (symptomWeight / 100)
          totalChecks++
        } else {
          // No symptoms to match - rely on death rate
          symptomScore = 0
        }
        
        // Check death rate (weighted based on threshold)
        let deathRateScore = 0
        if (analysis.deathRate > 0) {
          if (analysis.deathRate >= pattern.deathRateThreshold) {
            // Higher death rate = higher score
            deathRateScore = Math.min(40, (analysis.deathRate / pattern.deathRateThreshold) * 20)
          } else if (analysis.deathRate > 0) {
            // Even low death rates are significant
            deathRateScore = 10
          }
        }
        totalChecks++
        
        // Check vaccination (missing vaccination increases risk)
        let vaccinationScore = 0
        if (pattern.vaccinationRequired) {
          const hasVaccination = analysis.vaccinations.toLowerCase().includes(
            pattern.vaccinationRequired.toLowerCase()
          )
          if (!hasVaccination) {
            // Missing vaccination significantly increases risk
            vaccinationScore = 30
          } else {
            // Has vaccination reduces risk
            vaccinationScore = -10
          }
        }
        totalChecks++
        
        // Calculate total match score
        const totalScore = symptomScore + deathRateScore + vaccinationScore
        
        // Determine if record matches pattern
        // Lower threshold for patterns with many symptoms (more specific diseases)
        const matchThreshold = pattern.symptoms.length > 10 ? 25 :
                               pattern.symptoms.length > 5 ? 30 :
                               pattern.symptoms.length > 0 ? 35 : 20
        
        // Match if:
        // 1. Total score exceeds threshold, OR
        // 2. Death rate exceeds threshold (even without symptoms), OR
        // 3. Significant symptoms matched (at least 30% of symptoms) and death rate > 0
        if (totalScore >= matchThreshold || 
            (analysis.deathRate >= pattern.deathRateThreshold && pattern.symptoms.length === 0) ||
            (matchedSymptoms.length >= Math.ceil(pattern.symptoms.length * 0.3) && 
             analysis.deathRate > 0 && pattern.symptoms.length > 0)) {
          matchingRecords.push({
            ...analysis,
            riskFactors: [
              ...analysis.riskFactors,
              ...matchedSymptoms.slice(0, 3) // Add top matched symptoms as risk factors
            ]
          })
        }
      }
      
      // Calculate confidence
      if (matchingRecords.length > 0) {
        const totalAnimals = matchingRecords.reduce((sum, r) => sum + r.quantity, 0)
        const totalDeaths = matchingRecords.reduce((sum, r) => sum + r.deaths, 0)
        const avgDeathRate = totalAnimals > 0 ? (totalDeaths / totalAnimals) * 100 : 0
        
        // Count unique symptoms matched across all records
        const allMatchedSymptoms = new Set<string>()
        matchingRecords.forEach(record => {
          const symptomsLower = record.symptoms.toLowerCase()
          pattern.symptoms.forEach(symptom => {
            if (symptomMatches(symptomsLower, symptom)) {
              allMatchedSymptoms.add(symptom)
            }
          })
        })
        
        const symptomCoverage = pattern.symptoms.length > 0 
          ? (allMatchedSymptoms.size / pattern.symptoms.length) * 100 
          : 0
        
        // Calculate confidence based on multiple factors
        let confidence = 0
        
        // Factor 1: Record coverage (how many records match)
        const recordCoverage = (matchingRecords.length / records.length) * 100
        confidence += Math.min(30, recordCoverage * 0.3)
        
        // Factor 2: Symptom coverage (how many symptoms are matched)
        confidence += Math.min(40, symptomCoverage * 0.4)
        
        // Factor 3: Death rate (higher death rate = higher confidence)
        if (avgDeathRate > 0) {
          if (avgDeathRate >= pattern.deathRateThreshold) {
            confidence += Math.min(30, (avgDeathRate / pattern.deathRateThreshold) * 15)
          } else {
            confidence += Math.min(15, (avgDeathRate / pattern.deathRateThreshold) * 10)
          }
        }
        
        // Factor 4: Missing vaccination (increases confidence if vaccination is required)
        const missingVaccination = pattern.vaccinationRequired && 
          matchingRecords.some(r => !r.vaccinations.toLowerCase().includes(
            pattern.vaccinationRequired!.toLowerCase()
          ))
        if (missingVaccination) {
          confidence += 20
        }
        
        // Factor 5: Multiple risk factors
        const hasMultipleRiskFactors = matchingRecords.some(r => r.riskFactors.length >= 3)
        if (hasMultipleRiskFactors) {
          confidence += 10
        }
        
        // Adjust confidence based on severity (critical diseases get higher confidence)
        if (pattern.severity === 'critical') {
          confidence = Math.min(100, confidence * 1.15)
        } else if (pattern.severity === 'high') {
          confidence = Math.min(100, confidence * 1.1)
        }
        
        // Minimum confidence threshold: 35% for diseases with symptoms, 40% for general health concerns
        const minConfidence = pattern.symptoms.length > 0 ? 35 : 40
        
        if (confidence >= minConfidence) {
          alertMap.set(pattern.name, {
            pattern,
            matchingRecords,
            confidence: Math.round(Math.min(100, confidence))
          })
        }
      }
    }

    // Generate alerts from matched patterns
    for (const [diseaseName, data] of alertMap.entries()) {
      const { pattern, matchingRecords, confidence } = data
      
      // Get most recent record date
      const mostRecentDate = matchingRecords.reduce((latest, record) => 
        record.date > latest ? record.date : latest,
        matchingRecords[0].date
      )
      
      // Calculate statistics
      const totalAnimals = matchingRecords.reduce((sum, r) => sum + r.quantity, 0)
      const totalDeaths = matchingRecords.reduce((sum, r) => sum + r.deaths, 0)
      const avgDeathRate = totalAnimals > 0 ? (totalDeaths / totalAnimals) * 100 : 0
      
      // Collect all matched symptoms across records
      const allMatchedSymptoms = new Set<string>()
      matchingRecords.forEach(record => {
        const symptomsLower = record.symptoms.toLowerCase()
        pattern.symptoms.forEach(symptom => {
          if (symptomMatches(symptomsLower, symptom)) {
            allMatchedSymptoms.add(symptom)
          }
        })
      })
      
      // Get top matched symptoms (limit to 5 for display)
      const topSymptoms = Array.from(allMatchedSymptoms).slice(0, 5)
      
      // Generate detailed description
      let description = `Based on your farm records analysis, we've detected potential signs of ${diseaseName}. `
      
      // Add record count
      description += `${matchingRecords.length} record(s) show concerning patterns. `
      
      // Add death rate information
      if (avgDeathRate > 0) {
        description += `Death rate: ${avgDeathRate.toFixed(1)}% (threshold: ${pattern.deathRateThreshold}%). `
      }
      
      // Add matched symptoms
      if (topSymptoms.length > 0) {
        description += `Detected symptoms: ${topSymptoms.join(', ')}. `
      }
      
      // Add animal types
      const animalTypes = [...new Set(matchingRecords.map(r => r.animalType))]
      description += `Animal types affected: ${animalTypes.join(', ')}. `
      
      // Add vaccination status if relevant
      if (pattern.vaccinationRequired) {
        const hasVaccination = matchingRecords.some(r => 
          r.vaccinations.toLowerCase().includes(pattern.vaccinationRequired!.toLowerCase())
        )
        if (!hasVaccination) {
          description += `⚠️ Warning: ${pattern.vaccinationRequired} vaccination not recorded. `
        }
      }
      
      // Add confidence
      description += `Confidence level: ${confidence}%. `
      
      // Add recommendation
      if (pattern.severity === 'critical' || pattern.severity === 'high') {
        description += `🚨 IMMEDIATE ACTION REQUIRED: Please review your records and consult with a veterinarian immediately.`
      } else {
        description += `Please review your records and consult with a veterinarian for proper diagnosis and treatment.`
      }
      
      const affectedSpecies = pattern.affectedSpecies.length > 0
        ? pattern.affectedSpecies
        : [...new Set(matchingRecords.map(r => r.animalType))]
      
      predictedAlerts.push({
        id: `predicted-${diseaseName.toLowerCase().replace(/\s+/g, '-')}-${mostRecentDate.getTime()}`,
        title: `⚠️ Potential ${diseaseName} Detected`,
        description,
        severity: pattern.severity,
        location: 'Your Farm',
        date: mostRecentDate,
        source: 'AI Disease Prediction System',
        affectedSpecies,
        recommendations: pattern.recommendations,
        confidence,
        basedOnRecords: matchingRecords.length
      })
    }

    // Sort by severity and confidence
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    predictedAlerts.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
      if (severityDiff !== 0) return severityDiff
      return b.confidence - a.confidence
    })

    return predictedAlerts
  } catch (error) {
    console.error('Error analyzing farm records for diseases:', error)
    throw new Error('Failed to analyze farm records for diseases')
  }
}

// Generate and save predicted alerts to database
export async function generateAndSavePredictedAlerts(
  userId?: string | null
): Promise<PredictedAlert[]> {
  try {
    const predictedAlerts = await analyzeFarmRecordsForDiseases(userId)
    
    // Save high-confidence alerts to database
    const alertsToSave = predictedAlerts.filter(alert => alert.confidence >= 60)
    
    for (const alert of alertsToSave) {
      try {
        // Check if alert already exists (by title and date)
        const existingAlert = await prisma.alert.findFirst({
          where: {
            title: alert.title,
            date: {
              gte: new Date(alert.date.getTime() - 7 * 24 * 60 * 60 * 1000), // Within last 7 days
              lte: new Date(alert.date.getTime() + 7 * 24 * 60 * 60 * 1000)
            }
          }
        })
        
        if (!existingAlert) {
          const alertInput: AlertInput = {
            title: alert.title,
            description: alert.description,
            severity: alert.severity,
            location: alert.location,
            date: alert.date,
            source: alert.source,
            affectedSpecies: alert.affectedSpecies,
            recommendations: alert.recommendations
          }
          
          await createAlert(alertInput)
        }
      } catch (error) {
        console.error(`Error saving alert ${alert.title}:`, error)
        // Continue with other alerts even if one fails
      }
    }
    
    return predictedAlerts
  } catch (error) {
    console.error('Error generating and saving predicted alerts:', error)
    throw new Error('Failed to generate and save predicted alerts')
  }
}

// Get combined alerts (both static and predicted)
export async function getCombinedAlerts(
  userId?: string | null,
  filter?: {
    severity?: string
    unreadOnly?: boolean
  }
): Promise<{
  staticAlerts: any[]
  predictedAlerts: PredictedAlert[]
  allAlerts: any[]
}> {
  try {
    // Get static alerts (from database) - works with or without userId
    // Don't pass filter to getAlerts since we'll filter after combining with predicted alerts
    const { getAlerts } = await import('./alerts')
    let staticAlerts: any[] = []
    try {
      staticAlerts = await getAlerts(userId || undefined, {})
    } catch (error) {
      console.error('Error fetching static alerts:', error)
      // Continue even if static alerts fail
    }
    
    // Get predicted alerts
    const predictedAlerts = await analyzeFarmRecordsForDiseases(userId)
    
    // Combine alerts
    const allAlerts = [
      ...staticAlerts.map(alert => ({
        ...alert,
        isPredicted: false,
        source: alert.source || 'System'
      })),
      ...predictedAlerts.map(alert => ({
        ...alert,
        id: alert.id,
        isRead: false,
        isActive: true,
        createdAt: alert.date,
        updatedAt: alert.date,
        isPredicted: true,
        confidence: alert.confidence,
        basedOnRecords: alert.basedOnRecords
      }))
    ]
    
    // Filter by severity if requested
    let filteredAlerts = allAlerts
    if (filter?.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filter.severity)
    }
    
    // Filter by unread if requested
    if (filter?.unreadOnly) {
      filteredAlerts = filteredAlerts.filter(alert => !alert.isRead)
    }
    
    // Sort by severity and date
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    filteredAlerts.sort((a, b) => {
      const severityDiff = (severityOrder[a.severity as keyof typeof severityOrder] || 3) - 
        (severityOrder[b.severity as keyof typeof severityOrder] || 3)
      if (severityDiff !== 0) return severityDiff
      return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    })
    
    return {
      staticAlerts,
      predictedAlerts,
      allAlerts: filteredAlerts
    }
  } catch (error) {
    console.error('Error getting combined alerts:', error)
    throw new Error('Failed to get combined alerts')
  }
}

