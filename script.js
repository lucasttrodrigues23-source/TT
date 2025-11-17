const STORAGE_KEY = 'studyApp_data';
const MAX_ITENS = 25; // Limite de itens a serem exibidos por sessão
let editingIndex = -1; // Rastreia o índice do item em edição

// --- NOVAS VARIÁVEIS DE CONTROLE PARA O FLASH WRITE ---
const FLASH_WRITE_TIME_SECONDS = 20;
let flashWriteTimer;
let currentFlashWriteQuestionIndex = 0;
let currentFlashWriteData = []; // Armazena os 25 itens da sessão atual
// ---------------------------------------------------


// --- DADOS INICIAIS (BASE DE DADOS JURÍDICA) ---
const INITIAL_JURIDICAL_DATA = [
    { pergunta: "O que é o Ordenamento Jurídico?", resposta: "O conjunto de todas as leis e normas que existem em um país e que organizam a vida em sociedade." },
    { pergunta: "O que é o Império Vontade?", resposta: "Vale a vontade das pessoas, desde que não contrarie a lei." },
    { pergunta: "O que é o Império da Lei?", resposta: "Vale o que a lei determina, e todos devem obedecer." },
    { pergunta: "O que são Sujeitos do Direito?", resposta: "São quem tem direitos e deveres perante a lei." },
    { pergunta: "Moral?", resposta: "São regras de conduta criadas pela sociedade (não pelo Estado)." },
    { pergunta: "O que é Fontes do Direito?", resposta: "São as origens de onde nascem as regras jurídicas, ou seja, de onde vem o Direito." },
    { pergunta: "Doutrina?", resposta: "São os estudos e opiniões dos juristas (professores, juízes, advogados)." },
    { pergunta: "Costumes?", resposta: "São práticas repetidas pela sociedade, aceitas como obrigatórias." },
    { pergunta: "O que é Formas de Integração do Direito?", resposta: "São maneiras de resolver casos quando a lei não tem resposta direta (ou seja, há uma 'lacuna' na lei)." },
    { pergunta: "Analogia?", resposta: "Usa casos parecidos para resolver o caso sem lei específica." },
    { pergunta: "Princípios Gerais do Direito?", resposta: "Usa valores e ideias básicas de justiça. Exemplo: boa-fé, igualdade, honestidade." },
    { pergunta: "O que é Lei?", resposta: "Regra escrita criada pelo Estado para organizar a sociedade." },
    { pergunta: "Formação da lei?", resposta: "Proposta → votação → sanção → publicação → vigência." },
    { pergunta: "Ato Comissivo?", resposta: "Quando alguém faz algo proibido pela lei." },
    { pergunta: "Ato Omissivo?", resposta: "Quando alguém deixa de fazer algo obrigatório pela lei." },
    { pergunta: "O que é Domicílio?", resposta: "O local onde uma pessoa estabelece a sua residência com ânimo definitivo." },
    { pergunta: "Domicílio da Pessoa Natural?", resposta: "É o lugar onde a pessoa mora com intenção de ficar." },
    { pergunta: "Domicílio da Pessoa Jurídica de Direito Privado?", resposta: "É o lugar onde funciona sua sede, diretoria ou administração, ou o endereço indicado no contrato social." },
    { pergunta: "Pessoa Jurídica com sede no Exterior?", resposta: "O local da filial ou agência que realizou o ato ou contrato no Brasil." },
    { pergunta: "Bens Imóveis?", resposta: "São os bens que não podem ser movidos sem que se altere ou destrua sua estrutura." },
    { pergunta: "Bens Móveis?", resposta: "São os bens que podem ser transportados de um lugar para outro sem se danificarem." },
    { pergunta: "Bens Fungíveis?", resposta: "São os bens que podem ser trocados por outros iguais, da mesma espécie, qualidade e quantidade (art. 85 do Código Civil)." },
    { pergunta: "Bens Consumíveis?", resposta: "São os bens que se acabam com o uso — ou seja, só podem ser usados uma vez (art. 86 do Código Civil)." },
    { pergunta: "Bens Divisíveis?", resposta: "São os bens que podem ser divididos em partes sem perder o valor ou a função." },
    { pergunta: "Bens Indivisíveis?", resposta: "São os bens que não podem ser divididos sem perder a utilidade ou o valor." },
    { pergunta: "Bens Singulares?", resposta: "São os bens considerados isoladamente, com existência própria, mesmo que façam parte de um conjunto." },
    { pergunta: "Bens Coletivos?", resposta: "São os bens que pertencem a todos, de uso comum ou interesse geral da sociedade." },
    { pergunta: "Bens de uso especial?", resposta: "São os bens usados pelo governo para prestar serviços públicos." },
    { pergunta: "Bens dominicais?", resposta: "São os bens públicos que não estão sendo usados nem pelo povo nem pela administração." },
    { pergunta: "Bens Públicos?", resposta: "São bens que pertencem à União, aos Estados, ao Distrito Federal ou aos Municípios, usados em benefício da coletividade." },
    { pergunta: "Capacidade da Pessoa 0 a 16 anos?", resposta: "Incapaz, precisa de responsável." },
    { pergunta: "Capacidade da Pessoa 16 a 18 anos?", resposta: "Capacidade relativa, precisa de ajuda em alguns atos." },
    { pergunta: "Capacidade da Pessoa +18 anos?", resposta: "Total capacidade." },
    { pergunta: "Capacidade Especiais (alcoólatras, etc)?", resposta: "Alguns casos especiais podem limitar a capacidade, como uso habitual de drogas, problemas mentais ou gastos irresponsáveis." },
    { pergunta: "Fato (não jurídico)?", resposta: "Acontecimento sem relevância jurídica, não produz efeitos legais." },
    { pergunta: "Fato jurídico (em sentido amplo)?", resposta: "Acontecimento que produz efeitos jurídicos, independentemente da vontade. Exemplos: morte, nascimento, desastre natural." },
    { pergunta: "Ato jurídico (em sentido estrito)?", resposta: "Ato praticado com vontade humana, lícito, e que gera efeitos legais. Exemplos: casamento, pagamento de dívida." },
    { pergunta: "Defeitos do Negócio Jurídico?", resposta: "São vícios ou irregularidades que afetam a validade do negócio jurídico." },
    { pergunta: "Nulidade?", resposta: "Negócio inválido desde o início, ofende a lei gravemente. Efeito: nunca produz efeitos, não pode ser corrigido (art. 166 CC)." },
    { pergunta: "Anulabilidade?", resposta: "Negócio com vício menos grave, geralmente ligado à vontade ou capacidade. Efeito: produz efeitos até ser anulado, pode ser corrigido (art. 171 CC)." },
    { pergunta: "Erro/ignorância?", resposta: "Falsa percepção da realidade que afeta a vontade. Efeito: anulável." },
    { pergunta: "Dolo?", resposta: "Engano intencional para induzir outro a manifestar vontade viciada. Efeito: anulável, pode gerar indenização (art. 145 CC)." },
    { pergunta: "Coação?", resposta: "Vontade dominada por ameaça grave e injusta. Efeito: anulável (art. 151 CC)." },
    { pergunta: "Estado de perigo?", resposta: "Vontade viciada por desespero diante de risco grave, aproveitado por outra parte. Efeito: anulável (art. 156 CC)." },
    { pergunta: "Lesão?", resposta: "Aproveitamento da necessidade urgente ou inexperiência, aceitando obrigação desproporcional. Efeito: anulável ou revisão do contrato (art. 157 CC)." },
    { pergunta: "Fraude contra credores?", resposta: "Devedor pratica ato para prejudicar credores, ocultando ou transferindo bens. Efeito: anulável via ação Pauliana (arts. 158-165 CC)." },
    { pergunta: "Invalidação do negócio jurídico?", resposta: "Ocorre quando o negócio não atende aos requisitos de validade: agente capaz, objeto lícito, forma legal, vontade livre." }
];
// --------------------------------------------------


