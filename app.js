import { projectConfig } from "./src/config/projectConfig.js?v=20260529g";
import { areaSettings, assetSettings, layerSettings } from "./src/data/areas.js?v=20260529g";
import { environmentalContext } from "./src/data/environmentalContext.js?v=20260529g";
import { sectionSettings } from "./src/data/sections.js?v=20260529g";
import { volumeChangeSettings } from "./src/data/volumeChange.js?v=20260529g";

  const state = {
  dataset: null,
  projectId: null,
  surveyId: null,
  areaId: projectConfig.defaultState.areaId,
  sectionId: projectConfig.defaultState.sectionId,
  layerKey: projectConfig.defaultState.layerKey,
  primaryLayerKey: projectConfig.defaultState.primaryLayerKey,
  secondaryLayerKey: projectConfig.defaultState.secondaryLayerKey,
  assetStatusCache: new Map(),
  primarySurveyId: null,
  secondarySurveyId: null,
  compareMode: "single",
  primaryOpacity: 1,
  secondaryOpacity: 0.55,
  showGuideDsm: false,
  showGuideContours: true,
  showChangeHighlight: false,
  overviewMode: "information",
  overviewIndexOpen: false,
  overviewAreaFilter: "all",
  sectionBasemap: projectConfig.defaultState.layerKey,
  sectionRows: [],
  sectionComparisonSurveyIds: [],
  sectionHoverDistance: null,
  swipePercent: 50,
  isDraggingSwipe: false,
  scale: 1,
  panX: 0,
  panY: 0,
  isPanning: false,
  activeViewerPointerId: null,
  activeTouchGesture: false,
  touchGestureMode: null,
  lastTouchX: 0,
  lastTouchY: 0,
  viewerPointers: new Map(),
  pinchStartDistance: null,
  pinchStartScale: 1,
  pinchStartPanX: 0,
  pinchStartPanY: 0,
  pinchStartCenter: null,
  pinchStageCenter: null,
  startX: 0,
  startY: 0,
  startPanX: 0,
  startPanY: 0,
  sectionPointerId: null,
  pendingSectionHoverDistance: null,
  pendingSectionHoverFrame: null,
  adminMode: false,
  activeTab: projectConfig.defaultState.activeTab,
  weatherFrameSrc: "",
  weatherFrameHeight: 0,
  volumeViewMode: "comparison",
  jsonAssetCache: new Map(),
  processedSectionAssetCache: new Map(),
  processedHighlightAssetCache: new Map(),
  sectionTrackCache: new Map(),
  sectionArea: null
    };

const VALID_TABS = new Set(projectConfig.navigation.tabs);
const AREA_ENABLED_TOOLBAR_TABS = new Set(["volume", "layers", "sections"]);

  const EXPLICIT_SECTION_IMAGE_TRACKS = {
    area1: [
      { upper: { x: 27.25, y: 4.86 }, lower: { x: 15.85, y: 46.18 } },
      { upper: { x: 52.21, y: 18.18 }, lower: { x: 58.07, y: 94.84 } },
      { upper: { x: 74.04, y: 21.49 }, lower: { x: 77.07, y: 68.87 } }
    ],
    area2: [
      { upper: { x: 25.61, y: 24.8 }, lower: { x: 24.54, y: 91.8 } },
      { upper: { x: 49.15, y: 1.24 }, lower: { x: 50.73, y: 97.29 } },
      { upper: { x: 76.66, y: 30.07 }, lower: { x: 77.42, y: 99.89 } }
    ],
    area3: [
      { upper: { x: 27.2, y: 16.45 }, lower: { x: 24.93, y: 89.88 } },
      { upper: { x: 53.8, y: 25.37 }, lower: { x: 52.37, y: 77.57 } },
      { upper: { x: 81.76, y: 9.26 }, lower: { x: 79.8, y: 97.4 } }
    ],
    area4: [
      { upper: { x: 32.45, y: 10.5 }, lower: { x: 22.53, y: 56.83 } },
      { upper: { x: 57.05, y: 12.42 }, lower: { x: 43.98, y: 78.92 } },
      { upper: { x: 76.8, y: 14.38 }, lower: { x: 62.41, y: 90.97 } }
    ],
    area5: [
      { upper: { x: 33.43, y: 2.26 }, lower: { x: 31.24, y: 89.99 } },
      { upper: { x: 53.97, y: 26.19 }, lower: { x: 53.97, y: 95.07 } },
      { upper: { x: 79.21, y: 21.6 }, lower: { x: 85.86, y: 97.4 } }
    ],
    area6: [
      { upper: { x: 32.5, y: 17.28 }, lower: { x: 27.59, y: 76.74 } },
      { upper: { x: 49.53, y: 19.35 }, lower: { x: 43.96, y: 74.26 } },
      { upper: { x: 74.2, y: 38.46 }, lower: { x: 70.5, y: 87.62 } }
    ],
    area7: [
      { upper: { x: 19.01, y: 33.72 }, lower: { x: 22.24, y: 76.1 } },
      { upper: { x: 48.89, y: 16.9 }, lower: { x: 49.23, y: 63.49 } },
      { upper: { x: 82.23, y: 18.07 }, lower: { x: 80.79, y: 71.77 } }
    ],
    area8: [
      { upper: { x: 24.69, y: 20.7 }, lower: { x: 21.32, y: 71.85 } },
      { upper: { x: 45.21, y: 1.69 }, lower: { x: 42, y: 72.49 } },
      { upper: { x: 73.17, y: 26.12 }, lower: { x: 67.02, y: 79.9 } }
    ]
  };

  function explicitTrackToSectionTrack(explicitTrack) {
    const start = { ...explicitTrack.upper };
    const end = { ...explicitTrack.lower };
    return {
      start,
      end,
      points: [start, end]
    };
  }

const SECTION_PROFILE_COLORS = [
  "#79a7ff",
  "#ff7f6e",
  "#f4bf4f",
  "#7ee0c0",
  "#c7a2ff",
  "#ff9ad5"
];

const BASELINE_AREA_OVERVIEW = {
  area1: {
    title: "Hawker's Cove / Tregirls Beach",
    zone: "Outer estuary / Padstow side",
    day: "Day 1",
    filterKey: "day1",
    statusLabel: "Later than low tide",
    statusTone: "amber",
    size: "1.00 km2",
    start: "15:57",
    finish: "16:46",
    launchOffset: "130 mins after low tide",
    midOffset: 155,
    tideWindow: "Approx. 2.99 m to 3.93 m",
    lowTide: "13:47",
    lowTideHeight: "0.53 m",
    estimatedDuration: "32m 18s",
    actualDuration: "44m 23s",
    tideScore: 61,
    missionRole: "Covers the outer Padstow-side section and completes the Day 1 survey sequence.",
    operationalNote: "Reached after a long drive round from the Rock side. Conditions were good closer in, but wind increased sharply towards Stepper Point and the drone was less settled there.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.561399, -4.944237. Good conditions closer to Iron Cove, with stronger wind felt further out towards Stepper Point. More sheltered inside, more exposed on the outer edge.",
    surveyNotes: "This area was flown later in the session after travelling round from the Rock side, which added nearly 40 minutes by car. The aircraft was happy closer in, but became less comfortable further out towards Stepper Point where the wind was stronger.",
    tags: ["Day 1", "Padstow side", "Outer reach", "Late-tide context"],
    cardNote: "Outer Padstow-side baseline",
    purpose: "Shows conditions in the outer Padstow-side section after low tide and helps link this area to the rest of the estuary survey."
  },
  area2: {
    title: "Daymer Bay",
    zone: "Rock side / outer entrance",
    day: "Day 1",
    filterKey: "day1",
    statusLabel: "Early tide window",
    statusTone: "amber",
    size: "0.70 km2",
    start: "12:04",
    finish: "12:44",
    launchOffset: "103 mins before low tide",
    midOffset: -83,
    tideWindow: "Approx. 2.38 m to 1.66 m",
    lowTide: "13:47",
    lowTideHeight: "0.53 m",
    estimatedDuration: "26m 29s",
    actualDuration: "37m 42s",
    tideScore: 72,
    missionRole: "Starts the main Day 1 survey and covers the outer Rock-side section.",
    operationalNote: "This was the first proper scan of the day. Wind was not too high and the conditions were steadier than later areas.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.560443, -4.929076. Earlier in the day with lighter wind, some sun, and generally good flying conditions across the bay.",
    surveyNotes: "This was the first proper scan of the session, flown earlier in the day while the tide was still falling. Conditions were calmer here, with some sun coming through and no major wind issues during the flight.",
    tags: ["Day 1", "Rock side", "Outer entrance", "Pre-low tide"],
    cardNote: "Early Rock-side baseline",
    purpose: "Shows the outer bay area as the tide was still falling and gives context for the entrance to the estuary."
  },
  area3: {
    title: "Rock Beach",
    zone: "Central estuary / Tregirls side",
    day: "Day 1",
    filterKey: "day1",
    statusLabel: "Good low-tide alignment",
    statusTone: "green",
    size: "0.91 km2",
    start: "13:14",
    finish: "13:56",
    launchOffset: "33 mins before low tide",
    midOffset: -12,
    tideWindow: "Approx. 1.12 m to 0.70 m",
    lowTide: "13:47",
    lowTideHeight: "0.53 m",
    estimatedDuration: "31m 21s",
    actualDuration: "39m 11s",
    tideScore: 95,
    missionRole: "Covers a central section close to low tide and forms an important part of the baseline survey.",
    operationalNote: "This was the first point on site where the true scale of the sandbars was obvious. Wind was present but manageable, with sun at first and more cloud coming over as the flight went on.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, cross-sections, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.550143, -4.931826. Some wind was noticeable on site, but nothing too strong. Started brighter with some sun, then cloud increased as the survey moved through.",
    surveyNotes: "This area gave the first proper feet-on-the-ground sense of how high the sandbars really were, much larger than expected and in places taller than standing height. It was possible to walk down the middle of the estuary with a strong but manageable flow, then work back inland with the drone. This made the area especially valuable for understanding the true scale of exposed ground near low tide.",
    tags: ["Day 1", "Central reach", "Near low tide", "Cross-section priority"],
    cardNote: "Strong central low-tide capture",
    purpose: "Shows the central area close to low tide, when more of the estuary bed was exposed."
  },
  area4: {
    title: "Padstow Harbour Estuary",
    zone: "Padstow side / upper harbour flats",
    day: "Day 2",
    filterKey: "day2",
    statusLabel: "After low tide",
    statusTone: "amber",
    size: "1.00 km2",
    start: "14:46",
    finish: "15:56",
    launchOffset: "23 mins after low tide",
    midOffset: 58,
    tideWindow: "Approx. 1.33 m to 2.49 m",
    lowTide: "14:23",
    lowTideHeight: "0.95 m",
    estimatedDuration: "34m 32s",
    actualDuration: "48m 43s",
    tideScore: 82,
    missionRole: "Covers the harbour-side flats on Day 2 after low tide.",
    operationalNote: "Chosen for the Monday to avoid the busier Sunday conditions near Padstow. Wind was lighter closer to Padstow, then picked up a bit further down towards Little Petherick Creek bridge where the estuary opened out more.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, cross-sections, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.535818, -4.929569. Generally calmer closer to Padstow, with slightly more wind further down-estuary towards Little Petherick Creek bridge where the area felt more open.",
    surveyNotes: "This section was deliberately left for Monday so the Padstow edge would be quieter than on the Sunday. Even so, the route avoided direct overflight of the busier public areas. Conditions were fairly calm near Padstow itself, with a bit more wind felt further down the estuary.",
    tags: ["Day 2", "Padstow side", "Harbour flats", "Post-low tide"],
    cardNote: "Harbour flats after the tide turn",
    purpose: "Shows the Padstow-side harbour flats as the water started to return."
  },
  area5: {
    title: "Porthilly Cove",
    zone: "Transition zone / central bar area",
    day: "Day 1",
    filterKey: "day1",
    statusLabel: "Around low tide",
    statusTone: "green",
    size: "0.77 km2",
    start: "14:23",
    finish: "14:57",
    launchOffset: "36 mins after low tide",
    midOffset: 53,
    tideWindow: "Approx. 1.21 m to 1.86 m",
    lowTide: "13:47",
    lowTideHeight: "0.53 m",
    estimatedDuration: "25m 49s",
    actualDuration: "32m 46s",
    tideScore: 87,
    missionRole: "Covers an important transition area between the central estuary and the outer Padstow-side section.",
    operationalNote: "This was the third flight of Day 1. Access from Rock car park was awkward, with very soft silky sand in places making the walk-in difficult.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, cross-sections, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.540612, -4.921686. Cloud had built up by this point, giving flatter light and less pleasant weather than earlier in the day, although conditions remained calm enough for flying.",
    surveyNotes: "This area was meant to land as close to low tide as possible on Day 1, but like the rest of the programme it drifted later because everything took longer in the field. The route in from Rock car park was unpleasant, with deep silky sand in places up to knee depth, so in future it would probably make more sense to park nearer the church and walk in from there.",
    tags: ["Day 1", "Transition zone", "Sediment bar", "Monitoring priority"],
    cardNote: "Bar and channel transition area",
    purpose: "Shows a key transition area where changes to bars and channels are easier to track over time."
  },
  area6: {
    title: "Old Town Cove",
    zone: "Inland / upper estuary",
    day: "Day 2",
    filterKey: "day2",
    statusLabel: "Later session",
    statusTone: "rose",
    size: "1.01 km2",
    start: "16:10",
    finish: "17:05",
    launchOffset: "107 mins after low tide",
    midOffset: 135,
    tideWindow: "Approx. 2.72 m to 3.64 m",
    lowTide: "14:23",
    lowTideHeight: "0.95 m",
    estimatedDuration: "35m 42s",
    actualDuration: "42m 28s",
    tideScore: 59,
    missionRole: "Covers the inland end of the Day 2 survey and shows conditions later in the session.",
    operationalNote: "This was the final flight of Day 2. By this point the wind had dropped right away and conditions were much calmer than earlier in the day.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.531896, -4.908045. Mostly grey cloud remained, but the wind had almost disappeared and the sun was just starting to poke through again late in the day.",
    surveyNotes: "This was the last area flown on Day 2 after completing A8, A7, and A4 first, with the overall aim of getting A4 and A5 as close to low tide as possible across the two survey days. Earlier in the day the wind had been much more noticeable in the upper estuary, but by the time this block was flown it had dropped off significantly, making the aircraft much happier.",
    tags: ["Day 2", "Inner reach", "Operational test", "Late tide"],
    cardNote: "Practical limit of the session",
    purpose: "Shows the upper estuary later in the tide cycle and helps record how conditions changed further inland."
  },
  area7: {
    title: "Slate Quarry",
    zone: "Mid-inner estuary",
    day: "Day 2",
    filterKey: "day2",
    statusLabel: "Near low tide",
    statusTone: "green",
    size: "0.92 km2",
    start: "13:15",
    finish: "14:19",
    launchOffset: "68 mins before low tide",
    midOffset: -36,
    tideWindow: "Approx. 2.04 m to 1.01 m",
    lowTide: "14:23",
    lowTideHeight: "0.95 m",
    estimatedDuration: "32m 01s",
    actualDuration: "42m 34s",
    tideScore: 88,
    missionRole: "Covers an inland section before low tide and gives a useful comparison with areas flown later in the day.",
    operationalNote: "After the calm start further up-estuary, the wind picked up noticeably here. The drone was working harder and progress was slower when flying into the wind towards Padstow.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, cross-sections, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.532115, -4.887484. Wind was clearly stronger here than in A8, with airflow pushing down from the Padstow direction and making this section more exposed.",
    surveyNotes: "This was the second main section flown on Day 2 after starting further up at Wadebridge. As the survey moved back down the estuary towards Padstow, the wind definitely increased and the aircraft had to work harder. It did not map as quickly into the wind, especially when tracking back towards Padstow, which was the direction the airflow seemed to be coming from.",
    tags: ["Day 2", "Pre-low tide", "Mid-inner reach", "Comparison priority"],
    cardNote: "Pre-low-tide inland comparison",
    purpose: "Shows how the mid-inner estuary was exposing before low tide."
  },
  area8: {
    title: "Wadebridge",
    zone: "Rock side / upper edge",
    day: "Day 2",
    filterKey: "day2",
    statusLabel: "Early tide window",
    statusTone: "amber",
    size: "0.95 km2",
    start: "12:07",
    finish: "13:13",
    launchOffset: "136 mins before low tide",
    midOffset: -103,
    tideWindow: "Approx. 3.14 m to 2.08 m",
    lowTide: "14:23",
    lowTideHeight: "0.95 m",
    estimatedDuration: "33m 26s",
    actualDuration: "46m 19s",
    tideScore: 67,
    missionRole: "Starts Day 2 and covers the upper Rock-side section before low tide.",
    operationalNote: "This was the furthest section from Padstow and the easiest way in and out was by bike with the kit on a trailer. Once there, conditions were calm and very peaceful with no real wind.",
    deliverables: "High-resolution aerial image, surface height model, 3D ground model, panoramic views, future comparison views",
    weatherNotes: "Coordinate: 50.532295, -4.863407. Calm conditions with very little wind, soft white cloud, and good visibility, making it easier to keep the drone in sight.",
    surveyNotes: "Day 2 started here because it was the furthest point from Padstow. Access was easiest by bike and trailer, cycling all the way up towards Wadebridge before setting up just short of the bridge. The area felt peaceful and sheltered, with very little wind and some soft white cloud in the sky, making it a very comfortable place to start the day.",
    tags: ["Day 2", "Rock side", "Early sequence", "Context area"],
    cardNote: "Early Day 2 Rock-side context",
    purpose: "Shows early Day 2 conditions while the tide was still falling and more water remained across the estuary."
  }
};

const AREA_METADATA_FIELDS = [
  "statusLabel",
  "statusTone",
  "purpose",
  "start",
  "finish",
  "size",
  "lowTide",
  "lowTideHeight",
  "launchOffset",
  "estimatedDuration",
  "actualDuration",
  "tideWindow",
  "tideScore",
  "tags",
  "missionRole",
  "operationalNote",
  "weatherNotes",
  "surveyNotes"
];

const els = {
  surveySelect: byId("surveySelect"),
  areaSelect: byId("areaSelect"),
  sectionSelect: byId("sectionSelect"),
  projectTitle: byId("projectTitle"),
  projectSummary: byId("projectSummary"),
  shellStageEyebrow: byId("shellStageEyebrow"),
  shellStageTitle: byId("shellStageTitle"),
  shellStageSummary: byId("shellStageSummary"),
  shellStageSummaryDock: byId("shellStageSummaryDock"),
  shellStageSurvey: byId("shellStageSurvey"),
  shellStageArea: byId("shellStageArea"),
  shellStageVisual: byId("shellStageVisual"),
  shellStageVisualImage: byId("shellStageVisualImage"),
  overviewHeroTitle: byId("overviewHeroTitle"),
  overviewHeroText: byId("overviewHeroText"),
  overviewInfoBtn: byId("overviewInfoBtn"),
  overviewSurveyBtn: byId("overviewSurveyBtn"),
  overviewHelpBtn: byId("overviewHelpBtn"),
  overviewIndexBtn: byId("overviewIndexBtn"),
  overviewIndexMenu: byId("overviewIndexMenu"),
  overviewContentsTitle: byId("overviewContentsTitle"),
  overviewContentsLead: byId("overviewContentsLead"),
  overviewContentsSubtext: byId("overviewContentsSubtext"),
  overviewContentsGrid: byId("overviewContentsGrid"),
  overviewGlanceGrid: byId("overviewGlanceGrid"),
  overviewStoryTitle: byId("overviewStoryTitle"),
  overviewStory: byId("overviewStory"),
  overviewAreasSubtext: byId("overviewAreasSubtext"),
  overviewAreaFilters: byId("overviewAreaFilters"),
  overviewAreaGrid: byId("overviewAreaGrid"),
  areaOverviewPanel: byId("areaOverviewPanel"),
  metricGrid: byId("metricGrid"),
  surveyReadinessGrid: byId("surveyReadinessGrid"),
  surveyReadinessDetails: byId("surveyReadinessDetails"),
  surveyCoverageGrid: byId("surveyCoverageGrid"),
  surveyCoverageAreas: byId("surveyCoverageAreas"),
  timeline: byId("timeline"),
  areaList: byId("areaList"),
  selectedAreaPanel: byId("selectedAreaPanel"),
  selectedAreaTitle: byId("selectedAreaTitle"),
  selectedAreaSummary: byId("selectedAreaSummary"),
  selectedAreaChips: byId("selectedAreaChips"),
  selectedAreaAssets: byId("selectedAreaAssets"),
  weatherSummary: byId("weatherSummary"),
  weatherFrame: byId("weatherFrame"),
  volumeSummary: byId("volumeSummary"),
  volumeSandboxBanner: byId("volumeSandboxBanner"),
  volumeMetricGrid: byId("volumeMetricGrid"),
  volumeViewerPanel: byId("volumeViewerPanel"),
  volumeViewerTitle: byId("volumeViewerTitle"),
  volumeViewerSummary: byId("volumeViewerSummary"),
  volumeViewerFrame: byId("volumeViewerFrame"),
  volumeViewerStats: byId("volumeViewerStats"),
  volumeViewerDetails: byId("volumeViewerDetails"),
  volumeImageSummary: byId("volumeImageSummary"),
  volumeBaselineLabel: byId("volumeBaselineLabel"),
  volumeCurrentLabel: byId("volumeCurrentLabel"),
  volumeBaselineImage: byId("volumeBaselineImage"),
  volumeCurrentImage: byId("volumeCurrentImage"),
  volumeBaselineOverlay: byId("volumeBaselineOverlay"),
  volumeCurrentOverlay: byId("volumeCurrentOverlay"),
  volumeBaselineCaption: byId("volumeBaselineCaption"),
  volumeCurrentCaption: byId("volumeCurrentCaption"),
  volumeMethod: byId("volumeMethod"),
  volumeNarrative: byId("volumeNarrative"),
  volumeAreaGrid: byId("volumeAreaGrid"),
  volumeImageryGrid: byId("volumeImageryGrid"),
  volumeBaselineCard: byId("volumeBaselineCard"),
  volumeCurrentCard: byId("volumeCurrentCard"),
  volumeBaselineChip: byId("volumeBaselineChip"),
  volumeCurrentChip: byId("volumeCurrentChip"),
  viewerTitle: byId("viewerTitle"),
  layerWorkspace: byId("layerWorkspace"),
  primaryCompareSelect: byId("primaryCompareSelect"),
  secondaryCompareSelect: byId("secondaryCompareSelect"),
  primaryLayerCompareSelect: byId("primaryLayerCompareSelect"),
  secondaryLayerCompareSelect: byId("secondaryLayerCompareSelect"),
  compareModeControls: byId("compareModeControls"),
  viewerStage: byId("viewerStage"),
  transparencyControls: byId("transparencyControls"),
  primaryOpacityRange: byId("primaryOpacityRange"),
  secondaryOpacityRange: byId("secondaryOpacityRange"),
  viewerTransform: byId("viewerTransform"),
  viewerBaseImage: byId("viewerBaseImage"),
  viewerGuideDsmOverlay: byId("viewerGuideDsmOverlay"),
  viewerGuideDsmImage: byId("viewerGuideDsmImage"),
  viewerGuideContourOverlay: byId("viewerGuideContourOverlay"),
  viewerGuideContourImage: byId("viewerGuideContourImage"),
  viewerTransparencyOverlay: byId("viewerTransparencyOverlay"),
  viewerOverlayImage: byId("viewerOverlayImage"),
  viewerHighlightOverlay: byId("viewerHighlightOverlay"),
  viewerHighlightImage: byId("viewerHighlightImage"),
  viewerSliderOverlay: byId("viewerSliderOverlay"),
  viewerSliderImage: byId("viewerSliderImage"),
  sliderHandle: byId("sliderHandle"),
  viewerCaption: byId("viewerCaption"),
  layerControls: byId("layerControls"),
  zoomInBtn: byId("zoomInBtn"),
  zoomOutBtn: byId("zoomOutBtn"),
  resetViewBtn: byId("resetViewBtn"),
  viewerFullscreenBtn: byId("viewerFullscreenBtn"),
  toggleGuideDsm: byId("toggleGuideDsm"),
  toggleGuideContours: byId("toggleGuideContours"),
  toggleChangeHighlight: byId("toggleChangeHighlight"),
  compareHighlightLegend: byId("compareHighlightLegend"),
  compareInsightGrid: byId("compareInsightGrid"),
  sectionWorkspace: byId("sectionWorkspace"),
  sectionPanelTitle: byId("sectionPanelTitle"),
  sectionStatusText: byId("sectionStatusText"),
  sectionOrthoBtn: byId("sectionOrthoBtn"),
  sectionDsmBtn: byId("sectionDsmBtn"),
  sectionFullscreenBtn: byId("sectionFullscreenBtn"),
  sectionMapStage: byId("sectionMapStage"),
  sectionBaseImage: byId("sectionBaseImage"),
  sectionOverlayImage: byId("sectionOverlayImage"),
  sectionHeroTitle: byId("sectionHeroTitle"),
  sectionHeroSummary: byId("sectionHeroSummary"),
  sectionSurveyPill: byId("sectionSurveyPill"),
  sectionHeroStats: byId("sectionHeroStats"),
  sectionHotspots: byId("sectionHotspots"),
  sectionMapMarker: byId("sectionMapMarker"),
  sectionQuickSelect: byId("sectionQuickSelect"),
  sectionProfileControls: byId("sectionProfileControls"),
  sectionProfileLegend: byId("sectionProfileLegend"),
  profileChart: byId("profileChart"),
  sectionAnalysisGrid: byId("sectionAnalysisGrid"),
  sectionComparisonSummary: byId("sectionComparisonSummary"),
  sectionDifferenceSurveyLabel: byId("sectionDifferenceSurveyLabel"),
  sectionDifferenceValue: byId("sectionDifferenceValue"),
  sectionDifferenceText: byId("sectionDifferenceText"),
  sectionDifferenceRange: byId("sectionDifferenceRange"),
  sectionDifferenceInset: byId("sectionDifferenceInset"),
  sectionMetrics: byId("sectionMetrics"),
  sectionDetails: byId("sectionDetails"),
  sectionInsightOverlay: byId("sectionInsightOverlay"),
  sectionInsightOverlayBackdrop: byId("sectionInsightOverlayBackdrop"),
  sectionInsightOverlayClose: byId("sectionInsightOverlayClose"),
  sectionInsightOverlayEyebrow: byId("sectionInsightOverlayEyebrow"),
  sectionInsightOverlayTitle: byId("sectionInsightOverlayTitle"),
  sectionInsightOverlaySummary: byId("sectionInsightOverlaySummary"),
  sectionInsightOverlayBody: byId("sectionInsightOverlayBody"),
  adminTargetSummary: byId("adminTargetSummary"),
  adminExpectedFiles: byId("adminExpectedFiles"),
  uploadOrtho: byId("uploadOrtho"),
  uploadDsm: byId("uploadDsm"),
  uploadContour: byId("uploadContour"),
  uploadSectionLines: byId("uploadSectionLines"),
  uploadSectionCsv: byId("uploadSectionCsv"),
  uploadSelectedFiles: byId("uploadSelectedFiles"),
  createSurveyBtn: byId("createSurveyBtn"),
  newSurveyName: byId("newSurveyName"),
  newSurveyStart: byId("newSurveyStart"),
  newSurveyEnd: byId("newSurveyEnd"),
  newSurveyBaseline: byId("newSurveyBaseline"),
  createSurveyStatus: byId("createSurveyStatus"),
  adminMetadataSummary: byId("adminMetadataSummary"),
  metaStatusLabel: byId("metaStatusLabel"),
  metaStatusTone: byId("metaStatusTone"),
  metaPurpose: byId("metaPurpose"),
  metaStart: byId("metaStart"),
  metaFinish: byId("metaFinish"),
  metaSize: byId("metaSize"),
  metaLowTide: byId("metaLowTide"),
  metaLowTideHeight: byId("metaLowTideHeight"),
  metaLaunchOffset: byId("metaLaunchOffset"),
  metaEstimatedDuration: byId("metaEstimatedDuration"),
  metaActualDuration: byId("metaActualDuration"),
  metaTideWindow: byId("metaTideWindow"),
  metaTideScore: byId("metaTideScore"),
  metaTags: byId("metaTags"),
  metaMissionRole: byId("metaMissionRole"),
  metaOperationalNote: byId("metaOperationalNote"),
  metaWeatherNotes: byId("metaWeatherNotes"),
  metaSurveyNotes: byId("metaSurveyNotes"),
  saveAreaMetadataBtn: byId("saveAreaMetadataBtn"),
  resetAreaMetadataBtn: byId("resetAreaMetadataBtn"),
  areaMetadataStatus: byId("areaMetadataStatus"),
  volumeAdminSummary: byId("volumeAdminSummary"),
  volumeMethodInput: byId("volumeMethodInput"),
  volumeCellSizeInput: byId("volumeCellSizeInput"),
  volumeNotesInput: byId("volumeNotesInput"),
  volumeRowsInput: byId("volumeRowsInput"),
  saveVolumeBtn: byId("saveVolumeBtn"),
  volumeAdminStatus: byId("volumeAdminStatus"),
  adminUploadStatus: byId("adminUploadStatus"),
  adminBoardSummary: byId("adminBoardSummary"),
  adminBoardGrid: byId("adminBoardGrid"),
  workflowGrid: byId("workflowGrid"),
  tabs: byId("tabs"),
  backToTopBtn: byId("backToTopBtn"),
  adminModeToggle: byId("adminModeToggle")
};

bootstrap().catch((error) => {
  els.projectTitle.textContent = "Could not load project";
  els.projectSummary.textContent = error.message;
});

async function bootstrap() {
  state.dataset = await loadProjectDataset();
  const requestedAdminMode = new URLSearchParams(window.location.search).get("admin") === "1" || window.localStorage.getItem("fsm-admin-mode") === "1";
  state.adminMode = adminToolsEnabled() && requestedAdminMode;
  if (!adminToolsEnabled()) {
    window.localStorage.removeItem("fsm-admin-mode");
  }
  state.projectId = state.dataset.projects[0].id;
  const defaultSurvey = currentProject().surveys[currentProject().surveys.length - 1];
  state.surveyId = defaultSurvey.id;
  state.primarySurveyId = state.surveyId;
  state.secondarySurveyId = defaultSurvey.comparisonBaseline
    || currentProject().surveys.find((survey) => survey.id !== state.surveyId)?.id
    || state.surveyId;
  state.sectionComparisonSurveyIds = defaultSectionComparisonSurveyIds();
  applyUrlState();
  bindEvents();
  renderAll();
}

