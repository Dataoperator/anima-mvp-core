declare interface Window {
  ic?: {
    plug?: {
      agent: any;
      createActor: <T>(args: any) => T;
      requestConnect: (args?: {
        whitelist: string[];
        host?: string;
      }) => Promise<boolean>;
      isConnected: () => Promise<boolean>;
      disconnect: () => Promise<void>;
      requestTransfer: (args: {
        to: string;
        amount: bigint;
        memo?: bigint;
        created?: number;
      }) => Promise<{ height: number }>;
      getPrincipal: () => Promise<Principal>;
    };
  };
}