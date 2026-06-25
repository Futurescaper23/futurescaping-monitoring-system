export const projectConfig = {
  productName: "FutureScaping Monitoring System",
  branding: {
    overviewHeroImagePath: "./assets/overview-hero-estuary.png",
    overviewHeroImagePathBySurvey: {
      "2026-06-16": "./assets/area-heroes/2026-06-16/whole-estuary.png"
    },
    areaHeroImagesBySurvey: {
      "2026-06-16": {
        area1: "./assets/area-heroes/2026-06-16/area-1.png",
        area2: "./assets/area-heroes/2026-06-16/area-2.png",
        area3: "./assets/area-heroes/2026-06-16/area-3.png",
        area4: "./assets/area-heroes/2026-06-16/area-4.png",
        area5: "./assets/area-heroes/2026-06-16/area-5.png",
        area6: "./assets/area-heroes/2026-06-16/area-6.png",
        area7: "./assets/area-heroes/2026-06-16/area-7.png",
        area8: "./assets/area-heroes/2026-06-16/area-8.png"
      },
      "2026-04-18": {
        area1: "./assets/area-heroes/2026-04-18/area1.png",
        area2: "./assets/area-heroes/2026-04-18/area2.png",
        area3: "./assets/area-heroes/2026-04-18/area3.png",
        area4: "./assets/area-heroes/2026-04-18/area4.png",
        area5: "./assets/area-heroes/2026-04-18/area5.png",
        area6: "./assets/area-heroes/2026-04-18/area6.png",
        area7: "./assets/area-heroes/2026-04-18/area7.png",
        area8: "./assets/area-heroes/2026-04-18/area8.png"
      }
    },
    areaHeroArtDirectionBySurvey: {
      "2026-06-16": {
        area1: { position: "62% 49%", scale: 0.94, backdropOpacity: 0.74, backdropBlur: 6, backdropScale: 1.08 },
        area2: { position: "60% 49%", scale: 0.92, backdropOpacity: 0.7, backdropBlur: 6, backdropScale: 1.08 },
        area3: { position: "59% 50%", scale: 0.94, backdropOpacity: 0.76, backdropBlur: 6, backdropScale: 1.08 },
        area4: { position: "60% 49%", scale: 0.95, backdropOpacity: 0.78, backdropBlur: 6, backdropScale: 1.08 },
        area5: { position: "60% 50%", scale: 0.95, backdropOpacity: 0.78, backdropBlur: 6, backdropScale: 1.08 },
        area6: { position: "58% 50%", scale: 0.93, backdropOpacity: 0.72, backdropBlur: 6, backdropScale: 1.08 },
        area7: { position: "60% 49%", scale: 0.92, backdropOpacity: 0.72, backdropBlur: 6, backdropScale: 1.08 }
      },
      "2026-04-18": {
        area1: { position: "62% 48%", scale: 0.98, backdropOpacity: 0.98, backdropBlur: 2, backdropScale: 1.06 },
        area2: { position: "68% 50%", scale: 0.9, backdropOpacity: 0, backdropBlur: 0, backdropScale: 1.02 },
        area3: { position: "58% 52%", scale: 0.96, backdropOpacity: 0.76, backdropBlur: 6, backdropScale: 1.08 },
        area4: { position: "60% 50%", scale: 0.98, backdropOpacity: 0.98, backdropBlur: 2, backdropScale: 1.06 },
        area5: { position: "61% 51%", scale: 0.99, backdropOpacity: 0.98, backdropBlur: 2, backdropScale: 1.06 },
        area6: { position: "57% 52%", scale: 0.9, backdropOpacity: 0, backdropBlur: 0, backdropScale: 1.02 },
        area7: { position: "58% 51%", scale: 0.93, backdropOpacity: 0.66, backdropBlur: 8, backdropScale: 1.1 },
        area8: { position: "62% 49%", scale: 0.84, backdropOpacity: 0, backdropBlur: 0, backdropScale: 1.02 }
      }
    },
    panoramaEmbedsBySurvey: {
      "2026-06-16": {
        area1: "https://area-1-panos.netlify.app/",
        area2: "https://area-2-panos.netlify.app/",
        area3: "https://area-3-panos.netlify.app/",
        area4: "https://area-4-panos.netlify.app/",
        area5: "https://area-5-panos.netlify.app/",
        area6: "https://area-6-panos.netlify.app/",
        area7: "https://area-7-panos.netlify.app/",
        area8: "https://area-8-panos.netlify.app/"
      }
    },
    niraModelsBySurvey: {
      "2026-03-22": "https://futurescaping.nira.app/a/35VOk9gRT5KFNQDIq54mSQ/1",
      "2026-04-18": "https://futurescaping.nira.app/a/ZBURz7G_T8m2DdXuev7yiw/1",
      "2026-06-16": "https://futurescaping.nira.app/a/Z8GYJffuRYaeoQVq1w6dUw/1"
    }
  },
  data: {
    projectsPath: "./data/projects.json"
  },
  deployment: {
    publicBaseUrl: "https://future-monitoring-system.onrender.com/"
  },
  defaultState: {
    areaId: "area1",
    sectionId: "A1-01",
    layerKey: "ortho",
    primaryLayerKey: "ortho",
    secondaryLayerKey: "ortho",
    activeTab: "overview"
  },
  navigation: {
    tabs: ["overview", "areas", "weather", "panorama", "volume", "layers", "sections", "admin"]
  },
  terminology: {
    survey: "survey round",
    area: "monitoring area",
    aerialLayerClient: "Aerial View",
    aerialLayerTechnical: "orthomosaic",
    elevationLayerClient: "Colour Elevation",
    elevationLayerTechnical: "DSM",
    heightModelClient: "surface height model",
    comparison: "change comparison"
  },
  // Set to true for internal FutureScaping builds that need upload,
  // intake, survey management, and other admin tools.
  showAdminTools: true
};
