export type PyriNodeType = "Core" | "Edge" | "Stack" | "Flow";
export type PyriUiChannel = "α" | "β" | "γ" | "δ" | "ε" | "ζ";

/** Shared node shape used by the Pyri visualizer and pure state engine. */
export interface PyriNode {
  id: string;
  label: string;
  type: PyriNodeType;
  x: number;
  y: number;
  channels: Record<PyriUiChannel, number>;
  hiero: number;
  energy: number;
  state: number;
  stack: number[];
  articulators: PyriUiChannel[];
}

export const PYRI_CHANNELS = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
] as const;

export type PyriChannel = (typeof PYRI_CHANNELS)[number];
export type MicroState = `S${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
export const MICRO_STATES: readonly MicroState[] = [
  "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8",
];

export interface PyriConnection {
  from: string;
  to: string;
  sourceChannel: PyriChannel;
  targetChannel: PyriChannel;
  weight: number;
}

export interface PyriNodeState {
  id: string;
  label: string;
  type: PyriNodeType;
  microState: MicroState;
  channels: Record<PyriChannel, number>;
  counter: number;
  stack: number[];
  subnodes: string[];
}

export interface PyriNetworkState {
  tick: number;
  nodes: Record<string, PyriNodeState>;
  connections: PyriConnection[];
}

export interface PyriMessage {
  from: string;
  to: string;
  channel: PyriChannel;
  value: number;
}

export interface EnvironmentSignal {
  nodeId: string;
  channel: PyriChannel;
  value: number;
}

export interface StepOptions {
  environmentSignals?: readonly EnvironmentSignal[];
  rules?: Partial<Record<MicroState, StateRule>>;
}

export type StateRule = (
  current: MicroState,
  input: Readonly<Record<PyriChannel, number>>,
) => MicroState;

const MAX_STACK_DEPTH = 5;
const CHANNEL_DECAY = 0.6;

const DEFAULT_STATE_RULES = MICRO_STATES.reduce<Record<MicroState, StateRule>>(
  (rules, state, index) => {
    rules[state] = () => MICRO_STATES[(index + 1) % MICRO_STATES.length];
    return rules;
  },
  {} as Record<MicroState, StateRule>,
);

const CHANNEL_TO_GLYPH: Record<PyriChannel, PyriUiChannel> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
};

const zeroChannels = (): Record<PyriChannel, number> => ({
  alpha: 0,
  beta: 0,
  gamma: 0,
  delta: 0,
  epsilon: 0,
  zeta: 0,
});

const clamp = (value: number): number => Math.max(0, Math.min(1, value));

function assertSignal(value: number, description: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${description} must be a finite number between 0 and 1`);
  }
}

function copyNode(node: PyriNode): PyriNodeState {
  return {
    id: node.id,
    label: node.label,
    type: node.type,
    microState: "S0",
    channels: Object.fromEntries(PYRI_CHANNELS.map((channel) => {
      const value = node.channels[CHANNEL_TO_GLYPH[channel]] ?? 0;
      assertSignal(value, `Initial ${channel} channel`);
      return [channel, value];
    })) as Record<PyriChannel, number>,
    counter: 0,
    stack: [...node.stack],
    subnodes: [],
  };
}

export function createPyriNetwork(
  nodes: readonly PyriNode[],
  connections: readonly PyriConnection[] = [],
): PyriNetworkState {
  const nodeMap: Record<string, PyriNodeState> = {};
  for (const node of nodes) {
    if (!node.id || nodeMap[node.id]) {
      throw new Error(`Node IDs must be non-empty and unique: "${node.id}"`);
    }
    nodeMap[node.id] = copyNode(node);
  }

  for (const connection of connections) {
    if (!nodeMap[connection.from] || !nodeMap[connection.to]) {
      throw new Error(`Connection references an unknown node: ${connection.from} -> ${connection.to}`);
    }
    assertSignal(connection.weight, "Connection weight");
  }

  return {
    tick: 0,
    nodes: nodeMap,
    connections: connections.map((connection) => ({ ...connection })),
  };
}

