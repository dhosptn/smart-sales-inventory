export function normalizeData(parsedData: any[]) {
  return parsedData.map((row) => {
    const normalized: any = {};
    for (const key in row) {
      if (!key) continue;

      // rapihin header → lowercase & underscore
      const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');

      normalized[cleanKey] = row[key]?.toString().trim?.() || '';
    }
    return normalized;
  });
}
