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
    "common.loading": "Loading...",
    "common.total": "Total",
    "common.monthly": "Monthly",
    "common.yearly": "Yearly",
    "common.year": "Year",
    "common.name": "Name",
    "common.remove": "Remove",

    // Project Info Section
    "projectInfo.title": "Project Information",
    "projectInfo.subtitle": "Basic details about your business",
    "projectInfo.projectName": "Project Name",
    "projectInfo.projectNamePlaceholder": "e.g., Konnectik",
    "projectInfo.promoter": "Promoter Name",
    "projectInfo.promoterPlaceholder": "e.g., John Doe",
    "projectInfo.location": "Location",
    "projectInfo.locationPlaceholder": "e.g., Douala, Cameroon",
    "projectInfo.sector": "Industry Sector",
    "projectInfo.sectorPlaceholder": "e.g., Telecommunications",
    "projectInfo.startDate": "Start Date",

    // Equipment Section
    "equipment.title": "Equipment & Materials",
    "equipment.subtitle": "Assets with depreciation calculation",
    "equipment.add": "Add Equipment",
    "equipment.remove": "Remove Equipment",
    "equipment.name": "Name",
    "equipment.namePlaceholder": "Equipment name",
    "equipment.quantity": "Qty",
    "equipment.unitValue": "Unit Value",
    "equipment.lifespan": "Life (months)",
    "equipment.lifespanMobile": "Lifespan (months)",
    "equipment.monthlyDepreciation": "Monthly Dep.",
    "equipment.totalInvestment": "Total Investment",
    "equipment.monthlyDepreciationTotal": "Monthly Depreciation",
    "equipment.totalValue": "Total Value",

    // Products Section
    "products.title": "Products & Services",
    "products.subtitle": "Revenue-generating offerings",
    "products.add": "Add Product",
    "products.name": "Name",
    "products.namePlaceholder": "e.g., K-DISCOVERY",
    "products.price": "Price",
    "products.monthlyQty": "Monthly Qty",
    "products.monthlyRevenue": "Monthly Revenue",
    "products.totalMonthlyRevenue": "Total Monthly Revenue",

    // Personnel Section
    "personnel.title": "Personnel",
    "personnel.subtitle": "Team members and salary structure",
    "personnel.add": "Add Personnel",
    "personnel.role": "Role",
    "personnel.rolePlaceholder": "e.g., Product Lead",
    "personnel.count": "Count",
    "personnel.monthlySalary": "Monthly Salary",
    "personnel.totalEmployees": "Total Employees",
    "personnel.monthlyCost": "Monthly Cost",

    // Activities Section
    "activities.title": "Operational Activities",
    "activities.subtitle": "Core business activities and their costs",
    "activities.add": "Add Activity",
    "activities.activity": "Activity",
    "activities.activityPlaceholder": "e.g., Network Deployment",
    "activities.monthlyCount": "Monthly Count",
    "activities.unitCost": "Unit Cost",
    "activities.monthlyCost": "Monthly Cost",
    "activities.totalMonthlyCost": "Total Monthly Cost",

    // Customers Section
    "customers.title": "Target Customers",
    "customers.subtitle": "Customer segments and monthly targets",
    "customers.add": "Add Customer Segment",
    "customers.segmentName": "Segment Name",
    "customers.segmentNamePlaceholder": "e.g., Students",
    "customers.monthlyTarget": "Monthly Target",
    "customers.totalMonthlyTarget": "Total Monthly Target",

    // Other Charges Section
    "otherCharges.title": "Other Costs",
    "otherCharges.subtitle": "Additional charges and raw materials",
    "otherCharges.charges": "Other Charges",
    "otherCharges.addCharge": "Add Charge",
    "otherCharges.chargePlaceholder": "Charge name",
    "otherCharges.rawMaterials": "Raw Materials",
    "otherCharges.addMaterial": "Add Material",
    "otherCharges.materialPlaceholder": "Material name",

    // Financial Summary
    "financial.title": "Financial Summary",
    "financial.subtitle": "Current profitability analysis",
    "financial.monthlyRevenue": "Monthly Revenue",
    "financial.monthlyExpenses": "Monthly Expenses",
    "financial.monthlyCashFlow": "Monthly Cash Flow",
    "financial.breakEvenPoint": "Break-even Point",
    "financial.totalInvestment": "Total Investment Required",
    "financial.monthlyDepreciation": "Monthly Depreciation",
    "financial.notProfitable": "Not profitable",
    "financial.months": "mo",
    "financial.years": "years",

    // Projections Chart
    "projections.title": "3-Year Financial Projections",
    "projections.subtitle": "Revenue & profit forecast with growth modeling",
    "projections.growthRate": "Annual Growth Rate",
    "projections.revenueVsExpenses": "Revenue vs Expenses",
    "projections.profitTrend": "Profit Trend",
    "projections.revenue": "Revenue",
    "projections.expenses": "Expenses",
    "projections.profit": "Profit",
    "projections.roi": "ROI",

    // Tax Calculator
    "tax.title": "Tax Analysis",
    "tax.selectRegion": "Select Region",
    "tax.choosePlaceholder": "Choose your region",
    "tax.customRate": "Custom Tax Rate (%)",
    "tax.corporateTax": "Corporate Tax",
    "tax.vat": "VAT",
    "tax.preTaxProfit": "Pre-Tax Profit",
    "tax.afterTaxProfit": "After-Tax Profit",
    "tax.threeYearTotal": "3-Year Total",
    "tax.disclaimer": "* Tax calculations are estimates for planning purposes only. Actual taxes may vary based on local regulations, deductions, and incentives. Always consult a qualified tax professional.",
    "tax.tooltipPreTax": "Revenue minus all expenses",

    // Chat Panel
    "chat.title": "AI Business Advisor",
    "chat.subtitle": "Ask me anything",
    "chat.welcome": "Welcome!",
    "chat.welcomeMessage": "I'm here to help you build your business canvas and understand your financials.",
    "chat.tryAsking": "Try asking:",
    "chat.placeholder": "Ask about your business...",
    "chat.question1": "How do I calculate my break-even point?",
    "chat.question2": "What should I include in equipment costs?",
    "chat.question3": "How do I estimate my monthly revenue?",
    "chat.question4": "Explain the 3-year projection chart",

    // Project Selector
    "project.selectProject": "Select Project",
    "project.newProject": "New Project",
    "project.createTitle": "Create New Project",
    "project.createDescription": "Start a new business profitability canvas project.",
    "project.projectName": "Project Name",
    "project.projectNamePlaceholder": "My New Business",
    "project.createButton": "Create Project",
    "project.deleteTitle": "Delete Project",
    "project.deleteDescription": "Are you sure you want to delete \"{name}\"? This action cannot be undone.",
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
    "common.loading": "Chargement...",
    "common.total": "Total",
    "common.monthly": "Mensuel",
    "common.yearly": "Annuel",
    "common.year": "Année",
    "common.name": "Nom",
    "common.remove": "Supprimer",

    // Project Info Section
    "projectInfo.title": "Informations du Projet",
    "projectInfo.subtitle": "Détails de base sur votre entreprise",
    "projectInfo.projectName": "Nom du Projet",
    "projectInfo.projectNamePlaceholder": "ex: Konnectik",
    "projectInfo.promoter": "Nom du Promoteur",
    "projectInfo.promoterPlaceholder": "ex: Jean Dupont",
    "projectInfo.location": "Localisation",
    "projectInfo.locationPlaceholder": "ex: Douala, Cameroun",
    "projectInfo.sector": "Secteur d'Activité",
    "projectInfo.sectorPlaceholder": "ex: Télécommunications",
    "projectInfo.startDate": "Date de Début",

    // Equipment Section
    "equipment.title": "Équipements & Matériels",
    "equipment.subtitle": "Actifs avec calcul d'amortissement",
    "equipment.add": "Ajouter un Équipement",
    "equipment.remove": "Supprimer l'Équipement",
    "equipment.name": "Nom",
    "equipment.namePlaceholder": "Nom de l'équipement",
    "equipment.quantity": "Qté",
    "equipment.unitValue": "Valeur Unitaire",
    "equipment.lifespan": "Durée (mois)",
    "equipment.lifespanMobile": "Durée de vie (mois)",
    "equipment.monthlyDepreciation": "Amort. Mensuel",
    "equipment.totalInvestment": "Investissement Total",
    "equipment.monthlyDepreciationTotal": "Amortissement Mensuel",
    "equipment.totalValue": "Valeur Totale",

    // Products Section
    "products.title": "Produits & Services",
    "products.subtitle": "Offres génératrices de revenus",
    "products.add": "Ajouter un Produit",
    "products.name": "Nom",
    "products.namePlaceholder": "ex: K-DISCOVERY",
    "products.price": "Prix",
    "products.monthlyQty": "Qté Mensuelle",
    "products.monthlyRevenue": "Revenu Mensuel",
    "products.totalMonthlyRevenue": "Revenu Mensuel Total",

    // Personnel Section
    "personnel.title": "Personnel",
    "personnel.subtitle": "Membres de l'équipe et structure salariale",
    "personnel.add": "Ajouter du Personnel",
    "personnel.role": "Rôle",
    "personnel.rolePlaceholder": "ex: Chef de Produit",
    "personnel.count": "Nombre",
    "personnel.monthlySalary": "Salaire Mensuel",
    "personnel.totalEmployees": "Total Employés",
    "personnel.monthlyCost": "Coût Mensuel",

    // Activities Section
    "activities.title": "Activités Opérationnelles",
    "activities.subtitle": "Activités principales et leurs coûts",
    "activities.add": "Ajouter une Activité",
    "activities.activity": "Activité",
    "activities.activityPlaceholder": "ex: Déploiement Réseau",
    "activities.monthlyCount": "Nombre Mensuel",
    "activities.unitCost": "Coût Unitaire",
    "activities.monthlyCost": "Coût Mensuel",
    "activities.totalMonthlyCost": "Coût Mensuel Total",

    // Customers Section
    "customers.title": "Clients Cibles",
    "customers.subtitle": "Segments de clientèle et objectifs mensuels",
    "customers.add": "Ajouter un Segment Client",
    "customers.segmentName": "Nom du Segment",
    "customers.segmentNamePlaceholder": "ex: Étudiants",
    "customers.monthlyTarget": "Objectif Mensuel",
    "customers.totalMonthlyTarget": "Objectif Mensuel Total",

    // Other Charges Section
    "otherCharges.title": "Autres Coûts",
    "otherCharges.subtitle": "Charges additionnelles et matières premières",
    "otherCharges.charges": "Autres Charges",
    "otherCharges.addCharge": "Ajouter une Charge",
    "otherCharges.chargePlaceholder": "Nom de la charge",
    "otherCharges.rawMaterials": "Matières Premières",
    "otherCharges.addMaterial": "Ajouter un Matériau",
    "otherCharges.materialPlaceholder": "Nom du matériau",

    // Financial Summary
    "financial.title": "Résumé Financier",
    "financial.subtitle": "Analyse de rentabilité actuelle",
    "financial.monthlyRevenue": "Revenu Mensuel",
    "financial.monthlyExpenses": "Dépenses Mensuelles",
    "financial.monthlyCashFlow": "Flux de Trésorerie Mensuel",
    "financial.breakEvenPoint": "Seuil de Rentabilité",
    "financial.totalInvestment": "Investissement Total Requis",
    "financial.monthlyDepreciation": "Amortissement Mensuel",
    "financial.notProfitable": "Non rentable",
    "financial.months": "mois",
    "financial.years": "ans",

    // Projections Chart
    "projections.title": "Projections Financières sur 3 Ans",
    "projections.subtitle": "Prévisions de revenus et bénéfices avec modélisation de croissance",
    "projections.growthRate": "Taux de Croissance Annuel",
    "projections.revenueVsExpenses": "Revenus vs Dépenses",
    "projections.profitTrend": "Tendance des Bénéfices",
    "projections.revenue": "Revenus",
    "projections.expenses": "Dépenses",
    "projections.profit": "Bénéfice",
    "projections.roi": "ROI",

    // Tax Calculator
    "tax.title": "Analyse Fiscale",
    "tax.selectRegion": "Sélectionner la Région",
    "tax.choosePlaceholder": "Choisissez votre région",
    "tax.customRate": "Taux d'Imposition Personnalisé (%)",
    "tax.corporateTax": "Impôt sur les Sociétés",
    "tax.vat": "TVA",
    "tax.preTaxProfit": "Bénéfice Avant Impôt",
    "tax.afterTaxProfit": "Bénéfice Après Impôt",
    "tax.threeYearTotal": "Total sur 3 Ans",
    "tax.disclaimer": "* Les calculs fiscaux sont des estimations à des fins de planification uniquement. Les impôts réels peuvent varier selon les réglementations locales, déductions et incitations. Consultez toujours un professionnel fiscal qualifié.",
    "tax.tooltipPreTax": "Revenus moins toutes les dépenses",

    // Chat Panel
    "chat.title": "Conseiller IA",
    "chat.subtitle": "Posez-moi vos questions",
    "chat.welcome": "Bienvenue !",
    "chat.welcomeMessage": "Je suis là pour vous aider à construire votre canevas d'affaires et comprendre vos finances.",
    "chat.tryAsking": "Essayez de demander :",
    "chat.placeholder": "Posez une question sur votre entreprise...",
    "chat.question1": "Comment calculer mon seuil de rentabilité ?",
    "chat.question2": "Que dois-je inclure dans les coûts d'équipement ?",
    "chat.question3": "Comment estimer mon revenu mensuel ?",
    "chat.question4": "Expliquez le graphique de projection sur 3 ans",

    // Project Selector
    "project.selectProject": "Sélectionner un Projet",
    "project.newProject": "Nouveau Projet",
    "project.createTitle": "Créer un Nouveau Projet",
    "project.createDescription": "Commencez un nouveau projet de canevas de rentabilité.",
    "project.projectName": "Nom du Projet",
    "project.projectNamePlaceholder": "Ma Nouvelle Entreprise",
    "project.createButton": "Créer le Projet",
    "project.deleteTitle": "Supprimer le Projet",
    "project.deleteDescription": "Êtes-vous sûr de vouloir supprimer \"{name}\" ? Cette action est irréversible.",
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
