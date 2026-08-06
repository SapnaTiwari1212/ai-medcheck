// Educational knowledge base for common laboratory tests.
// NOTE: Ranges are common adult reference values, approximate, and for
// educational display only. They vary by lab, age, sex, and pregnancy status.

const sx = (items) => items

export const TESTS = [
  {
    id: 'hemoglobin',
    name: 'Hemoglobin (Hb / Hgb)',
    aliases: [/hemoglobin/i, /\b(?:hgb|hb)\b/i],
    unitHint: /(g\/?dL|gm\/?dL|g%|g\/?l)/i,
    range: { min: 12.0, max: 17.0 },
    rangeLabel: '13.0 – 17.0 (Men) · 12.0 – 15.5 (Women)',
    category: 'Complete Blood Count',
    explanation:
      'Hemoglobin is the protein inside red blood cells that carries oxygen from your lungs to the rest of your body. It is a key measure of anemia.',
    abnormal: {
      high: {
        insight:
          'High hemoglobin can mean your blood is thicker than normal. Common causes include dehydration, smoking, living at high altitude, or a condition called polycythemia where the body makes too many red blood cells.',
        symptoms: sx(['Fatigue', 'Headaches', 'Dizziness', 'Blurred vision', 'Reddish skin tone']),
        prevention: sx(['Stay well hydrated', 'Quit smoking', 'Avoid excess iron supplements unless advised', 'Regular aerobic exercise']),
        consult:
          'See a doctor if the high value is persistent, or if you experience headaches, dizziness, or vision changes.',
      },
      low: {
        insight:
          'Low hemoglobin usually indicates anemia — your blood carries less oxygen than normal. Causes include iron deficiency, blood loss, low B12 or folate, and chronic conditions.',
        symptoms: sx(['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath', 'Dizziness', 'Cold hands and feet']),
        prevention: sx(['Eat iron-rich foods (spinach, lentils, lean red meat)', 'Pair iron with vitamin C to improve absorption', 'Treat heavy menstrual bleeding', 'Check B12 and folate levels']),
        consult:
          'See a doctor for a proper workup if hemoglobin is below normal, especially if you feel unusually tired or short of breath.',
      },
    },
  },
  {
    id: 'rbc',
    name: 'Red Blood Cell Count (RBC)',
    aliases: [/red blood cell/i, /\b(?:rbc)\b/i],
    unitHint: /(\^?10\^?6|\/?uL|million|\/mm3)/i,
    range: { min: 4.1, max: 5.9 },
    rangeLabel: '4.5 – 5.9 ×10⁶/µL (Men) · 4.1 – 5.1 ×10⁶/µL (Women)',
    category: 'Complete Blood Count',
    explanation:
      'RBC count is the number of red blood cells in a volume of blood. Red cells carry oxygen, so this count reflects your blood’s oxygen-carrying capacity.',
    abnormal: {
      high: {
        insight:
          'A high RBC count can be caused by dehydration, smoking, low oxygen at altitude, or bone marrow producing too many red cells (polycythemia vera).',
        symptoms: sx(['Headaches', 'Dizziness', 'Fatigue', 'Blurred vision', 'High blood pressure']),
        prevention: sx(['Stay hydrated', 'Avoid smoking', 'Limit alcohol', 'Maintain a healthy weight']),
        consult:
          'Consult a doctor if the count stays high, since it increases the risk of blood clots.',
      },
      low: {
        insight:
          'A low RBC count typically points to anemia from blood loss, nutritional deficiency, or reduced production by the bone marrow.',
        symptoms: sx(['Fatigue', 'Pale skin', 'Weakness', 'Rapid heartbeat', 'Shortness of breath']),
        prevention: sx(['Iron, B12, and folate-rich diet', 'Reduced meat intake? Add legumes and leafy greens', 'Regular follow-up blood tests']),
        consult:
          'See a doctor to identify the cause of the low count, as treatment depends on the underlying deficiency or illness.',
      },
    },
  },
  {
    id: 'wbc',
    name: 'White Blood Cell Count (WBC / Leucocytes)',
    aliases: [/white blood cell/i, /\b(?:wbc|leucocytes?|leukocytes?)\b/i],
    unitHint: /(\/uL|\/mm3|k\/uL|x10\^?9)/i,
    range: { min: 4000, max: 11000 },
    rangeLabel: '4,000 – 11,000 /µL',
    category: 'Complete Blood Count',
    explanation:
      'White blood cells are your immune system’s soldiers — they fight infections. This count tells us roughly how active your immune system is.',
    abnormal: {
      high: {
        insight:
          'A high WBC often indicates an active infection, inflammation, stress, or a reaction to some medications. Rarely, it relates to blood disorders.',
        symptoms: sx(['Fever', 'Body aches', 'Swollen glands', 'Feeling unwell']),
        prevention: sx(['Practice good hygiene and handwashing', 'Stay up to date on vaccines', 'Manage stress and get enough sleep']),
        consult:
          'A mildly elevated WBC with no symptoms often resolves. See a doctor if there is fever, pain, or the count is very high.',
      },
      low: {
        insight:
          'A low WBC can make you more prone to infections. Causes include viral illnesses, autoimmune conditions, chemotherapy, or certain medications.',
        symptoms: sx(['Frequent or recurrent infections', 'Fever', 'Sore throat', 'Fatigue']),
        prevention: sx(['Wash hands frequently', 'Avoid crowds during flu season', 'Avoid undercooked food', 'Support immunity with balanced diet and sleep']),
        consult:
          'See a doctor, especially if you get frequent infections, since a low count needs evaluation.',
      },
    },
  },
  {
    id: 'platelets',
    name: 'Platelet Count (PLT)',
    aliases: [/platelet/i, /\b(?:plt|thrombocytes?)\b/i],
    unitHint: /(\/uL|\/mm3|k\/uL|x10\^?9)/i,
    range: { min: 150000, max: 450000 },
    rangeLabel: '150,000 – 450,000 /µL',
    category: 'Complete Blood Count',
    explanation:
      'Platelets are tiny cells that help your blood clot and stop bleeding after an injury.',
    abnormal: {
      high: {
        insight:
          'High platelets can follow infection, inflammation, or iron deficiency, and can slightly raise the risk of blood clots.',
        symptoms: sx(['Usually no symptoms', 'Headache', 'Bleeding or bruising']),
        prevention: sx(['Stay hydrated', 'Exercise regularly', 'Avoid smoking', 'Manage inflammatory conditions']),
        consult:
          'Consult a doctor if the count stays elevated for a workup.',
      },
      low: {
        insight:
          'Low platelets mean your blood may not clot well. Causes include viral infections, medications, immune disorders, and liver problems.',
        symptoms: sx(['Easy bruising', 'Pinpoint red spots (petechiae)', 'Prolonged bleeding', 'Blood in stool or urine']),
        prevention: sx(['Avoid aspirin/NSAIDs without medical advice', 'Limit alcohol', 'Use a soft toothbrush']),
        consult:
          'Seek care promptly if you notice unusual bruising or bleeding, since very low platelets can be serious.',
      },
    },
  },
  {
    id: 'hematocrit',
    name: 'Hematocrit (HCT / PCV)',
    aliases: [/hematocrit/i, /\b(?:hct|pcv)\b/i],
    unitHint: /(%|percent|l\/?l|fraction)/i,
    range: { min: 36, max: 50 },
    rangeLabel: '40 – 50% (Men) · 36 – 48% (Women)',
    category: 'Complete Blood Count',
    explanation:
      'Hematocrit is the percentage of your blood volume made up of red blood cells. It rises and falls with your hemoglobin levels.',
    abnormal: {
      high: {
        insight: 'High hematocrit usually mirrors high hemoglobin — often from dehydration, smoking, or altitude.',
        symptoms: sx(['Headaches', 'Dizziness', 'Fatigue']),
        prevention: sx(['Drink enough water', 'Avoid smoking']),
        consult: 'See a doctor if it persists or symptoms appear.',
      },
      low: {
        insight: 'Low hematocrit indicates fewer red blood cells, most commonly from anemia or blood loss.',
        symptoms: sx(['Fatigue', 'Pale skin', 'Weakness']),
        prevention: sx(['Iron-rich diet with vitamin C', 'Treat any underlying blood loss']),
        consult: 'A doctor should evaluate low hematocrit to find the cause.',
      },
    },
  },
  {
    id: 'glucose',
    name: 'Blood Glucose / Sugar',
    aliases: [/blood glucose/i, /fasting glucose/i, /\b(?:glucose|sugar)\b/i, /\b(?:fb?s|fbg|rbs|fbs)\b/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 70, max: 99 },
    rangeLabel: 'Fasting: 70 – 99 mg/dL',
    category: 'Glucose',
    explanation:
      'Blood glucose is the amount of sugar in your blood — your body’s main energy source. Fasting levels are measured after 8 hours without food.',
    abnormal: {
      high: {
        insight:
          'High fasting glucose may indicate prediabetes or diabetes. It means the body is struggling to move sugar from the blood into cells.',
        symptoms: sx(['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Unexplained weight loss', 'Slow-healing wounds']),
        prevention: sx(['Limit sugary drinks and refined carbs', 'Choose whole grains and fiber', 'Exercise most days', 'Maintain a healthy weight', 'Stay hydrated']),
        consult:
          'A single high reading needs confirmation. If fasting glucose is consistently elevated, see a doctor and consider an HbA1c test.',
      },
      low: {
        insight:
          'Low glucose (hypoglycemia) can result from long gaps between meals, excess insulin or diabetes medication, or intense exercise.',
        symptoms: sx(['Trembling', 'Sweating', 'Hunger', 'Dizziness', 'Confusion', 'Irritability']),
        prevention: sx(['Eat regular balanced meals', 'Carry a quick snack', 'Avoid skipping meals']),
        consult:
          'Severe or frequent low sugar episodes require medical review, especially for people on diabetes medication.',
      },
    },
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    aliases: [/hba1c/i, /a1c/i, /glycated hemoglob/i, /glycohemoglobin/i],
    unitHint: /(%|mmol\/?mol)/i,
    range: { min: 0, max: 5.6 },
    rangeLabel: 'Below 5.7% is normal · 5.7 – 6.4% prediabetes · 6.5%+ diabetes range',
    category: 'Glucose',
    explanation:
      'HbA1c estimates your average blood sugar over the past 2–3 months. It is the best single marker of long-term glucose control.',
    abnormal: {
      high: {
        insight:
          'Elevated HbA1c means average blood sugar has been running high, placing you in the prediabetes or diabetes range. Early action can often reverse prediabetes.',
        symptoms: sx(['Increased thirst', 'Frequent urination', 'Fatigue', 'Weight changes', 'Blurred vision']),
        prevention: sx(['Reduce refined sugar intake', 'Eat more fiber and vegetables', 'Exercise 150+ minutes weekly', 'Lose 5–10% of body weight if overweight', 'Monitor regularly']),
        consult:
          'See a doctor to discuss lifestyle changes and whether medication is needed. HbA1c above 6.5% typically indicates diabetes.',
      },
      low: {
        insight: 'Low HbA1c is usually not a concern. It can occur with frequent low blood sugar or certain anemias.',
        symptoms: sx([]),
        prevention: sx([]),
        consult: 'Discuss frequent low sugars with your doctor if you have symptoms.',
      },
    },
  },
  {
    id: 'cholesterol',
    name: 'Total Cholesterol',
    aliases: [/total cholesterol/i, /serum cholesterol/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 0, max: 199 },
    rangeLabel: 'Desirable: less than 200 mg/dL',
    category: 'Lipid Profile',
    explanation:
      'Cholesterol is a fatty substance needed for cell membranes and hormones. Too much circulating cholesterol can build up in arteries over time.',
    abnormal: {
      high: {
        insight:
          'High total cholesterol raises long-term risk of heart disease and stroke, especially when combined with high LDL and low HDL.',
        symptoms: sx(['Usually no symptoms — a “silent” risk factor']),
        prevention: sx(['Limit saturated and trans fats', 'Eat more vegetables, fruits, and whole grains', 'Include oats, nuts, and fatty fish', 'Exercise regularly', 'Avoid smoking', 'Manage weight']),
        consult:
          'A doctor should assess your full lipid panel and overall cardiovascular risk to decide on monitoring or treatment.',
      },
      low: {
        insight: 'Very low cholesterol is uncommon and usually not harmful. It can occur in malnutrition or chronic illness.',
        symptoms: sx([]),
        prevention: sx(['Balanced diet with healthy fats (avocado, nuts, olive oil)']),
        consult: 'Only concerning if linked to weight loss or illness.',
      },
    },
  },
  {
    id: 'ldl',
    name: 'LDL Cholesterol (“Bad” Cholesterol)',
    aliases: [/ldl/i, /low.density lipoprotein/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 0, max: 99 },
    rangeLabel: 'Optimal: less than 100 mg/dL (target varies by risk)',
    category: 'Lipid Profile',
    explanation:
      'LDL carries cholesterol to tissues. When too much LDL builds up, it can deposit in artery walls and form plaques.',
    abnormal: {
      high: {
        insight:
          'High LDL is a major, modifiable driver of heart disease and stroke. Lowering it — especially with diet and exercise — meaningfully reduces risk.',
        symptoms: sx(['Usually no symptoms']),
        prevention: sx(['Reduce saturated fat (fried food, fatty meat, full-fat dairy)', 'Eat soluble fiber (oats, beans, barley)', 'Add plant sterols', 'Exercise 150 min/week', 'Avoid smoking']),
        consult:
          'Discuss your target LDL with a doctor. People with diabetes, hypertension, or family history of heart disease may need tighter goals.',
      },
      low: {
        insight: 'Low LDL is generally favorable for heart health.',
        symptoms: sx([]),
        prevention: sx(['Continue heart-healthy habits']),
        consult: 'No action needed.',
      },
    },
  },
  {
    id: 'hdl',
    name: 'HDL Cholesterol (“Good” Cholesterol)',
    aliases: [/hdl/i, /high.density lipoprotein/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 40, max: 999 },
    rangeLabel: 'Above 40 mg/dL (Men) · above 50 mg/dL (Women) is desirable',
    category: 'Lipid Profile',
    explanation:
      'HDL acts like a scavenger, carrying excess cholesterol away from arteries toward the liver for disposal.',
    abnormal: {
      high: { insight: 'High HDL is generally protective for heart health.', symptoms: sx([]), prevention: sx(['Keep healthy habits']), consult: 'No action needed.' },
      low: {
        insight:
          'Low HDL is linked to a higher heart disease risk. It is often seen with inactivity, smoking, and a diet rich in refined carbs.',
        symptoms: sx(['Usually no symptoms']),
        prevention: sx(['Aerobic exercise most days', 'Quit smoking', 'Choose healthy fats (olive oil, nuts, fish)', 'Limit refined carbohydrates']),
        consult: 'Talk to a doctor about your overall cardiovascular risk profile.',
      },
    },
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    aliases: [/triglyceride/i, /\b(?:tg)\b/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 0, max: 149 },
    rangeLabel: 'Normal: less than 150 mg/dL',
    category: 'Lipid Profile',
    explanation:
      'Triglycerides are the main form of fat stored for energy. High levels often track with high sugar and alcohol intake.',
    abnormal: {
      high: {
        insight:
          'High triglycerides increase cardiovascular risk and can also contribute to pancreatitis when extremely elevated.',
        symptoms: sx(['Usually no symptoms', 'Severe cases: stomach pain, pancreatitis']),
        prevention: sx(['Cut sugary foods and beverages', 'Limit alcohol', 'Eat more omega-3 (fish, walnuts, flaxseed)', 'Exercise regularly', 'Lose weight if overweight']),
        consult:
          'See a doctor if triglycerides are very high (above ~500 mg/dL) or combined with other risk factors.',
      },
      low: { insight: 'Low triglycerides are usually a good sign.', symptoms: sx([]), prevention: sx(['Maintain healthy habits']), consult: 'No action needed.' },
    },
  },
  {
    id: 'alt',
    name: 'ALT (Alanine Aminotransferase)',
    aliases: [/alt\b/i, /alanine aminotransferase/i, /s?gpt/i],
    unitHint: /(u\/?l|iu\/?l|units?\/?l)/i,
    range: { min: 7, max: 56 },
    rangeLabel: '7 – 56 U/L',
    category: 'Liver Function',
    explanation:
      'ALT is an enzyme concentrated in liver cells. When liver cells are damaged, ALT leaks into the blood, so a rise suggests liver irritation.',
    abnormal: {
      high: {
        insight:
          'Elevated ALT commonly reflects fatty liver, alcohol, medications, or viral hepatitis. Mild elevations are very common and often reversible.',
        symptoms: sx(['Often none', 'Fatigue', 'Right upper belly discomfort', 'Yellowish skin or eyes (jaundice)']),
        prevention: sx(['Limit alcohol', 'Maintain healthy weight', 'Reduce fatty/ultra-processed food', 'Drink coffee (associated with lower liver enzyme levels)', 'Review medications with your doctor']),
        consult:
          'Persistent elevation deserves a medical workup to rule out liver disease and adjust any medication.',
      },
      low: { insight: 'Low ALT is typically not concerning.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'ast',
    name: 'AST (Aspartate Aminotransferase)',
    aliases: [/ast\b/i, /aspartate aminotransferase/i, /s?got/i],
    unitHint: /(u\/?l|iu\/?l)/i,
    range: { min: 10, max: 40 },
    rangeLabel: '10 – 40 U/L',
    category: 'Liver Function',
    explanation:
      'AST is another enzyme found in the liver, muscles, and heart. Levels rise with liver or muscle injury.',
    abnormal: {
      high: {
        insight:
          'AST can rise from liver problems, but also intense exercise, muscle injury, or heart issues. A high AST-to-ALT ratio can point to alcohol-related liver stress.',
        symptoms: sx(['Often none', 'Fatigue', 'Muscle soreness']),
        prevention: sx(['Limit alcohol', 'Avoid overtraining', 'Stay hydrated']),
        consult: 'Persistent elevation should be checked by a doctor.',
      },
      low: { insight: 'Low AST is not a concern.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'alp',
    name: 'ALP (Alkaline Phosphatase)',
    aliases: [/alkaline phosphatase/i, /\b(?:alp)\b/i],
    unitHint: /(u\/?l|iu\/?l)/i,
    range: { min: 44, max: 147 },
    rangeLabel: '44 – 147 U/L (varies with age)',
    category: 'Liver Function',
    explanation:
      'ALP is an enzyme found in the liver, bile ducts, and bones. Levels naturally rise during growth, pregnancy, and bone repair.',
    abnormal: {
      high: {
        insight:
          'High ALP can suggest bile duct or liver issues, but also bone conditions like healing fractures or Paget’s disease. Age matters a lot here.',
        symptoms: sx(['Often none', 'Belly pain', 'Bone pain']),
        prevention: sx(['Ensure adequate vitamin D and calcium', 'Limit alcohol']),
        consult: 'A doctor can tell whether the rise is liver- or bone-related.',
      },
      low: { insight: 'Low ALP is uncommon and rarely meaningful.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'bilirubin',
    name: 'Total Bilirubin',
    aliases: [/bilirubin/i],
    unitHint: /(mg\/?dL|umol\/?l|µmol\/?l)/i,
    range: { min: 0.1, max: 1.2 },
    rangeLabel: '0.1 – 1.2 mg/dL',
    category: 'Liver Function',
    explanation:
      'Bilirubin is a yellow pigment made when old red blood cells are broken down. The liver removes it from the blood.',
    abnormal: {
      high: {
        insight:
          'Mild elevation can come from fasting, Gilbert’s syndrome (harmless), or dehydration. Higher levels with jaundice need evaluation for liver or bile duct issues.',
        symptoms: sx(['Yellowing of skin or eyes (jaundice)', 'Dark urine', 'Pale stools', 'Fatigue']),
        prevention: sx(['Stay hydrated', 'Limit alcohol', 'Healthy liver diet']),
        consult:
          'See a doctor promptly if jaundice, dark urine, or high levels with symptoms occur.',
      },
      low: { insight: 'Low bilirubin is not a concern.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'albumin',
    name: 'Albumin',
    aliases: [/albumin/i],
    unitHint: /(g\/?dL|g\/?l)/i,
    range: { min: 3.5, max: 5.0 },
    rangeLabel: '3.5 – 5.0 g/dL',
    category: 'Liver Function / Protein',
    explanation:
      'Albumin is the most abundant protein in blood. It keeps fluid in the bloodstream and carries substances around the body. The liver makes it.',
    abnormal: {
      high: { insight: 'High albumin is often just dehydration.', symptoms: sx(['Thirst', 'Dark urine']), prevention: sx(['Drink more water']), consult: 'Usually resolves with hydration.' },
      low: {
        insight:
          'Low albumin can reflect liver disease, kidney protein loss, inflammation, or malnutrition.',
        symptoms: sx(['Swelling in feet or ankles', 'Fatigue', 'Poor appetite']),
        prevention: sx(['Adequate protein intake (eggs, fish, lentils)', 'Treat underlying condition']),
        consult: 'Low albumin combined with swelling should be evaluated by a doctor.',
      },
    },
  },
  {
    id: 'creatinine',
    name: 'Creatinine',
    aliases: [/creatinine/i, /\b(?:cr|s\.cr|creat)\b/i],
    unitHint: /(mg\/?dL|umol\/?l|µmol\/?l)/i,
    range: { min: 0.6, max: 1.2 },
    rangeLabel: '0.6 – 1.2 mg/dL',
    category: 'Kidney Function',
    explanation:
      'Creatinine is a waste product from muscle use. Kidneys filter it out, so its level in blood reflects how well they are working.',
    abnormal: {
      high: {
        insight:
          'High creatinine usually means kidneys are filtering less efficiently. Dehydration, muscle mass, and some medications can raise it temporarily.',
        symptoms: sx(['Often none early', 'Swelling', 'Fatigue', 'Reduced urine output']),
        prevention: sx(['Stay hydrated', 'Limit NSAID painkillers (e.g., ibuprofen)', 'Control blood pressure and diabetes', 'Avoid excess protein supplements']),
        consult:
          'Persistently high creatinine requires medical evaluation of kidney function.',
      },
      low: { insight: 'Low creatinine is usually related to low muscle mass and is not alarming.', symptoms: sx([]), prevention: sx(['Balanced diet and strength training']), consult: 'No action needed.' },
    },
  },
  {
    id: 'bun',
    name: 'BUN / Urea Nitrogen',
    aliases: [/blood urea nitrogen/i, /\b(?:bun|urea)\b/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 7, max: 20 },
    rangeLabel: '7 – 20 mg/dL',
    category: 'Kidney Function',
    explanation:
      'BUN measures the urea waste produced from protein breakdown. Like creatinine, it reflects kidney filtering, but also hydration and protein intake.',
    abnormal: {
      high: {
        insight:
          'High BUN often means dehydration or high protein intake. Together with high creatinine, it suggests kidney strain; a high ratio can indicate bleeding in the gut.',
        symptoms: sx(['Fatigue', 'Reduced urine', 'Swelling']),
        prevention: sx(['Drink enough water', 'Moderate protein intake', 'Manage blood pressure']),
        consult: 'Persistent elevation with high creatinine warrants a doctor visit.',
      },
      low: { insight: 'Low BUN can occur with low protein intake, pregnancy, or liver issues.', symptoms: sx([]), prevention: sx(['Ensure adequate protein']), consult: 'Rarely concerning; discuss if persistent.' },
    },
  },
  {
    id: 'egfr',
    name: 'eGFR (Estimated Glomerular Filtration Rate)',
    aliases: [/egfr/i, /gfr/i, /glomerular filtration/i],
    unitHint: /(ml\/?min|mL\/min\/1\.73)/i,
    range: { min: 90, max: 999 },
    rangeLabel: '90 or above is normal',
    category: 'Kidney Function',
    explanation:
      'eGFR estimates how many milliliters of blood your kidneys filter per minute. It is calculated from creatinine, age, and sex.',
    abnormal: {
      high: { insight: 'High eGFR is generally a good sign of kidney function.', symptoms: sx([]), prevention: sx(['Keep healthy habits']), consult: 'No action needed.' },
      low: {
        insight:
          'Lower eGFR means reduced kidney function. Values under 60 suggest chronic kidney disease stages that should be monitored closely.',
        symptoms: sx(['Fatigue', 'Swelling of ankles', 'Itchy skin', 'Reduced appetite']),
        prevention: sx(['Control blood sugar and blood pressure', 'Limit salt', 'Avoid NSAIDs', 'Stay hydrated', 'Stop smoking']),
        consult:
          'Any eGFR below 60 needs medical follow-up; below 30 requires a nephrologist (kidney specialist).',
      },
    },
  },
  {
    id: 'uric_acid',
    name: 'Uric Acid',
    aliases: [/uric acid/i, /\b(?:ua)\b/i],
    unitHint: /(mg\/?dL|umol\/?l|µmol\/?l)/i,
    range: { min: 3.5, max: 7.2 },
    rangeLabel: '3.5 – 7.2 mg/dL',
    category: 'Kidney Function',
    explanation:
      'Uric acid is a waste product from the breakdown of purines, found in many foods and your own cells.',
    abnormal: {
      high: {
        insight:
          'High uric acid can crystallize in joints, causing gout, or in the kidneys, causing stones. Often linked to rich diets, alcohol, and dehydration.',
        symptoms: sx(['Sudden joint pain (often big toe)', 'Swelling and redness', 'Kidney stone pain']),
        prevention: sx(['Limit red meat, shellfish, and organ meats', 'Avoid sugary drinks', 'Limit beer and alcohol', 'Drink plenty of water', 'Maintain healthy weight']),
        consult:
          'See a doctor for recurrent joint pain or kidney stone symptoms.',
      },
      low: { insight: 'Low uric acid is rarely a concern.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'sodium',
    name: 'Sodium (Na)',
    aliases: [/sodium/i, /\bna\+?\b/i],
    unitHint: /(mmol\/?l|mEq\/?l|meq\/?l)/i,
    range: { min: 135, max: 145 },
    rangeLabel: '135 – 145 mmol/L',
    category: 'Electrolytes',
    explanation:
      'Sodium helps balance the water in and around your cells and supports nerves and muscles.',
    abnormal: {
      high: {
        insight:
          'High sodium (hypernatremia) usually means too little water — from dehydration, high salt intake, or certain conditions.',
        symptoms: sx(['Thirst', 'Dry mouth', 'Weakness', 'Confusion']),
        prevention: sx(['Drink water steadily', 'Limit salty processed food', 'Monitor in hot weather or illness']),
        consult: 'Severe or sudden rises need medical attention.',
      },
      low: {
        insight:
          'Low sodium (hyponatremia) can come from too much water, certain medications, or conditions affecting hormones or kidneys.',
        symptoms: sx(['Nausea', 'Headache', 'Confusion', 'Fatigue', 'Muscle cramps']),
        prevention: sx(['Drink fluids in balance with your body needs', 'Review medications']),
        consult: 'Low sodium with symptoms should be evaluated promptly.',
      },
    },
  },
  {
    id: 'potassium',
    name: 'Potassium (K)',
    aliases: [/potassium/i, /\b(?:k|k\+)\b/i],
    unitHint: /(mmol\/?l|mEq\/?l|meq\/?l)/i,
    range: { min: 3.5, max: 5.0 },
    rangeLabel: '3.5 – 5.0 mmol/L',
    category: 'Electrolytes',
    explanation:
      'Potassium is crucial for heart rhythm, muscle contraction, and nerve signaling. Both high and low levels can affect the heart.',
    abnormal: {
      high: {
        insight:
          'High potassium (hyperkalemia) can be caused by kidney disease, certain blood pressure pills, or excess supplements. High levels affect the heartbeat.',
        symptoms: sx(['Palpitations', 'Weakness', 'Numbness', 'Irregular heartbeat']),
        prevention: sx(['Avoid excessive potassium supplements', 'Limit salt substitutes with potassium', 'Treat kidney disease and follow medications']),
        consult:
          'A high potassium needs prompt medical review — it can be dangerous.',
      },
      low: {
        insight:
          'Low potassium (hypokalemia) commonly follows vomiting, diarrhea, diuretics, or poor diet. It can cause weakness and heart rhythm changes.',
        symptoms: sx(['Muscle cramps or weakness', 'Fatigue', 'Palpitations', 'Constipation']),
        prevention: sx(['Eat potassium-rich foods (bananas, potatoes, spinach, oranges)', 'Stay hydrated', 'Review diuretic use']),
        consult: 'Severe or symptomatic low potassium needs medical attention.',
      },
    },
  },
  {
    id: 'calcium',
    name: 'Calcium (Ca)',
    aliases: [/calcium/i, /\b(?:ca|ca2\+)\b/i],
    unitHint: /(mg\/?dL|mmol\/?l)/i,
    range: { min: 8.5, max: 10.2 },
    rangeLabel: '8.5 – 10.2 mg/dL',
    category: 'Electrolytes',
    explanation:
      'Calcium is essential for bones, teeth, muscle contraction, and nerve function. Most of it is stored in bones.',
    abnormal: {
      high: {
        insight:
          'High calcium can be due to overactive parathyroid glands, some cancers, excess vitamin D, or dehydration.',
        symptoms: sx(['Thirst', 'Frequent urination', 'Constipation', 'Kidney stones', 'Fatigue']),
        prevention: sx(['Drink water', 'Review calcium and vitamin D supplements']),
        consult: 'Persistent high calcium deserves medical workup.',
      },
      low: {
        insight:
          'Low calcium can result from low vitamin D, parathyroid issues, or low magnesium. It affects nerves and muscles.',
        symptoms: sx(['Muscle cramps', 'Numbness or tingling', 'Fatigue', 'Irritability']),
        prevention: sx(['Adequate vitamin D and calcium intake', 'Sunlight exposure', 'Dairy or fortified alternatives']),
        consult: 'Symptomatic low calcium should be checked by a doctor.',
      },
    },
  },
  {
    id: 'tsh',
    name: 'TSH (Thyroid Stimulating Hormone)',
    aliases: [/tsh/i, /thyroid stimulating hormone/i, /thyrotropin/i],
    unitHint: /(m[uµ]?i?u\/?ml|miu\/?l|uIU\/?mL|u\/?ml)/i,
    range: { min: 0.4, max: 4.0 },
    rangeLabel: '0.4 – 4.0 mIU/L (varies by lab and age)',
    category: 'Thyroid',
    explanation:
      'TSH is made by the pituitary to “instruct” the thyroid. It is the most sensitive screening test for thyroid disorders.',
    abnormal: {
      high: {
        insight:
          'High TSH usually means an underactive thyroid (hypothyroidism): the pituitary is signaling harder because the thyroid is sluggish.',
        symptoms: sx(['Fatigue', 'Weight gain', 'Feeling cold', 'Dry skin', 'Hair loss', 'Constipation', 'Depression']),
        prevention: sx(['Discuss levothyroxine with your doctor', 'Balanced diet with iodine (salt, seafood, dairy)', 'Regular TSH monitoring']),
        consult: 'See a doctor — hypothyroidism is very treatable with daily medication.',
      },
      low: {
        insight:
          'Low TSH usually signals an overactive thyroid (hyperthyroidism), where the thyroid releases too much hormone and the pituitary turns down its signal.',
        symptoms: sx(['Weight loss', 'Rapid heartbeat', 'Feeling hot', 'Anxiety', 'Trembling hands', 'Frequent bowel movements']),
        prevention: sx(['Limit excess caffeine', 'Manage stress', 'Follow up thyroid function regularly']),
        consult: 'See a doctor, since untreated hyperthyroidism can affect the heart.',
      },
    },
  },
  {
    id: 'vitd',
    name: 'Vitamin D (25-OH)',
    aliases: [/vitamin d/i, /25.?hydroxy.?vitamin/i, /25.?oh.?d/i, /\bvit\s*d\b/i],
    unitHint: /(ng\/?ml|nmol\/?l)/i,
    range: { min: 30, max: 100 },
    rangeLabel: '30 – 100 ng/mL (sufficient ≥ 30)',
    category: 'Vitamins',
    explanation:
      'Vitamin D helps your body absorb calcium, supports bones, immunity, and mood. It is mostly made from sunlight on skin.',
    abnormal: {
      high: { insight: 'Very high vitamin D is usually from excess supplementation and can raise calcium.', symptoms: sx(['Nausea', 'Weakness']), prevention: sx(['Avoid mega-dose supplements']), consult: 'Rare; discuss supplement doses.' },
      low: {
        insight:
          'Low vitamin D is extremely common, especially with indoor lifestyles and in winter. It weakens bones and can affect mood and immunity.',
        symptoms: sx(['Bone or muscle aches', 'Fatigue', 'Frequent illness', 'Low mood']),
        prevention: sx(['15–30 minutes of midday sun most days', 'Eat fatty fish, eggs, fortified milk', 'Take vitamin D3 if advised (esp. winter)']),
        consult: 'A doctor can advise the right dose to restore healthy levels.',
      },
    },
  },
  {
    id: 'b12',
    name: 'Vitamin B12',
    aliases: [/vitamin b12/i, /\bb12\b/i, /cobalamin/i],
    unitHint: /(pg\/?ml|pmol\/?l|ng\/?l)/i,
    range: { min: 200, max: 900 },
    rangeLabel: '200 – 900 pg/mL (lab-dependent)',
    category: 'Vitamins',
    explanation:
      'Vitamin B12 keeps nerves healthy and is needed to make red blood cells and DNA. It comes from animal foods.',
    abnormal: {
      high: { insight: 'High B12 is usually not harmful; it can occur with supplements or some conditions.', symptoms: sx([]), prevention: sx([]), consult: 'Rarely needs action.' },
      low: {
        insight:
          'Low B12 is common in vegetarians/vegans, older adults, and people with absorption issues (e.g., pernicious anemia, gut conditions, metformin).',
        symptoms: sx(['Fatigue', 'Weakness', 'Tingling in hands or feet', 'Memory problems', 'Sore tongue', 'Hair loss']),
        prevention: sx(['Include eggs, fish, meat, dairy, or fortified foods', 'Vegans: use fortified foods or B12 supplements', 'Address stomach issues that reduce absorption']),
        consult:
          'Persistent low B12 with nerve symptoms should be evaluated; injections may be needed.',
      },
    },
  },
  {
    id: 'ferritin',
    name: 'Ferritin',
    aliases: [/ferritin/i, /\b(?:fer)\b/i],
    unitHint: /(ng\/?ml|ug\/?l|µg\/?l)/i,
    range: { min: 12, max: 300 },
    rangeLabel: '12 – 300 ng/mL (Men) · 12 – 150 ng/mL (Women)',
    category: 'Vitamins / Iron',
    explanation:
      'Ferritin is your body’s stored iron. It is the best single test for whether iron stores are adequate.',
    abnormal: {
      high: {
        insight:
          'High ferritin can mean iron overload or, more commonly, inflammation (ferritin rises with any inflammation). Hemochromatosis is a rarer cause.',
        symptoms: sx(['Joint pain', 'Fatigue', 'Abdominal pain']),
        prevention: sx(['Limit iron supplements unless advised', 'Avoid excess red meat', 'Limit alcohol']),
        consult: 'High ferritin should be interpreted with other markers by a doctor.',
      },
      low: {
        insight:
          'Low ferritin means iron stores are running out — the earliest sign of iron deficiency, even before anemia appears.',
        symptoms: sx(['Fatigue', 'Hair loss', 'Pale skin', 'Restless legs', 'Poor concentration']),
        prevention: sx(['Iron-rich foods (red meat, lentils, spinach, fortified cereal)', 'Combine with vitamin C', 'Avoid tea/coffee at meals (blocks absorption)']),
        consult: 'See a doctor to confirm the cause and the right iron treatment.',
      },
    },
  },
  {
    id: 'crp',
    name: 'CRP (C-Reactive Protein)',
    aliases: [/c.?reactive protein/i, /\b(?:crp)\b/i, /high.?sensitivity crp/i],
    unitHint: /(mg\/?l|mg\/?dl)/i,
    range: { min: 0, max: 9 },
    rangeLabel: 'Typically under 10 mg/L (lab-dependent)',
    category: 'Inflammation',
    explanation:
      'CRP is a protein made by the liver that rises when there is inflammation anywhere in the body — from infection, injury, or chronic disease.',
    abnormal: {
      high: {
        insight:
          'A high CRP simply says there is inflammation. It could be from an infection, autoimmune flare, or chronic conditions. It does not say where.',
        symptoms: sx(['Fever', 'Body aches', 'Fatigue']),
        prevention: sx(['Treat the underlying infection or condition', 'Anti-inflammatory diet (vegetables, fish, olive oil)', 'Sleep and stress management']),
        consult: 'A doctor should investigate the source of persistent inflammation.',
      },
      low: { insight: 'Low CRP is good — it means little systemic inflammation.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'esr',
    name: 'ESR (Sedimentation Rate)',
    aliases: [/erythrocyte sedimentation/i, /\b(?:esr|sed rate|sedimentation)\b/i],
    unitHint: /(mm\/?hr|mm\/?h)/i,
    range: { min: 0, max: 22 },
    rangeLabel: '0 – 22 mm/hr (varies with age/sex)',
    category: 'Inflammation',
    explanation:
      'ESR measures how fast red blood cells settle in a tube. It is a non-specific marker of inflammation that rises slowly.',
    abnormal: {
      high: {
        insight:
          'High ESR suggests ongoing inflammation, possibly from infection, autoimmune disease, or anemia. It is non-specific and needs clinical context.',
        symptoms: sx(['Fever', 'Joint pain', 'Fatigue', 'Weight loss']),
        prevention: sx(['Follow treatment for underlying condition', 'Balanced anti-inflammatory diet']),
        consult: 'Persistent high ESR with symptoms warrants medical evaluation.',
      },
      low: { insight: 'Low ESR is not a concern.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
    },
  },
  {
    id: 'mcv',
    name: 'MCV (Mean Corpuscular Volume)',
    aliases: [/mean corpuscular volume/i, /\b(?:mcv)\b/i],
    unitHint: /(fL|fl)/i,
    range: { min: 80, max: 100 },
    rangeLabel: '80 – 100 fL',
    category: 'Complete Blood Count',
    explanation:
      'MCV measures the average size of your red blood cells. It helps doctors classify the type of anemia.',
    abnormal: {
      high: {
        insight:
          'Large red cells (high MCV) often relate to B12 or folate deficiency, alcohol, or certain medications.',
        symptoms: sx(['Fatigue', 'Tingling', 'Pale skin']),
        prevention: sx(['Ensure B12 and folate intake', 'Limit alcohol']),
        consult: 'A doctor can determine the cause of the large cells.',
      },
      low: {
        insight: 'Small red cells (low MCV) most commonly indicate iron deficiency or thalassemia trait.',
        symptoms: sx(['Fatigue', 'Weakness', 'Pale skin']),
        prevention: sx(['Iron-rich diet with vitamin C', 'Test iron studies']),
        consult: 'See a doctor to tell iron deficiency from other causes.',
      },
    },
  },
  {
    id: 'folate',
    name: 'Folate (Vitamin B9)',
    aliases: [/folate/i, /folic acid/i],
    unitHint: /(ng\/?ml|nmol\/?l)/i,
    range: { min: 5, max: 20 },
    rangeLabel: '5 – 20 ng/mL',
    category: 'Vitamins',
    explanation:
      'Folate is a B vitamin needed to make red blood cells and DNA. Leafy greens are rich sources.',
    abnormal: {
      high: { insight: 'High folate is rarely a concern.', symptoms: sx([]), prevention: sx([]), consult: 'No action needed.' },
      low: {
        insight:
          'Low folate can cause megaloblastic anemia and is linked to birth defects when deficient in pregnancy.',
        symptoms: sx(['Fatigue', 'Pale skin', 'Sore mouth', 'Weakness']),
        prevention: sx(['Eat leafy greens, legumes, citrus, and fortified grains', 'Supplement in pregnancy as advised']),
        consult: 'Low folate should be corrected, especially when planning pregnancy.',
      },
    },
  },
]

export const SUPPORTED_TYPES = ['pdf', 'jpg', 'jpeg', 'png']

export const CATEGORY_COLORS = {
  'Complete Blood Count': { badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300', dot: 'bg-rose-500' },
  'Glucose': { badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300', dot: 'bg-amber-500' },
  'Lipid Profile': { badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300', dot: 'bg-sky-500' },
  'Liver Function': { badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'Kidney Function': { badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-300', dot: 'bg-violet-500' },
  'Electrolytes': { badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300', dot: 'bg-cyan-500' },
  'Thyroid': { badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300', dot: 'bg-indigo-500' },
  'Vitamins': { badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-300', dot: 'bg-teal-500' },
  'Vitamins / Iron': { badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-300', dot: 'bg-teal-500' },
  'Inflammation': { badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-300', dot: 'bg-orange-500' },
  'Liver Function / Protein': { badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300', dot: 'bg-emerald-500' },
  'Uncategorized': { badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-300', dot: 'bg-slate-500' },
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Uncategorized
}
