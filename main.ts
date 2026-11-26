// The Painfully Honest Out-of-Office — make.fun entry.
// One brutally honest but still polite OOO auto-reply, one sentence, <=200 chars.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPLY =
  "I'm away until Monday, and your email joins 1,847 unread messages from people who all believed theirs would be answered first.";

const GATE = { min: 1, max: 200 };

function failGate(reason: string): never {
  throw new Error(`gate failed: ${reason}`);
}

function checkEntry(text: string): void {
  const checks: Array<[boolean, string]> = [
    [text.length >= GATE.min, "too short"],
    [text.length <= GATE.max, "too long"],
    [text.trim().length > 0, "only whitespace"],
    [text.trim().split("\n").length === 1, "not one line"],
    [text.trim().endsWith("."), "does not end as a complete sentence"],
  ];
  for (const [ok, why] of checks) {
    if (!ok) failGate(why);
  }
}

function main(): void {
  checkEntry(REPLY);
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(targetDir, { recursive: true });
  const outPath = join(targetDir, "entry.txt");
  writeFileSync(outPath, REPLY, "utf8");
  // Round-trip guard: the file on disk must be byte-identical to the reply.
  const back = readFileSync(outPath, "utf8");
  if (back !== REPLY) failGate("written file differs from reply");
  console.log(`saved ${REPLY.length} characters to ${outPath}`);
}

main();