async function loadProjectDataset() {
  if (window.location.protocol === "file:") {
    const inlineData = window.__FSM_PROJECTS__;
    if (inlineData?.projects?.length) {
      return inlineData;
    }
    const embeddedJson = document.getElementById("fsmProjectDataset")?.textContent?.trim();
    if (embeddedJson) {
      try {
        const parsed = JSON.parse(embeddedJson);
        if (parsed?.projects?.length) {
          return parsed;
        }
      } catch (error) {
        throw new Error("The embedded local dataset could not be parsed.");
      }
    }
    throw new Error("This local preview needs the bundled data script. Keep `data/projects.inline.js` beside the app when opening `index.html` directly.");
  }

  const response = await fetch(projectConfig.data.projectsPath);
  if (!response.ok) {
    throw new Error("Project data could not be loaded.");
  }
  return response.json();
}

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const project = currentProject();
  const surveyId = params.get("survey") || params.get("surveyId");
  const defaultSurvey = project.surveys[project.surveys.length - 1];
  const survey = project.surveys.find((item) => item.id === surveyId) || defaultSurvey;
  state.surveyId = survey.id;
  state.primarySurveyId = state.surveyId;
  state.secondarySurveyId = preferredSecondarySurveyId();

  const areaId = normaliseAreaId(params.get("area") || params.get("areaId"));
  const area = areas().find((item) => item.id === areaId) || areas()[0];
  state.areaId = area.id;

  const sectionId = normaliseSectionId(params.get("section") || params.get("sectionId"));
  const section = area.sections.find((item) => item.id === sectionId) || area.sections[0];
  state.sectionId = section.id;

  const requestedTab = params.get("tab") || params.get("view");
  const inferredTab = sectionId ? "sections" : areaId ? "areas" : state.activeTab;
  const tab = VALID_TABS.has(requestedTab) ? requestedTab : inferredTab;
  state.activeTab = (!adminToolsEnabled() || !state.adminMode) && tab === "admin" ? "overview" : tab;
  const overviewMode = params.get("mode");
  if (["information", "survey", "help"].includes(overviewMode)) {
    state.overviewMode = overviewMode;
  }
  state.sectionComparisonSurveyIds = defaultSectionComparisonSurveyIds();
}

function syncUrlState() {
  if (!state.dataset) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  ["tab", "view", "survey", "surveyId", "area", "areaId", "section", "sectionId", "mode"].forEach((key) => {
    params.delete(key);
  });
  params.set("tab", state.activeTab);
  params.set("survey", state.surveyId);
  params.set("area", state.areaId);
  params.set("section", state.sectionId);
  if (state.activeTab === "overview" && state.overviewMode !== "information") {
    params.set("mode", state.overviewMode);
  }

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash || ""}`;
  window.history.replaceState(null, "", nextUrl);
}

function normaliseAreaId(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(?:area|a)?(\d+)$/i);
  if (!match) {
    return text;
  }
  return `area${Number(match[1])}`;
}

function bindEvents() {
  els.surveySelect.addEventListener("change", () => {
    state.surveyId = els.surveySelect.value;
    state.primarySurveyId = state.surveyId;
    state.secondarySurveyId = preferredSecondarySurveyId();
    state.sectionComparisonSurveyIds = mergeSectionComparisonSurveyIds(defaultSectionComparisonSurveyIds(), state.sectionComparisonSurveyIds);
    resetView();
    renderShellStage();
    renderOverview();
    renderWeather();
    renderLayers();
    renderSections();
    renderAdminIfEnabled();
    syncUrlState();
  });

  els.primaryCompareSelect.addEventListener("change", () => {
    state.primarySurveyId = els.primaryCompareSelect.value;
    resetView();
    renderLayers();
  });

  els.secondaryCompareSelect.addEventListener("change", () => {
    state.secondarySurveyId = els.secondaryCompareSelect.value;
    resetView();
    renderLayers();
  });

  els.primaryLayerCompareSelect.addEventListener("change", () => {
    state.primaryLayerKey = els.primaryLayerCompareSelect.value;
    state.layerKey = state.primaryLayerKey;
    resetView();
    renderLayers();
  });

  els.secondaryLayerCompareSelect.addEventListener("change", () => {
    state.secondaryLayerKey = els.secondaryLayerCompareSelect.value;
    resetView();
    renderLayers();
  });

  els.compareModeControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-compare-mode]");
    if (!button || button.disabled) {
      return;
    }
    state.compareMode = button.dataset.compareMode;
    resetView();
    renderLayers();
  });

  els.primaryOpacityRange.addEventListener("input", () => {
    state.primaryOpacity = Number(els.primaryOpacityRange.value) / 100;
    applyViewerOpacities();
  });

  els.secondaryOpacityRange.addEventListener("input", () => {
    state.secondaryOpacity = Number(els.secondaryOpacityRange.value) / 100;
    applyViewerOpacities();
  });

  els.toggleGuideDsm.addEventListener("change", () => {
    state.showGuideDsm = els.toggleGuideDsm.checked;
    renderLayers();
  });

  els.toggleGuideContours.addEventListener("change", () => {
    state.showGuideContours = els.toggleGuideContours.checked;
    renderLayers();
  });

  els.toggleChangeHighlight.addEventListener("change", () => {
    state.showChangeHighlight = els.toggleChangeHighlight.checked;
    if (state.showChangeHighlight) {
      state.compareMode = "single";
      state.secondaryLayerKey = state.primaryLayerKey;
      if (state.primarySurveyId === state.secondarySurveyId) {
        state.secondarySurveyId = preferredSecondarySurveyId();
      }
    }
    renderLayers();
  });

  els.areaSelect.addEventListener("change", () => updateArea(els.areaSelect.value));
  els.overviewInfoBtn.addEventListener("click", () => {
    state.overviewMode = "information";
    state.overviewIndexOpen = false;
    renderOverview();
    syncUrlState();
  });

  els.overviewSurveyBtn.addEventListener("click", () => {
    state.overviewMode = "survey";
    state.overviewIndexOpen = false;
    renderOverview();
    syncUrlState();
  });

  els.overviewHelpBtn.addEventListener("click", () => {
    state.overviewMode = "help";
    state.overviewIndexOpen = false;
    renderOverview();
    syncUrlState();
  });

  els.overviewIndexBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    state.overviewIndexOpen = !state.overviewIndexOpen;
    renderOverview();
  });

  document.addEventListener("click", (event) => {
    if (!state.overviewIndexOpen) return;
    if (els.overviewIndexMenu?.contains(event.target) || els.overviewIndexBtn?.contains(event.target)) return;
    state.overviewIndexOpen = false;
    renderOverview();
  });

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "weather-dashboard-height") return;
    if (!Number.isFinite(event.data.height) || !els.weatherFrame) return;
    const nextHeight = Math.max(980, Math.ceil(event.data.height) + 8);
    if (Math.abs(nextHeight - state.weatherFrameHeight) < 24) return;
    state.weatherFrameHeight = nextHeight;
    els.weatherFrame.style.height = `${nextHeight}px`;
  });

  els.sectionSelect.addEventListener("change", () => {
    state.sectionId = els.sectionSelect.value;
    state.sectionHoverDistance = null;
    renderSections();
    syncUrlState();
  });

  els.sectionOrthoBtn.addEventListener("click", () => {
    state.sectionBasemap = "ortho";
    renderSections();
  });

  els.sectionDsmBtn.addEventListener("click", () => {
    state.sectionBasemap = "dsm";
    renderSections();
  });

  els.viewerFullscreenBtn.addEventListener("click", toggleViewerFullscreen);
  els.sectionFullscreenBtn.addEventListener("click", toggleSectionFullscreen);
  els.sectionDetails.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-section-insight]");
    if (!trigger) {
      return;
    }
    openSectionInsightOverlay(
      trigger.dataset.sectionInsightEyebrow || "Section Insight",
      trigger.dataset.sectionInsightTitle || "Insight",
      trigger.dataset.sectionInsightSummary || "",
      trigger.dataset.sectionInsightBody || ""
    );
  });
  els.sectionInsightOverlayClose.addEventListener("click", closeSectionInsightOverlay);
  els.sectionInsightOverlayBackdrop.addEventListener("click", closeSectionInsightOverlay);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSectionInsightOverlay();
    }
  });
  document.addEventListener("fullscreenchange", () => {
    updateViewerFullscreenButton();
    updateSectionFullscreenButton();
  });

  els.tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    activateTab(tab.dataset.tab);
    if (tab.dataset.tab === "weather") {
      renderWeather();
    }
    updateBackToTopVisibility();
  });

  els.backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

  els.uploadSelectedFiles.addEventListener("click", () => {
    uploadSelectedFiles();
  });

  els.createSurveyBtn.addEventListener("click", () => {
    createSurveyRound();
  });

  els.saveAreaMetadataBtn.addEventListener("click", () => {
    saveAreaMetadata();
  });

  els.resetAreaMetadataBtn.addEventListener("click", () => {
    resetAreaMetadata();
  });

  els.saveVolumeBtn.addEventListener("click", () => {
    saveVolumeChange();
  });

  els.adminModeToggle.addEventListener("click", () => {
    toggleAdminMode();
  });

  els.zoomInBtn.addEventListener("click", () => zoom(1.15));
  els.zoomOutBtn.addEventListener("click", () => zoom(1 / 1.15));
  els.resetViewBtn.addEventListener("click", resetView);

    [els.viewerBaseImage, els.viewerOverlayImage, els.viewerSliderImage].forEach((image) => {
      image.addEventListener("load", applyViewTransform);
    });

    [els.sectionBaseImage, els.sectionOverlayImage].forEach((image) => {
      image.addEventListener("load", () => {
        positionSectionHotspots();
        if (state.sectionArea && state.sectionRows?.length) {
          const section = state.sectionArea.sections.find((item) => item.id === state.sectionId) || state.sectionArea.sections[0];
          updateSectionMapMarker(state.sectionRows, section, state.sectionHoverDistance);
        }
      });
    });

    window.addEventListener("resize", () => {
      positionSectionHotspots();
      if (state.sectionArea && state.sectionRows?.length) {
        const section = state.sectionArea.sections.find((item) => item.id === state.sectionId) || state.sectionArea.sections[0];
        updateSectionMapMarker(state.sectionRows, section, state.sectionHoverDistance);
      }
    });

  els.viewerStage.addEventListener("pointerdown", (event) => {
    if (state.activeTouchGesture) {
      return;
    }
    if (event.target.closest("#transparencyControls")) {
      return;
    }
    state.viewerPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (state.viewerPointers.size === 2) {
      beginViewerPinch();
      event.preventDefault();
      return;
    }
    if (state.compareMode === "slider") {
      const handleRect = els.sliderHandle.getBoundingClientRect();
      const insideHandle = event.clientX >= handleRect.left && event.clientX <= handleRect.right
        && event.clientY >= handleRect.top && event.clientY <= handleRect.bottom;
      if (insideHandle || state.scale <= 1) {
        state.isDraggingSwipe = true;
        state.activeViewerPointerId = event.pointerId;
        event.target.setPointerCapture?.(event.pointerId);
        event.preventDefault();
        updateSwipeFromClientX(event.clientX);
        return;
      }
    }
    if (state.scale <= 1) {
      return;
    }
    state.isPanning = true;
    state.activeViewerPointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startPanX = state.panX;
    state.startPanY = state.panY;
    event.target.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    applyViewTransform();
  });

  els.viewerStage.addEventListener("pointermove", (event) => {
    if (state.activeTouchGesture) {
      return;
    }
    if (state.viewerPointers.has(event.pointerId)) {
      state.viewerPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (state.viewerPointers.size >= 2 && state.pinchStartDistance) {
      updateViewerPinch();
      event.preventDefault();
      return;
    }
    if (state.activeViewerPointerId !== null && event.pointerId !== state.activeViewerPointerId) {
      return;
    }
    if (state.isDraggingSwipe) {
      event.preventDefault();
      updateSwipeFromClientX(event.clientX);
      return;
    }
    if (!state.isPanning) {
      return;
    }
    event.preventDefault();
    state.panX += event.clientX - state.startX;
    state.panY += event.clientY - state.startY;
    state.startX = event.clientX;
    state.startY = event.clientY;
    applyViewTransform();
  });

  const endPointerInteraction = (event) => {
    if (state.activeTouchGesture) {
      return;
    }
    state.viewerPointers.delete(event.pointerId);
    if (state.viewerPointers.size < 2) {
      state.pinchStartDistance = null;
      state.pinchStartCenter = null;
      state.pinchStageCenter = null;
    }
    if (state.activeViewerPointerId !== null && event.pointerId !== state.activeViewerPointerId) {
      return;
    }
    if (els.viewerStage.hasPointerCapture?.(event.pointerId)) {
      els.viewerStage.releasePointerCapture(event.pointerId);
    }
    if (els.sliderHandle.hasPointerCapture?.(event.pointerId)) {
      els.sliderHandle.releasePointerCapture(event.pointerId);
    }
    state.isPanning = false;
    state.isDraggingSwipe = false;
    state.activeViewerPointerId = null;
    applyViewTransform();
  };

  els.viewerStage.addEventListener("pointerup", endPointerInteraction);
  els.viewerStage.addEventListener("pointercancel", endPointerInteraction);
  els.viewerStage.addEventListener("dblclick", resetView);
  els.viewerStage.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom(event.deltaY < 0 ? 1.08 : 1 / 1.08);
  }, { passive: false });

  els.viewerStage.addEventListener("touchstart", handleViewerTouchStart, { passive: false });
  els.viewerStage.addEventListener("touchmove", handleViewerTouchMove, { passive: false });
  els.viewerStage.addEventListener("touchend", handleViewerTouchEnd, { passive: false });
  els.viewerStage.addEventListener("touchcancel", handleViewerTouchEnd, { passive: false });
}

function renderAll() {
  renderShellToolbar();
  fillSelect(els.surveySelect, currentProject().surveys.map((survey) => [survey.id, survey.label]), state.surveyId);
  fillSelect(els.areaSelect, areaSelectOptions(), state.areaId);
  fillSelect(els.sectionSelect, currentArea().sections.map((section) => [section.id, section.label]), state.sectionId);
  syncAdminVisibility();
  renderShellStage();
  renderOverview();
  renderAreas();
  renderWeather();
  renderVolume();
  renderLayers();
  renderSections();
  renderAdminIfEnabled();
  renderWorkflow();
}

function renderShellToolbar() {
  const areaSelectEnabled = AREA_ENABLED_TOOLBAR_TABS.has(state.activeTab);
  const areaField = document.querySelector(".shell-toolbar__field--area");

  els.surveySelect.disabled = false;
  els.surveySelect.setAttribute("aria-disabled", "false");
  els.areaSelect.disabled = !areaSelectEnabled;
  els.areaSelect.setAttribute("aria-disabled", String(!areaSelectEnabled));

  document.querySelector(".shell-toolbar")?.classList.toggle("shell-toolbar--inactive", !areaSelectEnabled);
  areaField?.classList.toggle("hidden", !areaSelectEnabled);
}

async function renderShellStage() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const activeTabMeta = activeTabShellMeta();
  const shellRoot = document.querySelector(".shell");
  const overviewHeroTabs = new Set(["overview", "areas", "weather"]);
  const stageSurvey = overviewHeroTabs.has(state.activeTab) ? latestSurvey(project) : survey;
  const areaHeroEnabled = AREA_ENABLED_TOOLBAR_TABS.has(state.activeTab);
  const configuredAreaHero = configuredAreaHeroImage(survey.id, area.id);
  const useOverviewHero = overviewHeroTabs.has(state.activeTab) || (!configuredAreaHero && areaHeroEnabled);
  const configuredOverviewImage = projectConfig.branding?.overviewHeroImagePath || "";
  const configuredAreaHeroDirection = configuredAreaHeroArtDirection(survey.id, area.id);
  if (shellRoot) {
    shellRoot.dataset.activeTab = state.activeTab;
    shellRoot.dataset.stageVisual = areaHeroEnabled && configuredAreaHero
      ? "area-hero"
      : useOverviewHero
        ? "overview-hero"
        : "none";
    shellRoot.dataset.heroArea = areaHeroEnabled && configuredAreaHero ? area.id : "";
    shellRoot.style.removeProperty("--area-hero-image-position");
    shellRoot.style.removeProperty("--area-hero-image-scale");
    shellRoot.style.removeProperty("--area-hero-backdrop-opacity");
    shellRoot.style.removeProperty("--area-hero-backdrop-blur");
    shellRoot.style.removeProperty("--area-hero-backdrop-scale");
    if (areaHeroEnabled && configuredAreaHero && configuredAreaHeroDirection) {
      if (configuredAreaHeroDirection.position) {
        shellRoot.style.setProperty("--area-hero-image-position", configuredAreaHeroDirection.position);
      }
      if (Number.isFinite(configuredAreaHeroDirection.scale)) {
        shellRoot.style.setProperty("--area-hero-image-scale", String(configuredAreaHeroDirection.scale));
      }
      if (Number.isFinite(configuredAreaHeroDirection.backdropOpacity)) {
        shellRoot.style.setProperty("--area-hero-backdrop-opacity", String(configuredAreaHeroDirection.backdropOpacity));
      }
      if (Number.isFinite(configuredAreaHeroDirection.backdropBlur)) {
        shellRoot.style.setProperty("--area-hero-backdrop-blur", `${configuredAreaHeroDirection.backdropBlur}px`);
      }
      if (Number.isFinite(configuredAreaHeroDirection.backdropScale)) {
        shellRoot.style.setProperty("--area-hero-backdrop-scale", String(configuredAreaHeroDirection.backdropScale));
      }
    }
  }

  els.shellStageEyebrow.textContent = activeTabMeta.eyebrow;
  els.shellStageTitle.textContent = activeTabMeta.title;
  els.shellStageSummary.textContent = activeTabMeta.summary;
  const useSummaryDock = ["volume", "layers", "sections"].includes(state.activeTab) && ["area1", "area3", "area4", "area7", "area8"].includes(area.id);
  if (els.shellStageSummaryDock) {
    els.shellStageSummaryDock.textContent = activeTabMeta.summary;
    els.shellStageSummaryDock.classList.toggle("hidden", !useSummaryDock);
    els.shellStageSummaryDock.setAttribute("aria-hidden", String(!useSummaryDock));
  }
  els.shellStageSummary.classList.toggle("hidden", useSummaryDock);
  els.shellStageSurvey.innerHTML = `
      <span class="shell-stage-pill__label">Survey Dates</span>
      <strong class="shell-stage-pill__value">${escapeHtml(shellStageSurveyLabel(project, stageSurvey, state.activeTab))}</strong>
    `;
  els.shellStageArea.innerHTML = `
    <span class="shell-stage-pill__label">Survey Area</span>
    <strong class="shell-stage-pill__value">${escapeHtml(`${area.overviewCode} - ${area.label}`)}</strong>
    <span class="shell-stage-pill__sub">${escapeHtml(area.zone)}</span>
  `;
  els.shellStageArea.classList.toggle("hidden", !(areaHeroEnabled && configuredAreaHero));

  if (useOverviewHero) {
    els.shellStageVisual.style.removeProperty("--shell-stage-visual-bg");
    const overviewImage = configuredOverviewImage || await resolveExistingAsset(
      surveyAssetCandidates(project.id, survey.id, area.id, "ortho.jpg")
    );
    if (overviewImage) {
      els.shellStageVisualImage.src = overviewImage;
      els.shellStageVisualImage.alt = `${project.name} overview aerial image`;
      els.shellStageVisual.classList.remove("hidden");
      els.shellStageVisual.setAttribute("aria-hidden", "false");
    } else {
      els.shellStageVisual.classList.add("hidden");
      els.shellStageVisual.setAttribute("aria-hidden", "true");
    }
  } else if (areaHeroEnabled && configuredAreaHero) {
    els.shellStageVisual.style.setProperty(
      "--shell-stage-visual-bg",
      `url("${configuredAreaHero.replace(/"/g, '\\"')}")`
    );
    els.shellStageVisualImage.src = configuredAreaHero;
    els.shellStageVisualImage.alt = `${project.name} ${area.label} area model`;
    els.shellStageVisual.classList.remove("hidden");
    els.shellStageVisual.setAttribute("aria-hidden", "false");
  } else {
    els.shellStageVisual.style.removeProperty("--shell-stage-visual-bg");
    els.shellStageVisual.classList.add("hidden");
    els.shellStageVisual.setAttribute("aria-hidden", "true");
  }
}

function configuredAreaHeroImage(surveyId, areaId) {
  return projectConfig.branding?.areaHeroImagesBySurvey?.[surveyId]?.[areaId] || "";
}

function configuredAreaHeroArtDirection(surveyId, areaId) {
  return projectConfig.branding?.areaHeroArtDirectionBySurvey?.[surveyId]?.[areaId] || null;
}

function activeTabShellMeta() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const section = currentArea().sections.find((item) => item.id === state.sectionId) || currentArea().sections[0];

  const metaByTab = {
    overview: {
      eyebrow: "FutureScaping Labs",
      title: "Monitoring System",
      summary: "Visual change monitoring for coastal landscapes."
    },
    areas: {
      eyebrow: "Monitoring Areas",
      title: "Explore Areas",
      summary: `Move through ${area.label} and jump into imagery, section profiles, and tracked change from one monitoring area at a time.`
    },
    weather: {
      eyebrow: "Environmental Context",
      title: "Survey Conditions",
      summary: "Weather, tide, and timing context help explain what the landscape was doing when this survey round was captured."
    },
    volume: {
      eyebrow: "Change Reporting",
      title: "Change Metrics",
      summary: "Quantified change sits beside the imagery so clients can move quickly from visible change to measured change."
    },
    layers: {
      eyebrow: "Image Comparison",
      title: "Compare Change",
      summary: "Switch survey dates, compare layers, and inspect visible landscape change in the main viewing stage."
    },
    sections: {
      eyebrow: "Section Profiles",
      title: "Section Profiles",
      summary: `Follow ${section.label} through ${area.label} to inspect repeatable profile readings along the same fixed line through time.`
    },
    admin: {
      eyebrow: "Internal Tools",
      title: "Admin Tools",
      summary: "Internal upload, intake, and survey management tools for preparing monitoring data behind the client-facing experience."
    }
  };

  return metaByTab[state.activeTab] || metaByTab.overview;
}

function shellStageSurveyLabel(project, survey, activeTab = state.activeTab) {
  if (["overview", "areas", "weather"].includes(activeTab)) {
    return formatOverviewSurveyDate(survey);
  }
  if (AREA_ENABLED_TOOLBAR_TABS.has(activeTab)) {
    return survey.shortDate || survey.label;
  }
  const comparisonSurvey = activeComparisonSurvey(project, survey);
  if (!comparisonSurvey) {
    return survey.shortDate || survey.label;
  }
  return `${comparisonSurvey.shortDate || comparisonSurvey.label} vs ${survey.shortDate || survey.label}`;
}

function formatOverviewSurveyDate(survey) {
  const start = String(survey?.dateFrom || "").trim();
  const end = String(survey?.dateTo || "").trim();
  if (!start) {
    return survey?.shortDate || survey?.label || "";
  }
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = end ? new Date(`${end}T12:00:00`) : null;
  if (Number.isNaN(startDate.getTime())) {
    return survey?.shortDate || survey?.label || "";
  }
  const month = startDate.toLocaleString("en-GB", { month: "long" });
  const year = startDate.getFullYear();
  const startDay = startDate.getDate();
  const endDay = endDate && !Number.isNaN(endDate.getTime()) ? endDate.getDate() : null;
  if (endDay && endDay !== startDay) {
    return `${startDay}-${endDay} ${month} ${year}`;
  }
  return `${startDay} ${month} ${year}`;
}

function latestSurvey(project = currentProject()) {
  return [...(project?.surveys || [])]
    .sort((left, right) => String(left.dateFrom || "").localeCompare(String(right.dateFrom || "")))
    .at(-1) || project?.surveys?.[0];
}

