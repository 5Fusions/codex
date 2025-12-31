#!/usr/bin/env -S NODE_NO_WARNINGS=1 pnpm ts-node-esm --files

import crypto from "node:crypto";
import http, { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";

interface LanguageProfile {
  code: string;
  name: string;
  modalities: Array<"text" | "voice">;
  proficiency: "native" | "fluent" | "working";
  focusAreas: string[];
}

interface CommandSpec {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  syntax: string;
  example: string;
}

interface KnowledgeItem {
  id: string;
  moduleId: string;
  topic: string;
  content: string;
  tags: string[];
  priority: number;
}

interface ModuleProfile {
  id: string;
  title: string;
  description: string;
  languages: string[];
  commandIds: string[];
  knowledgeIds: string[];
}

interface AgentResponse {
  message: string;
  chosenLanguage: string;
  voiceLine: string | null;
  relatedKnowledge: Array<{ id: string; topic: string; score: number }>;
  suggestedCommands: CommandSpec[];
}

interface BuildReadiness {
  ready: boolean;
  summary: string;
  missing: string[];
}

interface VoiceGameDesign {
  title: string;
  summary: string;
  entryFee: number;
  rewardPoolPercent: number;
  slashPercent: number;
  rounds: number;
  rngSeed: string;
  playerNames: string[];
  voiceOver: string[];
  commands: string[];
}

class AgentBrain {
  private languages = new Map<string, LanguageProfile>();
  private modules = new Map<string, ModuleProfile>();
  private knowledge = new Map<string, KnowledgeItem>();
  private commands = new Map<string, CommandSpec>();

  addLanguage(profile: LanguageProfile): LanguageProfile {
    this.languages.set(profile.code, profile);
    return profile;
  }

  createModule(input: Pick<ModuleProfile, "title" | "description">): ModuleProfile {
    const id = crypto.randomUUID();
    const module: ModuleProfile = {
      id,
      title: input.title,
      description: input.description,
      languages: [],
      commandIds: [],
      knowledgeIds: [],
    };
    this.modules.set(id, module);
    return module;
  }

  connectLanguage(moduleId: string, code: string): void {
    const module = this.requireModule(moduleId);
    if (!this.languages.has(code)) {
      throw new Error(`Language ${code} must be registered before linking to a module`);
    }
    if (!module.languages.includes(code)) {
      module.languages.push(code);
    }
  }

  addKnowledge(moduleId: string, input: Omit<KnowledgeItem, "id" | "moduleId">): KnowledgeItem {
    const module = this.requireModule(moduleId);
    const item: KnowledgeItem = { ...input, id: crypto.randomUUID(), moduleId };
    this.knowledge.set(item.id, item);
    module.knowledgeIds.push(item.id);
    return item;
  }

  addCommand(moduleId: string, input: Omit<CommandSpec, "id" | "moduleId">): CommandSpec {
    const module = this.requireModule(moduleId);
    const command: CommandSpec = { ...input, id: crypto.randomUUID(), moduleId };
    this.commands.set(command.id, command);
    module.commandIds.push(command.id);
    return command;
  }

  designStakeGame(prompt: string, moduleId?: string): VoiceGameDesign {
    const module = moduleId ? this.requireModule(moduleId) : undefined;
    const lower = prompt.toLowerCase();

    const parseNumber = (regex: RegExp, fallback: number): number => {
      const match = lower.match(regex);
      return match ? Number(match[1]) : fallback;
    };

    const entryFee = parseNumber(/(?:entry|bet|wager|buy[- ]in)[^0-9]*(\d+(?:\.\d+)?)/, 25);
    const rewardPoolPercent = parseNumber(/(\d{1,3})%[^%]*?(?:reward|payout|pool)/, 70);
    const slashPercent = parseNumber(/(\d{1,2})%[^%]*?(?:slash|penalt[y|ies]|rake)/, 15);
    const rounds = parseNumber(/(\d{1,2})\s+round/, 3);

    const guessedNames = new Set(
      (prompt.match(/\b[A-Z][a-z]{2,}\b/g) ?? [])
        .filter((name) => !["Build", "Design", "Voice", "Stake"].includes(name))
        .slice(0, 4),
    );
    if (guessedNames.size === 0) {
      ["Nova", "Rex", "Mira"].forEach((name) => guessedNames.add(name));
    }

    const rngSeed = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "voice-seed";

    const voiceOver = [
      "Opening match and locking stakes",
      `Playing ${rounds} rounds with narrated rolls and scorekeeping`,
      "Settling rewards, handling penalties, and unlocking balances",
    ];

    const commands = [
      ...[...guessedNames].map((name) => `register-player --name ${name}`),
      `open-match --entry ${entryFee} --reward ${rewardPoolPercent} --slash ${slashPercent} --rounds ${rounds} --seed ${rngSeed}`,
      "settle-match --id <matchId>",
    ];

    const moduleTitle = module?.title ?? "Stake Engine";

    return {
      title: `${moduleTitle} voice-designed match`,
      summary: `Voice designed match with ${guessedNames.size} players, entry ${entryFee}, reward ${rewardPoolPercent}% pool, ${slashPercent}% slash, ${rounds} rounds, seed ${rngSeed}.`,
      entryFee,
      rewardPoolPercent,
      slashPercent,
      rounds,
      rngSeed,
      playerNames: [...guessedNames],
      voiceOver,
      commands,
    };
  }

  respond(prompt: string, moduleId?: string, preferredLanguage?: string, voice?: boolean): AgentResponse {
    const module = moduleId ? this.requireModule(moduleId) : undefined;
    const lang = this.pickLanguage(module, preferredLanguage);
    const matches = this.rankKnowledge(prompt, module);
    const suggestedCommands = this.suggestCommands(module, prompt);

    const knowledgeText = matches
      .slice(0, 3)
      .map((item) => `• ${item.topic}: ${item.content}`)
      .join("\n");

    const message = [
      `Language: ${lang.name} (${lang.code})`,
      module ? `Module: ${module.title}` : "Module: general",
      "Response:",
      knowledgeText || "No matching knowledge yet — please teach me.",
    ].join("\n");

    const voiceLine = voice ? `🎙️ Narration ready in ${lang.name}` : null;

    return {
      message,
      chosenLanguage: lang.code,
      voiceLine,
      relatedKnowledge: matches.slice(0, 3).map((item) => ({
        id: item.id,
        topic: item.topic,
        score: item.priority,
      })),
      suggestedCommands,
    };
  }

  snapshot(): {
    languages: LanguageProfile[];
    modules: ModuleProfile[];
    commands: CommandSpec[];
    knowledge: KnowledgeItem[];
  } {
    return {
      languages: [...this.languages.values()],
      modules: [...this.modules.values()],
      commands: [...this.commands.values()],
      knowledge: [...this.knowledge.values()],
    };
  }

  buildReadiness(moduleId?: string): BuildReadiness {
    const missing: string[] = [];
    const targetModule = moduleId ? this.requireModule(moduleId) : undefined;

    if (this.languages.size === 0) {
      missing.push("register at least one language profile");
    }

    const moduleLanguages = targetModule?.languages ?? [];
    if (targetModule && moduleLanguages.length === 0) {
      missing.push(`link a language to module '${targetModule.title}'`);
    }

    const knowledgePool = targetModule
      ? targetModule.knowledgeIds.map((id) => this.requireKnowledge(id))
      : [...this.knowledge.values()];
    if (knowledgePool.length === 0) {
      missing.push(targetModule ? "add module knowledge" : "add knowledge items");
    }

    const commandPool = targetModule
      ? targetModule.commandIds.map((id) => this.requireCommand(id))
      : [...this.commands.values()];
    if (commandPool.length === 0) {
      missing.push(targetModule ? "add module commands" : "add commands");
    }

    if (targetModule) {
      const hasMatchFlow = knowledgePool.some((item) => /match|flow|round/i.test(item.topic));
      const hasPayouts = knowledgePool.some((item) => /payout|settle|slash/i.test(item.topic));
      const hasRegistration = knowledgePool.some((item) => /player|register|onboarding/i.test(item.topic));

      if (!hasRegistration) {
        missing.push("module is missing player onboarding knowledge");
      }
      if (!hasMatchFlow) {
        missing.push("module is missing match flow knowledge");
      }
      if (!hasPayouts) {
        missing.push("module is missing payouts/settlement knowledge");
      }
    }

    const ready = missing.length === 0;
    const contextTitle = targetModule ? `module '${targetModule.title}'` : "global brain";
    const summary = ready
      ? `Ready to build stake games with ${contextTitle}`
      : `Not ready to build stake games with ${contextTitle}`;

    return { ready, summary, missing };
  }

  private pickLanguage(module: ModuleProfile | undefined, preferred?: string): LanguageProfile {
    if (preferred && this.languages.has(preferred)) {
      return this.languages.get(preferred)!;
    }

    const moduleLanguage = module?.languages.find((code) => this.languages.has(code));
    if (moduleLanguage) {
      return this.languages.get(moduleLanguage)!;
    }

    const first = [...this.languages.values()][0];
    if (!first) {
      throw new Error("No languages registered in the brain yet");
    }
    return first;
  }

  private rankKnowledge(prompt: string, module: ModuleProfile | undefined): KnowledgeItem[] {
    const terms = new Set(
      prompt
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2),
    );

    const candidates = module
      ? module.knowledgeIds.map((id) => this.requireKnowledge(id))
      : [...this.knowledge.values()];

    return candidates
      .map((item) => ({
        item,
        score:
          item.priority +
          item.tags.reduce((acc, tag) => (terms.has(tag.toLowerCase()) ? acc + 2 : acc), 0) +
          (terms.has(item.topic.toLowerCase()) ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry) => ({ ...entry.item, priority: entry.score }));
  }

  private suggestCommands(module: ModuleProfile | undefined, prompt: string): CommandSpec[] {
    if (!module) {
      return [];
    }
    const terms = new Set(
      prompt
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2),
    );

    return module.commandIds
      .map((id) => this.requireCommand(id))
      .map((command) => ({
        command,
        score: [...terms].reduce((acc, term) => {
          const inName = command.name.toLowerCase().includes(term);
          const inDescription = command.description.toLowerCase().includes(term);
          return acc + (inName || inDescription ? 1 : 0);
        }, 0),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.command);
  }

  private requireModule(id: string): ModuleProfile {
    const module = this.modules.get(id);
    if (!module) {
      throw new Error(`Unknown module ${id}`);
    }
    return module;
  }

  private requireKnowledge(id: string): KnowledgeItem {
    const item = this.knowledge.get(id);
    if (!item) {
      throw new Error(`Unknown knowledge item ${id}`);
    }
    return item;
  }

  private requireCommand(id: string): CommandSpec {
    const command = this.commands.get(id);
    if (!command) {
      throw new Error(`Unknown command ${id}`);
    }
    return command;
  }
}

const readBody = async (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      if (!data.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", (error) => reject(error));
  });

class AgentBrainService {
  private server?: http.Server;
  private readonly brain: AgentBrain;

  constructor(brain: AgentBrain) {
    this.brain = brain;
  }

  async start(port: number): Promise<void> {
    if (this.server) {
      throw new Error("Service already running");
    }

    this.server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "", `http://${req.headers.host}`);
        await this.route(req, res, url);
      } catch (error) {
        this.respond(res, 500, { error: (error as Error).message });
      }
    });

    await new Promise<void>((resolve) => this.server!.listen(port, resolve));
    // eslint-disable-next-line no-console
    console.log(`AgentBrainService listening on http://localhost:${port}`);
  }

  async stop(): Promise<void> {
    if (!this.server) {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      this.server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    this.server = undefined;
  }

  private async route(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
    if (req.method === "POST" && url.pathname === "/admin/languages") {
      const payload = (await readBody(req)) as LanguageProfile;
      const profile = this.brain.addLanguage(payload);
      this.respond(res, 201, profile);
      return;
    }

    if (req.method === "POST" && url.pathname === "/admin/modules") {
      const payload = (await readBody(req)) as Pick<ModuleProfile, "title" | "description">;
      const module = this.brain.createModule(payload);
      this.respond(res, 201, module);
      return;
    }

    if (req.method === "POST" && url.pathname === "/admin/modules/connect-language") {
      const payload = (await readBody(req)) as { moduleId: string; languageCode: string };
      this.brain.connectLanguage(payload.moduleId, payload.languageCode);
      this.respond(res, 204, {});
      return;
    }

    if (req.method === "POST" && url.pathname === "/admin/knowledge") {
      const payload = (await readBody(req)) as Omit<KnowledgeItem, "id" | "moduleId"> & { moduleId: string };
      const item = this.brain.addKnowledge(payload.moduleId, payload);
      this.respond(res, 201, item);
      return;
    }

    if (req.method === "POST" && url.pathname === "/admin/commands") {
      const payload = (await readBody(req)) as Omit<CommandSpec, "id" | "moduleId"> & { moduleId: string };
      const command = this.brain.addCommand(payload.moduleId, payload);
      this.respond(res, 201, command);
      return;
    }

    if (req.method === "GET" && url.pathname === "/admin/brain") {
      this.respond(res, 200, this.brain.snapshot());
      return;
    }

    if (req.method === "POST" && url.pathname === "/agent/message") {
      const payload = (await readBody(req)) as {
        prompt: string;
        moduleId?: string;
        preferredLanguage?: string;
        voice?: boolean;
      };
      const reply = this.brain.respond(payload.prompt, payload.moduleId, payload.preferredLanguage, payload.voice);
      this.respond(res, 200, reply);
      return;
    }

    if (req.method === "GET" && url.pathname === "/agent/readiness") {
      const moduleId = url.searchParams.get("moduleId") ?? undefined;
      const readiness = this.brain.buildReadiness(moduleId ?? undefined);
      this.respond(res, 200, readiness);
      return;
    }

    if (req.method === "POST" && url.pathname === "/agent/voice-design") {
      const payload = (await readBody(req)) as {
        prompt: string;
        moduleId?: string;
        preferredLanguage?: string;
      };
      const design = this.brain.designStakeGame(payload.prompt, payload.moduleId);
      const narration = this.brain.respond(
        `Narrate how to build this: ${design.summary}`,
        payload.moduleId,
        payload.preferredLanguage,
        true,
      );
      this.respond(res, 200, { design, narration });
      return;
    }

    this.respond(res, 404, { error: "Not found" });
  }

  private respond(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  }
}

class AdminClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async addLanguage(profile: LanguageProfile): Promise<LanguageProfile> {
    return this.post<LanguageProfile>("/admin/languages", profile);
  }

  async createModule(input: Pick<ModuleProfile, "title" | "description">): Promise<ModuleProfile> {
    return this.post<ModuleProfile>("/admin/modules", input);
  }

  async connectLanguage(moduleId: string, languageCode: string): Promise<void> {
    await this.post("/admin/modules/connect-language", { moduleId, languageCode });
  }

  async addKnowledge(moduleId: string, input: Omit<KnowledgeItem, "id" | "moduleId">): Promise<KnowledgeItem> {
    return this.post<KnowledgeItem>("/admin/knowledge", { ...input, moduleId });
  }

  async addCommand(moduleId: string, input: Omit<CommandSpec, "id" | "moduleId">): Promise<CommandSpec> {
    return this.post<CommandSpec>("/admin/commands", { ...input, moduleId });
  }

  async brainSummary(): Promise<ReturnType<AgentBrain["snapshot"]>> {
    return this.get("/admin/brain");
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const text = await response.text();
    if (!text.trim()) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  }

  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}

class FrontEndClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async chat(prompt: string, options: { moduleId?: string; preferredLanguage?: string; voice?: boolean }): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/agent/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...options }),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<AgentResponse>;
  }

  async readiness(moduleId?: string): Promise<BuildReadiness> {
    const params = moduleId ? `?moduleId=${encodeURIComponent(moduleId)}` : "";
    const response = await fetch(`${this.baseUrl}/agent/readiness${params}`);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<BuildReadiness>;
  }

  async voiceDesign(
    prompt: string,
    options: { moduleId?: string; preferredLanguage?: string },
  ): Promise<{ design: VoiceGameDesign; narration: AgentResponse }> {
    const response = await fetch(`${this.baseUrl}/agent/voice-design`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, ...options }),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<{ design: VoiceGameDesign; narration: AgentResponse }>;
  }
}

