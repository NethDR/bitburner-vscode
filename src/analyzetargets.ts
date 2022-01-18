import { NS } from '@ns'
import { findServers } from '/servers'

export function hackProfitHeuristic(x: string, ns: NS, tc:number): number {
	if(x == "home" || ns.getPurchasedServers().includes(x) || !ns.hasRootAccess(x)) return 0;
	const ht = ns.getHackTime(x);
	const gt = ht * 3.2;
	const wt = ht * 4;

	const mm = ns.getServerMaxMoney(x);

	const hg = tc * ns.hackAnalyze(x) * mm;

	return hg / (ht + gt + wt * 2)
}

export function sortHackTargets(ns: NS): string[] {
	let servers = findServers(ns);
	const tc = servers.map(x => Math.floor(ns.getServerMaxRam(x) / ns.getScriptRam("hack.js"))).reduce((x, y) => x + y);

	servers = servers.filter(x => x != "home" && ns.hasRootAccess(x))
	return servers.sort((x, y) => hackProfitHeuristic(y,ns,tc) - hackProfitHeuristic(x,ns,tc));
}

export async function main(ns: NS): Promise<void> {
	const servers = findServers(ns);
	const tc = servers.map(x => Math.floor(ns.getServerMaxRam(x) / ns.getScriptRam("hack.js"))).reduce((x, y) => x + y);
	sortHackTargets(ns).forEach(x => ns.tprint(x + " " + hackProfitHeuristic(x,ns,tc)));
	ns.tprint(sortHackTargets(ns)[0])
}