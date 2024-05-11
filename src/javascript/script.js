import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const input = document.querySelector('input');
const sendButton = document.querySelector('#sendbutton');
const showHistory = document.querySelector('#showhistory');

const API_KEY = "AIzaSyDLXP8C9TZAoFeopF4-WdqcBCpVpWG9PZA";

// Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Configurações de geração
const generationConfig = {
    temperature: 1,
    topP: 1,
    topK: 100,
};

// Configurações de segurança
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const historico = [
    {
        role: "user",
        parts: [{ text: "Você é um narrador de uma história rpg, e cada vez que você narra a mensagem não pode ultrapassar 300 caracteres " + 
        "e no final você dá uma abertura para o jogador continuar a falar, tipo 'o que fará agora?', 'como partirá daqui pra frente?', e etc." +
        " Além disso você não irá deixar o jogador fazer coisas humanamente impossíveis" }],
    },
    {
        role: "model",
        parts: [{ text: "Certo, Irei contar uma história sobre um aldeão que sonhava em se tornar rei, este é você. Deitado na cama, perdido " +
        "nos pensamentos, você volta pra realidade por um momento, o que você fará agora?" }],
    },
    {
        role: "user",
        parts: [{ text: "Vou até o castelo e falo com rei" }]
    },
    {
        role: "model",
        parts: [{ text: "Depois de dias em sua jornada ao castelo, lá está você, em frente ao rei, ele olha para você com um olhar furioso. " +
        "O que será que pode acontecer se falar com ele?" }],
    },
    {
        role: "user",
        parts: [{ text: "Eu queria que a história me levasse direto da cama para o castelo sem durar vários dias" }]
    },
    {
        role: "model",
        parts: [{ text: "*Você estava na cama, e a viajem até o castelo dura muito tempo, não tem como você realizar essa viajem em um dia, " +
        "deseja voltar para antes dessa ação?*" }]
    },
    {
        role: "user",
        parts: [{ text: "Sim" }]
    },
    {
        role: "model",
        parts: [{ text: "Certo, Irei contar uma história sobre um aldeão que sonhava em se tornar rei, este é você. Deitado na cama, perdido " + 
        "nos pensamentos, você volta pra realidade por um momento, o que você fará agora?" }],
    },
]

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

async function run(prompt) {

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: historico
    });

    const msg = prompt

    document.body.style.backgroundColor = 'blue';

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    alert(text);

    historico.push({
        role: "user",
        parts: [{ text: msg }]
    })
    historico.push({
        role: "model",
        parts: [{ text: text }]
    })
    
    document.body.style.backgroundColor = 'white';
}

sendButton.addEventListener('click', () => {
    run(input.value);
});

showHistory.addEventListener('click', () => {
    historico.forEach(el => {
        console.log(el.role + "\r\n");
        console.log(el.parts[0].text + "\r\n");
    });
});