const STORAGE_KEY = 'studyApp_data';
const MAX_ITENS = 55; // Limite de itens a serem exibidos por sessão
let editingIndex = -1; // Rastreia o índice do item em edição

// --- NOVAS VARIÁVEIS DE CONTROLE PARA O FLASH WRITE ---
const FLASH_WRITE_TIME_SECONDS = 20;
let flashWriteTimer;
let currentFlashWriteQuestionIndex = 0;
let currentFlashWriteData = []; // Armazena os 5 itens da sessão atual
let flashWriteRunning = false;
// ---------------------------------------------------


// --- DADOS INICIAIS (BASE DE DADOS JURÍDICA) ---
// MANTIDO COMO ARRAY DE ARRAY PARA ORGANIZAÇÃO, MAS SERÁ "ACHATADO" NO CARREGAMENTO
const INITIAL_JURIDICAL_DATA = [
    [
        {
          pergunta: "O que é Direito?",
          resposta: "Conjunto de normas e princípios que regulam a vida em sociedade e visam à realização da justiça."
        },
        {
          pergunta: "O que é a Norma Jurídica?",
          resposta: "Regra de conduta social imposta e garantida pelo Estado."
        },
        {
          pergunta: "O que é o Ordenamento Jurídico?",
          resposta: "O conjunto de todas as leis e normas que existem em um país e que organizam a vida em sociedade."
        },
        {
          pergunta: "Defina **Direito Objetivo**.",
          resposta: "O Direito como norma, regra (ex: A lei proíbe matar)."
        },
        {
          pergunta: "Defina **Direito Subjetivo**.",
          resposta: "O Direito como faculdade ou poder de exigir algo (ex: o direito de propriedade)."
        },
        {
          pergunta: "O que é **Direito Positivo**?",
          resposta: "Conjunto de normas jurídicas **em vigor** em um determinado local e tempo (Ex: o Código Civil brasileiro)."
        },
        {
          pergunta: "O que é **Direito Natural**?",
          resposta: "Conjunto de princípios universais, imutáveis e inerentes à natureza humana (ex: direito à vida)."
        },
        {
          pergunta: "O que é **Direito Público**?",
          resposta: "Ramo que rege as relações em que o Estado atua com **soberania** (ex: Direito Constitucional, Administrativo)."
        },
        {
          pergunta: "O que é **Direito Privado**?",
          resposta: "Ramo que rege as relações entre particulares em condição de **igualdade** (ex: Direito Civil, Empresarial)."
        },
        {
          pergunta: "Moral?",
          resposta: "São regras de conduta criadas pela sociedade (não pelo Estado)."
        },
        {
          pergunta: "O que é Fontes do Direito?",
          resposta: "São as origens de onde nascem as regras jurídicas, ou seja, de onde vem o Direito."
        },
        {
          pergunta: "Quais são as fontes formais primárias do Direito no Brasil?",
          resposta: "Lei (principal), costumes, jurisprudência e doutrina."
        },
        {
          pergunta: "O que é Lei?",
          resposta: "Regra escrita criada pelo Estado para organizar a sociedade."
        },
        {
          pergunta: "Formação da lei?",
          resposta: "Proposta → votação → sanção → publicação → vigência."
        },
        {
          pergunta: "O que significa **Vacatio Legis**?",
          resposta: "Período entre a publicação de uma lei e sua entrada em vigor, para que as pessoas a conheçam."
        },
        {
          pergunta: "Costumes?",
          resposta: "São práticas repetidas pela sociedade, aceitas como obrigatórias."
        },
        {
          pergunta: "O que é Jurisprudência?",
          resposta: "Conjunto de **decisões reiteradas** e uniformes dos tribunais sobre uma determinada matéria."
        },
        {
          pergunta: "Doutrina?",
          resposta: "Estudo e teorização sobre o Direito, realizado por juristas, professores e estudiosos."
        },
        {
          pergunta: "Defina o Princípio da Legalidade (em sentido amplo).",
          resposta: "Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei."
        },
        {
          pergunta: "O que é o Império da Lei?",
          resposta: "Vale o que a lei determina, e todos devem obedecer."
        },
        {
          pergunta: "O que é o Império Vontade?",
          resposta: "Vale a vontade das pessoas, desde que não contrarie a lei."
        },
        {
          pergunta: "O que é a Hermenêutica Jurídica?",
          resposta: "Ramo do Direito que estuda e sistematiza os processos de **interpretação** das normas jurídicas."
        },
        {
          pergunta: "O que é Formas de Integração do Direito?",
          resposta: "São maneiras de resolver casos quando a lei não tem resposta direta (ou seja, há uma 'lacuna' na lei)."
        },
        {
          pergunta: "Analogia?",
          resposta: "Usa casos parecidos para resolver o caso sem lei específica."
        },
        {
          pergunta: "Princípios Gerais do Direito?",
          resposta: "Usa valores e ideias básicas de justiça. Exemplo: boa-fé, igualdade, honestidade."
        },
        {
          pergunta: "Quais são os 5 Fundamentos da República Federativa do Brasil (Art. 1º, CF/88)?",
          resposta: "**S**oberania, **C**idadania, **D**ignidade da pessoa humana, **V**alores sociais do trabalho e da livre iniciativa, **P**luralismo político (Mnemônico: SOCIDIVAPLU)."
        },
        {
          pergunta: "O que é a **Dignidade da Pessoa Humana**?",
          resposta: "É o valor supremo do ordenamento jurídico, conferindo a todo ser humano o direito a ser respeitado e tratado como um fim em si mesmo."
        },
        {
          pergunta: "O que estabelece o Art. 2º da CF/88?",
          resposta: "São Poderes da União, independentes e harmônicos entre si: o **Legislativo**, o **Executivo** e o **Judiciário**."
        },
        {
          pergunta: "Quais são os principais Objetivos Fundamentais da República (Art. 3º, CF/88)?",
          resposta: "Construir sociedade livre, justa e solidária; Garantir o desenvolvimento nacional; Erradicar a pobreza/marginalização; Promover o bem de todos."
        },
        {
          pergunta: "Defina a **Supremacia da Constituição**.",
          resposta: "A Constituição está no topo da hierarquia das normas jurídicas, sendo o fundamento de validade das demais leis."
        },
        {
          pergunta: "O que são **Direitos de 1ª Geração** (ou Dimensão)?",
          resposta: "Direitos de **Liberdade** (civis e políticos), exigindo uma postura **negativa** (não-intervenção) do Estado."
        },
        {
          pergunta: "O que são **Direitos de 2ª Geração** (ou Dimensão)?",
          resposta: "Direitos de **Igualdade** (sociais, culturais e econômicos), exigindo uma postura **positiva** (intervenção) do Estado."
        },
        {
          pergunta: "Qual o significado da inviolabilidade do direito à **Vida** (Art. 5º, CF)?",
          resposta: "Engloba o direito de **permanecer vivo** e de ter uma **vida digna**."
        },
        {
          pergunta: "O que é o **Princípio da Isonomia**?",
          resposta: "Todos são **iguais** perante a lei, garantindo igualdade formal e material (tratar desigualmente os desiguais, na medida de suas desigualdades)."
        },
        {
          pergunta: "A casa é asilo inviolável do indivíduo. Cite 2 exceções que permitem a entrada sem consentimento do morador.",
          resposta: "Flagrante delito; Desastre; Prestar socorro; ou, Durante o dia, por determinação judicial."
        },
        {
          pergunta: "Em regra, a lei retroagirá ou não retroagirá?",
          resposta: "A lei não prejudicará o **direito adquirido**, o **ato jurídico perfeito** e a **coisa julgada** (princípio da irretroatividade da lei)."
        },
        {
          pergunta: "Defina **Coisa Julgada**.",
          resposta: "Decisão judicial da qual **não cabe mais recurso** e se torna imutável."
        },
        {
          pergunta: "O que é o **Habeas Corpus**?",
          resposta: "Remédio constitucional para proteger o direito de **locomoção** (ir, vir e ficar), quando ameaçado ou violado por ilegalidade ou abuso de poder."
        },
        {
          pergunta: "O que é o **Mandado de Segurança**?",
          resposta: "Remédio constitucional para proteger direito líquido e certo, não amparado por *Habeas Corpus* ou *Habeas Data*."
        },
        {
          pergunta: "Qual a função do **Habeas Data**?",
          resposta: "Assegurar o conhecimento de informações relativas à pessoa do impetrante em registros ou bancos de dados de entidades governamentais ou de caráter público."
        },
        {
          pergunta: "Qual o nome do instrumento para anular ato lesivo ao patrimônio público?",
          resposta: "**Ação Popular**."
        },
        {
          pergunta: "O que é um **crime inafiançável**?",
          resposta: "Crime que não permite a concessão de fiança para a liberdade provisória do acusado."
        },
        {
          pergunta: "O que é o **Princípio da Individualização da Pena**?",
          resposta: "A pena deve ser adaptada às características e à gravidade da conduta de cada indivíduo."
        },
        {
          pergunta: "O que é o **Princípio da Intranscendência da Pena**?",
          resposta: "A pena não pode passar da pessoa do condenado (a responsabilidade criminal é pessoal)."
        },
        {
          pergunta: "O que garante o **Devido Processo Legal**?",
          resposta: "Ninguém será privado da liberdade ou de seus bens sem o devido processo legal (garantia de um processo justo)."
        },
        {
          pergunta: "O que são Sujeitos do Direito?",
          resposta: "São quem tem direitos e deveres perante a lei."
        },
        {
          pergunta: "O que é **Pessoa Natural** (ou Física)?",
          resposta: "Ser humano, dotado de personalidade jurídica."
        },
        {
          pergunta: "Quando se inicia a **Personalidade Civil** da pessoa natural?",
          resposta: "Com o **nascimento com vida** (Art. 2º, CC)."
        },
        {
          pergunta: "O que é **Capacidade de Direito** (ou de Gozo)?",
          resposta: "Aptidão para ser **titular** de direitos e deveres (adquirida com o nascimento)."
        },
        {
          pergunta: "O que é **Capacidade de Fato** (ou de Exercício)?",
          resposta: "Aptidão para **exercer** pessoalmente os atos da vida civil (adquirida, em regra, aos 18 anos)."
        },
        {
          pergunta: "Capacidade da Pessoa 0 a 16 anos?",
          resposta: "Incapaz, precisa de responsável (absolutamente incapaz)."
        },
        {
          pergunta: "Capacidade da Pessoa 16 a 18 anos?",
          resposta: "Capacidade relativa, precisa de ajuda em alguns atos (relativamente incapaz)."
        },
        {
          pergunta: "Capacidade da Pessoa +18 anos?",
          resposta: "Total capacidade."
        },
        {
          pergunta: "Capacidade Especiais (alcoólatras, etc)?",
          resposta: "Alguns casos especiais podem limitar a capacidade (relativamente incapaz), como uso habitual de drogas, problemas mentais ou gastos irresponsáveis (pródigos)."
        },
        {
          pergunta: "O que é **Emancipação**?",
          resposta: "Antecipação legal da capacidade de fato (exercício) para o menor entre 16 e 18 anos."
        },
        {
          pergunta: "O que é **Domicílio**?",
          resposta: "O local onde uma pessoa estabelece a sua residência com ânimo definitivo."
        },
        {
          pergunta: "Domicílio da Pessoa Natural?",
          resposta: "É o lugar onde a pessoa mora com intenção de ficar."
        },
        {
          pergunta: "Domicílio da Pessoa Jurídica de Direito Privado?",
          resposta: "É o lugar onde funciona sua sede, diretoria ou administração, ou o endereço indicado no contrato social."
        },
        {
          pergunta: "Pessoa Jurídica com sede no Exterior?",
          resposta: "O local da filial ou agência que realizou o ato ou contrato no Brasil."
        },
        {
          pergunta: "O que são **Bens Públicos**?",
          resposta: "São bens que pertencem à União, aos Estados, ao Distrito Federal ou aos Municípios, usados em benefício da coletividade (ou não)."
        },
        {
          pergunta: "Bens de uso especial?",
          resposta: "São os bens usados pelo governo para prestar serviços públicos."
        },
        {
          pergunta: "Bens dominicais?",
          resposta: "São os bens públicos que não estão sendo usados nem pelo povo nem pela administração."
        },
        {
          pergunta: "Bens Imóveis?",
          resposta: "São os bens que não podem ser movidos sem que se altere ou destrua sua estrutura (ex: terrenos, edifícios)."
        },
        {
          pergunta: "Bens Móveis?",
          resposta: "São os bens que podem ser transportados de um lugar para outro sem se danificarem (ex: carro, cadeira)."
        },
        {
          pergunta: "Bens Fungíveis?",
          resposta: "São os bens que podem ser trocados por outros iguais, da mesma espécie, qualidade e quantidade (ex: dinheiro, grãos de café)."
        },
        {
          pergunta: "Bens Consumíveis?",
          resposta: "São os bens que se acabam com o uso — ou seja, só podem ser usados uma vez (ex: alimentos, combustível)."
        },
        {
          pergunta: "Bens Divisíveis?",
          resposta: "São os bens que podem ser divididos em partes sem perder o valor ou a função."
        },
        {
          pergunta: "Bens Indivisíveis?",
          resposta: "São os bens que não podem ser divididos sem perder a utilidade ou o valor."
        },
        {
          pergunta: "Bens Singulares?",
          resposta: "São os bens considerados isoladamente, com existência própria, mesmo que façam parte de um conjunto."
        },
        {
          pergunta: "Bens Coletivos?",
          resposta: "São os bens que pertencem a todos, de uso comum ou interesse geral da sociedade (Atenção: essa definição é mais ampla; em Direito Civil, refere-se a universalidades)."
        },
        {
          pergunta: "Fato (não jurídico)?",
          resposta: "Acontecimento sem relevância jurídica, não produz efeitos legais."
        },
        {
          pergunta: "Fato jurídico (em sentido amplo)?",
          resposta: "Acontecimento que produz efeitos jurídicos, independentemente da vontade. Exemplos: morte, nascimento, desastre natural."
        },
        {
          pergunta: "Ato jurídico (em sentido estrito)?",
          resposta: "Ato praticado com vontade humana, lícito, e que gera efeitos legais. Exemplos: casamento, pagamento de dívida."
        },
        {
          pergunta: "O que é **Negócio Jurídico**?",
          resposta: "Manifestação de vontade que produz efeitos jurídicos **desejados** pelas partes."
        },
        {
          pergunta: "Quais são os 3 requisitos de validade do Negócio Jurídico (Art. 104, CC)?",
          resposta: "Agente **capaz**; Objeto **lícito**, possível, determinado ou determinável; Forma **prescrita ou não defesa em lei**."
        },
        {
          pergunta: "Defeitos do Negócio Jurídico?",
          resposta: "São vícios ou irregularidades que afetam a vontade e, consequentemente, a validade do negócio jurídico (ex: erro, dolo, coação)."
        },
        {
          pergunta: "Invalidação do negócio jurídico?",
          resposta: "Ocorre quando o negócio não atende aos requisitos de validade: agente capaz, objeto lícito, forma legal, vontade livre."
        },
        {
          pergunta: "Nulidade?",
          resposta: "Negócio inválido desde o início, ofende a lei gravemente. Efeito: nunca produz efeitos, não pode ser corrigido (art. 166 CC)."
        },
        {
          pergunta: "Anulabilidade?",
          resposta: "Negócio com vício menos grave, geralmente ligado à vontade ou capacidade. Efeito: produz efeitos até ser anulado, pode ser corrigido (art. 171 CC)."
        },
        {
          pergunta: "Erro/ignorância?",
          resposta: "Falsa percepção da realidade que afeta a vontade. Efeito: anulável."
        },
        {
          pergunta: "Dolo?",
          resposta: "Engano intencional para induzir outro a manifestar vontade viciada. Efeito: anulável, pode gerar indenização (art. 145 CC)."
        },
        {
          pergunta: "Coação?",
          resposta: "Vontade dominada por ameaça grave e injusta. Efeito: anulável (art. 151 CC)."
        },
        {
          pergunta: "Estado de perigo?",
          resposta: "Vontade viciada por desespero diante de risco grave, aproveitado por outra parte. Efeito: anulável (art. 156 CC)."
        },
        {
          pergunta: "Lesão?",
          resposta: "Aproveitamento da necessidade urgente ou inexperiência, aceitando obrigação desproporcional. Efeito: anulável ou revisão do contrato (art. 157 CC)."
        },
        {
          pergunta: "Fraude contra credores?",
          resposta: "Devedor pratica ato para prejudicar credores, ocultando ou transferindo bens. Efeito: anulável via ação Pauliana (arts. 158-165 CC)."
        },
        {
          pergunta: "Ato Comissivo?",
          resposta: "Quando alguém faz algo proibido pela lei."
        },
        {
          pergunta: "Ato Omissivo?",
          resposta: "Quando alguém deixa de fazer algo obrigatório pela lei."
        },
        {
          pergunta: "Qual a diferença entre **Dolo** e **Culpa** (em sentido amplo)?",
          resposta: "**Dolo** é a intenção de causar o dano; **Culpa** é a negligência, imprudência ou imperícia, sem intenção de causar o dano."
        },
        {
          pergunta: "O que é **Prescrição**?",
          resposta: "Perda do **direito de ação** (de exigir judicialmente) em razão do decurso do tempo."
        },
        {
          pergunta: "O que é **Decadência**?",
          resposta: "Perda do **próprio direito material** (potestativo) em razão do decurso do tempo."
        },
            
        {
          pergunta: "O que é Contrato?",
          resposta: "Acordo de vontades entre duas ou mais pessoas, que visa criar, modificar ou extinguir direitos e obrigações (Negócio Jurídico bilateral)."
        },
        {
          pergunta: "Quais são os 3 Princípios Fundamentais da Teoria Contratual?",
          resposta: "Autonomia da Vontade (liberdade de contratar), Força Obrigatória (pacta sunt servanda) e Boa-fé Objetiva."
        },
        {
          pergunta: "Defina o Princípio da Boa-fé Objetiva.",
          resposta: "Impõe aos contratantes um dever de agir com honestidade, lealdade e cooperação, antes, durante e após o contrato (Art. 422, CC)."
        },
        {
          pergunta: "O que significa **Pacta Sunt Servanda**?",
          resposta: "A força obrigatória dos contratos. O acordo faz lei entre as partes e deve ser cumprido."
        },
        {
          pergunta: "O que é **Função Social do Contrato**?",
          resposta: "O contrato não pode servir apenas aos interesses das partes, mas deve observar o interesse da coletividade, limitando a autonomia da vontade."
        },
        {
          pergunta: "Defina a **Revisão Contratual** (Teoria da Imprevisão/Onerosidade Excessiva).",
          resposta: "Possibilidade de alterar o contrato se eventos supervenientes, imprevisíveis e extraordinários tornarem a obrigação excessivamente onerosa para uma das partes (Art. 478, CC)."
        },
        {
          pergunta: "Qual a diferença entre Contrato Unilateral e Bilateral?",
          resposta: "Bilateral gera obrigações para ambas as partes (Ex: compra e venda). Unilateral gera obrigação apenas para uma parte (Ex: doação pura)."
        },
        {
          pergunta: "O que é um Contrato Oneroso?",
          resposta: "Aquele em que ambas as partes obtêm vantagens, sofrendo o correspondente sacrifício patrimonial (Ex: locação, ambas dão e recebem)."
        },
        {
          pergunta: "O que é um Contrato Gratuito (ou Benéfico)?",
          resposta: "Aquele em que apenas uma das partes obtém vantagem, e a outra, o sacrifício (Ex: doação pura, comodato)."
        },
        {
          pergunta: "O que é **Vício Redibitório**?",
          resposta: "Defeito oculto em coisa recebida em contrato comutativo (oneroso), que a torna imprópria ao uso ou lhe diminui o valor."
        },
        {
          pergunta: "O que é **Evicção**?",
          resposta: "Perda da posse ou propriedade de um bem, em virtude de uma sentença judicial que reconhece direito anterior de um terceiro."
        },
        {
          pergunta: "O que são **Arras** ou **Sinal**?",
          resposta: "Valor ou bem entregue por um contratante ao outro no momento da conclusão do contrato, para confirmar o acordo (Arras Confirmatórias) ou servir como cláusula penal (Arras Penitenciais)."
        },
        {
          pergunta: "O que é **Cláusula Penal** (Multa Contratual)?",
          resposta: "É a penalidade (multa) inserida no contrato, que pode ser exigida em caso de inexecução total ou atraso (mora) no cumprimento da obrigação."
        },
        {
          pergunta: "O que é **Exceção do Contrato Não Cumprido**?",
          resposta: "Em contratos bilaterais, uma parte pode se recusar a cumprir sua obrigação enquanto a outra não cumprir a dela (Art. 476, CC)."
        },
        {
          pergunta: "Qual a principal característica de um Contrato de Adesão?",
          resposta: "As cláusulas são estabelecidas previamente por uma das partes, não permitindo à outra discutir ou modificar o conteúdo, apenas aceitar ou rejeitar."
        },
            
          // --- Bloco 1: Conceito e Princípios ---
          {
            pergunta: "Como se conceitua um **Contrato** no âmbito jurídico (incluindo validade e efeitos)?",
            resposta: "Acordo **bilateral de vontades**, **isento de mácula**, entre **capazes**, de **forma prescrita ou não vedada em lei**, criador de **direitos e obrigações recíprocos e equivalentes** (comutativos)."
          },
          {
            pergunta: "Quais são os **três grandes requisitos** de validade do negócio jurídico (e do contrato) previstos no **Art. 104 do CC**?",
            resposta: "1. **Agente capaz**; 2. **Objeto lícito, possível, determinado ou determinável**; 3. **Forma prescrita ou não defesa em lei**."
          },
          {
            pergunta: "O que é o requisito da **Comutatividade** e em quais contratos ele se aplica?",
            resposta: "É o **estabelecimento de direitos e obrigações recíprocas e equivalentes** (equilíbrio) e se aplica especificamente aos **contratos bilaterais**."
          },
          {
            pergunta: "Quais princípios devem ser guardados na execução do contrato, conforme o Código Civil?",
            resposta: "Os princípios da **Probidade** e da **Boa-Fé** (Boa-Fé Objetiva)."
          },
          {
            pergunta: "Qual princípio limita a liberdade de contratar?",
            resposta: "A **Função Social do Contrato**. A liberdade deve ser exercida 'em razão e nos limites da função social do contrato'."
          },
          {
            pergunta: "O que é a **Formalidade *Ad Solemnitatem*** e qual seu efeito se não for observada?",
            resposta: "É a **forma especial que a lei exige** expressamente para a validade do contrato (forma *prescrita*). Se não for observada, o contrato será **nulo**."
          },
          {
            pergunta: "Segundo o Art. 5º do CC, quais são três formas de se adquirir a **Capacidade Jurídica** (emancipação) entre 16 e 18 anos?",
            resposta: "**Casamento**; **Colação de Grau** do Ensino Superior; ou **Estabelecimento Civil/Comercial** ou **Relação de Emprego com economia própria**."
          },
          {
            pergunta: "O que é a **Proposta** (ou Policitação)?",
            resposta: "É a **manifestação unilateral de vontade** do proponente, **clara, completa** e dirigida a outro, com o intuito de celebrar o contrato."
          },
          {
            pergunta: "Qual o efeito jurídico da Proposta?",
            resposta: "Em regra, a proposta **obriga o proponente** (Art. 427 do CC), que não pode se retratar sem justa causa."
          },
          {
            pergunta: "O que ocorre se a **Aceitação** for dada com alterações ou condições diferentes da Proposta?",
            resposta: "Ela perde o caráter de aceitação e se transforma em uma **nova Proposta** (**Contraproposta**), invertendo os papéis das partes."
          }
    ]
];
// --------------------------------------------------


