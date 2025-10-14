# Disease Prediction System Guide

## Overview

The AI-powered disease prediction system analyzes your farm records to detect potential diseases based on symptoms, death rates, vaccination status, and animal types.

## Supported Diseases

### Poultry Diseases

#### Critical Diseases
1. **Avian Influenza (Bird Flu)**
   - Symptoms: Respiratory (coughing, sneezing, nasal discharge, gurgling), General (lethargy, weakness, ruffled feathers), Digestive (diarrhea), Skin (bluish discoloration, pale comb), Egg production issues
   - Death Rate Threshold: 2%
   - Vaccination: Required
   - Severity: Critical

#### High Severity Diseases
2. **Newcastle Disease**
   - Symptoms: Respiratory, Nervous (twisting neck, paralysis, tremors), Digestive (green diarrhea), Egg production issues
   - Death Rate Threshold: 5%
   - Vaccination: Required
   - Severity: High

3. **Coccidiosis**
   - Symptoms: Digestive (bloody diarrhea, watery droppings), General (lethargy, weakness), Skin (pale comb, sunken eyes)
   - Death Rate Threshold: 5%
   - Severity: High

4. **Marek's Disease**
   - Symptoms: Nervous (paralysis, loss of balance), General (weight loss), Skin (feather loss), Eye (blindness)
   - Death Rate Threshold: 5%
   - Vaccination: Required
   - Severity: High

5. **Necrotic Enteritis**
   - Symptoms: Digestive (bloody diarrhea, dark droppings), General (sudden death), Skin (pale comb)
   - Death Rate Threshold: 5%
   - Severity: High

6. **Salmonellosis**
   - Symptoms: Digestive (diarrhea, watery droppings), General (lethargy, weight loss), Reproductive (drop in egg production)
   - Death Rate Threshold: 3%
   - Severity: High (Zoonotic)

7. **Gumboro Disease (IBD)**
   - Symptoms: General (lethargy, sudden death), Digestive (diarrhea), Skin (pale comb)
   - Death Rate Threshold: 5%
   - Vaccination: Required
   - Severity: High

#### Medium Severity Diseases
8. **Infectious Bronchitis (IB)**
   - Symptoms: Respiratory, Egg production issues (soft-shelled eggs, poor quality)
   - Death Rate Threshold: 1%
   - Vaccination: Required
   - Severity: Medium

9. **Chronic Respiratory Disease (CRD)**
   - Symptoms: Respiratory, General (weight loss, poor body condition)
   - Death Rate Threshold: 2%
   - Severity: Medium

10. **Fowl Pox**
    - Symptoms: Skin (scabs, wart-like lesions), Respiratory (wet form)
    - Death Rate Threshold: 3%
    - Vaccination: Required
    - Severity: Medium

11. **Avian Encephalomyelitis (AE)**
    - Symptoms: Nervous (tremors, paralysis, circling movements)
    - Death Rate Threshold: 3%
    - Vaccination: Required
    - Severity: Medium

12. **Egg Peritonitis**
    - Symptoms: Reproductive (swollen abdomen, drop in egg production)
    - Death Rate Threshold: 2%
    - Severity: Medium

#### Other Health Concerns
13. **Nutritional Deficiency**
    - Symptoms: Reduced growth rate, weight loss, poor plumage, pale comb
    - Death Rate Threshold: 2%
    - Severity: Medium

14. **Parasite Infestation**
    - Symptoms: Pale comb, weight loss, feather loss, lice/mites visible
    - Death Rate Threshold: 2%
    - Severity: Medium

15. **Stress-Related Health Issue**
    - Symptoms: Lethargy, reduced feed intake, depression, reduced egg production
    - Death Rate Threshold: 3%
    - Severity: Low

16. **High Mortality Rate**
    - General health concern based on high death rates
    - Death Rate Threshold: 10%
    - Severity: High

### Other Animal Diseases
- **African Swine Fever** (Pig) - Critical
- **Foot and Mouth Disease** (Cattle, Pig, Sheep, Goats) - High
- **Brucellosis** (Cattle, Pig, Sheep, Goats) - Medium
- **Anthrax** (Cattle, Pig, Sheep, Goats) - Critical
- **Swine Fever** (Pig) - High

## Symptom Categories

The system recognizes symptoms from the following categories:

### 🐔 General Symptoms
- Lethargy, weakness, reduced feed intake, ruffled feathers, drooping wings, depression, sudden death, reduced growth rate, weight loss

### 🥚 Egg Production & Reproductive Symptoms
- Drop in egg production, soft-shelled eggs, shell-less eggs, deformed eggs, poor egg quality, swollen abdomen

### 😮‍💨 Respiratory Symptoms
- Coughing, sneezing, nasal discharge, gurgling sounds, open-mouth breathing, gasping, swollen face/wattles/sinuses, watery eyes, conjunctivitis

