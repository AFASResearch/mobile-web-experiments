export interface DataService {
  isOnline: () => boolean;
  horizon: any;
}

export let createDataService = (horizon: any, scheduleRender: () => void): DataService => {
  let status = 'unconnected';
  horizon.status((evt: { type: string }) => {
    status = evt.type;
    scheduleRender();
  }, (error: any) => {
    console.error('horizon connection error', error);
  });

  return {
    horizon,
    isOnline: () => status === 'ready'
  };
};
