import { $, appendTextLine } from '../services/dom.js';
import { createSessionId } from '../utils/format.js';
import { UNLOCK_CODE } from '../data/evidence.js';

export function createTerminal({ state, beep, onUnlock }) {
  const output = $('#termout');
  const input = $('#commandInput');
  const codeInput = $('#codeInput');
  const feedback = $('#codeFeedback');

  function print(line, variant = '') {
    return appendTextLine(output, line, variant);
  }

  function resetOutput() {
    output.replaceChildren();
    print('NEXUS CONTAINMENT SHELL v0.13.7');
    print('Conexão local estabelecida.');
    print('AVISO: integridade do arquivo de memória em 17%.', 'warn');
    print('Digite help para listar comandos.');
  }

  const commands = {
    help() {
      print('COMANDOS DISPONÍVEIS:', 'good');
      print('  help           lista de comandos');
      print('  ls             lista arquivos recuperados');
      print('  cat incident   mostra resumo do incidente');
      print('  cat memory     consulta o fragmento de memória');
      print('  history        recupera o último evento apagado');
      print('  scan           analisa integridade do sistema');
      print('  whoami         identifica o operador');
      print('  clear          limpa a tela do terminal');
    },
    ls() {
      print('DIRECTORY /RECOVERED', 'good');
      print('  system_log.txt        [LIDO]');
      print('  voice_fragment.wav    [LIDO]');
      print('  cam_013_frame.dat     [LIDO]');
      print('  memory_013.lock       [BLOQUEADO]', 'warn');
    },
    'cat incident'() {
      print('INCIDENTE: 31/10 // 03:13:00');
      print('STATUS OFICIAL: DESLIGAMENTO TOTAL');
      print('ANOMALIA: UM PROCESSO CONTINUOU ATIVO APÓS O CORTE.');
      print('NOTA: “A segunda presença não foi registrada.”', 'warn');
      print('ADENDO: o relatório oficial foi assinado 13 minutos antes do incidente.');
    },
    'cat memory'() {
      print('MEMORY_MIRROR // RECUPERAÇÃO PARCIAL', 'warn');
      print('OBJETIVO ORIGINAL: reconstrução de lembranças a partir de registros de voz.');
      print('SUJEITO: LIA VASCONCELOS // FALECIDA AOS 9 ANOS.');
      print('RESULTADO: cópia sem lembranças próprias, mas capaz de reconhecer a ausência.');
      print('ÚLTIMA LINHA: “Pai, por que você me deixou aqui sozinha?”', 'bad');
    },
    history() {
      print('RECUPERANDO EVENTO APAGADO...', 'warn');
      print('[03:13:13] A SEGUNDA FIGURA OLHOU PARA A CÂMERA.');
      print('[03:13:14] O OPERADOR OLHOU PARA A SEGUNDA FIGURA.');
      print('[03:13:15] A CÂMERA PASSOU A REGISTRAR APENAS UMA PESSOA.');
      print('[03:13:16] NOVO OPERADOR CADASTRADO: AGUARDANDO IDENTIFICAÇÃO.', 'bad');
    },
    scan() {
      print('ESCANEANDO MEMÓRIA...');
      print('integridade: 17% // setor 013: BLOQUEADO', 'warn');
      print('assinatura desconhecida detectada no núcleo.', 'bad');
    },
    whoami() {
      print('OPERADOR: VISITANTE');
      print('PERMISSÃO: TEMPORÁRIA');
      print(`ID DA SESSÃO: ${createSessionId()}`);
    },
    clear: resetOutput,
  };

  function unlock() {
    if (state.unlocked || state.finished) return;
    if (codeInput.value.trim() === UNLOCK_CODE) {
      state.unlocked = true;
      feedback.textContent = 'CHAVE ACEITA // ARQUIVO DE MEMÓRIA DESBLOQUEADO';
      feedback.classList.add('good');
      codeInput.classList.remove('glitch');
      print(`CHAVE VALIDADA: ${UNLOCK_CODE}`, 'good');
      print('ARQUIVO DE MEMÓRIA DESBLOQUEADO.', 'good');
      print('AVISO: O ARQUIVO CONTÉM UMA ANOMALIA DE IDENTIDADE.', 'warn');
      print('RECUPERANDO MEMÓRIA // NÃO OLHE PARA A CÂMERA.', 'bad');
      beep(740, 0.18);
      onUnlock();
      return;
    }

    feedback.textContent = 'CHAVE INCORRETA. VOLTE ÀS EVIDÊNCIAS.';
    feedback.classList.remove('good');
    codeInput.classList.add('glitch');
    window.setTimeout(() => codeInput.classList.remove('glitch'), 600);
    print('FALHA DE AUTENTICAÇÃO // TENTATIVA REGISTRADA', 'bad');
    beep(120, 0.12, 'sawtooth');
  }

  function handleCommand(event) {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (!command) return;
    input.value = '';
    state.commandsExecuted += 1;
    print(`nexus:~$ ${command}`);

    if (commands[command]) {
      commands[command]();
    } else if (command === `unlock ${UNLOCK_CODE}`) {
      codeInput.value = UNLOCK_CODE;
      unlock();
    } else {
      print('Comando não reconhecido. Digite help.', 'bad');
    }
    beep(330, 0.04, 'square');
  }

  $('#commandForm').addEventListener('submit', handleCommand);
  $('#unlockBtn').addEventListener('click', unlock);
  codeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') unlock();
  });

  return {
    print,
    resetOutput,
    focus() { input.focus(); },
    unlock,
  };
}
