/* ============================================================
   SISTEMA TSJ — ESTUDO INTEGRADO
   Funções: Flashcards, Simulado (ME), Verdadeiro/Falso, Flash Write
   Autor: (você)
   Versão entregue: Corrigida + Comentada
=============================================================== */

/* ============================================================
   BASE DE DADOS LOCAL (LocalStorage)
=============================================================== */

// Nome da chave no localStorage
const STORAGE_KEY = "tsj_study_data";

// Carregar dados da base local
let studyData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Normalização — corrige problema antigo de dados aninhados
if (Array.isArray(studyData[0])) {
    studyData = studyData[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyData));
}


/* ============================================================
   FUNÇÕES UTILITÁRIAS
=============================================================== */

// Evita inserção de HTML malicioso
function escapeHTML(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

// Salvar no localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyData));
}


/* ============================================================
   MANIPULAÇÃO DE ABAS
=============================================================== */

function showTab(tabId) {
    document.querySelectorAll(".tab-button").forEach(btn =>
        btn.classList.remove("active")
    );

    document.querySelectorAll(".tab-content").forEach(tab =>
        tab.classList.remove("active")
    );

    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");

    // Evita bug de simulado recriando questões automaticamente
    if (tabId === "simulado") renderSimulado();
    if (tabId === "verdadeiro-falso") renderVF();
    if (tabId === "flashcards") renderFlashcards();
    if (tabId === "flash-write") stopFlashWrite(); // evita tempo continuar rodando
}


/* ============================================================
   FORMULÁRIO — ADICIONAR NOVO ITEM
=============================================================== */

document.getElementById("study-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const pergunta = escapeHTML(document.getElementById("pergunta").value.trim());
    const resposta = escapeHTML(document.getElementById("resposta").value.trim());

    if (!pergunta || !resposta) return;

    studyData.push({ pergunta, resposta });
    saveData();

    this.reset();
    renderFlashcards();
});


/* ============================================================
   FLASHCARDS — LISTA E EFEITO FLIP
=============================================================== */

function renderFlashcards() {
    const container = document.getElementById("flashcard-container");
    container.innerHTML = "";

    studyData.forEach((item, index) => {
        const wrap = document.createElement("div");
        wrap.className = "flashcard-wrapper";

        const card = document.createElement("div");
        card.className = "flashcard";
        card.onclick = () => card.classList.toggle("flipped");

        const front = document.createElement("div");
        front.className = "front";
        front.innerHTML = item.pergunta;

        const back = document.createElement("div");
        back.className = "back";
        back.innerHTML = item.resposta;

        card.appendChild(front);
        card.appendChild(back);
        wrap.appendChild(card);

        // CRUD
        const crud = document.createElement("div");
        crud.className = "crud-actions";

        const btnEdit = document.createElement("button");
        btnEdit.className = "edit-button";
        btnEdit.textContent = "Editar";
        btnEdit.onclick = () => editFlashcard(index);

        const btnDelete = document.createElement("button");
        btnDelete.className = "delete-button";
        btnDelete.textContent = "Excluir";
        btnDelete.onclick = () => deleteFlashcard(index);

        crud.appendChild(btnEdit);
        crud.appendChild(btnDelete);
        wrap.appendChild(crud);

        container.appendChild(wrap);
    });
}


// Editar card
function editFlashcard(i) {
    const item = studyData[i];

    const pergunta = prompt("Edite a pergunta:", item.pergunta);
    if (pergunta === null) return;

    const resposta = prompt("Edite a resposta:", item.resposta);
    if (resposta === null) return;

    studyData[i] = {
        pergunta: escapeHTML(pergunta.trim()),
        resposta: escapeHTML(resposta.trim())
    };

    saveData();
    renderFlashcards();
}


// Excluir card
function deleteFlashcard(i) {
    if (confirm("Deseja excluir este item?")) {
        studyData.splice(i, 1);
        saveData();
        renderFlashcards();
    }
}


/* ============================================================
   SIMULADO — Múltipla Escolha
=============================================================== */

let simuladoQuestions = [];

function generateSimuladoQuestions() {
    simuladoQuestions = studyData.map(item => ({
        pergunta: item.pergunta,
        correta: item.resposta,
        opcoes: shuffle([
            item.resposta,
            ...generateWrongAnswers(item.resposta)
        ])
    }));
}

// Gera respostas erradas aleatórias
function generateWrongAnswers(correct) {
    const candidates = studyData
        .map(x => x.resposta)
        .filter(x => x !== correct);

    shuffle(candidates);

    return candidates.slice(0, 3); // 3 alternativas
}

