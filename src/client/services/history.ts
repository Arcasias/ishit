interface Command {
  action: (...args: any) => any;
  cancel: (...args: any) => any;
}

export const makeHistoryManager = (maxSize: number) => {
  let activeCommands: Command[] = [];
  let inactiveCommands: Command[] = [];
  return {
    add(action: (...args: any) => any, cancel: (...args: any) => any) {
      action();
      activeCommands.push({ action, cancel });
      if (activeCommands.length > maxSize) {
        activeCommands.shift();
      }
    },
    undo() {
      if (!activeCommands.length) {
        return;
      }
      const item = activeCommands.pop()!;
      item.cancel();
      inactiveCommands.push(item);
    },
    redo() {
      if (!inactiveCommands.length) {
        return;
      }
      const item = inactiveCommands.pop()!;
      item.action();
      activeCommands.push(item);
    },
    clear() {
      activeCommands = [];
      inactiveCommands = [];
    },
  };
};
