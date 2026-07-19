addLayer("f", {
    // general stuff
    name: "fluid",
    symbol: "F",
    position: 1, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        vapor: new Decimal(0),
        barProgress: [0,0],
        singularities: new Decimal(0),
        infinity: [false,false],
        infinityFills: [new Decimal(0),new Decimal(0)],
        planckPoints: new Decimal(0),
        fluidPerSecond: new Decimal(0),
    }},
    color: "#6cc9fe",
    requires: new Decimal(1e66),
    resource: "fluid",
    baseResource: "matter", // resource required to unlock
    baseAmount() {return player.m.points},
    type: "none",
    row: 0, // 0 is first row
    layerShown(){return hasMilestone("m",3)},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("f", 11))
        mult = mult.mul(buyableEffect("f", 13))
        mult = mult.mul(buyableEffect("f", 23))
        mult = mult.mul(layers.f.singularityEffect())
        mult = mult.mul(layers.c.chipsEffect())
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    vaporGen() {
        return buyableEffect("f", 21).mul(layers.c.chipsEffect())
    },
    singularityGen() {
        let gen = Decimal.pow(1.5, getBuyableAmount("f",11).add(getBuyableAmount("f",21)).sub(15))
        gen = gen.mul(buyableEffect("f", 31))
        return gen
    },
    planckPointsGen() {
        let gen = Decimal.pow(1.5, getBuyableAmount("f",13).add(getBuyableAmount("f",23)).sub(13))
        gen = gen.mul(buyableEffect("f", 33))
        return gen
    },
    fluidEffect() {
        return player.f.points.pow(1.5).add(1)
    },
    vaporEffect() {
        return player.f.vapor.pow(2).add(1)
    },
    singularityEffect() {
        return player.f.singularities.pow(0.25).add(1)
    },
    infinityFillEffect(x) {
        if (x == 1) {
            return player.f.infinityFills[0].pow(0.1).add(1)
        }
        if (x == 2) {
            return player.f.infinityFills[1].pow(0.2).add(1)
        }
    },
    fillSpeed(x) {
        if (x == 1) { // fluid bar fill speed
            return buyableEffect("f",12).div(5).mul(layers.f.infinityFillEffect(1)).mul(buyableEffect("f",32))
        }
        if (x == 2) { // vapor bar fill speed WITHOUT vapor infinity active
            return new Decimal(0.001).div(player.f.vapor.add(1)).mul(buyableEffect("f", 22)).mul(layers.f.infinityFillEffect(2)).mul(buyableEffect("f", 32))
        }
        if (x == 3) { // vapor bar fill speed WITH vapor infinity active
            return new Decimal(0.001).mul(buyableEffect("f", 22)).mul(layers.f.infinityFillEffect(2)).mul(buyableEffect("f", 32))
        }
    },
    automate() {
        let a = new Decimal(0)
        let b = new Decimal(0)
        let c = new Decimal(0)
        if (player.f.autoFluidBuyables && hasMilestone("m",4)) {
            a = Decimal.log10(1.1)
            b = Decimal.log10(5)
            c = Decimal.log10(3).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 11, tmp.f.buyables[11].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",11))
            a = Decimal.log10(1.2)
            b = Decimal.log10(4)
            c = Decimal.log10(30).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 12, tmp.f.buyables[12].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",12))
            a = Decimal.log10(1.3)
            b = Decimal.log10(6)
            c = Decimal.log10(300).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 13, tmp.f.buyables[13].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",13))
        }
        if (player.f.autoVaporBuyables && hasMilestone("m",4)) {
            a = Decimal.log10(1.05)
            b = Decimal.log10(3)
            c = Decimal.log10(3).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 21, tmp.f.buyables[21].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",21))
            a = Decimal.log10(1.1)
            b = Decimal.log10(3)
            c = Decimal.log10(1).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 22, tmp.f.buyables[22].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",22))
            a = Decimal.log10(1.15)
            b = Decimal.log10(3)
            c = Decimal.log10(10).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 23, tmp.f.buyables[23].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",23))
        }
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.m.points.gte(1e66)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            if (hasMilestone("f",5)) player.f.vapor = player.f.vapor.add(layers.f.vaporGen().mul(diff))
            
            if (!player.f.infinity[0]) {
                // no fluid infinity
                // fluid bar fills up in more than 1 tick:
                if (layers.f.fillSpeed(1).mul(0.04).lt(1)) {
                    player.f.barProgress[0] += layers.f.fillSpeed(1).mul(0.04).toNumber()
                    player.f.fluidPerSecond = layers.f.generation().mul(layers.f.fillSpeed(1))
                    if (player.f.barProgress[0] >= 1) {
                        player.f.barProgress[0] = 0
                        player.f.points = player.f.points.add(layers.f.generation())
                        player.f.barProgress[1] += layers.f.fillSpeed(2).toNumber()
                    }
                    if (player.f.barProgress[1] >= 1) {
                        player.f.barProgress[1] = 0
                        player.f.vapor = player.f.vapor.add(layers.f.vaporGen())
                    }
                }
                // fluid bar fills up in 1 tick:
                if (layers.f.fillSpeed(1).mul(0.04).gte(1)) {
                    player.f.barProgress[0] = 1
                    player.f.points = player.f.points.add(layers.f.generation().mul(layers.f.fillSpeed(1)).mul(5).mul(diff))
                    player.f.fluidPerSecond = layers.f.generation().mul(layers.f.fillSpeed(1)).mul(5)
                    if (!player.f.infinity[1]) {
                        // no vapor infinity
                        if (layers.f.fillSpeed(2).mul(layers.f.fillSpeed(1).mul(0.04)).lt(1)) {
                            // vapor bar fills up in more than 1 tick:
                            player.f.barProgress[1] += layers.f.fillSpeed(2).mul(layers.f.fillSpeed(1).mul(diff)).toNumber()
                            if (player.f.barProgress[1] >= 1) {
                                player.f.barProgress[1] = 0
                                player.f.vapor = player.f.vapor.add(layers.f.vaporGen())
                            }
                        } else {
                            // vapor bar fills up in 1 tick:
                            player.f.barProgress[1] = 1
                            player.f.vapor = player.f.vapor.add(layers.f.vaporGen().mul(layers.f.fillSpeed(2)).mul(layers.f.fillSpeed(1).mul(diff)))
                        }
                    } else {
                        // vapor infinity active
                        player.f.barProgress[1] += (1 - (player.f.barProgress[1] * 1.1)) * 0.04
                        if (player.f.barProgress[1] > 0.4) player.f.barProgress[1] += Math.cos(player.timePlayed * 8) * 0.05 * 0.04
                        if (!hasMilestone("f",3)) player.f.infinityFills[1] = player.f.infinityFills[1].add(layers.f.fillSpeed(3).mul(layers.f.fillSpeed(1).mul(diff)))
                        player.f.vaporPerSecond = new Decimal(0)
                    }
                }
            } else {
                // fluid infinity active
                player.f.barProgress[0] += (1 - (player.f.barProgress[0] * 1.1)) * 0.04
                if (player.f.barProgress[0] > 0.4) player.f.barProgress[0] += Math.cos(player.timePlayed * 8) * 0.05 * 0.04
                if (!hasMilestone("f",3)) player.f.infinityFills[0] = player.f.infinityFills[0].add(layers.f.fillSpeed(1).mul(diff))
                player.f.fluidPerSecond = new Decimal(0)
            }
            if (hasMilestone("f",0)) player.f.singularities = player.f.singularities.add(layers.f.singularityGen().mul(diff))
            if (hasMilestone("f",1)) player.f.planckPoints = player.f.planckPoints.add(layers.f.planckPointsGen().mul(diff))
            if (hasMilestone("f",3)) {
                player.f.infinityFills[0] = player.f.infinityFills[0].add(layers.f.fillSpeed(1).mul(diff))
                player.f.infinityFills[1] = player.f.infinityFills[1].add(layers.f.fillSpeed(3).mul(layers.f.fillSpeed(1).mul(diff)))
            }
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your fluid is multiplying gain of Matter Multiplier powers by <h2 style="color: #6cc9fe; text-shadow: 0px 0px 10px #6cc9fe">${format(layers.f.fluidEffect())}</h2>x.`],
        ["display-text", () => `You are getting ${format(layers.f.generation())} fluid every time the first bar fills up.`],
        () => hasMilestone("f",0) ? ["display-text", `<span style="color:yellow">It has ${format(player.f.infinityFills[0])} stored fills, multiplying its fill speed by ${format(layers.f.infinityFillEffect(1))}x.</span>`] : '',
        "blank",
        ["bar","fluid"],
        "blank",
        ["display-text", () => `You have <h2 style="color: #2e7197; text-shadow: 0px 0px 10px #2e7197">${formatWhole(player.f.vapor)}</h2> vapor`],
        "blank",
        ["display-text", () => `Your vapor is multiplying gain of matter particles by <h2 style="color: #2e7197; text-shadow: 0px 0px 10px #2e7197">${format(layers.f.vaporEffect())}</h2>x.`],
        ["display-text", () => `You are getting ${format(layers.f.vaporGen())} vapor every time the second bar fills up.`],
        () => hasMilestone("f",5) ? ["display-text", `You are also getting ${format(layers.f.vaporGen())} vapor per second.`] : '',
        ["display-text", () => `<span style="color:red">The fill speed of the second bar is divided by your vapor amount.</span>`],
        () => hasMilestone("f",2) ? ["display-text", `<span style="color:yellow">It has ${format(player.f.infinityFills[1])} stored fills, multiplying its fill speed by ${format(layers.f.infinityFillEffect(2))}x.</span>`] : '',
        "blank",
        ["bar","vapor"],
        "blank",
        ["buyables", [1,2]],
        "blank",
        () => hasMilestone("f",0) ? ["display-text", `You have <h2 style="color: #000000; text-shadow: 0px 0px 10px #ffffff">${format(player.f.singularities)}</h2> singularities, multiplying fluid gained per fill by <h2 style="color: #000000; text-shadow: 0px 0px 10px #ffffff">${format(layers.f.singularityEffect())}</h2>x. (${format(layers.f.singularityGen())}/sec)`] : '',
        () => hasMilestone("f",0) ? ["display-text", `You gain more singularities based on Pressure and Pressure<sup>2</sup> purchases.<br>Enabling Fluid Infinity allows you to store fills of the first bar while halting fluid production.`] : '',
        () => hasMilestone("f",2) ? ["display-text", `Enabling Vapor Infinity allows you to store fills of the second bar while halting vapor production.`] : '',
        () => hasMilestone("f",0) ? "clickables" : '',
        "blank",
        () => hasMilestone("f",1) ? ["display-text", `You have <h2 style="color: #ff5900; text-shadow: 0px 0px 10px #ff5900">${format(player.f.planckPoints)}</h2> Planck points. (${format(layers.f.planckPointsGen())}/sec)`] : '',
        () => hasMilestone("f",1) ? ["display-text", `You gain more Planck points based on Temperature and Temperature<sup>2</sup> purchases.`] : '',
        "blank",
        () => hasMilestone("f",1) ? ["buyables", [3]] : '',
        "blank",
    ],
    buyables: {
        11: {
            title: "<h3>Pressure</h3>",
            cost(x) { return new Decimal(3).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply fluid gained per fill by 3.5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} fluid<br>Effect: ${format(this.effect())}x fluid/fill</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3.5, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Volume</h3>",
            cost(x) { return new Decimal(30).mul(Decimal.pow(4, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply fill speed of the first bar by 1.75x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} fluid<br>Effect: ${format(this.effect())}x fill speed</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(1.75, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>Temperature</h3>",
            cost(x) { return new Decimal(300).mul(Decimal.pow(6, x)).mul(Decimal.pow(1.3, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply fluid gained per fill based on matter.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} fluid<br>Mult per Purchase: ${format(this.matterEffect())}x<br>Effect: ${format(this.effect())}x fluid/fill</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            matterEffect() {return player.m.points.add(1).log10().add(1).log10().add(1)},
            effect() {return Decimal.pow(this.matterEffect(), getBuyableAmount(this.layer, this.id))},
        },
        21: {
            title: "<h3>Pressure<sup>2</sup></h3>",
            cost(x) { return new Decimal(3).mul(Decimal.pow(3, x)).mul(Decimal.pow(1.05, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Double vapor gained per fill.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} vapor<br>Effect: ${format(this.effect())}x vapor/fill</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        22: {
            title: "<h3>Volume<sup>2</sup></h3>",
            cost(x) { return Decimal.pow(3, x).mul(Decimal.pow(1.1, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Multiply fill speed of the second bar by 1.5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} vapor<br>Effect: ${format(this.effect())}x fill speed</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        23: {
            title: "<h3>Temperature<sup>2</sup></h3>",
            cost(x) { return new Decimal(10).mul(Decimal.pow(3, x)).mul(Decimal.pow(1.15, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Multiply fluid gained per fill based on vapor.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} vapor<br>Mult per Purchase: ${format(this.vaporEffect())}x<br>Effect: ${format(this.effect())}x fluid/fill</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            vaporEffect() {return player.f.vapor.add(1).ln().add(1)},
            effect() {return Decimal.pow(this.vaporEffect(), getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        31: {
            title: "<h3>Pressure<sup>3</sup></h3>",
            cost(x) { return new Decimal(20).mul(Decimal.pow(8, x)).mul(Decimal.pow(1.05, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Multiply singularity generation by 5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} Planck points<br>Effect: ${format(this.effect())}x singularities</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
        32: {
            title: "<h3>Volume<sup>3</sup></h3>",
            cost(x) { return new Decimal(50).mul(Decimal.pow(12, x)).mul(Decimal.pow(1.1, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Double the fill speed of both bars.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} Planck points<br>Effect: ${format(this.effect())}x fill speeds</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
        33: {
            title: "<h3>Temperature<sup>3</sup></h3>",
            cost(x) { return new Decimal(250).mul(Decimal.pow(16, x)).mul(Decimal.pow(1.15, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">Multiply Planck point generation by 5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} Planck points<br>Effect: ${format(this.effect())}x Planck points</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${formatWhole(15)} Pressure purchases`},
            effectDescription: "Unlock singularities.",
            done() { return getBuyableAmount("f",11).gte(15) },
            unlocked() { return getBuyableAmount("f",11).gte(10) },
        },
        1: {
            requirementDescription() {return `${formatWhole(12)} Temperature purchases`},
            effectDescription: "Unlock Planck points.",
            done() { return getBuyableAmount("f",13).gte(12) },
            unlocked() { return hasMilestone("f",0) },
        },
        2: {
            requirementDescription() {return `${formatWhole(22)} Pressure purchases`},
            effectDescription: "Unlock Vapor Infinity.",
            done() { return getBuyableAmount("f",11).gte(22) },
            unlocked() { return hasMilestone("f",1) },
        },
        3: {
            requirementDescription() {return `${formatWhole(31)} Pressure purchases`},
            effectDescription: "Stored fills can be generated when infinities are inactive.",
            done() { return getBuyableAmount("f",11).gte(31) },
            unlocked() { return player.c.unlocked },
        },
        4: {
            requirementDescription() {return `${formatWhole(30)} Volume purchases`},
            effectDescription: "Autobuy fluid and vapor buyables without consuming fluid and vapor.",
            done() { return getBuyableAmount("f",12).gte(30) },
            unlocked() { return hasMilestone("f",3) },
            toggles: [
                ["f","autoFluidBuyables"],
                ["f","autoVaporBuyables"],
            ],
        },
        5: {
            requirementDescription() {return `${formatWhole(36)} Volume purchases`},
            effectDescription: "Passively generate vapor even if the second bar isn't full.",
            done() { return getBuyableAmount("f",12).gte(36) },
            unlocked() { return hasMilestone("f",4) },
        },
    },
    clickables: {
        11: {
            display() {return `Fluid Infinity: ${player.f.infinity[0] ? `Enabled` : `Disabled`}`},
            onClick() {
                player.f.infinity[0] = !player.f.infinity[0]
                player.f.barProgress[0] = 0
            },
            canClick() {return true},
            style() {
                const style = {};
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (this.canClick()) {
                    style["background-color"] = "black"
                    style["color"] = "white"
                }
                return style
            },
        },
        12: {
            display() {return `Vapor Infinity: ${player.f.infinity[1] ? `Enabled` : `Disabled`}`},
            onClick() {
                player.f.infinity[1] = !player.f.infinity[1]
                player.f.barProgress[1] = 0
            },
            canClick() {return true},
            style() {
                const style = {};
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (this.canClick()) {
                    style["background-color"] = "black"
                    style["color"] = "white"
                }
                return style
            },
            unlocked() {return hasMilestone("f",2)}
        },
    },
    bars: {
        fluid: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.f.barProgress[0]},
            display: () => `${format(player.f.barProgress[0] * 100)}% (Avg: ${format(player.f.fluidPerSecond)} fluid/sec)`,
            fillStyle() { return {"background-color": "#5fb2e1"} },
        },
        vapor: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.f.barProgress[1]},
            display: () => `${format(player.f.barProgress[1] * 100)}%`,
            fillStyle() { return {"background-color": "#286284"} },
        },
    },
})