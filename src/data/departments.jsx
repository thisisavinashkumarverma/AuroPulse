import {
  FaHeartbeat, FaBrain, FaBone, FaBaby, FaRibbon, FaHandHoldingMedical, FaDeaf, FaFemale,
} from 'react-icons/fa';

export const DEPARTMENTS = [
  { slug: 'cardiology', name: 'Cardiology', icon: FaHeartbeat, description: 'Advanced heart care including angioplasty, bypass surgery, arrhythmia management and preventive cardiology.', services: ['Echocardiography', 'Angioplasty', 'Cardiac rehabilitation'] },
  { slug: 'neurology', name: 'Neurology', icon: FaBrain, description: 'Diagnosis and treatment of stroke, epilepsy, migraine, movement disorders and spine conditions.', services: ['EEG & EMG', 'Stroke unit', 'Neurosurgery'] },
  { slug: 'orthopedics', name: 'Orthopedics', icon: FaBone, description: 'Joint replacement, sports injuries, trauma care and physiotherapy under one roof.', services: ['Knee & hip replacement', 'Arthroscopy', 'Physiotherapy'] },
  { slug: 'pediatrics', name: 'Pediatrics', icon: FaBaby, description: 'Gentle care for newborns, children and adolescents, with vaccination and neonatal ICU support.', services: ['Vaccination', 'NICU', 'Growth monitoring'] },
  { slug: 'oncology', name: 'Oncology', icon: FaRibbon, description: 'Comprehensive cancer care with chemotherapy, radiation therapy and supportive counselling.', services: ['Chemotherapy', 'Radiation therapy', 'Tumour board'] },
  { slug: 'dermatology', name: 'Dermatology', icon: FaHandHoldingMedical, description: 'Medical and cosmetic skin, hair and nail treatments by experienced dermatologists.', services: ['Laser therapy', 'Allergy testing', 'Hair clinic'] },
  { slug: 'ent', name: 'ENT', icon: FaDeaf, description: 'Ear, nose and throat care including hearing tests, sinus surgery and voice disorders.', services: ['Audiometry', 'Endoscopic sinus surgery', 'Sleep apnea care'] },
  { slug: 'gynecology', name: 'Gynecology', icon: FaFemale, description: 'Women\'s health, maternity care, fertility support and minimally invasive gynecologic surgery.', services: ['Antenatal care', 'Fertility clinic', 'Laparoscopy'] },
];

export const DEPARTMENT_NAMES = DEPARTMENTS.map((d) => d.name);
