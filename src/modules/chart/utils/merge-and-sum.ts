
export const mergeAndSum = async (tables: any[]): Promise<any> => {
    const merged: Record<string, number[]> = {};

    for (const table of tables) {
        if (!table?.labels || !Array.isArray(table.labels)) continue;

        for (const row of table.labels) {
            if (!Array.isArray(row) || row.length === 0) continue;

            const label = String(row[0]);
            // Extract values (rest of the row), converting to numbers
            const values = row.slice(1).map(v => Number(v) || 0);

            if (!merged[label]) {
                merged[label] = values;
            } else {
                // Sum values element-wise
                merged[label] = merged[label].map((val, idx) => val + (values[idx] || 0));

                // Handle case where new row might be longer than existing
                if (values.length > merged[label].length) {
                    merged[label].push(...values.slice(merged[label].length));
                }
            }
        }
    }

    // Convert map back to array format: [ [label, val1, val2...], ... ]
    const resultLabels = Object.entries(merged).map(([label, values]) => {
        return [label, ...values];
    });

    return { labels: resultLabels };
};
