// ============================================
// عُمان في الأخبار — Demo Data
// Realistic sample news articles about Oman
// ============================================

export const DEMO_DATA = {
  achievements: [
    {
      id: 'demo-ach-1',
      title: 'عُمان تفوز بجائزة أفضل وجهة سياحية مستدامة في الشرق الأوسط لعام 2026',
      description: 'حصلت سلطنة عُمان على جائزة أفضل وجهة سياحية مستدامة في منطقة الشرق الأوسط، وذلك خلال حفل توزيع جوائز السياحة العالمية المقام في لندن، تقديراً لجهودها في الحفاظ على البيئة وتطوير السياحة البيئية.',
      source: 'وكالة الأنباء العمانية',
      sourceIcon: '🇴🇲',
      date: '2026-06-14',
      url: '#',
      image: 'https://images.unsplash.com/photo-1597524678053-5e6fef52d8a3?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['جائزة', 'سياحة', 'مستدامة']
    },
    {
      id: 'demo-ach-2',
      title: 'مهندسة عمانية تحصل على براءة اختراع في مجال الطاقة المتجددة من جامعة MIT',
      description: 'حصلت المهندسة العمانية فاطمة الحارثية على براءة اختراع من معهد ماساتشوستس للتكنولوجيا عن ابتكارها في تطوير خلايا شمسية بكفاءة عالية تتحمل درجات الحرارة المرتفعة، وهو إنجاز علمي متميز يُسهم في تعزيز مكانة عُمان في مجال الابتكار.',
      source: 'جريدة عمان',
      sourceIcon: '📰',
      date: '2026-06-13',
      url: '#',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['براءة اختراع', 'ابتكار', 'طاقة']
    },
    {
      id: 'demo-ach-3',
      title: 'المنتخب العماني لكرة القدم يتأهل لنهائيات كأس العالم 2026',
      description: 'في إنجاز تاريخي غير مسبوق، تمكن المنتخب العماني لكرة القدم من التأهل لنهائيات كأس العالم، محققاً حلم ملايين العمانيين بعد فوزه في المباراة الحاسمة بنتيجة 2-1.',
      source: 'الجزيرة الرياضية',
      sourceIcon: '⚽',
      date: '2026-06-12',
      url: '#',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['كرة القدم', 'تأهل', 'كأس العالم']
    },
    {
      id: 'demo-ach-4',
      title: 'شركة عمانية ناشئة تجمع 50 مليون دولار لتطوير تقنيات الهيدروجين الأخضر',
      description: 'نجحت شركة "هايدروم" العمانية الناشئة في جمع تمويل بقيمة 50 مليون دولار من مستثمرين دوليين لتطوير تقنيات إنتاج الهيدروجين الأخضر، مما يعزز مكانة عُمان كمركز رائد للطاقة النظيفة في المنطقة.',
      source: 'بلومبرغ العربية',
      sourceIcon: '💰',
      date: '2026-06-11',
      url: '#',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['هيدروجين', 'استثمار', 'طاقة نظيفة']
    },
    {
      id: 'demo-ach-5',
      title: 'طالب عماني يحصد المركز الأول في أولمبياد الرياضيات الدولي',
      description: 'حقق الطالب العماني أحمد البلوشي إنجازاً مميزاً بحصوله على الميدالية الذهبية في أولمبياد الرياضيات الدولي المقام في اليابان، ليكون أول عماني يحقق هذا الإنجاز في تاريخ المسابقة.',
      source: 'وزارة التربية والتعليم',
      sourceIcon: '🏅',
      date: '2026-06-10',
      url: '#',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['أولمبياد', 'رياضيات', 'ميدالية ذهبية']
    },
    {
      id: 'demo-ach-6',
      title: 'عُمان تُطلق أول قمر صناعي محلي الصنع بنجاح',
      description: 'أطلقت سلطنة عُمان بنجاح أول قمر صناعي مصمم ومصنّع محلياً بالكامل من قبل فريق هندسي عماني، في خطوة تاريخية نحو تعزيز القدرات الفضائية الوطنية وتحقيق رؤية عُمان 2040.',
      source: 'وكالة الأنباء العمانية',
      sourceIcon: '🛰️',
      date: '2026-06-09',
      url: '#',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['قمر صناعي', 'فضاء', 'تكنولوجيا']
    },
    {
      id: 'demo-ach-7',
      title: 'الخطوط الجوية العمانية تحصل على تصنيف خمس نجوم من سكاي تراكس',
      description: 'حصلت الخطوط الجوية العمانية على تصنيف خمس نجوم من مؤسسة سكاي تراكس العالمية، لتنضم إلى نادي شركات الطيران المتميزة عالمياً، وذلك تقديراً لجودة خدماتها وتجربة المسافرين المتميزة.',
      source: 'سكاي نيوز عربية',
      sourceIcon: '✈️',
      date: '2026-06-08',
      url: '#',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['طيران', 'تصنيف', 'خمس نجوم']
    },
    {
      id: 'demo-ach-8',
      title: 'فنانة عمانية تعرض أعمالها في متحف اللوفر بباريس',
      description: 'افتتحت الفنانة التشكيلية العمانية منى الرئيسية معرضها الفني "أصداء الصحراء" في متحف اللوفر بباريس، لتكون أول فنانة عمانية تحظى بهذا الشرف، حيث يضم المعرض 30 لوحة تمزج بين التراث العماني والفن المعاصر.',
      source: 'فرانس 24 عربي',
      sourceIcon: '🎨',
      date: '2026-06-07',
      url: '#',
      image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['فن', 'لوفر', 'معرض']
    },
    {
      id: 'demo-ach-9',
      title: 'ميناء صلالة يُصنّف ضمن أسرع 10 موانئ نمواً في العالم',
      description: 'حقق ميناء صلالة قفزة نوعية بتصنيفه ضمن أسرع عشرة موانئ نمواً على مستوى العالم وفقاً لتقرير منظمة التجارة العالمية، بفضل التوسعات الكبيرة في البنية التحتية وزيادة حجم التجارة.',
      source: 'رويترز',
      sourceIcon: '🚢',
      date: '2026-06-06',
      url: '#',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['ميناء', 'تجارة', 'نمو']
    },
    {
      id: 'demo-ach-10',
      title: 'جامعة السلطان قابوس تحتل المرتبة الأولى عربياً في أبحاث تحلية المياه',
      description: 'صنّف مؤشر نيتشر العلمي جامعة السلطان قابوس في المرتبة الأولى عربياً في مجال أبحاث تحلية المياه والتقنيات المستدامة، وذلك بفضل إنتاجها البحثي المتميز ونشرها في أرقى المجلات العلمية العالمية.',
      source: 'مجلة نيتشر',
      sourceIcon: '🔬',
      date: '2026-06-05',
      url: '#',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
      category: 'achievement',
      keywords: ['جامعة', 'أبحاث', 'علمي']
    }
  ],

  mentions: [
    {
      id: 'demo-men-1',
      title: 'Reuters: Oman emerges as key mediator in Middle East diplomatic talks',
      description: 'Reuters reports that Oman has played a crucial behind-the-scenes role in brokering recent diplomatic agreements in the Middle East, leveraging its longstanding reputation as a neutral mediator in regional affairs.',
      source: 'Reuters',
      sourceIcon: '🔵',
      date: '2026-06-14',
      url: '#',
      image: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['diplomacy', 'mediator', 'Middle East']
    },
    {
      id: 'demo-men-2',
      title: 'BBC: عُمان تتصدر قائمة الدول الأكثر أماناً في العالم العربي',
      description: 'في تقرير خاص نشرته هيئة الإذاعة البريطانية، صنّفت عُمان كأكثر دولة أماناً في العالم العربي وضمن أفضل 20 دولة عالمياً من حيث مؤشرات الأمان والاستقرار.',
      source: 'BBC Arabic',
      sourceIcon: '🟣',
      date: '2026-06-13',
      url: '#',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['أمان', 'تصنيف', 'استقرار']
    },
    {
      id: 'demo-men-3',
      title: 'Bloomberg: Oman\'s green hydrogen strategy attracts $30 billion in foreign investment',
      description: 'Bloomberg highlights Oman\'s ambitious green hydrogen strategy, noting that the Sultanate has attracted over $30 billion in foreign investment commitments, positioning itself as a global leader in clean energy production.',
      source: 'Bloomberg',
      sourceIcon: '🟡',
      date: '2026-06-12',
      url: '#',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['hydrogen', 'investment', 'energy']
    },
    {
      id: 'demo-men-4',
      title: 'الجزيرة: مسقط تستضيف مؤتمراً دولياً حول التنوع البيولوجي في المحيط الهندي',
      description: 'أشارت قناة الجزيرة إلى استضافة سلطنة عُمان لمؤتمر دولي كبير حول حماية التنوع البيولوجي في المحيط الهندي، بمشاركة أكثر من 60 دولة و500 خبير في مجال البيئة البحرية.',
      source: 'Al Jazeera',
      sourceIcon: '🟠',
      date: '2026-06-11',
      url: '#',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['مؤتمر', 'بيئة', 'بحري']
    },
    {
      id: 'demo-men-5',
      title: 'The Guardian: Oman\'s ancient falaj irrigation system inspires modern water conservation',
      description: 'The Guardian published a feature article exploring how Oman\'s UNESCO-listed falaj irrigation system, dating back over 2,500 years, is inspiring modern water conservation technologies worldwide.',
      source: 'The Guardian',
      sourceIcon: '🔴',
      date: '2026-06-10',
      url: '#',
      image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['falaj', 'heritage', 'water']
    },
    {
      id: 'demo-men-6',
      title: 'CNN: مسقط ضمن أجمل 10 مدن ساحلية في العالم لعام 2026',
      description: 'اختارت شبكة CNN مدينة مسقط ضمن قائمتها لأجمل عشر مدن ساحلية في العالم، مشيرة إلى مزيجها الفريد بين العمارة التقليدية والحداثة، وجمال جبالها المطلة على بحر عمان.',
      source: 'CNN',
      sourceIcon: '🔴',
      date: '2026-06-09',
      url: '#',
      image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['مسقط', 'سياحة', 'مدن ساحلية']
    },
    {
      id: 'demo-men-7',
      title: 'France24: Le sultanat d\'Oman renforce son rôle dans la diplomatie énergétique mondiale',
      description: 'France 24 reports on Oman\'s growing role in global energy diplomacy, highlighting the Sultanate\'s strategic position between OPEC and renewable energy advocates, and its balanced approach to energy transition.',
      source: 'France 24',
      sourceIcon: '🇫🇷',
      date: '2026-06-08',
      url: '#',
      image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['energy', 'diplomacy', 'OPEC']
    },
    {
      id: 'demo-men-8',
      title: 'DW: عُمان تطلق أكبر مشروع للطاقة الشمسية في شبه الجزيرة العربية',
      description: 'سلّطت قناة DW الألمانية الضوء على إطلاق سلطنة عُمان لأكبر مشروع للطاقة الشمسية في شبه الجزيرة العربية بقدرة 1.5 غيغاواط، في خطوة كبيرة نحو تحقيق الحياد الكربوني بحلول 2050.',
      source: 'DW عربية',
      sourceIcon: '🇩🇪',
      date: '2026-06-07',
      url: '#',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['طاقة شمسية', 'مشروع', 'حياد كربوني']
    },
    {
      id: 'demo-men-9',
      title: 'Al Arabiya: Oman\'s tourism sector records 40% growth in first half of 2026',
      description: 'Al Arabiya English reports that Oman\'s tourism sector has witnessed a remarkable 40% increase in visitor arrivals during the first half of 2026, driven by new visa reforms and the opening of several luxury eco-resorts.',
      source: 'Al Arabiya',
      sourceIcon: '🟤',
      date: '2026-06-06',
      url: '#',
      image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['tourism', 'growth', 'visitors']
    },
    {
      id: 'demo-men-10',
      title: 'Financial Times: Oman\'s economic diversification strategy shows promising results',
      description: 'The Financial Times analysis shows that Oman\'s Vision 2040 economic diversification plan is yielding significant results, with non-oil GDP growth reaching 8.2% in Q1 2026, surpassing initial targets.',
      source: 'Financial Times',
      sourceIcon: '📊',
      date: '2026-06-05',
      url: '#',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      category: 'mention',
      keywords: ['economy', 'diversification', 'Vision 2040']
    }
  ]
};
