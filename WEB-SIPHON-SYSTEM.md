# WEB-SIPHON SYSTEM

**Hiero-Code S-tier module — Tradition 8: WEAVE > WALL**

**Status:** Proposed module specification. This document defines the QUARANTINE rule and its boundary with the deterministic Pyri engine; it does not implement a filter, classifier, or quarantine store.

## 1. Purpose and design principle

WEB-SIPHON applies the WEAVE > WALL principle to signals entering or moving through a Pyri network. Its job is selective permeability: observe a signal, choose a disposition, and preserve enough evidence to learn from a held signal without allowing that signal to propagate.

The design draws on the project's existing description of WEB / WEAVE as a networked, selectively permeable filter; Nagual as predictive pattern detection and interpretation; and the Tent System as layered interception. Those descriptions establish the module's intent, not a production threat detector or a validated biological mechanism.

The selected disposition for a signal that the filter identifies for containment is **QUARANTINE — hold, record, then expire**.

## 2. Pyri filter boundary

The filter observes a candidate before that candidate is applied to a receiving node or propagated to its next connection. Its logical input is:

| Field | Meaning |
|---|---|
| `sourceNodeId` | Node that emitted the candidate, or the environment for an injected signal |
| `targetNodeId` | Intended receiving node |
| `sourceChannel` | Channel read at the sending node |
| `targetChannel` | Channel the connection would activate at the receiver |
| `value` | Numeric signal value used by the current Pyri engine |
| `content` | Immutable snapshot of any higher-level payload |
| `metadata` | Immutable snapshot of signal context needed for review or adaptation |
| `observedAtTick` | Current integer `PyriNetworkState.tick` |
| `sourceMicroState` | Sending node's current state, one of S0–S8 |
| `targetMicroState` | Receiving node's current state, one of S0–S8 |

The filter returns one disposition:

| Disposition | Meaning |
|---|---|
| `ALLOW` | Continue through the intended channel and connection |
| `QUARANTINE` | Hold and record; do not propagate, drop immediately, or reroute |
| `DROP` | Discard immediately; do not retain a replayable signal |
| `REROUTE` | Send through an explicitly selected alternate channel; do not hold |

For a fixed candidate and the same Pyri snapshot, the filter decision must be deterministic. The current material does **not** define the detection predicate that chooses among these dispositions. Beck's choice specifies what to do *after* a signal is selected for containment; it does not specify which signal qualifies.

The channel vocabulary is the existing Pyri set:

| Engine name | Display symbol |
|---|---|
| `alpha` | α |
| `beta` | β |
| `gamma` | γ |
| `delta` | δ |
| `epsilon` | ε |
| `zeta` | ζ |

The filter may inspect any of these channels and the current micro-state S0, S1, S2, S3, S4, S5, S6, S7, or S8. No channel-specific threat meaning or per-state filter policy is defined here; a channel or state alone is not a threat verdict.

## 3. QUARANTINE: hold, record, expire

### 3.1 HOLD

On a `QUARANTINE` decision, SIPHON removes the candidate from the set of inputs eligible for the current propagation step and stores it in quarantine. The candidate:

- is not applied to `targetChannel`;
- is not forwarded over any connection;
- is not discarded at the point of detection; and
- is not rewritten onto a different channel.

Quarantine is a WEB-SIPHON record and holding state, **not a new Pyri micro-state**. The deterministic engine's S0–S8 state machine remains unchanged. Because the held candidate is not delivered to the engine, it does not by itself change either node's channel values, counter, stack, or micro-state. Other eligible signals may still advance those nodes normally.

### 3.2 RECORD

Before any neutralization or expiry, create an immutable record containing at least:

| Record field | Required content |
|---|---|
| `sourceChannel` | Channel on which the signal was observed |
| `targetChannel` | Intended channel at the receiver |
| `content` | Snapshot of the held signal's content; for the current engine this is its numeric `value` |
| `metadata` | Snapshot of available signal metadata |
| `filterReason` | Stable reason code or explanation for the QUARANTINE decision |
| `heldAtTick` | Integer Pyri tick at which the record was created |
| `sourceNodeId`, `targetNodeId` | Origin and intended destination |
| `sourceMicroState`, `targetMicroState` | S0–S8 snapshots at observation time |

`heldAtTick` is the record's deterministic timestamp. It uses the engine's logical tick, not wall-clock time, so replaying the same ordered inputs produces the same timestamp and expiry. A human-readable wall-clock timestamp is not required by this specification.

### 3.3 EXPIRE

