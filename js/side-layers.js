addLayer("ach", {
    // general stuff
    name: "achievements",
    symbol: "★",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#999999",
    tooltip: "Achievements",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI elements
    tabFormat: [
        () => !player.f.unlocked ? ["display-text", `Nothing to see here as of now...`] : '',
        () => player.f.unlocked ? ["display-text", `You unlock one row for every node unlocked and one column for every other node unlocked.`] : '',
        "blank",
        () => player.f.unlocked ? "achievements" : '',
    ],
    achievements: {
        11: {
            name: "Floating point overflow",
            done() {return player.m.points.gte(Decimal.pow(2, 1024))},
            tooltip() {return `Reach ${format(Decimal.pow(2, 1024))} matter.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
        },
        12: {
            name: "Strong interactions",
            done() {return player.m.particles.gluons.gte(1e128)},
            tooltip() {return `Reach ${format(1e128)} gluons.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
            unlocked() {return player.s.unlocked},
        },
        13: {
            name: "Outer space vacuum",
            done() {return player.m.points.gte("1e4000") && player.b.boxed[0] && !player.b.matterToggles[6]},
            tooltip() {return `Generate matter cuboids with the first slider disabled.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
            unlocked() {return player.t.unlocked},
        },
        21: {
            name: "Skynet",
            done() {return player.f.singularities.gte(1e9)},
            tooltip() {return `Reach ${format(1e9)} singularities.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
        },
        22: {
            name: "Things are heating up",
            done() {return player.f.planckPoints.gte(1e21)},
            tooltip() {return `Reach ${format(1e21)} Planck points.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
            unlocked() {return player.s.unlocked},
        },
        23: {
            name: "Pocket-size anomaly",
            done() {return player.f.infinityFills[2].gte(1e150)},
            tooltip() {return `Store ${format(1e150)} singularities.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
            unlocked() {return player.t.unlocked},
        },
        31: {
            name: "Conway's weeds",
            done() {return layers.c.upgraderTileCount() >= 80},
            tooltip() {return `Have at least ${formatWhole(80)} upgrader tiles.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.c.unlocked}
        },
        32: {
            name: "Unconditional loop",
            done() {return hasMilestone("c",6)},
            tooltip() {return `Get the 7th chips milestone.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.s.unlocked},
        },
        33: {
            name: "Boolean algebra",
            done() {return getBuyableAmount("tr",11).gt(0) && getBuyableAmount("tr",12).gt(0) && getBuyableAmount("tr",13).gt(0) && getBuyableAmount("tr",21).gt(0) && getBuyableAmount("tr",22).gt(0) && getBuyableAmount("tr",23).gt(0)},
            tooltip() {return `Have 1 purchase of each transistor buyable.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.t.unlocked},
        },
        41: {
            name: "Extrusion",
            done() {return player.s.dimensionUpgrades[3].gte(3)},
            tooltip() {return `Reach a primary string depth of 3m.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
        42: {
            name: "Quint-essential",
            done() {return player.s.stringTypes[5].gte(55555)},
            tooltip() {return `Reach ${format(55555)} quinary strings.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
        43: {
            name: "Gamma-ray burst",
            done() {return layers.s.oscillationsGen().gte(3e19)},
            tooltip() {return `Reach ${format(3e19)} oscillations per second.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.t.unlocked},
        },
        51: {
            name: "Pandora's Box",
            done() {return getBuyableAmount("b",13).gte(3)},
            tooltip() {return `Have 3 Machine Makers.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#e56b00"; return style},
            unlocked() {return player.b.unlocked}
        },
        52: {
            name: "Sinking ships",
            done() {return player.f.points.gte("1e365") && player.b.boxed[1] && !player.b.fluidToggles.includes(true)},
            tooltip() {return `Generate fluid cuboids with all fluid mechanic effects disabled.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#e56b00"; return style},
            unlocked() {return player.b.unlocked}
        },
        53: {
            name: "Black box hypothetical",
            done() {return !player.b.matterToggles.includes(true) && !player.b.fluidToggles.includes(true) && !player.b.chipToggles.includes(true) && !player.b.stringToggles.includes(true) && !player.b.boxToggles.includes(true)},
            tooltip() {return `Disable all possible toggles.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#e56b00"; return style},
            unlocked() {return player.t.unlocked},
        },
        61: {
            name: "Gamblecore",
            done() {return player.t.streak >= 5},
            tooltip() {return `Get a streak of 5.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#9cd3b0"; return style},
            unlocked() {return player.t.unlocked},
        },
        62: {
            name: "Read it and weep",
            done() {return layers.t.checkDice() == "Yahtzee"},
            tooltip() {return `Roll a Yahtzee.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#9cd3b0"; return style},
            unlocked() {return player.t.unlocked},
        },
        63: {
            name: "Catch this bluff",
            done() {return layers.t.blackjackTotal() > 21 && layers.t.blackjackTotal() <= buyableEffect("t",32)},
            tooltip() {return `Have more than a total of 21 in a valid blackjack hand.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#9cd3b0"; return style},
            unlocked() {return player.t.unlocked},
        },
        71: {
            name: "Swooned",
            done() {return player.k.inBattle && layers.k.knightStats("attack").sub(player.k.battleStats.enemyDefense).max(0).gte(player.k.battleStats.enemyMaxHealth)},
            tooltip() {return `Defeat an enemy in one hit.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2e3fff"; return style},
            unlocked() {return player.k.unlocked},
        },
        72: {
            name: "You and what army?",
            done() {return player.k.activeKnights.gte(1e18)},
            tooltip() {return `Command an army of ${format(1e18)} knights.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2e3fff"; return style},
            unlocked() {return player.k.unlocked},
        },
        73: {
            name: "Fractured landscape",
            done() {return player.k.zone >= 60},
            tooltip() {return `Reach the Edge of the World.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2e3fff"; return style},
            unlocked() {return player.k.unlocked},
        },
    },
})

addLayer("help", {
    // general stuff
    name: "help",
    symbol: "?",
    position: 1, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#ffffff",
    tooltip: "Help",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI format
    tabFormat: {
        "About": {
            content: [
                ["display-text", () => `Note: This is not a tutorial menu, it is the help menu.`],
            ],
        },
        "Matter": {
            buttonStyle: {
                "border-color": "#ff56f7",
            },
            content: [
                ["display-text", () => `I awoke in a vast, formless void. At first, I was unable to open my eyes. Carefully, my eyelids receded and lifted. It was initially difficult to tell whether my eyes were open or closed.<br><br>
                I tried moving. I attempted to flail my arms, but they stood still. My limbs felt encased in rock, as if the weight of the world was tied to me. I tried shaking my legs, but they too refused to comply with my intentions.<br><br>
                After a while, I thought about using my voice. I called out, desperate for an answer.<br><br>
                "Is anyone there? I need help!" I tried to say, but it came out muffled. It was like a hand was pressed to my mouth. My throat felt tight.<br><br>
                The abyss gave no response.<br><br>
                "I'm all alone! I can't move! Please, someone help me!" I thought.<br><br>
                I wanted to scream, but I could not. I wanted tears to run down my face, to feel something, but even the ducts in my eyes refused to move my tears.<br><br>
                "Please..."<br><br>
                If reality exists in the mind, then my mind was empty. Nothing but darkness encompassed my perception. Yet, there was so much pressure around me.<br><br>
                I believed that the world around me was conspiring against me to break my resolve. It wanted me to shake my fist at my fate and hopelessly surrender to the void. But I will not comply! Just as my body refuses to obey me, I will not stand down to what is thrown at me. I will escape this prison...this torment!<br><br>
                At some moment, I will find out how to move. And I will get out of here.<br><br>
                Can you hear me?`],
            ],
        },
        "Fluid": {
            unlocked() {return player.f.unlocked},
            buttonStyle: {
                "border-color": "#6cc9fe",
            },
            content: [
                ["display-text", () => `I think I've discovered something. Due to my limited senses, I didn't realize the feeling at first. It's as if this place is the only stimuli I've ever experienced. Such a stifling location will do that to you.<br><br>
                I was at the bottom of an endless ocean. Dark waters stretched all around me. The sea constricted me, compressing my lungs until they could not retaliate. I felt the sand underneath my feet, the tiny pebbles sliding between my toes, bustling toward some unknown destination.<br><br>
                For a while, I slowly trained myself to move my legs again. Now aware of the water around me, I slowly waded my legs through the currents. I drifted my feet around to kick the sand. I so badly wanted to feel texture any way I could.<br><br>
                I was bored. My mind began to drift. I typically pace when I'm trying to make sense of my thoughts; unfortunately, I didn't have that luxury at the moment.<br><br>
                For most of my life, I have felt pressure on top of me. Whether that was good grades, kind behavior, or the right perception, I followed. I want others to be happy. Why can't I say the same for myself?<br><br>
                Think about this for a moment. Have you ever sacrificed your own well-being for the convenience of others?<br><br>
                I sometimes feared that I would inevitably work a job that I hated; worse, I would never be hired because of a nonexistent market. I even thought that I wasn't supposed to exist in this world, and that it rejects me, for its systems were not designed with me in mind. Perhaps that's why I was trapped here.<br><br>
                I tried to take a deep breath, yet I choked on the water as it rushed into my throat. I coughed. That's the first time I was able to shout.<br><br>
                I attempted to clear my head. Let's shift to an optimistic perspective.<br><br>
                I genuinely believe that the world will get better over time. New concepts will be normalized, more opportunities will be accessible, and technology will improve.<br><br>
                Despite whatever pressures you have mounted on yourself, please remember that the future is uncertain, so you can be the one to shape it.`],
            ],
        },
        "Chips": {
            unlocked() {return player.c.unlocked},
            buttonStyle: {
                "border-color": "#8c51d8",
            },
            content: [
                ["display-text", () => `Within this new environment, I eventually regained the ability to move around freely. The more that I exercised my muscles in this pressurized location, the more that my limbs adjusted to become useful again.<br><br>
                At one point, I grew curious. I stretched my left leg forward, slowly pressing my foot down into the sand. Then, I consciously made my left leg into a pivot. Picking up my right leg, I was able to place my foot down further than my left foot. I had figured out how to walk!<br><br>
                Every now and then, I walked around and explored my new habitat. I made sure to draw a circle in the sand from where I had first spawned. Initially, I only traveled a few meters forward and then retreated anxiously. But as I continued my movements, I became more daring with my pathing.<br><br>
                Ten meters. Twenty meters. Fifty meters. At some point, I decided that I was going to keep moving forward in a straight line. I would refuse to walk back until I found something interesting. Now that I had sealed my mental pact, I gazed wistfully into the horizon of the undersea and began my long trek.<br><br>
                For a long time, I didn't see anything but the preexisting water and sand that I had unfortunately grown accustomed to. However, this changed when I was approximately 300 meters into my journey.<br><br>
                There was a light. A blinking green light, far away from me. But I could still see it. I grew so excited that at some point my body forgot to recognize the pressure around me.<br><br>
                I attempted to jump, and my feet were lifted off the ground. However, I didn't fall back down. I flailed my arms, and yet they only pushed me forward. At that moment, I realized that I was able to freely swim.<br><br>
                I kept swimming and reached the green light. It was coming from a small computer on a desk. Alongside the computer was a keyboard and mouse. Why was this here at the bottom of the ocean? It probably didn't even work. But why was the setup so neatly put together?<br><br>
                This reminds me about something. Humans naturally want to figure out the solutions to everything. Oftentimes, forcing neat answers to all of life's questions forms a misconstrued picture.<br><br>
                Many of us so badly want to pretend that we are fully rational creatures. However, in the farthest corners of our brains, there exists an irrational mind. One with thoughts, desires, and emotions that we cannot fully understand. We try to logically reason through why these thoughts are wrong or irrelevant; yet, they continue to return.<br><br>
                I think I just need to accept that my world is inherently irrational, too.`],
            ],
        },
        "Strings": {
            unlocked() {return player.s.unlocked},
            buttonStyle: {
                "border-color": "#2ec766",
            },
            content: [
                ["display-text", () => `Carefully sitting down in the desk chair that was in front of me, I began to stare blankly at the empty computer monitor. After traveling this distance, I was relieved to have time to consider my steps going forward.<br><br>
                Would this computer work underwater? If so, what's on it? Would it help me at all? I guess there was only one way to find out.<br><br>
                I pressed the power button and began to hear a soft whirring. I had only heard the sound of the water moving around me for so long, so my ears were sensitive to this newfound noise. I welcomed this new stimulus.<br><br>
                Believe me, I was in shock when the monitor flashed brightly. I ignored any questions that poured into my mind regarding how the computer was working while submerged at this depth because I was unaware of how I awoke sumberged at this depth, too.<br><br>
                Unfortunately, the computer did not possess an operating system. The white screen transitioned into an old-school terminal. A green ">" symbol with a flickering bar demanded my attention.<br><br>
                I didn't know any computer programming, so I didn't know if I would get anywhere. I tried to type one simple command, hoping that it worked.<br><br>
                <span style="color:#00ff00">"> start"</span><br>
                <span style="color:#ff0000">"ERROR: Invalid command. Type 'help' for available commands."</span><br><br>
                Well, that seemed like good advice.<br><br>
                <span style="color:#00ff00">"> help"</span><br>
                <span style="color:#00ff00">"AVAILABLE COMMANDS: help, matter, fluid, chips, strings"</span><br><br>
                I thought to myself that those were overly specific and strange commands. Nevertheless, I ignored that sentiment and tried each command in succession. I was surprised to see that the pages that were displayed were my thoughts relating to my oceanic imprisonment.<br><br>
                I read the starting words of the "matter" page. "I awoke in a vast, formless void. At first, I was unable to open my eyes..."<br><br>
                My head felt heavy. I felt like I was going to be sick. After some additional reading, I typed the last available command.<br><br>
                <span style="color:#00ff00">"> strings"</span><br><br>
                Rather than there being paragraphs displayed, a 3D ASCII display of a fluctuating grid appeared. Some text was written out at the bottom the screen, claiming that this was a quantum physics simulation.<br><br>
                You know, after reading some of my transcribed thoughts through these commands, I recognize that I may come across as preachy or pretentious, as if I think I'm describing very deep or original feelings or perspectives that no one's ever said before when I'm actually making a fool out of myself. The truth is that I simply want to get out of here, okay?`],
            ],
        },
        "Boxes": {
            unlocked() {return player.b.unlocked},
            buttonStyle: {
                "border-color": "#e56b00",
            },
            content: [
                ["display-text", () => `I was too confused and inexperienced to understand the simulation on the screen, so I scrolled past it. Glancing at the terminal, I was surprised to see a new message:<br><br>
                <span style="color:#00ff00">"A new command has been unlocked. Type 'boxes' to learn more."</span><br><br>
                If you say so...<br><br>
                <span style="color:#00ff00">"> boxes"</span><br><br>
                Upon pressing ENTER, the computer displayed a large ASCII square with an X on it. The X blinked in and out of existence every second. There were periods, too, that were scattered across the square.<br><br>
                It took me a while to figure out what I was looking at, but I eventually realized that the computer was showing me a map of my environment. The periods were potentially representing the scattered sands, and as for the X...<br><br>
                Was it my current location? If so, did that mean that there's been a fence around me this whole time? There's a slim chance, I thought, but the chance of escaping may be possible.<br><br>
                After taking a final look at the illustrated map, I nodded the electronic setup goodbye and headed west, swimming through the ocean much more gracefully than earlier. I believed that giving myself time to rest was beneficial for my endurance through these waters.<br><br>
                As I continued, I noticed something in the horizon getting closer and darker. I began telling myself that my freedom was not just possible anymore, but probable! The natural fog of the water slowly dwindled. Once I reached the structure, I placed my feet back down on the ground and took time to understand what was in front of me.<br><br>
                A black wall stood before me. I could not see the top of the wall. With this, I came to the conclusion that I was either trapped inside a fenced-in area or a giant cube.<br><br>
                Throughout our lives, we are constantly placed within various boxes, whether by ourselves or by others. But to be trapped in a literal box rather than a metaphorical one was quite stifling. I placed my hand against the wall, expecting to feel something akin to solid concrete, but was met with a dark, viscous liquid instead. I was shockingly able to pass through!<br><br>
                While passing through the wall was more suffocating than anything I had experienced before, I felt something in my chest akin to euphoria, whether that was the fleeting adrenaline rush of escapism or the joy of escaping predetermined boundaries.<br><br>
                No box fits all, and this enormous box certainly never fit me. When we realize the walls and ceilings around us, we can escape our boxes and find personal satisfaction that we never had before.`],
            ],
        },
        "Tokens": {
            unlocked() {return player.t.unlocked},
            buttonStyle: {
                "border-color": "#9cd3b0",
            },
            content: [
                ["display-text", () => `When I emerged from the wall, the bright light and new atmospheric pressure struck my body. I immediately fell and writhed on the ground from the intense burst of new stimuli. After several minutes, I got myself on two feet again to view my new surroundings.<br><br>
                It was a simple biome: grassy hills, distant oak trees, and a sandy beach. However, the longer I stayed in this environment, the more I realized that something was deeply wrong here.<br><br>
                Everywhere I looked, the colors were dull. The grass was a muddled green and the sky was a murky blue. The trees didn't stand straight up; instead, they were slightly askew. The beach seemed nice at first, but the sand was too pale and the water was too uninviting.<br><br>
                My distaste for this place soon grew to become disgust, and then morphed into an all-pervasive sadness. The plastic forest was too unfulfilling to hike in. The grass was too sickly to frolick in. The sky was too dim to observe the stars.<br><br>
                A question began to float around in my mind: would it be better to return to the ocean?<br><br>
                No, I couldn't. The ocean was significantly worse. After enough periods of pondering, I recognized the problem with my trail of thought. The ocean did not disguise its misery; meanwhile, the forest did.<br><br>
                Have you ever noticed something deeply wrong in your life that makes everything else dull? Something that slowly eats away at you that becomes progressively more difficult to ignore?<br><br>
                All I could think about after a while was how to get out of here. The very moment I escaped my previous prison, I had entered a new one.<br><br>
                It feels like I'm not in control of my life. We're all born in random locations with random characteristics. The cruel game of life dictates that we must deal with whatever we have, no matter the unfairness.<br><br>
                If I keep moving forward, perhaps I'll have more control of the dice.`],
            ],
        },
        "Knights": {
            unlocked() {return player.k.unlocked},
            buttonStyle: {
                "border-color": "#2e3fff",
            },
            content: [
                ["display-text", () => `I went on a walk one day with no particular destination in mind. During my stroll, I noticed something peculiar below me. Something was moving on the ground, without my influence! I crouched, gazing downward, to take a closer look.<br><br>
                An insect lied before me. It was a tiny beetle, going about its day like any other creature. I watched this insect for hours, because I had nothing else to do. Sometimes it would munch on a plant, like a blade of grass or a fallen leaf. At other times, it would inch for long distances, trying to find a place to house itself.<br><br>
                One day, it was raining heavily in the forest, and the dirt got all muddy. I eventually lost track of the beetle, and I assumed that it got washed away. When the rain cleared to make way for yet another average day, the beetle was indeed nowhere to be found.<br><br.
                I hope wherever the beetle is, it lived through that storm. However, by now, that beetle is probably dead.<br><br>
                Looking back, I still miss watching that beetle's journey. It seemed free to do whatever it wanted in a vast, expansive world, far bigger than it could ever imagine. But considering the beetle's situation further, I realized it is much harder for the beetle to climb the tallest trees and hike the highest hills.<br><br>
                When we think about our places in the universe, we sometimes make ourselves out to be so tiny and insignificant. The planets, the binary star systems, and the galaxies all outrank us in their immense sizes and lifespans. However, we are also viewed as giants by ants, grains of rice, and the sextillions of water molecules in a single drop of water.<br><br>
                So that's what I want people to recognize. I want people to know that the scale of everything is relative to everything else, and therefore, everything is connected to each other. And this doesn't just apply to the physical realm.<br><br>
                Before I ended up in this barren, bewildering world, I consistently thought about whether my problems were too tiny to be significant. There were so many people who had it worse than me. I could eat food reliably, sleep up to 8 hours a night, and receive a good education.<br><br>
                However, the truth is much more complicated. No matter how small or large your problems are, if they affect you, they're probably worth noticing. Especially for me right now. Up to this point, I never got anywhere by not caring.`],
            ],
        },
    },
})