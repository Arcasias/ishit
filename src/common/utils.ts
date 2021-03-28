export function log(...message: string[]) {
  const styles: string[] = [];
  const msg = message
    .join(" ")
    .replace(/\{\{([\w\s#\(\),)]+)\}\}/g, (_, color) => {
      styles.push(`color:${color}`);
      return "%c";
    });
  console.log(msg, ...styles);
}

export function getGoogleImageUrl(query: string): string {
  const formatted = query.replace(/\s+/g, "+");
  return `https://www.google.com/search?q=${formatted}&tbm=isch`;
}

export function range(n: number): number[] {
  return [...new Array(n)].map((_, i) => i);
}

export function ipcMainLog(...message: string[]) {
  return log(`{{#6610f2}}[IPC-MAIN]{{inherit}}`, ...message);
}

export function ipcRendererLog(...message: string[]) {
  return log(`{{#007bff}}[IPC-RENDERER]{{inherit}}`, ...message);
}
