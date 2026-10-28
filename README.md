# A ÚLTIMA SESSÃO — Arquivo 013

Experiência ficcional de investigação e horror psicológico executada no navegador. O projeto usa HTML, CSS, JavaScript em módulos ES e Vite para desenvolvimento/build.

## Requisitos

- Node.js 20.19+ ou 22.12+ recomendado (compatível com Vite 6)
- npm

## Começar

```bash
npm install
npm run dev
```

Abra a URL local exibida pelo Vite no terminal.

## Comandos úteis

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com atualização automática |
| `npm run build` | Gera a versão otimizada em `dist/` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm test` | Executa os testes automatizados da lógica pura |
| `npm run lint` | Verifica padrões e possíveis erros no JavaScript |
| `npm run format` | Formata os arquivos com Prettier |
| `npm run format:check` | Verifica a formatação sem alterar arquivos |

## Estrutura

```text
.
├── index.html
├── public/                  # Arquivos estáticos servidos sem transformação (quando necessários)
├── src/
│   ├── scripts/
│   │   ├── data/             # Evidências e constantes narrativas
│   │   ├── features/         # Evidências, terminal, navegação e relatório
│   │   ├── services/         # Utilitários DOM e áudio
│   │   ├── state/            # Estado da sessão e regras simples
│   │   ├── utils/            # Formatação e funções puras
│   │   └── main.js           # Ponto de entrada e composição das funcionalidades
│   └── styles/
│       └── main.css          # Estilos visuais atuais
├── tests/                    # Testes automatizados com node:test
├── eslint.config.js
├── .prettierrc.json
├── package.json
└── README.md
```

## Funcionalidades da versão de feira

- Tela inicial para o visitante informar nome ou codinome.
- Cronômetro fixo no topo, iniciado apenas ao começar a investigação e congelado no desfecho.
- Ranking local dos cinco melhores tempos; só investigações concluídas entram na tabela.
- Imagem de câmera de segurança com duas silhuetas na evidência visual.
- Painel de correlação das pistas, interferências visuais ocasionais e ambiente sonoro opcional.
- Reinício rápido entre visitantes sem apagar o ranking salvo.

O ranking usa `localStorage` do navegador e fica neste computador/navegador. Limpar os dados do site pode apagar os recordes. Para um ranking compartilhado entre vários computadores, seria necessário adicionar um serviço online e um banco de dados.

## Arquitetura

- **Dados separados da interface:** as evidências e a chave narrativa vivem em `data/`.
- **Funcionalidades por módulo:** cada módulo controla uma área do jogo e expõe uma API pequena.
- **Estado explícito:** progresso, comandos, desbloqueio e sessão ficam em `state/`.
- **DOM seguro por padrão:** o texto de evidências é inserido com `textContent`, evitando interpretar conteúdo narrativo como HTML.
- **Sem backend:** a experiência e as estatísticas da sessão ficam no navegador; não há envio de dados para um servidor da aplicação.
- **Testes sem framework adicional:** `node:test` verifica funções e regras independentes do navegador.

## Fluxo do jogo

1. Leia as três evidências.
2. Acesse o terminal liberado.
3. Use `help` para descobrir os comandos.
4. Insira a chave deduzida pelas evidências.
5. Veja o desfecho e o relatório da sessão.

## Publicação

Execute `npm run build`. Publique o conteúdo da pasta `dist/` em um host estático compatível, como GitHub Pages, Netlify ou Vercel. Se usar GitHub Pages em um subcaminho, configure `base` no `vite.config.js` para o caminho do repositório antes de compilar.

## Nota

O conteúdo representa uma simulação ficcional. O terminal é cenográfico e não executa comandos do sistema operacional nem acessa arquivos do dispositivo.


## Atualização de narrativa e atmosfera (v1.2)

- As evidências agora contam uma história conectada sobre o Dr. Miguel Vasconcelos e a tentativa de reconstruir a voz de sua filha Lia.
- O terminal ganhou os comandos `cat memory` e `history`, além de informações adicionais em `cat incident`.
- O desfecho apresenta a consequência da investigação e usa o nome/codinome do visitante.
- Efeitos opcionais de rádio estático sintético, interferência visual ocasional, alerta raro de observador e distorção no final.
- O som continua desligado por padrão; o visitante ativa pelo botão **SOM**. Os efeitos visuais respeitam a preferência do sistema por movimento reduzido.

Para testar: `npm test`; para iniciar localmente: `npm install` e `npm run dev`.