Each quarantine record has a fixed **9-network-tick TTL**:

```text
expiresAtTick = heldAtTick + 9
expired when currentNetworkTick >= expiresAtTick
```

An item held at tick `t` is available to NAGUAL and ADAPT during ticks `t` through `t+8`; it is discarded at the start of processing tick `t+9`, after its record has been available to ADAPT for the preceding ticks. Expiry removes the quarantine record and its held content from the active quarantine store. Expiry does not deliver, reroute, replay, or otherwise reintroduce the signal.

The nine-tick duration is a fixed specification choice aligned to the number of named micro-states. It is a network-tick limit, **not** a claim that a node necessarily visits every micro-state during that interval.

## 4. WEB → SIPHON → POISON → NAGUAL → ADAPT

| Stage | Responsibility |
|---|---|
| **WEB** | Present the woven sensing topology. A candidate enters this pipeline at an observation point; the topology alone does not decide its disposition. |
| **SIPHON** | Detect a candidate, evaluate the deterministic filter rule, and apply `ALLOW`, `QUARANTINE`, `DROP`, or `REROUTE`. For QUARANTINE, hold and record it before it can propagate. |
| **POISON** | Trap or neutralize a quarantined candidate so it cannot escape quarantine or become deliverable while held. The record is already captured and remains available for interpretation. The particular neutralization operation is not defined by the existing material. |
| **NAGUAL** | Read and interpret the observation and quarantine record at the siphoning point. NAGUAL is an observer of the candidate and its recorded context, not a second route for the held signal. |
| **ADAPT** | Consume the record before its TTL expires so future filtering can learn from the event. The learning/update rule is not defined by the existing material. |

The operational order for a quarantined candidate is:

```text
WEB observation
  → SIPHON detect and decide
  → HOLD and RECORD
  → POISON trap/neutralize
  → NAGUAL read/interpret the captured record
  → ADAPT consume the record
  → EXPIRE at expiresAtTick if still retained
```

NAGUAL reads the record made at the SIPHON observation point; it does not receive a later propagated copy. ADAPT's access is to that same record, not to the quarantined signal as a new Pyri input.

## 5. Keep the three dispositions distinct

| Rule | Immediate effect | Retained record | Channel behavior |
|---|---|---|---|
| **QUARANTINE** | Hold pending expiry after recording | Yes; available to NAGUAL and ADAPT until TTL expiry | No propagation and no reroute |
| **DROP** | Discard immediately | No replayable signal is retained | No propagation and no reroute |
| **REROUTE** | Select an alternate destination and continue processing there | No quarantine record is implied | Does not use the original route; it is not held |

An audit-only record for a DROP or REROUTE decision is outside this specification. Such an audit record must not be treated as a quarantined signal or be available as quarantined content for ADAPT unless that policy is separately defined.

## 6. Relationship to the deterministic Pyri engine

The existing pure engine in `artifacts/hiero-code/src/lib/pyri-state.ts` models weighted connections, six numeric channels, deterministic per-tick propagation, injected environment signals, and S0–S8 transitions. WEB-SIPHON is specified as a boundary layer that decides whether a candidate is eligible to enter that propagation.

The engine currently has no filter callback, quarantine store, payload/metadata fields, filter reason, or expiry handling. Its connection propagation is generated inside `stepPyriNetwork`; the engine does not expose those generated messages to an external filter before applying them. Therefore this document does not claim that quarantine can be implemented against the current API without an integration decision. The state engine itself is not changed by this specification.

## 7. Open questions before implementation

1. **Detection predicate:** What deterministic rule identifies a candidate for QUARANTINE, and what conditions select ALLOW, DROP, or REROUTE?
2. **Payload and metadata schema:** What content and metadata exist beyond the current numeric channel value, and which fields are safe and necessary to retain?
3. **Interception point:** Should a future implementation filter only caller-injected signals at a wrapper boundary, or should it add a hook that can also intercept connection-generated propagation? The current engine exposes no such hook.
4. **POISON semantics:** What exact deterministic operation constitutes neutralization, beyond preventing release or propagation?
5. **NAGUAL interpretation:** What inputs and deterministic interpretation rules produce a recorded observation or recommendation?
6. **ADAPT rule:** What deterministic, bounded update may learned records make to future filtering, and how is that update versioned or reset?
7. **REROUTE policy:** Which alternate channels are eligible, and how is the target selected without turning rerouting into quarantine?

Until these points are specified, the architecture and quarantine lifecycle are defined, but a complete executable WEB-SIPHON implementation is not.
