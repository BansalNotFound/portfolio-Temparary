import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Hero
  'HERO_TITLE': { en: 'SOFTWARE', ja: 'ソフトウェア' },
  'HERO_SUBTITLE': { en: 'ENGINEER', ja: 'エンジニア' },
  
  // Dividers
  'EPISODE_01': { en: 'EPISODE 01', ja: '第一話' },
  'ORIGIN_STORY': { en: 'ORIGIN STORY', ja: 'オリジンストーリー' },
  'EPISODE_02': { en: 'EPISODE 02', ja: '第二話' },
  'POWER_LEVELS': { en: 'POWER LEVELS', ja: '戦闘力' },
  'EPISODE_03': { en: 'EPISODE 03', ja: '第三話' },
  'ARSENAL': { en: 'ARSENAL', ja: '武器庫' },
  'BATTLE_LOGS': { en: 'BATTLE LOGS', ja: '戦闘記録' },
  'EPISODE_04': { en: 'EPISODE 04', ja: '第四話' },
  'EXP_POINTS': { en: 'EXP POINTS', ja: '経験値' },
  'FINAL_STAGE': { en: 'FINAL STAGE', ja: '最終ステージ' },
  'CONTINUE': { en: 'CONTINUE?', ja: 'コンティニュー？' },
  
  // About
  'CULTIVATING': { en: 'Cultivating an', ja: '培う' },
  'OBSESSION': { en: 'obsession', ja: '執着' },
  'WITH': { en: 'with', ja: 'と' },
  'IMPACTFUL_SYSTEMS': { en: 'impactful systems.', ja: '影響力のあるシステム。' },
  
  // Skills
  'SKILL_SET': { en: 'Skill Set', ja: 'スキルセット' },
  'TOOLKIT_ARSENAL': { en: 'TOOLKIT × ARSENAL', ja: 'ツールキット × 武器庫' },
  'FOR_DIGITAL_CREATION': { en: 'FOR DIGITAL CREATION', ja: 'デジタルクリエイションのための' },
  'SKILLS_DESC': { en: 'I build high-performance web experiences, complex logic systems, and striking visual stories.', ja: '高性能なウェブ体験、複雑なロジックシステム、印象的なビジュアルストーリーを構築します。' },
  
  // Projects
  'SELECTED_WORKS': { en: 'Selected Works', ja: '厳選された作品' },
  'CLASSIFIED_INTEL': { en: 'Classified Intel', ja: '機密情報' },
  'LAUNCH_PROTOCOL': { en: 'Launch Protocol', ja: 'プロトコル開始' },
  'CLICK_TO_REVEAL': { en: 'Click to Reveal Intel', ja: 'クリックして情報を表示' },
  'CLICK_TO_CLOSE': { en: '[ Click anywhere to close ]', ja: '[クリックで閉じる]' },
  'MISSION': { en: 'MISSION', ja: 'ミッション' },
  
  // Experience
  'JOURNEY': { en: 'Journey', ja: '道のり' },
  'EXPERIENCE': { en: 'Experience', ja: '経験' },
  'ACADEMIC_BACKGROUND': { en: 'Academic Background', ja: '学歴' },
  'EDUCATION': { en: 'Education', ja: '教育' },
  
  // Contact
  'CONTACT': { en: 'CONTACT', ja: '連絡先' },
  'LETS_JOIN': { en: "Let's Join", ja: '力を' },
  'FORCES': { en: 'Forces!', ja: '合わせよう！' },
  'READY_TO_BUILD': { en: "Ready to build the next big thing? Send me a transmission and let's get started.", ja: '次の大きなものを作る準備はできましたか？通信を送って始めましょう。' },
  'ALIAS': { en: 'Alias', ja: 'エイリアス' },
  'COMM_LINK': { en: 'Comm Link', ja: '通信リンク' },
  'INTEL': { en: 'Intel', ja: '情報' },
  'TRANSMIT': { en: 'Transmit', ja: '送信' },
  
  // Footer
  'LETS_TALK': { en: "LET'S TALK", ja: "話そう！" },
  'FOOTER_DESC': { en: "Open for collaboration, innovative hackathons, and research projects. Let's create the next generation of web experiences.", ja: "コラボレーション、革新的なハッカソン、研究プロジェクトをお待ちしています。次世代のウェブ体験を共に創りましょう。" },
  'GET_IN_TOUCH': { en: "Get In Touch", ja: "連絡する" },
  'MADE_WITH_PASSION': { en: "MADE WITH PASSION", ja: "情熱を込めて製作" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ja' : 'en'));
  };

  const t = (key: string) => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