async function renderOverview() {
  const project = currentProject();
  const survey = currentSurvey();
  const overviewMode = getOverviewModePayload(project);
  els.projectTitle.textContent = project.name;
  els.projectSummary.textContent = project.description;
  els.overviewHeroTitle.textContent = overviewMode.heroTitle;
  els.overviewHeroText.textContent = overviewMode.heroText;
  els.overviewStoryTitle.textContent = overviewMode.storyTitle;
  els.overviewContentsTitle.textContent = "Contents";
  els.overviewContentsLead.textContent = overviewMode.contentsSubtext;
  els.overviewContentsSubtext.textContent = overviewMode.contentsSubtext;
  els.overviewInfoBtn.classList.toggle("active", state.overviewMode === "information");
  els.overviewSurveyBtn.classList.toggle("active", state.overviewMode === "survey");
  els.overviewHelpBtn.classList.toggle("active", state.overviewMode === "help");
  els.overviewIndexBtn.classList.toggle("active", state.overviewIndexOpen);
  els.overviewIndexBtn.setAttribute("aria-expanded", state.overviewIndexOpen ? "true" : "false");
  els.overviewIndexMenu.classList.toggle("hidden", !state.overviewIndexOpen);
  els.overviewIndexMenu.setAttribute("aria-hidden", state.overviewIndexOpen ? "false" : "true");

  els.metricGrid.innerHTML = overviewMode.glance.map(([label, value]) => metric(label, value, "")).join("");

  els.overviewContentsGrid.innerHTML = overviewMode.story.map((item, index) => `
    <button class="overview-index-item" type="button" data-story-target="${escapeHtml(item.id || `section-${index + 1}`)}">
      <span class="overview-index-item__number">Section ${String(index + 1).padStart(2, "0")}</span>
      <span class="overview-index-item__title">${escapeHtml(item.title)}</span>
    </button>
  `).join("");
  els.overviewContentsGrid.querySelectorAll("[data-story-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.storyTarget;
      state.overviewIndexOpen = false;
      renderOverview();
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  if (els.overviewGlanceGrid) {
    els.overviewGlanceGrid.innerHTML = overviewMode.glance.map(([label, value]) => `
      <article class="card overview-glance-card">
        <p class="muted">${escapeHtml(label)}</p>
        <h3>${escapeHtml(value)}</h3>
      </article>
    `).join("");
  }

  els.overviewStory.innerHTML = overviewMode.story.map((item, index) => `
    <article id="${escapeHtml(item.id || `section-${index + 1}`)}" class="card overview-story-card">
      <p class="eyebrow">Section ${String(index + 1).padStart(2, "0")}</p>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </article>
  `).join("");

  els.overviewAreasSubtext.textContent = `The monitoring programme currently covers ${areas().length} mapped areas across ${project.site.name}.`;
  const overviewAreas = areas();
  els.overviewAreaFilters.innerHTML = [
    `<button class="chip ${state.overviewAreaFilter === "all" ? "active" : ""}" type="button" data-overview-filter="all">All areas</button>`,
    `<button class="chip ${state.overviewAreaFilter === "day1" ? "active" : ""}" type="button" data-overview-filter="day1">Day 1</button>`,
    `<button class="chip ${state.overviewAreaFilter === "day2" ? "active" : ""}" type="button" data-overview-filter="day2">Day 2</button>`,
    `<button class="chip ${state.overviewAreaFilter === "lowtide" ? "active" : ""}" type="button" data-overview-filter="lowtide">Closest to low tide</button>`,
    ...overviewAreas.map((area, index) => `<button class="chip ${state.overviewAreaFilter === area.id ? "active" : ""}" type="button" data-overview-filter="${escapeHtml(area.id)}">A${index + 1}</button>`)
  ].join("");
  els.overviewAreaFilters.querySelectorAll("[data-overview-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.overviewAreaFilter = button.dataset.overviewFilter;
      renderOverview();
    });
  });

  let filteredOverviewAreas = overviewAreas;
  if (state.overviewAreaFilter === "day1" || state.overviewAreaFilter === "day2") {
    filteredOverviewAreas = overviewAreas.filter((area) => area.filterKey === state.overviewAreaFilter);
  } else if (state.overviewAreaFilter === "lowtide") {
    filteredOverviewAreas = [...overviewAreas].sort((a, b) => Math.abs(a.midOffsetMinutes) - Math.abs(b.midOffsetMinutes));
  } else if (state.overviewAreaFilter !== "all") {
    filteredOverviewAreas = overviewAreas.filter((area) => area.id === state.overviewAreaFilter);
  }

  els.overviewAreaGrid.innerHTML = filteredOverviewAreas.map((area, index) => `
    <article class="card overview-area-card overview-area-card--${area.statusTone || overviewAreaTone(area.id, index)}">
      <div class="overview-area-card__top">
        <div>
          <p class="eyebrow">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.day)}</p>
          <h3>${escapeHtml(area.label)}</h3>
        </div>
        <span class="overview-area-pill overview-area-pill--${escapeHtml(area.statusTone || "cyan")}">${escapeHtml(area.statusLabel)}</span>
      </div>
      <p class="overview-area-card__summary">${escapeHtml(area.summary)}</p>
      <div class="overview-area-card__stats">
        <div><span class="muted">Flight window</span><strong>${escapeHtml(area.start)}-${escapeHtml(area.finish)}</strong></div>
        <div><span class="muted">Area size</span><strong>${escapeHtml(area.size)}</strong></div>
        <div><span class="muted">Low tide relationship</span><strong>${escapeHtml(area.launchOffset)}</strong></div>
        <div><span class="muted">Tidal window</span><strong>${escapeHtml(area.tideWindow)}</strong></div>
      </div>
      <div class="overview-area-timeline">
        <div class="overview-area-timeline__labels">
          <span>Earlier</span>
          <span>Low tide</span>
          <span>Later</span>
        </div>
        <div class="overview-area-timeline__track">
          <div class="overview-area-timeline__marker" style="left:${timelineMarkerPosition(area.midOffsetMinutes)}%"></div>
        </div>
        <p class="overview-area-timeline__caption">Marker based on mid-flight position in relation to the low-tide window.</p>
      </div>
      <div class="overview-area-tags">
        ${area.tags.map((tag) => `<span class="overview-tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="overview-area-card__footer">
        <span>${escapeHtml(area.cardNote)}</span>
        <button class="overview-area-link" type="button" data-overview-area="${escapeHtml(area.id)}">Open details and compare rounds</button>
      </div>
    </article>
  `).join("");
  els.overviewAreaGrid.querySelectorAll("[data-overview-area]").forEach((button) => {
    button.addEventListener("click", () => {
      updateArea(button.dataset.overviewArea);
      activateTab("areas");
      requestAnimationFrame(() => {
        els.selectedAreaPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  els.surveyReadinessGrid.innerHTML = [
    metric("Track movement", "See where bars and channels shift", "Look for visible movement between one survey and the next."),
    metric("Work by area", "Focus on one stretch of estuary at a time", "Each monitoring area can be explored on its own without losing the bigger picture."),
    metric("Use cross-sections", "Check where the ground rises and falls", "Cross-sections show the shape of the estuary along a fixed line."),
    metric("Use aerial views", "Inspect the estuary closely", "Zoom in on aerial imagery, elevation colour maps, and contour views.")
  ].join("");

  els.surveyReadinessDetails.innerHTML = [
    detail("What to look for", "Focus on where sandbanks, channels, and exposed ground appear to shift between one survey and the next."),
    detail("Why low tide matters", "The surveys are most useful when more of the estuary bed is exposed, because that is where movement is easiest to see."),
    detail("How this helps", "This gives a clearer picture of what is changing, where access may be affected, and where further attention may be needed.")
  ].join("");

  els.timeline.innerHTML = [
    `<div class="timeline-item"><div><strong>1.</strong></div><div>Start with <strong>Survey Areas</strong> and choose the part of the estuary you want to look at.</div></div>`,
    `<div class="timeline-item"><div><strong>2.</strong></div><div>Open <strong>Compare</strong> to inspect aerial imagery, elevation colour maps, contour views, and visual comparisons in detail.</div></div>`,
    `<div class="timeline-item"><div><strong>3.</strong></div><div>Use <strong>Sections</strong> when you want to understand the height and shape of the ground along a fixed line.</div></div>`,
    `<div class="timeline-item"><div><strong>4.</strong></div><div>Use <strong>Information</strong> and <strong>Help</strong> whenever you want the project story or a plain-English guide.</div></div>`
  ].join("");
}

const INFORMATION_STORY = [
  {
    id: "about",
    title: "About the Project",
    paragraphs: [
      "The Padstow Estuary Monitoring Project is a structured drone survey programme commissioned by Padstow Harbour Commission and delivered by FutureScaping.",
      "Its purpose is to monitor how the estuary changes over time, with particular focus on the movement of sandbanks, sandbars, and exposed intertidal sediment. By repeating surveys across the year, the project builds a clearer picture of where material is shifting, how quickly those changes are happening, and how the shape of the estuary is evolving.",
      "This is not a one-off snapshot. It is designed as an ongoing monitoring programme, beginning with 14 surveys across a year, so that patterns can be tracked through time rather than guessed from isolated observations."
    ]
  },
  {
    id: "why",
    title: "Why the Estuary is Being Monitored",
    paragraphs: [
      "Padstow's estuary is a dynamic environment. Channels shift, sandbanks move, and the navigable routes into the harbour can change over time.",
      "One of the main practical drivers is navigation. The harbour needs to remain accessible for the fishing community, tourism, commercial activity, and general harbour use. Sediment movement affects where channels remain open and where dredging may be needed.",
      "The project is intended to help Padstow Harbour Commission understand where sandbars and sandbanks are moving, how quickly those changes are taking place, which areas appear more stable, and where dredging effort may need to be focused.",
      "There is also an environmental benefit to better monitoring. If dredging can be guided by clearer evidence, it may help reduce unnecessary work and minimise avoidable disturbance within the estuary."
    ]
  },
  {
    id: "process",
    title: "How the Survey Process Works",
    paragraphs: [
      "The project uses drone photogrammetry to capture large numbers of overlapping aerial photographs across the estuary during low tide.",
      "Those photographs are then processed to create outputs such as high-resolution aerial imagery, 3D surface models, elevation-based visualisations, and comparison material that can be reviewed over time.",
      "By repeating this process on a regular basis, it becomes possible to compare one survey against another and identify areas of movement, stability, erosion, accretion, and change."
    ]
  },
  {
    id: "tide",
    title: "Why Low Tide Matters",
    paragraphs: [
      "The project depends on surveying the estuary at low tide, because that is when the sandbanks, bars, and intertidal surfaces are most exposed.",
      "At first, it seemed likely that the estuary could be covered within a single workable tide window. In reality, the first survey showed that the usable period is much tighter than it appears on paper once travel time, battery changes, launch positions, weather, and access are all factored in.",
      "Although the project has generally worked around a period of roughly two to two and a half hours either side of low tide, the practical window for the best results can be much narrower depending on conditions and survey logistics."
    ]
  },
  {
    id: "planning",
    title: "Planning the Survey Programme",
    paragraphs: [
      "A lot of work went into testing the survey method before the first full scan was carried out.",
      "This included trialling different side overlap settings, different flight heights, different flight speeds, and different assumptions about how the estuary could be divided into workable survey areas.",
      "One of the key balances was between capture quality and survey efficiency. Higher side overlap means more flight lines, more passes, more time in the air, and a longer overall survey.",
      "The first practical testing phase was crucial because it showed that the technical method would work, but it also revealed that real-world logistics across the estuary would be a much bigger challenge than first expected."
    ]
  },
  {
    id: "evolved",
    title: "How the Workflow Evolved",
    paragraphs: [
      "The original survey concept was simpler than the final version used on site.",
      "At the start, the estuary had been divided into four larger areas. Once test flights and site experience were brought into the process, it became clear that this layout was not realistic.",
      "The estuary is wide in places, and some areas cannot be surveyed properly from a single position while maintaining safe and compliant drone operations. This led to the survey structure being broken down into eight areas instead of four, particularly where wider sections needed to be split to preserve visual line of sight.",
      "The project scope also extended further up the estuary, which added further operational complexity but gave a more complete picture of wider sediment movement."
    ]
  },
  {
    id: "challenges",
    title: "Operational Challenges on Site",
    paragraphs: [
      "The first full survey showed very clearly that the estuary is much harder to cover in reality than it appears on a map.",
      "One of the biggest operational challenges was simply moving between areas. Every relocation between launch points took longer than expected, whether by car, bike, or on foot. Battery changes, setup time, and access delays all added pressure.",
      "The survey became a constant balance between catching the tide at the right stage, reaching the next launch point in time, maintaining safe operations, and trying to maximise useful flying time before conditions changed again.",
      "The upper estuary also brought different access issues from the lower sections, and some routes that looked straightforward on a map proved awkward, soft, or time-consuming on the ground."
    ]
  },
  {
    id: "photogrammetry",
    title: "How Photogrammetry Works",
    paragraphs: [
      "Photogrammetry is the process of building accurate mapped outputs from large numbers of overlapping photographs.",
      "As the drone flies its survey pattern, it captures images with enough overlap for software to identify common visual points between them. Those shared points are then used to tie the imagery together into larger mapped surfaces and 3D reconstructions.",
      "This works particularly well where the ground has visible texture, stable detail, and enough consistent surface information for the software to recognise."
    ]
  },
  {
    id: "water",
    title: "Why Open Water Is Difficult",
    paragraphs: [
      "One of the most important practical lessons from the first survey was the difference between exposed land and open water.",
      "Photogrammetry relies on matching stable visual features from one image to the next. Water does not behave like that. It is constantly moving, reflecting light differently, and often presenting very little fixed detail for software to recognise.",
      "As a result, open water areas can produce unreliable reconstruction if treated the same way as land. That is a normal limitation of photogrammetry in environments that include moving water.",
      "For this monitoring programme, that limitation is manageable because the most important outputs come from the exposed intertidal ground and sediment visible around low tide."
    ]
  },
  {
    id: "limits",
    title: "Understanding the Limits of the Data",
    paragraphs: [
      "Like any monitoring method, drone photogrammetry has strengths and limitations.",
      "The outputs are strongest where the survey surface is exposed, textured, stable, and clearly visible during low tide. The limitations become more obvious around moving water, water edges, reflective surfaces, and areas where the software cannot find stable visual reference points.",
      "The project is not about claiming that every part of the estuary can be modelled equally well. It is about using the method intelligently to extract the most meaningful information from the areas where it is strongest."
    ]
  },
  {
    id: "contours",
    title: "Why Some Contours and Elevation Outputs Are Filtered",
    paragraphs: [
      "Where moving water is included in the captured imagery, the resulting height calculations can become highly unstable.",
      "This can lead to false spikes or false depressions in the data, sometimes producing clearly unrealistic values that do not represent the true surface of the estuary. Because of that, some contour and elevation outputs have been filtered or clipped so that misleading artefacts do not dominate the final maps.",
      "This is not about hiding data. It is about presenting terrain information in a way that is useful and honest, rather than allowing false artefacts to overwhelm the outputs."
    ]
  },
  {
    id: "models",
    title: "Why Some 3D Models Are Simplified",
    paragraphs: [
      "The original photogrammetry models are extremely large and detailed. While that is excellent for analysis, it is not always suitable for a smooth online viewing experience.",
      "To make the project accessible through 3DVista, the models included within the tour have been reduced and simplified so that they load more reliably and perform better across devices.",
      "This is a practical trade-off between detail and usability. The lighter models remain useful for interpretation and storytelling, while more detailed versions are available when closer inspection is needed."
    ]
  },
  {
    id: "nira",
    title: "Why a High-Resolution Model Also Exists",
    paragraphs: [
      "Alongside the lighter 3DVista models, a separate high-resolution model is available through Nira.",
      "This version preserves far more of the original detail and is better suited to close inspection, detailed viewing, and more intensive exploration.",
      "In simple terms, 3DVista is used for accessible, smooth, client-friendly viewing, while Nira provides a higher-detail companion model for more in-depth inspection."
    ]
  }
];

const HELP_STORY = [
  {
    id: "quick-start",
    title: "Quick Start",
    paragraphs: [
      "If this is your first time using the project, start with Overview so you can understand the survey round, the monitored areas, and the main purpose of the work.",
      "Then use Survey Areas to move into one part of the estuary, Compare to inspect imagery and change, Sections to read fixed profile lines, and Volume Change when measured sandbar results are available.",
      "Open Information for the stable project story, Survey Notes for round-specific lessons from the field, and Help whenever you need guidance."
    ]
  },
  {
    id: "main-menu",
    title: "Main Menu Guide",
    paragraphs: [
      "Overview is the main starting point for the project. It gives you the broad survey picture, the current round, and the context for the monitoring work.",
      "Survey Areas lets you move into one monitored location at a time. Weather shows tide and weather context for the selected survey round.",
      "Compare, Sections, and Volume Change are the main interpretation tools. Information explains the wider project background, Survey Notes captures what was learned in each round, and Help explains how to use the system."
    ]
  },
  {
    id: "areas",
    title: "Areas",
    paragraphs: [
      "The Areas menu lets you jump directly into a monitored part of the estuary.",
      "Current areas include A1 Hawker's Cove, A2 Daymer Bay, A3 Rock Beach, A4 Padstow Harbour, A5 Porthilly Cove, A6 Old Town Cove, A7 Slate Quarry, and A8 Wadebridge.",
      "Use Areas when you want to focus on one location and use the detailed area tools."
    ]
  },
  {
    id: "area-tools",
    title: "Area Tools Guide",
    paragraphs: [
      "When you open an area, the main tools each answer a slightly different question.",
      "Compare is best for visual before-and-after work using aerial imagery, colour elevation, contours, overlay, swipe, and highlight change. Sections is best for following one fixed line and seeing how ground height changes along it between survey rounds.",
      "Volume Change is the place for measured sandbar gain and loss once those results have been prepared. It is normal to move between these tools when trying to understand one part of the estuary properly."
    ]
  },
  {
    id: "sections",
    title: "How to Use Sections",
    paragraphs: [
      "Open the Sections tab inside an area to view fixed section lines and their profile graphs.",
      "Choose Section 1, 2, or 3, view where that line runs across the map, and then move across the chart to follow the same point on the section line. You can also tick more than one survey profile to compare the same fixed line between rounds.",
      "Use Sections when you want a measured cross-section through the estuary surface rather than a broad visual overview."
    ]
  },
  {
    id: "compare",
    title: "How to Use Compare and Highlight Change",
    paragraphs: [
      "Use Compare when you want to place two survey rounds or two view types side by side in a single workspace.",
      "Single View is the cleanest starting point. Overlay and Swipe are useful when you want to inspect one shoreline, sand edge, or channel boundary closely. Highlight Change is a guided view that helps draw attention to likely movement between the two rounds.",
      "Use these tools when you want to focus on what has shifted or changed rather than just viewing one survey on its own."
    ]
  },
  {
    id: "volume-change",
    title: "How to Use Volume Change",
    paragraphs: [
      "Volume Change is designed to explain how much sand or sediment appears to have been added, removed, or left in overall balance within a monitored sandbar area.",
      "It is best treated as a measured reporting tool rather than a general browsing view. The preview maps show where the monitored zone sits, while the figures explain the amount of material change in plain-English terms.",
      "As more areas are processed, this section will become the clearest place to understand sandbar build-up, loss, and longer-term movement between survey rounds."
    ]
  },
  {
    id: "mobile",
    title: "How to Navigate on Phone",
    paragraphs: [
      "On mobile, use the menu button to open the main navigation.",
      "Once inside an area, use the lower navigation bar to switch between the available tools such as Compare, Sections, and Volume Change.",
      "If the screen feels crowded, close the main menu before exploring and focus on one tool at a time."
    ]
  },
  {
    id: "important-notes",
    title: "Important Things to Understand",
    paragraphs: [
      "Open water is not captured as reliably as exposed land or sand, so some outputs may be simplified or filtered where water creates misleading results.",
      "Some models are lighter simplified versions to keep the project smooth and responsive, while the higher-resolution model is available when more detail is needed.",
      "Different tools answer different questions, so it is normal for one view to be better suited to one task than another."
    ]
  },
  {
    id: "common-questions",
    title: "Common Questions and Answers",
    paragraphs: [
      "Where should I start? Start with Overview if you are new to the project.",
      "How do I look at a specific part of the estuary? Open Survey Areas and choose the area you want.",
      "How do I see a cross-section through the ground? Open an area and choose Sections.",
      "How do I compare two views? Open Compare and then choose Single View, Overlay, Swipe, or Highlight Change.",
      "How do I understand sandbar gain or loss? Open Volume Change when a measured comparison has been prepared.",
      "Where do I learn about the project itself? Open Information for the stable story or Survey Notes for round-specific learning."
    ]
  }
];

const SURVEY_SPECIFIC_OVERVIEW = {
  "2026-03-22": {
    heroTitle: "What the first full scan taught us",
    heroText: "This survey-specific view turns the baseline scan into a lessons-learned record. It keeps the general project story separate from what the team actually discovered while running the first full estuary survey.",
    storyTitle: "Survey Round 1 Learnings",
    contentsSubtext: "Use this view to track what worked, what slowed the team down, and what changed in the field approach afterwards.",
    glance: [
      ["Survey window", "22-23 Mar 2026"],
      ["What it proved", "Full-estuary coverage was workable"],
      ["Main friction", "Access and timing took longer than expected"],
      ["Key learning", "Route planning had to follow the tide more tightly"],
      ["Best outcome", "Repeatable outputs across all 8 areas"],
      ["What changed next", "The April repeat used a much smarter route"]
    ],
    story: [
      {
        id: "round1-purpose",
        title: "What Survey Round 1 Proved",
        paragraphs: [
          "The first full scan showed that the estuary could be surveyed as one joined-up monitoring programme rather than a set of disconnected experiments.",
          "It also proved that the outputs were worth chasing. The imagery, sections, and repeat-survey comparisons all had real value once the areas had been processed and lined up properly."
        ]
      },
      {
        id: "round1-what-worked",
        title: "What Worked Well",
        paragraphs: [
          "The baseline round captured all eight monitored areas and created a proper starting point for repeat survey work.",
          "It also highlighted which areas were strongest near low tide, which areas held water for longer, and where the sandbars and exposed surfaces were most useful for future change tracking."
        ]
      },
      {
        id: "round1-what-did-not",
        title: "What Did Not Work So Well",
        paragraphs: [
          "The first full scan took longer on the ground than expected. Access, parking, walking time, and moving between both sides of the estuary all had a bigger effect on the day than the desk planning suggested.",
          "That meant some areas drifted away from their ideal tide windows, even though the technical flying itself was successful."
        ]
      },
      {
        id: "round1-lessons",
        title: "What We Learned From The First Scan",
        paragraphs: [
          "The biggest lesson was that route planning matters just as much as the flying settings. Tide timing, launch points, travel time, and safe access all needed to be treated as part of the survey method, not as side details.",
          "That baseline experience is what shaped the much more deliberate April repeat route."
        ]
      },
      {
        id: "round1-next-time",
        title: "What Could Be Improved Next Time",
        paragraphs: [
          "Future rounds needed cleaner day planning, better grouping of nearby areas, and a more tactical approach to when each side of the estuary should be surveyed.",
          "That is exactly what Survey Round 2 started testing."
        ]
      }
    ]
  },
  "2026-04-18": {
    heroTitle: "What Survey Round 2 improved in the field",
    heroText: "This survey-specific view captures what the April repeat taught us. The permanent project story stays the same, but this round shows how the team refined access, route planning, and tide timing after learning from the first full scan.",
    storyTitle: "Survey Round 2 Learnings",
    contentsSubtext: "Use this view to see what went more smoothly, which tide windows were strongest, and how the route would be changed again for the next survey.",
    glance: [
      ["Survey window", "18-19 Apr 2026"],
      ["Day 1 focus", "Wadebridge down towards Padstow"],
      ["Day 2 focus", "Outer estuary, ferry crossing, and Rock side"],
      ["Best low-water blocks", "Area 4 Day 1 and Area 3 Day 2"],
      ["Main issue", "Outer areas still drifted later than ideal"],
      ["Next change", "Split future days more clearly by estuary side"]
    ],
    story: [
      {
        id: "round2-overview",
        title: "What Survey Round 2 Was Trying To Improve",
        paragraphs: [
          "Survey Round 2 built directly on the first full scan. By April, the team already understood more about where to park, where to launch from, which parts of the estuary emptied first, and how long the travel links between areas really took.",
          "The aim was not just to repeat March, but to improve the tide timing and make better use of the estuary-side access patterns that had become clearer after the baseline round."
        ]
      },
      {
        id: "round2-day1",
        title: "Day 1 Worked Well Down The Estuary",
        paragraphs: [
          "Day 1 started early at the Wadebridge end, which worked well because the water had already started draining and the sandbars were becoming visible. That let the team move through Areas 8 and 7 at a reasonable speed and get back to Area 4 close to low tide, which was one of the key goals for the day.",
          "By the time the team reached Area 6, the water was still low enough to walk onto the central sandbar. That would have been impossible, or at least far less practical, during the first scan, so it was a clear sign that the repeat route and timing were already improving."
        ]
      },
      {
        id: "round2-day2",
        title: "Day 2 Was More Experimental",
        paragraphs: [
          "Day 2 tested a different movement pattern because the team needed to work across both sides of the estuary. The route still used driving, but also brought in the ferry crossing, which helped connect Hawker's Cove, Rock Beach, and the lower-estuary areas in a more flexible way.",
          "Area 1 was still surveyed well before low tide because the water remained high for longer than hoped, even after waiting around to expose more of the Gimbob area. Rock Beach then worked better once the ferry crossing was used, and Porthilly Cove improved again because access from the small church avoided the worst of the squelchy mud."
        ]
      },
      {
        id: "round2-what-worked",
        title: "What Worked Better Than The First Scan",
        paragraphs: [
          "The second round was smoother because the team was no longer guessing the route. The practical knowledge from the first survey made the driving, stopping, launch planning, and area grouping much more efficient.",
          "Area 4 on Day 1 and Area 3 on Day 2 were especially strong because they sat much closer to low water and gave cleaner exposed-ground comparison windows."
        ]
      },
      {
        id: "round2-what-did-not",
        title: "What Still Did Not Land Perfectly",
        paragraphs: [
          "The outer areas were still the hardest to line up perfectly with low tide. Daymer Bay ended up later than ideal, and by that point the water had already pushed back in enough to make the repeat window less useful than hoped.",
          "Area 1 also stayed higher in the tide cycle than would be ideal for maximum exposure, which means some features would still be worth revisiting later in the tide if future logistics allow it."
        ]
      },
      {
        id: "round2-next-time",
        title: "How The Route Would Change Next Time",
        paragraphs: [
          "Looking back, the next repeat survey would probably split the estuary days more deliberately. One day would start at Daymer Bay, then move through Rock Beach and the ferry crossing, and then catch the Wadebridge / Camel Trail side later because Area 8 appears to stay exposed for longer.",
          "The other day would begin on the Padstow side, aim to hit Area 4 shortly before low tide, and then work upriver through Areas 7 and 6 while the water is still well out. That should give a cleaner match between access logic and the tide window for each side of the estuary."
        ]
      }
    ]
  }
};

const OVERVIEW_GLANCE_BY_SURVEY = {
  "2026-03-22": [
    ["High tide reference", "08:22 Day 1 - 7.45 m | 07:54 Day 2 - 7.35 m"],
    ["Total mapped area", "7.25 km2"],
    ["Survey dates", "22-23 March 2026"],
    ["Low tide reference", "13:47 Day 1 - 0.53 m | 14:23 Day 2 - 0.95 m"],
    ["Images captured", "6,210 photos"],
    ["Air time overall", "338.86 minutes"]
  ],
  "2026-04-18": [
    ["High tide reference", "06:55 Day 1 - 7.53 m | 07:39 Day 2 - 7.53 m"],
    ["Total mapped area", "7.25 km2"],
    ["Survey dates", "18-19 April 2026"],
    ["Low tide reference", "12:56 Day 1 - -0.15 m | 13:35 Day 2 - -0.09 m"],
    ["Images captured", "6,102 photos"],
    ["Air time overall", "320.80 minutes"]
  ]
};

function overviewGlanceForSurvey(surveyId) {
  return OVERVIEW_GLANCE_BY_SURVEY[surveyId] || OVERVIEW_GLANCE_BY_SURVEY["2026-03-22"];
}

function getOverviewModePayload(project) {
  const informationPayload = {
    heroTitle: "Understanding how the Padstow Estuary changes over time",
    heroText: "This information page explains what the project is, why it is being carried out, how the surveys were undertaken, and what limits or practical realities shape the outputs.",
    storyTitle: "Project Information",
    contentsSubtext: "Use this index to move through the project story, survey method, operational context, and data limitations.",
    contents: INFORMATION_STORY.map((section) => ({
      title: section.title,
      summary: section.paragraphs[0]
    })),
    glance: overviewGlanceForSurvey(state.surveyId),
    story: INFORMATION_STORY
  };

  const helpPayload = {
    heroTitle: "How to move around the monitoring system confidently",
    heroText: "This help page explains where to start, what each menu section does, how the area tools work, what each view shows, and the most common questions people are likely to have when using the project.",
    storyTitle: "Project Help",
    contentsSubtext: "Use this index to move through the navigation guide, area tools, quick-start advice, and common questions.",
    contents: HELP_STORY.map((section) => ({
      title: section.title,
      summary: section.paragraphs[0]
    })),
    glance: overviewGlanceForSurvey(state.surveyId),
    story: HELP_STORY
  };

  const surveySpecificPayload = SURVEY_SPECIFIC_OVERVIEW[state.surveyId] || {
    heroTitle: `${currentSurvey().label} field notes`,
    heroText: "This survey-specific view is ready for round-by-round field notes, lessons learned, and route changes as the programme develops.",
    storyTitle: "Survey Notes",
    contentsSubtext: "Use this space to capture what worked, what did not, and how the survey method changed from one round to the next.",
    glance: [
      ["Survey window", currentSurvey().shortDate],
      ["Status", currentSurvey().status || "Survey loaded"],
      ["Readiness", currentSurvey().readiness || "Assets linked"],
      ["Focus", "Survey-specific notes pending"],
      ["What worked", "To be added"],
      ["Next change", "To be added"]
    ],
    story: [
      {
        id: "survey-notes-pending",
        title: "Survey-Specific Notes Are Ready To Fill In",
        paragraphs: [
          "This round now has a place for field notes, lessons learned, and route planning decisions without overwriting the permanent project information.",
          "As more survey rounds are completed, this tab can grow into a proper round-by-round operational log."
        ]
        }
      ]
    };

  surveySpecificPayload.glance = overviewGlanceForSurvey(state.surveyId);
  
  if (state.overviewMode === "help") {
    return helpPayload;
  }
  if (state.overviewMode === "survey") {
    return surveySpecificPayload;
  }
  return informationPayload;
}

function surveyShortLabel() {
  return currentSurvey().shortDate;
}

function overviewAreaTone(areaId, index) {
  const tones = ["cyan", "amber", "green", "rose"];
  const match = String(areaId).match(/(\d+)/);
  const number = match ? Number(match[1]) - 1 : index;
  return tones[((number % tones.length) + tones.length) % tones.length];
}

function timelineMarkerPosition(offsetMinutes) {
  const min = -180;
  const max = 180;
  const clamped = Math.max(min, Math.min(max, offsetMinutes || 0));
  return ((clamped - min) / (max - min)) * 100;
}

function midOffsetLabel(offsetMinutes) {
  const value = Number(offsetMinutes || 0);
  if (value === 0) return "At low tide";
  return `${Math.abs(value)} mins ${value < 0 ? "before" : "after"} low tide`;
}

function updateBackToTopVisibility() {
  const activePanel = document.querySelector(".tab-panel.active")?.dataset.panel;
  const shouldShow = activePanel === "overview" && window.scrollY > 480;
  els.backToTopBtn?.classList.toggle("hidden", !shouldShow);
}

function selectedDetailRow(label, value) {
  return `<div class="selected-detail-item"><span class="selected-detail-key">${escapeHtml(label)}</span><span class="selected-detail-value">${escapeHtml(value)}</span></div>`;
}

function surveyComparisonDetailRow(label, leftValue, rightValue) {
  return `
    <div class="survey-compare-row">
      <span class="survey-compare-row__label">${escapeHtml(label)}</span>
      <span class="survey-compare-row__value">${escapeHtml(leftValue)}</span>
      <span class="survey-compare-row__value">${escapeHtml(rightValue)}</span>
    </div>
  `;
}

function surveyComparisonMarkup(areaId) {
  const project = currentProject();
  const activeSurvey = currentSurvey();
  const comparisonSurvey = activeComparisonSurvey(project, activeSurvey)
    || project.surveys.find((survey) => survey.id !== activeSurvey.id)
    || activeSurvey;
  const activeArea = effectiveAreaOverview(areaId, activeSurvey.id);
  const comparisonArea = effectiveAreaOverview(areaId, comparisonSurvey.id);
  const activeMidOffset = activeArea.midOffset ?? activeArea.midOffsetMinutes ?? 0;
  const comparisonMidOffset = comparisonArea.midOffset ?? comparisonArea.midOffsetMinutes ?? 0;

  return `
    <article class="selected-detail-panel selected-detail-panel--comparison">
      <div class="selected-detail-panel__intro">
        <h3>Survey-round comparison</h3>
        <p class="selected-notes">This gives a quick same-area comparison between the two survey rounds, so you can see how the timing and tide window shifted without hopping between screens.</p>
      </div>
      <div class="survey-compare-grid">
        <div class="survey-compare-grid__head"></div>
        <div class="survey-compare-grid__head">${escapeHtml(activeSurvey.shortDate)}</div>
        <div class="survey-compare-grid__head">${escapeHtml(comparisonSurvey.shortDate)}</div>
        ${surveyComparisonDetailRow("Survey day", activeArea.day, comparisonArea.day)}
        ${surveyComparisonDetailRow("Flight window", `${activeArea.start}-${activeArea.finish}`, `${comparisonArea.start}-${comparisonArea.finish}`)}
        ${surveyComparisonDetailRow("Actual duration", activeArea.actualDuration, comparisonArea.actualDuration)}
        ${surveyComparisonDetailRow("Low tide reference", `${activeArea.lowTide} - ${activeArea.lowTideHeight}`, `${comparisonArea.lowTide} - ${comparisonArea.lowTideHeight}`)}
        ${surveyComparisonDetailRow("Launch offset", activeArea.launchOffset, comparisonArea.launchOffset)}
        ${surveyComparisonDetailRow("Mid-flight tide marker", midOffsetLabel(activeMidOffset), midOffsetLabel(comparisonMidOffset))}
        ${surveyComparisonDetailRow("Tidal window", activeArea.tideWindow, comparisonArea.tideWindow)}
        ${surveyComparisonDetailRow("Low-tide alignment", `${activeArea.tideScore}/100`, `${comparisonArea.tideScore}/100`)}
      </div>
    </article>
  `;
}

function renderAreasLegacy() {
  const area = currentArea();
  els.areaList.innerHTML = areas().map((item) => `
    <article class="card area-card area-card--${item.statusTone || "cyan"} ${item.id === area.id ? "active" : ""}">
      <div class="area-card__head">
        <div>
          <p class="muted">${escapeHtml(item.overviewCode)} - ${escapeHtml(item.day)}</p>
          <h3>${escapeHtml(item.label)}</h3>
        </div>
        <span class="overview-area-pill overview-area-pill--${escapeHtml(item.statusTone || "cyan")}">${escapeHtml(item.statusLabel)}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <div class="area-card__stats">
        <div><span class="muted">Flight window</span><strong>${escapeHtml(item.start)}-${escapeHtml(item.finish)}</strong></div>
        <div><span class="muted">Area size</span><strong>${escapeHtml(item.size)}</strong></div>
      </div>
      <div class="chips">${item.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
      <button class="area-action section-gap" type="button" data-area="${escapeHtml(item.id)}">Use this area and compare rounds</button>
    </article>
  `).join("");

  els.areaList.querySelectorAll("[data-area]").forEach((button) => {
    button.addEventListener("click", () => {
      updateArea(button.dataset.area);
      requestAnimationFrame(() => {
        els.selectedAreaPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  els.selectedAreaTitle.textContent = area.label;
  els.selectedAreaSummary.textContent = area.summary;
  els.selectedAreaChips.innerHTML = area.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("");
  els.selectedAreaAssets.innerHTML = `
    <article class="selected-score-card">
      <span class="selected-score-card__label">Low-tide alignment</span>
      <strong class="selected-score-card__value">${escapeHtml(String(area.tideScore))}/100</strong>
      <span class="selected-score-card__sub">Low tide at ${escapeHtml(area.lowTide)} - ${escapeHtml(area.lowTideHeight)}</span>
    </article>
    ${surveyComparisonMarkup(area.id)}
    <article class="selected-detail-panel">
      <h3>Area summary</h3>
      <div class="selected-detail-table">
        ${selectedDetailRow("Survey day", area.day)}
        ${selectedDetailRow("Area size", area.size)}
        ${selectedDetailRow("Flight start", area.start)}
        ${selectedDetailRow("Flight finish", area.finish)}
        ${selectedDetailRow("Estimated duration", area.estimatedDuration)}
        ${selectedDetailRow("Actual duration", area.actualDuration)}
        ${selectedDetailRow("Launch offset from low tide", area.launchOffset)}
        ${selectedDetailRow("Mid-flight tide marker", midOffsetLabel(area.midOffsetMinutes))}
        ${selectedDetailRow("Tidal window", area.tideWindow)}
      </div>
    </article>
    ${surveyComparisonMarkup(area.id)}
    <article class="selected-detail-panel">
      <h3>Monitoring context</h3>
      <div class="selected-detail-table">
        ${selectedDetailRow("Mission role", area.missionRole)}
        ${selectedDetailRow("Operational note", area.operationalNote)}
        ${selectedDetailRow("Planned outputs", area.deliverables)}
        ${selectedDetailRow("Weather notes", area.weatherNotes)}
      </div>
    </article>
    <article class="selected-detail-panel selected-detail-panel--full">
      <h3>Interpretation note</h3>
      <p class="selected-notes">${escapeHtml(area.surveyNotes)}</p>
    </article>
  `;
}

function renderAreas() {
  const area = currentArea();
  els.areaList.innerHTML = areas().map((item) => `
    <article class="card area-card area-card--${item.statusTone || "cyan"} ${item.id === area.id ? "active" : ""}">
      <button class="area-card__toggle" type="button" data-area-toggle="${escapeHtml(item.id)}" aria-expanded="${item.id === area.id ? "true" : "false"}">
        <div class="area-card__head">
          <div>
            <p class="muted">${escapeHtml(item.overviewCode)} - ${escapeHtml(item.day)}</p>
            <h3>${escapeHtml(item.label)}</h3>
          </div>
          <span class="overview-area-pill overview-area-pill--${escapeHtml(item.statusTone || "cyan")}">${escapeHtml(item.statusLabel)}</span>
        </div>
      </button>
      <div class="area-card__content ${item.id === area.id ? "" : "hidden"}">
        <p>${escapeHtml(item.summary)}</p>
        <div class="area-card__stats">
          <div><span class="muted">Flight window</span><strong>${escapeHtml(item.start)}-${escapeHtml(item.finish)}</strong></div>
          <div><span class="muted">Area size</span><strong>${escapeHtml(item.size)}</strong></div>
        </div>
        <div class="chips">${item.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
        <button class="area-action section-gap" type="button" data-area="${escapeHtml(item.id)}">Use this area and compare rounds</button>
      </div>
    </article>
  `).join("");

  els.areaList.querySelectorAll("[data-area-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      updateArea(button.dataset.areaToggle);
    });
  });

  els.areaList.querySelectorAll("[data-area]").forEach((button) => {
    button.addEventListener("click", () => {
      updateArea(button.dataset.area);
      requestAnimationFrame(() => {
        els.selectedAreaPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  els.selectedAreaTitle.textContent = area.label;
  els.selectedAreaSummary.textContent = area.summary;
  els.selectedAreaChips.innerHTML = area.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("");
  els.selectedAreaAssets.innerHTML = `
    <article class="selected-score-card">
      <span class="selected-score-card__label">Low-tide alignment</span>
      <strong class="selected-score-card__value">${escapeHtml(String(area.tideScore))}/100</strong>
      <span class="selected-score-card__sub">Low tide at ${escapeHtml(area.lowTide)} - ${escapeHtml(area.lowTideHeight)}</span>
    </article>
    ${surveyComparisonMarkup(area.id)}
    <article class="selected-detail-panel">
      <h3>Area summary</h3>
      <div class="selected-detail-table">
        ${selectedDetailRow("Survey day", area.day)}
        ${selectedDetailRow("Area size", area.size)}
        ${selectedDetailRow("Flight start", area.start)}
        ${selectedDetailRow("Flight finish", area.finish)}
        ${selectedDetailRow("Estimated duration", area.estimatedDuration)}
        ${selectedDetailRow("Actual duration", area.actualDuration)}
        ${selectedDetailRow("Launch offset from low tide", area.launchOffset)}
        ${selectedDetailRow("Mid-flight tide marker", midOffsetLabel(area.midOffsetMinutes))}
        ${selectedDetailRow("Tidal window", area.tideWindow)}
      </div>
    </article>
    <article class="selected-detail-panel">
      <h3>Monitoring context</h3>
      <div class="selected-detail-table">
        ${selectedDetailRow("Mission role", area.missionRole)}
        ${selectedDetailRow("Operational note", area.operationalNote)}
        ${selectedDetailRow("Planned outputs", area.deliverables)}
        ${selectedDetailRow("Weather notes", area.weatherNotes)}
      </div>
    </article>
    <article class="selected-detail-panel">
      <h3>Interpretation note</h3>
      <p class="selected-notes">${escapeHtml(area.surveyNotes)}</p>
    </article>
  `;
}

async function renderLayers() {
  const area = currentArea();
  const project = currentProject();
  const layerDefinitions = imageryLayers(area);
  const primaryLayer = layerDefinitions[state.primaryLayerKey] || layerDefinitions.ortho;
  const secondaryLayer = layerDefinitions[state.secondaryLayerKey] || layerDefinitions[state.primaryLayerKey] || layerDefinitions.ortho;
  const primarySurvey = currentProject().surveys.find((survey) => survey.id === state.primarySurveyId) || currentSurvey();
  const secondarySurvey = currentProject().surveys.find((survey) => survey.id === state.secondarySurveyId) || primarySurvey;
  const dsmLayer = layerDefinitions.dsm;
  const contourLayer = layerDefinitions.contours;

  fillSelect(els.primaryCompareSelect, currentProject().surveys.map((survey) => [survey.id, survey.label]), primarySurvey.id);
  fillSelect(els.secondaryCompareSelect, currentProject().surveys.map((survey) => [survey.id, survey.label]), secondarySurvey.id);
  fillSelect(els.primaryLayerCompareSelect, Object.entries(layerDefinitions).map(([key, layer]) => [key, layer.label]), state.primaryLayerKey);
  fillSelect(els.secondaryLayerCompareSelect, Object.entries(layerDefinitions).map(([key, layer]) => [key, layer.label]), state.secondaryLayerKey);
  els.toggleGuideDsm.checked = state.showGuideDsm;
  els.toggleGuideContours.checked = state.showGuideContours;
  els.toggleChangeHighlight.checked = state.showChangeHighlight;

  els.layerControls.innerHTML = Object.entries(layerDefinitions).map(([key, layer]) => `
    <button class="chip ${key === state.primaryLayerKey ? "active" : ""}" type="button" data-layer="${escapeHtml(key)}">
      ${escapeHtml(layer.label)}
    </button>
  `).join("");

  els.layerControls.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.primaryLayerKey = button.dataset.layer;
      state.layerKey = state.primaryLayerKey;
      resetView();
      renderLayers();
    });
  });

  els.compareModeControls.querySelectorAll("[data-compare-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.compareMode === state.compareMode);
  });

  const [primarySrc, secondarySrc, guideDsmSrc, primaryGuideContourSrc, secondaryGuideContourSrc] = await Promise.all([
    resolveExistingAsset(surveyAssetCandidates(project.id, primarySurvey.id, area.id, primaryLayer.fileName)),
    resolveExistingAsset(surveyAssetCandidates(project.id, secondarySurvey.id, area.id, secondaryLayer.fileName)),
    dsmLayer ? resolveExistingAsset(surveyAssetCandidates(project.id, primarySurvey.id, area.id, dsmLayer.fileName)) : Promise.resolve(""),
    contourLayer ? resolveExistingAsset(surveyAssetCandidates(project.id, primarySurvey.id, area.id, contourLayer.fileName)) : Promise.resolve(""),
    contourLayer ? resolveExistingAsset(surveyAssetCandidates(project.id, secondarySurvey.id, area.id, contourLayer.fileName)) : Promise.resolve("")
  ]);
  const [primaryDisplaySrc, secondaryDisplaySrc, guideDsmDisplaySrc, primaryGuideContourDisplaySrc, secondaryGuideContourDisplaySrc] = await Promise.all([
    prepareSectionDisplayAsset(primarySrc),
    prepareSectionDisplayAsset(secondarySrc),
    prepareSectionDisplayAsset(guideDsmSrc),
    prepareSectionDisplayAsset(primaryGuideContourSrc),
    prepareSectionDisplayAsset(secondaryGuideContourSrc)
  ]);
  const primaryExists = Boolean(primarySrc);
  const secondaryExists = Boolean(secondarySrc);
  const guideDsmExists = Boolean(guideDsmSrc);
  const guideContourExists = Boolean(primaryGuideContourSrc);
  const secondaryGuideContourExists = Boolean(secondaryGuideContourSrc);

  els.viewerTitle.textContent = `${area.label} ${primaryLayer.label}${state.compareMode === "single" ? "" : ` vs ${secondaryLayer.label}`}`;
  els.viewerBaseImage.removeAttribute("src");
  els.viewerGuideDsmImage.removeAttribute("src");
  els.viewerGuideContourImage.removeAttribute("src");
  els.viewerOverlayImage.removeAttribute("src");
  els.viewerHighlightImage.removeAttribute("src");
  els.viewerSliderImage.removeAttribute("src");
  els.viewerGuideDsmOverlay.classList.add("hidden");
  els.viewerGuideContourOverlay.classList.add("hidden");
  els.viewerTransparencyOverlay.classList.add("hidden");
  els.viewerHighlightOverlay.classList.add("hidden");
  els.viewerSliderOverlay.classList.add("hidden");
  els.sliderHandle.classList.add("hidden");
  els.transparencyControls.classList.add("hidden");

  if (primaryExists) {
    els.viewerBaseImage.src = primaryDisplaySrc || primarySrc;
    els.viewerBaseImage.alt = `${area.label} ${primaryLayer.label} ${primarySurvey.label}`;
  } else {
    els.viewerBaseImage.alt = `${area.label} ${primaryLayer.label} missing`;
  }

  const sameSurvey = primarySurvey.id === secondarySurvey.id;
  const sameLayer = primaryLayer.fileName === secondaryLayer.fileName;
  const canCompare = secondaryExists && !(sameSurvey && sameLayer);
  const canHighlight = canCompare && primaryLayer.fileName === secondaryLayer.fileName;
  const highlightActive = state.showChangeHighlight && canHighlight;

  els.secondaryLayerCompareSelect.disabled = state.showChangeHighlight;
  els.secondaryLayerCompareSelect.title = state.showChangeHighlight
    ? "Highlight change compares the same view type across two survey rounds."
    : "";
  els.toggleGuideDsm.disabled = highlightActive;
  els.toggleGuideDsm.parentElement?.classList.toggle("is-disabled", highlightActive);
  els.toggleGuideDsm.parentElement?.setAttribute(
    "title",
    highlightActive ? "Highlight change uses its own change overlay." : ""
  );
  els.toggleGuideContours.disabled = false;
  els.toggleGuideContours.parentElement?.classList.remove("is-disabled");
  els.toggleGuideContours.parentElement?.setAttribute("title", "");

  els.compareModeControls.querySelectorAll("[data-compare-mode]").forEach((button) => {
    const mode = button.dataset.compareMode;
    const disabled = highlightActive
      ? mode !== "single"
      : (mode !== "single" && !canCompare);
    button.disabled = disabled;
    button.title = disabled
      ? (
        highlightActive
          ? "Highlight change uses a single map view with the change mask overlaid on top."
          : "Choose a different survey or layer, or upload the missing secondary image, to use this mode."
      )
      : "";
  });

  if (!canCompare && state.compareMode !== "single") {
    state.compareMode = "single";
    els.compareModeControls.querySelectorAll("[data-compare-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.compareMode === state.compareMode);
    });
  }

  if (!canHighlight) {
    state.showChangeHighlight = false;
    els.toggleChangeHighlight.checked = false;
  }

  if (state.showGuideDsm && guideDsmExists) {
    els.viewerGuideDsmOverlay.classList.remove("hidden");
    els.viewerGuideDsmImage.src = guideDsmDisplaySrc || guideDsmSrc;
    els.viewerGuideDsmImage.alt = `${area.label} colour elevation guide`;
  }

  if (state.showGuideContours && guideContourExists) {
    els.viewerGuideContourOverlay.classList.remove("hidden");
    els.viewerGuideContourImage.src = primaryGuideContourDisplaySrc || primaryGuideContourSrc;
    els.viewerGuideContourImage.alt = `${area.label} contour guide`;
  }

  if (state.compareMode === "transparency" && canCompare) {
    els.viewerTransparencyOverlay.classList.remove("hidden");
    els.transparencyControls.classList.remove("hidden");
    els.viewerOverlayImage.src = secondaryDisplaySrc || secondarySrc;
    els.viewerOverlayImage.alt = `${area.label} ${secondaryLayer.label} ${secondarySurvey.label}`;
  }

  if (state.compareMode === "slider" && canCompare) {
    els.viewerSliderOverlay.classList.remove("hidden");
    els.viewerSliderImage.src = secondaryDisplaySrc || secondarySrc;
    els.viewerSliderImage.alt = `${area.label} ${secondaryLayer.label} ${secondarySurvey.label}`;
    els.sliderHandle.classList.remove("hidden");
    updateSliderMask();
  }

  if (state.showChangeHighlight && canHighlight) {
    const highlightDisplaySrc = await prepareCompareHighlightAsset(
      primaryDisplaySrc || primarySrc,
      secondaryDisplaySrc || secondarySrc,
      {
        primaryContourPath: primaryGuideContourDisplaySrc || primaryGuideContourSrc,
        secondaryContourPath: secondaryGuideContourExists ? (secondaryGuideContourDisplaySrc || secondaryGuideContourSrc) : ""
      }
    );
    els.viewerHighlightOverlay.classList.remove("hidden");
    els.viewerHighlightImage.src = highlightDisplaySrc || secondaryDisplaySrc || secondarySrc;
    els.viewerHighlightImage.alt = `${area.label} change highlight ${secondarySurvey.label}`;
  }

  els.viewerCaption.textContent = buildViewerCaption({
    area,
    primaryLayer,
    secondaryLayer,
    primarySurvey,
    secondarySurvey,
    primaryExists,
    secondaryExists,
    mode: state.compareMode
  });
  renderCompareHighlightLegend({
    canHighlight,
    primarySurvey,
    secondarySurvey,
    contourAssisted: Boolean(primaryGuideContourSrc && secondaryGuideContourSrc)
  });
  updateViewerFullscreenButton();
  syncTransparencyControls(canCompare);
  applyViewerOpacities();
  applyViewTransform();

  const insightCards = [
    assetCard(
      "Current comparison",
      `${primarySurvey.shortDate} ${primaryLayer.label}${canCompare ? ` against ${secondarySurvey.shortDate} ${secondaryLayer.label}` : ` on its own for ${area.label}`}.`
    ),
    assetCard(
      "Best mode for this view",
      compareModeInsight(state.compareMode, canCompare, primaryLayer.label, secondaryLayer.label)
    ),
    assetCard(
      "Overlay helpers",
      overlayInsight({
        showGuideDsm: state.showGuideDsm && guideDsmExists,
        showGuideContours: state.showGuideContours && guideContourExists,
        showChangeHighlight: state.showChangeHighlight && canHighlight
      })
    ),
    assetCard(
      "What to look for",
      compareObservationHint(primaryLayer.label, secondaryLayer.label, state.compareMode)
    )
  ];

  if (!secondaryExists && !sameSurvey) {
    insightCards.push(assetCard(
      "Secondary survey missing",
      `${secondarySurvey.label} does not yet have a ${secondaryLayer.label.toLowerCase()} image for ${area.label}. Upload that view to unlock overlay and swipe comparison.`
    ));
  } else if (!canHighlight) {
    insightCards.push(assetCard(
      "Change highlight",
      "Highlight change works best when the primary and secondary views are the same type, for example aerial against aerial."
    ));
  } else {
    insightCards.push(assetCard(
      "Change highlight",
      "Turn on Highlight change to make differences between the two selected dates stand out more quickly."
    ));
  }

  els.compareInsightGrid.innerHTML = insightCards.join("");
}

async function renderSections() {
  const baseArea = currentArea();
  const survey = currentSurvey();
  const project = currentProject();
  const geometryMap = await loadSharedSectionGeometry(currentProject().id, baseArea.id);
  const area = applySharedSectionGeometry(baseArea, geometryMap);
  state.sectionArea = area;
  const section = area.sections.find((item) => item.id === state.sectionId) || area.sections[0];
  const previousSectionId = state.sectionId;
  state.sectionId = section.id;
  if (previousSectionId !== state.sectionId) {
    syncUrlState();
  }
  fillSelect(els.sectionSelect, area.sections.map((item) => [item.id, item.label]), state.sectionId);
  els.sectionPanelTitle.textContent = `${area.label} ${section.label}`;
  updateSectionFullscreenButton();
  els.sectionOrthoBtn.classList.toggle("active", state.sectionBasemap === "ortho");
  els.sectionDsmBtn.classList.toggle("active", state.sectionBasemap === "dsm");

  const overlayCandidates = [
    ...surveyAssetCandidates(currentProject().id, survey.id, area.id, "section_lines.png"),
    ...sharedAreaAssetCandidates(currentProject().id, area.id, "section_lines.png")
  ];
  const basemapCandidates = surveyAssetCandidates(
    currentProject().id,
    survey.id,
    area.id,
    state.sectionBasemap === "ortho" ? "ortho.jpg" : "dsm.png"
  );

  const comparisonSurveyIds = activeSectionComparisonSurveyIds();
  const [surveyRows, basemapPath, overlayPath] = await Promise.all([
    Promise.all(project.surveys.map(async (profileSurvey) => ({
      survey: profileSurvey,
      rows: await loadSectionRowsForSurvey(project.id, profileSurvey, area.id, section.id)
    }))),
    resolveExistingAsset(basemapCandidates),
    resolveExistingAsset(overlayCandidates)
  ]);
  const basemapDisplayPath = await prepareSectionDisplayAsset(basemapPath);
  const basemapExists = Boolean(basemapPath);
  const overlayExists = Boolean(overlayPath);
  const surveyProfiles = project.surveys.map((profileSurvey, index) => {
    const match = surveyRows.find((item) => item.survey.id === profileSurvey.id);
    return {
      survey: profileSurvey,
      rows: match?.rows || [],
      color: SECTION_PROFILE_COLORS[index % SECTION_PROFILE_COLORS.length],
      selected: comparisonSurveyIds.includes(profileSurvey.id)
    };
  });
  const activeProfiles = surveyProfiles.filter((profile) => profile.selected && profile.rows.length);
  const anchorProfile = surveyProfiles.find((profile) => profile.survey.id === survey.id) || surveyProfiles[0];
  const anchorRows = anchorProfile?.rows || [];

  state.sectionRows = anchorRows;
  renderSectionMap(area, section, basemapDisplayPath || basemapPath, overlayPath, basemapExists, overlayExists, anchorRows);
  renderSectionHero(area, section, survey, activeProfiles, anchorRows);
  renderSectionProfileControls(surveyProfiles);
  els.sectionMetrics.innerHTML = sectionMetrics(anchorRows, area, survey, section).map((item) => metric(item.label, item.value, item.subtext)).join("");
  if (!anchorRows.length) {
    els.sectionDetails.innerHTML = [
      assetCard("Section data missing", `No section profile CSV is available yet for ${survey.label} in either the survey folder or the shared area assets.`),
      assetCard("What this area shows", area.summary),
      assetCard("Survey context", area.surveyNotes),
      assetCard("Map alignment note", geometryMap?.size ? "This area is already using the exported QGIS section geometry, so the line tracking should now follow the real section direction." : "The section guide is still using the fallback line positions. Exporting the QGIS section lines will tighten this further.")
      ].join("");
        drawSectionChart(activeProfiles, section, survey.id);
        renderSectionComparisonSummary(activeProfiles, survey.id);
        updateSectionHoverFeedback(activeProfiles, section, survey);
        return;
    }
  const minHeight = Math.min(...anchorRows.map((row) => row.height));
  const maxHeight = Math.max(...anchorRows.map((row) => row.height));
  const span = Math.max(...anchorRows.map((row) => row.distance)) - Math.min(...anchorRows.map((row) => row.distance));
  const hoverRow = nearestSectionRow(anchorRows, state.sectionHoverDistance);
  const comparedCount = activeProfiles.length;
  els.sectionDetails.innerHTML = [
    sectionInsightCard({
      eyebrow: "Section Story",
      title: "What this section shows",
      summary: `${section.label} gives one fixed slice through ${area.label}.`,
      body: `${area.summary} ${section.label} is a fixed cut through the area, so it helps us see how the ground rises, falls, and changes along one consistent line.`
    }),
    sectionInsightCard({
      eyebrow: "Live Reading",
      title: "Current reading",
      summary: hoverRow
        ? `${fixed(hoverRow.height, 2)} m at ${fixed(hoverRow.distance, 1)} m along the line.`
        : `${fixed(span, 1)} m section span with ${comparedCount > 1 ? `${comparedCount} survey rounds` : "one active survey round"}.`,
      body: hoverRow
        ? `At ${fixed(hoverRow.distance, 1)} m along the line, the ground is ${fixed(hoverRow.height, 2)} m high. Use the map marker and the chart together to understand exactly where that point sits.`
        : `This profile runs for ${fixed(span, 1)} m, from a lowest sampled height of ${fixed(minHeight, 2)} m up to ${fixed(maxHeight, 2)} m. ${comparedCount > 1 ? `${comparedCount} survey rounds are currently overlaid for comparison.` : "Move across the chart to inspect specific points."}`
    }),
    sectionInsightCard({
      eyebrow: "Visual Guide",
      title: "How to read the views",
      summary: state.sectionBasemap === "ortho"
        ? "Use the aerial image for ground appearance and context."
        : "Use colour elevation for quicker height reading.",
      body: state.sectionBasemap === "ortho"
        ? "Aerial View shows the real surface appearance underneath the section line. Switch to Colour Elevation when you want the height pattern to be easier to read at a glance."
        : "Colour Elevation makes changes in height easier to spot. Switch back to Aerial View when you want to relate the section line to visible features on the ground."
    }),
    sectionInsightCard({
      eyebrow: "Survey Context",
      title: "Survey context",
      summary: `${survey.shortDate} around low tide at ${area.lowTide}.`,
      body: `${survey.label} captured this area around low tide at ${area.lowTide}. ${activeProfiles.length > 1 ? "Use the survey profile toggles above the chart to compare rounds along the same fixed line. " : ""}${area.surveyNotes}`
    })
  ].join("");
  drawSectionChart(activeProfiles, section, survey.id);
  renderSectionComparisonSummary(activeProfiles, survey.id);
  updateSectionHoverFeedback(activeProfiles, section, survey);
}

function renderWorkflow() {
  els.workflowGrid.innerHTML = currentProject().workflow.map((step) => `
    <article class="card">
      <p class="muted">Stage ${escapeHtml(step.stage)}</p>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.copy)}</p>
    </article>
  `).join("");
}

function renderWeather() {
  const project = currentProject();
  const survey = currentSurvey();
  const windowRange = weatherWindowForSurvey(project.surveys, survey.id);
  const surveyDates = [survey.dateFrom, survey.dateTo]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  els.weatherSummary.textContent = `${survey.label} is shown with a focused weather and tide window from ${formatDashboardDate(windowRange.start)} to ${formatDashboardDate(windowRange.end)}. Survey markers are shown for the selected survey dates only.`;

  const params = new URLSearchParams({
    location: project.site?.name || environmentalContext.defaultLocationName,
    start: windowRange.start,
    end: windowRange.end,
    surveys: surveyDates.join(","),
    mode: "daily",
    limitDays: "92"
  });
  const src = `./weather-dashboard.html?${params.toString()}`;
  if (state.weatherFrameSrc !== src) {
    state.weatherFrameSrc = src;
    els.weatherFrame.src = src;
  }
}

async function renderVolumeLegacy() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const baselineSurvey = activeComparisonSurvey(project, survey);
  const volumeDataset = currentVolumeDataset();
  const areaDataset = currentAreaVolumeDataset();
  const sharedPolygons = await loadSharedAreaPolygons(project.id, area.id);
  const configuredPolygons = areaDataset?.polygons || [];
  const polygons = mergeVolumePolygons(configuredPolygons, sharedPolygons);
  const hasConfiguredRows = configuredPolygons.length > 0;
  const [baselineImageSrc, currentImageSrc] = await Promise.all([
    baselineSurvey ? resolveExistingAsset(surveyAssetCandidates(project.id, baselineSurvey.id, area.id, "ortho.jpg")) : Promise.resolve(""),
    resolveExistingAsset(surveyAssetCandidates(project.id, survey.id, area.id, "ortho.jpg"))
  ]);
  const baselineImageExists = Boolean(baselineImageSrc);
  const currentImageExists = Boolean(currentImageSrc);

  renderVolumePolygonOverlay(els.volumeBaselineOverlay, baselineImageExists ? polygons : []);
  renderVolumePolygonOverlay(els.volumeCurrentOverlay, currentImageExists ? polygons : []);

  const totals = configuredPolygons.reduce((acc, item) => {
    acc.gain += Number(item.gainM3 || 0);
    acc.loss += Number(item.lossM3 || 0);
    acc.net += Number(item.netM3 || 0);
    return acc;
  }, { gain: 0, loss: 0, net: 0 });

  const volumeLegendMarkup = `
    <div class="detail-item">
      <strong>Change colour key</strong>
      <div class="volume-change-key">
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--red"></span>&lt; -0.20 m</span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--orange"></span>-0.20 to -0.05 m</span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--yellow"></span>-0.05 to 0.05 m</span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--green"></span>0.05 to 0.20 m</span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--blue"></span>&gt; 0.20 m</span>
      </div>
      <p>Blue and green show where the later survey stands higher or looks more built up. Yellow sits close to little or no change. Orange and red show where the earlier survey stood higher or where material appears to have been lost by the later survey.</p>
    </div>
  `;

  if (!baselineSurvey && !volumeDataset) {
    els.volumeSummary.textContent = `${survey.label} is the baseline round, so volume change is not yet available. Switch to a later survey round once a comparison has been calculated.`;
    els.volumeImageSummary.textContent = "The imagery panel will show baseline and repeat aerial views once a comparison round exists.";
    els.volumeBaselineLabel.textContent = "No baseline comparison yet";
    els.volumeCurrentLabel.textContent = survey.shortDate;
    els.volumeBaselineImage.removeAttribute("src");
    if (currentImageExists) {
      els.volumeCurrentImage.src = currentImageSrc;
      els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
      els.volumeCurrentCaption.textContent = `${area.label} in ${survey.label}. This acts as the visual baseline for future volume reporting.`;
    } else {
      els.volumeCurrentImage.removeAttribute("src");
      els.volumeCurrentCaption.textContent = "No aerial view has been uploaded yet for this area in the selected survey.";
    }
    els.volumeBaselineCaption.textContent = "Volume comparisons begin once a later survey round is available for the same area.";
    els.volumeMetricGrid.innerHTML = [
      metric("Selected survey", survey.shortDate, "Current round"),
      metric("Comparison status", "Baseline only", "Volume change starts on repeat rounds"),
      metric("Current area", area.label, area.overviewCode),
      metric("Next step", "Add repeat survey", "Then upload the sandbar volume results")
    ].join("");
    els.volumeMethod.innerHTML = [
      detail("How this will work", "Volume change will be calculated from one elevation surface minus another inside fixed sandbar polygons."),
      detail("What goes into the app", "Gain, loss, and net cubic metre values for each monitored sandbar, plus a short plain-English note.")
    ].join("");
    els.volumeNarrative.innerHTML = [
      detail("Why this matters", "This is the clearest way to explain whether the estuary bars are building up, flattening out, or eroding away between survey rounds."),
      detail("What clients should see", "A simple readout of where sediment has been gained, where it has been lost, and how much the net change is in cubic metres.")
    ].join("");
    els.volumeAreaGrid.innerHTML = `
      <article class="card">
        <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
        <h3>Awaiting first comparison dataset</h3>
        <p>Once a repeat survey has been processed, this page will show per-sandbar gain, loss, and net volume change for this area.</p>
      </article>
    `;
    return;
  }

  const baselineLabel = volumeDataset?.baselineSurveyId
    ? (project.surveys.find((item) => item.id === volumeDataset.baselineSurveyId)?.label || baselineSurvey?.label || "baseline survey")
    : (baselineSurvey?.label || "baseline survey");

  els.volumeSummary.textContent = `${survey.label} is being compared against ${baselineLabel} for ${area.label}. This view translates elevation-surface change into plain-English cubic metre results for monitored sandbars.`;
  els.volumeImageSummary.textContent = "These aerial views give clients a quick visual before-and-after context for the same monitored area. The cubic metre figures underneath explain how much material was gained or lost.";
  els.volumeBaselineLabel.textContent = baselineSurvey?.shortDate || "Baseline survey";
  els.volumeCurrentLabel.textContent = survey.shortDate;
  if (baselineImageExists) {
    els.volumeBaselineImage.src = baselineImageSrc;
    els.volumeBaselineImage.alt = `${area.label} ${baselineLabel} aerial view`;
    els.volumeBaselineCaption.textContent = `${area.label} before the measured change. Use this to see the earlier bar shape and exposed ground pattern.`;
  } else {
    els.volumeBaselineImage.removeAttribute("src");
    els.volumeBaselineCaption.textContent = `No baseline aerial view is currently available for ${area.label}.`;
  }
  if (currentImageExists) {
    els.volumeCurrentImage.src = currentImageSrc;
    els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
    els.volumeCurrentCaption.textContent = `${area.label} during the current survey round. The sandbar volume figures below describe how this surface differs from the earlier one.`;
  } else {
    els.volumeCurrentImage.removeAttribute("src");
    els.volumeCurrentCaption.textContent = `No current aerial view is currently available for ${area.label}.`;
  }
  els.volumeMetricGrid.innerHTML = [
    metric("Monitored sandbars", String(polygons.length), area.overviewCode),
    metric("Total gain", formatVolume(totals.gain), "Deposited sediment"),
    metric("Total loss", formatVolume(totals.loss), "Eroded sediment"),
    metric("Net change", formatVolume(totals.net), totals.net >= 0 ? "Overall build-up" : "Overall erosion")
  ].join("");

  els.volumeMethod.innerHTML = [
    detail("Comparison pair", `${baselineLabel} compared with ${survey.label}.`),
    detail("Calculation method", areaDataset?.method || volumeDataset?.method || "DSM difference raster clipped to fixed sandbar polygons."),
    detail("Grid note", areaDataset?.cellSize || volumeDataset?.cellSize || "Add cell size or processing note in admin once the calculation has been run."),
    detail("Area note", areaDataset?.notes || "Add a short survey-specific note here to explain what changed in this part of the estuary.")
  ].join("");

  els.volumeNarrative.innerHTML = polygons.length
    ? [
      detail("What this means", totals.net >= 0
        ? `Across ${area.label}, the monitored bars currently show a net build-up of ${formatVolume(totals.net)} over this comparison window.`
        : `Across ${area.label}, the monitored bars currently show a net erosion of ${formatVolume(Math.abs(totals.net))} over this comparison window.`),
      detail("How to explain it", "Gain means material has accumulated. Loss means material has been removed. Net change is the balance after both are considered together."),
      detail("Confidence", polygons.map((item) => `${item.label}: ${item.confidence || volumeChangeSettings.defaultConfidence}`).join(" | "))
    ].join("")
    : [
      detail("Awaiting area figures", `The comparison round exists for ${survey.label}, but no per-sandbar cubic metre figures have been entered yet for ${area.label}.`),
      detail("Next step", "Use the admin console to add the calculation method, area note, and one row per sandbar.")
    ].join("");

  els.volumeAreaGrid.innerHTML = polygons.length
    ? polygons.map((item) => `
      <article class="card">
        <div class="volume-card__meta">
          <div>
            <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
            <h3>${escapeHtml(item.label)}</h3>
          </div>
          <span class="chip">${escapeHtml(item.confidence || volumeChangeSettings.defaultConfidence)}</span>
        </div>
        <div class="volume-card__grid">
          <div class="volume-mini volume-mini--gain">
            <span class="muted">Gain</span>
            <strong>${escapeHtml(formatVolume(item.gainM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--loss">
            <span class="muted">Loss</span>
            <strong>${escapeHtml(formatVolume(item.lossM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--net">
            <span class="muted">Net</span>
            <strong>${escapeHtml(formatVolume(item.netM3))}</strong>
          </div>
        </div>
        <p>${escapeHtml(item.summary || "No plain-English summary added yet.")}</p>
      </article>
    `).join("")
    : `
      <article class="card">
        <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
        <h3>Ready for sandbar results</h3>
        <p>This survey pair is set up for volume reporting. Add the per-sandbar cubic metre rows in admin when the QGIS calculation is complete.</p>
      </article>
    `;
}

async function renderVolumePrevious() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const baselineSurvey = activeComparisonSurvey(project, survey);
  const volumeDataset = currentVolumeDataset();
  const areaDataset = currentAreaVolumeDataset();
  const sharedPolygons = await loadSharedAreaPolygons(project.id, area.id);
  const configuredPolygons = areaDataset?.polygons || [];
  const polygons = mergeVolumePolygons(configuredPolygons, sharedPolygons);
  const hasConfiguredRows = configuredPolygons.length > 0;
  const [baselineImageSrc, currentImageSrc] = await Promise.all([
    baselineSurvey ? resolveExistingAsset(surveyAssetCandidates(project.id, baselineSurvey.id, area.id, "ortho.jpg")) : Promise.resolve(""),
    resolveExistingAsset(surveyAssetCandidates(project.id, survey.id, area.id, "ortho.jpg"))
  ]);
  const baselineImageExists = Boolean(baselineImageSrc);
  const currentImageExists = Boolean(currentImageSrc);

  renderVolumePolygonOverlay(els.volumeBaselineOverlay, polygons);
  renderVolumePolygonOverlay(els.volumeCurrentOverlay, polygons);

  const totals = configuredPolygons.reduce((acc, item) => {
    acc.gain += Number(item.gainM3 || 0);
    acc.loss += Number(item.lossM3 || 0);
    acc.net += Number(item.netM3 || 0);
    return acc;
  }, { gain: 0, loss: 0, net: 0 });

  if (!baselineSurvey && !volumeDataset) {
    els.volumeSummary.textContent = `${survey.label} is the baseline round, so volume change is not yet available. Switch to a later survey round once a comparison has been calculated.`;
    els.volumeImageSummary.textContent = "The imagery panel will show baseline and repeat aerial views once a comparison round exists.";
    els.volumeBaselineLabel.textContent = "No baseline comparison yet";
    els.volumeCurrentLabel.textContent = survey.shortDate;
    els.volumeBaselineImage.removeAttribute("src");
    if (currentImageExists) {
      els.volumeCurrentImage.src = currentImageSrc;
      els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
      els.volumeCurrentCaption.textContent = `${area.label} in ${survey.label}. This acts as the visual baseline for future volume reporting.`;
    } else {
      els.volumeCurrentImage.removeAttribute("src");
      els.volumeCurrentCaption.textContent = "No aerial view has been uploaded yet for this area in the selected survey.";
    }
    els.volumeBaselineCaption.textContent = "Volume comparisons begin once a later survey round is available for the same area.";
    els.volumeMetricGrid.innerHTML = [
      metric("Selected survey", survey.shortDate, "Current round"),
      metric("Comparison status", "Baseline only", "Volume change starts on repeat rounds"),
      metric("Current area", area.label, area.overviewCode),
      metric("Next step", "Add repeat survey", "Then upload the sandbar volume results")
    ].join("");
    els.volumeMethod.innerHTML = [
      detail("How this will work", "Volume change will be calculated from one elevation surface minus another inside fixed sandbar polygons."),
      detail("What goes into the app", "Gain, loss, and net cubic metre values for each monitored sandbar, plus a short plain-English note.")
    ].join("");
    els.volumeNarrative.innerHTML = [
      detail("Why this matters", "This is the clearest way to explain whether the estuary bars are building up, flattening out, or eroding away between survey rounds."),
      detail("What clients should see", "A simple readout of where sediment has been gained, where it has been lost, and how much the net change is in cubic metres.")
    ].join("");
    els.volumeAreaGrid.innerHTML = polygons.length
      ? polygons.map((item) => `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
          <h3>${escapeHtml(item.label)}</h3>
          <p>${escapeHtml(item.notes || "Monitored sandbar polygon ready. Repeat-survey volume figures will slot into this shape once the comparison is processed.")}</p>
        </article>
      `).join("")
      : `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
          <h3>Awaiting first comparison dataset</h3>
          <p>Once a repeat survey has been processed, this page will show per-sandbar gain, loss, and net volume change for this area.</p>
        </article>
      `;
    return;
  }

  const baselineLabel = volumeDataset?.baselineSurveyId
    ? (project.surveys.find((item) => item.id === volumeDataset.baselineSurveyId)?.label || baselineSurvey?.label || "baseline survey")
    : (baselineSurvey?.label || "baseline survey");

  els.volumeSummary.textContent = `${survey.label} is being compared against ${baselineLabel} for ${area.label}. This view translates elevation-surface change into plain-English cubic metre results for monitored sandbars.`;
  els.volumeImageSummary.textContent = "These aerial views give clients a quick visual before-and-after context for the same monitored area. The cubic metre figures underneath explain how much material was gained or lost.";
  els.volumeBaselineLabel.textContent = baselineSurvey?.shortDate || "Baseline survey";
  els.volumeCurrentLabel.textContent = survey.shortDate;
  if (baselineImageExists) {
    els.volumeBaselineImage.src = baselineImageSrc;
    els.volumeBaselineImage.alt = `${area.label} ${baselineLabel} aerial view`;
    els.volumeBaselineCaption.textContent = `${area.label} before the measured change. Use this to see the earlier bar shape and exposed ground pattern.`;
  } else {
    els.volumeBaselineImage.removeAttribute("src");
    els.volumeBaselineCaption.textContent = `No baseline aerial view is currently available for ${area.label}.`;
  }
  if (currentImageExists) {
    els.volumeCurrentImage.src = currentImageSrc;
    els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
    els.volumeCurrentCaption.textContent = `${area.label} during the current survey round. The sandbar volume figures below describe how this surface differs from the earlier one.`;
  } else {
    els.volumeCurrentImage.removeAttribute("src");
    els.volumeCurrentCaption.textContent = `No current aerial view is currently available for ${area.label}.`;
  }

  els.volumeMetricGrid.innerHTML = hasConfiguredRows
    ? [
      metric("Monitored sandbars", String(polygons.length), area.overviewCode),
      metric("Total gain", formatVolume(totals.gain), "Deposited sediment"),
      metric("Total loss", formatVolume(totals.loss), "Eroded sediment"),
      metric("Net change", formatVolume(totals.net), totals.net >= 0 ? "Overall build-up" : "Overall erosion")
    ].join("")
    : [
      metric("Monitored sandbars", String(polygons.length), area.overviewCode),
      metric("Comparison pair", `${baselineSurvey?.shortDate || "Baseline"} to ${survey.shortDate}`, "Imagery ready"),
      metric("Polygon setup", polygons.length ? "Ready" : "Missing", polygons.length ? "Fixed monitoring zones loaded" : "Add shared sandbar polygons"),
      metric("Next step", "Add m3 values", "Enter gain, loss, and net per sandbar in admin")
    ].join("");

  els.volumeMethod.innerHTML = [
    detail("Comparison pair", `${baselineLabel} compared with ${survey.label}.`),
    detail("Calculation method", areaDataset?.method || volumeDataset?.method || "DSM difference raster clipped to fixed sandbar polygons."),
    detail("Grid note", areaDataset?.cellSize || volumeDataset?.cellSize || "Add cell size or processing note in admin once the calculation has been run."),
    detail("Area note", areaDataset?.notes || "Add a short survey-specific note here to explain what changed in this part of the estuary.")
  ].join("");

  els.volumeNarrative.innerHTML = hasConfiguredRows
    ? [
      detail("What this means", totals.net >= 0
        ? `Across ${area.label}, the monitored bars currently show a net build-up of ${formatVolume(totals.net)} over this comparison window.`
        : `Across ${area.label}, the monitored bars currently show a net erosion of ${formatVolume(Math.abs(totals.net))} over this comparison window.`),
      detail("How to explain it", "Gain means material has accumulated. Loss means material has been removed. Net change is the balance after both are considered together."),
      detail("Confidence", polygons.map((item) => `${item.label}: ${item.confidence || volumeChangeSettings.defaultConfidence}`).join(" | "))
    ].join("")
    : [
      detail("Awaiting area figures", polygons.length
        ? `The comparison round exists for ${survey.label}, and the monitored polygons are loaded for ${area.label}, but no per-sandbar cubic metre figures have been entered yet.`
        : `The comparison round exists for ${survey.label}, but no monitored sandbar polygons or cubic metre figures have been entered yet for ${area.label}.`),
      detail("Next step", polygons.length
        ? "Use the admin console to add the gain, loss, and net values for each monitored sandbar."
        : "Add the shared sandbar polygons first, then enter the gain, loss, and net values in admin.")
    ].join("");

  els.volumeAreaGrid.innerHTML = hasConfiguredRows
    ? polygons.map((item) => `
      <article class="card">
        <div class="volume-card__meta">
          <div>
            <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
            <h3>${escapeHtml(item.label)}</h3>
          </div>
          <span class="chip">${escapeHtml(item.confidence || volumeChangeSettings.defaultConfidence)}</span>
        </div>
        <div class="volume-card__grid">
          <div class="volume-mini volume-mini--gain">
            <span class="muted">Gain</span>
            <strong>${escapeHtml(formatVolume(item.gainM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--loss">
            <span class="muted">Loss</span>
            <strong>${escapeHtml(formatVolume(item.lossM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--net">
            <span class="muted">Net</span>
            <strong>${escapeHtml(formatVolume(item.netM3))}</strong>
          </div>
        </div>
        <p>${escapeHtml(item.summary || "No plain-English summary added yet.")}</p>
      </article>
    `).join("")
    : polygons.length
      ? polygons.map((item) => `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
          <h3>${escapeHtml(item.label)}</h3>
          <p>${escapeHtml(item.notes || "Fixed monitoring polygon loaded and ready for cubic metre reporting.")}</p>
        </article>
      `).join("")
      : `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
          <h3>Ready for sandbar results</h3>
          <p>This survey pair is set up for volume reporting. Add the per-sandbar cubic metre rows in admin when the QGIS calculation is complete.</p>
        </article>
      `;
}

async function renderVolume() {
  const project = currentProject();
  const sandboxComparisonEntry = Object.entries(project.volumeChangeComparisons || {}).find(([, entry]) => entry?.areas?.[volumeChangeSettings.sandboxAreaId]);
  const sandboxArea = areas().find((item) => item.id === volumeChangeSettings.sandboxAreaId) || currentArea();
  const area = sandboxArea;
  const survey = sandboxComparisonEntry
    ? (project.surveys.find((item) => item.id === sandboxComparisonEntry[0]) || currentSurvey())
    : currentSurvey();
  const volumeDataset = sandboxComparisonEntry ? sandboxComparisonEntry[1] : currentVolumeDataset();
  const baselineSurvey = volumeDataset?.baselineSurveyId
    ? (project.surveys.find((item) => item.id === volumeDataset.baselineSurveyId) || activeComparisonSurvey(project, survey))
    : activeComparisonSurvey(project, survey);
  const areaDataset = volumeDataset?.areas?.[sandboxArea.id] || null;
  const sharedPolygons = await loadSharedAreaPolygons(project.id, sandboxArea.id);
  const configuredPolygons = areaDataset?.polygons || [];
  const polygons = mergeVolumePolygons(configuredPolygons, sharedPolygons);
  const hasConfiguredRows = configuredPolygons.length > 0;
  const previewMode = areaDataset?.previewMode || "";
  const previewImageFile = areaDataset?.previewImage || "";
  const previewBaselineImageFile = areaDataset?.previewBaselineImage || "";
  const previewCurrentImageFile = areaDataset?.previewCurrentImage || "";
  const previewBaselineLabel = areaDataset?.previewBaselineLabel || "";
  const previewCurrentLabel = areaDataset?.previewCurrentLabel || "";
  const previewBaselineCaption = areaDataset?.previewBaselineCaption || "";
  const previewCurrentCaption = areaDataset?.previewCurrentCaption || "";
  const previewLabel = areaDataset?.previewLabel || "Sandbar Volume Change Preview";
  const previewCaption = areaDataset?.previewCaption
    || "This first preview places the measured change map over the latest aerial image so people can see where the monitored sandbar appears to be building up or wearing away inside the measured zone.";
  const viewerEmbedUrl = areaDataset?.viewerEmbedUrl || "";
  const viewerTitle = areaDataset?.viewerTitle || "Area Change Viewer";
  const viewerSummary = areaDataset?.viewerSummary
    || "Explore the tested area in 3D, then use the figures and supporting maps alongside it to interpret where material appears to have been gained or lost.";
  const viewerStats = areaDataset?.viewerStats || null;

  const [baselineImageSrc, currentImageSrc, previewImageSrc, previewBaselineImageSrc, previewCurrentImageSrc] = await Promise.all([
    baselineSurvey ? resolveExistingAsset(surveyAssetCandidates(project.id, baselineSurvey.id, sandboxArea.id, "ortho.jpg")) : Promise.resolve(""),
    resolveExistingAsset(surveyAssetCandidates(project.id, survey.id, sandboxArea.id, "ortho.jpg")),
    previewImageFile
      ? resolveExistingAsset([
        surveyAssetPath(project.id, survey.id, sandboxArea.id, previewImageFile),
        baselineSurvey ? surveyAssetPath(project.id, baselineSurvey.id, sandboxArea.id, previewImageFile) : ""
      ])
      : Promise.resolve(""),
    previewBaselineImageFile
      ? resolveExistingAsset([
        baselineSurvey ? surveyAssetPath(project.id, baselineSurvey.id, sandboxArea.id, previewBaselineImageFile) : "",
        surveyAssetPath(project.id, survey.id, sandboxArea.id, previewBaselineImageFile)
      ])
      : Promise.resolve(""),
    previewCurrentImageFile
      ? resolveExistingAsset([
        surveyAssetPath(project.id, survey.id, sandboxArea.id, previewCurrentImageFile),
        baselineSurvey ? surveyAssetPath(project.id, baselineSurvey.id, sandboxArea.id, previewCurrentImageFile) : ""
      ])
      : Promise.resolve("")
  ]);

  const baselineImageExists = Boolean(baselineImageSrc);
  const currentImageExists = Boolean(currentImageSrc);
  const useSinglePreview = hasConfiguredRows && previewMode === "single" && Boolean(previewImageSrc);
  const usePairedPreview = hasConfiguredRows && previewMode === "pair" && Boolean(previewBaselineImageSrc) && Boolean(previewCurrentImageSrc);

  const totals = configuredPolygons.reduce((acc, item) => {
    acc.gain += Number(item.gainM3 || 0);
    acc.loss += Number(item.lossM3 || 0);
    acc.net += Number(item.netM3 || 0);
    return acc;
  }, { gain: 0, loss: 0, net: 0 });

  const volumeLegendMarkup = `
    <div class="volume-explainer__block">
      <strong>Change colour key</strong>
      <div class="volume-change-key">
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--red"></span><span>&lt; -0.20 m</span></span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--orange"></span><span>-0.20 to -0.05 m</span></span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--yellow"></span><span>-0.05 to 0.05 m</span></span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--green"></span><span>0.05 to 0.20 m</span></span>
        <span class="volume-change-key__item"><span class="volume-change-key__swatch volume-change-key__swatch--blue"></span><span>&gt; 0.20 m</span></span>
      </div>
      <p>Blue and green show where the later survey stands higher or looks more built up. Yellow sits close to little or no visible change. Orange and red show where the earlier survey stood higher, or where material appears to have been lost by the later survey.</p>
    </div>
  `;

  const setPreviewState = (enabled) => {
    els.volumeImageryGrid.classList.toggle("volume-imagery-grid--single", enabled);
    els.volumeCurrentCard.classList.toggle("is-hidden", enabled);
  };

  const setViewerState = (enabled) => {
    els.volumeViewerPanel.classList.toggle("is-hidden", !enabled);
    if (!enabled) {
      els.volumeViewerFrame.removeAttribute("src");
      els.volumeViewerTitle.textContent = "Area Change Viewer";
      els.volumeViewerSummary.textContent = "";
      els.volumeViewerStats.innerHTML = "";
      els.volumeViewerDetails.innerHTML = "";
      return;
    }

    els.volumeViewerTitle.textContent = viewerTitle;
    els.volumeViewerSummary.textContent = viewerSummary;
    els.volumeViewerFrame.src = viewerEmbedUrl;
    els.volumeViewerStats.innerHTML = viewerStats
      ? [
        metric("Analysed area", viewerStats.analysedArea || "--", "Measured footprint compared in this trial"),
        metric("Gain area", viewerStats.gainArea || "--", "Where the later survey sits higher"),
        metric("Loss area", viewerStats.lossArea || "--", "Where the later survey sits lower"),
        metric("Matching cells", viewerStats.matchingCells || "--", "How much of the two surfaces aligned cleanly")
      ].join("")
      : "";
    els.volumeViewerDetails.innerHTML = [
      detail("How to use it", "Drag to orbit, scroll to zoom, and pan to inspect where the change surface sits against the underlying terrain."),
      detail("What the colours mean", "Cool colours show relative build-up, warmer colours show relative lowering, and the paired maps underneath give a flatter plan-view readout."),
      detail("Processing note", viewerStats
        ? `Grid size ${viewerStats.gridSize || "--"} with a reporting threshold of ${viewerStats.threshold || "--"}.`
        : "Viewer details will appear here once the trial metadata has been entered.")
    ].join("");
  };

  els.volumeSandboxBanner.innerHTML = `
    <strong>Sandbox Preview - Area 3 only</strong>
    <p>We are currently using ${escapeHtml(sandboxArea.label)} as the live testing area for sandbar volume change. This page is here to prove the workflow, imagery, and plain-English reporting before the same method is rolled out to the other monitored areas.</p>
  `;

  if (!baselineSurvey && !volumeDataset) {
    setViewerState(false);
    setPreviewState(false);
    renderVolumePolygonOverlay(els.volumeBaselineOverlay, []);
    renderVolumePolygonOverlay(els.volumeCurrentOverlay, currentImageExists ? polygons : []);
    els.volumeSummary.textContent = `${survey.label} is the baseline round, so sandbar change is not available yet. Switch to a later survey round once a comparison has been calculated.`;
    els.volumeImageSummary.textContent = "The image panel will show the first before-and-after sandbar preview once a later survey round exists.";
    els.volumeBaselineChip.textContent = "Baseline placeholder";
    els.volumeCurrentChip.textContent = "Current aerial view";
    els.volumeBaselineLabel.textContent = "No earlier comparison yet";
    els.volumeCurrentLabel.textContent = survey.shortDate;
    els.volumeBaselineImage.removeAttribute("src");
    els.volumeBaselineCaption.textContent = "Sandbar change previews begin once a later survey round is available for the same area.";
    if (currentImageExists) {
      els.volumeCurrentImage.src = currentImageSrc;
      els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
      els.volumeCurrentCaption.textContent = `${area.label} in ${survey.label}. This acts as the visual starting point for later sandbar change reporting.`;
    } else {
      els.volumeCurrentImage.removeAttribute("src");
      els.volumeCurrentCaption.textContent = "No aerial view has been uploaded yet for this area in the selected survey.";
    }
    els.volumeMetricGrid.innerHTML = [
      metric("Selected survey", survey.shortDate, "Current round"),
      metric("Comparison status", "Baseline only", "Change reporting starts on repeat rounds"),
      metric("Current area", area.label, area.overviewCode),
      metric("Next step", "Add the next survey", "Then upload the sandbar change results")
    ].join("");
    els.volumeMethod.innerHTML = [
      detail("How this will work", "Sandbar change is measured by comparing one elevation surface with another inside fixed sandbar polygons."),
      detail("What goes into the app", "A simple preview image, plus clear added, removed, and overall balance figures for each measured sandbar.")
    ].join("");
    els.volumeNarrative.innerHTML = [
      detail("Why this matters", "This page is here to show whether the estuary bars are building up, flattening out, or wearing away between survey rounds."),
      detail("What people should see", "A simple visual preview first, followed by easy-to-read numbers that explain what changed.")
    ].join("");
    els.volumeAreaGrid.innerHTML = polygons.length
      ? polygons.map((item) => `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
          <h3>${escapeHtml(item.label)}</h3>
          <p>${escapeHtml(item.notes || "Measured sandbar polygon ready. Repeat-survey results will slot into this shape once the comparison is processed.")}</p>
        </article>
      `).join("")
      : `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
          <h3>Awaiting first comparison dataset</h3>
          <p>Once a repeat survey has been processed, this page will show per-sandbar added, removed, and overall balance figures for this area.</p>
        </article>
      `;
    return;
  }

  setViewerState(Boolean(viewerEmbedUrl));

  const baselineLabel = volumeDataset?.baselineSurveyId
    ? (project.surveys.find((item) => item.id === volumeDataset.baselineSurveyId)?.label || baselineSurvey?.label || "baseline survey")
    : (baselineSurvey?.label || "baseline survey");

  if (!hasConfiguredRows) {
    setPreviewState(true);
    renderVolumePolygonOverlay(els.volumeBaselineOverlay, []);
    renderVolumePolygonOverlay(els.volumeCurrentOverlay, []);
    els.volumeBaselineChip.textContent = "Preview coming soon";
    els.volumeBaselineLabel.textContent = `${area.label} test area`;
    if (currentImageExists) {
      els.volumeBaselineImage.src = currentImageSrc;
      els.volumeBaselineImage.alt = `${area.label} ${survey.label} aerial view`;
      els.volumeBaselineCaption.textContent = `${area.label} is ready for sandbar-change testing, but this area does not yet have a finished preview map or measured results.`;
    } else if (baselineImageExists) {
      els.volumeBaselineImage.src = baselineImageSrc;
      els.volumeBaselineImage.alt = `${area.label} ${baselineLabel} aerial view`;
      els.volumeBaselineCaption.textContent = `${area.label} is ready for sandbar-change testing, but this area does not yet have a finished preview map or measured results.`;
    } else {
      els.volumeBaselineImage.removeAttribute("src");
      els.volumeBaselineCaption.textContent = `${area.label} is ready for sandbar-change testing, but no preview image has been prepared yet.`;
    }
    els.volumeCurrentImage.removeAttribute("src");
    els.volumeCurrentCaption.textContent = "";
    els.volumeSummary.textContent = `${area.label} is still in testing for sandbar volume change. ${area.label} currently shows the first working preview of what this page will become as more measured results are added.`;
    els.volumeImageSummary.textContent = "This area is set up for the workflow, but the finished preview map and measured sandbar figures have not been added yet.";
  } else {
  setPreviewState(useSinglePreview);

  if (useSinglePreview) {
    renderVolumePolygonOverlay(els.volumeBaselineOverlay, []);
    renderVolumePolygonOverlay(els.volumeCurrentOverlay, []);
    els.volumeBaselineChip.textContent = "Preview change map";
    els.volumeBaselineLabel.textContent = previewLabel;
    els.volumeBaselineImage.src = previewImageSrc;
    els.volumeBaselineImage.alt = `${area.label} sandbar change preview`;
    els.volumeBaselineCaption.textContent = previewCaption;
    els.volumeCurrentImage.removeAttribute("src");
    els.volumeCurrentCaption.textContent = "";
    els.volumeSummary.textContent = `${area.label} is being compared between ${baselineSurvey?.shortDate || baselineLabel} and ${survey.shortDate}. This first preview shows where the monitored sandbar appears to have built up or worn away over the short gap between surveys.`;
    els.volumeImageSummary.textContent = "The preview map keeps things simple: it shows the measured sandbar, where the change is concentrated, and how the later survey compares with the earlier one.";
  } else if (usePairedPreview) {
    setPreviewState(false);
    renderVolumePolygonOverlay(els.volumeBaselineOverlay, []);
    renderVolumePolygonOverlay(els.volumeCurrentOverlay, []);
    els.volumeBaselineChip.textContent = previewBaselineLabel || "Earlier change context";
    els.volumeCurrentChip.textContent = previewCurrentLabel || "Later change context";
    els.volumeBaselineLabel.textContent = previewBaselineLabel || baselineSurvey?.shortDate || "Earlier survey";
    els.volumeCurrentLabel.textContent = previewCurrentLabel || survey.shortDate;
    els.volumeBaselineImage.src = previewBaselineImageSrc;
    els.volumeBaselineImage.alt = `${area.label} ${baselineLabel} volume change context`;
    els.volumeBaselineCaption.textContent = previewBaselineCaption || `${area.label} with the measured change overlay shown against the earlier survey context.`;
    els.volumeCurrentImage.src = previewCurrentImageSrc;
    els.volumeCurrentImage.alt = `${area.label} ${survey.label} volume change context`;
    els.volumeCurrentCaption.textContent = previewCurrentCaption || `${area.label} with the measured change overlay shown against the later survey context.`;
    els.volumeSummary.textContent = `${area.label} is being compared between ${baselineSurvey?.shortDate || baselineLabel} and ${survey.shortDate}. This trial now pairs the measured totals with a live 3D viewer and two flat reference maps so the change is easier to interpret from different angles.`;
    els.volumeImageSummary.textContent = "These downloaded reference maps sit alongside the 3D viewer: one shows the measured height-change surface, and the other simplifies the same result into gain-and-loss classes.";
  } else {
    renderVolumePolygonOverlay(els.volumeBaselineOverlay, baselineImageExists ? polygons : []);
    renderVolumePolygonOverlay(els.volumeCurrentOverlay, currentImageExists ? polygons : []);
    els.volumeBaselineChip.textContent = "Earlier aerial view";
    els.volumeCurrentChip.textContent = "Later aerial view";
    els.volumeBaselineLabel.textContent = baselineSurvey?.shortDate || "Earlier survey";
    els.volumeCurrentLabel.textContent = survey.shortDate;
    if (baselineImageExists) {
      els.volumeBaselineImage.src = baselineImageSrc;
      els.volumeBaselineImage.alt = `${area.label} ${baselineLabel} aerial view`;
      els.volumeBaselineCaption.textContent = `${area.label} before the measured change. Use this to see the earlier sandbar shape and exposed ground pattern.`;
    } else {
      els.volumeBaselineImage.removeAttribute("src");
      els.volumeBaselineCaption.textContent = `No earlier aerial view is currently available for ${area.label}.`;
    }
    if (currentImageExists) {
      els.volumeCurrentImage.src = currentImageSrc;
      els.volumeCurrentImage.alt = `${area.label} ${survey.label} aerial view`;
      els.volumeCurrentCaption.textContent = `${area.label} during the later survey round. The figures below describe how this surface differs from the earlier one.`;
    } else {
      els.volumeCurrentImage.removeAttribute("src");
      els.volumeCurrentCaption.textContent = `No later aerial view is currently available for ${area.label}.`;
    }
    els.volumeSummary.textContent = `${survey.label} is being compared against ${baselineLabel} for ${area.label}. This view turns the measured surface change into a simple before-and-after sandbar story.`;
    els.volumeImageSummary.textContent = "These aerial views give quick visual context for the same monitored area. The figures underneath explain how much material appears to have been added or removed.";
  }
  }

  els.volumeMetricGrid.innerHTML = hasConfiguredRows
    ? [
      metric("Measured sandbar zones", String(polygons.length), area.overviewCode),
      metric("Material added", formatVolume(totals.gain), "More material appears in the later survey"),
      metric("Material removed", formatVolume(totals.loss), "Less material appears in the later survey"),
      metric("Overall balance", formatVolume(totals.net), totals.net >= 0 ? "More material overall in the later survey" : "Less material overall in the later survey")
    ].join("")
    : [
      metric("Measured sandbar zones", String(polygons.length), area.overviewCode),
      metric("Comparison pair", `${baselineSurvey?.shortDate || "Baseline"} to ${survey.shortDate}`, "Imagery ready"),
      metric("Polygon setup", polygons.length ? "Ready" : "Missing", polygons.length ? "Fixed monitoring zones loaded" : "Add shared sandbar polygons"),
      metric("Next step", "Add m3 values", "Enter added, removed, and overall balance per sandbar in admin")
    ].join("");

  els.volumeMethod.innerHTML = `
    <div class="volume-explainer">
      <div class="volume-explainer__block">
        <strong>Compared surveys</strong>
        <p>${escapeHtml(`${baselineLabel} compared with ${survey.label}.`)}</p>
      </div>
      <div class="volume-explainer__block">
        <strong>How this was worked out</strong>
        <p>We compared the earlier and later ground surfaces inside the same fixed sandbar outline, then totalled where material appears to have been added and where it appears to have been removed.</p>
      </div>
      <div class="volume-explainer__block">
        <strong>How to read the figures</strong>
        <p>Material added means more sand or sediment appears to be present in the later survey. Material removed means less appears to be present. Overall balance is the difference between the two.</p>
      </div>
      ${volumeLegendMarkup}
      <div class="volume-explainer__block">
        <strong>Area note</strong>
        <p>${escapeHtml(areaDataset?.notes || "Add a short plain-English note here to explain what changed in this part of the estuary.")}</p>
      </div>
    </div>
  `;

  els.volumeNarrative.innerHTML = hasConfiguredRows
    ? `
      <div class="volume-explainer">
        <div class="volume-explainer__block">
          <strong>What this preview is showing</strong>
          <p>This first live trial combines the measured volume totals with a hosted 3D scene and plan-view maps, so people can move between overall numbers, interactive terrain context, and simple classification imagery.</p>
        </div>
        <div class="volume-explainer__block">
          <strong>Plain-English readout</strong>
          <p>${totals.net >= 0
            ? `Overall, the monitored sandbar appears to have gained material between ${baselineSurvey?.shortDate || baselineLabel} and ${survey.shortDate}.`
            : `Overall, the monitored sandbar appears to have lost material between ${baselineSurvey?.shortDate || baselineLabel} and ${survey.shortDate}.`}</p>
        </div>
        <div class="volume-explainer__block">
          <strong>Review confidence</strong>
          <p>${escapeHtml(polygons.map((item) => `${item.label}: ${item.confidence || volumeChangeSettings.defaultConfidence}`).join(" | "))}</p>
        </div>
      </div>
    `
    : `
      <div class="volume-explainer">
        <div class="volume-explainer__block">
          <strong>Testing status</strong>
          <p>${escapeHtml(`${area.label} is ready for the workflow, but this page is still waiting for its first finished preview map and measured sandbar figures.`)}</p>
        </div>
        <div class="volume-explainer__block">
          <strong>What to look at instead</strong>
          <p>${escapeHtml(`${sandboxArea.label} currently shows the first live preview of how this page will work once the measured outputs are in place.`)}</p>
        </div>
        <div class="volume-explainer__block">
          <strong>Next step</strong>
          <p>${escapeHtml(polygons.length
            ? "Add the preview image and the measured added, removed, and overall balance values for this area."
            : "Add the shared sandbar polygons first, then add the preview image and measured values for this area.")}</p>
        </div>
      </div>
    `;

  els.volumeAreaGrid.innerHTML = hasConfiguredRows
    ? polygons.map((item) => `
      <article class="card volume-breakdown-card">
        <div class="volume-card__meta">
          <div>
            <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
            <h3>${escapeHtml(item.label)}</h3>
          </div>
          <span class="chip volume-confidence-chip">${escapeHtml(item.confidence || volumeChangeSettings.defaultConfidence)}</span>
        </div>
        <div class="volume-card__grid">
          <div class="volume-mini volume-mini--gain">
            <span class="muted">Material added</span>
            <strong>${escapeHtml(formatVolume(item.gainM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--loss">
            <span class="muted">Material removed</span>
            <strong>${escapeHtml(formatVolume(item.lossM3))}</strong>
          </div>
          <div class="volume-mini volume-mini--net">
            <span class="muted">Overall balance</span>
            <strong>${escapeHtml(formatVolume(item.netM3))}</strong>
          </div>
        </div>
        <p>${escapeHtml(item.summary || "No plain-English summary added yet.")}</p>
      </article>
    `).join("")
    : polygons.length
      ? polygons.map((item) => `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(item.id || "")}</p>
          <h3>${escapeHtml(item.label)}</h3>
          <p>${escapeHtml(item.notes || "Fixed monitoring polygon loaded and ready for cubic metre reporting.")}</p>
        </article>
      `).join("")
      : `
        <article class="card">
          <p class="muted">${escapeHtml(area.overviewCode)} - ${escapeHtml(area.label)}</p>
          <h3>Ready for sandbar results</h3>
          <p>This survey pair is set up for sandbar change reporting. Add the per-sandbar cubic metre rows in admin when the QGIS calculation is complete.</p>
        </article>
      `;
}

async function renderAdmin() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const areaHasOverride = Boolean(areaOverride(project, survey.id, area.id) && Object.keys(areaOverride(project, survey.id, area.id)).length);
  const volumeDataset = project.volumeChangeComparisons?.[survey.id]?.areas?.[area.id] || null;
  fillSelect(
    els.newSurveyBaseline,
    project.surveys.map((item) => [item.id, item.label]),
    project.surveys[project.surveys.length - 1]?.id || survey.id
  );
  if (!els.createSurveyStatus.innerHTML.trim()) {
    els.createSurveyStatus.innerHTML = detail("Create survey round", "Add the next survey here with its name and dates. The system will scaffold the folders and make it available in the dropdowns.");
  }
  const expectedFiles = assetSettings.expectedSurveyAssets.slice(0, 3).map((item) => ({
    id: item.inputId,
    label: item.label,
    description: item.description
  }));

  els.adminTargetSummary.textContent = `Uploads for ${survey.label} and ${area.label} will be written to survey-data/${project.id}/${survey.id}/${area.id}/.`;
  els.adminExpectedFiles.innerHTML = expectedFiles.map((item) => detail(item.label, item.description)).join("")
    + detail("Shared section assets", "Section-line imagery, section CSVs, line geometry, and sandbar polygons can now live once under shared-data and be reused across survey rounds.");
  els.adminMetadataSummary.textContent = `${area.overviewCode} in ${survey.label}. Edit the timing, monitoring context, weather notes, and interpretation here.`;
  populateAreaMetadataForm(area.id, survey.id);
  els.areaMetadataStatus.innerHTML = detail(
    "Survey area notes",
    areaHasOverride
      ? "This area is already using survey-specific notes for the selected round."
      : "This area is currently using the shared baseline notes. Save here to create a survey-specific version."
  );
  if (!els.adminUploadStatus.innerHTML.trim()) {
    els.adminUploadStatus.innerHTML = detail("Status", "Choose any subset of files and upload them. The readiness view will refresh afterwards.");
  }
  els.volumeAdminSummary.textContent = `${area.overviewCode} in ${survey.label}. Add one row per sandbar using label|gain|loss|net|confidence|summary.`;
  els.volumeMethodInput.value = volumeDataset?.method || project.volumeChangeComparisons?.[survey.id]?.method || volumeChangeSettings.defaultMethod;
  els.volumeCellSizeInput.value = volumeDataset?.cellSize || project.volumeChangeComparisons?.[survey.id]?.cellSize || "";
  els.volumeNotesInput.value = volumeDataset?.notes || "";
  els.volumeRowsInput.value = serialiseVolumeRows(volumeDataset?.polygons || []);
  els.volumeAdminStatus.innerHTML = detail(
    "Volume change",
    volumeDataset?.polygons?.length
      ? `${volumeDataset.polygons.length} sandbar row(s) currently saved for this survey and area.`
      : "No sandbar volume rows saved yet for this survey and area."
  );

  const coverage = await buildSurveyCoverage(project, survey);
  els.adminBoardSummary.innerHTML = [
    metric("Complete areas", String(coverage.completeAreas), "All files present"),
    metric("Partial areas", String(coverage.partialAreas), "Some files present"),
    metric("Missing areas", String(coverage.missingAreas), "No files present"),
    metric("Files present", `${coverage.presentFiles}/${coverage.totalFiles}`, "Expected files across this survey")
  ].join("");

  const manifestRows = await Promise.all(coverage.areas.map(async (item) => ({
    ...item,
    manifest: await loadManifest(project.id, survey.id, item.areaId)
  })));

  els.adminBoardGrid.innerHTML = manifestRows.map((item) => {
    const manifestStatus = item.manifest?.status || item.statusLabel.toLowerCase();
    const manifestUpdated = item.manifest?.lastUpdated
      ? new Date(item.manifest.lastUpdated).toLocaleString("en-GB")
      : "Not yet written";
    const presentText = item.presentFiles.length ? `Present: ${item.presentFiles.join(", ")}` : "No expected files uploaded yet.";
    const missingText = item.missingFiles.length ? `Missing: ${item.missingFiles.join(", ")}` : "All expected files are present.";
    return `
      <article class="card admin-board-card">
        <div class="admin-board-meta">
          <span class="chip">${escapeHtml(item.areaLabel)}</span>
          <span class="chip">${escapeHtml(capitalise(manifestStatus))}</span>
        </div>
        <h3>${item.presentCount}/${item.totalCount} files present</h3>
        <p>${escapeHtml(presentText)}</p>
        <p>${escapeHtml(missingText)}</p>
        <p>${escapeHtml(`Target: survey-data/${project.id}/${survey.id}/${item.areaId}/`)}</p>
        <p>${escapeHtml(`Manifest updated: ${manifestUpdated}`)}</p>
        <p><button class="area-action" type="button" data-admin-area="${escapeHtml(item.areaId)}">Manage This Area</button></p>
      </article>
    `;
  }).join("");

  els.adminBoardGrid.querySelectorAll("[data-admin-area]").forEach((button) => {
    button.addEventListener("click", () => {
      updateArea(button.dataset.adminArea);
      activateTab("admin");
    });
  });
}

function updateArea(areaId) {
  const area = areas().find((item) => item.id === areaId) || areas()[0];
  state.areaId = area.id;
  state.sectionId = area.sections[0].id;
  state.sectionHoverDistance = null;
  state.layerKey = "ortho";
  resetView();
  fillSelect(els.areaSelect, areaSelectOptions(), state.areaId);
  renderShellStage();
  renderAreas();
  renderVolume();
  renderLayers();
  renderSections();
  renderAdminIfEnabled();
  syncUrlState();
}

function renderSectionHero(area, section, survey, activeProfiles, rows) {
  const comparisonLabel = activeProfiles
    .map((profile) => profile.survey.shortDate || profile.survey.label)
    .filter(Boolean)
    .join(" vs ");

  els.sectionHeroTitle.textContent = `${area.label} ${section.label}`;
  els.sectionHeroSummary.textContent = `${section.label} is a fixed section through ${area.label}, making it easier to read change along one consistent line without losing the wider aerial context.`;
  els.sectionSurveyPill.innerHTML = `
    <span class="section-survey-pill__label">Survey Dates</span>
    <strong class="section-survey-pill__value">${escapeHtml(comparisonLabel || survey.shortDate || survey.label)}</strong>
  `;
  els.sectionHeroStats.innerHTML = "";
}

function sectionHeroStat(label, value, copy) {
  return `
    <article class="section-hero-stat">
      <span class="section-hero-stat__label">${escapeHtml(label)}</span>
      <strong class="section-hero-stat__value">${escapeHtml(value)}</strong>
      <span class="section-hero-stat__copy">${escapeHtml(copy)}</span>
    </article>
  `;
}

function renderAdminIfEnabled() {
  if (adminToolsEnabled()) {
    renderAdmin();
  }
}

function normaliseSectionId(value) {
  const text = String(value || "").trim();
  const match = text.match(/^A(\d+)-?(\d{2})$/i);
  if (!match) {
    return text;
  }
  return `A${Number(match[1])}-${match[2]}`;
}

async function loadSectionRows(path, sectionId) {
    const response = await fetch(path);
    if (!response.ok) return [];
    const text = await response.text();
    const targetSectionId = normaliseSectionId(sectionId);
    return text.trim().split(/\r?\n/).slice(1).map((line) => {
      const [currentSectionId, label, sortOrder, height, distance] = line.split(",");
      return {
        sectionId: normaliseSectionId(currentSectionId),
        label,
        sortOrder: Number(sortOrder),
        height: Number(height),
        distance: Number(distance)
      };
    }).filter((row) => row.sectionId === targetSectionId);
  }

async function loadSectionRowsFromCandidates(candidates, sectionId) {
  for (const candidate of Array.from(new Set(candidates)).filter(Boolean)) {
    const rows = await loadSectionRows(candidate, sectionId);
    if (rows.length) {
      return rows;
    }
  }
  return [];
}

async function loadSectionRowsForSurvey(projectId, survey, areaId, sectionId) {
  const csvCandidates = [
    ...surveyAssetCandidates(projectId, survey.id, areaId, "section_profiles.csv"),
    ...sharedAreaAssetCandidates(projectId, areaId, "section_profiles.csv")
  ];
  const rows = await loadSectionRowsFromCandidates(csvCandidates, sectionId);
  return normaliseSectionRows(rows);
}

function normaliseSectionRows(rows) {
  return rows
    .filter((row) => Number.isFinite(row.height) && Number.isFinite(row.distance))
    .sort((a, b) => a.distance - b.distance)
    .map((row) => ({
    ...row,
    height: row.height < -3 ? -3 : row.height
  }));
}

function nearestSectionRow(rows, targetDistance) {
  if (!rows.length || !Number.isFinite(targetDistance)) {
    return null;
  }
  return rows.reduce((best, row) => (
    Math.abs(row.distance - targetDistance) < Math.abs(best.distance - targetDistance) ? row : best
  ));
}

function buildSectionDifferenceSeries(anchorRows, compareRows) {
  const compareByDistance = new Map(compareRows.map((row) => [row.distance, row]));
  return anchorRows.flatMap((anchorRow) => {
    const compareRow = compareByDistance.get(anchorRow.distance);
    if (!compareRow) {
      return [];
    }
    if (anchorRow.height === 0 || compareRow.height === 0) {
      return [];
    }
    return [{
      distance: anchorRow.distance,
      delta: compareRow.height - anchorRow.height
      }];
    });
  }

function chartHoverDistanceFromPointer(event, svg, activeProfiles, metrics) {
  const { width, pad, minX, xSpan, plotWidth } = metrics;
  const rect = svg.getBoundingClientRect();
  const pointerX = ((event.clientX - rect.left) / rect.width) * width;
  const plotLeft = pad.left;
  const plotRight = pad.left + plotWidth;

  if (pointerX < plotLeft || pointerX > plotRight) {
    return null;
  }

  const hoverDistance = minX + (((pointerX - pad.left) / plotWidth) * xSpan);
  return clamp(hoverDistance, minX, minX + xSpan);
}

function focusedSectionComparison(anchorProfile, comparisonProfiles, hoverDistance = state.sectionHoverDistance) {
  if (!anchorProfile?.rows?.length || !comparisonProfiles.length) {
    return null;
  }

  const prepared = comparisonProfiles
    .map((profile) => ({
      ...profile,
      differences: buildSectionDifferenceSeries(anchorProfile.rows, profile.rows)
    }))
    .filter((profile) => profile.differences.length);

  if (!prepared.length) {
    return null;
  }

  const distance = Number.isFinite(hoverDistance)
    ? hoverDistance
    : null;

  const enriched = prepared.map((profile) => {
    const focusDifference = distance === null
      ? profile.differences.reduce((best, row) => (
        Math.abs(row.delta) > Math.abs(best.delta) ? row : best
      ), profile.differences[0])
      : nearestSectionRow(profile.differences, distance);
    return {
      ...profile,
      focusDifference
    };
  }).filter((profile) => profile.focusDifference);

  if (!enriched.length) {
    return null;
  }

  return enriched.reduce((best, profile) => {
    if (!best) {
      return profile;
    }
    return Math.abs(profile.focusDifference.delta) > Math.abs(best.focusDifference.delta)
      ? profile
      : best;
  }, null);
}

function sectionInsetWindowRows(rows, centerDistance, radius = 6) {
  return rows.filter((row) => Math.abs(row.distance - centerDistance) <= radius);
}

function renderSectionComparisonSummary(profiles, anchorSurveyId = state.surveyId) {
  const activeProfiles = profiles.filter((profile) => profile.selected && profile.rows.length);
  const anchorProfile = activeProfiles.find((profile) => profile.survey.id === anchorSurveyId) || activeProfiles[0];
  const comparisonProfiles = activeProfiles.filter((profile) => profile.survey.id !== anchorProfile?.survey.id);
  const focusedProfile = focusedSectionComparison(anchorProfile, comparisonProfiles);

  if (!focusedProfile || !anchorProfile?.rows?.length) {
    els.sectionComparisonSummary.classList.add("hidden");
    els.sectionAnalysisGrid.classList.remove("section-analysis-grid--with-comparison");
    els.sectionDifferenceValue.textContent = "--";
    els.sectionDifferenceValue.style.color = "";
    els.sectionDifferenceSurveyLabel.textContent = "Live comparison along this section.";
    els.sectionDifferenceText.textContent = "Tick another survey round to compare the same fixed section.";
    els.sectionDifferenceRange.textContent = "A short window around the current cursor position.";
    els.sectionDifferenceInset.innerHTML = "";
    return;
  }

  const focusDistance = focusedProfile.focusDifference.distance;
  const anchorRow = nearestSectionRow(anchorProfile.rows, focusDistance);
  const compareRow = nearestSectionRow(focusedProfile.rows, focusDistance);
  if (!anchorRow || !compareRow) {
    els.sectionComparisonSummary.classList.add("hidden");
    els.sectionAnalysisGrid.classList.remove("section-analysis-grid--with-comparison");
    els.sectionDifferenceInset.innerHTML = "";
    return;
  }

  const delta = compareRow.height - anchorRow.height;
  const leadingColor = delta > 0.005
    ? focusedProfile.color
    : delta < -0.005
      ? anchorProfile.color
      : "#eef4ff";
  const directionText = delta > 0.005
    ? `${focusedProfile.survey.shortDate || focusedProfile.survey.label} is above ${anchorProfile.survey.shortDate || anchorProfile.survey.label}`
    : delta < -0.005
      ? `${anchorProfile.survey.shortDate || anchorProfile.survey.label} is above ${focusedProfile.survey.shortDate || focusedProfile.survey.label}`
      : `${focusedProfile.survey.shortDate || focusedProfile.survey.label} matches ${anchorProfile.survey.shortDate || anchorProfile.survey.label}`;

  els.sectionComparisonSummary.classList.remove("hidden");
  els.sectionAnalysisGrid.classList.add("section-analysis-grid--with-comparison");
  els.sectionDifferenceSurveyLabel.textContent = `Comparing ${focusedProfile.survey.shortDate || focusedProfile.survey.label} against ${anchorProfile.survey.shortDate || anchorProfile.survey.label}.`;
  els.sectionDifferenceValue.textContent = `${delta >= 0 ? "+" : ""}${fixed(delta, 2)} m`;
  els.sectionDifferenceValue.style.color = leadingColor;
  els.sectionDifferenceText.textContent = `${directionText} at ${fixed(focusDistance, 1)} m along the same fixed section.`;
  els.sectionDifferenceRange.textContent = `Local zoom from ${fixed(Math.max(0, focusDistance - 6), 1)} m to ${fixed(focusDistance + 6, 1)} m.`;

  drawSectionDifferenceInset(anchorProfile, focusedProfile, focusDistance);
}

function drawChart(profiles) {
  const area = state.sectionArea || currentArea();
  drawSectionChart(profiles, area.sections.find((item) => item.id === state.sectionId) || area.sections[0], state.surveyId);
}

  function renderSectionMap(area, section, basemapPath, overlayPath, basemapExists, overlayExists, rows) {
    els.sectionBaseImage.src = basemapExists ? basemapPath : "";
    els.sectionBaseImage.alt = `${area.label} ${state.sectionBasemap}`;
    els.sectionOverlayImage.src = overlayExists ? overlayPath : "";
    els.sectionOverlayImage.alt = `${area.label} section lines`;
    els.sectionHotspots.innerHTML = "";
    els.sectionQuickSelect.innerHTML = area.sections.map((item) => `
      <button class="chip ${item.id === section.id ? "active" : ""}" type="button" data-section-quick="${escapeHtml(item.id)}">
        ${escapeHtml(item.label)}
      </button>
    `).join("");

    els.sectionQuickSelect.querySelectorAll("[data-section-quick]").forEach((button) => {
      button.addEventListener("click", () => {
        state.sectionId = button.dataset.sectionQuick;
        state.sectionHoverDistance = null;
        renderSections();
        syncUrlState();
      });
    });

    els.sectionMapMarker.classList.add("hidden");
  }

  function activeSectionMapImage() {
    if (els.sectionOverlayImage?.naturalWidth && els.sectionOverlayImage?.naturalHeight) {
      return els.sectionOverlayImage;
    }
    if (els.sectionBaseImage?.naturalWidth && els.sectionBaseImage?.naturalHeight) {
      return els.sectionBaseImage;
    }
    return null;
  }

  function sectionImageFrame() {
    const image = activeSectionMapImage();
    const stage = els.sectionMapStage;
    if (!image || !stage) {
      return null;
    }
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    if (!stageWidth || !stageHeight || !imageWidth || !imageHeight) {
      return null;
    }
    const imageAspect = imageWidth / imageHeight;
    const stageAspect = stageWidth / stageHeight;
    let renderWidth;
    let renderHeight;
    let offsetX = 0;
    let offsetY = 0;
    if (stageAspect > imageAspect) {
      renderHeight = stageHeight;
      renderWidth = renderHeight * imageAspect;
      offsetX = (stageWidth - renderWidth) / 2;
    } else {
      renderWidth = stageWidth;
      renderHeight = renderWidth / imageAspect;
      offsetY = (stageHeight - renderHeight) / 2;
    }
    return { offsetX, offsetY, renderWidth, renderHeight };
  }

  function sectionImagePointToStage(point) {
    const frame = sectionImageFrame();
    if (!frame) {
      return null;
    }
    return {
      left: `${frame.offsetX + ((point.x / 100) * frame.renderWidth)}px`,
      top: `${frame.offsetY + ((point.y / 100) * frame.renderHeight)}px`
    };
  }

function positionSectionHotspots() {
  els.sectionHotspots.querySelectorAll("[data-hotspot-x][data-hotspot-y]").forEach((button) => {
    const x = Number(button.dataset.hotspotX);
    const y = Number(button.dataset.hotspotY);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      button.classList.remove("is-positioned");
      return;
    }
    const positioned = sectionImagePointToStage({ x, y });
    if (!positioned) {
      button.classList.remove("is-positioned");
      return;
    }
    button.style.left = positioned.left;
    button.style.top = positioned.top;
    button.classList.add("is-positioned");
  });
}

function renderSectionProfileControls(profiles) {
  els.sectionProfileControls.innerHTML = profiles.map((profile) => `
    <label class="section-profile-toggle ${profile.rows.length ? "" : "section-profile-toggle--disabled"}">
      <input type="checkbox" data-section-profile-survey="${escapeAttr(profile.survey.id)}" ${profile.selected ? "checked" : ""}>
      <span class="section-profile-toggle__swatch" style="background:${profile.color}"></span>
      <span class="section-profile-toggle__label">${escapeHtml(profile.survey.shortDate || profile.survey.label)}</span>
    </label>
  `).join("");

  els.sectionProfileControls.querySelectorAll("[data-section-profile-survey]").forEach((input) => {
    input.addEventListener("change", () => {
      const next = Array.from(els.sectionProfileControls.querySelectorAll("[data-section-profile-survey]:checked"))
        .map((element) => element.dataset.sectionProfileSurvey);
      state.sectionComparisonSurveyIds = next.length ? next : [state.surveyId];
      state.sectionHoverDistance = null;
      renderSections();
    });
  });

  const activeProfiles = profiles.filter((profile) => profile.selected && profile.rows.length);
  els.sectionProfileLegend.innerHTML = activeProfiles.map((profile) => `
    <span class="section-profile-legend__item">
      <span class="section-profile-legend__swatch" style="background:${profile.color}"></span>
      <span>${escapeHtml(profile.survey.shortDate || profile.survey.label)}</span>
    </span>
  `).join("");
}

function drawSectionChart(profiles, section, anchorSurveyId = state.surveyId) {
  const width = 960;
  const height = 340;
  const pad = { top: 22, right: 22, bottom: 62, left: 62 };
  const activeProfiles = profiles.filter((profile) => profile.selected && profile.rows.length);
  const isComparisonMode = activeProfiles.length > 1;
  const allRows = activeProfiles.flatMap((profile) => profile.rows);

  if (!allRows.length) {
    els.profileChart.innerHTML = "";
    return;
  }

  const minX = Math.min(...allRows.map((row) => row.distance));
  const maxX = Math.max(...allRows.map((row) => row.distance));
  const minY = Math.min(...allRows.map((row) => row.height));
  const maxY = Math.max(...allRows.map((row) => row.height));
  const xSpan = Math.max(1, maxX - minX);
  const ySpan = Math.max(1, maxY - minY);
  const xTicks = buildAxisTicks(minX, maxX, 4);
  const yTicks = buildAxisTicks(minY, maxY, 5);
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const hoverDistance = Number.isFinite(state.sectionHoverDistance)
    ? clamp(state.sectionHoverDistance, minX, maxX)
    : null;

  const buildPointString = (segment) => segment.map((point) => `${fixed(point.x, 2)},${fixed(point.y, 2)}`).join(" ");
  const profileSeries = activeProfiles.map((profile) => {
    const points = profile.rows.map((row, index) => {
      const x = pad.left + ((row.distance - minX) / xSpan) * plotWidth;
      const y = height - pad.bottom - ((row.height - minY) / ySpan) * plotHeight;
      return { index, x, y, row };
    });
    const buildSegments = (predicate) => {
      const segments = [];
      let current = [];
      points.forEach((point) => {
        if (predicate(point)) {
          current.push(point);
        } else if (current.length) {
          segments.push(current);
          current = [];
        }
      });
      if (current.length) {
        segments.push(current);
      }
      return segments;
    };
    return {
      ...profile,
      points,
      measuredSegments: buildSegments((point) => point.row.height !== 0),
      zeroSegments: buildSegments((point) => point.row.height === 0),
      hoverRow: nearestSectionRow(profile.rows, hoverDistance)
    };
  });
  const anchorProfile = profileSeries.find((profile) => profile.survey.id === anchorSurveyId) || profileSeries[0];
  const activePoint = anchorProfile?.hoverRow
    ? {
        x: pad.left + ((anchorProfile.hoverRow.distance - minX) / xSpan) * plotWidth,
        y: height - pad.bottom - ((anchorProfile.hoverRow.height - minY) / ySpan) * plotHeight,
        row: anchorProfile.hoverRow
      }
    : null;
  const xTickMarkup = xTicks.map((tick) => {
    const x = pad.left + ((tick - minX) / xSpan) * plotWidth;
    return `
      <line x1="${fixed(x, 2)}" y1="${pad.top}" x2="${fixed(x, 2)}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.08)"/>
      <line x1="${fixed(x, 2)}" y1="${height - pad.bottom}" x2="${fixed(x, 2)}" y2="${height - pad.bottom + 8}" stroke="rgba(255,255,255,0.28)"/>
      <text x="${fixed(x, 2)}" y="${height - 28}" text-anchor="middle" fill="#aab9d3" font-size="10">${formatAxisTick(tick)} m</text>
    `;
  }).join("");
  const yTickMarkup = yTicks.map((tick) => {
    const y = height - pad.bottom - ((tick - minY) / ySpan) * (height - pad.top - pad.bottom);
    return `
      <line x1="${pad.left}" y1="${fixed(y, 2)}" x2="${width - pad.right}" y2="${fixed(y, 2)}" stroke="rgba(255,255,255,0.08)"/>
      <line x1="${pad.left - 8}" y1="${fixed(y, 2)}" x2="${pad.left}" y2="${fixed(y, 2)}" stroke="rgba(255,255,255,0.28)"/>
      <text x="${pad.left - 12}" y="${fixed(y + 4, 2)}" text-anchor="end" fill="#aab9d3" font-size="10">${formatAxisTick(tick)} m</text>
    `;
  }).join("");
  const fillPolygons = profileSeries
    .filter((profile) => profile.survey.id === anchorSurveyId)
    .flatMap((profile) => profile.measuredSegments
      .filter((segment) => segment.length >= 2)
      .map((segment) => {
        const pointString = buildPointString(segment);
        const start = segment[0];
        const end = segment[segment.length - 1];
        return `<polyline fill="url(#sectionFill)" stroke="none" points="${fixed(start.x, 2)},${height - pad.bottom} ${pointString} ${fixed(end.x, 2)},${height - pad.bottom}"/>`;
      }))
    .join("");
  const profileLines = profileSeries.map((profile) => {
    const measuredLines = profile.measuredSegments
      .filter((segment) => segment.length >= 2)
      .map((segment) => {
        const strokeWidth = isComparisonMode
          ? (profile.survey.id === anchorSurveyId ? 2 : 1.7)
          : 3;
        return `<polyline fill="none" stroke="${profile.color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" points="${buildPointString(segment)}"/>`;
      })
      .join("");
    const zeroLines = profile.zeroSegments
      .map((segment) => {
        if (segment.length === 1) {
          const point = segment[0];
          return `<circle cx="${fixed(point.x, 2)}" cy="${fixed(point.y, 2)}" r="2.5" fill="${profile.color}" opacity="0.72"/>`;
        }
        const zeroStrokeWidth = isComparisonMode ? 1.4 : 2;
        return `<polyline fill="none" stroke="${profile.color}" opacity="0.6" stroke-width="${zeroStrokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 5" points="${buildPointString(segment)}"/>`;
      })
      .join("");
    const hoverDot = profile.hoverRow && hoverDistance !== null
      ? (() => {
          const x = pad.left + ((profile.hoverRow.distance - minX) / xSpan) * plotWidth;
          const y = height - pad.bottom - ((profile.hoverRow.height - minY) / ySpan) * plotHeight;
          return `<circle cx="${fixed(x, 2)}" cy="${fixed(y, 2)}" r="4.2" fill="${profile.color}" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>`;
        })()
      : "";
    return `${zeroLines}${measuredLines}${hoverDot}`;
  }).join("");
  const activeLabel = activePoint ? `
    <g>
      <circle cx="${fixed(activePoint.x, 2)}" cy="${fixed(activePoint.y, 2)}" r="5.5" fill="#f7688b"/>
      <rect x="${fixed(activePoint.x + 10, 2)}" y="${fixed(activePoint.y - 28, 2)}" width="74" height="22" rx="11" fill="rgba(8,14,26,0.88)" stroke="rgba(255,255,255,0.16)"/>
      <text x="${fixed(activePoint.x + 47, 2)}" y="${fixed(activePoint.y - 13, 2)}" text-anchor="middle" fill="#eef4ff" font-size="11">${fixed(activePoint.row.height, 2)} m</text>
    </g>
  ` : "";

  els.profileChart.innerHTML = `
    <defs>
      <linearGradient id="sectionFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(121, 167, 255, 0.36)"/>
        <stop offset="100%" stop-color="rgba(121, 167, 255, 0.02)"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="transparent"/>
    ${xTickMarkup}
    ${yTickMarkup}
    <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.3)"/>
    <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.3)"/>
    ${fillPolygons}
    ${profileLines}
    ${hoverDistance !== null ? `<line x1="${fixed(pad.left + ((hoverDistance - minX) / xSpan) * plotWidth, 2)}" y1="${pad.top}" x2="${fixed(pad.left + ((hoverDistance - minX) / xSpan) * plotWidth, 2)}" y2="${height - pad.bottom}" stroke="rgba(247,104,139,0.38)" stroke-width="2" stroke-dasharray="6 6"/>` : ""}
    ${activeLabel}
    <text x="${width / 2}" y="${height - 10}" text-anchor="middle" fill="#aab9d3" font-size="13">Distance along section (m)</text>
    <text x="20" y="${height / 2}" text-anchor="middle" fill="#aab9d3" font-size="13" transform="rotate(-90 20 ${height / 2})">Height (m)</text>
  `;

  const chartMetrics = {
    width,
    height,
    pad,
    minX,
    xSpan,
    plotWidth,
    minY,
    ySpan,
    plotHeight
  };
  const updateSectionHoverFromPointer = (event) => {
    const nextHoverDistance = chartHoverDistanceFromPointer(event, els.profileChart, activeProfiles, {
      ...chartMetrics
    });
    if (nextHoverDistance === null) {
      if (state.sectionHoverDistance !== null) {
        state.sectionHoverDistance = null;
        drawSectionChart(profiles, section, anchorSurveyId);
        renderSectionComparisonSummary(profiles, anchorSurveyId);
        updateSectionHoverFeedback(profiles, section, currentSurvey());
      }
      return;
    }
    if (state.sectionHoverDistance === null || Math.abs(state.sectionHoverDistance - nextHoverDistance) > 0.12) {
      state.pendingSectionHoverDistance = nextHoverDistance;
      if (state.pendingSectionHoverFrame) {
        return;
      }
      state.pendingSectionHoverFrame = window.requestAnimationFrame(() => {
        state.pendingSectionHoverFrame = null;
        state.sectionHoverDistance = state.pendingSectionHoverDistance;
        state.pendingSectionHoverDistance = null;
        drawSectionChart(profiles, section, anchorSurveyId);
        renderSectionComparisonSummary(profiles, anchorSurveyId);
        updateSectionHoverFeedback(profiles, section, currentSurvey());
      });
    }
  };
  const updateSectionHoverImmediately = (event) => {
    const nextHoverDistance = chartHoverDistanceFromPointer(event, els.profileChart, activeProfiles, {
      ...chartMetrics
    });
    if (nextHoverDistance !== null) {
      state.sectionHoverDistance = nextHoverDistance;
      drawSectionChart(profiles, section, anchorSurveyId);
      renderSectionComparisonSummary(profiles, anchorSurveyId);
      updateSectionHoverFeedback(profiles, section, currentSurvey());
    }
  };
  const clearSectionHover = () => {
    if (state.sectionHoverDistance !== null) {
      state.sectionHoverDistance = null;
      drawSectionChart(profiles, section, anchorSurveyId);
      renderSectionComparisonSummary(profiles, anchorSurveyId);
      updateSectionHoverFeedback(profiles, section, currentSurvey());
    }
  };

  els.profileChart.onmousemove = updateSectionHoverFromPointer;
  els.profileChart.onpointerdown = (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    state.sectionPointerId = event.pointerId;
    event.preventDefault();
    els.profileChart.setPointerCapture?.(event.pointerId);
    updateSectionHoverImmediately(event);
  };
  els.profileChart.onpointermove = (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    if (state.sectionPointerId !== null && event.pointerId !== state.sectionPointerId) {
      return;
    }
    event.preventDefault();
    updateSectionHoverFromPointer(event);
  };
  els.profileChart.onpointerrawupdate = els.profileChart.onpointermove;
  els.profileChart.onpointerup = (event) => {
    els.profileChart.releasePointerCapture?.(event.pointerId);
    if (state.sectionPointerId === event.pointerId) {
      state.sectionPointerId = null;
    }
  };
  els.profileChart.onpointercancel = (event) => {
    els.profileChart.releasePointerCapture?.(event.pointerId);
    if (state.sectionPointerId === event.pointerId) {
      state.sectionPointerId = null;
    }
  };
  els.profileChart.onmouseleave = () => {
    clearSectionHover();
  };
}

function drawSectionDifferenceInset(anchorProfile, comparisonProfile, centerDistance) {
  const width = 380;
  const height = 150;
  const pad = { top: 16, right: 18, bottom: 30, left: 42 };
  const radius = 6;
  const minWindowX = Math.max(
    Math.min(...anchorProfile.rows.map((row) => row.distance)),
    centerDistance - radius
  );
  const maxWindowX = Math.min(
    Math.max(...anchorProfile.rows.map((row) => row.distance)),
    centerDistance + radius
  );
  const anchorRows = sectionInsetWindowRows(anchorProfile.rows, centerDistance, radius);
  const comparisonRows = sectionInsetWindowRows(comparisonProfile.rows, centerDistance, radius);
  const combinedRows = [...anchorRows, ...comparisonRows].filter((row) => Number.isFinite(row.height));

  if (!combinedRows.length) {
    els.sectionDifferenceInset.innerHTML = "";
    return;
  }

  const minX = Math.min(...combinedRows.map((row) => row.distance), minWindowX);
  const maxX = Math.max(...combinedRows.map((row) => row.distance), maxWindowX);
  const minY = Math.min(...combinedRows.map((row) => row.height));
  const maxY = Math.max(...combinedRows.map((row) => row.height));
  const xSpan = Math.max(1, maxX - minX);
  const ySpan = Math.max(0.4, maxY - minY);
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const pointString = (rows) => rows.map((row) => {
    const x = pad.left + ((row.distance - minX) / xSpan) * plotWidth;
    const y = height - pad.bottom - ((row.height - minY) / ySpan) * plotHeight;
    return `${fixed(x, 2)},${fixed(y, 2)}`;
  }).join(" ");

  const cursorX = pad.left + ((centerDistance - minX) / xSpan) * plotWidth;
  const baselineY = height - pad.bottom - ((0 - minY) / ySpan) * plotHeight;
  const insetTicks = [minX, centerDistance, maxX];

  const xTickMarkup = insetTicks.map((tick) => {
    const x = pad.left + ((tick - minX) / xSpan) * plotWidth;
    return `
      <line x1="${fixed(x, 2)}" y1="${pad.top}" x2="${fixed(x, 2)}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.06)"/>
      <text x="${fixed(x, 2)}" y="${height - 10}" text-anchor="middle" fill="#9fb0cd" font-size="10">${fixed(tick, 1)} m</text>
    `;
  }).join("");

  const axisMarkup = `
    <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.24)"/>
    <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="rgba(255,255,255,0.18)"/>
    ${minY <= 0 && maxY >= 0 ? `<line x1="${pad.left}" y1="${fixed(baselineY, 2)}" x2="${width - pad.right}" y2="${fixed(baselineY, 2)}" stroke="rgba(255,255,255,0.16)" stroke-dasharray="4 4"/>` : ""}
  `;

  els.sectionDifferenceInset.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="transparent"/>
    ${xTickMarkup}
    ${axisMarkup}
    <polyline fill="none" stroke="${anchorProfile.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" points="${pointString(anchorRows)}"/>
    <polyline fill="none" stroke="${comparisonProfile.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${pointString(comparisonRows)}"/>
    <line x1="${fixed(cursorX, 2)}" y1="${pad.top}" x2="${fixed(cursorX, 2)}" y2="${height - pad.bottom}" stroke="rgba(247,104,139,0.32)" stroke-width="1.5" stroke-dasharray="5 5"/>
  `;
}

function updateSectionHoverFeedback(profiles, section, survey) {
  const currentProfile = profiles.find((profile) => profile.survey.id === survey.id) || profiles[0];
  const currentRows = currentProfile?.rows || [];
  if (!currentRows.length) {
    els.sectionStatusText.textContent = `No profile rows are available yet for ${section.label} in ${survey.shortDate}.`;
    updateSectionMapMarker(currentRows, section, state.sectionHoverDistance);
    return;
  }
  const hoverRow = nearestSectionRow(currentRows, state.sectionHoverDistance);
  const comparedProfiles = profiles.filter((profile) => profile.selected && profile.rows.length);
  if (hoverRow) {
    const comparisonText = comparedProfiles.length > 1
      ? ` ${comparedProfiles.map((profile) => {
        const comparisonRow = nearestSectionRow(profile.rows, state.sectionHoverDistance);
        return comparisonRow
          ? `${profile.survey.shortDate}: ${fixed(comparisonRow.height, 2)} m`
          : `${profile.survey.shortDate}: no data`;
      }).join(" | ")}`
      : "";
    els.sectionStatusText.textContent = `${section.label} at ${fixed(hoverRow.distance, 1)} m along the section line, height ${fixed(hoverRow.height, 2)} m in ${survey.shortDate}.${comparisonText}`;
  } else {
    els.sectionStatusText.textContent = comparedProfiles.length > 1
      ? `${section.label} loaded for ${survey.shortDate}. ${comparedProfiles.length} survey profiles are overlaid. Move across the profile to inspect the section location.`
      : `${section.label} loaded for ${survey.shortDate}. Move across the profile to inspect the section location.`;
  }
  updateSectionMapMarker(currentRows, section, state.sectionHoverDistance);
}

function updateSectionMapMarker(rows, section, hoverDistance = state.sectionHoverDistance) {
  if (!Number.isFinite(hoverDistance)) {
    els.sectionMapMarker.classList.add("hidden");
    return;
  }
  const hoverRow = nearestSectionRow(rows, hoverDistance);
  if (!hoverRow) {
    els.sectionMapMarker.classList.add("hidden");
    return;
  }
  const markerPoint = sectionPointForRow(section, hoverRow, rows);
  const positioned = sectionImagePointToStage(markerPoint);
  if (!positioned) {
    els.sectionMapMarker.classList.add("hidden");
    return;
  }
  els.sectionMapMarker.classList.remove("hidden");
  els.sectionMapMarker.style.left = positioned.left;
  els.sectionMapMarker.style.top = positioned.top;
}

function sectionPointForRow(section, row, rows) {
  const sourceRows = Array.isArray(rows) && rows.length ? rows : [row];
  const minDistance = Math.min(...sourceRows.map((item) => item.distance));
  const maxDistance = Math.max(...sourceRows.map((item) => item.distance));
  const span = Math.max(1, maxDistance - minDistance);
  const progress = clamp((row.distance - minDistance) / span, 0, 1);
  return pointAlongTrack(section.track, progress);
}

function pointAlongTrack(track, progress) {
  if (Array.isArray(track?.points) && track.points.length > 1) {
    const segments = [];
    let totalLength = 0;

    for (let index = 1; index < track.points.length; index += 1) {
      const start = track.points[index - 1];
      const end = track.points[index];
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      segments.push({ start, end, length });
      totalLength += length;
    }

    const target = totalLength * progress;
    let traversed = 0;
    for (const segment of segments) {
      if (traversed + segment.length >= target) {
        const segmentProgress = segment.length ? (target - traversed) / segment.length : 0;
        return {
          x: segment.start.x + ((segment.end.x - segment.start.x) * segmentProgress),
          y: segment.start.y + ((segment.end.y - segment.start.y) * segmentProgress)
        };
      }
      traversed += segment.length;
    }
  }

  return {
    x: track.start.x + ((track.end.x - track.start.x) * progress),
    y: track.start.y + ((track.end.y - track.start.y) * progress)
  };
}

function buildAxisTicks(min, max, targetCount) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [];
  }
  if (min === max) {
    return [min];
  }
  const roughStep = Math.abs(max - min) / Math.max(1, targetCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(roughStep, 0.0001)));
  const residual = roughStep / magnitude;
  const niceResidual = residual >= 5 ? 5 : residual >= 2 ? 2 : 1;
  const step = niceResidual * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = start; value <= end + (step / 2); value += step) {
    ticks.push(Number(value.toFixed(6)));
  }
  return ticks;
}

function formatAxisTick(value) {
  return Number.isInteger(value) ? String(value) : fixed(value, 1);
}

function sectionMetrics(rows, area, survey, section) {
  if (!rows.length) {
    return [
      { label: "Section", value: section.label, subtext: "No sampled heights found yet" },
      { label: "Ground range", value: "n/a", subtext: "Waiting for CSV data" },
      { label: "Distance covered", value: "n/a", subtext: "Waiting for CSV data" },
      { label: "Survey timing", value: survey.shortDate, subtext: area.launchOffset }
    ];
  }
  const minY = Math.min(...rows.map((row) => row.height));
  const maxY = Math.max(...rows.map((row) => row.height));
  const minX = Math.min(...rows.map((row) => row.distance));
  const maxX = Math.max(...rows.map((row) => row.distance));
  return [
    { label: "Section", value: section.label, subtext: `${rows.length} sampled profile points` },
    { label: "Ground range", value: `${fixed(minY, 2)} m to ${fixed(maxY, 2)} m`, subtext: "Lowest to highest sampled ground" },
    { label: "Distance covered", value: `${fixed(maxX - minX, 1)} m`, subtext: "Length of this fixed section line" },
    { label: "Survey timing", value: survey.shortDate, subtext: area.launchOffset }
  ];
}

function areas() {
  return Array.from({ length: areaSettings.count }, (_, index) => buildArea(index + 1));
}

function surveyOverrideKeys(project, surveyId) {
  const survey = project?.surveys?.find((item) => item.id === surveyId);
  return [surveyId, survey?.dateFrom, survey?.dateTo]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function areaOverrideStore(project, surveyId) {
  const stores = surveyOverrideKeys(project, surveyId)
    .map((key) => project?.surveyAreaOverrides?.[key] || {})
    .filter((store) => store && Object.keys(store).length);
  return Object.assign({}, ...stores);
}

function areaOverride(project, surveyId, areaId) {
  return areaOverrideStore(project, surveyId)?.[areaId] || {};
}

function effectiveAreaOverview(areaId, surveyId = state.surveyId) {
  const baseline = BASELINE_AREA_OVERVIEW[areaId] || {};
  const override = areaOverride(currentProject(), surveyId, areaId);
  return {
    ...baseline,
    ...override,
    tags: Array.isArray(override.tags)
      ? override.tags
      : Array.isArray(baseline.tags)
        ? baseline.tags
        : []
  };
}

function serialiseAreaMetadataForm() {
  const tags = els.metaTags.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    statusLabel: els.metaStatusLabel.value.trim(),
    statusTone: els.metaStatusTone.value,
    purpose: els.metaPurpose.value.trim(),
    start: els.metaStart.value.trim(),
    finish: els.metaFinish.value.trim(),
    size: els.metaSize.value.trim(),
    lowTide: els.metaLowTide.value.trim(),
    lowTideHeight: els.metaLowTideHeight.value.trim(),
    launchOffset: els.metaLaunchOffset.value.trim(),
    estimatedDuration: els.metaEstimatedDuration.value.trim(),
    actualDuration: els.metaActualDuration.value.trim(),
    tideWindow: els.metaTideWindow.value.trim(),
    tideScore: Number.parseInt(els.metaTideScore.value.trim(), 10) || 0,
    tags,
    missionRole: els.metaMissionRole.value.trim(),
    operationalNote: els.metaOperationalNote.value.trim(),
    weatherNotes: els.metaWeatherNotes.value.trim(),
    surveyNotes: els.metaSurveyNotes.value.trim()
  };
}

function populateAreaMetadataForm(areaId, surveyId = state.surveyId) {
  const overview = effectiveAreaOverview(areaId, surveyId);
  els.metaStatusLabel.value = overview.statusLabel || "";
  els.metaStatusTone.value = overview.statusTone || "blue";
  els.metaPurpose.value = overview.purpose || "";
  els.metaStart.value = overview.start || "";
  els.metaFinish.value = overview.finish || "";
  els.metaSize.value = overview.size || "";
  els.metaLowTide.value = overview.lowTide || "";
  els.metaLowTideHeight.value = overview.lowTideHeight || "";
  els.metaLaunchOffset.value = overview.launchOffset || "";
  els.metaEstimatedDuration.value = overview.estimatedDuration || "";
  els.metaActualDuration.value = overview.actualDuration || "";
  els.metaTideWindow.value = overview.tideWindow || "";
  els.metaTideScore.value = String(overview.tideScore ?? "");
  els.metaTags.value = Array.isArray(overview.tags) ? overview.tags.join(", ") : "";
  els.metaMissionRole.value = overview.missionRole || "";
  els.metaOperationalNote.value = overview.operationalNote || "";
  els.metaWeatherNotes.value = overview.weatherNotes || "";
  els.metaSurveyNotes.value = overview.surveyNotes || "";
}

function areaSelectOptions() {
  return areas().map((area) => [area.id, `${area.overviewCode} - ${area.label}`]);
}

function imageryLayers(area) {
  return Object.fromEntries(
    Object.entries(area.layers).filter(([key]) => key !== "sections")
  );
}

function buildAreaLayers(areaLabel) {
  return Object.fromEntries(Object.entries(layerSettings).map(([key, layer]) => [
    key,
    {
      ...layer,
      description: `${layer.description} for ${areaLabel}.`
    }
  ]));
}

  function buildArea(number) {
    const key = `${areaSettings.idPrefix}${number}`;
    const areaLabel = `Area ${number}`;
    const overview = effectiveAreaOverview(key);
    const explicitTracks = EXPLICIT_SECTION_IMAGE_TRACKS[key];
    const sectionTracks = explicitTracks?.length
      ? explicitTracks.map((track) => explicitTrackToSectionTrack(track))
      : sectionSettings.defaultTracks;
  return {
    id: key,
    overviewCode: `${areaSettings.codePrefix}${number}`,
    day: overview?.day || areaSettings.defaultDay,
    label: overview?.title || areaLabel,
    summary: overview?.purpose || `${areaLabel} follows the same shared schema: ortho, DSM, contours, section overlay, and CSV-backed profile data.`,
    zone: overview?.zone || areaSettings.defaultZone,
    filterKey: overview?.filterKey || "all",
    statusLabel: overview?.statusLabel || areaSettings.defaultStatusLabel,
    statusTone: overview?.statusTone || overviewAreaTone(key, number - 1),
    size: overview?.size || "n/a",
    start: overview?.start || "n/a",
    finish: overview?.finish || "n/a",
    lowTide: overview?.lowTide || "n/a",
    lowTideHeight: overview?.lowTideHeight || "n/a",
    estimatedDuration: overview?.estimatedDuration || "n/a",
    actualDuration: overview?.actualDuration || "n/a",
    tideScore: overview?.tideScore ?? 0,
    launchOffset: overview?.launchOffset || "n/a",
    midOffsetMinutes: overview?.midOffset ?? 0,
    tideWindow: overview?.tideWindow || "n/a",
    missionRole: overview?.missionRole || "Monitoring area within the shared programme.",
    operationalNote: overview?.operationalNote || "Operational notes will be added as survey rounds are documented.",
    deliverables: overview?.deliverables || areaSettings.defaultDeliverables,
    weatherNotes: overview?.weatherNotes || "Weather notes will be added as survey rounds are documented.",
    surveyNotes: overview?.surveyNotes || "Interpretation notes will be added as survey rounds are documented.",
    cardNote: overview?.cardNote || areaSettings.defaultStatusLabel,
    tags: overview?.tags || areaSettings.defaultTags,
    statusNote: areaSettings.defaultStatusNote,
    layers: buildAreaLayers(areaLabel),
    sections: Array.from({ length: sectionSettings.countPerArea }, (_, index) => index + 1).map((section, index) => {
      const track = sectionTracks[index];
      return {
        id: `A${number}-${String(section).padStart(2, "0")}`,
        label: `Section ${section}`,
        note: `${areaLabel} profile extracted from the existing CSV output.`,
        hotspot: {
          x: (track.start.x + track.end.x) / 2,
          y: (track.start.y + track.end.y) / 2
        },
        track
      };
    })
  };
}

function currentProject() {
  return state.dataset.projects.find((project) => project.id === state.projectId);
}

function currentSurvey() {
  return currentProject().surveys.find((survey) => survey.id === state.surveyId) || currentProject().surveys[0];
}

function weatherWindowForSurvey(surveys, surveyId) {
  const current = surveys.find((item) => item.id === surveyId) || surveys[0];
  const end = current?.dateTo || current?.dateFrom || environmentalContext.fallbackSurveyEndDate;
  return {
    start: subtractMonths(end, environmentalContext.weatherWindowMonths),
    end
  };
}

function activeComparisonSurvey(project, survey) {
  if (survey.comparisonBaseline) {
    return project.surveys.find((item) => item.id === survey.comparisonBaseline) || null;
  }
  return project.surveys.find((item) => item.comparisonBaseline === survey.id) || null;
}

function currentVolumeDataset() {
  const project = currentProject();
  const survey = currentSurvey();
  return project.volumeChangeComparisons?.[survey.id] || null;
}

function currentAreaVolumeDataset() {
  return currentVolumeDataset()?.areas?.[currentArea().id] || null;
}

function formatVolume(value) {
  const number = Number(value || 0);
  const rounded = Math.abs(number) >= 100 ? number.toFixed(0) : number.toFixed(1);
  return `${rounded} m3`;
}

function parseVolumeRows(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, gain, loss, net, confidence, summary] = line.split("|").map((item) => item.trim());
      return {
        id: `bar_${String(index + 1).padStart(2, "0")}`,
        label: label || `${volumeChangeSettings.rowLabelFallback} ${index + 1}`,
        gainM3: Number.parseFloat(gain || "0") || 0,
        lossM3: Number.parseFloat(loss || "0") || 0,
        netM3: Number.parseFloat(net || "0") || 0,
        confidence: confidence || volumeChangeSettings.defaultConfidence,
        summary: summary || volumeChangeSettings.defaultSummary
      };
    });
}

function serialiseVolumeRows(rows = []) {
  return rows.map((row) => [
    row.label,
    row.gainM3 ?? 0,
    row.lossM3 ?? 0,
    row.netM3 ?? 0,
    row.confidence || "",
    row.summary || ""
  ].join("|")).join("\n");
}

function formatDashboardDate(dateString) {
  if (!dateString) return "n/a";
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function subtractMonths(dateString, months = 1) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

function currentArea() {
  return areas().find((area) => area.id === state.areaId) || areas()[0];
}

function surveyAssetPath(projectId, surveyId, areaId, fileName) {
  const survey = currentProject().surveys.find((item) => item.id === surveyId);
  const folder = survey?.dataFolder || surveyId;
  return `./${assetSettings.surveyRoot}/${projectId}/${folder}/${areaId}/${fileName}`;
}

function sharedAreaAssetPath(projectId, areaId, fileName) {
  return `./${assetSettings.sharedRoot}/${projectId}/${areaId}/${fileName}`;
}

  function assetFileNameVariants(areaId, fileName) {
    const configuredVariants = assetSettings.variants[fileName] || [];
    const areaSpecificVariants = assetSettings.areaSpecificVariants[areaId]?.[fileName] || [];
    const variants = [
      fileName,
      ...configuredVariants.map((variant) => variant.replace("{areaId}", areaId)),
      ...areaSpecificVariants
    ];
    return Array.from(new Set(variants));
  }

function surveyAssetCandidates(projectId, surveyId, areaId, fileName) {
  return assetFileNameVariants(areaId, fileName).map((variant) => surveyAssetPath(projectId, surveyId, areaId, variant));
}

function sharedAreaAssetCandidates(projectId, areaId, fileName) {
  return assetFileNameVariants(areaId, fileName).map((variant) => sharedAreaAssetPath(projectId, areaId, variant));
}

async function resolveExistingAsset(candidates) {
  for (const candidate of Array.from(new Set(candidates)).filter(Boolean)) {
    if (await assetExists(candidate)) {
      return candidate;
    }
  }
  return "";
}

async function fetchJsonAsset(candidates) {
  const assetPath = await resolveExistingAsset(candidates);
  if (!assetPath) {
    return null;
  }
  if (state.jsonAssetCache.has(assetPath)) {
    return { path: assetPath, json: state.jsonAssetCache.get(assetPath) };
  }
  const response = await fetch(assetPath).catch(() => null);
  if (!response || !response.ok) {
    return null;
  }
  const json = await response.json().catch(() => null);
  if (!json) {
    return null;
  }
  state.jsonAssetCache.set(assetPath, json);
  return { path: assetPath, json };
}

async function prepareSectionDisplayAsset(assetPath) {
  if (!assetPath) {
    return "";
  }
  if (state.processedSectionAssetCache.has(assetPath)) {
    return state.processedSectionAssetCache.get(assetPath);
  }

  try {
    const response = await fetch(assetPath);
    if (!response.ok) {
      return assetPath;
    }
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return assetPath;
    }
    context.drawImage(bitmap, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    const width = canvas.width;
    const height = canvas.height;
    const visited = new Uint8Array(width * height);
    const stack = [];

    const isNearBlack = (offset) => {
      const alpha = data[offset + 3];
      if (alpha === 0) {
        return false;
      }
      return data[offset] <= 40 && data[offset + 1] <= 40 && data[offset + 2] <= 40;
    };

    const pushPixel = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        return;
      }
      const index = y * width + x;
      if (visited[index]) {
        return;
      }
      const offset = index * 4;
      if (!isNearBlack(offset)) {
        return;
      }
      visited[index] = 1;
      stack.push(index);
    };

    for (let x = 0; x < width; x += 1) {
      pushPixel(x, 0);
      pushPixel(x, height - 1);
    }
    for (let y = 0; y < height; y += 1) {
      pushPixel(0, y);
      pushPixel(width - 1, y);
    }

    while (stack.length) {
      const index = stack.pop();
      const offset = index * 4;
      data[offset + 3] = 0;
      const x = index % width;
      const y = Math.floor(index / width);
      pushPixel(x - 1, y);
      pushPixel(x + 1, y);
      pushPixel(x, y - 1);
      pushPixel(x, y + 1);
    }

    context.putImageData(imageData, 0, 0);
    const processedBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!processedBlob) {
      return assetPath;
    }
    const objectUrl = URL.createObjectURL(processedBlob);
    state.processedSectionAssetCache.set(assetPath, objectUrl);
    return objectUrl;
  } catch {
    return assetPath;
  }
}

async function bitmapFromAssetPath(assetPath) {
  const response = await fetch(assetPath);
  if (!response.ok) {
    throw new Error(`Could not load asset: ${assetPath}`);
  }
  const blob = await response.blob();
  return createImageBitmap(blob);
}

async function prepareCompareHighlightAsset(primaryAssetPath, secondaryAssetPath, options = {}) {
  if (!primaryAssetPath || !secondaryAssetPath) {
    return "";
  }
  const primaryContourPath = options.primaryContourPath || "";
  const secondaryContourPath = options.secondaryContourPath || "";
  const cacheKey = `${primaryAssetPath}::${secondaryAssetPath}::${primaryContourPath}::${secondaryContourPath}`;
  if (state.processedHighlightAssetCache.has(cacheKey)) {
    return state.processedHighlightAssetCache.get(cacheKey);
  }

  try {
    const [primaryBitmap, secondaryBitmap, primaryContourBitmap, secondaryContourBitmap] = await Promise.all([
      bitmapFromAssetPath(primaryAssetPath),
      bitmapFromAssetPath(secondaryAssetPath),
      primaryContourPath ? bitmapFromAssetPath(primaryContourPath).catch(() => null) : Promise.resolve(null),
      secondaryContourPath ? bitmapFromAssetPath(secondaryContourPath).catch(() => null) : Promise.resolve(null)
    ]);

    const targetWidth = Math.max(primaryBitmap.width, secondaryBitmap.width);
    const targetHeight = Math.max(primaryBitmap.height, secondaryBitmap.height);
    const makeCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      return canvas;
    };

    const primaryCanvas = makeCanvas();
    const secondaryCanvas = makeCanvas();
    const primaryContourCanvas = primaryContourBitmap ? makeCanvas() : null;
    const secondaryContourCanvas = secondaryContourBitmap ? makeCanvas() : null;
    const outputCanvas = makeCanvas();
    const primaryContext = primaryCanvas.getContext("2d", { willReadFrequently: true });
    const secondaryContext = secondaryCanvas.getContext("2d", { willReadFrequently: true });
    const primaryContourContext = primaryContourCanvas?.getContext("2d", { willReadFrequently: true }) || null;
    const secondaryContourContext = secondaryContourCanvas?.getContext("2d", { willReadFrequently: true }) || null;
    const outputContext = outputCanvas.getContext("2d", { willReadFrequently: true });
    if (!primaryContext || !secondaryContext || !outputContext) {
      return secondaryAssetPath;
    }

    primaryContext.drawImage(primaryBitmap, 0, 0, targetWidth, targetHeight);
    secondaryContext.drawImage(secondaryBitmap, 0, 0, targetWidth, targetHeight);
    if (primaryContourContext && primaryContourBitmap) {
      primaryContourContext.drawImage(primaryContourBitmap, 0, 0, targetWidth, targetHeight);
    }
    if (secondaryContourContext && secondaryContourBitmap) {
      secondaryContourContext.drawImage(secondaryContourBitmap, 0, 0, targetWidth, targetHeight);
    }
    const primaryData = primaryContext.getImageData(0, 0, targetWidth, targetHeight);
    const secondaryData = secondaryContext.getImageData(0, 0, targetWidth, targetHeight);
    const primaryContourData = primaryContourContext?.getImageData(0, 0, targetWidth, targetHeight)?.data || null;
    const secondaryContourData = secondaryContourContext?.getImageData(0, 0, targetWidth, targetHeight)?.data || null;
    const outputImage = outputContext.createImageData(targetWidth, targetHeight);
    const sourceA = primaryData.data;
    const sourceB = secondaryData.data;
    const output = outputImage.data;

    for (let index = 0; index < output.length; index += 4) {
      const alphaA = sourceA[index + 3] / 255;
      const alphaB = sourceB[index + 3] / 255;
      if (alphaA < 0.01 && alphaB < 0.01) {
        continue;
      }

      const redA = sourceA[index];
      const greenA = sourceA[index + 1];
      const blueA = sourceA[index + 2];
      const redB = sourceB[index];
      const greenB = sourceB[index + 1];
      const blueB = sourceB[index + 2];
      const luminanceA = (0.2126 * redA) + (0.7152 * greenA) + (0.0722 * blueA);
      const luminanceB = (0.2126 * redB) + (0.7152 * greenB) + (0.0722 * blueB);
      const colorDelta = (
        Math.abs(redA - redB)
        + Math.abs(greenA - greenB)
        + Math.abs(blueA - blueB)
      ) / 3;
      const alphaDelta = Math.abs(alphaA - alphaB) * 255;
      const contourA = primaryContourData
        ? (
          primaryContourData[index + 3] > 0
          && primaryContourData[index] > 120
          && primaryContourData[index] > primaryContourData[index + 1] + 24
          && primaryContourData[index] > primaryContourData[index + 2] + 24
        )
        : false;
      const contourB = secondaryContourData
        ? (
          secondaryContourData[index + 3] > 0
          && secondaryContourData[index] > 120
          && secondaryContourData[index] > secondaryContourData[index + 1] + 24
          && secondaryContourData[index] > secondaryContourData[index + 2] + 24
        )
        : false;
      const contourDelta = contourA !== contourB ? 56 : 0;
      const totalDelta = Math.max(colorDelta, alphaDelta * 1.35, contourDelta);

      if (totalDelta < 24) {
        continue;
      }

      const secondaryDominant = contourA !== contourB
        ? contourB
        : (alphaB > alphaA + 0.08 || luminanceB >= luminanceA);
      if (secondaryDominant) {
        output[index] = 64;
        output[index + 1] = 214;
        output[index + 2] = 255;
      } else {
        output[index] = 255;
        output[index + 1] = 111;
        output[index + 2] = 84;
      }

      output[index + 3] = clamp(Math.round((totalDelta - 18) * 4.1), 0, 210);
    }

    outputContext.putImageData(outputImage, 0, 0);
    const processedBlob = await new Promise((resolve) => outputCanvas.toBlob(resolve, "image/png"));
    if (!processedBlob) {
      return secondaryAssetPath;
    }
    const objectUrl = URL.createObjectURL(processedBlob);
    state.processedHighlightAssetCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    return secondaryAssetPath;
  }
}

function walkCoordinates(coordinates, callback) {
  if (!Array.isArray(coordinates)) {
    return;
  }
  if (typeof coordinates[0] === "number") {
    callback(coordinates);
    return;
  }
  coordinates.forEach((child) => walkCoordinates(child, callback));
}

function geometryExtent(features) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  features.forEach((feature) => {
    walkCoordinates(feature?.geometry?.coordinates, ([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

function normaliseProjectedPoint(coordinate, extent) {
  const xSpan = Math.max(1, extent.maxX - extent.minX);
  const ySpan = Math.max(1, extent.maxY - extent.minY);
  return {
    x: clamp(((coordinate[0] - extent.minX) / xSpan) * 100, 0, 100),
    y: clamp(((extent.maxY - coordinate[1]) / ySpan) * 100, 0, 100)
  };
}

function polygonLabelPoint(points) {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  return {
    x: (Math.min(...xValues) + Math.max(...xValues)) / 2,
    y: (Math.min(...yValues) + Math.max(...yValues)) / 2
  };
}

  async function loadSharedSectionGeometry(projectId, areaId) {
    const asset = await fetchJsonAsset(sharedAreaAssetCandidates(projectId, areaId, "line-length.geojson"));
    const features = asset?.json?.features || [];
    const explicitTracks = EXPLICIT_SECTION_IMAGE_TRACKS[areaId];
    if (explicitTracks?.length && features.length) {
      const sortedFeatures = [...features].sort((a, b) => {
        const aOrder = Number(a?.properties?.sort_order || 0);
        const bOrder = Number(b?.properties?.sort_order || 0);
        return aOrder - bOrder;
      });
      return new Map(sortedFeatures.map((feature, index) => {
        const calibration = explicitTracks[index] || explicitTracks[explicitTracks.length - 1];
        const track = explicitTrackToSectionTrack(calibration);
        return [
          feature?.properties?.section_id || feature?.properties?.label,
          {
            hotspot: {
              x: (track.start.x + track.end.x) / 2,
              y: (track.start.y + track.end.y) / 2
            },
            track
          }
        ];
      }));
    }
    const overlayPath = await resolveExistingAsset(sharedAreaAssetCandidates(projectId, areaId, "section_lines.png"));
    const detectedTracks = overlayPath ? await detectSectionTracksFromImage(overlayPath, features.length) : [];
    if (detectedTracks.length === features.length && detectedTracks.length) {
    const sortedFeatures = [...features].sort((a, b) => {
      const aOrder = Number(a?.properties?.sort_order || 0);
      const bOrder = Number(b?.properties?.sort_order || 0);
      return aOrder - bOrder;
    });
    const sortedTracks = [...detectedTracks].sort((a, b) => a.hotspot.x - b.hotspot.x);
    return new Map(sortedFeatures.map((feature, index) => ([
      feature?.properties?.section_id || feature?.properties?.label,
      sortedTracks[index]
    ])));
  }
  const extent = geometryExtent(features);
  if (!extent) {
    return null;
  }

  const geometryMap = new Map();
  features.forEach((feature) => {
    const coordinates = feature?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return;
    }
    const points = coordinates.map((coordinate) => normaliseProjectedPoint(coordinate, extent));
    const start = points[0];
    const end = points[points.length - 1];
    const sectionId = feature?.properties?.section_id || feature?.properties?.label;
    if (!sectionId) {
      return;
    }
    geometryMap.set(sectionId, {
      hotspot: {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      },
      track: { start, end, points }
    });
  });

  return geometryMap;
}

async function detectSectionTracksFromImage(imagePath, expectedCount) {
  if (state.sectionTrackCache.has(imagePath)) {
    return state.sectionTrackCache.get(imagePath);
  }

  const tracks = await new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const targetWidth = Math.min(1400, image.width);
      const scale = targetWidth / image.width;
      const targetHeight = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        resolve([]);
        return;
      }
      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      const { data } = context.getImageData(0, 0, targetWidth, targetHeight);
      const points = [];

      for (let y = 0; y < targetHeight; y += 1) {
        for (let x = 0; x < targetWidth; x += 1) {
          const offset = ((y * targetWidth) + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const a = data[offset + 3];
          if (a > 0 && r > 180 && g < 100 && b < 100) {
            points.push({ x, y });
          }
        }
      }

      if (!points.length || !expectedCount) {
        resolve([]);
        return;
      }

      const minX = Math.min(...points.map((point) => point.x));
      const maxX = Math.max(...points.map((point) => point.x));
      const centroids = Array.from({ length: expectedCount }, (_, index) => (
        minX + (((index + 0.5) / expectedCount) * (maxX - minX))
      ));

      let clusters = Array.from({ length: expectedCount }, () => []);
      for (let iteration = 0; iteration < 10; iteration += 1) {
        clusters = Array.from({ length: expectedCount }, () => []);
        points.forEach((point) => {
          let bestIndex = 0;
          let bestDistance = Math.abs(point.x - centroids[0]);
          for (let index = 1; index < centroids.length; index += 1) {
            const distance = Math.abs(point.x - centroids[index]);
            if (distance < bestDistance) {
              bestIndex = index;
              bestDistance = distance;
            }
          }
          clusters[bestIndex].push(point);
        });

        centroids.forEach((_, index) => {
          if (clusters[index].length) {
            centroids[index] = clusters[index].reduce((sum, point) => sum + point.x, 0) / clusters[index].length;
          }
        });
      }

      const extracted = clusters
        .filter((cluster) => cluster.length)
        .map((cluster) => {
          const minY = Math.min(...cluster.map((point) => point.y));
          const maxY = Math.max(...cluster.map((point) => point.y));
          const topPoints = cluster.filter((point) => point.y <= minY + 3);
          const bottomPoints = cluster.filter((point) => point.y >= maxY - 3);
          const topX = topPoints.reduce((sum, point) => sum + point.x, 0) / Math.max(1, topPoints.length);
          const bottomX = bottomPoints.reduce((sum, point) => sum + point.x, 0) / Math.max(1, bottomPoints.length);
          const start = { x: (topX / targetWidth) * 100, y: (minY / targetHeight) * 100 };
          const end = { x: (bottomX / targetWidth) * 100, y: (maxY / targetHeight) * 100 };
          return {
            hotspot: {
              x: (start.x + end.x) / 2,
              y: (start.y + end.y) / 2
            },
            track: {
              start,
              end,
              points: [start, end]
            }
          };
        });

      resolve(extracted);
    };
    image.onerror = () => resolve([]);
    image.src = imagePath;
  });

  state.sectionTrackCache.set(imagePath, tracks);
  return tracks;
}

function applySharedSectionGeometry(area, geometryMap) {
  if (!geometryMap?.size) {
    return area;
  }
  return {
    ...area,
    sections: area.sections.map((section) => {
      const override = geometryMap.get(section.id);
      return override ? { ...section, ...override } : section;
    })
  };
}

async function loadSharedAreaPolygons(projectId, areaId) {
  const asset = await fetchJsonAsset(sharedAreaAssetCandidates(projectId, areaId, "sandbar-polygons.geojson"));
  const features = asset?.json?.features || [];
  const extent = geometryExtent(features);
  if (!extent) {
    return [];
  }

  return features.map((feature, index) => {
    const geometry = feature?.geometry;
    const rings = geometry?.type === "Polygon"
      ? geometry.coordinates
      : geometry?.type === "MultiPolygon"
        ? geometry.coordinates[0]
        : null;
    const ring = rings?.[0];
    if (!Array.isArray(ring) || ring.length < 3) {
      return null;
    }
    const points = ring.map((coordinate) => normaliseProjectedPoint(coordinate, extent));
    return {
      id: feature?.properties?.sandbar_id || `SB-${areaId}-${String(index + 1).padStart(2, "0")}`,
      label: feature?.properties?.label || `${volumeChangeSettings.rowLabelFallback} ${index + 1}`,
      areaId: feature?.properties?.area_id || areaId,
      notes: feature?.properties?.notes || "",
      sortOrder: Number(feature?.properties?.sort_order || index + 1),
      points,
      centroid: polygonLabelPoint(points)
    };
  }).filter(Boolean).sort((a, b) => a.sortOrder - b.sortOrder);
}

function normaliseCompareKey(value) {
  return String(value || "").trim().toLowerCase();
}

function mergeVolumePolygons(configuredRows = [], sharedPolygons = []) {
  if (!sharedPolygons.length) {
    return configuredRows;
  }

  const remainingRows = [...configuredRows];
  const merged = sharedPolygons.map((polygon, index) => {
    let rowIndex = remainingRows.findIndex((row) => normaliseCompareKey(row.label) === normaliseCompareKey(polygon.label));
    if (rowIndex === -1 && remainingRows[index]) {
      rowIndex = index;
    }
    const row = rowIndex >= 0 ? remainingRows.splice(rowIndex, 1)[0] : null;
    return {
      ...polygon,
      ...(row || {}),
      id: polygon.id,
      label: polygon.label,
      notes: polygon.notes
    };
  });

  return merged.concat(remainingRows);
}

function renderVolumePolygonOverlay(target, polygons = []) {
  target.innerHTML = polygons
    .filter((polygon) => Array.isArray(polygon.points) && polygon.points.length >= 3)
    .map((polygon) => {
      const pointString = polygon.points.map((point) => `${fixed(point.x, 2)},${fixed(point.y, 2)}`).join(" ");
      return `
        <g>
          <polygon points="${pointString}"></polygon>
          <text x="${fixed(polygon.centroid?.x ?? 50, 2)}" y="${fixed(polygon.centroid?.y ?? 50, 2)}">${escapeHtml(polygon.label)}</text>
        </g>
      `;
    }).join("");
}

function preferredSecondarySurveyId() {
  const selected = currentSurvey();
  return selected.comparisonBaseline
    || currentProject().surveys.find((survey) => survey.id !== selected.id)?.id
    || selected.id;
}

function defaultSectionComparisonSurveyIds() {
  return Array.from(new Set([state.surveyId, preferredSecondarySurveyId()].filter(Boolean)));
}

function mergeSectionComparisonSurveyIds(preferred = [], existing = []) {
  const validIds = new Set(currentProject().surveys.map((survey) => survey.id));
  const source = existing.length ? existing : preferred;
  const merged = Array.from(new Set(source.filter((id) => validIds.has(id))));
  return merged.length ? merged : [state.surveyId];
}

function activeSectionComparisonSurveyIds() {
  state.sectionComparisonSurveyIds = mergeSectionComparisonSurveyIds(defaultSectionComparisonSurveyIds(), state.sectionComparisonSurveyIds);
  return state.sectionComparisonSurveyIds;
}

function updateSectionFullscreenButton() {
  const isFullscreen = document.fullscreenElement === els.sectionWorkspace;
  els.sectionFullscreenBtn.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
}

function updateViewerFullscreenButton() {
  const isFullscreen = document.fullscreenElement === els.layerWorkspace;
  els.viewerFullscreenBtn.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
}

async function toggleSectionFullscreen() {
  if (document.fullscreenElement === els.sectionWorkspace) {
    await document.exitFullscreen();
    return;
  }
  await els.sectionWorkspace.requestFullscreen();
}

async function toggleViewerFullscreen() {
  if (document.fullscreenElement === els.layerWorkspace) {
    await document.exitFullscreen();
    return;
  }
  await els.layerWorkspace.requestFullscreen();
}

function zoom(multiplier) {
  state.scale = clamp(state.scale * multiplier, 1, 8);
  if (state.scale === 1) {
    state.panX = 0;
    state.panY = 0;
  }
  applyViewTransform();
}

function touchPoint(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY
  };
}

function handleViewerTouchStart(event) {
  if (event.target.closest("#transparencyControls")) {
    return;
  }
  state.activeTouchGesture = true;
  state.viewerPointers.clear();

  if (event.touches.length >= 2) {
    state.touchGestureMode = "pinch";
    const first = touchPoint(event.touches[0]);
    const second = touchPoint(event.touches[1]);
    beginViewerPinchFromPair(first, second);
    event.preventDefault();
    return;
  }

  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  state.lastTouchX = touch.clientX;
  state.lastTouchY = touch.clientY;
  if (state.compareMode === "slider" && state.scale <= 1) {
    state.touchGestureMode = "swipe";
    updateSwipeFromClientX(touch.clientX);
    event.preventDefault();
    return;
  }
  if (state.scale > 1) {
    state.touchGestureMode = "pan";
    state.isPanning = true;
    event.preventDefault();
  }
}

function handleViewerTouchMove(event) {
  if (!state.activeTouchGesture) {
    return;
  }

  if (event.touches.length >= 2) {
    if (state.touchGestureMode !== "pinch") {
      state.touchGestureMode = "pinch";
      beginViewerPinchFromPair(touchPoint(event.touches[0]), touchPoint(event.touches[1]));
    } else {
      updateViewerPinchFromPair(touchPoint(event.touches[0]), touchPoint(event.touches[1]));
    }
    event.preventDefault();
    return;
  }

  const touch = event.touches[0];
  if (!touch) {
    return;
  }

  if (state.touchGestureMode === "swipe" && state.compareMode === "slider" && state.scale <= 1) {
    updateSwipeFromClientX(touch.clientX);
    event.preventDefault();
    return;
  }

  if (state.touchGestureMode === "pan" && state.scale > 1) {
    state.panX += touch.clientX - state.lastTouchX;
    state.panY += touch.clientY - state.lastTouchY;
    state.lastTouchX = touch.clientX;
    state.lastTouchY = touch.clientY;
    applyViewTransform();
    event.preventDefault();
  }
}

function handleViewerTouchEnd(event) {
  if (event.touches.length >= 2) {
    beginViewerPinchFromPair(touchPoint(event.touches[0]), touchPoint(event.touches[1]));
    event.preventDefault();
    return;
  }
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    state.lastTouchX = touch.clientX;
    state.lastTouchY = touch.clientY;
    state.touchGestureMode = state.scale > 1 ? "pan" : null;
    state.pinchStartDistance = null;
    event.preventDefault();
    return;
  }
  state.activeTouchGesture = false;
  state.touchGestureMode = null;
  state.isPanning = false;
  state.pinchStartDistance = null;
  state.pinchStartCenter = null;
  state.pinchStageCenter = null;
  applyViewTransform();
}

