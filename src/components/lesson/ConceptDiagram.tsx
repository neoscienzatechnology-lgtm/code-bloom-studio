import type { ReactNode } from "react";
import { isStackConcept, type DiagramFamily } from "@/utils/conceptDiagram";
import type { VisualTone } from "@/utils/visualTones";
import Stack3DPanel from "@/components/lesson/Stack3DPanel";

// Diagramas didáticos por família de conceito (SVG flat, desenhado em
// código). Cada cena ilustra o MODELO MENTAL do conceito — caixa etiquetada,
// vagões, bifurcação — usando a paleta da linguagem do curso. Decorativos
// para leitores de tela (aria-hidden); o texto do cartão carrega o conteúdo.

const CHECK_GREEN = "#16a34a";
const ERROR_RED = "#e2554a";

const SCENES: Record<DiagramFamily, (t: VisualTone) => ReactNode> = {
  // Caixa com etiqueta: o valor entra e mora dentro dela
  variable: (t) => (
    <>
      <rect x="96" y="62" width="64" height="28" rx="14" fill={t.panel} stroke={t.accent} strokeWidth="3" />
      <line x1="112" y1="76" x2="144" y2="76" stroke={t.accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M172 76 H216 M206 68 L218 76 L206 84" fill="none" stroke={t.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="232" y="52" width="120" height="66" rx="14" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      <rect x="252" y="38" width="80" height="24" rx="12" fill={t.primary} />
      <line x1="266" y1="50" x2="318" y2="50" stroke="#10231A" strokeWidth="5" strokeLinecap="round" />
      <rect x="258" y="72" width="68" height="28" rx="14" fill={t.soft} stroke={t.accent} strokeWidth="3" />
      <line x1="274" y1="86" x2="310" y2="86" stroke={t.accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="396" cy="76" r="20" fill={t.soft} opacity="0.9" />
    </>
  ),

  // Letreiro entre aspas: texto é conteúdo delimitado
  text: (t) => (
    <>
      <path d="M142 56 Q132 56 132 68 L132 76 Q132 84 124 84 Q132 84 132 92 L132 96 Q132 106 142 106" fill="none" stroke={t.primary} strokeWidth="6" strokeLinecap="round" />
      <path d="M378 56 Q388 56 388 68 L388 76 Q388 84 396 84 Q388 84 388 92 L388 96 Q388 106 378 106" fill="none" stroke={t.primary} strokeWidth="6" strokeLinecap="round" />
      <rect x="162" y="52" width="196" height="58" rx="14" fill={t.panel} stroke={t.secondary} strokeWidth="3.5" />
      <g stroke={t.accent} strokeWidth="6" strokeLinecap="round">
        <line x1="182" y1="72" x2="296" y2="72" />
        <line x1="182" y1="90" x2="260" y2="90" />
      </g>
      <circle cx="330" cy="90" r="5" fill={t.primary} />
    </>
  ),

  // Vagões numerados: cada item tem posição
  list: (t) => (
    <>
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={128 + i * 96} y="44" width="80" height="52" rx="12" fill={t.panel} stroke={t.primary} strokeWidth="3.5" />
            <line x1={146 + i * 96} y1="70" x2={190 + i * 96} y2="70" stroke={t.accent} strokeWidth="5" strokeLinecap="round" />
            {i < 2 && <line x1={208 + i * 96} y1="70" x2={224 + i * 96} y2="70" stroke={t.text} strokeWidth="4" strokeLinecap="round" opacity="0.5" />}
            <circle cx={168 + i * 96} cy="112" r="12" fill={t.soft} stroke={t.primary} strokeWidth="2.5" />
            <text x={168 + i * 96} y="117" textAnchor="middle" fontSize="13" fontWeight="800" fill={t.text}>
              {i}
            </text>
          </g>
        ))}
      </g>
    </>
  ),

  // Esteira circular: repete com controle
  loop: (t) => (
    <>
      <path d="M200 50 A60 42 0 1 0 320 50" fill="none" stroke={t.primary} strokeWidth="6" strokeLinecap="round" />
      <path d="M312 62 L322 48 L300 44 Z" fill={t.primary} />
      <path d="M320 102 A60 42 0 1 0 200 102" fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M208 90 L198 104 L220 108 Z" fill={t.accent} />
      <rect x="240" y="58" width="40" height="36" rx="10" fill={t.panel} stroke={t.secondary} strokeWidth="3.5" />
      <line x1="250" y1="76" x2="270" y2="76" stroke={t.secondary} strokeWidth="5" strokeLinecap="round" />
      <circle cx="372" cy="76" r="14" fill={t.soft} stroke={t.primary} strokeWidth="2.5" />
      <text x="372" y="81" textAnchor="middle" fontSize="13" fontWeight="800" fill={t.text}>
        3x
      </text>
    </>
  ),

  // Estrada que bifurca: verdadeiro segue, falso desvia
  condition: (t) => (
    <>
      <path d="M120 76 H236" fill="none" stroke={t.primary} strokeWidth="7" strokeLinecap="round" />
      <rect x="236" y="56" width="44" height="40" rx="11" fill={t.panel} stroke={t.primary} strokeWidth="4" transform="rotate(45 258 76)" />
      <text x="258" y="82" textAnchor="middle" fontSize="17" fontWeight="900" fill={t.text}>
        ?
      </text>
      <path d="M282 64 Q330 44 372 44" fill="none" stroke={CHECK_GREEN} strokeWidth="6" strokeLinecap="round" />
      <path d="M282 90 Q330 110 372 110" fill="none" stroke={ERROR_RED} strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <circle cx="394" cy="44" r="16" fill={CHECK_GREEN} />
      <path d="M387 44 L392 50 L402 37" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="394" cy="110" r="16" fill={ERROR_RED} opacity="0.85" />
      <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
        <line x1="388" y1="104" x2="400" y2="116" />
        <line x1="400" y1="104" x2="388" y2="116" />
      </g>
    </>
  ),

  // Máquina: entrada → processamento → saída
  func: (t) => (
    <>
      <rect x="104" y="62" width="62" height="28" rx="14" fill={t.panel} stroke={t.accent} strokeWidth="3" />
      <line x1="120" y1="76" x2="150" y2="76" stroke={t.accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M174 76 H206 M198 69 L208 76 L198 83" fill="none" stroke={t.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="218" y="42" width="106" height="68" rx="16" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      <circle cx="271" cy="76" r="17" fill="none" stroke={t.primary} strokeWidth="5" />
      <circle cx="271" cy="76" r="5" fill={t.primary} />
      <g stroke={t.primary} strokeWidth="4" strokeLinecap="round">
        <line x1="271" y1="50" x2="271" y2="58" />
        <line x1="271" y1="94" x2="271" y2="102" />
        <line x1="245" y1="76" x2="253" y2="76" />
        <line x1="289" y1="76" x2="297" y2="76" />
      </g>
      <path d="M336 76 H368 M360 69 L370 76 L360 83" fill="none" stroke={t.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="380" y="62" width="62" height="28" rx="14" fill={t.soft} stroke={t.secondary} strokeWidth="3" />
      <line x1="396" y1="76" x2="426" y2="76" stroke={t.secondary} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // Fichário: gavetas com etiqueta (chave) e conteúdo (valor)
  dict: (t) => (
    <>
      <rect x="180" y="28" width="160" height="98" rx="14" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="192" y={40 + i * 30} width="136" height="22" rx="7" fill={i === 1 ? t.soft : t.panel} stroke={t.secondary} strokeWidth="2.5" />
          <rect x="198" y={45 + i * 30} width="34" height="12" rx="6" fill={t.primary} />
          <line x1={244} y1={51 + i * 30} x2={300} y2={51 + i * 30} stroke={t.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <path d="M368 60 L390 60 M380 50 L392 60 L380 70" fill="none" stroke={t.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <rect x="120" y="50" width="34" height="14" rx="7" fill={t.primary} opacity="0.85" />
    </>
  ),

  // Lupa sobre o código: o erro é uma pista
  error: (t) => (
    <>
      <rect x="142" y="40" width="180" height="74" rx="14" fill={t.panel} stroke={t.primary} strokeWidth="3.5" />
      <g strokeWidth="5" strokeLinecap="round">
        <line x1="160" y1="60" x2="262" y2="60" stroke={t.soft} />
        <line x1="160" y1="78" x2="236" y2="78" stroke={ERROR_RED} />
        <line x1="160" y1="96" x2="280" y2="96" stroke={t.soft} />
      </g>
      <path d="M160 86 q8 6 16 0 q8 -6 16 0 q8 6 16 0" fill="none" stroke={ERROR_RED} strokeWidth="2.5" opacity="0.7" />
      <circle cx="296" cy="78" r="26" fill={t.soft} fillOpacity="0.7" stroke={t.secondary} strokeWidth="5" />
      <line x1="315" y1="97" x2="340" y2="120" stroke={t.secondary} strokeWidth="8" strokeLinecap="round" />
      <circle cx="392" cy="52" r="13" fill={t.soft} />
    </>
  ),

  // Terminal: o programa fala com você pela saída
  output: (t) => (
    <>
      <rect x="150" y="32" width="220" height="90" rx="14" fill={t.panel} stroke={t.secondary} strokeWidth="2.5" />
      <circle cx="170" cy="48" r="4" fill={ERROR_RED} />
      <circle cx="184" cy="48" r="4" fill="#f6c445" />
      <circle cx="198" cy="48" r="4" fill={CHECK_GREEN} />
      <path d="M168 74 L180 82 L168 90" fill="none" stroke={t.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="192" y1="82" x2="296" y2="82" stroke="#cdd6f4" strokeWidth="5" strokeLinecap="round" />
      <rect x="306" y="76" width="12" height="14" rx="2" fill={t.accent} />
      <line x1="168" y1="104" x2="240" y2="104" stroke="#585b70" strokeWidth="5" strokeLinecap="round" />
      <circle cx="404" cy="92" r="16" fill={t.soft} />
    </>
  ),

  // Esqueleto de página: blocos semânticos no lugar certo
  web: (t) => (
    <>
      <rect x="160" y="28" width="200" height="100" rx="12" fill={t.panel} stroke={t.primary} strokeWidth="3.5" />
      <rect x="160" y="28" width="200" height="20" rx="10" fill={t.soft} />
      <circle cx="174" cy="38" r="3.5" fill={t.primary} />
      <circle cx="186" cy="38" r="3.5" fill={t.secondary} />
      <rect x="172" y="56" width="176" height="16" rx="6" fill={t.primary} opacity="0.85" />
      <rect x="172" y="78" width="112" height="40" rx="8" fill={t.soft} stroke={t.secondary} strokeWidth="2.5" />
      <rect x="292" y="78" width="56" height="40" rx="8" fill={t.panel} stroke={t.accent} strokeWidth="2.5" />
      <g stroke={t.accent} strokeWidth="3.5" strokeLinecap="round">
        <line x1="302" y1="90" x2="338" y2="90" />
        <line x1="302" y1="100" x2="328" y2="100" />
      </g>
      <path d="M396 64 L412 76 L396 88" fill="none" stroke={t.primary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M124 64 L108 76 L124 88" fill="none" stroke={t.primary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </>
  ),

  // Pincel transformando o card: estrutura + estilo
  style: (t) => (
    <>
      <rect x="128" y="48" width="108" height="64" rx="12" fill={t.panel} stroke="#9aa3af" strokeWidth="3" strokeDasharray="6 6" />
      <line x1="144" y1="70" x2="220" y2="70" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <line x1="144" y1="88" x2="196" y2="88" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <path d="M252 76 H284 M276 69 L286 76 L276 83" fill="none" stroke={t.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="300" y="48" width="108" height="64" rx="12" fill={t.soft} stroke={t.primary} strokeWidth="4" />
      <line x1="316" y1="70" x2="392" y2="70" stroke={t.primary} strokeWidth="5" strokeLinecap="round" />
      <line x1="316" y1="88" x2="368" y2="88" stroke={t.secondary} strokeWidth="5" strokeLinecap="round" />
      <g transform="rotate(35 408 36)">
        <rect x="398" y="14" width="20" height="30" rx="5" fill={t.secondary} />
        <rect x="400" y="44" width="16" height="14" rx="3" fill={t.primary} />
      </g>
    </>
  ),

  // Tabela com filtro: linhas viram resposta
  data: (t) => (
    <>
      <rect x="150" y="34" width="190" height="88" rx="12" fill={t.panel} stroke={t.primary} strokeWidth="3.5" />
      <rect x="150" y="34" width="190" height="24" rx="10" fill={t.primary} />
      <g stroke="#10231A" strokeWidth="4" strokeLinecap="round">
        <line x1="164" y1="46" x2="196" y2="46" />
        <line x1="216" y1="46" x2="248" y2="46" />
        <line x1="268" y1="46" x2="300" y2="46" />
      </g>
      {[0, 1].map((i) => (
        <g key={i} stroke={t.soft} strokeWidth="5" strokeLinecap="round">
          <line x1="164" y1={72 + i * 18} x2="196" y2={72 + i * 18} />
          <line x1="216" y1={72 + i * 18} x2="248" y2={72 + i * 18} />
          <line x1="268" y1={72 + i * 18} x2="300" y2={72 + i * 18} />
        </g>
      ))}
      <rect x="156" y="100" width="178" height="16" rx="6" fill={t.soft} />
      <g stroke={t.accent} strokeWidth="5" strokeLinecap="round">
        <line x1="164" y1="108" x2="196" y2="108" />
        <line x1="216" y1="108" x2="248" y2="108" />
      </g>
      <path d="M372 44 L412 44 L398 68 L398 92 L386 86 L386 68 Z" fill={t.soft} stroke={t.secondary} strokeWidth="3.5" strokeLinejoin="round" />
    </>
  ),

  // Ramos que se encontram: trabalho em paralelo, integração no fim
  flow: (t) => (
    <>
      <path d="M120 96 H400" fill="none" stroke={t.secondary} strokeWidth="6" strokeLinecap="round" />
      <path d="M180 96 Q210 96 222 72 Q234 50 264 50 H312 Q342 50 354 72 Q366 96 392 96" fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round" />
      <circle cx="150" cy="96" r="10" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      <circle cx="264" cy="50" r="10" fill={t.panel} stroke={t.accent} strokeWidth="4" />
      <circle cx="312" cy="50" r="10" fill={t.panel} stroke={t.accent} strokeWidth="4" />
      <circle cx="260" cy="96" r="10" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      <circle cx="400" cy="96" r="12" fill={t.primary} />
      <path d="M395 96 L399 101 L406 91" fill="none" stroke="#10231A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // Balança: estratégias têm custos diferentes
  algorithm: (t) => (
    <>
      <line x1="260" y1="44" x2="260" y2="118" stroke={t.text} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <path d="M212 118 H308" stroke={t.text} strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <g transform="rotate(-8 260 48)">
        <line x1="176" y1="48" x2="344" y2="48" stroke={t.primary} strokeWidth="6" strokeLinecap="round" />
        <path d="M176 48 L160 78 H192 Z" fill={t.soft} stroke={t.primary} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M344 48 L328 78 H360 Z" fill={t.soft} stroke={t.primary} strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="166" y="58" width="12" height="12" rx="3" fill={t.secondary} />
        <rect x="180" y="58" width="12" height="12" rx="3" fill={t.secondary} />
        <rect x="338" y="58" width="12" height="12" rx="3" fill={t.accent} />
      </g>
      <circle cx="260" cy="44" r="8" fill={t.primary} />
    </>
  ),

  // Celular com blocos de interface nativos
  mobile: (t) => (
    <>
      <rect x="222" y="20" width="76" height="116" rx="16" fill={t.panel} stroke={t.primary} strokeWidth="4" />
      <rect x="232" y="34" width="56" height="14" rx="6" fill={t.primary} opacity="0.85" />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x="232" y={54 + i * 22} width="56" height="16" rx="6" fill={t.soft} />
          <circle cx={241} cy={62 + i * 22} r="4" fill={t.secondary} />
        </g>
      ))}
      <rect x="238" y="102" width="44" height="18" rx="9" fill={t.accent} />
      <line x1="252" y1="111" x2="268" y2="111" stroke="#10231A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="354" cy="56" r="16" fill={t.soft} stroke={t.secondary} strokeWidth="3" />
      <path d="M348 56 L353 61 L361 50" fill="none" stroke={t.secondary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="166" cy="92" r="14" fill={t.soft} />
    </>
  ),
};

interface ConceptDiagramProps {
  family: DiagramFamily;
  tone: VisualTone;
  concepts?: string[];
}

const ConceptDiagram = ({ family, tone, concepts }: ConceptDiagramProps) => (
  <>
    <div aria-hidden="true" className="mb-4 overflow-hidden rounded-xl">
      <svg viewBox="0 0 520 150" role="presentation" className="h-auto w-full">
        <rect width="520" height="150" rx="16" fill={tone.bg} />
        <circle cx="44" cy="116" r="24" fill={tone.soft} opacity="0.8" />
        <circle cx="478" cy="32" r="16" fill={tone.primary} opacity="0.14" />
        {SCENES[family](tone)}
      </svg>
    </div>
    {isStackConcept(concepts) && <Stack3DPanel tone={tone} />}
  </>
);

export default ConceptDiagram;
