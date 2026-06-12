const SAVE_TO_JOURNAL_KEY = 'hrv_save_to_journal'

export function getSaveToJournal(): boolean {
  return localStorage.getItem(SAVE_TO_JOURNAL_KEY) === 'true'
}

export function setSaveToJournal(enabled: boolean): void {
  localStorage.setItem(SAVE_TO_JOURNAL_KEY, String(enabled))
}
