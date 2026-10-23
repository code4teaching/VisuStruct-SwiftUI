/**
 * Speicherort des Workspace: ein echter Ordner (Chrome/Edge, File System Access API) oder,
 * wo der Browser das nicht kann (iPad, Safari, Firefox), ein Ordnerbaum in IndexedDB.
 * Beide sehen für die Spalte „Dateien“ gleich aus (`WsDir`).
 */

export interface WsEntry {
  kind: 'file' | 'directory'
  name: string
}

export interface WsDir {
  readonly name: string
  list(): Promise<WsEntry[]>
  /** Unterordner; ohne `create` Fehler, wenn er fehlt. */
  dir(name: string, create?: boolean): Promise<WsDir>
  read(name: string): Promise<string>
  write(name: string, text: string): Promise<void>
  has(name: string): Promise<boolean>
  /** Datei oder Ordner samt Inhalt. */
  remove(name: string): Promise<void>
}

// MARK: - Echter Ordner

// Teile der File System Access API, die TypeScript noch nicht kennt.
type PermissionHandle = FileSystemDirectoryHandle & {
  queryPermission?(o: { mode: 'readwrite' }): Promise<PermissionState>
  requestPermission?(o: { mode: 'readwrite' }): Promise<PermissionState>
  values(): AsyncIterable<FileSystemHandle>
}
type DirectoryPickerWindow = Window & { showDirectoryPicker?: (o?: object) => Promise<FileSystemDirectoryHandle> }

export const canPickFolder = () => typeof (window as DirectoryPickerWindow).showDirectoryPicker === 'function'

class NativeDir implements WsDir {
  constructor(readonly handle: FileSystemDirectoryHandle) {}

  get name() {
    return this.handle.name
  }

  async list(): Promise<WsEntry[]> {
    const out: WsEntry[] = []
    for await (const entry of (this.handle as PermissionHandle).values()) {
      if (entry.name.startsWith('.')) continue
      out.push({ kind: entry.kind, name: entry.name })
    }
    return out
  }

  async dir(name: string, create = false): Promise<WsDir> {
    return new NativeDir(await this.handle.getDirectoryHandle(name, { create }))
  }

  async read(name: string): Promise<string> {
    return (await (await this.handle.getFileHandle(name)).getFile()).text()
  }

  async write(name: string, text: string): Promise<void> {
    const file = await this.handle.getFileHandle(name, { create: true })
    const out = await file.createWritable()
    await out.write(text)
    await out.close()
  }

  async has(name: string): Promise<boolean> {
    try {
      await this.handle.getFileHandle(name)
      return true
    } catch {
      try {
        await this.handle.getDirectoryHandle(name)
        return true
      } catch {
        return false
      }
    }
  }

  async remove(name: string): Promise<void> {
    await this.handle.removeEntry(name, { recursive: true })
  }
}

// MARK: - Im Browser (IndexedDB)

const dbName = 'visustruct-workspace'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore('files')
      req.result.createObjectStore('meta')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run<T>(store: 'files' | 'meta', mode: IDBTransactionMode, body: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const req = body(db.transaction(store, mode).objectStore(store))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** Pfade wie `11FI1/2026-10-23/Rechner.visustruct`; ein Ordner ist ein Eintrag mit `/` am Ende. */
class BrowserDir implements WsDir {
  constructor(
    readonly name: string,
    private path: string,
  ) {}

  private key(name: string) {
    return this.path + name
  }

  async list(): Promise<WsEntry[]> {
    const keys = (await run('files', 'readonly', (s) => s.getAllKeys())) as string[]
    const seen = new Map<string, WsEntry>()
    for (const key of keys) {
      if (!key.startsWith(this.path) || key === this.path) continue
      const rest = key.slice(this.path.length)
      const slash = rest.indexOf('/')
      const name = slash < 0 ? rest : rest.slice(0, slash)
      if (!seen.has(name)) seen.set(name, { kind: slash < 0 ? 'file' : 'directory', name })
    }
    return [...seen.values()]
  }

  async dir(name: string, create = false): Promise<WsDir> {
    const key = this.key(name) + '/'
    const exists = (await run('files', 'readonly', (s) => s.count(key))) > 0
    if (!exists) {
      if (!create) throw new DOMException(name, 'NotFoundError')
      await run('files', 'readwrite', (s) => s.put('', key))
    }
    return new BrowserDir(name, key)
  }

  async read(name: string): Promise<string> {
    const text = await run('files', 'readonly', (s) => s.get(this.key(name)))
    if (typeof text !== 'string') throw new DOMException(name, 'NotFoundError')
    return text
  }

  async write(name: string, text: string): Promise<void> {
    await run('files', 'readwrite', (s) => s.put(text, this.key(name)))
  }

  async has(name: string): Promise<boolean> {
    const n = await run('files', 'readonly', (s) => s.count(this.key(name)))
    const d = await run('files', 'readonly', (s) => s.count(this.key(name) + '/'))
    return n + d > 0
  }

  async remove(name: string): Promise<void> {
    const prefix = this.key(name)
    await run('files', 'readwrite', (s) => s.delete(prefix))
    // Ordner: alles darunter (Schlüssel von `prefix/` bis `prefix/￿`).
    await run('files', 'readwrite', (s) => s.delete(IDBKeyRange.bound(prefix + '/', prefix + '/￿')))
  }
}

// MARK: - Welcher Workspace

export type WorkspaceKind = 'folder' | 'browser'

export interface Workspace {
  kind: WorkspaceKind
  root: WsDir
}

/** Ordner wählen (nur Chrome/Edge). Der Ordner wird gemerkt, damit er nach dem Neuladen wieder da ist. */
export async function pickFolder(): Promise<Workspace> {
  const handle = await (window as DirectoryPickerWindow).showDirectoryPicker!({ id: 'visustruct-workspace', mode: 'readwrite' })
  await run('meta', 'readwrite', (s) => s.put(handle, 'folder'))
  return { kind: 'folder', root: new NativeDir(handle) }
}

export function browserWorkspace(): Workspace {
  return { kind: 'browser', root: new BrowserDir('VisuStruct', '') }
}

/** Gemerkter Ordner: `ready` = sofort nutzbar; sonst muss der Browser erst (mit einem Klick) fragen dürfen. */
export async function storedFolder(): Promise<{ handle: FileSystemDirectoryHandle; ready: boolean } | undefined> {
  try {
    const handle = (await run('meta', 'readonly', (s) => s.get('folder'))) as PermissionHandle | undefined
    if (!handle) return undefined
    const state = (await handle.queryPermission?.({ mode: 'readwrite' })) ?? 'granted'
    return { handle, ready: state === 'granted' }
  } catch {
    return undefined
  }
}

/** Nach dem Neuladen: Zugriff auf den gemerkten Ordner erneut erlauben (braucht einen Klick). */
export async function reopenFolder(handle: FileSystemDirectoryHandle): Promise<Workspace | undefined> {
  const state = (await (handle as PermissionHandle).requestPermission?.({ mode: 'readwrite' })) ?? 'granted'
  return state === 'granted' ? { kind: 'folder', root: new NativeDir(handle) } : undefined
}

export async function forgetFolder(): Promise<void> {
  try {
    await run('meta', 'readwrite', (s) => s.delete('folder'))
  } catch {
    /* nichts gemerkt */
  }
}
