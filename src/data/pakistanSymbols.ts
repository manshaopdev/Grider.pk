export interface SymbolCategory {
  id: string;
  name: string;
  nameUrdu: string;
  symbols: {
    id: string;
    name: string;
    nameUrdu: string;
    svgPath: string;
    viewBox: string;
    defaultFill: string;
    defaultStroke?: string;
  }[];
}

export const PAKISTAN_SYMBOLS: SymbolCategory[] = [
  {
    id: 'national',
    name: 'National Emblems',
    nameUrdu: 'قومی نشانات',
    symbols: [
      {
        id: 'crescent-star',
        name: 'Hilal-o-Sitara (Crescent & Star)',
        nameUrdu: 'ہلال و ستارہ',
        viewBox: '0 0 100 100',
        defaultFill: '#FFFFFF',
        svgPath: 'M50,15 A35,35 0 1,0 85,50 A28,28 0 1,1 50,15 Z M68,26 L72,37 L83,38 L75,46 L77,57 L68,52 L59,57 L61,46 L53,38 L64,37 Z'
      },
      {
        id: 'minar-e-pakistan',
        name: 'Minar-e-Pakistan',
        nameUrdu: 'مینارِ پاکستان',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M48,8 L52,8 L51,20 L55,35 L53,55 L65,70 L72,82 L75,90 L25,90 L28,82 L35,70 L47,55 L45,35 L49,20 Z M46,65 L54,65 L54,85 L46,85 Z M35,85 L65,85 L62,75 L38,75 Z M49,2 L51,2 L51,8 L49,8 Z'
      },
      {
        id: 'faisal-mosque',
        name: 'Faisal Mosque',
        nameUrdu: 'فیصل مسجد',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M15,20 L18,20 L18,80 L15,80 Z M82,20 L85,20 L85,80 L82,80 Z M30,30 L32,30 L32,80 L30,80 Z M68,30 L70,30 L70,80 L68,80 Z M50,28 L72,75 L28,75 Z M50,38 L63,70 L37,70 Z M48,70 L52,70 L52,80 L48,80 Z M48,22 L52,22 L50,15 Z'
      },
      {
        id: 'markhor',
        name: 'Markhor Crest',
        nameUrdu: 'مارخور',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M50,45 C42,45 35,52 35,60 C35,68 40,78 50,88 C60,78 65,68 65,60 C65,52 58,45 50,45 Z M42,42 C38,30 25,25 22,12 C30,18 36,28 44,38 Z M58,42 C62,30 75,25 78,12 C70,18 64,28 56,38 Z M32,24 C22,18 18,8 15,4 C22,10 28,18 34,26 Z M68,24 C78,18 82,8 85,4 C78,10 72,18 66,26 Z M45,62 A3,3 0 1,1 45,56 A3,3 0 1,1 45,62 Z M55,62 A3,3 0 1,1 55,56 A3,3 0 1,1 55,62 Z'
      },
      {
        id: 'shaheen-falcon',
        name: 'Shaheen Falcon',
        nameUrdu: 'شاہین',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M50,20 C55,20 60,25 60,32 C60,35 58,38 55,40 C68,42 85,32 95,20 C88,40 75,55 58,62 C62,72 65,82 50,92 C42,82 45,72 42,62 C25,55 12,40 5,20 C15,32 32,42 45,40 C42,38 40,35 40,32 C40,25 45,20 50,20 Z'
      },
      {
        id: 'wheat-wreath',
        name: 'State Wreath (Gandum)',
        nameUrdu: 'گندم کی بالیاں',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M50,85 C32,85 20,68 20,50 C20,38 25,28 32,20 C30,28 32,36 38,44 C34,50 34,60 40,68 C44,72 48,76 50,85 Z M50,85 C68,85 80,68 80,50 C80,38 75,28 68,20 C70,28 68,36 62,44 C66,50 66,60 60,68 C56,72 52,76 50,85 Z M47,88 L53,88 L50,95 Z'
      },
      {
        id: 'chambeli-jasmine',
        name: 'Chambeli (Jasmine)',
        nameUrdu: 'چمبیلی',
        viewBox: '0 0 100 100',
        defaultFill: '#FFFFFF',
        svgPath: 'M50,50 C50,35 42,22 50,15 C58,22 50,35 50,50 Z M50,50 C65,50 78,42 85,50 C78,58 65,50 50,50 Z M50,50 C50,65 58,78 50,85 C42,78 50,65 50,50 Z M50,50 C35,50 22,58 15,50 C22,42 35,50 50,50 Z M50,50 C38,40 28,28 35,22 C42,28 42,38 50,50 Z M50,50 C62,40 72,28 65,22 C58,28 58,38 50,50 Z'
      }
    ]
  },
  {
    id: 'truckart',
    name: 'Truck Art Motifs',
    nameUrdu: 'ٹرک آرٹ',
    symbols: [
      {
        id: 'truckart-peacock',
        name: 'Truck Art Peacock',
        nameUrdu: 'مور ٹرک آرٹ',
        viewBox: '0 0 100 100',
        defaultFill: '#E11D48',
        svgPath: 'M50,25 C55,20 65,20 68,28 C70,35 62,42 55,45 C65,48 78,55 85,75 C70,72 60,62 55,55 C52,65 50,75 48,85 C45,75 42,65 40,55 C35,62 25,72 15,75 C22,55 35,48 45,45 C38,42 30,35 32,28 C35,20 45,20 50,25 Z'
      },
      {
        id: 'truckart-floral',
        name: 'Chamakpatti Rose Motif',
        nameUrdu: 'گلاب چمک پٹی',
        viewBox: '0 0 100 100',
        defaultFill: '#F59E0B',
        svgPath: 'M50,30 C58,18 75,25 72,40 C85,45 82,65 70,70 C70,85 50,88 50,75 C50,88 30,85 30,70 C18,65 15,45 28,40 C25,25 42,18 50,30 Z M50,42 A10,10 0 1,0 50,62 A10,10 0 1,0 50,42 Z'
      },
      {
        id: 'truckart-sunburst',
        name: 'Truck Art Taj Crown',
        nameUrdu: 'تاج ٹرک آرٹ',
        viewBox: '0 0 100 100',
        defaultFill: '#06B6D4',
        svgPath: 'M15,70 L25,35 L40,55 L50,25 L60,55 L75,35 L85,70 Z M20,75 L80,75 L80,82 L20,82 Z'
      },
      {
        id: 'paisley-ambi',
        name: 'Kashmiri Ambi / Paisley',
        nameUrdu: 'آمبی بوٹا',
        viewBox: '0 0 100 100',
        defaultFill: '#10B981',
        svgPath: 'M50,85 C30,85 20,68 22,50 C25,32 40,20 50,10 C52,18 60,24 62,32 C65,42 58,48 52,48 C46,48 42,42 44,36 C40,42 40,55 46,62 C52,68 62,65 68,58 C72,52 75,40 80,35 C82,55 75,85 50,85 Z'
      }
    ]
  },
  {
    id: 'islamic',
    name: 'Islamic & Geometry',
    nameUrdu: 'اسلامی جیومیٹری',
    symbols: [
      {
        id: 'rub-el-hizb',
        name: '8-Point Star (Khatim)',
        nameUrdu: 'آٹھ کونوں والا ستارہ',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M25,25 L75,25 L75,75 L25,75 Z M50,15 L85,50 L50,85 L15,50 Z'
      },
      {
        id: 'dome-arch',
        name: 'Mughal Mehrab Arch',
        nameUrdu: 'محراب و گنبد',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M25,85 L25,50 C25,30 45,15 50,12 C55,15 75,30 75,50 L75,85 Z M35,85 L35,52 C35,38 48,25 50,22 C52,25 65,38 65,52 L65,85 Z'
      },
      {
        id: 'arabesque-star',
        name: '12-Fold Geometric Rosette',
        nameUrdu: 'اسلامی نقاشی',
        viewBox: '0 0 100 100',
        defaultFill: '#D97706',
        svgPath: 'M50,10 L58,28 L78,20 L75,40 L95,48 L80,62 L90,80 L70,80 L62,98 L50,85 L38,98 L30,80 L10,80 L20,62 L5,48 L25,40 L22,20 L42,28 Z M50,32 A18,18 0 1,0 50,68 A18,18 0 1,0 50,32 Z'
      }
    ]
  },
  {
    id: 'shields',
    name: 'Badges & Crests',
    nameUrdu: 'شیلڈز اور مونوگرام',
    symbols: [
      {
        id: 'royal-crest-shield',
        name: 'Royal Heraldic Shield',
        nameUrdu: 'شاہی شیلڈ',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M20,20 L80,20 L80,50 C80,72 50,90 50,90 C50,90 20,72 20,50 Z M26,26 L74,26 L74,49 C74,68 50,83 50,83 C50,83 26,68 26,49 Z'
      },
      {
        id: 'circular-seal',
        name: 'Circular Stamp Seal',
        nameUrdu: 'گول مہر',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M50,10 A40,40 0 1,0 50,90 A40,40 0 1,0 50,10 Z M50,16 A34,34 0 1,1 50,84 A34,34 0 1,1 50,16 Z M50,22 A28,28 0 1,0 50,78 A28,28 0 1,0 50,22 Z'
      },
      {
        id: 'ribbon-banner',
        name: 'Curved Ribbon Banner',
        nameUrdu: 'ربن بینر',
        viewBox: '0 0 100 100',
        defaultFill: '#D97706',
        svgPath: 'M15,45 L30,35 L30,55 L15,65 Z M85,45 L70,35 L70,55 L85,65 Z M25,40 Q50,30 75,40 L75,60 Q50,50 25,60 Z'
      },
      {
        id: 'cricket-crest',
        name: 'Pakistan Cricket Crest',
        nameUrdu: 'کرکٹ نشان',
        viewBox: '0 0 100 100',
        defaultFill: '#01411C',
        svgPath: 'M50,15 L80,30 L80,60 C80,78 50,90 50,90 C50,90 20,78 20,60 L20,30 Z M46,35 L40,70 L48,70 L54,35 Z M56,45 A6,6 0 1,1 56,33 A6,6 0 1,1 56,45 Z'
      },
      {
        id: 'chai-cup',
        name: 'Shahi Chai Cup (Dhaba)',
        nameUrdu: 'چائے کپ ڈھابہ',
        viewBox: '0 0 100 100',
        defaultFill: '#B45309',
        svgPath: 'M25,45 L75,45 L70,75 C70,82 60,85 50,85 C40,85 30,82 30,75 Z M75,52 C82,52 87,58 87,64 C87,70 82,74 75,74 Z M40,25 Q45,35 40,40 M50,20 Q55,32 50,40 M60,25 Q65,35 60,40'
      }
    ]
  }
];

