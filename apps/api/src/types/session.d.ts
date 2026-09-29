import "express-session";
declare module "express-session" {
  interface SessionData { userId?: string; oauthState?: string; oauthProvider?: "google" | "meta"; csrfToken?: string; oauthReturnTo?: "extension"; extensionRedirectUri?: string; }
}