function viewerPointerPair() {
  const pointers = Array.from(state.viewerPointers.values());
  if (pointers.length < 2) {
    return null;
  }
  return [pointers[0], pointers[1]];
}

function pointerDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function pointerCenter(first, second) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2
  };
}

function beginViewerPinch() {
  const pair = viewerPointerPair();
  if (!pair) {
    return;
  }
  beginViewerPinchFromPair(pair[0], pair[1]);
}

function beginViewerPinchFromPair(first, second) {
  const stageRect = els.viewerStage.getBoundingClientRect();
  state.isPanning = false;
  state.isDraggingSwipe = false;
  state.activeViewerPointerId = null;
  state.pinchStartDistance = Math.max(1, pointerDistance(first, second));
  state.pinchStartScale = state.scale;
  state.pinchStartPanX = state.panX;
  state.pinchStartPanY = state.panY;
  state.pinchStartCenter = pointerCenter(first, second);
  state.pinchStageCenter = {
    x: stageRect.left + (stageRect.width / 2),
    y: stageRect.top + (stageRect.height / 2)
  };
}

function updateViewerPinch() {
  const pair = viewerPointerPair();
  if (!pair) {
    return;
  }
  updateViewerPinchFromPair(pair[0], pair[1]);
}

function updateViewerPinchFromPair(first, second) {
  if (!first || !second || !state.pinchStartDistance || !state.pinchStartCenter || !state.pinchStageCenter) {
    return;
  }
  const nextCenter = pointerCenter(first, second);
  const nextDistance = Math.max(1, pointerDistance(first, second));
  const nextScale = clamp(state.pinchStartScale * (nextDistance / state.pinchStartDistance), 1, 8);
  const startRelativeX = state.pinchStartCenter.x - state.pinchStageCenter.x - state.pinchStartPanX;
  const startRelativeY = state.pinchStartCenter.y - state.pinchStageCenter.y - state.pinchStartPanY;
  const scaleRatio = nextScale / Math.max(state.pinchStartScale, 0.001);

  state.scale = nextScale;
  state.panX = nextCenter.x - state.pinchStageCenter.x - (startRelativeX * scaleRatio);
  state.panY = nextCenter.y - state.pinchStageCenter.y - (startRelativeY * scaleRatio);
  if (state.scale === 1) {
    state.panX = 0;
    state.panY = 0;
  }
  applyViewTransform();
}

