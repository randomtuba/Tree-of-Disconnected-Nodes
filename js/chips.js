addLayer("c", {
    // general stuff
    name: "chips",
    symbol: "C",
    position: 0, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        timer: 5,
        bytes: new Decimal(0),
        goldenTileMult: new Decimal(10),
        clickRadius: 1,
        windfallCooldown: 20,
    }},
    color: "#8c51d8",
    requires: new Decimal(1e42),
    resource: "chips",
    baseResource: "fluid", // resource required to unlock
    baseAmount() {return player.f.points},
    type: "none",
    row: 1, // 0 is first row
    layerShown(){return hasMilestone("f",2)},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("c",12))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    bytesGen() {
        let gen = player.c.points
        gen = gen.mul(buyableEffect("c",11))
        gen = gen.mul(buyableEffect("c",33))
        return gen
    },
    chipsEffect() {
        return player.c.points.pow(0.75).add(1)
    },
    numberToGridID(num) {
        let x = Math.floor(num) % buyableEffect("c",22) == 0 ? buyableEffect("c",22) : Math.floor(num) % buyableEffect("c",22)
        let y = Math.floor(1 + (Math.floor(num - 1) / buyableEffect("c",22)))
        return y + (x >= 10 ? "" : "0") + x
    },
    goldenTileChance() {
        return hasMilestone("c",0) ? 0.02 + buyableEffect("c", 13) : 0
    },
    creatorTileChance() {
        return hasMilestone("c",1) ? 0.05 : 0
    },
    upgraderTileChance() {
        return hasMilestone("c",2) ? 0.04 : 0
    },
    upgraderTileCount() {
        let count = 0
        for (let i = 1; i <= 100; i++) {
            if (player.c.grid[layers.c.numberToGridID(i)] == 4) count++
        }
        return count
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.f.points.gte(1e42)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            player.c.timer -= diff
            if (player.c.timer <= 0) {
                player.c.timer = buyableEffect("c", 21)
                let rand = Math.random()
                let tile = 0
                if (rand < layers.c.goldenTileChance()) tile = 2
                if (rand > layers.c.goldenTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance()) tile = 3
                if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 4
                if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 1
                let selected = layers.c.numberToGridID((Math.random() * (buyableEffect("c",22) ** 2)) + 1)
                if (player.c.grid[selected] == 0) player.c.grid[selected] = tile
            }
            player.c.bytes = player.c.bytes.add(layers.c.bytesGen().mul(diff))
            if (hasMilestone("c", 3) && player.c.windfallCooldown > 0) player.c.windfallCooldown -= diff
            if (player.c.windfallCooldown < 0) player.c.windfallCooldown = 0
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your chips are multiplying fluid and vapor gained per fill by <h2 style="color: #8c51d8; text-shadow: 0px 0px 10px #8c51d8">${format(layers.c.chipsEffect())}</h2>x.`],
        "blank",
        ["display-text", () => `Time remaining: ${format(player.c.timer)}s`],
        ["display-text", () => `When the timer ends, a random tile will light up.<br>If a tile is selected that's already lit up, nothing happens.`],
        "blank",
        () => hasMilestone("c",0) ? ["display-text", `<span style="color: #ffd900">Golden Tile chance: ${format(layers.c.goldenTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",0) ? ["display-text", `<span style="color: #ffd900">Golden Tile multiplier: ${format(player.c.goldenTileMult)}x</span>`] : '',
        () => hasMilestone("c",0) ? "blank" : '',
        () => hasMilestone("c",1) ? ["display-text", `<span style="color: #003dd6">Creator Tile chance: ${format(layers.c.creatorTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",1) ? ["display-text", `<span style="color: #003dd6">Clicking on a Creator Tile lights up the 8 tiles around it.</span>`] : '',
        () => hasMilestone("c",1) ? "blank" : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">Upgrader Tile chance: ${format(layers.c.upgraderTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">Clicking on an Upgrader Tile upgrades the 8 tiles around it and acts as ${formatWhole(Decimal.mul(50, buyableEffect("c",32)))} tiles clicked.</span>`] : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">(Upgrade chain: empty → regular → creator → golden → upgrader)</span>`] : '',
        () => hasMilestone("c",2) ? "blank" : '',
        "grid",
        () => getBuyableAmount("c",31).gte(1) ? "blank" : '',
        () => getBuyableAmount("c",31).gte(1) ? ["display-text", `Click radius: ${formatWhole(player.c.clickRadius)}`] : '',
        () => getBuyableAmount("c",31).gte(1) ? "clickables" : '',
        "blank",
        ["display-text", () => `You have ${format(player.c.bytes)} bytes. (${format(layers.c.bytesGen())}/sec)`],
        "buyables",
    ],
    buyables: {
        11: {
            title: "<h3>Arithmetic Logic Unit</h3>",
            cost(x) { return new Decimal(200).mul(Decimal.pow(4, x)).mul(Decimal.pow(1.05, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Double byte generation.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} bytes<br>Effect: ${format(this.effect())}x bytes/second</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Central Processing Unit</h3>",
            cost(x) { return new Decimal(1000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Triple chips gained per tile click.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} bytes<br>Effect: ${format(this.effect())}x chips/click</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>Graphics Processing Unit</h3>",
            cost(x) { return new Decimal(5e13).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">+0.5% golden tile chance.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/6<br>Cost: ${format(this.cost())} bytes<br>Effect: +${format(this.effect() * 100)}% chance</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 6,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.mul(0.005, getBuyableAmount(this.layer, this.id)).toNumber()},
            unlocked() {return hasMilestone("c", 0)},
        },
        21: {
            title: "<h3>Random Access Memory</h3>",
            cost(x) { return new Decimal(5000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Divide the cooldown for tile spawning by /1.25.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10<br>Cost: ${format(this.cost())} bytes<br>Effect: Cooldown is ${format(this.effect())}s</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 10,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.div(5, Decimal.pow(1.25, getBuyableAmount(this.layer, this.id))).toNumber()},
        },
        22: {
            title: "<h3>Motherboard</h3>",
            cost(x) { return new Decimal(1e6).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Expand the grid size by 1 row and 1 column.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5<br>Cost: ${format(this.cost())} bytes<br>Effect: ${formatWhole(this.effect())}x${formatWhole(this.effect())} grid</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 5,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.add(5, getBuyableAmount(this.layer, this.id)).toNumber()},
        },
        23: {
            title: "<h3>Solid-State Drive</h3>",
            cost(x) { return new Decimal(1e14).mul(Decimal.pow(25, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">10x golden tile multiplier start and increase.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} bytes<br>Effect: ${format(this.effect())}x golden tile mult</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(10, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 0)},
        },
        31: {
            title: "<h3>External Components</h3>",
            cost(x) { return new Decimal(1e34).mul(Decimal.pow(1000, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">+1 max click radius.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/4<br>Cost: ${format(this.cost())} bytes<br>Effect: Max click radius is ${formatWhole(this.effect())}</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 4,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id).toNumber() + 1},
            unlocked() {return hasMilestone("c", 2)},
        },
        32: {
            title: "<h3>Power Supply Unit</h3>",
            cost(x) { return new Decimal(1e35).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">5x upgrader tile effectiveness.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10<br>Cost: ${format(this.cost())} bytes<br>Effect: ${format(this.effect())}x upgrader tile effectiveness</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 10,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 2)},
        },
        33: {
            title: "<h3>Arithmetic Logic Unit II</h3>",
            cost(x) { return new Decimal(1e36).mul(Decimal.pow(10000, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">10x byte generation.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} bytes<br>Effect: ${format(this.effect())}x bytes/second</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(10, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 2)},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${format(3e6)} chips`},
            effectDescription: "Unlock golden tiles and 2 new buyables.",
            done() { return player.c.points.gte(3e6) },
            unlocked() { return getBuyableAmount("c",22).gte(3) },
        },
        1: {
            requirementDescription() {return `${format(1e17)} chips`},
            effectDescription: "Unlock creator tiles.",
            done() { return player.c.points.gte(1e17) },
            unlocked() { return hasMilestone("c",0) },
        },
        2: {
            requirementDescription() {return `${format(1e20)} chips`},
            effectDescription: "Unlock upgrader tiles and 3 new buyables.",
            done() { return player.c.points.gte(1e20) },
            unlocked() { return hasMilestone("c",1) },
        },
        3: {
            requirementDescription() {return `${format(1e35)} chips`},
            effectDescription: "Unlock the Windfall ability.",
            done() { return player.c.points.gte(1e35) },
            unlocked() { return hasMilestone("c",2) },
        },
    },
    clickables: {
        11: {display: `<h2>-</h2>`,onClick() {player.c.clickRadius--},canClick() {return player.c.clickRadius > 1},style() {return {"width": "75px", "min-height": "75px"}},},
        12: {display: `<h2>+</h2>`,onClick() {player.c.clickRadius++},canClick() {return player.c.clickRadius < buyableEffect("c",31)},style() {return {"width": "75px", "min-height": "75px"}},},
        21: {
            display() {return `Windfall${player.c.windfallCooldown > 0 ? `<br>(${format(player.c.windfallCooldown)}s)` : ``}`},
            tooltip: `Summon a lot of upgrader tiles`,
            onClick() {
                player.c.windfallCooldown = 20
                for (let i = 0; i < 40; i++) {
                    let rand = Math.random()
                    let selected = layers.c.numberToGridID((Math.random() * (buyableEffect("c",22) ** 2)) + 1)
                    player.c.grid[selected] = 4
                }
            },
            canClick() {return player.c.windfallCooldown <= 0},
            style() {return {"width": "75px", "min-height": "75px"}},
            unlocked() {return hasMilestone("c",3)},
        },
    },
    grid: {
        rows() {return buyableEffect("c",22)},
        cols() {return buyableEffect("c",22)},
        maxRows: 10,
        maxCols: 10,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id, clickRadius) {
            if (clickRadius === undefined) clickRadius = player.c.clickRadius

            if (clickRadius > 1) {
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    layers.c.grid.onClick(player.c.grid[arr[i]], arr[i], clickRadius - 1)
                }
            }

            if (data == 1 || data < 0) {
                player[this.layer].grid[id] = 0
                player.c.points = player.c.points.add(layers.c.generation())
                if (hasMilestone("c",0)) player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(10, buyableEffect("c", 23)))
            }
            if (data == 2) {
                player[this.layer].grid[id] -= 2
                player.c.points = player.c.points.add(layers.c.generation().mul(player.c.goldenTileMult))
                player.c.goldenTileMult = Decimal.mul(10, buyableEffect("c", 23))
            }
            if (data == 3) {
                player[this.layer].grid[id] -= 3
                player.c.points = player.c.points.add(layers.c.generation())
                player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(10, buyableEffect("c", 23)))
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    if (player.c.grid[arr[i]] != undefined && player.c.grid[arr[i]] == 0) {
                        let rand = Math.random()
                        let tile = 0
                        if (rand < layers.c.goldenTileChance()) tile = 2
                        if (rand > layers.c.goldenTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance()) tile = 3
                        if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 4
                        if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 1
                        if (player.c.grid[arr[i]] == 0) player.c.grid[arr[i]] = tile
                    }
                }
            }
            if (data == 4) {
                player[this.layer].grid[id] -= 3
                player.c.points = player.c.points.add(layers.c.generation().mul(50))
                player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(500, buyableEffect("c", 23)).mul(buyableEffect("c", 32)))
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    if (player.c.grid[arr[i]] != undefined) {
                        if (player.c.grid[arr[i]] == 0) player.c.grid[arr[i]] = 1
                        else if (player.c.grid[arr[i]] == 1) player.c.grid[arr[i]] = 3
                        else if (player.c.grid[arr[i]] == 3) player.c.grid[arr[i]] = 2
                        else if (player.c.grid[arr[i]] == 2) player.c.grid[arr[i]] = 4
                    }
                }
            }

            if (data < 0) {
                data == 0
            }
        },
        getStyle(data, id) {
            const style = {}
            style["width"] = "70px"
            style["max-height"] = "70px"
            if (data == 0) style["background-color"] = "#2e1a48"
            if (data == 2) style["background-color"] = "#ffd900"
            if (data == 3) style["background-color"] = "#003dd6"
            if (data == 4) style["background-color"] = "#00ff77"
            return style
        }
    }
})