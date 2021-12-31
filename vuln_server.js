//vuln_server.ns
let target_server;

export async function main(ns) {
	target_server = ns.args[0];
	var moneyThresh = ns.getServerMaxMoney(target_server) * 0.75;
	var securityThresh = ns.getServerMinSecurityLevel(target_server) + 5;
	var rootAccess = ns.hasRootAccess;

	if (rootAccess) {
		while (true) {
			if (ns.getServerSecurityLevel(target_server) > securityThresh) {
				await ns.weaken(target_server);
			} else if (ns.getServerMoneyAvailable(target_server) < moneyThresh) {
				var serverMoneyAvail = ns.getServerMoneyAvailable
				ns.print("Server money: " + serverMoneyAvail + " | Threshold: " + moneyThresh);
				await ns.grow(target_server);
			} else {
				await ns.hack(target_server);
			}
		}
	}
}