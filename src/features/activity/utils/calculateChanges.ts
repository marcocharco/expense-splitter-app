// Helper to calculate changes between two objects
export function calculateChanges<T extends Record<string, any>>(
  before: T,
  after: T,
  fieldsToTrack: (keyof T)[]
): Array<{ field: string; before: any; after: any }> {
  const changes: Array<{ field: string; before: any; after: any }> = [];

  for (const field of fieldsToTrack) {
    const beforeValue = before[field];
    const afterValue = after[field];

    // Deep comparison for objects/arrays
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changes.push({
        field: String(field),
        before: beforeValue,
        after: afterValue,
      });
    }
  }

  return changes;
}



