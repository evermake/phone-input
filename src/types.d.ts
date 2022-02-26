declare interface HandlersMap {
  input?: (event: InputEvent) => void
  paste?: (event: ClipboardEvent) => void
}
