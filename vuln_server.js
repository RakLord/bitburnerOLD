//vuln_server.js
let target;
export async function main(ns) {
	ns.disableLog("ALL");
	target = ns.args[0];
	var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
	var securityThresh = ns.getServerMinSecurityLevel(target) + 5;


	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			ns.print("[Wkn] Sec lvl: " + ns.getServerSecurityLevel(target) + " / 100");
			await ns.weaken(target);

		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			var thresholdPercent = (ns.getServerMoneyAvailable(target) / moneyThresh) * 100;
			ns.print("[Grw] Cur Threshold: " + thresholdPercent + "%");
			await ns.grow(target);

		} else {
			ns.print("[Hck] Money Available: $" + ns.getServerMoneyAvailable(target));
			await ns.hack(target);
		}
	}
}