### 💩 Digestive & Intestinal Symptoms
- Diarrhea (watery or bloody), greenish/whitish droppings, soiled feathers around vent, dehydration, loss of appetite

### 🦶 Nervous System Symptoms
- Twisting of neck ("star gazing"), paralysis, loss of balance, tremors, drooping head, inability to stand, circling movements

### 🩸 Skin, Comb, and External Symptoms
- Scabs, wart-like lesions, pale comb/wattles, bluish discoloration, feather loss, lice/mites visible

## How It Works

1. **Record Analysis**: The system analyzes all farm records for:
   - Symptoms mentioned in the record
   - Death rates (calculated as deaths/quantity * 100)
   - Vaccination status
   - Animal types

2. **Pattern Matching**: Compares records against disease patterns:
   - Checks if animal type matches
   - Matches symptoms (with synonym support)
   - Checks death rate thresholds
   - Verifies vaccination status

3. **Confidence Calculation**: Calculates confidence based on:
   - Record coverage (how many records match)
   - Symptom coverage (how many symptoms are matched)
   - Death rate severity
   - Missing vaccinations
   - Multiple risk factors

4. **Alert Generation**: Creates alerts for diseases with confidence ≥ 35%

## Example Scenarios

### Scenario 1: Avian Influenza Detection
**Farm Record:**
- Animal Type: Poultry
- Quantity: 100
- Deaths: 5
- Symptoms: "Birds showing respiratory distress, coughing, nasal discharge, lethargy, and some have bluish discoloration"
- Vaccinations: "None"
- Date: Today

**Detection:**
- Matched Symptoms: Respiratory distress, coughing, nasal discharge, lethargy, bluish discoloration
- Death Rate: 5% (exceeds 2% threshold)
- Missing Vaccination: Avian Influenza
- Confidence: ~85%
- Alert: **Critical** - Potential Avian Influenza Detected

### Scenario 2: Newcastle Disease Detection
**Farm Record:**
- Animal Type: Poultry
- Quantity: 200
- Deaths: 12
- Symptoms: "Birds showing green diarrhea, some have twisted necks, paralysis in wings, respiratory issues"
- Vaccinations: "Newcastle Disease" (has vaccination)
- Date: Today

**Detection:**
- Matched Symptoms: Green diarrhea, twisted neck, paralysis, respiratory issues
- Death Rate: 6% (exceeds 5% threshold)
- Has Vaccination: Yes (but still showing symptoms - possible vaccine failure)
- Confidence: ~75%
- Alert: **High** - Potential Newcastle Disease Detected

### Scenario 3: Coccidiosis Detection
**Farm Record:**
- Animal Type: Poultry
- Quantity: 150
- Deaths: 8
- Symptoms: "Bloody diarrhea, pale combs, birds are weak and not eating well"
- Vaccinations: "None"
- Date: Today

**Detection:**
- Matched Symptoms: Bloody diarrhea, pale comb, weakness, reduced feed intake
- Death Rate: 5.3% (exceeds 5% threshold)
- Missing Vaccination: N/A (no vaccine for coccidiosis, but treatment needed)
- Confidence: ~80%
- Alert: **High** - Potential Coccidiosis Detected

## Symptom Matching

The system uses intelligent symptom matching:

1. **Exact Matches**: Finds exact symptom names in the record
2. **Partial Matches**: Matches multi-word symptoms by checking all words
3. **Synonym Support**: Recognizes variations like:
   - "lethargy" = "tired", "weak", "sluggish"
   - "diarrhea" = "diarrhoea", "loose stools", "watery droppings"
   - "nasal discharge" = "runny nose", "mucus", "snot"
   - "paralysis" = "paralyzed", "cannot move", "unable to move"

## Confidence Levels

- **85-100%**: Very High Confidence - Strong evidence of disease
- **70-84%**: High Confidence - Good evidence of disease
- **50-69%**: Medium Confidence - Moderate evidence
- **35-49%**: Low Confidence - Possible disease, needs verification

## Recommendations

Each alert includes specific recommendations:
- Immediate actions for critical diseases
- Treatment options
- Biosecurity measures
- Vaccination schedules
- Veterinary consultation advice

## Best Practices

1. **Detailed Records**: Enter detailed symptoms in farm records for better detection
2. **Regular Updates**: Update records regularly to get real-time alerts
3. **Vaccination Tracking**: Record all vaccinations to improve predictions
4. **Veterinary Consultation**: Always consult a veterinarian for confirmed diagnosis
5. **Early Detection**: Review alerts regularly to catch diseases early

## Limitations

- This is a prediction system, not a diagnostic tool
- Always consult with a veterinarian for confirmed diagnosis
- Confidence levels are estimates based on pattern matching
- Some diseases may have overlapping symptoms
- Environmental factors are not considered in predictions

## Future Enhancements

- Machine learning model training
- Environmental factor analysis
- Seasonal disease patterns
- Regional disease prevalence
- Treatment effectiveness tracking
- Vaccine schedule recommendations


