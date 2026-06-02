export const projectConfig = {
  productName: "FutureScaping Monitoring System",
  branding: {
    overviewHeroImagePath: "./assets/overview-hero-estuary.png",
    areaHeroImagesBySurvey: {
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
    }
  },
  data: {
    projectsPath: "./data/projects.json"
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
    tabs: ["overview", "areas", "weather", "volume", "layers", "sections", "admin"]
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
  showAdminTools: false
};