/** Send a channel value along every matching outgoing connection. */
export function broadcastMessage(
  network: PyriNetworkState,
  from: string,
  channel: PyriChannel,
  value: number,
): PyriMessage[] {
  if (!network.nodes[from]) throw new Error(`Unknown source node: ${from}`);
  assertSignal(value, "Message value");
  return network.connections
    .filter((connection) => connection.from === from && connection.sourceChannel === channel)
    .map((connection) => ({
      from,
      to: connection.to,
      channel: connection.targetChannel,
      value: clamp(value * connection.weight),
    }));
}

/**
 * Advance every node from one shared snapshot. Messages are computed before
 * any node changes, so a signal can travel at most one connection per tick.
 */
export function stepPyriNetwork(
  network: PyriNetworkState,
  options: StepOptions = {},
): PyriNetworkState {
  const delivered: PyriMessage[] = network.connections.flatMap((connection) => {
    const value = network.nodes[connection.from].channels[connection.sourceChannel];
    return value === 0
      ? []
      : [{
          from: connection.from,
          to: connection.to,
          channel: connection.targetChannel,
          value: clamp(value * connection.weight),
        }];
  });

  for (const signal of options.environmentSignals ?? []) {
    if (!network.nodes[signal.nodeId]) {
      throw new Error(`Environment signal references an unknown node: ${signal.nodeId}`);
    }
    assertSignal(signal.value, "Environment signal");
    delivered.push({
      from: "environment",
      to: signal.nodeId,
      channel: signal.channel,
      value: signal.value,
    });
  }

  const rules = { ...DEFAULT_STATE_RULES, ...options.rules };
  const nextNodes: Record<string, PyriNodeState> = {};

  for (const node of Object.values(network.nodes)) {
    const input = zeroChannels();
    for (const message of delivered) {
      if (message.to === node.id) {
        input[message.channel] = clamp(input[message.channel] + message.value);
      }
    }

    const channels = zeroChannels();
    for (const channel of PYRI_CHANNELS) {
      channels[channel] = clamp(node.channels[channel] * CHANNEL_DECAY + input[channel]);
    }

    const active = PYRI_CHANNELS.some((channel) => input[channel] > 0);
    const microState = active ? rules[node.microState](node.microState, input) : node.microState;
    if (!MICRO_STATES.includes(microState)) {
      throw new Error(`State rule returned an invalid micro-state: ${microState}`);
    }

    const nextStack = [...node.stack];
    if (active && nextStack.length < MAX_STACK_DEPTH) {
      nextStack.push(MICRO_STATES.indexOf(microState));
    }
    if (!active && nextStack.length > 0 && PYRI_CHANNELS.every((channel) => channels[channel] < 0.2)) {
      nextStack.pop();
    }

    nextNodes[node.id] = {
      ...node,
      microState,
      channels,
      counter: node.counter + (active ? 1 : 0),
      stack: nextStack,
      subnodes: [...node.subnodes],
    };
  }

  return {
    tick: network.tick + 1,
    nodes: nextNodes,
    connections: network.connections.map((connection) => ({ ...connection })),
  };
}

/** Add a child node without mutating the original network. */
export function spawnSubnode(
  network: PyriNetworkState,
  parentId: string,
  child: Pick<PyriNode, "id" | "label" | "type">,
): PyriNetworkState {
  const parent = network.nodes[parentId];
  if (!parent) throw new Error(`Unknown parent node: ${parentId}`);
  if (!child.id || network.nodes[child.id]) {
    throw new Error(`Subnode ID must be non-empty and unique: "${child.id}"`);
  }

  const childState: PyriNodeState = {
    id: child.id,
    label: child.label,
    type: child.type,
    microState: "S0",
    channels: zeroChannels(),
    counter: 0,
    stack: [],
    subnodes: [],
  };

  return {
    ...network,
    nodes: {
      ...network.nodes,
      [parentId]: { ...parent, subnodes: [...parent.subnodes, child.id] },
      [child.id]: childState,
    },
  };
}

/** Produce a reproducible environment signal from an explicit numeric seed. */
export function seedEnvironmentSignal(
  nodeId: string,
  channel: PyriChannel,
  seed: number,
): EnvironmentSignal {
  if (!Number.isSafeInteger(seed)) throw new RangeError("Seed must be a safe integer");
  let value = seed >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return {
    nodeId,
    channel,
    value: (value >>> 0) / 0x1_0000_0000,
  };
}
