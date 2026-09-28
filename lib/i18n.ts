export interface Translation {
  siteTitle: string;
  logoAlt: string;
  /** Single source of truth: every "join" CTA site-wide points here. */
  joinFormUrl: string;
  navLinks: { href: string; label: string }[];
  header: {
    joinUs: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    explore: string;
    legal: string;
    copy: string;
    rightsReserved: string;
    systemsOperational: string;
    join: string;
    contact: string;
    privacyPolicy: string;
    terms: string;
  };
  hero: {
    headline: string;
    motto: string;
    description: string;
    join: string;
    explore: string;
    fastFacts: string;
    membersJoinedLabel: string;
    stats: { label: string; value: string }[];
  };
  about: {
    kicker: string;
    heading: string;
    intro: string[];
    motto: string;
    journey: {
      kicker: string;
      timeline: { year: string; title: string; detail: string }[];
    };
    joinUs: {
      kicker: string;
      title: string;
      paragraphs: string[];
      linkLabel: string;
    };
    vision: {
      kicker: string;
      title: string;
      paragraphs: string[];
    };
    contact: {
      kicker: string;
      description: string;
      emailLabel: string;
      email: string;
    };
  };
  committees: {
    title: string;
    description: string;
    list: { title: string; description: string; icon: 'GraduationCap' | 'CalendarDays' | 'Megaphone' | 'Handshake' | 'Cpu' | 'Briefcase' }[];
  };
  projects: {
    title: string;
    description: string;
    items: { title: string; subtitle: string; category: string }[];
    action: string;
    viewAll: string;
  };
  events: {
    title: string;
    description: string;
    items: { title: string; date: string; location: string; description: string }[];
    action: string;
    viewAll: string;
    viewDetails: string;
    contactButton: string;
    stayConnectedTitle: string;
    stayConnectedDescription: string;
  };
  news: {
    title: string;
    description: string;
    items: { title: string; date: string }[];
    action: string;
    viewAll: string;
    contactLink: string;
    summary: string;
  };
  gallery: {
    title: string;
    description: string;
    /** caption is the custom text revealed on hover; falls back to label if not set. */
    items: { label: string; image: string; caption?: string }[];
    action: string;
  };
  partners: {
    title: string;
    description: string;
    itemLabel: string;
    list: string[];
  };
  joinSection: {
    tagline: string;
    title: string;
    description: string;
    openRolesLabel: string;
    roles: { title: string; description: string }[];
    processTitle: string;
    processSteps: string[];
    action: string;
    freeToJoinNote: string;
    learnMore: string;
  };
  newsletter: {
    title: string;
    description: string;
    emailLabel: string;
    inputPlaceholder: string;
    button: string;
    disclaimer: string;
  };
  contact: {
    title: string;
    description: string;
    getInTouch: string;
    respondsWithinLabel: string;
    respondsWithinValue: string;
    details: { label: string; value: string }[];
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      successTitle: string;
      successMessage: string;
    };
  };
  faq: {
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
  privacyPolicy: {
    title: string;
    description: string;
    sections: { title: string; content: string }[];
  };
  terms: {
    title: string;
    description: string;
    sections: { title: string; content: string }[];
  };
  notFound: {
    title: string;
    description: string;
    action: string;
    goBack: string;
  };
}

