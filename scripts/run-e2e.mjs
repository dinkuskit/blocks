import { spawn } from "node:child_process";

const runId =
	process.env.DINKUS_E2E_RUN_ID ??
	new Date().toISOString().replaceAll(/[:.]/g, "-");
const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const child = spawn(command, ["exec", "playwright", "test"], {
	stdio: "inherit",
	env: {
		...process.env,
		DINKUS_E2E_RUN_ID: runId,
	},
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exitCode = code ?? 1;
});
