/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("Gemini API key not configured or using placeholder. Running in fallback/mock mode.");
}

// Highly authentic Burkina Faso local news database
const BURKINA_FALLBACK_NEWS = [
  {
    id: "bf-news-1",
    title: "Vigilance Routière : Amélioration sécuritaire constatée sur l'axe National Ouagadougou - Bobo-Dioulasso",
    summary: "Les autorités régionales confirment le déploiement de postes de patrouille fixes et une fluidité accrue pour le transport de marchandises.",
    body: "Les usagers de la Route Nationale 1 (RN1) reliant les deux principales métropoles du Burkina Faso se réjouissent d'une baisse notable des incidents routiers. Selon l'Office National de la Sécurité Routière (ONASER), le renforcement récent des contrôles mixtes et l'installation de stations de veille mobiles ont doublé l'indice de confiance des transporteurs. Les conducteurs sont invités à maintenir une vitesse recommandée de 90 km/h pour les cars et camions de charge, particulièrement aux abords de Boromo et Sabou. Les patrouilles de gendarmerie maintiennent des alertes SMS en temps réel avec les gares de Ouagadougou et de Bobo-Sya.",
    category: "securite",
    date: "Aujourd'hui, 08:30",
    region: "Centre-Ouest / Boucle du Mouhoun",
    isAlert: true,
    alertLevel: "info",
    source: "ONASER / Sidwaya",
    readTime: "3 min"
  },
  {
    id: "bf-news-2",
    title: "Campagne Cotonnière : Le Burkina Faso prévoit une récolte record de 480 000 tonnes pour la saison",
    summary: "L'Association Interprofessionnelle du Coton du Burkina (AICB) annonce des prévisions optimistes grâce aux nouvelles subventions d'intrants.",
    body: "L'or blanc burkinabè est sur une courbe ascendante spectaculaire. Lors de la réunion d'évaluation de l'AICB tenue à Bobo-Dioulasso, les experts cotonniers ont confirmé que la reprise des financements directs de l'État pour les engrais organiques et la sélection rigoureuse des semences ont dopé le rendement à l'hectare dans les zones cotonnières clés de l'Est, de la Boucle du Mouhoun et des Cascades. Les producteurs bénéficieront en outre d'une revalorisation du prix d'achat au kilogramme, motivant plus de 150 000 familles d'agriculteurs. L'usine d'égrenage de Koudougou se prépare déjà à tourner à plein régime dès la fin octobre.",
    category: "economie",
    date: "Aujourd'hui, 11:15",
    region: "Hauts-Bassins & Cascades",
    isAlert: false,
    source: "SOFITEX / AICB",
    readTime: "4 min"
  },
  {
    id: "bf-news-3",
    title: "Infrastructures Énergétiques : L'extension solaire de Zagtouli de plus de 50 MW raccordée officiellement au réseau",
    summary: "La Société Nationale d'Électricité du Burkina (SONABEL) annonce la mise en service industrielle de la seconde phase du projet de Zagtouli.",
    body: "La transition écologique du Burkina Faso franchit un nouveau palier historique. Avec le couplage réussi des nouveaux onduleurs de la centrale solaire de Zagtouli, réputée comme l'un des plus grands parcs photovoltaïques du Sahel, la SONABEL dispose maintenant d'un apport propre de 50 mégawatts-crête supplémentaires. Cette mise en œuvre s'accompagne d'un système de stockage par batteries lithium de dernière génération destiné à stabiliser le réseau durant les heures d'intense chaleur urbaine à Ouagadougou. Ce raccordement réduit la dépendance énergétique extérieure du pays de près de 15% pour cette année.",
    category: "economie",
    date: "Aujourd'hui, 14:45",
    region: "Centre (Ouagadougou)",
    isAlert: false,
    source: "SONABEL Presse",
    readTime: "3 min"
  },
  {
    id: "bf-news-4",
    title: "Climat & Météo : Alerte de fortes pluies accompagnée d'orages violents sur les régions du Sud-Ouest et des Cascades",
    summary: "L'Agence Nationale de la Météorologie (ANAM-BF) appelle à la prudence face aux risques d'inondations locales de bas-fonds.",
    body: "L'ANAM Burkina Faso vient d'émettre un bulletin de vigilance orange concernant les provinces de la Comoé, du Léraba, du Noumbiel et du Poni. Des cellules orageuses très actives stationnent actuellement sur le Nord de la Côte d'Ivoire voisine et progressent rapidement vers Banfora et Gaoua. Des rafales de vent pouvant dépasser les 70 km/h sont attendues d'ici la soirée. Les agriculteurs exploitant les bas-fonds rizicoles sont invités à sécuriser les bétails et à restreindre les franchissements de ponts submersibles. Les mairies locales ont activé des cellules de secours temporaires.",
    category: "securite",
    date: "Aujourd'hui, 16:10",
    region: "Sud-Ouest & Cascades",
    isAlert: true,
    alertLevel: "warning",
    source: "ANAM-BF Bulletin",
    readTime: "2 min"
  },
  {
    id: "bf-news-5",
    title: "Culture & Cinéma : Le FESPACO lance sa caravane panafricaine de projection itinérante à Kaya et Tenkodogo",
    summary: "Le secrétariat permanent du festival propose des projections cinématographiques gratuites en plein air pour mobiliser la jeunesse locale.",
    body: "Le rideau culturel s'ouvre au cœur des régions burkinabè. Afin de démocratiser le cinéma africain, la délégation générale du FESPACO (Festival Panafricain du Cinéma et de la Télévision de Ouagadougou) a initié la caravane nationale 'Ciné-Faso'. Équipés d'écrans gonflables géants et de générateurs d'électricité solaires mobiles, les organisateurs projettent les longs-métrages lauréats des éditions précédentes ainsi que des courts-métrages éducatifs de réalisateurs burkinabè inspirants. Les projections à Kaya ont déjà réuni plus d'un millier de jeunes spectateurs par soir, célébrant le brassage culturel traditionnel.",
    category: "culture",
    date: "Hier, 18:20",
    region: "Centre-Nord / Centre-Est",
    isAlert: false,
    source: "FESPACO Secrétariat",
    readTime: "4 min"
  },
  {
    id: "bf-news-6",
    title: "Sport / Étalons : Les préparatifs de l'équipe nationale entrent dans une phase intensive pour les qualifications au Stade du 4 Août",
    summary: "Le sélectionneur national peaufine sa tactique à Ouagadougou et mise sur la cohésion des expatriés et des talents locaux.",
    body: "La ferveur sportive s'empare des supporters du Faso. L'équipe nationale de football masculin, les Étalons, poursuit ses séances d'entraînement quotidiennes au Stade Municipal en vue de l'homologation sportive finale du Stade du 4 Août. Le staff technique a mis en place un plan de jeu axé sur une contre-attaque fulgurante, tirant parti de la rapidité extrême des ailiers. Les joueurs locaux convoqués font montre d'un excellent niveau physique, rivalisant positivement avec les cadres évoluant dans les championnats professionnels européens. Les tickets pour la rencontre amicale test seront distribués dès lundi prochain.",
    category: "sport",
    date: "Hier, 15:40",
    region: "Centre (Ouagadougou)",
    isAlert: false,
    source: "FBF / Étalons Actu",
    readTime: "3 min"
  },
  {
    id: "bf-news-7",
    title: "Aménagement Urbain : Koudougou se dote d'un nouveau centre d'apprentissage pour les jeunes artisans du textile",
    summary: "La cité du cavalier rouge célèbre l'inauguration d'un complexe dédié au tissage artisanal traditionnel du Faso Dan Fani.",
    body: "Koudougou renforce sa stature de capitale du textile authentique du Burkina Faso. C'est en présence des autorités consulaires que les portes du tout nouveau Centre d'Excellence du Faso Dan Fani ont été ouvertes au quartier Sectoriel 3. Financé par des coopératives locales et le ministère du Commerce, ce centre offrira chaque année des formations diplômantes gratuites à 200 jeunes femmes et hommes désireux de maîtriser les techniques de tissage, de teinture naturelle et de design textile contemporain. Des marchés exports sont déjà planifiés vers l'Europe et la sous-région ouest-africaine.",
    category: "regions",
    date: "Il y a 2 jours",
    region: "Centre-Ouest (Koudougou)",
    isAlert: false,
    source: "Mairie de Koudougou",
    readTime: "3 min"
  }
];

