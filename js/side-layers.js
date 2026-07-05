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
        21: {
            name: "Skynet",
            done() {return player.f.singularities.gte(1e9)},
            tooltip() {return `Reach ${format(1e9)} singularities.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
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
    },
})