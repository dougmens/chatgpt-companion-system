// src/mcp/types/oidc-provider.d.ts
declare module "oidc-provider" {
  export type KoaContextWithOIDC = any;

  export class Provider {
    constructor(issuer: string, configuration: any);
    callback(): any;
    use(middleware: any): void;
  }
}