// --- PERSISTÊNCIA E INICIALIZAÇÃO ---

function loadStudyData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

function saveStudyData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyData));
}

function loadInitialData() {
    if (studyData.length === 0) {
        studyData = INITIAL_JURIDICAL_DATA;
        saveStudyData(); 
    }
}

let studyData = loadStudyData();
loadInitialData(); 


// --- FUNÇÕES DE CONTROLE DE EXIBIÇÃO ---

/**
 * Seleciona e embaralha os dados, limitando ao número máximo (MAX_ITENS).
 * Garante que a seleção é diferente a cada chamada (a cada recarga/alternância de aba).
 * @returns {Array} Array de dados limitado e aleatório.
 */
function getShuffledAndLimitedData() {
    const dataCopy = [...studyData];
    // Embaralha
    const shuffled = dataCopy.sort(() => 0.5 - Math.random());
    // Limita
    return shuffled.slice(0, MAX_ITENS);
}


function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
    
    // Força a renderização aleatória e limitada ao trocar de aba
    if (tabId === 'flashcards') renderFlashCards();
    if (tabId === 'simulado') renderSimulado();
    if (tabId === 'verdadeiro-falso') renderVfSimulado();
    if (tabId === 'flash-write') renderFlashWrite(); // ATUALIZADO
}

