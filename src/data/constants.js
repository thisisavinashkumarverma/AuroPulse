export const HOSPITAL = {
  name: 'AuroPulse Healthcare Hospital',
  short: 'AuroPulse',
  phone: '+91 44 4000 1000',
  emergency: '+91 44 4000 1099',
  email: 'care@auropulse.example',
  address: '42, Wellness Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
};

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const REPORT_TYPES = ['Blood Test', 'X-Ray', 'MRI', 'ECG'];
export const MED_CATEGORIES = [
  'Pain & Fever', 'Antibiotics', 'Allergy', 'Diabetes', 'Heart Care',
  'Digestive Care', 'Vitamins', 'Cold & Cough',
];

export const SLOTS = {
  morning: { label: 'Morning', time: '08:00' },
  afternoon: { label: 'Afternoon', time: '14:00' },
  night: { label: 'Night', time: '21:00' },
};

export const TESTIMONIALS = [
  { name: 'Meenakshi R.', role: 'Cardiac patient', text: 'The cardiology team explained every step of my treatment. Booking appointments online and downloading reports saved me so much time.' },
  { name: 'Faizal A.', role: 'Parent', text: 'Dr. Meera and the pediatrics ward were wonderful with my daughter. Clean, calm and very well organised.' },
  { name: 'Harish K.', role: 'Orthopedic patient', text: 'My knee replacement recovery was smooth thanks to the physiotherapy team. The pharmacy delivered my medicines the same day.' },
];

export const STATS = [
  { label: 'Patients Treated', value: 52000, suffix: '+' },
  { label: 'Expert Doctors', value: 120, suffix: '+' },
  { label: 'Hospital Beds', value: 450, suffix: '' },
  { label: 'Years of Service', value: 18, suffix: '' },
];
