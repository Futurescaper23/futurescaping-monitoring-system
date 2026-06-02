import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { areaSettings, assetSettings } from "./src/data/areas.js";
import { environmentalContext } from "./src/data/environmentalContext.js";
import { surveySettings } from "./src/data/surveys.js";
import { volumeChangeSettings } from "./src/data/volumeChange.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 3080);
const WORLDTIDES_API_KEY = process.env.WORLDTIDES_API_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TIDE_LATITUDE = environmentalContext.tide.latitude;
const TIDE_LONGITUDE = environmentalContext.tide.longitude;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".csv": "text/csv; charset=utf-8"
};

http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "POST" && url.pathname === "/api/upload") {
    await handleUploadRequest(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/surveys/create") {
    await handleSurveyCreateRequest(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/admin-auth") {
    await handleAdminAuthRequest(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/survey-area-metadata") {
    await handleSurveyAreaMetadataRequest(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/survey-area-metadata/reset") {
    await handleSurveyAreaMetadataResetRequest(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/volume-change") {
    await handleVolumeChangeRequest(request, response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/weather") {
    await handleWeatherRequest(url, response);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/tides") {
    await handleTideRequest(url, response);
    return;
  }

  const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(__dirname, requestPath));

  if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`FutureScaping monitoring system running at http://localhost:${port}`);
});

async function handleUploadRequest(request, response) {
  try {
    const body = await readJsonBody(request);
    const { projectId, surveyId, areaId, fileName, contentBase64 } = body;

    if (!projectId || !surveyId || !areaId || !fileName || !contentBase64) {
      sendJson(response, 400, { error: "projectId, surveyId, areaId, fileName, and contentBase64 are required." });
      return;
    }

    const allowedFiles = new Set(expectedSurveyFileNames());
    if (!allowedFiles.has(fileName)) {
      sendJson(response, 400, { error: `Unsupported file name: ${fileName}` });
      return;
    }

    const areaDir = path.join(__dirname, "survey-data", projectId, surveyId, areaId);
    const safeAreaDir = path.normalize(areaDir);
    if (!safeAreaDir.startsWith(path.join(__dirname, "survey-data"))) {
      sendJson(response, 400, { error: "Invalid target path." });
      return;
    }

    fs.mkdirSync(safeAreaDir, { recursive: true });
    const filePath = path.join(safeAreaDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(contentBase64, "base64"));

    const manifestPath = path.join(safeAreaDir, "manifest.json");
    writeManifest(manifestPath, projectId, surveyId, areaId, safeAreaDir);

    sendJson(response, 200, {
      message: `Uploaded ${fileName} to ${projectId}/${surveyId}/${areaId}.`
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleSurveyCreateRequest(request, response) {
  try {
    const body = await readJsonBody(request);
    const { projectId, name, dateFrom, dateTo, comparisonBaseline } = body;

    if (!projectId || !name || !dateFrom || !dateTo) {
      sendJson(response, 400, { error: "projectId, name, dateFrom, and dateTo are required." });
      return;
    }

    if (dateTo < dateFrom) {
      sendJson(response, 400, { error: "dateTo must be the same as or later than dateFrom." });
      return;
    }

    const projectsPath = path.join(__dirname, "data", "projects.json");
    const dataset = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = dataset.projects.find((item) => item.id === projectId);
    if (!project) {
      sendJson(response, 404, { error: `Project not found: ${projectId}` });
      return;
    }

    const id = dateFrom;
    if (project.surveys.some((survey) => survey.id === id)) {
      sendJson(response, 409, { error: `A survey round already exists for ${dateFrom}.` });
      return;
    }

    const surveyNumber = project.surveys.length + 1;
    const survey = {
      id,
      label: `${name} - ${formatDateRangeLabel(dateFrom, dateTo)}`,
      shortDate: formatShortDateRange(dateFrom, dateTo),
      dateFrom,
      dateTo,
      status: surveySettings.initialStatus,
      readiness: surveySettings.initialReadiness,
      assetFolder: formatAssetFolder(projectId, id),
      dataFolder: surveySettings.dataFolderFromSurveyId ? id : dateFrom,
      comparisonBaseline: comparisonBaseline || project.surveys[project.surveys.length - 1]?.id || null,
      notes: `${name} created from the admin console as survey round ${surveyNumber}.`
    };

    project.surveys.push(survey);
    project.surveys.sort((a, b) => String(a.dateFrom).localeCompare(String(b.dateFrom)));
    fs.writeFileSync(projectsPath, JSON.stringify(dataset, null, 2));

    const surveyBase = path.join(__dirname, "survey-data", projectId, id);
    for (let n = 1; n <= areaSettings.count; n += 1) {
      const areaId = `${areaSettings.idPrefix}${n}`;
      const areaDir = path.join(surveyBase, areaId);
      fs.mkdirSync(areaDir, { recursive: true });
      writeManifest(path.join(areaDir, "manifest.json"), projectId, id, areaId, areaDir);
    }

    sendJson(response, 200, { survey });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleSurveyAreaMetadataRequest(request, response) {
  try {
    const body = await readJsonBody(request);
    const { projectId, surveyId, areaId, fields } = body;

    if (!projectId || !surveyId || !areaId || !fields || typeof fields !== "object") {
      sendJson(response, 400, { error: "projectId, surveyId, areaId, and fields are required." });
      return;
    }

    const projectsPath = path.join(__dirname, "data", "projects.json");
    const dataset = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = dataset.projects.find((item) => item.id === projectId);
    if (!project) {
      sendJson(response, 404, { error: `Project not found: ${projectId}` });
      return;
    }

    const survey = project.surveys.find((item) => item.id === surveyId);
    if (!survey) {
      sendJson(response, 404, { error: `Survey not found: ${surveyId}` });
      return;
    }

    const allowed = new Set([
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
    ]);

    const override = {};
    for (const [key, value] of Object.entries(fields)) {
      if (!allowed.has(key)) {
        continue;
      }
      if (key === "tags") {
        override.tags = Array.isArray(value)
          ? value.map((item) => String(item).trim()).filter(Boolean)
          : [];
        continue;
      }
      if (key === "tideScore") {
        const number = Number.parseInt(String(value), 10);
        override.tideScore = Number.isFinite(number) ? number : 0;
        continue;
      }
      override[key] = String(value ?? "").trim();
    }

    project.surveyAreaOverrides = project.surveyAreaOverrides || {};
    project.surveyAreaOverrides[surveyId] = project.surveyAreaOverrides[surveyId] || {};
    project.surveyAreaOverrides[surveyId][areaId] = override;
    fs.writeFileSync(projectsPath, JSON.stringify(dataset, null, 2));

    sendJson(response, 200, { override });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleSurveyAreaMetadataResetRequest(request, response) {
  try {
    const body = await readJsonBody(request);
    const { projectId, surveyId, areaId } = body;

    if (!projectId || !surveyId || !areaId) {
      sendJson(response, 400, { error: "projectId, surveyId, and areaId are required." });
      return;
    }

    const projectsPath = path.join(__dirname, "data", "projects.json");
    const dataset = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = dataset.projects.find((item) => item.id === projectId);
    if (!project) {
      sendJson(response, 404, { error: `Project not found: ${projectId}` });
      return;
    }

    if (project.surveyAreaOverrides?.[surveyId]) {
      delete project.surveyAreaOverrides[surveyId][areaId];
      if (!Object.keys(project.surveyAreaOverrides[surveyId]).length) {
        delete project.surveyAreaOverrides[surveyId];
      }
    }

    fs.writeFileSync(projectsPath, JSON.stringify(dataset, null, 2));
    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleVolumeChangeRequest(request, response) {
  try {
    const body = await readJsonBody(request);
    const { projectId, surveyId, areaId, method, cellSize, notes, polygons } = body;

    if (!projectId || !surveyId || !areaId || !Array.isArray(polygons)) {
      sendJson(response, 400, { error: "projectId, surveyId, areaId, and polygons are required." });
      return;
    }

    const projectsPath = path.join(__dirname, "data", "projects.json");
    const dataset = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = dataset.projects.find((item) => item.id === projectId);
    if (!project) {
      sendJson(response, 404, { error: `Project not found: ${projectId}` });
      return;
    }

    const survey = project.surveys.find((item) => item.id === surveyId);
    if (!survey) {
      sendJson(response, 404, { error: `Survey not found: ${surveyId}` });
      return;
    }

    const cleanedPolygons = polygons.map((item, index) => ({
      id: item.id || `bar_${String(index + 1).padStart(2, "0")}`,
      label: String(item.label || `${volumeChangeSettings.rowLabelFallback} ${index + 1}`).trim(),
      gainM3: Number(item.gainM3 || 0),
      lossM3: Number(item.lossM3 || 0),
      netM3: Number(item.netM3 || 0),
      confidence: String(item.confidence || volumeChangeSettings.defaultConfidence).trim(),
      summary: String(item.summary || volumeChangeSettings.defaultSummary).trim()
    }));

    project.volumeChangeComparisons = project.volumeChangeComparisons || {};
    project.volumeChangeComparisons[surveyId] = project.volumeChangeComparisons[surveyId] || {
      baselineSurveyId: survey.comparisonBaseline || null,
      areas: {}
    };
    project.volumeChangeComparisons[surveyId].baselineSurveyId = survey.comparisonBaseline || project.volumeChangeComparisons[surveyId].baselineSurveyId || null;
    project.volumeChangeComparisons[surveyId].method = String(method || "").trim();
    project.volumeChangeComparisons[surveyId].cellSize = String(cellSize || "").trim();
    project.volumeChangeComparisons[surveyId].areas = project.volumeChangeComparisons[surveyId].areas || {};
    project.volumeChangeComparisons[surveyId].areas[areaId] = {
      method: String(method || "").trim(),
      cellSize: String(cellSize || "").trim(),
      notes: String(notes || "").trim(),
      polygons: cleanedPolygons,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(projectsPath, JSON.stringify(dataset, null, 2));

    sendJson(response, 200, {
      record: {
        baselineSurveyId: project.volumeChangeComparisons[surveyId].baselineSurveyId,
        method: project.volumeChangeComparisons[surveyId].method,
        cellSize: project.volumeChangeComparisons[surveyId].cellSize,
        area: project.volumeChangeComparisons[surveyId].areas[areaId]
      }
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleAdminAuthRequest(request, response) {
  try {
    if (!ADMIN_PASSWORD) {
      sendJson(response, 500, { error: "Server configuration error: ADMIN_PASSWORD is not set." });
      return;
    }

    const body = await readJsonBody(request);
    const { password } = body;
    if (!password) {
      sendJson(response, 400, { error: "Password is required." });
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      sendJson(response, 401, { error: "Incorrect password." });
      return;
    }

    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

function writeManifest(manifestPath, projectId, surveyId, areaId, areaDir) {
  const expectedFiles = expectedSurveyFileNames();
  const presentFiles = expectedFiles.filter((fileName) => fs.existsSync(path.join(areaDir, fileName)));
  const status = presentFiles.length === 0
    ? "pending-upload"
    : presentFiles.length === expectedFiles.length
      ? "complete"
      : "partial";

  const payload = {
    projectId,
    surveyId,
    areaId,
    expectedFiles,
    presentFiles,
    missingFiles: expectedFiles.filter((fileName) => !presentFiles.includes(fileName)),
    status,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2));
}

function expectedSurveyFileNames() {
  return assetSettings.expectedSurveyAssets.map((item) => item.fileName);
}

function formatAssetFolder(projectId, surveyId) {
  return surveySettings.assetFolderPattern
    .replace("{projectId}", projectId)
    .replace("{surveyId}", surveyId);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function formatDateRangeLabel(dateFrom, dateTo) {
  const start = new Date(`${dateFrom}T12:00:00`);
  const end = new Date(`${dateTo}T12:00:00`);
  const startDay = String(start.getDate());
  const endDay = String(end.getDate());
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const month = start.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  if (sameMonth) {
    return `${startDay} and ${endDay} ${month}`;
  }
  const startLabel = start.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const endLabel = end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `${startLabel} to ${endLabel}`;
}

function formatShortDateRange(dateFrom, dateTo) {
  const start = new Date(`${dateFrom}T12:00:00`);
  const end = new Date(`${dateTo}T12:00:00`);
  const startDay = String(start.getDate());
  const endDay = String(end.getDate());
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const month = start.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  if (sameMonth) {
    return `${startDay}-${endDay} ${month}`;
  }
  const startLabel = start.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const endLabel = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${startLabel} to ${endLabel}`;
}

async function handleWeatherRequest(url, response) {
  try {
    const source = url.searchParams.get("source");
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (!source || !latitude || !longitude || !startDate || !endDate) {
      sendJson(response, 400, { error: "source, latitude, longitude, start_date, and end_date are required." });
      return;
    }

    const baseUrl = source === "forecast"
      ? "https://api.open-meteo.com/v1/forecast"
      : "https://archive-api.open-meteo.com/v1/archive";

    const upstream = new URL(baseUrl);
    upstream.searchParams.set("latitude", latitude);
    upstream.searchParams.set("longitude", longitude);
    upstream.searchParams.set("start_date", startDate);
    upstream.searchParams.set("end_date", endDate);
    upstream.searchParams.set("hourly", "temperature_2m,precipitation,windspeed_10m,windgusts_10m,pressure_msl");
    upstream.searchParams.set("timezone", "Europe/London");

    const upstreamResponse = await fetch(upstream);
    const text = await upstreamResponse.text();
    response.writeHead(upstreamResponse.status, {
      "Content-Type": "application/json; charset=utf-8"
    });
    response.end(text);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function handleTideRequest(url, response) {
  try {
    if (!WORLDTIDES_API_KEY) {
      sendJson(response, 500, { error: "Server configuration error: WORLDTIDES_API_KEY is not set." });
      return;
    }

    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (!startDate || !endDate) {
      sendJson(response, 400, { error: "start_date and end_date are required." });
      return;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const days = Math.max(1, Math.ceil((end - start) / 86400000) + 1);

    const upstream = new URL("https://www.worldtides.info/api/v3");
    upstream.searchParams.set("key", WORLDTIDES_API_KEY);
    upstream.searchParams.set("lat", TIDE_LATITUDE);
    upstream.searchParams.set("lon", TIDE_LONGITUDE);
    upstream.searchParams.set("date", startDate);
    upstream.searchParams.set("days", String(days));
    upstream.searchParams.set("datum", environmentalContext.tide.datum);
    upstream.searchParams.set("localtime", "");
    upstream.searchParams.set("heights", "");
    upstream.searchParams.set("extremes", "");

    const upstreamResponse = await fetch(upstream);
    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      sendJson(response, upstreamResponse.status, { error: `WorldTides API error ${upstreamResponse.status}: ${errorText}` });
      return;
    }

    const data = await upstreamResponse.json();
    const items = (data.heights || []).map((item) => ({
      time: item.date || new Date(item.dt * 1000).toISOString(),
      value: item.height
    }));
    const extremes = (data.extremes || []).map((item) => ({
      time: item.date || new Date(item.dt * 1000).toISOString(),
      value: item.height,
      type: item.type
    }));
    sendJson(response, 200, {
      items,
      extremes,
      datum: data.datum || data.responseDatum || environmentalContext.tide.datum,
      timezone: data.timezone || null
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}