export const PAKISTANI_CALLIGRAPHY_PRESETS = [
  { id: 'pak-zindabad', text: 'پاکستان زندہ باد', font: 'font-nastaliq', meaning: 'Long Live Pakistan' },
  { id: 'pakistan', text: 'پاکستان', font: 'font-nastaliq', meaning: 'Pakistan' },
  { id: 'bismillah', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', font: 'font-amiri', meaning: 'In the name of Allah' },
  { id: 'shan-e-pak', text: 'شانِ پاکستان', font: 'font-nastaliq', meaning: 'Pride of Pakistan' },
  { id: 'lahore', text: 'شہرِ لاہور', font: 'font-nastaliq', meaning: 'City of Lahore' },
  { id: 'karachi', text: 'عروس البلاد کراچی', font: 'font-nastaliq', meaning: 'Karachi City' },
  { id: 'islamabad', text: 'اسلام آباد', font: 'font-nastaliq', meaning: 'Capital Islamabad' },
  { id: 'khyber', text: 'خیبر پختونخوا', font: 'font-nastaliq', meaning: 'Khyber Pakhtunkhwa' },
  { id: 'balochistan', text: 'بلوچستان', font: 'font-nastaliq', meaning: 'Balochistan' },
  { id: 'punjab', text: 'پنجاب', font: 'font-nastaliq', meaning: 'Punjab' },
  { id: 'sindh', text: 'باب الاسلام سندھ', font: 'font-nastaliq', meaning: 'Sindh' },
  { id: 'shahi-chai', text: 'شاہی ڈھابہ چائے', font: 'font-nastaliq', meaning: 'Shahi Chai Dhaba' },
  { id: 'markhor-club', text: 'مارخور اسپورٹس', font: 'font-nastaliq', meaning: 'Markhor Sports' },
  { id: 'desi-taste', text: 'اصلی دیسی ذائقہ', font: 'font-nastaliq', meaning: 'Authentic Desi Taste' }
];

export const PAKISTAN_COLOR_PALETTES = [
  { name: 'Flag Green & White', colors: ['#01411C', '#FFFFFF', '#0A5C28', '#E5E7EB'] },
  { name: 'Royal Gold & Emerald', colors: ['#01411C', '#D4AF37', '#F59E0B', '#111827'] },
  { name: 'Truck Art Vibrant', colors: ['#E11D48', '#F59E0B', '#06B6D4', '#10B981'] },
  { name: 'Lahore Terracotta', colors: ['#9A3412', '#D97706', '#FEF3C7', '#1E293B'] },
  { name: 'Sindh Ajrak Blue & Red', colors: ['#1E3A8A', '#991B1B', '#FFFFFF', '#1F2937'] },
  { name: 'Margalla Mist', colors: ['#064E3B', '#10B981', '#E0E7FF', '#0F172A'] }
];
