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

    // UI format
    tabFormat: [
        ["display-text", () => `Nothing to see here as of now...`],
        "achievements"
    ],
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
    },
})