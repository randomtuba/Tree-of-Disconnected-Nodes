addLayer("b", {
    // general stuff
    name: "boxes",
    symbol: "B",
    position: 2, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        matterToggles: [true,true,true,true,true,true,true,true,true],
        fluidToggles: [true,true,true,true,true,true,true,true,true,true,true,true],
        chipToggles: [true,true,true,true,true],
        stringToggles: [true,true,true,true,true,true,true,true],
        boxed: [false,false,false,false],
        cuboids: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
    }},
    color: "#e56b00",
    requires: new Decimal("1e380"),
    resource: "boxes",
    baseResource: "strings", // resource required to unlock
    baseAmount() {return player.s.points},
    type: "none",
    row: 1, // 0 is first row
    layerShown(){return hasMilestone("s",3)},

    // calculations
    gainMult() {
        mult = player.b.cuboids[0].pow(0.5)
        mult = mult.mul(buyableEffect("b",11))
        mult = mult.mul(buyableEffect("b",21))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    cuboidGen(x) {
        switch (x) {
            case 0:
                if (player.b.matterToggles.includes(false) && player.b.boxed[0] && player.m.points.gte("1e4000")) {
                    let falseCount = 0
                    for (let i = 0; i < player.b.matterToggles.length; i++) {
                        if (player.b.matterToggles[i] === false) falseCount++
                    }
                    return Decimal.pow(Decimal.mul(10,layers.b.cuboidEffect(1)),falseCount).mul(buyableEffect("b",12)).mul(buyableEffect("b",22))
                }
                else return new Decimal(0)
            break
            case 1:
                if (player.b.fluidToggles.includes(false) && player.b.boxed[1] && player.f.points.gte("1e365")) {
                    let falseCount = 0
                    for (let i = 0; i < player.b.fluidToggles.length; i++) {
                        if (player.b.fluidToggles[i] === false) falseCount++
                    }
                    return Decimal.pow(Decimal.mul(3,layers.b.cuboidEffect(2)),falseCount).mul(buyableEffect("b",12)).mul(buyableEffect("b",22))
                }
                else return new Decimal(0)
            break
            case 2:
                if (player.b.chipToggles.includes(false) && player.b.boxed[2] && player.c.points.gte(1e185)) {
                    let falseCount = 0
                    for (let i = 0; i < player.b.chipToggles.length; i++) {
                        if (player.b.chipToggles[i] === false) falseCount++
                    }
                    return Decimal.pow(Decimal.mul(20,layers.b.cuboidEffect(3)),falseCount).mul(buyableEffect("b",12)).mul(buyableEffect("b",22))
                }
                else return new Decimal(0)
            break
            case 3:
                if (player.b.stringToggles.includes(false) && player.b.boxed[3] && player.s.points.gte("1e880")) {
                    let falseCount = 0
                    for (let i = 0; i < player.b.stringToggles.length; i++) {
                        if (player.b.chipToggles[i] === false) falseCount++
                    }
                    return Decimal.pow(10,falseCount).mul(buyableEffect("b",12)).mul(buyableEffect("b",22))
                }
                else return new Decimal(0)
            break
        }
    },
    cuboidEffect(x) {
        if (x == 1) return player.b.cuboids[1].pow(0.1).add(1)
        if (x == 2) return player.b.cuboids[2].pow(0.05).add(1)
        if (x == 3) return player.b.cuboids[3].pow(0.15).add(1)
    },
    boxesEffect(x) {
        if (x == 0) return player.b.points.pow(1.5).add(1)
        if (x == 1) return player.b.points.add(1).log10().add(1).log10().div(5).add(1)
        if (x == 2) return player.b.points.add(1).log10().add(1).log10().add(1)
        if (x == 3) return player.b.points.add(1).log10().add(1).log10().div(6).add(1)
        if (x == 4) return player.b.points.add(1).log10().add(1).log10().mul(10).add(1)
        if (x == 5) return player.b.points.add(1).log10().add(1).log10().div(7).add(1)
        if (x == 6) return player.b.points.pow(2.5).add(1)
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.s.points.gte("1e380")) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            player.b.points = player.b.points.add(layers.b.generation().mul(diff))
            for (let i = 0; i < 4; i++) {
                player.b.cuboids[i] = player.b.cuboids[i].add(layers.b.cuboidGen(i).mul(diff))
            }
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your boxes are multiplying gain of ${hasMilestone("b",2) ? `all string types` : `quinary strings`} by <h2 style="color: #e56b00; text-shadow: 0px 0px 10px #e56b00">${format(layers.b.boxesEffect(0))}</h2>x.`],
        () => getBuyableAmount("b",13).gte(1) ? ["display-text", `<span style="color:yellow">They are also powering base matter generation ^${format(layers.b.boxesEffect(1))}.</span>`] : '',
        () => getBuyableAmount("b",13).gte(2) ? ["display-text", `<span style="color:yellow">They are also powering the 1st proton and electron effects ^${format(layers.b.boxesEffect(2))}.</span>`] : '',
        () => getBuyableAmount("b",13).gte(3) ? ["display-text", `<span style="color:yellow">They are also powering fluid and vapor gained per fill ^${format(layers.b.boxesEffect(3))}.</span>`] : '',
        () => getBuyableAmount("b",13).gte(4) ? ["display-text", `<span style="color:yellow">They are also powering the singularities effect ^${format(layers.b.boxesEffect(4))}.</span>`] : '',
        () => getBuyableAmount("b",13).gte(5) ? ["display-text", `<span style="color:yellow">They are also powering base chips per click ^${format(layers.b.boxesEffect(5))}.</span>`] : '',
        () => getBuyableAmount("b",13).gte(6) ? ["display-text", `<span style="color:yellow">They are also multiplying the golden tile multiplier start and increase by ${format(layers.b.boxesEffect(6))}x.</span>`] : '',
        "blank",
        "buyables",
        ["display-text", () => `Use the clickables to enable/disable the effects of different mechanics in each node.`],
        ["display-text", () => `Forcing a reset of a node will allow you to keep all of its milestones, but you won't be able to enable/disable mechanics until you force reset again.`],

        // matter cuboids
        "blank",
        ["clickables",[1]],
        () => !player.b.boxed[0] ? ["display-text", `<span style="color:red">You are not eligible to gain matter cuboids.</span>`] : '',
        () => player.b.boxed[0] && player.m.points.lt("1e4000") ? ["display-text", `<span style="color:red">You need ${format("1e4000")} matter to generate matter cuboids.</span>`] : '',
        () => player.b.boxed[0] && player.m.points.gte("1e4000") ? ["display-text", `<span style="color:#00ff00">You are generating ${format(layers.b.cuboidGen(0))} matter cuboids per second.</span>`] : '',
        ["display-text", () => `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.b.cuboids[0])}</h2> matter cuboids, generating <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(layers.b.generation())}</h2> boxes per second.`],
        ["display-text", () => `Each effect disabled multiplies matter cuboids gain by ${format(Decimal.mul(10,layers.b.cuboidEffect(1)))}x.`],
        ["clickables",[2,3]],

        // fluid cuboids
        () => hasMilestone("b",0) ? "blank" : '',
        () => hasMilestone("b",0) ? ["clickables",[4]] : '',
        () => hasMilestone("b",0) && !player.b.boxed[1] ? ["display-text", `<span style="color:red">You are not eligible to gain fluid cuboids.</span>`] : '',
        () => hasMilestone("b",0) && player.b.boxed[1] && player.f.points.lt("1e365") ? ["display-text", `<span style="color:red">You need ${format("1e365")} fluid to generate fluid cuboids.</span>`] : '',
        () => hasMilestone("b",0) && player.b.boxed[1] && player.f.points.gte("1e365") ? ["display-text", `<span style="color:#00ff00">You are generating ${format(layers.b.cuboidGen(1))} fluid cuboids per second.</span>`] : '',
        () => hasMilestone("b",0) ? ["display-text", `You have <h2 style="color: #6cc9fe; text-shadow: 0px 0px 10px #6cc9fe">${format(player.b.cuboids[1])}</h2> fluid cuboids, boosting the multiplier per matter effect disabled by <h2 style="color: #6cc9fe; text-shadow: 0px 0px 10px #6cc9fe">${format(layers.b.cuboidEffect(1))}</h2>x.`] : '',
        () => hasMilestone("b",0) ? ["display-text", `Each effect disabled multiplies fluid cuboids gain by ${format(Decimal.mul(3,layers.b.cuboidEffect(2)))}x.`] : '',
        () => hasMilestone("b",0) ? ["clickables",[5,6]] : '',

        // chip cuboids
        () => hasMilestone("b",1) ? "blank" : '',
        () => hasMilestone("b",1) ? ["clickables",[7]] : '',
        () => hasMilestone("b",1) && !player.b.boxed[2] ? ["display-text", `<span style="color:red">You are not eligible to gain chip cuboids.</span>`] : '',
        () => hasMilestone("b",1) && player.b.boxed[2] && player.c.points.lt(1e185) ? ["display-text", `<span style="color:red">You need ${format(1e185)} chips to generate chip cuboids.</span>`] : '',
        () => hasMilestone("b",1) && player.b.boxed[2] && player.c.points.gte(1e185) ? ["display-text", `<span style="color:#00ff00">You are generating ${format(layers.b.cuboidGen(2))} chip cuboids per second.</span>`] : '',
        () => hasMilestone("b",1) ? ["display-text", `You have <h2 style="color: #8c51d8; text-shadow: 0px 0px 10px #8c51d8">${format(player.b.cuboids[2])}</h2> chip cuboids, boosting the multiplier per fluid effect disabled by <h2 style="color: #8c51d8; text-shadow: 0px 0px 10px #8c51d8">${format(layers.b.cuboidEffect(2))}</h2>x.`] : '',
        () => hasMilestone("b",1) ? ["display-text", `Each effect disabled multiplies chip cuboids gain by ${format(Decimal.mul(20,layers.b.cuboidEffect(3)))}x.`] : '',
        () => hasMilestone("b",1) ? ["clickables",[8]] : '',

        // string cuboids
        () => hasMilestone("b",2) ? "blank" : '',
        () => hasMilestone("b",2) ? ["clickables",[9]] : '',
        () => hasMilestone("b",2) && !player.b.boxed[3] ? ["display-text", `<span style="color:red">You are not eligible to gain string cuboids.</span>`] : '',
        () => hasMilestone("b",2) && player.b.boxed[3] && player.s.points.lt("1e880") ? ["display-text", `<span style="color:red">You need ${format("1e880")} strings to generate string cuboids.</span>`] : '',
        () => hasMilestone("b",2) && player.b.boxed[3] && player.s.points.gte("1e880") ? ["display-text", `<span style="color:#00ff00">You are generating ${format(layers.b.cuboidGen(3))} string cuboids per second.</span>`] : '',
        () => hasMilestone("b",2) ? ["display-text", `You have <h2 style="color: #2ec766; text-shadow: 0px 0px 10px #2ec766">${format(player.b.cuboids[3])}</h2> string cuboids, boosting the multiplier per fluid effect disabled by <h2 style="color: #2ec766; text-shadow: 0px 0px 10px #2ec766">${format(layers.b.cuboidEffect(3))}</h2>x.`] : '',
        () => hasMilestone("b",2) ? ["display-text", `Each effect disabled multiplies chip cuboids gain by ${format(10)}x.`] : '',
        () => hasMilestone("b",2) ? ["clickables",[10,11]] : '',
    ],
    buyables: {
        11: {
            title: "<h3>Packing Peanuts</h3>",
            cost(x) { return new Decimal(1000).mul(Decimal.pow(10, x)) },
            display() { return `<span style="font-size:12px;">Double boxes generation.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} boxes<br>Effect: ${format(this.effect())}x boxes/second</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Cuboid Clusters</h3>",
            cost(x) { return new Decimal(10000).mul(Decimal.pow(50, x)) },
            display() { return `<span style="font-size:12px;">Triple cuboids generation.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} boxes<br>Effect: ${format(this.effect())}x cuboids/second</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>Machine Makers</h3>",
            cost(x) { return new Decimal(500000).pow(Decimal.pow(1.35, x)).div(getBuyableAmount(this.layer, this.id).gte(4) ? 20000 : 1) },
            display() { return `<span style="font-size:12px;">Unlock a new boost that boxes give.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/6<br>Cost: ${format(this.cost())} boxes<br>Effect: ${formatWhole(getBuyableAmount(this.layer, this.id))} new boost${getBuyableAmount(this.layer, this.id).eq(1) ? `` : `s`}</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            purchaseLimit: 6,
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            title: "<h3>Delivery Drivers</h3>",
            cost(x) { return new Decimal(1e18).mul(Decimal.pow(1e6, x)).mul(Decimal.pow(10, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply boxes generation by 100x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} boxes<br>Effect: ${format(this.effect())}x boxes/second</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(100, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("b",2)},
        },
        22: {
            title: "<h3>Solid Superstructures</h3>",
            cost(x) { return new Decimal(1e24).mul(Decimal.pow(1e4, x)).mul(Decimal.pow(10, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply cuboids generation by 20x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} boxes<br>Effect: ${format(this.effect())}x cuboids/second</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(20, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("b",2)},
        },
        23: {
            title: "<h3>Gadget Generators</h3>",
            cost(x) { return new Decimal(1e43).pow(Decimal.pow(1.5, x)) },
            display() { return `<span style="font-size:12px;">Unlock a new string flavor.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/3<br>Cost: ${format(this.cost())} boxes<br>Effect: ${formatWhole(getBuyableAmount(this.layer, this.id))} new string flavor${getBuyableAmount(this.layer, this.id).eq(1) ? `` : `s`}</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            purchaseLimit: 3,
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return hasMilestone("b",2)},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${format(1e6)} matter cuboids`},
            effectDescription: "Unlock fluid cuboids.",
            done() { return player.b.cuboids[0].gte(1e6) },
            unlocked() { return getBuyableAmount("b",13).gte(1) },
        },
        1: {
            requirementDescription() {return `${format(1.5e8)} fluid cuboids`},
            effectDescription: "Unlock chip cuboids.",
            done() { return player.b.cuboids[1].gte(1.5e8) },
            unlocked() { return hasMilestone("b",0) },
        },
        2: {
            requirementDescription() {return `${format(2e9)} chip cuboids`},
            effectDescription: "Unlock string cuboids and 3 new box buyables, and improve the first boxes effect.",
            done() { return player.b.cuboids[2].gte(2e9) },
            unlocked() { return hasMilestone("b",1) },
        },
    },
    clickables: {
        11: {
            display() {return `<h2>Reset Matter</h2>`}, canClick() {return true}, onClick() {layers.m.boxReset(); player.b.boxed[0] = !player.b.boxed[0]},
            style() {
                return {"background-color": "#ff56f7"}
            },
        },
        12: {
            display() {return `<h2>Enable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[0]) {
                    for (let i = 0; i < player.b.matterToggles.length; i++) {
                        player.b.matterToggles[i] = true
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#ff56f7"}
            },
        },
        13: {
            display() {return `<h2>Disable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[0]) {
                    for (let i = 0; i < player.b.matterToggles.length; i++) {
                        player.b.matterToggles[i] = false
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#ff56f7"}
            },
        },
        14: {
            display() {return `<h2>Toggle All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[0]) {
                    for (let i = 0; i < player.b.matterToggles.length; i++) {
                        player.b.matterToggles[i] = !player.b.matterToggles[i]
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#ff56f7"}
            },
        },
        21: {
            display() {return `<h2>Matter Multiplier 1</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[0] = !player.b.matterToggles[0]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[0]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        22: {
            display() {return `<h2>Matter Multiplier 2</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[1] = !player.b.matterToggles[1]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[1]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        23: {
            display() {return `<h2>Matter Multiplier 3</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[2] = !player.b.matterToggles[2]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[2]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        24: {
            display() {return `<h2>Matter Multiplier 4</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[3] = !player.b.matterToggles[3]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[3]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        25: {
            display() {return `<h2>Matter Multiplier 5</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[4] = !player.b.matterToggles[4]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[4]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        26: {
            display() {return `<h2>Matter Multiplier 6</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[5] = !player.b.matterToggles[5]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[5]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        31: {
            display() {return `<h2>First Slider</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[6] = !player.b.matterToggles[6]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[6]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        32: {
            display() {return `<h2>Second Slider</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[7] = !player.b.matterToggles[7]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[7]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        33: {
            display() {return `<h2>Third Slider</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[0]) player.b.matterToggles[8] = !player.b.matterToggles[8]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.matterToggles[8]) style["background-color"] = "#ff56f7"
                else style["background-color"] = "#555555"
                return style
            },
        },
        41: {
            display() {return `<h2>Reset Fluid</h2>`}, canClick() {return true}, onClick() {layers.f.boxReset(); player.b.boxed[1] = !player.b.boxed[1]},
            style() {
                return {"background-color": "#6cc9fe"}
            },
        },
        42: {
            display() {return `<h2>Enable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[1]) {
                    for (let i = 0; i < player.b.fluidToggles.length; i++) {
                        player.b.fluidToggles[i] = true
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#6cc9fe"}
            },
        },
        43: {
            display() {return `<h2>Disable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[1]) {
                    for (let i = 0; i < player.b.fluidToggles.length; i++) {
                        player.b.fluidToggles[i] = false
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#6cc9fe"}
            },
        },
        44: {
            display() {return `<h2>Toggle All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[1]) {
                    for (let i = 0; i < player.b.fluidToggles.length; i++) {
                        player.b.fluidToggles[i] = !player.b.fluidToggles[i]
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#6cc9fe"}
            },
        },
        51: {
            display() {return `<h2>Pressure</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[0] = !player.b.fluidToggles[0]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[0]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        52: {
            display() {return `<h2>Volume</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[1] = !player.b.fluidToggles[1]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[1]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        53: {
            display() {return `<h2 style="font-size:13px;">Temperature</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[2] = !player.b.fluidToggles[2]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[2]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        54: {
            display() {return `<h2>Pressure<sup>2</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[3] = !player.b.fluidToggles[3]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[3]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        55: {
            display() {return `<h2>Volume<sup>2</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[4] = !player.b.fluidToggles[4]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[4]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        56: {
            display() {return `<h2 style="font-size:12.5px;">Temperature<sup>2</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[5] = !player.b.fluidToggles[5]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[5]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        61: {
            display() {return `<h2 style="font-size:11px;">Singularities Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[6] = !player.b.fluidToggles[6]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[6]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        62: {
            display() {return `<h2>Fluid Infinity</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[7] = !player.b.fluidToggles[7]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[7]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        63: {
            display() {return `<h2>Vapor Infinity</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[8] = !player.b.fluidToggles[8]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[8]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        64: {
            display() {return `<h2>Pressure<sup>3</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[9] = !player.b.fluidToggles[9]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[9]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        65: {
            display() {return `<h2>Volume<sup>3</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[10] = !player.b.fluidToggles[10]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[10]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        66: {
            display() {return `<h2 style="font-size:12.5px;">Temperature<sup>3</sup></h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[1]) player.b.fluidToggles[11] = !player.b.fluidToggles[11]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.fluidToggles[11]) style["background-color"] = "#6cc9fe"
                else style["background-color"] = "#555555"
                return style
            },
        },
        71: {
            display() {return `<h2>Reset Chips</h2>`}, canClick() {return true}, onClick() {layers.c.boxReset(); player.b.boxed[2] = !player.b.boxed[2]},
            style() {
                return {"background-color": "#8c51d8"}
            },
        },
        72: {
            display() {return `<h2>Enable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[2]) {
                    for (let i = 0; i < player.b.chipToggles.length; i++) {
                        player.b.chipToggles[i] = true
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#8c51d8"}
            },
        },
        73: {
            display() {return `<h2>Disable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[2]) {
                    for (let i = 0; i < player.b.chipToggles.length; i++) {
                        player.b.chipToggles[i] = false
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#8c51d8"}
            },
        },
        74: {
            display() {return `<h2>Toggle All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[2]) {
                    for (let i = 0; i < player.b.chipToggles.length; i++) {
                        player.b.chipToggles[i] = !player.b.chipToggles[i]
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#8c51d8"}
            },
        },
        81: {
            display() {return `<h2>Arithmetic Logic Unit</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[2]) player.b.chipToggles[0] = !player.b.chipToggles[0]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.chipToggles[0]) style["background-color"] = "#8c51d8"
                else style["background-color"] = "#555555"
                return style
            },
        },
        82: {
            display() {return `<h2>Central Processing Unit</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[2]) player.b.chipToggles[1] = !player.b.chipToggles[1]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.chipToggles[1]) style["background-color"] = "#8c51d8"
                else style["background-color"] = "#555555"
                return style
            },
        },
        83: {
            display() {return `<h2>Solid-State Drive</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[2]) player.b.chipToggles[2] = !player.b.chipToggles[2]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.chipToggles[2]) style["background-color"] = "#8c51d8"
                else style["background-color"] = "#555555"
                return style
            },
        },
        84: {
            display() {return `<h2>Power Supply Unit</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[2]) player.b.chipToggles[3] = !player.b.chipToggles[3]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.chipToggles[3]) style["background-color"] = "#8c51d8"
                else style["background-color"] = "#555555"
                return style
            },
        },
        85: {
            display() {return `<h2>Arithmetic Logic Unit II</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[2]) player.b.chipToggles[4] = !player.b.chipToggles[4]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.chipToggles[4]) style["background-color"] = "#8c51d8"
                else style["background-color"] = "#555555"
                return style
            },
        },
        91: {
            display() {return `<h2>Reset Strings</h2>`}, canClick() {return true}, onClick() {layers.s.boxReset(); player.b.boxed[3] = !player.b.boxed[3]},
            style() {
                return {"background-color": "#2ec766"}
            },
        },
        92: {
            display() {return `<h2>Enable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[3]) {
                    for (let i = 0; i < player.b.stringToggles.length; i++) {
                        player.b.stringToggles[i] = true
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#2ec766"}
            },
        },
        93: {
            display() {return `<h2>Disable All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[3]) {
                    for (let i = 0; i < player.b.stringToggles.length; i++) {
                        player.b.stringToggles[i] = false
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#2ec766"}
            },
        },
        94: {
            display() {return `<h2>Toggle All</h2>`}, canClick() {return true},
            onClick() {
                if (!player.b.boxed[3]) {
                    for (let i = 0; i < player.b.stringToggles.length; i++) {
                        player.b.stringToggles[i] = !player.b.stringToggles[i]
                    }
                }
            },
            style() {
                return {"width":"75px","min-height":"75px","background-color":"#2ec766"}
            },
        },
        101: {
            display() {return `<h2>Primary String Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[0] = !player.b.stringToggles[0]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[0]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        102: {
            display() {return `<h2>Secondary String Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[1] = !player.b.stringToggles[1]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[1]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        103: {
            display() {return `<h2>Tertiary String Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[2] = !player.b.stringToggles[2]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[2]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        104: {
            display() {return `<h2>Quaternary String Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[3] = !player.b.stringToggles[3]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[3]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        105: {
            display() {return `<h2>Quinary String Effect</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[4] = !player.b.stringToggles[4]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[4]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        111: {
            display() {return `<h2>Up String Flavor</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[5] = !player.b.stringToggles[5]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[5]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        112: {
            display() {return `<h2>Top String Flavor</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[6] = !player.b.stringToggles[6]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[6]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
        113: {
            display() {return `<h2>Charm String Flavor</h2>`}, canClick() {return true}, onClick() {if (!player.b.boxed[3]) player.b.stringToggles[7] = !player.b.stringToggles[7]},
            style() {
                const style = {}
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (player.b.stringToggles[7]) style["background-color"] = "#2ec766"
                else style["background-color"] = "#555555"
                return style
            },
        },
    },
})