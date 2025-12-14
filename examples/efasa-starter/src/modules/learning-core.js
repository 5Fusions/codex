// Logs interaction events so you can improve Efasa while keeping ownership of the data.
// Wire this to your storage layer (local DB, encrypted file, or API) once you pick a backend.
// Do not store personal client data here unless users provide it explicitly and consent to its handling.

export function logInteraction(event) {
  // Example shape: { event: 'start-crawler-clicked', timestamp: '2024-09-15T12:00:00Z' }
  console.info('[Efasa learning]', event);
}