// --- PERSISTÊNCIA E INICIALIZAÇÃO (CORRIGIDO) ---

function loadStudyData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let data = savedData ? JSON.parse(savedData) : [];
    
    // CORREÇÃO: Achata o array se ele foi salvo na estrutura aninhada acidentalmente
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].pergunta === undefined) {
        return data.flat();
    }
    return data;
}

function saveStudyData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studyData));
}

function loadInitialData() {
    // CORREÇÃO: Usa .flat() para garantir que studyData seja um array de objetos simples, se estiver vazio.
    if (!studyData || studyData.length === 0 || Array.isArray(studyData[0])) {
        studyData = INITIAL_JURIDICAL_DATA.flat();
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
function getShuffledAndLimitedData(limit = MAX_ITENS) {
    if (studyData.length === 0) return [];
    const dataCopy = [...studyData];
    // Embaralha
    const shuffled = dataCopy.sort(() => 0.5 - Math.random());
    // Limita
    return shuffled.slice(0, limit);
}


function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
    
    // Força a renderização aleatória e limitada ao trocar de aba
    // Reseta o estado do Flash Write se sair da aba
    if (flashWriteRunning && tabId !== 'flash-write') {
        stopFlashWriteTimer();
    }

    if (tabId === 'flashcards') renderFlashCards();
    if (tabId === 'simulado') renderSimulado();
    if (tabId === 'verdadeiro-falso') renderVfSimulado();
    if (tabId === 'flash-write') renderFlashWrite(); 
}

document.addEventListener('DOMContentLoaded', () => {
    // Apenas a aba de flashcards é inicializada ao carregar
    showTab('flashcards');
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
        
        // Renderiza a aba ativa
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
        // Renderiza a aba ativa (não precisa renderizar todas)
        const activeTab = document.querySelector('.tab-content.active').id;
        showTab(activeTab);
    }
}

function startEdit(originalIndex) {
    // Garante que apenas um cartão está em modo de edição por vez
    if (editingIndex !== -1 && editingIndex !== originalIndex) {
        renderFlashCards(); // Re-renderiza para fechar o anterior
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
        // Renderiza a aba ativa
        const activeTab = document.querySelector('.tab-content.active').id;
        showTab(activeTab);
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

    if (limitedData.length === 0) {
        container.innerHTML = '<p>Adicione um item de estudo para começar!</p>';
        return;
    }

    limitedData.forEach((item) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flashcard-wrapper';
        
        // Mapeia o item aleatório de volta para o índice original para ações de CRUD
        const originalIndex = studyData.findIndex(d => d.pergunta === item.pergunta && d.resposta === item.resposta);

        if (originalIndex === editingIndex) {
            // Renderiza o formulário de edição
            wrapper.innerHTML = `
                <div class="flashcard editing">
                    <input type="text" id="edit-pergunta-${originalIndex}" value="${item.pergunta.replace(/"/g, '&quot;')}" required>
                    <textarea id="edit-resposta-${originalIndex}" required>${item.resposta}</textarea>
                    <div class="actions">
                        <button onclick="saveEdit(${originalIndex})" class="save-button">Salvar</button>
                        <button onclick="cancelEdit()" class="cancel-button">Cancelar</button>
                    </div>
                </div>
            `;
        } else {
            // Renderiza o flash card normal
            wrapper.innerHTML = `
                <div class="flashcard" onclick="this.classList.toggle('flipped')">
                    <div class="front">
                        <p class="question">${item.pergunta}</p>
                    </div>
                    <div class="back">
                        <p class="answer">${item.resposta}</p>
                    </div>
                </div>
                <div class="crud-actions">
                    <button onclick="startEdit(${originalIndex})" class="edit-button">Editar</button>
                    <button onclick="deleteFlashCard(${originalIndex})" class="delete-button">Excluir</button>
                </div>
            `;
        }
        container.appendChild(wrapper);
    });
}

// 3. Renderizar Simulado de Múltipla Escolha
function renderSimulado() {
    const container = document.getElementById('simulado-container');
    container.innerHTML = '<h3>Simulado de Múltipla Escolha (10 Questões)</h3>';

    const maxQuestions = 10;
    const questions = getShuffledAndLimitedData(maxQuestions); 

    if (questions.length < 4) {
        container.innerHTML += '<p>São necessários no mínimo 4 itens de estudo para gerar um Simulado de Múltipla Escolha.</p>';
        return;
    }

    const form = document.createElement('form');
    form.id = 'simulado-form';
    form.addEventListener('submit', (e) => { e.preventDefault(); checkSimulado(); });

    questions.forEach((q, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'question-block';
        
        // Questão
        const questionHtml = `
            <p><strong>${index + 1}. ${q.pergunta}</strong></p>
        `;
        
        // Gerar 3 Distratores (opções erradas)
        const allOtherAnswers = studyData
            .filter(d => d.resposta !== q.resposta)
            .map(d => d.resposta)
            .sort(() => 0.5 - Math.random());
        
        const distractors = allOtherAnswers.slice(0, 3);
        
        // Combina resposta correta e distratores
        let options = [q.resposta, ...distractors].sort(() => 0.5 - Math.random());
        
        let optionsHtml = options.map((option, optIndex) => `
            <label class="option-label">
                <input type="radio" name="question-${index}" value="${option.replace(/"/g, '&quot;')}" required>
                ${String.fromCharCode(65 + optIndex)}. ${option}
            </label>
        `).join('');

        itemContainer.innerHTML = questionHtml + '<div class="options-container">' + optionsHtml + '</div>';
        form.appendChild(itemContainer);
    });

    form.innerHTML += '<button type="submit" class="check-button">Verificar Respostas</button>';
    const resultP = document.createElement('p');
    resultP.id = 'simulado-result';
    
    container.appendChild(form);
    container.appendChild(resultP);
}

function checkSimulado() {
    const form = document.getElementById('simulado-form');
    const resultP = document.getElementById('simulado-result');
    let score = 0;
    let total = 0;
    let detailedResults = '';

    const questions = getShuffledAndLimitedData(10); // Obtém as mesmas 10 questões

    questions.forEach((q, index) => {
        total++;
        const radioName = `question-${index}`;
        const selectedOption = form.querySelector(`input[name="${radioName}"]:checked`);
        const correct = q.resposta;
        let isCorrect = false;

        if (selectedOption) {
            const userAnswer = selectedOption.value;
            if (userAnswer === correct) {
                score++;
                isCorrect = true;
            }
        }
        
        detailedResults += `<p class="${isCorrect ? 'correct' : 'incorrect'}"><strong>Questão ${index + 1}:</strong> Sua resposta: ${selectedOption ? selectedOption.value : 'NÃO RESPONDIDA'}. Correta: ${correct}</p>`;
    });

    resultP.innerHTML = `
        <div class="simulado-score">
            Resultado: Você acertou **${score}** de **${total}**!
        </div>
        <div class="simulado-details">
            ${detailedResults}
        </div>
    `;
}

// 4. Renderizar Simulado Verdadeiro ou Falso
function renderVfSimulado() {
    const container = document.getElementById('verdadeiro-falso-container');
    container.innerHTML = '<h3>Simulado de Verdadeiro ou Falso (10 Questões)</h3>';

    const maxQuestions = 10;
    const questions = getShuffledAndLimitedData(maxQuestions); 

    if (questions.length < 1) {
        container.innerHTML += '<p>Adicione mais itens de estudo para gerar o Simulado V/F.</p>';
        return;
    }

    const form = document.createElement('form');
    form.id = 'vf-simulado-form';
    form.addEventListener('submit', (e) => { e.preventDefault(); checkVfSimulado(); });

    questions.forEach((q, index) => {
        const isStatementCorrect = Math.random() > 0.5; // Decide se a afirmação será correta ou não
        let statement;
        let expectedAnswer;

        if (isStatementCorrect) {
            // Afirmação Correta: Pergunta é igual à resposta
            statement = `${q.pergunta}: ${q.resposta}`;
            expectedAnswer = 'V';
        } else {
            // Afirmação Incorreta: Mistura a resposta com uma resposta errada de outro item
            const wrongAnswer = studyData
                .filter(d => d.resposta !== q.resposta)
                .sort(() => 0.5 - Math.random())[0]?.resposta || 'Resposta Alternativa Falsa.';

            statement = `${q.pergunta}: ${wrongAnswer}`;
            expectedAnswer = 'F';
        }
        
        // Armazena a resposta esperada no dataset do form (oculto)
        form.dataset[`q${index}`] = expectedAnswer;


        const itemContainer = document.createElement('div');
        itemContainer.className = 'question-block vf-block';
        itemContainer.innerHTML = `
            <p><strong>${index + 1}.</strong> ${statement}</p>
            <div class="options-container">
                <label class="option-label vf-v">
                    <input type="radio" name="vf-question-${index}" value="V" required>
                    Verdadeiro (V)
                </label>
                <label class="option-label vf-f">
                    <input type="radio" name="vf-question-${index}" value="F" required>
                    Falso (F)
                </label>
            </div>
        `;
        form.appendChild(itemContainer);
    });

    form.innerHTML += '<button type="submit" class="check-button">Verificar Respostas</button>';
    const resultP = document.createElement('p');
    resultP.id = 'vf-simulado-result';
    
    container.appendChild(form);
    container.appendChild(resultP);
}

function checkVfSimulado() {
    const form = document.getElementById('vf-simulado-form');
    const resultP = document.getElementById('vf-simulado-result');
    let score = 0;
    let total = 0;
    let detailedResults = '';

    const questionsBlocks = form.querySelectorAll('.question-block');

    questionsBlocks.forEach((block, index) => {
        total++;
        const radioName = `vf-question-${index}`;
        const selectedOption = form.querySelector(`input[name="${radioName}"]:checked`);
        const expectedAnswer = form.dataset[`q${index}`];
        let isCorrect = false;

        if (selectedOption) {
            const userAnswer = selectedOption.value;
            if (userAnswer === expectedAnswer) {
                score++;
                isCorrect = true;
            }
        }
        
        const questionText = block.querySelector('p').innerText;
        detailedResults += `<p class="${isCorrect ? 'correct' : 'incorrect'}"><strong>Questão ${index + 1}:</strong> ${questionText.substring(0, 50)}... - Resposta Correta: ${expectedAnswer}. Sua Resposta: ${selectedOption ? selectedOption.value : 'NÃO RESPONDIDA'}</p>`;
    });

    resultP.innerHTML = `
        <div class="simulado-score">
            Resultado: Você acertou **${score}** de **${total}**!
        </div>
        <div class="simulado-details">
            ${detailedResults}
        </div>
    `;
}

// 5. Desafio de Escrita Rápida (Flash Write)
function renderFlashWrite() {
    const container = document.getElementById('flash-write-container');
    container.innerHTML = '<h3>Desafio de Escrita Rápida (20s)</h3><p>Tente escrever o conceito o mais rápido e completo possível. A precisão da digitação é por sua conta, o foco é na recuperação do conceito!</p>';

    // Se estiver rodando, não renderiza o botão de início
    if (flashWriteRunning) {
        // Renderiza a pergunta atual
        container.appendChild(renderFlashWriteQuestion(currentFlashWriteData[currentFlashWriteQuestionIndex]));
        return;
    }

    // Botão para iniciar
    const startButton = document.createElement('button');
    startButton.textContent = `Iniciar Desafio (${MAX_ITENS} Itens)`;
    startButton.className = 'start-button';
    startButton.onclick = startFlashWrite;

    container.appendChild(startButton);

    const resultP = document.createElement('p');
    resultP.id = 'flash-write-result';
    container.appendChild(resultP);
}

function startFlashWrite() {
    if (studyData.length < 1) {
        alert('Adicione itens de estudo antes de iniciar o desafio.');
        return;
    }
    
    // Obtém um novo conjunto de dados para a sessão
    currentFlashWriteData = getShuffledAndLimitedData(MAX_ITENS);
    currentFlashWriteQuestionIndex = 0;
    flashWriteRunning = true;
    
    document.getElementById('flash-write-result').innerHTML = ''; // Limpa resultados anteriores

    renderFlashWrite();
    startFlashWriteTimer();
}

function renderFlashWriteQuestion(item) {
    const questionContainer = document.createElement('form');
    questionContainer.id = 'flash-write-form';
    questionContainer.innerHTML = `
        <p id="timer-display" style="font-weight: bold; color: #FF6347; margin-top: 15px; font-size: 1.2em;">Tempo restante: ${FLASH_WRITE_TIME_SECONDS}s</p>
        <p><strong>Conceito para Escrever:</strong> ${item.pergunta}</p>
        <textarea id="flash-write-input" rows="5" placeholder="Escreva a resposta aqui..." autofocus></textarea>
        <button type="button" onclick="checkFlashWrite()" class="check-button" id="flash-write-button">Comparar e Próximo</button>
    `;
    return questionContainer;
}

function startFlashWriteTimer() {
    let timeLeft = FLASH_WRITE_TIME_SECONDS;
    const timerDisplay = document.getElementById('timer-display');
    const inputField = document.getElementById('flash-write-input');
    const checkButton = document.getElementById('flash-write-button');

    timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;
    
    stopFlashWriteTimer(); // Limpa qualquer timer anterior

    flashWriteTimer = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;

        if (timeLeft <= 0) {
            stopFlashWriteTimer();
            if (inputField) inputField.disabled = true;
            if (checkButton) checkButton.textContent = 'Tempo Esgotado! Comparar e Próximo';
        }
    }, 1000);
}

