import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  broadcastMessage,
  createPyriNetwork,
  seedEnvironmentSignal,
  spawnSubnode,
  stepPyriNetwork,
  type PyriChannel,
  type PyriNode,
} from "./pyri-state";

const node = (id: string, channel?: PyriChannel, value = 0): PyriNode => ({
  id,
  label: id,
  type: "Edge",
  x: 0,
  y: 0,
  channels: {
    α: channel === "alpha" ? value : 0,
    β: channel === "beta" ? value : 0,
    γ: channel === "gamma" ? value : 0,
    δ: 0,
    ε: 0,
    ζ: 0,
  },
  hiero: 0,
  energy: 0,
  state: 0,
  stack: [],
  articulators: [],
});

describe("Pyri pure state engine", () => {
  it("propagates alpha to beta to gamma with a stable state sequence", () => {
    let network = createPyriNetwork(
      [node("alpha-node"), node("beta-node"), node("gamma-node")],
      [
        { from: "alpha-node", to: "beta-node", sourceChannel: "alpha", targetChannel: "beta", weight: 0.5 },
        { from: "beta-node", to: "gamma-node", sourceChannel: "beta", targetChannel: "gamma", weight: 0.5 },
      ],
    );

    const trace: string[][] = [];
    for (let tick = 0; tick < 3; tick += 1) {
      network = stepPyriNetwork(network, {
        environmentSignals: tick === 0
          ? [{ nodeId: "alpha-node", channel: "alpha", value: 1 }]
          : [],
      });
      trace.push(["alpha-node", "beta-node", "gamma-node"].map((id) => network.nodes[id].microState));
    }

    assert.deepEqual(trace, [
      ["S1", "S0", "S0"],
      ["S1", "S1", "S0"],
      ["S1", "S2", "S1"],
    ]);
    assert.equal(network.nodes["beta-node"].channels.beta, 0.6);
    assert.equal(network.nodes["gamma-node"].channels.gamma, 0.25);
    assert.equal(network.nodes["alpha-node"].counter, 1);
    assert.equal(network.nodes["beta-node"].counter, 2);
    assert.equal(network.nodes["gamma-node"].counter, 1);
  });

  it("broadcasts along matching edges and supports injected, seeded signals", () => {
    const network = createPyriNetwork(
      [node("one"), node("two")],
      [{ from: "one", to: "two", sourceChannel: "alpha", targetChannel: "beta", weight: 0.25 }],
    );
    assert.deepEqual(broadcastMessage(network, "one", "alpha", 0.8), [
      { from: "one", to: "two", channel: "beta", value: 0.2 },
    ]);

    const signal = seedEnvironmentSignal("one", "alpha", 42);
    assert.deepEqual(signal, seedEnvironmentSignal("one", "alpha", 42));
    const next = stepPyriNetwork(network, { environmentSignals: [signal] });
    assert.equal(next.nodes.one.microState, "S1");
    assert.equal(next.nodes.one.counter, 1);
  });

  it("spawns a subnode without mutating the source network", () => {
    const network = createPyriNetwork([node("parent")]);
    const expanded = spawnSubnode(network, "parent", {
      id: "child",
      label: "Child",
      type: "Stack",
    });
    assert.deepEqual(network.nodes.parent.subnodes, []);
    assert.deepEqual(expanded.nodes.parent.subnodes, ["child"]);
    assert.equal(expanded.nodes.child.microState, "S0");
  });
});
