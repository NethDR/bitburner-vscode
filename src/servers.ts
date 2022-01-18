import { NS } from '@ns'

export function findServers(ns: NS): string[] {
	const to_process = ["home"];
	const found = ["home"];
	while (to_process.length > 0) {
		const x = to_process.pop();
		for (const s of ns.scan(x)) {
			if (!found.includes(s)) {
				found.push(s);
				to_process.push(s);
			}
		}
	}
	return found;
}

export function findPaths(ns: NS): Map<string, string[]> {
	const to_process = ["home"];
	const found = ["home"];
	const m = new Map<string, string[]>();
	m.set("home", ["home"]);
	while (to_process.length > 0) {
		const x = to_process.pop();
		if(x === undefined) continue;
		for (const s of ns.scan(x)) {
			if (!found.includes(s)) {
				found.push(s);
				to_process.push(s);
				const path = m.get(x);
				if(path === undefined) continue;
				m.set(s, path.concat(s));
			}
		}
	}
	return m;
}

export async function main(ns: NS): Promise<void> {
	findPaths(ns).forEach((v,k) => ns.tprint(k + ": " + v));
	findServers(ns).forEach(x => ns.tprint(x));
}