const seedStakeEngineBrain = async (admin: AdminClient): Promise<{ stakeModuleId: string }> => {
  await admin.addLanguage({
    code: "en",
    name: "English",
    modalities: ["text", "voice"],
    proficiency: "native",
    focusAreas: ["stake engine orchestration", "gameplay narration"],
  });

  await admin.addLanguage({
    code: "ts",
    name: "TypeScript",
    modalities: ["text"],
    proficiency: "fluent",
    focusAreas: ["SDK code", "Node runtimes", "tooling"],
  });

  const stakeModule = await admin.createModule({
    title: "Stake Engine",
    description: "End-to-end staking gameplay brain with admin controls and player UX hooks.",
  });

  await admin.connectLanguage(stakeModule.id, "en");
  await admin.connectLanguage(stakeModule.id, "ts");

  await admin.addKnowledge(stakeModule.id, {
    topic: "player onboarding",
    content: "Register players, top up balances, and audit every action to a player-centric ledger.",
    tags: ["registration", "ledger", "balances"],
    priority: 3,
  });

  await admin.addKnowledge(stakeModule.id, {
    topic: "match flow",
    content: "Create matches with entry fees, deterministic RNG seeds, and multi-round scoring before settlement.",
    tags: ["matches", "rng", "rounds"],
    priority: 4,
  });

  await admin.addKnowledge(stakeModule.id, {
    topic: "payouts",
    content: "Winners reclaim stakes plus rewards, losers unlock stakes with optional slashing for penalties.",
    tags: ["payouts", "slashing", "rewards"],
    priority: 2,
  });

  await admin.addKnowledge(stakeModule.id, {
    topic: "voice",
    content: "Voice mode narrates decisions and exposes intents while keeping JSON APIs unchanged for UI clients.",
    tags: ["voice", "ux", "modality"],
    priority: 1,
  });

  await admin.addCommand(stakeModule.id, {
    name: "register-player",
    description: "Create a new player with an initial ledger entry.",
    syntax: "register-player --name <playerName>",
    example: "register-player --name Ava",
  });

  await admin.addCommand(stakeModule.id, {
    name: "open-match",
    description: "Start a pending match with entry fee, reward pool %, slash %, and RNG seed.",
    syntax: "open-match --entry 25 --reward 70 --slash 20 --rounds 5 --seed demo",
    example: "open-match --entry 10 --reward 80 --slash 10 --rounds 3 --seed training",
  });

  await admin.addCommand(stakeModule.id, {
    name: "settle-match",
    description: "Lock in scores, distribute rewards, and release locked balances.",
    syntax: "settle-match --id <matchId>",
    example: "settle-match --id match-123",
  });

  return { stakeModuleId: stakeModule.id };
};