document.addEventListener('DOMContentLoaded', () => {
    showTab('flashcards');
    // Renderiza todas na inicialização, mas apenas a 'flashcards' estará visível
    renderFlashCards();
    renderSimulado();
    renderVfSimulado();
    renderFlashWrite(); // ATUALIZADO
});


// 1. Adicionar Dados e Atualizar Views
document.getElementById('study-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const pergunta = document.getElementById('pergunta').value.trim();
    const resposta = document.getElementById('resposta').value.trim();

    if (pergunta && resposta) {
        studyData.push({ pergunta, resposta });

        saveStudyData(); 

        this.reset();
        alert('Item adicionado com sucesso!');
        
        // Renderiza apenas os cards da aba ativa, chamando showTab
        const activeTab = document.querySelector('.tab-content.active').id;
        showTab(activeTab); 
    } else {
        alert('Por favor, preencha a pergunta e a resposta.');
    }
});


// --- FUNÇÕES DE EDIÇÃO E EXCLUSÃO (Operam no array original) ---

function deleteFlashCard(originalIndex) {
    if (confirm(`Tem certeza que deseja excluir o item "${studyData[originalIndex].pergunta}"?`)) {
        studyData.splice(originalIndex, 1);
        saveStudyData();
        // Renderiza todas as abas, pois o conjunto de dados mudou
        renderFlashCards();
        renderSimulado();
        renderVfSimulado(); 
        renderFlashWrite();
    }
}

function startEdit(originalIndex) {
    if (editingIndex !== -1 && editingIndex !== originalIndex) {
        renderFlashCards();
    }
    editingIndex = originalIndex;
    renderFlashCards(); 
}

function saveEdit(originalIndex) {
    const newPergunta = document.getElementById(`edit-pergunta-${originalIndex}`).value.trim();
    const newResposta = document.getElementById(`edit-resposta-${originalIndex}`).value.trim();

    if (newPergunta && newResposta) {
        studyData[originalIndex].pergunta = newPergunta;
        studyData[originalIndex].resposta = newResposta;
        
        editingIndex = -1;
        saveStudyData();
        // Renderiza todas as abas, pois o conteúdo dos dados mudou
        renderFlashCards();
        renderSimulado();
        renderVfSimulado();
        renderFlashWrite();
        alert('Item atualizado com sucesso!');
    } else {
        alert('Pergunta e Resposta não podem estar vazias.');
    }
}

function cancelEdit() {
    editingIndex = -1;
    renderFlashCards();
}

// 2. Renderizar Flash Cards (Usa dados limitados e aleatórios)
function renderFlashCards() {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = ''; 

    const limitedData = getShuffledAndLimitedData(); 

    limitedData.forEach((item) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flashcard-wrapper';
        
        // Mapeia o item aleatório de volta para o índice original para ações de CRUD
        const originalIndex = studyData.findIndex(d => d.pergunta === item.pergunta && d.resposta === item.resposta);


        if (originalIndex === editingIndex) {
            // Renderiza o formulário de edição
            wrapper.innerHTML = `
                <div class="edit-form">
                    <h4>Editando Item ${originalIndex + 1}</h4>
                    <label>Frente:</label>
                    <textarea id="edit-pergunta-${originalIndex}">${item.pergunta}</textarea>
                    
                    <label>Verso:</label>
                    <textarea id="edit-resposta-${originalIndex}">${item.resposta}</textarea>
                    
                    <div class="card-controls">
                        <button type="button" class="control-btn save" onclick="saveEdit(${originalIndex})">Salvar</button>
                        <button type="button" class="control-btn cancel" onclick="cancelEdit()">Cancelar</button>
                    </div>
                </div>
            `;
        } else {
            // Renderiza o Flash Card normal
            wrapper.innerHTML = `
                <div class="flashcard" onclick="this.classList.toggle('flipped')">
                    <div class="card-inner">
                        <div class="card-front">
                            <p><strong>${item.pergunta}</strong></p>
                        </div>
                        <div class="card-back">
                            <p>${item.resposta}</p>
                        </div>
                    </div>
                </div>
                <div class="card-controls">
                    <button type="button" class="control-btn edit" onclick="startEdit(${originalIndex})">Editar</button>
                    <button type="button" class="control-btn delete" onclick="deleteFlashCard(${originalIndex})">Excluir</button>
                </div>
            `;
        }
        
        container.appendChild(wrapper);
    });
}