// Função de embaralhar
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function renderSimulado() {
    if (studyData.length === 0) {
        document.getElementById("simulado-container").innerHTML =
            "<p>Nenhum item cadastrado.</p>";
        return;
    }

    // Garante MESMO conjunto até apertar "Refazer"
    if (simuladoQuestions.length === 0) generateSimuladoQuestions();

    const container = document.getElementById("simulado-container");
    container.innerHTML = "<h3>Simulado de Múltipla Escolha</h3>";

    simuladoQuestions.forEach((q, i) => {
        const block = document.createElement("div");
        block.className = "question-block";

        block.innerHTML += `<strong>${q.pergunta}</strong>`;

        const opts = document.createElement("div");
        opts.className = "options-container";

        q.opcoes.forEach(op => {
            const id = `q${i}_${op}`;

            const label = document.createElement("label");
            label.className = "option-label";
            label.setAttribute("for", id);
            label.textContent = op;

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${i}`;
            input.value = op;
            input.id = id;

            label.prepend(input);
            opts.appendChild(label);
        });

        block.appendChild(opts);
        container.appendChild(block);
    });

    const btn = document.createElement("button");
    btn.className = "check-button";
    btn.textContent = "Verificar Respostas";
    btn.onclick = checkSimulado;

    container.appendChild(btn);
}

// Correção
function checkSimulado() {
    let score = 0;

    simuladoQuestions.forEach((q, i) => {
        const marked = document.querySelector(`input[name="q${i}"]:checked`);
        if (marked && marked.value === q.correta) score++;
    });

    const container = document.getElementById("simulado-container");

    const result = document.createElement("div");
    result.className = "simulado-score";
    result.textContent = `Você acertou ${score} de ${simuladoQuestions.length}`;
    container.appendChild(result);

    // botão refazer
    const btn = document.createElement("button");
    btn.className = "start-button";
    btn.textContent = "Refazer Simulado";
    btn.onclick = () => {
        simuladoQuestions = [];
        renderSimulado();
    };
    container.appendChild(btn);
}


/* ============================================================
   VERDADEIRO / FALSO
=============================================================== */

let vfQuestions = [];

function generateVFQuestions() {
    vfQuestions = studyData.map(item => {
        const fake = generateWrongAnswers(item.resposta)[0] || item.resposta;
        const isTrue = Math.random() > 0.5;

        return {
            pergunta: item.pergunta,
            resposta: isTrue ? item.resposta : fake,
            correta: isTrue
        };
    });
}

function renderVF() {
    if (studyData.length === 0) {
        document.getElementById("verdadeiro-falso-container").innerHTML =
            "<p>Nenhum item cadastrado.</p>";
        return;
    }

    if (vfQuestions.length === 0) generateVFQuestions();

    const container = document.getElementById("verdadeiro-falso-container");
    container.innerHTML = "<h3>Simulado de Verdadeiro ou Falso</h3>";

    vfQuestions.forEach((q, i) => {
        const block = document.createElement("div");
        block.className = "question-block";

        block.innerHTML =
            `<strong>${q.pergunta}</strong><br><em>${q.resposta}</em>`;

        block.innerHTML += `
            <div class="options-container">
                <label class="option-label">
                    <input type="radio" name="vf${i}" value="true">
                    Verdadeiro
                </label>
                <label class="option-label">
                    <input type="radio" name="vf${i}" value="false">
                    Falso
                </label>
            </div>
        `;

        container.appendChild(block);
    });

    const btn = document.createElement("button");
    btn.className = "check-button";
    btn.textContent = "Verificar";
    btn.onclick = checkVF;

    container.appendChild(btn);
}

function checkVF() {
    let score = 0;

    vfQuestions.forEach((q, i) => {
        const marked = document.querySelector(`input[name="vf${i}"]:checked`);
        if (marked && String(q.correta) === marked.value) score++;
    });

    const container = document.getElementById("verdadeiro-falso-container");

    const res = document.createElement("div");
    res.className = "simulado-score";
    res.textContent = `Acertos: ${score} de ${vfQuestions.length}`;
    container.appendChild(res);

    const btn = document.createElement("button");
    btn.className = "start-button";
    btn.textContent = "Refazer";
    btn.onclick = () => {
        vfQuestions = [];
        renderVF();
    };
    container.appendChild(btn);
}


/* ============================================================
   FLASH WRITE — DESAFIO DE ESCRITA
=============================================================== */

let writeTimer = null;
let writeSeconds = 20;
let currentWrite = null;

function startFlashWrite() {
    if (studyData.length === 0) {
        alert("Nenhum item cadastrado.");
        return;
    }

    const item = studyData[Math.floor(Math.random() * studyData.length)];
    currentWrite = item;

    document.getElementById("flash-write-container").innerHTML = `
        <h3>Desafio de Escrita Rápida (20s)</h3>
        <strong>Pergunta:</strong> ${item.pergunta}
        <textarea id="flash-write-input"></textarea>
        <button class="start-button" onclick="stopFlashWrite()">Finalizar</button>
        <p id="write-timer">Tempo: 20s</p>
    `;

    writeSeconds = 20;
    writeTimer = setInterval(() => {
        writeSeconds--;
        document.getElementById("write-timer").textContent = `Tempo: ${writeSeconds}s`;

        if (writeSeconds <= 0) stopFlashWrite();
    }, 1000);
}

function stopFlashWrite() {
    if (writeTimer) clearInterval(writeTimer);
    writeTimer = null;

    if (!currentWrite) return;

    const text = document.getElementById("flash-write-input")?.value || "";

    document.getElementById("flash-write-container").innerHTML = `
        <h3>Resultado</h3>
        <div class="write-result-block">
            <p><strong>Sua resposta:</strong><br>${escapeHTML(text)}</p>
            <p class="correct-answer"><strong>Resposta correta:</strong><br>${currentWrite.resposta}</p>
        </div>
        <button class="start-button" onclick="startFlashWrite()">Tentar novamente</button>
    `;

    currentWrite = null;
}


/* ============================================================
   INICIALIZAÇÃO
=============================================================== */

renderFlashcards();