function stopFlashWriteTimer() {
    if (flashWriteTimer) {
        clearInterval(flashWriteTimer);
        flashWriteTimer = null;
    }
    flashWriteRunning = false;
}

function checkFlashWrite() {
    if (!flashWriteRunning) return;

    stopFlashWriteTimer();

    const resultP = document.getElementById('flash-write-result');
    const currentItem = currentFlashWriteData[currentFlashWriteQuestionIndex];
    const userAnswer = document.getElementById('flash-write-input').value.trim();
    const correctAnswer = currentItem.resposta;
    
    // Simples comparação de pontuação (apenas para exibição)
    const similarity = calculateJaccardSimilarity(userAnswer.toLowerCase(), correctAnswer.toLowerCase());
    
    let resultHtml = `
        <div class="write-result-block">
            <p><strong>Conceito:</strong> ${currentItem.pergunta}</p>
            <p><strong>Sua Resposta:</strong> ${userAnswer || 'Nenhuma resposta fornecida.'}</p>
            <p class="correct-answer"><strong>Resposta Correta:</strong> ${correctAnswer}</p>
            <p class="score-indicator">Similaridade (Jaccard): **${(similarity * 100).toFixed(2)}%**</p>
        </div>
    `;

    resultP.innerHTML = resultHtml;

    // Próxima pergunta
    currentFlashWriteQuestionIndex++;
    
    if (currentFlashWriteQuestionIndex < currentFlashWriteData.length) {
        // Continua
        setTimeout(() => {
            renderFlashWrite();
            startFlashWriteTimer();
        }, 3000); // Espera 3 segundos antes de ir para a próxima questão
    } else {
        // Fim da sessão
        stopFlashWriteTimer();
        resultP.innerHTML += `<div class="final-score"><h3>Fim do Desafio! Você revisou ${currentFlashWriteData.length} itens.</h3></div>`;
        flashWriteRunning = false;
        renderFlashWrite(); // Renderiza o botão de iniciar novamente
    }
}

// Função utilitária para calcular Similaridade (ex: Jaccard) para o Flash Write
// Simples e funcional para comparação de textos
function calculateJaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
}
