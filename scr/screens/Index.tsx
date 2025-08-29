import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.png";
import mascotCharacter from "@/assets/mascot-character.png";
import { Brain, Target, BarChart3, Users, Star, Play, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "Jogos Científicos",
      description: "Serious games baseados em neurociência para desenvolvimento cognitivo"
    },
    {
      icon: BarChart3,
      title: "Análise Inteligente",
      description: "Relatórios detalhados sobre progresso e áreas de melhoria"
    },
    {
      icon: Target,
      title: "Foco Personalizado",
      description: "Atividades adaptadas para cada perfil e necessidade específica"
    },
    {
      icon: Users,
      title: "Suporte Familiar",
      description: "Ferramentas para pais e terapeutas acompanharem o desenvolvimento"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-primary p-4 shadow-large animate-bounce-in">
                <img 
                  src={mascotCharacter} 
                  alt="MindPlay - Assistente amigável para crianças com TDAH"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                MindPlay
              </span>
              <br />
              Jogos Terapêuticos
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Plataforma inovadora de serious games e análise de dados para apoiar o desenvolvimento 
              cognitivo de crianças com TDAH de forma lúdica e científica
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/games">
                <Button variant="playful" size="lg" className="text-lg px-8 py-4 h-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Começar Jogos
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  Fazer Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-warning fill-current" />
                <span className="text-sm">Baseado em Neurociência</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm">Resultados Comprovados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma abordagem completa que combina diversão, aprendizado e análise científica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="text-center shadow-soft border-0 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-primary rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-medium">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto shadow-large border-0 bg-gradient-primary text-primary-foreground animate-fade-in">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para Começar?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de famílias que já estão transformando 
                o desenvolvimento cognitivo através dos nossos jogos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button variant="outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-4 h-auto">
                    Criar Conta Grátis
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-4 h-auto">
                    Ver Demonstração
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
