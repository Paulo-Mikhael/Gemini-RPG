import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const character = document.querySelector('#character').textContent;

const strenght = document.querySelector('#strenght').textContent;
const vitality = document.querySelector('#vitality').textContent;
const intelligence = document.querySelector('#intelligence').textContent;
const dexterity = document.querySelector('#dexterity').textContent;
const wisdom = document.querySelector('#wisdom').textContent;
const charisma = document.querySelector('#charisma').textContent;

const world = document.querySelector('#world').textContent;

const startButton = document.querySelector('#start-button');
const messages = document.querySelectorAll('h5');

messages.forEach(element => {
    let value;

    element.addEventListener('focus', () => {
        element.textContent = "";
    });
    element.addEventListener('blur', () => {
        if (element.textContent == ""){
            element.contentEditable = "true";
            element.textContent = 'Fale algo!';
        }
        else{
            element.contentEditable = "false";
        }
    });
});

const API_KEY = KEY;

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
        parts: [{ text: "Você é um narrador de uma história rpg, e deve seguir estas regras: cada vez que você narra a mensagem não pode " +
        "Você não irá deixar o jogador fazer coisas impossíveis, para definir o que é possível ou não o jogador fazer, " +
        "você deve seguir os status do jogador: Força - " + strenght + ", Vitalidade: " + vitality + ", Destreza: " + dexterity + ", Carisma: " +
        charisma + ", Inteligência: " + intelligence + ", Sabedoria: " + wisdom + ". Sendo que," + 
        "A Força representa a capacidade física bruta do personagem, influenciando sua habilidade em causar dano corpo a corpo, carregar itens pesados e executar tarefas que exigem força física," +    
        "A Destreza refere-se à agilidade, reflexos e coordenação motora fina do personagem. Afeta sua precisão em ataques à distância, esquiva de ataques inimigos e habilidades que exigem movimentos rápidos e precisos," +
        "A Vitalidade indica a resistência física e saúde do personagem. Influencia sua capacidade de resistir a danos, doenças e condições adversas, bem como sua resistência a efeitos negativos," +
        "A Inteligência representa a capacidade mental, conhecimento e habilidade de resolver problemas. Afeta habilidades mágicas, capacidade de aprendizado, e resolver enigmas ou desafios intelectuais," +
        "A Sabedoria refere-se ao discernimento, intuição e percepção do personagem. Influencia a capacidade de perceber sutilezas, resistir a influências mágicas ou mentais, e tomar decisões sábias e prudentes e " +
        "O Carisma indica o carisma, presença e persuasão do personagem. Afeta sua habilidade de interagir com NPCs e outros personagens, persuadir ou intimidar, bem como sua capacidade de liderança e influência sobre os outros personagens."
    }],
    },
    {
        role: "model",
        parts: [{ text: "Irei contar uma história sobre " + character + ", este é você. Em um " + world + " você desperta." }],
    }
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

startButton.addEventListener('click', () => {
    run('Olho em volta');
});