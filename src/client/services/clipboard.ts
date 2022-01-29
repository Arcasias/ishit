interface ClipboardManager {
  load(): Promise<void>;
  copy(target: string | HTMLCanvasElement): Promise<boolean>;
}

export const makeClipboard = (): ClipboardManager => {
  let hasClipboardAccess = false;

  const copyCanvas = async (canvas: HTMLCanvasElement) => {
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const data = [new ClipboardItem({ "image/png": blob })];
    await navigator.clipboard.write(data);
    return true;
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    return true;
  };

  return {
    async load() {
      const status = await (<any>navigator.permissions).query({
        name: "clipboard-write",
      });
      hasClipboardAccess = status.state === "granted";
    },
    async copy(target) {
      if (!hasClipboardAccess) {
        return false;
      }
      if (target instanceof HTMLCanvasElement) {
        return copyCanvas(target);
      } else {
        return copyText(target);
      }
    },
  };
};
