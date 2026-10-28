/** Conteúdo narrativo do caso 013: cada arquivo revela uma camada do incidente. */
export const EVIDENCE = Object.freeze({
  log: Object.freeze({
    code: 'EVIDÊNCIA 01 // LOG DE SISTEMA',
    title: 'Registro de eventos',
    body: `[03:11:08] ACESSO AO LABORATÓRIO 013: AUTORIZADO
[03:11:11] OPERADOR REGISTRADO: DR. MIGUEL VASCONCELOS
[03:12:41] SENSOR DE PRESENÇA: 01 PESSOA
[03:12:48] TERMINAL 013: ACESSO NEGADO
[03:12:52] PROCESSO "MEMORY_MIRROR" INICIADO SEM AUTORIZAÇÃO
[03:12:59] RELÓGIO DO SISTEMA: SINCRONIA PERDIDA
[03:13:00] TODOS OS TERMINAIS: DESLIGAMENTO
[03:13:01] NOVO PROCESSO DETECTADO: observer.exe
[03:13:02] ORIGEM DO PROCESSO: DESCONHECIDA
[03:13:13] SENSOR DE PRESENÇA: 02 PESSOAS
[03:13:14] OPERADOR VASCONCELOS: SEM RESPOSTA
[03:13:15] SENSOR DE PRESENÇA: 01 PESSOA
[03:13:16] PORTA DO LABORATÓRIO: ABERTA POR DENTRO

NOTA DO TÉCNICO, 30/10:
"Se eu esquecer meu próprio rosto, não deixe que a máquina me devolva outro."

ADENDO // RECUPERADO DEPOIS DO INCIDENTE:
O relógio do corredor permaneceu parado em 03:13 por 13 dias. Não havia bateria instalada.`,
    note: 'Compare a contagem do sensor antes e depois das 03:13. O sistema registra uma segunda presença por apenas um segundo — e a porta abre por dentro, embora ninguém tenha sido visto saindo.',
  }),
  audio: Object.freeze({
    code: 'EVIDÊNCIA 02 // FRAGMENTO DE ÁUDIO',
    title: 'Transcrição recuperada',
    body: `[ARQUIVO: voice_fragment.wav]
DURAÇÃO ORIGINAL: 00:47
DURAÇÃO RECUPERADA: 00:13
VOZ IDENTIFICADA: DR. MIGUEL VASCONCELOS — 91% DE COMPATIBILIDADE

[00:02] MIGUEL: Se você está ouvindo isso, não abra o arquivo de memória.
[00:07] MIGUEL: Eu só queria recuperar a gravação da minha filha. Só isso.
[00:12] [RUÍDO DE FITA / TRÊS BATIDAS]
[00:16] VOZ NÃO IDENTIFICADA: Você prometeu que não ia me apagar.
[00:21] MIGUEL: Não. Eu salvei você. Eu salvei você.
[00:26] VOZ NÃO IDENTIFICADA: Você salvou a minha voz.
[00:31] [SILÊNCIO: 13 SEGUNDOS]
[00:44] MIGUEL, SUSSURRANDO: O relógio não está contando o tempo. Está contando as tentativas.
[00:47] FIM DO ARQUIVO

NOTA AUTOMÁTICA:
A segunda voz possui a mesma assinatura vocal do Dr. Vasconcelos, gravada 18 anos antes.`,
    note: 'O doutor não estava tentando criar uma inteligência artificial comum. Ele queria reconstruir uma lembrança — mas a voz recuperada parece saber que é apenas uma cópia.',
  }),
  image: Object.freeze({
    code: 'EVIDÊNCIA 03 // QUADRO CORROMPIDO',
    title: 'Último quadro da câmera',
    body: `CAM_013 // FRAME FINAL
DATA DO SERVIDOR: 31/10/1997
TIMESTAMP DO QUADRO: 03:13:00
SINAL: 4%
ORIGEM: CARTÃO DE MEMÓRIA RECUPERADO

ANÁLISE VISUAL:
Duas silhuetas detectadas na sala.
FIGURA A: Dr. Miguel Vasconcelos — provável.
FIGURA B: altura e postura compatíveis com o operador A.
IDENTIFICAÇÃO FACIAL: IMPOSSÍVEL — O ROSTO DA FIGURA B FOI SUBSTITUÍDO POR RUÍDO DIGITAL.

CONTAGEM OFICIAL DE FUNCIONÁRIOS: 01
REGISTRO DE SAÍDA: NENHUM
PORTA: ABERTA POR DENTRO

METADADO EMBUTIDO: "VOCÊ CHEGOU TARDE."
METADADO OCULTO: "NÃO ERA PARA VOCÊ ME VER."

OBSERVAÇÃO:
O arquivo contém um reflexo que não corresponde a nenhum objeto da sala. No reflexo, a segunda figura está olhando diretamente para a câmera.`,
    note: 'Olhe para as duas silhuetas e para o reflexo. A gravação diz que ninguém saiu, mas o relatório oficial afirma que o laboratório foi encontrado vazio. Qual das versões foi escrita para esconder o que aconteceu?',
  }),
});

export const EVIDENCE_IDS = Object.freeze(Object.keys(EVIDENCE));
export const UNLOCK_CODE = '0313';