export const translation: Translation = {
  siteTitle: 'فريق AFAQ التقني',
  logoAlt: 'شعار فريق AFAQ التقني',
  joinFormUrl: 'https://forms.gle/GMtFerf98ywD4UCX7',
  navLinks: [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/committees', label: 'اللجان' },
    { href: '/events', label: 'الفعاليات' },
    { href: '/projects', label: 'المشاريع' },
    { href: '/contact', label: 'تواصل' },
    { href: '/faq', label: 'الأسئلة' },
  ],
  header: {
    joinUs: 'انضم إلينا',
    contact: 'تواصل',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
  },
  footer: {
    explore: 'استكشاف',
    legal: 'قانوني',
    copy: '© 2026 فريق AFAQ التقني. من أجل تمكين الشباب والتقنية وتأثير المجتمع.',
    rightsReserved: 'جميع الحقوق محفوظة.',
    systemsOperational: 'جميع الأنظمة تعمل بشكل طبيعي',
    join: 'انضم للفريق',
    contact: 'تواصل معنا',
    privacyPolicy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
  },
  hero: {
    headline: 'فريق آفاق التكنولوجيا | AFAQ Technology',
    motto: 'فكر.. عمل.. إنجاز.',
    description:
      'نُمكّن الشباب، نُطوّر القدرات، ونبني مستقبلًا رقميًا.\n\nفريق شبابي مستقل في مجال تكنولوجيا المعلومات، يضم شبابًا ومهتمين من مختلف المحافظات الأردنية، نعمل على تمكين الشباب تقنيًا وأكاديميًا عبر التدريب، والمبادرات، والمشاريع التقنية والتطوعية، لبناء جيل رقمي مبدع وصناعة أثر حقيقي في المجتمع.',
    join: 'انضم إلى AFAQ',
    explore: 'اكتشف أعمالنا',
    fastFacts: 'حقائق سريعة',
    membersJoinedLabel: 'عضوًا انضموا بالفعل',
    stats: [
      { label: 'عضوًا في الفريق', value: '140+' },
      { label: 'مبادرة', value: '80+' },
      { label: 'ساعة مجتمعية', value: '10K+' },
      { label: 'مستفيد', value: '24K+' },
    ],
  },
  about: {
    kicker: 'من نحن',
    heading: 'فريق آفاق التكنولوجيا',
    intro: [
      'فريق آفاق التكنولوجيا هو فريق شبابي مستقل في مجال تكنولوجيا المعلومات، يجمع طلبة وشبابًا ومهتمين بالتكنولوجيا من مختلف المحافظات الأردنية، ويعمل على تحويل الطاقات الشبابية إلى معرفة، ومهارات، ومشاريع، وابتكارات، وأثر حقيقي.',
      'نؤمن أن التكنولوجيا ليست مجرد أدوات، وأن الشباب ليسوا مجرد مستفيدين من المستقبل؛ بل هم صنّاعه، وقادته، ومطوّرو حلولِه.',
      'ومن هذا الإيمان، نبني بيئة شبابية تقنية تجمع بين التعلّم والتطوير والابتكار والعمل الميداني، من خلال البرامج التدريبية، والمبادرات الرقمية، والمشاريع التقنية، والفعاليات، والشراكات، والمساحات التي تمنح الشباب فرصة للتجربة والإنتاج وصناعة الحلول.',
      'نُعلّم، نُطوّر، ونبني مستقبلًا رقميًا بقدراتنا الشبابية.',
    ],
    motto: 'فكر.. عمل.. إنجاز.',
    journey: {
      kicker: 'مسيرتنا',
      timeline: [
        { year: '2023', title: 'الانطلاقة', detail: 'فكرة شبابية تؤمن بقدرات الشباب الأردني في التكنولوجيا وصناعة الأثر.' },
        { year: '2024', title: 'التوسع والشراكات', detail: 'توسيع نطاق العمل وبناء شراكات نوعية مع المؤسسات والجهات التقنية والشبابية.' },
        { year: '2025', title: 'التنفيذ والأثر', detail: 'تحويل الأفكار إلى برامج ومبادرات ومشاريع تقنية وشبابية ذات أثر ملموس.' },
        { year: '2026', title: 'التحول والإنجاز', detail: 'قيادة التحول الرقمي والذكاء الاصطناعي عبر مشاريع تقنية نوعية ومبتكرة.' },
      ],
    },
    joinUs: {
      kicker: 'الانتساب',
      title: 'كن جزءًا من آفاق',
      paragraphs: [
        'الانتساب إلى فريق آفاق التكنولوجيا هو انضمام إلى مجتمع شبابي يؤمن بأن لكل شخص قدرة يمكن تطويرها، وفكرة يمكن بناؤها، ودورًا يمكن أن يصنع أثرًا، نبحث عن الطلبة والشباب والمهتمين بالتكنولوجيا ممن يمتلكون الشغف والرغبة في التعلم والتطوير والمشاركة والعمل ضمن فريق.',
        'لا يشترط أن تكون خبيرًا حتى تبدأ معنا؛ يكفي أن تكون مستعدًا لأن تتعلم، وتعمل، وتجرب، وتشارك، وتضيف.',
        'في آفاق، ستجد مساحات متعددة للتعلّم والمشاركة في التدريب، والابتكار، والمشاريع، والإعلام، والفعاليات، والشراكات، والتطوير المهني والعمل الشبابي.',
        'إذا كنت ترى في نفسك طاقة تستحق أن تُستثمر… فآفاق مساحتك.',
      ],
      linkLabel: 'رابط الانتساب:',
    },
    vision: {
      kicker: 'رؤيتنا',
      title: 'إلى أين نتجه؟',
      paragraphs: [
        'أن نصبح منصة شبابية تقنية مؤثرة تساهم في بناء جيل أردني قادر على قيادة التحول التكنولوجي، وتطوير الحلول المبتكرة، وخلق الفرص، والمساهمة في بناء مستقبل رقمي أكثر تقدمًا.',
        'نطمح إلى توسيع حضور آفاق وبناء شبكة شبابية تقنية تمتد عبر الأردن، وربط الشباب بالخبرات والفرص والمؤسسات، ودعم المشاريع والأفكار الواعدة، والمساهمة في تطوير مجالات الذكاء الاصطناعي، والأمن السيبراني، وتحليل البيانات، والبرمجة، والابتكار والتحول الرقمي.',
      ],
    },
    contact: {
      kicker: 'تواصل معنا',
      description: 'للاستفسارات، والانتساب، والشراكات، والبرامج التدريبية، والمبادرات والمشاريع:',
      emailLabel: 'البريد الإلكتروني:',
      email: 'afaqteam12@gmail.com',
    },
  },
  committees: {
    title: 'لجان آفاق التكنولوجيا',
    description: 'منظومة متكاملة للعمل، يقودها التخصص وتجمعها رؤية واحدة لصناعة الأثر وبناء مستقبل تقني أكثر ابتكارًا.',
    list: [
      {
        title: 'لجنة التدريب والتطوير وبناء القدرات',
        description: 'تختص بتطوير قدرات أعضاء الفريق من خلال تصميم وتنفيذ البرامج التدريبية وورش العمل والمسارات التطويرية، واستقطاب الخبرات والمدربين، ومواكبة أحدث المستجدات في التكنولوجيا والذكاء الاصطناعي، إلى جانب تعزيز المهارات التقنية والمهنية والقيادية ودعم ثقافة التعلم والتطوير المستمر.',
        icon: 'GraduationCap',
      },
      {
        title: 'لجنة الفعاليات والأنشطة الميدانية',
        description: 'تتولى التخطيط والتنظيم والتنفيذ الميداني لمختلف فعاليات الفريق ومبادراته ومؤتمراته وملتقياته، وإدارة الجوانب التشغيلية واللوجستية والمتطوعين، بما يضمن تنفيذ الأنشطة بكفاءة وجودة، وقياس أثرها وتطويرها بصورة مستمرة.',
        icon: 'CalendarDays',
      },
      {
        title: 'لجنة الإعلام والتسويق الرقمي',
        description: 'تتولى إدارة الحضور الإعلامي والرقمي للفريق، وصناعة المحتوى وإنتاج المواد المرئية والمسموعة، وإدارة المنصات الرقمية والموقع الإلكتروني، وتوثيق الإنجازات والفعاليات، إلى جانب تنفيذ الحملات الإعلامية وتحليل الأداء الرقمي وتعزيز الهوية البصرية للفريق.',
        icon: 'Megaphone',
      },
      {
        title: 'لجنة الشراكات والعلاقات المؤسسية',
        description: 'تختص ببناء وإدارة الشراكات الاستراتيجية مع الجامعات والجهات الحكومية والمؤسسات والشركات ومنظمات المجتمع المدني، واستقطاب الداعمين والرعاة، وتمثيل الفريق في اللقاءات الرسمية، وتطوير فرص التعاون والمنح والمشاريع المشتركة بما يعزز حضور الفريق واستدامة أثره.',
        icon: 'Handshake',
      },
      {
        title: 'لجنة الابتكار والتحول الرقمي',
        description: 'تختص بقيادة مسار الابتكار والتحول الرقمي في الفريق من خلال تطوير المشاريع والحلول التقنية، وتوظيف الذكاء الاصطناعي وعلوم البيانات والأتمتة، والإشراف على المشاريع التقنية ومشروع «نُنتج»، واستشراف التقنيات الناشئة وتحويل الأفكار الإبداعية إلى مشاريع ومبادرات قابلة للتنفيذ.',
        icon: 'Cpu',
      },
      {
        title: 'لجنة شؤون الخريجين والتطوير المهني',
        description: 'تختص ببناء وإدارة مجتمع خريجي الفريق وتعزيز التواصل معهم، ودعم تطورهم المهني والأكاديمي من خلال توفير فرص التدريب والتوظيف والمنح والإرشاد المهني، والاستفادة من خبراتهم في تطوير أعضاء الفريق، وبناء شبكة مهنية مستدامة تربط الخريجين بالمؤسسات وسوق العمل.',
        icon: 'Briefcase',
      },
    ],
  },
  projects: {
    title: 'مشاريع مميزة تُحدث نتائج مجتمعية حقيقية.',
    description: 'تسرد محفظتنا كيف تحوّل التقنية والتصميم والتعاون التطوعي الأفكار إلى أثر ملموس.',
    items: [
      { title: 'بوابة المجتمع الذكية', subtitle: 'منصة تمكّن تنسيق المتطوعين وتتبع الأثر المحلي.', category: 'تصميم المنتج' },
      { title: 'تطبيق تعلم مدعوم بالذكاء الاصطناعي', subtitle: 'دروس تكيفية تُساعد الطلاب على احتضان STEM بثقة.', category: 'التعليم' },
      { title: 'لوحة استدامة', subtitle: 'رؤية بيانات للحملات المستدامة في الحرم الجامعي.', category: 'التحليلات' },
    ],
    action: 'عرض تفاصيل المشروع ←',
    viewAll: 'عرض جميع المشاريع',
  },
  events: {
    title: 'فعاليات قادمة تربط الطلاب وقادة التأثير الاجتماعي.',
    description: 'اكتشف برامج تشاركية، وقمم، وتجارب تطوعية مصممة للنمو والتعاون.',
    items: [
      { title: 'سباق المتطوعين العالمي', date: '15 أغسطس 2026', location: 'هجينة: عبر الإنترنت + الفروع المحلية', description: 'عطلة نهاية أسبوع لتطوير حلول تقنية سريعة للشركاء المجتمعيين.' },
      { title: 'قمة أثر الشباب', date: '28 سبتمبر 2026', location: 'القاهرة، مصر', description: 'قصص، ورش، وتعاونات للمغيّرين.' },
    ],
    action: 'سجل اهتمامك',
    viewAll: 'كل الفعاليات',
    viewDetails: 'عرض تفاصيل الفعالية ←',
    contactButton: 'تواصل مع فريق الفعاليات',
    stayConnectedTitle: 'ابقَ على اتصال',
    stayConnectedDescription: 'انضم إلى قائمتنا البريدية لدعوات الفعاليات وتحديثات التخطيط.',
  },
  news: {
    title: 'أحدث الأخبار والإعلانات.',
    description: 'تابع أحدث البرامج والإطلاقات وقصص المجتمع من فريق AFAQ التقني.',
    items: [
      { title: 'AFAQ تطلق برنامج إرشاد جديد مع جامعات رائدة', date: '10 يوليو 2026' },
      { title: 'الفريق التقني يكمل أول نموذج لوحة أثر اجتماعي', date: '23 يونيو 2026' },
    ],
    action: 'اقرأ المزيد ←',
    viewAll: 'عرض الكل',
    contactLink: 'تواصل معنا للتغطية ←',
    summary: 'يواصل AFAQ تقديم برامج تطوعية مدروسة، ويجمع الطلاب مع تجارب تقنية ذات معنى.',
  },
  gallery: {
    title: 'لحظات بصرية من مجتمع AFAQ.',
    description: 'لمحة منتقاة من ورش العمل وفعاليات الإطلاق وتعاون المتطوعين.',
    items: [
      {
        label: 'فريق آفاق التكنولوجيا برفقة لجنة الاقتصاد الرقمي والريادة النيابية',
        image: '/afaq-center.jpeg',
        caption:
          'التقى فريق آفاق التكنولوجيا لجنة الاقتصاد الرقمي والريادة النيابية في مجلس النواب، بمشاركة 15 شابًا وشابة، لبحث عدد من الملفات المرتبطة بالذكاء الاصطناعي والتحول الرقمي والأمن السيبراني وحماية البيانات وسوق العمل، وطرح الفريق رؤى ومقترحات لتعزيز دور الشباب المتخصص في صناعة التكنولوجيا، وربط الجامعات بالقطاع الخاص، وتطوير المهارات الرقمية والابتكار الشبابي.',
      },
      {
        label: 'فريق آفاق التكنولوجيا يلتقي رئيس الديوان الملكي الهاشمي',
        image: '/afaq-diwan.jpg',
        caption:
          'التقى فريق آفاق التكنولوجيا معالي رئيس الديوان الملكي الهاشمي العامر، في لقاء وطني استعرض خلاله الفريق مسيرته في تمكين الشباب في مجالات التكنولوجيا والتحول الرقمي، وأبرز مبادراته وإنجازاته التي وصلت إلى أكثر من 22 ألف مستفيد في مختلف محافظات المملكة.',
      },
      {
        label: 'فريق آفاق التكنولوجيا يلتقي سمو الأميرة بسمة بنت طلال',
        image: '/afaq-workshop.jpg',
        caption:
          'التقى فريق آفاق التكنولوجيا سمو الأميرة بسمة بنت طلال في محافظة المفرق، حيث استعرض رئيس الفريق عدنان قازان رؤية الفريق وأبرز مبادراته التقنية وخططه في تمكين الشباب في مجالات الذكاء الاصطناعي والأمن السيبراني والمهارات الرقمية.',
      },
      { label: 'منتدى ومؤتمر', image: '/afaq-forum.jpg' },
      { label: 'ندوة فريق آفاق', image: '/afaq-conference.jpg' },
      { label: 'هاكاثون المفرق للذكاء الاصطناعي 2025', image: '/afaq-hackathon.jpg' },
    ],
    action: 'عرض المعرض الكامل ←',
  },
  partners: {
    title: 'موثوق به من قبل قادة الصناعة والتعليم.',
    description: 'يسرّع شركاؤنا البرامج، ويقدمون الخبرة، ويساعدونا على توسيع الأثر عبر المجتمعات العالمية.',
    itemLabel: 'شريك',
    list: ['التحالف الجامعي العالمي', 'مختبرات الأثر', 'شبكة شباب التقنية', 'مجتمع 360'],
  },
  joinSection: {
    title: 'انضم إلى فريق AFAQ',
    description: 'اعثر على مكانك في شبكة تطوعية عالمية تبني التكنولوجيا والتغيير الاجتماعي.',
    tagline: 'كن جزءًا من المستقبل',
    openRolesLabel: 'الأدوار المتاحة',
    roles: [
      { title: 'المنتج وتجربة المستخدم', description: 'صمم حلولًا مركزة على المستخدم وساعد في تشكيل تجارب المشاريع.' },
      { title: 'الهندسة', description: 'ابنِ أنظمة قابلة للتوسع وتطبيقات وتدفقات بيانات لبرامج المجتمع.' },
      { title: 'المجتمع والتوعية', description: 'نمِّ المشاركة، نسّق الفروع، وأدر المبادرات التطوعية.' },
      { title: 'العمليات', description: 'ادعم الاستراتيجية والشراكات والهياكل التي تجعل الأثر ممكنًا.' },
    ],
    processTitle: 'عملية التقديم',
    processSteps: [
      'قدّم اهتمامك عبر النموذج الإلكتروني.',
      'احضر جلسة استكشافية مع فريق القيادة.',
      'انضم إلى لجنة وابدأ بالمساهمة فورًا.',
    ],
    action: 'ابدأ طلبك',
    freeToJoinNote: 'الانضمام مجاني · لا تحتاج إلى خبرة سابقة',
    learnMore: 'تعرف على عملية عضويتنا ←',
  },
  newsletter: {
    title: 'ابقَ مطلعًا',
    description: 'احصل على أحدث تحديثات AFAQ والفعاليات والفرص.',
    emailLabel: 'البريد الإلكتروني',
    inputPlaceholder: 'أدخل بريدك الإلكتروني',
    disclaimer: 'دون رسائل مزعجة، ويمكنك إلغاء الاشتراك في أي وقت.',
    button: 'اشترك',
  },
  contact: {
    title: 'تواصل',
    description: 'تواصل مع فريق AFAQ للشراكات أو الاستفسارات أو تفاصيل التطوع.',
    getInTouch: 'تواصل معنا',
    respondsWithinLabel: 'عادةً ما نرد خلال',
    respondsWithinValue: '24 ساعة',
    details: [
      { label: 'تواصل معنا', value: 'afaqteam12@gmail.com' },
    ],
    form: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      submit: 'إرسال الرسالة',
      namePlaceholder: 'اسمك الكامل',
      emailPlaceholder: 'بريدك الإلكتروني',
      messagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
      successTitle: 'تم إرسال الرسالة!',
      successMessage: 'سنعاود التواصل معك خلال 24 ساعة.',
    },
  },
  faq: {
    title: 'الأسئلة المتكررة',
    description: 'إجابات على الأسئلة الشائعة حول العضوية والبرامج والتعاون مع AFAQ.',
    items: [
      { question: 'ما هي رسالة فريق AFAQ التقني؟', answer: 'نمكن الطلاب المتطوعين من بناء حلول تقنية تُعزز المجتمعات وتخلق أثرًا اجتماعيًا مستدامًا.' },
      { question: 'من يمكنه الانضمام؟', answer: 'الطلاب والخريجون الجدد والمهنيون الشباب الشغوفون بالتقنية والتطوع وتطوير المجتمع.' },
      { question: 'كيف يمكن للشركاء التعاون؟', answer: 'يمكن للمنظمات التعاون عبر رعاية المشاريع واستضافة الفعاليات ومبادرات التعليم وتبادل الموارد.' },
    ],
  },
  privacyPolicy: {
    title: 'سياسة الخصوصية',
    description: 'يلتزم فريق AFAQ التقني بالتعامل بشفافية ومسؤولية مع المعلومات الشخصية.',
    sections: [
      { title: 'مقدمة', content: 'يجمع فريق AFAQ التقني الحد الأدنى من المعلومات لدعم العضوية والتواصل وبرامج المجتمع. نتعامل مع البيانات بمسؤولية وشفافية.' },
      { title: 'المعلومات التي نجمعها', content: 'نجمع تفاصيل الاتصال والتفضيلات ومعلومات المشاركة فقط عندما يختار المستخدمون الاشتراك في البرامج أو الاتصالات.' },
    ],
  },
  terms: {
    title: 'شروط الخدمة',
    description: 'اطلع على الشروط التي تحكم استخدام موارد ومحتوى فريق AFAQ التقني.',
    sections: [
      { title: 'القبول', content: 'باستخدام موقع فريق AFAQ التقني، فإنك توافق على هذه الشروط والالتزام بقيم مجتمعنا.' },
      { title: 'استخدام المحتوى', content: 'جميع المواد مقدمة للاستخدام المعلوماتي والتعليمي فقط. يُحظر إعادة الإنتاج غير المصرح به.' },
    ],
  },
  notFound: {
    title: 'الصفحة غير موجودة',
    description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. ارجع إلى الصفحة الرئيسية لاستكمال استكشاف AFAQ.',
    action: 'العودة إلى الرئيسية',
    goBack: 'رجوع',
  },
};
