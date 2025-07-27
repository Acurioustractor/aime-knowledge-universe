import { getDatabase } from './database/connection';

// Export getDb function that matches what the API files expect
export async function getDb() {
  return getDatabase();
}

// Also export the ContentRepository for convenience
export { getContentRepository, ContentRepository } from './database/connection';