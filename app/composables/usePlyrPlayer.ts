let plyrModule: any = null;

async function loadPlyr() {
  if (!plyrModule) {
    const [{ default: Plyr }] = await Promise.all([
      import("plyr"),
      import("plyr/dist/plyr.css"),
    ]);
    plyrModule = Plyr;
  }
  return plyrModule;
}

export function usePlyrPlayer() {
  const instances = new Map<string | number, any>();

  const createPlayer = async (
    element: HTMLElement,
    options: object,
    key: string | number = "default",
  ) => {
    const Plyr = await loadPlyr();
    const player = new Plyr(element, options);
    instances.set(key, player);
    return player;
  };

  const destroyPlayer = (key: string | number = "default") => {
    const player = instances.get(key);
    if (player) {
      player.destroy();
      instances.delete(key);
    }
  };

  const destroyAll = () => {
    instances.forEach((player) => player.destroy());
    instances.clear();
  };

  onBeforeUnmount(() => {
    destroyAll();
  });

  return { createPlayer, destroyPlayer, destroyAll };
}