function resetView() {
  state.scale = 1;
  state.panX = 0;
  state.panY = 0;
  state.isPanning = false;
  state.isDraggingSwipe = false;
  state.activeViewerPointerId = null;
  state.viewerPointers.clear();
  state.pinchStartDistance = null;
  applyViewTransform();
}

function applyViewTransform() {
  clampPanToBounds();
  els.viewerTransform.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
  els.viewerStage.classList.toggle("is-pannable", state.scale > 1 && !state.isPanning);
  els.viewerStage.classList.toggle("is-panning", state.isPanning);
  updateSliderMask();
}

function clampPanToBounds() {
  if (state.scale <= 1) {
    state.panX = 0;
    state.panY = 0;
    return;
  }

  const metrics = getViewerImageMetrics();
  if (!metrics) {
    return;
  }

  const maxPanX = Math.max(0, ((metrics.displayWidth * state.scale) - metrics.stageWidth) / 2);
  const maxPanY = Math.max(0, ((metrics.displayHeight * state.scale) - metrics.stageHeight) / 2);
  state.panX = clamp(state.panX, -maxPanX, maxPanX);
  state.panY = clamp(state.panY, -maxPanY, maxPanY);
}

function getViewerImageMetrics() {
  const stageRect = els.viewerStage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) {
    return null;
  }

  const image = [els.viewerBaseImage, els.viewerOverlayImage, els.viewerSliderImage]
    .find((item) => item.naturalWidth > 0 && item.naturalHeight > 0);

  if (!image) {
    return null;
  }

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const stageRatio = stageRect.width / stageRect.height;
  let displayWidth = stageRect.width;
  let displayHeight = stageRect.height;

  if (imageRatio > stageRatio) {
    displayHeight = stageRect.width / imageRatio;
  } else {
    displayWidth = stageRect.height * imageRatio;
  }

  return {
    stageWidth: stageRect.width,
    stageHeight: stageRect.height,
    displayWidth,
    displayHeight
  };
}