// Endpoint to obtain simulated real-time news articles from Burkina Faso via Gemini
app.get("/api/news", async (req, res) => {
  const category = req.query.category as string;
  
  if (!aiClient) {
    // Return filtered local authentic mock database
    console.log("Serving mock news due to absent Gemini client.");
    const filtered = category && category !== "all" 
      ? BURKINA_FALLBACK_NEWS.filter(item => item.category === category)
      : BURKINA_FALLBACK_NEWS;
    return res.json({ source: "local_cache", articles: filtered });
  }

  // Fallback models to iterate through if there is 503 high demand or temporary failure
  const fallbackModels = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let finalResponse = null;
  let lastError: any = null;

  const timePrompt = `Nous sommes aujourd'hui le ${new Date().toISOString().split("T")[0]}. `;
  const categoryPrompt = category && category !== "all" 
    ? `Génère des articles uniquement appartenant à la catégorie '${category}'.`
    : "Génère un mix harmonieux d'articles de diverses catégories (politique, economie, securite, regions, sport, culture).";

  const prompt = `Génère une liste de 6 articles d'actualité récents et extrêmement réalistes sur le Burkina Faso en français. 
  ${timePrompt}
  ${categoryPrompt}
  Consignes strictes :
  - Les articles doivent sembler authentiques, d'actualité immédiate du Burkina Faso (mentionner des régions/villes réelles comme Ouagadougou, Bobo-Dioulasso, Koudougou, Gaoua, Kaya, Banfora, Dori, Fada N'gourma, Tenkodogo, Ouahigouya).
  - Inclure au moins une alerte météorologique ou sécuritaire crédible (category: 'securite', isAlert: true, alertLevel: 'info', 'warning' ou 'critical' avec des détails géolocalisés pour donner un fort sentiment de protection en temps réel).
  - Les sources des articles doivent correspondre à de vrais organismes régionaux crédibles (ex: Sidwaya, AIB, ONASER, SONABEL, ANAM-BF, FBF, etc.).
  - Retourne impérativement les articles au format spécifié par le schéma JSON requis.`;

  // Standard config
  const generationConfig = {
    systemInstruction: "Tu es le rédacteur en chef chevronné de Faso Actu, le premier fil d'actualité en temps réel du Burkina Faso. Les articles que tu rédiges doivent être informatifs, pertinents pour les résidents burkinabè, culturellement respectueux et rédigés dans un français de presse impeccable.",
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Identifiant unique commençant par 'ai-'" },
          title: { type: Type.STRING, description: "Titre percutant et informatif" },
          summary: { type: Type.STRING, description: "Résumé court de 2 phrases" },
          body: { type: Type.STRING, description: "Corps de l'article de 3-4 paragraphes détaillés" },
          category: { 
            type: Type.STRING, 
            description: "La catégorie de l'article",
            enum: ["politique", "economie", "securite", "regions", "sport", "culture"] 
          },
          date: { type: Type.STRING, description: "Date relative ex: 'Aujourd'hui, 10:20' ou 'Aujourd'hui, 15:45'" },
          region: { type: Type.STRING, description: "Province ou Ville du Burkina Faso concernée" },
          isAlert: { type: Type.BOOLEAN, description: "Indicateur d'alerte urgente" },
          alertLevel: { 
            type: Type.STRING, 
            description: "Gravité si alerte",
            enum: ["info", "warning", "critical"] 
          },
          source: { type: Type.STRING, description: "Agence éditrice locale (ex: AIB, Sidwaya)" },
          readTime: { type: Type.STRING, description: "Temps de lecture estimé ex: '3 min'" }
        },
        required: ["id", "title", "summary", "body", "category", "date", "region", "source", "readTime"]
      }
    }
  };

  // Try multiple models, each with up to 3 retries under exponential backoff
  for (const currentModel of fallbackModels) {
    let delay = 350;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Contacting Gemini API: Model=${currentModel}, Attempt=${attempt}/${3}...`);
        const response = await aiClient.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: generationConfig
        });

        if (response && response.text) {
          finalResponse = response;
          break; // successfully generated
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        console.warn(`Attempt ${attempt} for model ${currentModel} failed with error: ${errMsg}`);
        
        // Wait before next attempt
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }
    }
    
    // If successfully got a response, break outer model fallback loop
    if (finalResponse) {
      break;
    }
  }

  try {
    if (finalResponse && finalResponse.text) {
      const articles = JSON.parse(finalResponse.text.trim());
      console.log(`Successfully generated ${articles.length} news articles with model.`);
      return res.json({ source: "gemini_api", articles });
    } else {
      throw lastError || new Error("All fallback models failed to generate content.");
    }
  } catch (err) {
    console.error("Gemini API call crashed, sending local fallback articles instead:", err);
    // Safe fall back
    const filtered = category && category !== "all" 
      ? BURKINA_FALLBACK_NEWS.filter(item => item.category === category)
      : BURKINA_FALLBACK_NEWS;
    return res.json({ source: "local_cache", error: true, articles: filtered });
  }
});

// Start listening and Vite middleware routing configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware attached to Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Faso Actu server running on http://localhost:${PORT}`);
  });
}

startServer();
