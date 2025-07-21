/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as challenges from "../challenges.js";
import type * as fitness from "../fitness.js";
import type * as goals from "../goals.js";
import type * as leaderboards from "../leaderboards.js";
import type * as notes from "../notes.js";
import type * as openai from "../openai.js";
import type * as social from "../social.js";
import type * as streaks from "../streaks.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  challenges: typeof challenges;
  fitness: typeof fitness;
  goals: typeof goals;
  leaderboards: typeof leaderboards;
  notes: typeof notes;
  openai: typeof openai;
  social: typeof social;
  streaks: typeof streaks;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
