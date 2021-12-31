/** @param {NS} ns **/
export async function main(ns) {
	var serversSeen = ns.scan("home");
	var currentScan;
	var isNuked;
	var openCount = 0;
	var closedCount = 0;
	var newOpens = 0;
	for (let i = 0; i < serversSeen.length; i++) {
		currentScan = ns.scan(serversSeen[i])
		for (var j = 0; j < currentScan.length; j++) {
			if (serversSeen.indexOf(currentScan[j]) === -1) {
				serversSeen.push(currentScan[j])
			}
		}
	}
	ns.tprint(serversSeen);
	for (let i = 0; i < serversSeen.length; i++) {
		var portsRequired = ns.getServerNumPortsRequired(serversSeen[i]);
		var rootAccess = ns.hasRootAccess(serversSeen[i]);
		var portsOpen = 0;
		if (!rootAccess) {
			if (ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("relaySMTP.exe", "home")) {
				ns.relaysmtp(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(serversSeen[i]);
				portsOpen++;
			}

			if (portsOpen >= portsRequired) {
				ns.nuke(serversSeen[i]);
				isNuked = "Successful";
				openCount++;
				newOpens++;
			} else {
				isNuked = "Unsuccessful";
				closedCount++;
			}

		} else {
			openCount++;
			isNuked = "Already Open";
		}
		var maxLen = 38;
		var outStr = "[" + serversSeen[i] + "]";
		var startStr = outStr + isNuked;
		var strLen = maxLen - startStr.length;
		
		var fillStr = new Array(strLen + 1).join(" ");
		ns.tprint(outStr + fillStr + isNuked);
	}
	ns.tprint("Newly Nuked Servers: " + newOpens);
	ns.tprint("Vulnerable Servers: " + openCount);
	ns.tprint("Un-Nuked Servers: " + closedCount);
}