// 3. Renderizar Simulado (Múltipla Escolha)
function renderSimulado() {
    const form = document.getElementById('simulado-form');
    const resultParagraph = document.getElementById('simulado-result');
    
    let checkButton = form.querySelector('button[onclick="checkSimulado()"]');
    form.innerHTML = ''; 
    form.appendChild(resultParagraph); 

    if (studyData.length === 0) {
        form.innerHTML = '<p>Adicione itens para gerar o simulado.</p>';
        return;
    }
    
    const limitedData = getShuffledAndLimitedData(); 
    const distractorData = [...limitedData].sort(() => 0.5 - Math.random());

    limitedData.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<h4>${index + 1}. ${item.pergunta}</h4>`;

        const correctAnswer = item.resposta;
        const options = new Set([correctAnswer]); 
        
        for (const distractorItem of distractorData) {
            if (options.size === 4) break; 
            if (distractorItem.resposta !== correctAnswer) {
                options.add(distractorItem.resposta);
            }
        }
        
        const optionArray = Array.from(options).sort(() => 0.5 - Math.random());

        optionArray.forEach((option, optIndex) => {
            const radioId = `q${index}-opt${optIndex}`;
            questionDiv.innerHTML += `
                <input type="radio" id="${radioId}" name="question-${index}" value="${option}" required>
                <label for="${radioId}">${option}</label><br>
            `;
        });
        
        form.appendChild(questionDiv);
    });
    
    if (!checkButton) {
        checkButton = document.createElement('button');
        checkButton.type = 'button';
        checkButton.onclick = checkSimulado;
        checkButton.textContent = 'Verificar Respostas';
    }
    form.appendChild(checkButton);
}

// 4. Lógica de Verificação do Simulado (Múltipla Escolha)
function checkSimulado() {
    let correctCount = 0;
    const form = document.getElementById('simulado-form');
    const resultParagraph = document.getElementById('simulado-result');

    const questionDivs = Array.from(form.children).filter(el => el.tagName === 'DIV');
    const totalQuestions = questionDivs.length;

    if (totalQuestions === 0) return;

    // Recria o array de dados limitados *usados atualmente* (que estão no DOM) para verificação
    const currentQuestions = [];
    questionDivs.forEach(div => {
        const questionText = div.querySelector('h4').textContent.split('. ')[1];
        const originalItem = studyData.find(d => questionText.includes(d.pergunta));
        if (originalItem) {
            currentQuestions.push(originalItem);
        }
    });

    questionDivs.forEach((questionDiv, index) => {
        const selectedRadio = form.querySelector(`input[name="question-${index}"]:checked`);
        questionDiv.style.backgroundColor = 'transparent';
        
        if (selectedRadio) {
            const userAnswer = selectedRadio.value;
            const correctAnswer = currentQuestions[index] ? currentQuestions[index].resposta : null;
            
            if (userAnswer === correctAnswer) {
                correctCount++;
                questionDiv.style.backgroundColor = '#DFF2BF';
            } else {
                questionDiv.style.backgroundColor = '#FFCCCC';
            }
        } else {
            questionDiv.style.backgroundColor = '#FFFACD'; 
        }
    });

    const percentage = ((correctCount / totalQuestions) * 100).toFixed(2);
    resultParagraph.innerHTML = `✅ **Resultado (Múltipla Escolha):** Você acertou **${correctCount}** de **${totalQuestions}** questões (${percentage}%).`;
    resultParagraph.style.marginTop = '20px';
}


// 5. Renderizar Simulado (Verdadeiro ou Falso)
function renderVfSimulado() {
    const form = document.getElementById('vf-simulado-form');
    const resultParagraph = document.getElementById('vf-simulado-result');
    
    let checkButton = form.querySelector('button[onclick="checkVfSimulado()"]');
    form.innerHTML = ''; 
    form.appendChild(resultParagraph); 

    if (studyData.length === 0) {
        form.innerHTML = '<p>Adicione itens para gerar o simulado de Verdadeiro ou Falso.</p>';
        return;
    }
    
    const limitedData = getShuffledAndLimitedData();

    limitedData.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        
        const isTrueStatement = Math.random() < 0.5;
        let statement = "";
        let expectedAnswer = "";
        
        if (isTrueStatement) {
            statement = `${item.pergunta} é **${item.resposta}**`;
            expectedAnswer = "Verdadeiro";
        } else {
            let wrongAnswer = item.resposta;
            const wrongItems = limitedData.filter(d => d.resposta !== item.resposta);
            
            if (wrongItems.length > 0) {
                wrongAnswer = wrongItems[Math.floor(Math.random() * wrongItems.length)].resposta;
            }
            
            statement = `${item.pergunta} é **${wrongAnswer}**`;
            expectedAnswer = "Falso";
        }
        
        questionDiv.innerHTML = `<h4>${index + 1}. A afirmação é: "${statement}"</h4>`;
        
        questionDiv.dataset.correctAnswer = expectedAnswer; 

        questionDiv.innerHTML += `
            <input type="radio" id="vf-q${index}-v" name="vf-question-${index}" value="Verdadeiro" required>
            <label for="vf-q${index}-v">Verdadeiro</label><br>
            <input type="radio" id="vf-q${index}-f" name="vf-question-${index}" value="Falso">
            <label for="vf-q${index}-f">Falso</label><br>
        `;
        
        form.appendChild(questionDiv);
    });
    
    if (!checkButton) {
        checkButton = document.createElement('button');
        checkButton.type = 'button';
        checkButton.onclick = checkVfSimulado;
        checkButton.textContent = 'Verificar Respostas';
    }
    form.appendChild(checkButton);
}

// 6. Lógica de Verificação do Simulado (Verdadeiro ou Falso)
function checkVfSimulado() {
    let correctCount = 0;
    const form = document.getElementById('vf-simulado-form');
    const resultParagraph = document.getElementById('vf-simulado-result');
    
    const questionDivs = Array.from(form.children).filter(el => el.tagName === 'DIV');
    const totalQuestions = questionDivs.length;

    if (totalQuestions === 0) return;

    questionDivs.forEach((questionDiv, index) => {
        const selectedRadio = form.querySelector(`input[name="vf-question-${index}"]:checked`);
        const expectedAnswer = questionDiv.dataset.correctAnswer;
        
        questionDiv.style.backgroundColor = 'transparent';
        
        if (selectedRadio) {
            const userAnswer = selectedRadio.value;
            if (userAnswer === expectedAnswer) {
                correctCount++;
                questionDiv.style.backgroundColor = '#DFF2BF';
            } else {
                questionDiv.style.backgroundColor = '#FFCCCC';
            }
        } else {
            questionDiv.style.backgroundColor = '#FFFACD'; 
        }
    });

    const percentage = ((correctCount / totalQuestions) * 100).toFixed(2);
    resultParagraph.innerHTML = `✅ **Resultado (V/F):** Você acertou **${correctCount}** de **${totalQuestions}** afirmações (${percentage}%).`;
    resultParagraph.style.marginTop = '20px';
}


// --- 7 & 8: FUNÇÕES DO DESAFIO DE ESCRITA RÁPIDA (FLASH WRITE) ---

// 7. Renderizar Desafio de Escrita Rápida (Flash Write)
function renderFlashWrite() {
    const form = document.getElementById('flash-write-form');
    const resultParagraph = document.getElementById('flash-write-result');
    const timerDisplay = document.getElementById('timer-display');
    
    // Limpa o formulário, mas mantém os elementos de controle
    let checkButton = form.querySelector('button[onclick="checkFlashWrite()"]');
    form.innerHTML = ''; 
    form.appendChild(timerDisplay); 
    form.appendChild(resultParagraph); 

    if (studyData.length === 0) {
        form.innerHTML = '<p>Adicione itens para iniciar o Desafio de Escrita Rápida.</p>';
        return;
    }
    
    // Zera o índice e pega os 25 itens da sessão
    currentFlashWriteQuestionIndex = 0;
    currentFlashWriteData = getShuffledAndLimitedData();
    
    if (currentFlashWriteData.length > 0) {
        displayFlashWriteQuestion(form, checkButton);
    } else {
        form.innerHTML = '<p>Não há itens suficientes para o desafio.</p>';
    }
}

// Função para exibir a pergunta atual do Flash Write
function displayFlashWriteQuestion(form, checkButton) {
    clearTimeout(flashWriteTimer);
    const resultParagraph = document.getElementById('flash-write-result');
    resultParagraph.innerHTML = ''; // Limpa resultados anteriores

    if (currentFlashWriteQuestionIndex >= currentFlashWriteData.length) {
        form.innerHTML = '<p style="font-size: 1.2em; color: #4169E1;">Fim do Desafio! Recarregue a página ou troque de aba para um novo conjunto.</p>';
        return;
    }

    const item = currentFlashWriteData[currentFlashWriteQuestionIndex];

    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `<h4>${currentFlashWriteQuestionIndex + 1}. ${item.pergunta}</h4>`;
    questionDiv.className = 'flash-write-question';
    
    questionDiv.innerHTML += `
        <textarea id="flash-write-input" name="flash-write-response" placeholder="Sua resposta rápida aqui..."></textarea>
        <div id="flash-write-answer" style="margin-top: 15px; padding: 10px; border: 1px dashed #B0E0E6; background: #fffaf0; display: none;">
            <p style="font-weight: bold; color: #4682B4;">Resposta Correta:</p>
            <p>${item.resposta}</p>
        </div>
    `;
    
    // Remove as perguntas anteriores antes de adicionar a nova
    form.querySelectorAll('.flash-write-question').forEach(q => q.remove());
    form.insertBefore(questionDiv, document.getElementById('timer-display').nextSibling);


    // Re-adiciona ou cria o botão de verificar
    if (!checkButton) {
        checkButton = document.createElement('button');
        checkButton.type = 'button';
        checkButton.onclick = checkFlashWrite;
        checkButton.textContent = 'Comparar e Avaliar';
    }
    form.appendChild(checkButton);
    
    startFlashWriteTimer();
}

// Função de Controle do Cronômetro
function startFlashWriteTimer() {
    let timeLeft = FLASH_WRITE_TIME_SECONDS;
    const timerDisplay = document.getElementById('timer-display');
    const inputField = document.getElementById('flash-write-input');
    const checkButton = document.querySelector('#flash-write-form button[onclick="checkFlashWrite()"]');

    if (inputField) inputField.disabled = false;
    if (checkButton) checkButton.disabled = false;
    
    timerDisplay.textContent = `Tempo restante: ${timeLeft} segundos`;

    flashWriteTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tempo restante: ${timeLeft} segundos`;

        if (timeLeft <= 0) {
            clearInterval(flashWriteTimer);
            timerDisplay.textContent = '⏰ Tempo Esgotado! Avalie sua resposta.';
            if (inputField) inputField.disabled = true;
            // Força a exibição da resposta
            document.getElementById('flash-write-answer').style.display = 'block'; 
        }
    }, 1000);
}

