import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth page
    "auth.title.signup": "Create your account",
    "auth.title.signin": "Welcome back",
    "auth.subtitle.signup": "Start your business planning journey with Musongi",
    "auth.subtitle.signin": "Sign in to continue to your dashboard",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.button.signup": "Create account",
    "auth.button.signin": "Sign in",
    "auth.switch.signin": "Already have an account? Sign in",
    "auth.switch.signup": "Don't have an account? Sign up",
    "auth.footer": "Your data is securely stored and encrypted",
    "auth.validation.email": "Please enter a valid email address",
    "auth.validation.password": "Password must be at least 6 characters",
    
    // Hero section
    "hero.title": "Empowering African Entrepreneurs",
    "hero.subtitle": "Musongi provides expert financial consultation services to help you build profitable, sustainable businesses across Africa.",
    "hero.feature1": "Financial Projections & Analysis",
    "hero.feature2": "Tax Planning for CEMAC & UEMOA",
    "hero.feature3": "AI-Powered Business Advisor",
    "hero.quote": "Your partner in African business success",
    
    // Main page
    "main.title": "Business Profitability Canvas",
    "main.subtitle": "Determine your business viability with comprehensive financial analysis and 3-year projections",
    "main.loading": "Loading your canvas...",
    "main.footer.methodology": "Business Profitability Canvas® — Inspired by ECOLIA Labs methodology",
    "main.footer.builtby": "Built by",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.reset": "Reset",
    "common.export": "Export PDF",
    "common.signout": "Sign out",
    "common.language": "Language",
  },
  fr: {
    // Auth page
    "auth.title.signup": "Créez votre compte",
    "auth.title.signin": "Bienvenue",
    "auth.subtitle.signup": "Commencez votre parcours de planification d'entreprise avec Musongi",
    "auth.subtitle.signin": "Connectez-vous pour accéder à votre tableau de bord",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.button.signup": "Créer un compte",
    "auth.button.signin": "Se connecter",
    "auth.switch.signin": "Vous avez déjà un compte ? Connectez-vous",
    "auth.switch.signup": "Vous n'avez pas de compte ? Inscrivez-vous",
    "auth.footer": "Vos données sont stockées et cryptées en toute sécurité",
    "auth.validation.email": "Veuillez entrer une adresse email valide",
    "auth.validation.password": "Le mot de passe doit contenir au moins 6 caractères",
    
    // Hero section
    "hero.title": "Accompagner les Entrepreneurs Africains",
    "hero.subtitle": "Musongi fournit des services de consultation financière experts pour vous aider à construire des entreprises rentables et durables à travers l'Afrique.",
    "hero.feature1": "Projections et Analyses Financières",
    "hero.feature2": "Planification Fiscale pour CEMAC & UEMOA",
    "hero.feature3": "Conseiller d'Affaires Alimenté par l'IA",
    "hero.quote": "Votre partenaire pour le succès des affaires en Afrique",
    
    // Main page
    "main.title": "Canevas de Rentabilité d'Entreprise",
    "main.subtitle": "Déterminez la viabilité de votre entreprise avec une analyse financière complète et des projections sur 3 ans",
    "main.loading": "Chargement de votre canevas...",
    "main.footer.methodology": "Business Profitability Canvas® — Inspiré par la méthodologie ECOLIA Labs",
    "main.footer.builtby": "Créé par",
    
    // Common
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.add": "Ajouter",
    "common.edit": "Modifier",
    "common.reset": "Réinitialiser",
    "common.export": "Exporter PDF",
    "common.signout": "Se déconnecter",
    "common.language": "Langue",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("musongi-language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("musongi-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
