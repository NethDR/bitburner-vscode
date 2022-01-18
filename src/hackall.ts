import { NS } from '@ns'
import { sortHackTargets } from 'analyzetargets'
import { findServers } from '/servers'

export async function main(ns: NS): Promise<void> {
	async function hack1(s: string, tgt: string) {
		ns.ps(s).filter(proc => !donotkill.includes(proc.filename)).forEach(proc => ns.kill(proc.pid));
		const tc = Math.floor((ns.getServerMaxRam(s) - ns.getServerUsedRam(s)) / ns.getScriptRam("hack.js"));
		if (tc <= 0) return;
		if (s != "home") {
			ns.rm("hack.js", s);
			await ns.scp("hack.js", "home", s);
		}
		ns.exec("hack.js", s, tc, tgt);
	}

	const donotkill = ["contract.js", "automate.js", "hackall.js", "buymxsrvrs.js"];
	const port_openers = [
		{ exe: "BruteSSH.exe", fn: ns.brutessh, isopen: ((x: string) => ns.getServer(x).sshPortOpen) },
		{ exe: "FTPCrack.exe", fn: ns.ftpcrack, isopen: ((x: string) => ns.getServer(x).ftpPortOpen) },
		{ exe: "HTTPWorm.exe", fn: ns.httpworm, isopen: ((x: string) => ns.getServer(x).httpPortOpen) },
		{ exe: "SQLInject.exe", fn: ns.sqlinject, isopen: ((x: string) => ns.getServer(x).sqlPortOpen) },
		{ exe: "relaySMTP.exe", fn: ns.relaysmtp, isopen: ((x: string) => ns.getServer(x).smtpPortOpen) }];
	const oldtgt = undefined;
	ns.tprint
	while (true) {
		const tgt = sortHackTargets(ns)[0];
		if (tgt != oldtgt)
			for (const s of findServers(ns)) {
				for (const p of port_openers) {
					if (ns.fileExists(p.exe, "home") && !p.isopen(s)) {
						p.fn(s);
					}
				}
				await hack1(s, tgt);
			}
		await ns.sleep(ns.getHackTime(tgt) * 10);
	}
}