// 8. Lógica de Verificação do Flash Write (Autoavaliação)
function checkFlashWrite() {
    clearTimeout(flashWriteTimer);
    const inputField = document.getElementById('flash-write-input');
    const answerDiv = document.getElementById('flash-write-answer');
    const resultParagraph = document.getElementById('flash-write-result');
    const checkButton = document.querySelector('#flash-write-form button[onclick="checkFlashWrite()"]');

    if (inputField) inputField.disabled = true;
    if (checkButton) checkButton.disabled = true;
    
    // 1. Revela a Resposta Correta
    answerDiv.style.display = 'block';

    // 2. Apresenta a Autoavaliação
    resultParagraph.innerHTML = `
        <div style="margin-top: 20px; padding: 15px; border: 2px solid #5F9EA0; border-radius: 8px; background: #E0FFFF;">
            <p style="font-weight: bold; color: #4682B4;">Como você avalia sua resposta?</p>
            <button class="control-btn save" style="margin-right: 10px;" onclick="nextFlashWriteQuestion('Fácil')">Fácil (Acertei)</button>
            <button class="control-btn edit" style="margin-right: 10px; background: #FFD700;" onclick="nextFlashWriteQuestion('Médio')">Médio (Houve Hesitação)</button>
            <button class="control-btn delete" onclick="nextFlashWriteQuestion('Difícil')">Difícil (Errei)</button>
        </div>
    `;
}

// 9. Avançar para a próxima pergunta
function nextFlashWriteQuestion(rating) {
    // Nesta função, a lógica futura de Repetição Espaçada seria acionada.
    console.log(`Questão ${currentFlashWriteQuestionIndex + 1} avaliada como: ${rating}`);
    
    currentFlashWriteQuestionIndex++;
    
    const form = document.getElementById('flash-write-form');
    const checkButton = document.querySelector('#flash-write-form button[onclick="checkFlashWrite()"]');
    
    displayFlashWriteQuestion(form, checkButton);
}