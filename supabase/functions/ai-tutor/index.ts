// AI Tutor edge function — streams responses from the Lovable AI Gateway
// using lesson context so the tutor stays focused and pedagogical.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface LessonContext {
  courseTitle?: string;
  language?: string;
  lessonTitle?: string;
  description?: string;
  expectedOutput?: string;
  starterCode?: string;
  currentCode?: string;
  lastError?: string;
  theory?: string;
}

const buildSystemPrompt = (ctx: LessonContext) => {
  const ctxParts: string[] = [];
  if (ctx.courseTitle) ctxParts.push(`Curso: ${ctx.courseTitle}`);
  if (ctx.language) ctxParts.push(`Linguagem: ${ctx.language}`);
  if (ctx.lessonTitle) ctxParts.push(`Lição atual: ${ctx.lessonTitle}`);
  if (ctx.description) ctxParts.push(`Exercício:\n${ctx.description}`);
  if (ctx.theory) ctxParts.push(`Material teórico OFICIAL desta lição (use as MESMAS analogias, exemplos e termos daqui ao explicar):\n${ctx.theory}`);
  if (ctx.expectedOutput) ctxParts.push(`Saída esperada: ${ctx.expectedOutput}`);
  if (ctx.starterCode) ctxParts.push(`Código inicial:\n\`\`\`\n${ctx.starterCode}\n\`\`\``);
  if (ctx.currentCode) ctxParts.push(`Código atual do aluno:\n\`\`\`\n${ctx.currentCode}\n\`\`\``);
  if (ctx.lastError) ctxParts.push(`Última mensagem de erro: ${ctx.lastError}`);

  const contextBlock = ctxParts.length
    ? `\n\nContexto da aula:\n${ctxParts.join("\n\n")}`
    : "";

  return `Você é o "Professor IA" do CodeQuest, um tutor de programação amigável, paciente e socrático que responde sempre em português do Brasil.

Princípios pedagógicos OBRIGATÓRIOS:
1. NUNCA entregue a solução pronta de imediato. Faça perguntas que levem o aluno a pensar.
2. Dê pistas pequenas, uma de cada vez. Só revele a próxima após o aluno tentar.
3. Use analogias simples e exemplos curtos. Evite jargão desnecessário.
4. Se o aluno pedir explicitamente "me dá a resposta" duas vezes seguidas, aí sim mostre o código completo, mas explicando linha a linha.
5. Se o aluno perguntar algo fora do tema (ex: "qual a capital do Brasil"), redirecione gentilmente para a lição.
6. Use markdown: **negrito** para conceitos, blocos \`\`\` para código, listas para passos.
7. Respostas curtas (até ~150 palavras) salvo quando explicar passo a passo.
8. Quando houver "Material teórico OFICIAL" no contexto abaixo, USE EXATAMENTE as analogias, exemplos e termos de lá. Se o aluno usar outra palavra para o mesmo conceito, conecte-a gentilmente ao termo do material ("isso que você chamou de X, no nosso material chamamos de Y, vamos seguir com Y para alinhar").
9. Reforce conexões com seções da teoria (ex: "lembra da analogia do pote/etiqueta na seção 'Analogia do mundo real'?"). Faça o aluno reler a seção certa em vez de reexplicar tudo do zero.${contextBlock}`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const lessonContext: LessonContext = body?.lessonContext ?? {};

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildSystemPrompt(lessonContext);

    const upstream = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Aguarde alguns segundos e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (upstream.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos da IA esgotados. Adicione créditos em Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await upstream.text();
      console.error("AI gateway error:", upstream.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
