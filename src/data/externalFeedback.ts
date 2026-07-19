import { Driver, EntityType, FeedbackEntry, SentimentType } from "../types";

export interface ExternalFeedbackRow {
  id?: string;
  driverId?: string;
  driverName?: string;
  entityType?: EntityType;
  sentiment?: SentimentType;
  sentiment_label?: SentimentType;
  score?: number;
  rating?: number;
  text?: string;
  tweet_text?: string;
  feedback_text?: string;
  comment?: string;
  created_at?: string;
  tags?: string[] | string;
  source?: string;
}

const textFields: Array<keyof ExternalFeedbackRow> = [
  "text",
  "tweet_text",
  "feedback_text",
  "comment",
];

const clampScore = (value: number): number => Math.min(5, Math.max(1, value));

const sentimentFromScore = (score: number): SentimentType => {
  if (score >= 4) return "positive";
  if (score >= 3) return "neutral";
  return "negative";
};

const readText = (row: ExternalFeedbackRow): string => {
  for (const field of textFields) {
    const value = row[field];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return "";
};

const readTags = (tags: ExternalFeedbackRow["tags"]): string[] => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const readScore = (row: ExternalFeedbackRow): number => {
  const score = Number(row.score ?? row.rating ?? 3);
  return Number.isFinite(score) ? clampScore(score) : 3;
};

const findDriver = (
  row: ExternalFeedbackRow,
  drivers: Driver[],
  index: number,
): Driver | undefined => {
  if (drivers.length === 0) return undefined;

  const matched = drivers.find((driver) => driver.id === row.driverId);
  return matched ?? drivers[index % drivers.length];
};

export const externalFeedbackRowsToEntries = (
  rows: ExternalFeedbackRow[],
  drivers: Driver[],
): FeedbackEntry[] =>
  rows
    .map((row, index): FeedbackEntry | null => {
      const text = readText(row);
      if (text === "") return null;

      const driver = findDriver(row, drivers, index);
      if (!driver) return null;

      const score = readScore(row);
      const sentiment =
        row.sentiment ?? row.sentiment_label ?? sentimentFromScore(score);

      return {
        id: row.id ?? `EXT${String(index + 1).padStart(6, "0")}`,
        entityType: row.entityType ?? "driver",
        sentiment,
        score,
        timestamp: row.created_at ?? new Date().toISOString(),
        text,
        tags: readTags(row.tags),
        driverId: driver.id,
        driverName: row.driverName ?? driver.name,
      };
    })
    .filter((entry): entry is FeedbackEntry => entry !== null);

export const demoXquikFeedbackRows: ExternalFeedbackRow[] = [
  {
    id: "XQ000001",
    driverId: "DRV0001",
    source: "Xquik",
    tweet_text: "Driver arrived early and kept the ride comfortable.",
    sentiment_label: "positive",
    score: 5,
    tags: ["Early Arrival", "Comfortable"],
  },
  {
    id: "XQ000002",
    driverId: "DRV0002",
    source: "Xquik",
    tweet_text: "Pickup was late and the route changed without warning.",
    sentiment_label: "negative",
    score: 2,
    tags: ["Late Pickup", "Wrong Route"],
  },
];
