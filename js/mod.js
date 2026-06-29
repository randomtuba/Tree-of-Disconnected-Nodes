let modInfo = {
	name: "Tree of Disconnected Nodes",
	author: "randomtuba",
	pointsName: "",
	modFiles: ["tree.js", "side-layers.js", "matter.js"],

	discordName: "tuba's new place",
	discordLink: "https://discord.gg/HhcavwM5rm",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "Act 1 Part 1",
	name: "Matter",
}

let changelog = `<h1>Changelog</h1><br>
	<span style="font-size:11px;">If this game gets abandoned, don't forget me ok?</span><br><br>
	<h3>Act 1 Part 1 (6/28/2026)</h3><br>
	<b>Endgame: 1.00e66 matter</b><br>
		- Added the Matter node.<br>
		- Added the Achievements menu.<br>
		- Added the Help menu.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = gain.add(player.m.multiplier[1].add(player.m.multiplier[2]).add(player.m.multiplier[3]).add(player.m.multiplier[4]).add(player.m.multiplier[5]).add(player.m.multiplier[6]))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	() => `Current Endgame: ${format(1e66)} matter`,
]

// Determines when the game "ends"
function isEndgame() {
	return player.m.points.gte(new Decimal(1e66))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {
	"background-color": "#1e0a1d",
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}