const runDemo = async (): Promise<void> => {
  const brain = new AgentBrain();
  const service = new AgentBrainService(brain);
  const port = 8787;
  await service.start(port);

  const baseUrl = `http://localhost:${port}`;
  const admin = new AdminClient(baseUrl);
  const frontend = new FrontEndClient(baseUrl);

  const { stakeModuleId } = await seedStakeEngineBrain(admin);

  const summary = await admin.brainSummary();
  // eslint-disable-next-line no-console
  console.log("\nBrain snapshot", JSON.stringify(summary, null, 2));

  const readiness = await frontend.readiness(stakeModuleId);
  // eslint-disable-next-line no-console
  console.log("\nBuild readiness:", readiness.summary);
  if (readiness.missing.length > 0) {
    // eslint-disable-next-line no-console
    console.log("Missing:", readiness.missing.join(", "));
  }

  const response = await frontend.chat(
    "Design a three-player stake match and narrate the flow",
    { moduleId: stakeModuleId, preferredLanguage: "en", voice: true },
  );

  // eslint-disable-next-line no-console
  console.log("\nAgent response:\n", response.message);
  if (response.voiceLine) {
    // eslint-disable-next-line no-console
    console.log(response.voiceLine);
  }
  // eslint-disable-next-line no-console
  console.log("\nSuggested commands:");
  for (const cmd of response.suggestedCommands) {
    // eslint-disable-next-line no-console
    console.log(`- ${cmd.name}: ${cmd.description}`);
  }

  const voiceDesign = await frontend.voiceDesign(
    "Voice-build a high-volatility crash game for Nova and Rex with 3 rounds and 30% slash",
    { moduleId: stakeModuleId, preferredLanguage: "en" },
  );
  // eslint-disable-next-line no-console
  console.log("\nVoice-designed match blueprint:\n", JSON.stringify(voiceDesign.design, null, 2));
  // eslint-disable-next-line no-console
  console.log("\nNarration:\n", voiceDesign.narration.message);
  if (voiceDesign.narration.voiceLine) {
    // eslint-disable-next-line no-console
    console.log(voiceDesign.narration.voiceLine);
  }

  await service.stop();
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runDemo().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  });
}