function syncTransparencyControls(canCompare) {
  const showControls = state.compareMode === "transparency" && canCompare;
  els.transparencyControls.classList.toggle("hidden", !showControls);
  els.primaryOpacityRange.disabled = !showControls;
  els.secondaryOpacityRange.disabled = !showControls;
  els.primaryOpacityRange.value = String(Math.round(state.primaryOpacity * 100));
  els.secondaryOpacityRange.value = String(Math.round(state.secondaryOpacity * 100));
}

function applyViewerOpacities() {
  const baseOpacity = state.compareMode === "transparency" ? state.primaryOpacity : 1;
  const overlayOpacity = state.compareMode === "transparency" ? state.secondaryOpacity : 1;
  els.viewerBaseImage.style.opacity = String(baseOpacity);
  els.viewerTransparencyOverlay.style.opacity = String(overlayOpacity);
  els.viewerSliderOverlay.style.opacity = "1";
  els.viewerGuideDsmOverlay.style.opacity = state.showGuideDsm ? "0.38" : "0";
  els.viewerGuideContourOverlay.style.opacity = state.showGuideContours ? "0.92" : "0";
  els.viewerHighlightOverlay.style.opacity = state.showChangeHighlight ? "0.82" : "0";
}

function renderCompareHighlightLegend({ canHighlight, primarySurvey, secondarySurvey, contourAssisted = false }) {
  if (!els.compareHighlightLegend) {
    return;
  }
  if (!(state.showChangeHighlight && canHighlight)) {
    els.compareHighlightLegend.classList.add("hidden");
    els.compareHighlightLegend.innerHTML = "";
    return;
  }

  els.compareHighlightLegend.classList.remove("hidden");
  els.compareHighlightLegend.innerHTML = `
    <span class="compare-highlight-legend__item">
      <span class="compare-highlight-legend__swatch compare-highlight-legend__swatch--secondary"></span>
      <span>${secondarySurvey.shortDate} is higher or more exposed here</span>
    </span>
    <span class="compare-highlight-legend__item">
      <span class="compare-highlight-legend__swatch compare-highlight-legend__swatch--primary"></span>
      <span>${primarySurvey.shortDate} is higher or more exposed here</span>
    </span>
  `;
}

