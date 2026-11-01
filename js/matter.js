addLayer("m", {
    // general stuff
    name: "matter",
    symbol: "M",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        multiplier: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        power: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        particles: {
            protons: new Decimal(0), // boosts powers generation BUT hurts electron gain
            electrons: new Decimal(0), // divides matter multiplier costs BUT hurts proton gain
            muons: new Decimal(0), // divides 2nd electron effect BUT hurts tau particle gain
            tau: new Decimal(0), // boosts electron gain BUT hurts muon gain
            gluons: new Decimal(0), // raises the base output of the 1st slider
            photons: new Decimal(0), // raises the base output of the 2nd slider
        },
        slider: [0.5,0,0],
        sliderTime: 0,
        frozen: false,
    }},
    color: "#ff56f7",
    resource: "matter",
    type: "none",
    row: 0, // 0 is first row
    layerShown(){return true},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        for (let i = 1; i < 7; i++) mult = mult.mul(layers.m.powerMult(i))
        mult = mult.mul(layers.t.tokensEffect())
        mult = mult.mul(buyableEffect("s",11))
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        if (getBuyableAmount("b",13).gte(1)) exp = exp.mul(layers.b.boxesEffect(1))
        return exp
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    powerMult(x) {
        if (!player.b.matterToggles[x-1]) return new Decimal(1)
        return new Decimal(player[this.layer].power[x]).sqrt().add(1)
    },
    powerGen(x) {
        let gen = Decimal.pow(2, player[this.layer].multiplier[x]).mul(player[this.layer].multiplier[x])
        gen = gen.mul(layers.m.particleEff("proton",1))
        gen = gen.mul(layers.f.fluidEffect())
        gen = gen.mul(buyableEffect("m",11))
        return gen
    },
    multiplierCost(x) {
        let cost = Decimal.pow(Decimal.pow(10, Decimal.pow(2, x - 1)), Decimal.add(player[this.layer].multiplier[x], 1))
        cost = cost.div(layers.m.particleEff("electron",1))
        return cost
    },
    particleGen(str) {
        switch (str) {
            case "proton":
                if ((player.m.slider[0] < 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((0.5 - player.m.slider[0]) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("electron",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    gen = gen.mul(buyableEffect("m",12))
                    return gen
                } else return new Decimal(0)
            break
            case "electron":
                if ((player.m.slider[0] > 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((player.m.slider[0] - 0.5) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("proton",2))
                    gen = gen.mul(layers.m.particleEff("tau",1))
                    gen = gen.mul(layers.f.vaporEffect())
                    gen = gen.mul(buyableEffect("m",12))
                    return gen
                } else return new Decimal(0)
            break
            case "muon":
                if ((player.m.slider[1] < 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, 0.5 - player.m.slider[1]).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("tau",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    gen = gen.mul(buyableEffect("m",12))
                    return gen
                } else return new Decimal(0)
            break
            case "tau":
                if ((player.m.slider[1] > 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, player.m.slider[1] - 0.5).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("muon",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    gen = gen.mul(buyableEffect("m",12))
                    return gen
                } else return new Decimal(0)
            break
            case "gluon":
                let trueSlider = ((player.m.slider[2] + 0.02) / 2) + 0.5
                if (hasMilestone("m",2)) {
                    let gen
                    if (trueSlider > 0.4 && trueSlider < 0.6) gen = new Decimal(50)
                    else if (trueSlider < 0.4) gen = Decimal.sub(50, 50 * (1 - (trueSlider / 0.4)))
                    else if (trueSlider > 0.6) gen = Decimal.sub(50, 50 * ((trueSlider - 0.6) / 0.4))
                    gen = gen.mul(layers.f.vaporEffect())
                    gen = gen.mul(buyableEffect("m",12))
                    return gen
                } else return new Decimal(0)
            break
        }
    },
    particleEff(str,x) {
        let type = player.m.particles[str + (str == "tau" ? "" : "s")]
        switch (str) {
            case "proton":
                if (x == 1) {
                    let eff = !player.b.matterToggles[6] ? new Decimal(1) : type.pow(0.75).add(1)
                    if (getBuyableAmount("b",13).gte(2)) eff = eff.pow(layers.b.boxesEffect(2))
                    return eff
                }
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "electron":
                if (x == 1) {
                    let eff = !player.b.matterToggles[6] ? new Decimal(1) : type.cbrt().add(1)
                    if (getBuyableAmount("b",13).gte(2)) eff = eff.pow(layers.b.boxesEffect(2))
                    return eff
                }
                if (x == 2) return type.add(1).log10().add(1).div(layers.m.particleEff("muon",1))
            break
            case "muon":
                if (x == 1) return !player.b.matterToggles[7] ? new Decimal(1) : type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "tau":
                if (x == 1) return !player.b.matterToggles[7] ? new Decimal(1) : type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "gluon":
                if (!player.b.matterToggles[8]) return new Decimal(1)
                else return type.add(1).log10().add(1).ln().add(1)
            break
            case "photon":
                if (!player.b.matterToggles[8]) return new Decimal(1)
                else return type.add(1).log10().add(1).ln().add(1)
            break
        }
    },
    boxReset() {
        player.m.points = new Decimal(0)
        player.m.multiplier = [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        player.m.power = [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        player.m.particles = {
            protons: new Decimal(0),
            electrons: new Decimal(0),
            muons: new Decimal(0),
            tau: new Decimal(0),
            gluons: new Decimal(0),
            photons: new Decimal(0),
        }
    },
    automate() {
        let a = new Decimal(0)
        let b = new Decimal(0)
        let c = new Decimal(0)
        if (player.m.autoMults && hasMilestone("m",5)) {
            for (let i = 1; i < 7; i++) {
                if (player.m.points.gte(layers.m.multiplierCost(i))) {
                    player.m.multiplier[i] = player.m.points.mul(layers.m.particleEff("electron",1)).log(Decimal.pow(10, Decimal.pow(2, i - 1))).floor()
                }
            }
        }
        if (player.m.autoMatterBuyables && hasMilestone("m",7)) {
            a = new Decimal(200)
            b = new Decimal(1000)
            c = new Decimal(125000).sub(player.m.points.max(1).log10())
            setBuyableAmount("m", 11, tmp.m.buyables[11].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("m",11))
            a = new Decimal(500)
            b = new Decimal(2500)
            c = new Decimal(127500).sub(player.m.points.max(1).log10())
            setBuyableAmount("m", 12, tmp.m.buyables[12].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("m",12))
            a = new Decimal(1000)
            b = new Decimal(5000)
            c = new Decimal(130000).sub(player.m.points.max(1).log10())
            setBuyableAmount("m", 13, tmp.m.buyables[13].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("m",13))
        }
    },
    update(diff) {
        player[this.layer].points = player[this.layer].points.add(this.generation().mul(diff))
        for (let i = 1; i < 7; i++) {
            player[this.layer].power[i] = player[this.layer].power[i].add(layers.m.powerGen(i).mul(diff))
        }
        player[this.layer].particles.protons = player[this.layer].particles.protons.add(layers.m.particleGen("proton").mul(diff))
        player[this.layer].particles.electrons = player[this.layer].particles.electrons.add(layers.m.particleGen("electron").mul(diff))
        player[this.layer].particles.muons = player[this.layer].particles.muons.add(layers.m.particleGen("muon").mul(diff))
        player[this.layer].particles.tau = player[this.layer].particles.tau.add(layers.m.particleGen("tau").mul(diff))
        if (player.m.frozen) player[this.layer].particles.gluons = player[this.layer].particles.gluons.add(layers.m.particleGen("gluon").mul(diff))
        if (player.m.frozen) player[this.layer].particles.photons = player[this.layer].particles.photons.add(layers.m.particleGen("gluon").mul(diff))
        if (!player.m.frozen) player[this.layer].slider[1] -= diff / (hasMilestone("m",2) ? 10 : 50)
        player[this.layer].slider[1] = Math.max(player[this.layer].slider[1],0)
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].sliderTime += 0.05
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].slider[2] += Math.cos(player.m.sliderTime)*0.05
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `You are getting ${format(layers.m.generation())} matter per second.`],
        "blank",
        ["display-text", () => `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[1])}</h2> Tier 1 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[1])}</h2> Tier 1 power. (${format(layers.m.powerGen(1))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(1))}x)`],
        ["clickables", [1]],
        "blank",
        () => player.m.multiplier[1].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[2])}</h2> Tier 2 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[2])}</h2> Tier 2 power. (${format(layers.m.powerGen(2))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(2))}x)`] : '',
        () => player.m.multiplier[1].gt(0) ? ["clickables", [2]] : '',
        "blank",
        () => player.m.multiplier[2].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[3])}</h2> Tier 3 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[3])}</h2> Tier 3 power. (${format(layers.m.powerGen(3))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(3))}x)`] : '',
        () => player.m.multiplier[2].gt(0) ? ["clickables", [3]] : '',
        "blank",
        () => player.m.multiplier[3].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[4])}</h2> Tier 4 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[4])}</h2> Tier 4 power. (${format(layers.m.powerGen(4))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(4))}x)`] : '',
        () => player.m.multiplier[3].gt(0) ? ["clickables", [4]] : '',
        "blank",
        () => player.m.multiplier[4].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[5])}</h2> Tier 5 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[5])}</h2> Tier 5 power. (${format(layers.m.powerGen(5))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(5))}x)`] : '',
        () => player.m.multiplier[4].gt(0) ? ["clickables", [5]] : '',
        "blank",
        () => player.m.multiplier[5].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[6])}</h2> Tier 6 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[6])}</h2> Tier 6 power. (${format(layers.m.powerGen(6))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(6))}x)`] : '',
        () => player.m.multiplier[5].gt(0) ? ["clickables", [6]] : '',
        "blank",
        () => hasMilestone("m",6) ? "buyables" : '',
        () => hasMilestone("m",6) ? "blank" : '',
        () => hasMilestone("m",0) ? ["bar","slider1"] : '',
        () => hasMilestone("m",0) ? ["clickables",[7]] : '',
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #72e0ff">You have ${format(player.m.particles.protons)} protons, multiplying gain of Matter Multiplier powers by ${format(layers.m.particleEff("proton",1))}x<br>and dividing electron gain by /${format(layers.m.particleEff("proton",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #ff7272">You have ${format(player.m.particles.electrons)} electrons, dividing the cost of Matter Multipliers by /${format(layers.m.particleEff("electron",1))}<br>and dividing proton gain by /${formatSmall(layers.m.particleEff("electron",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["bar","slider2"] : '',
        () => hasMilestone("m",1) ? ["clickables",[8]] : '',
        () => hasMilestone("m",1) ? ["display-text", `This slider naturally decays.`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #ffc95d">You have ${format(player.m.particles.muons)} muons, dividing the 2nd electron effect by /${format(layers.m.particleEff("muon",1))}<br>and dividing tau particle gain by /${format(layers.m.particleEff("muon",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #85fe84">You have ${format(player.m.particles.tau)} tau particles, multiplying electron gain by ${format(layers.m.particleEff("tau",1))}x<br>and dividing muon gain by /${format(layers.m.particleEff("tau",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["bar","slider3"] : '',
        () => hasMilestone("m",2) ? ["clickables",[9]] : '',
        () => hasMilestone("m",2) ? ["display-text", `Freezing this slider in the center will provide the max production.`] : '',
        () => hasMilestone("m",2) ? ["display-text", `Freezing the 3rd slider also freezes the 2nd slider.`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #c56fff">You have ${format(player.m.particles.gluons)} gluons, raising the base output of the 1st slider by ^${format(layers.m.particleEff("gluon"))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #fffd74">You have ${format(player.m.particles.photons)} photons, raising the base output of the 2nd slider by ^${format(layers.m.particleEff("photon"))}.</span>`] : '',
        "blank",
        "blank",
    ],
    buyables: {
        11: {
            title: "<h3>Spacetime Compression</h3>",
            cost(x) { return new Decimal("1e125000").mul(Decimal.pow("1e1000", x)).mul(Decimal.pow(1e200, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply gain of Matter Multiplier powers by 10,000.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} matter<br>Effect: ${format(this.effect())}x Matter Multiplier powers</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(10000, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Particle Acceleration</h3>",
            cost(x) { return new Decimal("1e127500").mul(Decimal.pow("1e2500", x)).mul(Decimal.pow("1e500", x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply gain of matter particles by 1e20.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} matter<br>Effect: ${format(this.effect())}x particles</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(1e20, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>Probability Field Manipulation</h3>",
            cost(x) { return new Decimal("1e130000").mul(Decimal.pow("1e5000", x)).mul(Decimal.pow("1e1000", x.pow(2))) },
            display() { return `<span style="font-size:12px;">Triple tokens gain.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} matter<br>Effect: ${format(this.effect())}x tokens</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${format(1e7)} matter`},
            effectDescription: "Unlock the first slider.",
            done() { return player.m.points.gte(1e7) },
            unlocked() { return player.m.multiplier[3].gt(0) },
        },
        1: {
            requirementDescription() {return `${format(1e21)} matter`},
            effectDescription: "Unlock the second slider.",
            done() { return player.m.points.gte(1e21) },
            unlocked() { return player.m.multiplier[5].gt(0) },
        },
        2: {
            requirementDescription() {return `${format(1e44)} matter`},
            effectDescription: "Unlock the third slider, and the second slider decays faster.",
            done() { return player.m.points.gte(1e44) },
            unlocked() { return player.m.multiplier[6].gt(0) },
        },
        3: {
            requirementDescription() {return `${format(1e60)} matter`},
            effectDescription: "You can produce protons and electrons when the 1st slider is centered.",
            done() { return player.m.points.gte(1e60) },
            unlocked() { return hasMilestone("m",2) },
        },
        4: {
            requirementDescription() {return `${format(1e80)} matter`},
            effectDescription: "You can produce muons and tau particles when the 2nd slider is empty.",
            done() { return player.m.points.gte(1e80) },
            unlocked() { return player.f.unlocked },
        },
        5: {
            requirementDescription() {return `${format(1e120)} matter`},
            effectDescription: "Autobuy Multiplier Multipliers without consuming matter.",
            done() { return player.m.points.gte(1e120) },
            unlocked() { return player.f.unlocked },
            toggles: [
                ["m","autoMults"],
            ],
        },
        6: {
            requirementDescription() {return `${format("1e130000")} matter`},
            effectDescription: "Unlock matter buyables.",
            done() { return player.m.points.gte("1e130000") },
            unlocked() { return player.t.unlocked },
        },
        7: {
            requirementDescription() {return `${format("1e1000000")} matter`},
            effectDescription: "Autobuy matter buyables without consuming matter.",
            done() { return player.m.points.gte("1e1000000") },
            unlocked() { return player.k.unlocked },
            toggles: [
                ["m","autoMatterBuyables"],
            ],
        },
    },
    clickables: {
        11: {
            display() {return `Buy for ${format(layers.m.multiplierCost(1))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(1))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(1))
                player.m.multiplier[1] = player.m.multiplier[1].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        21: {
            display() {return `Buy for ${format(layers.m.multiplierCost(2))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(2))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(2))
                player.m.multiplier[2] = player.m.multiplier[2].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        31: {
            display() {return `Buy for ${format(layers.m.multiplierCost(3))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(3))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(3))
                player.m.multiplier[3] = player.m.multiplier[3].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        41: {
            display() {return `Buy for ${format(layers.m.multiplierCost(4))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(4))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(4))
                player.m.multiplier[4] = player.m.multiplier[4].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        51: {
            display() {return `Buy for ${format(layers.m.multiplierCost(5))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(5))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(5))
                player.m.multiplier[5] = player.m.multiplier[5].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        61: {
            display() {return `Buy for ${format(layers.m.multiplierCost(6))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(6))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(6))
                player.m.multiplier[6] = player.m.multiplier[6].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        71: {display: `<h2><-</h2>`,onClick() {player.m.slider[0] -= 0.25},canClick() {return player.m.slider[0] > 0},style() {return {"width": "75px", "min-height": "75px"}},},
        72: {display: `<h2>-></h2>`,onClick() {player.m.slider[0] += 0.25},canClick() {return player.m.slider[0] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        81: {display: `<h2>-></h2>`,onClick() {player.m.slider[1] += 0.2; player.m.slider[1] = Math.min(player.m.slider[1],1)},canClick() {return player.m.slider[1] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        91: {display() {return `<h3>${player.m.frozen ? `Unfreeze` : `Freeze`}</h3>`},onClick() {player.m.frozen = !player.m.frozen},canClick() {return true},style() {return {"width": "75px", "min-height": "75px"}},},
    },
    bars: {
        slider1: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[0]},
            display: () => `Producing ${format(layers.m.particleGen("proton"))} protons and ${format(layers.m.particleGen("electron"))} electrons per second`,
            fillStyle() { return {"background-color": "#c00eb7"} },
        },
        slider2: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[1]},
            display: () => `Producing ${format(layers.m.particleGen("muon"))} muons and ${format(layers.m.particleGen("tau"))} tau particles per second`,
            fillStyle() { return {"background-color": "#680b63"} },
        },
        slider3: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return ((player.m.slider[2] + 0.02) / 2) + 0.5},
            display: () => `${player.m.frozen ? `Producing ${format(layers.m.particleGen("gluon"))} gluons and photons per second` : `Will start producing when frozen`}`,
            fillStyle() { return {"background-color": "#a94ea6"} },
        },
    },
})