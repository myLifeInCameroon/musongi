import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, TrendingUp, Shield, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { z } from "zod";
import heroImage from "@/assets/hero-bg.jpg";
import musongiLogo from "@/assets/musongi-logo.svg";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { user, loading, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const authSchema = z.object({
    email: z.string().email(t("auth.validation.email")),
    password: z.string().min(6, t("auth.validation.password")),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validate = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    
    if (isSignUp) {
      const result = await signUp(email, password);
      if (result) {
        setSignUpSuccess(true);
        // Show success message for a brief moment
        setTimeout(() => {
          setSignUpSuccess(false);
          setEmail("");
          setPassword("");
        }, 3000);
      }
    } else {
      await signIn(email, password);
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero Section - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img 
          src={heroImage} 
          alt="Business partnership" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={musongiLogo} alt="Musongi" className="h-12 w-auto brightness-0 invert" />
          </div>

          {/* Main Hero Text */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg xl:text-xl text-primary-foreground/90 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Features */}
            <div className="grid gap-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{t("hero.feature1")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{t("hero.feature2")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{t("hero.feature3")}</span>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="space-y-2">
            <p className="text-sm text-primary-foreground/70 italic">
              "{t("hero.quote")}"
            </p>
          </div>
        </div>
      </div>

      {/* Auth Form - Right Side */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center p-6 sm:p-12 bg-background relative">
        {/* Language Selector - Top Right */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>

        {/* Sign-up Success Toast */}
        {signUpSuccess && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
              <Mail className="h-5 w-5 text-green-500" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-green-600">
                  Account created! Check your email.
                </p>
                <p className="text-xs text-green-600/80">
                  Verification link sent to {email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8 animate-fade-in">
          <img src={musongiLogo} alt="Musongi" className="h-12 w-auto" />
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md glass-card animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? t("auth.title.signup") : t("auth.title.signin")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? t("auth.subtitle.signup") : t("auth.subtitle.signin")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-input focus:border-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background border-input focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={submitting || signUpSuccess}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : signUpSuccess ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    "Verifying email..."
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {isSignUp ? t("auth.button.signup") : t("auth.button.signin")}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setSignUpSuccess(false);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? t("auth.switch.signin") : t("auth.switch.signup")}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-sm text-muted-foreground animate-fade-in text-center">
          {t("auth.footer")}
        </p>
      </div>
    </div>
  );
};

export default Auth;
