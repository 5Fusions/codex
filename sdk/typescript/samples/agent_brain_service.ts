#!/usr/bin/env -S NODE_NO_WARNINGS=1 pnpm ts-node-esm --files

type DependencyMetadata = {
  frontendDependencies?: string[];
  backendDependencies?: string[];
  buildTools?: string[];
};

type AgentModule = {
  name: string;
  description: string;
  buildSteps: string[];
  dependencies?: DependencyMetadata;
};

type GameBlueprint = {
  title: string;
  summary: string;
  buildSteps: string[];
  dependencyNotes?: string;
};

const summarizeDependencies = (dependencies?: DependencyMetadata): string => {
  if (!dependencies) {
    return "Dependencies not specified.";
  }

  const sections = [
    { label: "Frontend dependencies", items: dependencies.frontendDependencies },
    { label: "Backend dependencies", items: dependencies.backendDependencies },
    { label: "Build tools", items: dependencies.buildTools },
  ];

  const lines = sections
    .filter(({ items }) => Boolean(items?.length))
    .map(({ label, items }) => `- ${label}: ${items?.join(", ") ?? ""}`);

  if (lines.length === 0) {
    return "Dependencies not specified.";
  }

  return ["Dependency summary:", ...lines].join("\n");
};

class AgentBrain {
  buildGame(module: AgentModule): GameBlueprint {
    const dependencyNotes = summarizeDependencies(module.dependencies);

    return {
      title: `Blueprint for ${module.name}`,
      summary: module.description,
      buildSteps: module.buildSteps,
      dependencyNotes,
    };
  }
}

const main = (): void => {
  const demoModule: AgentModule = {
    name: "Arcade Arena",
    description: "Fast-paced multiplayer arena with unlockable abilities.",
    buildSteps: [
      "Scaffold the frontend project and set up the game loop.",
      "Implement matchmaking and lobby flow.",
      "Integrate analytics and live ops tooling.",
    ],
    dependencies: {
      frontendDependencies: ["react", "pixi.js", "zustand"],
      backendDependencies: ["express", "prisma", "redis"],
      buildTools: ["pnpm", "turbo", "tsup"],
    },
  };

  const brain = new AgentBrain();
  const blueprint = brain.buildGame(demoModule);

  console.log(JSON.stringify(blueprint, null, 2));
};

main();