async function buildSurveyCoverage(project, survey) {
  const areaCoverage = await Promise.all(areas().map(async (area) => {
    const expected = Object.values(imageryLayers(area)).map((layer) => layer.fileName);
    const checks = await Promise.all(expected.map(async (fileName) => ({
      fileName,
      exists: Boolean(await resolveExistingAsset(surveyAssetCandidates(project.id, survey.id, area.id, fileName)))
    })));
    const presentFiles = checks.filter((item) => item.exists).map((item) => item.fileName);
    const missingFiles = checks.filter((item) => !item.exists).map((item) => item.fileName);
    const presentCount = presentFiles.length;
    const totalCount = expected.length;
    return {
      areaId: area.id,
      areaLabel: area.label,
      presentFiles,
      missingFiles,
      presentCount,
      totalCount,
      statusLabel: presentCount === 0 ? "Missing" : presentCount === totalCount ? "Complete" : "Partial"
    };
  }));

  return {
    completeAreas: areaCoverage.filter((item) => item.presentCount === item.totalCount).length,
    partialAreas: areaCoverage.filter((item) => item.presentCount > 0 && item.presentCount < item.totalCount).length,
    missingAreas: areaCoverage.filter((item) => item.presentCount === 0).length,
    presentFiles: areaCoverage.reduce((sum, item) => sum + item.presentCount, 0),
    totalFiles: areaCoverage.reduce((sum, item) => sum + item.totalCount, 0),
    areas: areaCoverage
  };
}

function buildViewerCaption({ area, primaryLayer, secondaryLayer, primarySurvey, secondarySurvey, primaryExists, secondaryExists, mode }) {
  if (!primaryExists) {
    return `No ${primaryLayer.label.toLowerCase()} asset has been uploaded yet for ${primarySurvey.label} in ${primarySurvey.assetFolder}/${area.id}/.`;
  }

  if (mode === "single") {
    return `${primaryLayer.description} Viewing ${primarySurvey.label} for ${area.label}.`;
  }

  if (primarySurvey.id === secondarySurvey.id) {
    if (primaryLayer.fileName !== secondaryLayer.fileName) {
      return `Comparing ${primaryLayer.label} and ${secondaryLayer.label} within ${primarySurvey.shortDate} for ${area.label}.`;
    }
    return `Choose a different secondary survey or a different secondary layer to compare ${primarySurvey.shortDate}.`;
  }

  if (!secondaryExists) {
    return `Primary image is loaded from ${primarySurvey.shortDate}, but the secondary ${secondaryLayer.label.toLowerCase()} image is missing for ${secondarySurvey.label}.`;
  }

  if (mode === "transparency") {
    return `Transparency comparison: ${primarySurvey.shortDate} ${primaryLayer.label} as the base image with ${secondarySurvey.shortDate} ${secondaryLayer.label} overlaid for ${area.label}.`;
  }

  if (mode === "slider") {
    return `Slider comparison: drag the handle to compare ${primarySurvey.shortDate} ${primaryLayer.label} and ${secondarySurvey.shortDate} ${secondaryLayer.label} for ${area.label}.`;
  }

  return `${primaryLayer.description} Viewing ${primarySurvey.label} for ${area.label}.`;
}

function compareModeInsight(mode, canCompare, primaryLabel, secondaryLabel) {
  if (!canCompare) {
    return "Use Single View while the second survey or second view is still missing. Overlay and Swipe will unlock as soon as the matching comparison image is available.";
  }

  if (mode === "transparency") {
    return `Overlay lets us fade ${primaryLabel.toLowerCase()} and ${secondaryLabel.toLowerCase()} together so edge shifts, channel drift, and exposed ground changes stand out faster.`;
  }

  if (mode === "slider") {
    return "Swipe is best when you want to inspect one shoreline, bar edge, or channel line closely from side to side.";
  }

  return "Single View is the cleanest way to inspect one image first, then switch on Overlay or Swipe once you know where to focus.";
}

function overlayInsight({ showGuideDsm, showGuideContours, showChangeHighlight }) {
  const active = [];
  if (showGuideDsm) active.push("colour elevation guide");
  if (showGuideContours) active.push("contour guide");
  if (showChangeHighlight) active.push("change highlight");

  if (!active.length) {
    return "Turn on the guide toggles when you want extra help reading slope, shape, contours, or likely areas of change.";
  }

  return `Active helpers: ${active.join(", ")}. These overlays add context without forcing you out of the main comparison view.`;
}

function compareObservationHint(primaryLabel, secondaryLabel, mode) {
  if (mode === "slider") {
    return `Drag the swipe handle along bar crests, channel edges, and wet-dry boundaries to compare ${primaryLabel.toLowerCase()} against ${secondaryLabel.toLowerCase()} edge by edge.`;
  }

  if (mode === "transparency") {
    return "Look for doubled edges, offset contours, and sandbar outlines that no longer sit on top of each other. Those usually show the story quickest.";
  }

  return `Start by reading the ${primaryLabel.toLowerCase()} on its own, then bring in ${secondaryLabel.toLowerCase()} or a second survey once you know which feature you want to inspect more closely.`;
}

function updateSwipeFromClientX(clientX) {
  const rect = els.viewerStage.getBoundingClientRect();
  if (!rect.width) {
    return;
  }
  state.swipePercent = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
  updateSliderMask();
}

function updateSliderMask() {
  const percent = `${state.swipePercent}%`;
  els.viewerSliderOverlay.style.clipPath = `inset(0 ${100 - state.swipePercent}% 0 0)`;
  els.sliderHandle.style.left = percent;
}

async function loadManifest(projectId, surveyId, areaId) {
  const manifestPath = surveyAssetPath(projectId, surveyId, areaId, "manifest.json");
  try {
    const response = await fetch(manifestPath);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

async function assetExists(src) {
  if (state.assetStatusCache.has(src)) {
    return state.assetStatusCache.get(src);
  }

  let result;
  if (src.endsWith(".csv") || src.endsWith(".json")) {
    result = await fetch(src).then((response) => response.ok).catch(() => false);
  } else {
    result = await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = src;
    });
  }

  state.assetStatusCache.set(src, result);
  return result;
}

async function uploadSelectedFiles() {
  const uploads = assetSettings.expectedSurveyAssets.map((item) => ({
    input: byId(item.inputId),
    fileName: item.fileName
  }));
  const selected = uploads.filter((item) => item.input.files && item.input.files[0]);

  if (!selected.length) {
    els.adminUploadStatus.innerHTML = detail("Status", "No files selected yet.");
    return;
  }

  els.adminUploadStatus.innerHTML = detail("Status", `Uploading ${selected.length} file(s) to ${currentSurvey().assetFolder}/${currentArea().id}/.`);

  const results = [];
  for (const item of selected) {
    const file = item.input.files[0];
    const contentBase64 = await readFileAsBase64(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: currentProject().id,
        surveyId: currentSurvey().id,
        areaId: currentArea().id,
        fileName: item.fileName,
        contentBase64
      })
    });
    const payload = await response.json().catch(() => ({}));
    results.push({
      ok: response.ok,
      fileName: item.fileName,
      message: payload.message || payload.error || (response.ok ? "Uploaded" : "Upload failed")
    });
  }

  state.assetStatusCache.clear();
  renderOverview();
  renderLayers();
  renderSections();
  renderAdminIfEnabled();

  els.adminUploadStatus.innerHTML = results.map((result) => detail(result.fileName, `${result.ok ? "Uploaded" : "Failed"}: ${result.message}`)).join("");
  uploads.forEach((item) => {
    item.input.value = "";
  });
}

async function saveAreaMetadata() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const fields = serialiseAreaMetadataForm();

  els.areaMetadataStatus.innerHTML = detail(
    "Save survey area notes",
    `Saving survey-specific context for ${area.overviewCode} in ${survey.label}...`
  );

  const response = await fetch("/api/survey-area-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project.id,
      surveyId: survey.id,
      areaId: area.id,
      fields
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    els.areaMetadataStatus.innerHTML = detail("Save survey area notes", payload.error || "Could not save the survey-specific area notes.");
    return;
  }

  project.surveyAreaOverrides = project.surveyAreaOverrides || {};
  project.surveyAreaOverrides[survey.id] = project.surveyAreaOverrides[survey.id] || {};
  project.surveyAreaOverrides[survey.id][area.id] = payload.override;
  renderAll();
  activateTab("admin");
  els.areaMetadataStatus.innerHTML = detail(
    "Save survey area notes",
    `${area.overviewCode} now has survey-specific monitoring notes for ${survey.label}.`
  );
}

async function resetAreaMetadata() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();

  els.areaMetadataStatus.innerHTML = detail(
    "Reset survey area notes",
    `Resetting ${area.overviewCode} back to its baseline notes for ${survey.label}...`
  );

  const response = await fetch("/api/survey-area-metadata/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project.id,
      surveyId: survey.id,
      areaId: area.id
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    els.areaMetadataStatus.innerHTML = detail("Reset survey area notes", payload.error || "Could not reset the survey-specific area notes.");
    return;
  }

  if (project.surveyAreaOverrides?.[survey.id]) {
    delete project.surveyAreaOverrides[survey.id][area.id];
    if (!Object.keys(project.surveyAreaOverrides[survey.id]).length) {
      delete project.surveyAreaOverrides[survey.id];
    }
  }
  renderAll();
  activateTab("admin");
  els.areaMetadataStatus.innerHTML = detail(
    "Reset survey area notes",
    `${area.overviewCode} is back on its baseline notes for ${survey.label}.`
  );
}

async function saveVolumeChange() {
  const project = currentProject();
  const survey = currentSurvey();
  const area = currentArea();
  const rows = parseVolumeRows(els.volumeRowsInput.value);

  els.volumeAdminStatus.innerHTML = detail(
    "Volume change",
    `Saving ${rows.length} sandbar row(s) for ${area.overviewCode} in ${survey.label}...`
  );

  const response = await fetch("/api/volume-change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project.id,
      surveyId: survey.id,
      areaId: area.id,
      method: els.volumeMethodInput.value.trim(),
      cellSize: els.volumeCellSizeInput.value.trim(),
      notes: els.volumeNotesInput.value.trim(),
      polygons: rows
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    els.volumeAdminStatus.innerHTML = detail("Volume change", payload.error || "Could not save the sandbar volume results.");
    return;
  }

  project.volumeChangeComparisons = project.volumeChangeComparisons || {};
  project.volumeChangeComparisons[survey.id] = project.volumeChangeComparisons[survey.id] || {
    baselineSurveyId: survey.comparisonBaseline || null,
    areas: {}
  };
  project.volumeChangeComparisons[survey.id].baselineSurveyId = payload.record.baselineSurveyId;
  project.volumeChangeComparisons[survey.id].method = payload.record.method;
  project.volumeChangeComparisons[survey.id].cellSize = payload.record.cellSize;
  project.volumeChangeComparisons[survey.id].areas = project.volumeChangeComparisons[survey.id].areas || {};
  project.volumeChangeComparisons[survey.id].areas[area.id] = payload.record.area;

  renderAll();
  activateTab("admin");
  els.volumeAdminStatus.innerHTML = detail(
    "Volume change",
    `${rows.length} sandbar row(s) saved for ${area.overviewCode} in ${survey.label}.`
  );
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const commaIndex = text.indexOf(",");
      resolve(commaIndex >= 0 ? text.slice(commaIndex + 1) : text);
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

async function createSurveyRound() {
  const name = els.newSurveyName.value.trim();
  const dateFrom = els.newSurveyStart.value;
  const dateTo = els.newSurveyEnd.value;
  const baselineSurveyId = els.newSurveyBaseline.value || currentProject().surveys[currentProject().surveys.length - 1]?.id || null;

  if (!name || !dateFrom || !dateTo) {
    els.createSurveyStatus.innerHTML = detail("Create survey round", "Please give the survey a name, a start date, and an end date.");
    return;
  }

  if (dateTo < dateFrom) {
    els.createSurveyStatus.innerHTML = detail("Create survey round", "The end date needs to be the same as or later than the start date.");
    return;
  }

  els.createSurveyStatus.innerHTML = detail("Create survey round", `Creating ${name} and preparing the survey folders...`);

  const response = await fetch("/api/surveys/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: currentProject().id,
      name,
      dateFrom,
      dateTo,
      comparisonBaseline: baselineSurveyId
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    els.createSurveyStatus.innerHTML = detail("Create survey round", payload.error || "Could not create the new survey round.");
    return;
  }

  currentProject().surveys.push(payload.survey);
  currentProject().surveys.sort((a, b) => String(a.dateFrom).localeCompare(String(b.dateFrom)));
  state.surveyId = payload.survey.id;
  state.primarySurveyId = payload.survey.id;
  state.secondarySurveyId = payload.survey.comparisonBaseline || preferredSecondarySurveyId();
  state.sectionComparisonSurveyIds = defaultSectionComparisonSurveyIds();
  state.assetStatusCache.clear();
  els.newSurveyName.value = "";
  els.newSurveyStart.value = "";
  els.newSurveyEnd.value = "";
  els.createSurveyStatus.innerHTML = detail("Create survey round", `${payload.survey.label} created and ready for uploads.`);
  renderAll();
  activateTab("admin");
}

function renderCoverageCard(item) {
  const presentText = item.presentFiles.length ? `Present: ${item.presentFiles.join(", ")}` : "No expected files uploaded yet.";
  const missingText = item.missingFiles.length ? `Missing: ${item.missingFiles.join(", ")}` : "All expected files are present.";
  return `
    <article class="card">
      <p class="muted">${escapeHtml(item.areaLabel)} - ${escapeHtml(item.statusLabel)}</p>
      <h3>${item.presentCount}/${item.totalCount} files present</h3>
      <p>${escapeHtml(presentText)}</p>
      <p>${escapeHtml(missingText)}</p>
    </article>
  `;
}

function activateTab(tabName) {
  const safeTab = (!adminToolsEnabled() || !state.adminMode) && tabName === "admin"
    ? "overview"
    : tabName;
  if (safeTab !== "sections") {
    closeSectionInsightOverlay();
  }
  state.activeTab = safeTab;
  document.querySelectorAll(".tab").forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === safeTab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === safeTab);
  });
  renderShellToolbar();
  renderShellStage();
  syncUrlState();
}

function syncAdminVisibility() {
  const canShowAdmin = adminToolsEnabled() && state.adminMode;
  document.querySelectorAll("[data-admin-only='true']").forEach((item) => {
    item.classList.toggle("hidden", !canShowAdmin);
  });
  els.adminModeToggle.classList.toggle("hidden", !adminToolsEnabled() || (!isLocalHost() && !state.adminMode));
  els.adminModeToggle.textContent = state.adminMode ? "Close Admin Console" : "Open Admin Console";
  if (!canShowAdmin && state.activeTab === "admin") {
    activateTab("overview");
  } else {
    activateTab(state.activeTab || "overview");
  }
}

function adminToolsEnabled() {
  return projectConfig.showAdminTools === true;
}

function isLocalHost() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

async function toggleAdminMode() {
  if (!adminToolsEnabled()) {
    return;
  }

  if (state.adminMode) {
    state.adminMode = false;
    window.localStorage.removeItem("fsm-admin-mode");
    syncAdminVisibility();
    return;
  }

  const password = window.prompt("Enter the admin password to open the admin console:");
  if (!password) {
    return;
  }

  const response = await fetch("/api/admin-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    window.alert(payload.error || "Could not open the admin console.");
    return;
  }

  state.adminMode = true;
  window.localStorage.setItem("fsm-admin-mode", "1");
  syncAdminVisibility();
  activateTab("admin");
}

function capitalise(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fillSelect(select, options, value) {
  select.innerHTML = options.map(([id, label]) => `<option value="${escapeAttr(id)}">${escapeHtml(label)}</option>`).join("");
  select.value = value;
}

function metric(label, value, subtext) {
  return `<article class="card"><p class="muted">${escapeHtml(label)}</p><h3>${escapeHtml(value)}</h3><p>${escapeHtml(subtext)}</p></article>`;
}

function detail(title, copy) {
  return `<div class="detail-item"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(copy)}</p></div>`;
}

function assetCard(title, copy) {
  return `<article class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`;
}

function sectionInsightCard({ eyebrow, title, summary, body }) {
  return `
    <button
      class="section-insight-card"
      type="button"
      data-section-insight="true"
      data-section-insight-eyebrow="${escapeAttr(eyebrow)}"
      data-section-insight-title="${escapeAttr(title)}"
      data-section-insight-summary="${escapeAttr(summary)}"
      data-section-insight-body="${escapeAttr(body)}"
    >
      <span class="section-insight-card__eyebrow">${escapeHtml(eyebrow)}</span>
      <strong class="section-insight-card__title">${escapeHtml(title)}</strong>
      <span class="section-insight-card__summary">${escapeHtml(summary)}</span>
      <span class="section-insight-card__action">Open detail</span>
    </button>
  `;
}

function openSectionInsightOverlay(eyebrow, title, summary, body) {
  els.sectionInsightOverlayEyebrow.textContent = eyebrow;
  els.sectionInsightOverlayTitle.textContent = title;
  els.sectionInsightOverlaySummary.textContent = summary;
  els.sectionInsightOverlayBody.innerHTML = `<p>${escapeHtml(body)}</p>`;
  els.sectionInsightOverlay.classList.remove("hidden");
  els.sectionInsightOverlay.setAttribute("aria-hidden", "false");
}

function closeSectionInsightOverlay() {
  els.sectionInsightOverlay.classList.add("hidden");
  els.sectionInsightOverlay.setAttribute("aria-hidden", "true");
}

function fixed(value, digits) {
  return Number(value).toFixed(digits);
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
