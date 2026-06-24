// lib/agents/improvePromptGraph.ts

import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
});

const GraphState = Annotation.Root({
    prompt: Annotation<string>(),
    inputs: Annotation<string[]>(),
    expectedOutputs: Annotation<string[]>(),
    actualOutputs: Annotation<string[]>(),
    judgeScores: Annotation<number[]>(),
    judgeReasoning: Annotation<string[]>(),

    failureAnalysis: Annotation<string>(),
    improvedPrompt: Annotation<string>(),
    newTestCases: Annotation<string[]>(),
    recommendation: Annotation<string>(),
});

async function analyzeFailures(state: typeof GraphState.State) {
    const response = await model.invoke(`
You are a failure analysis agent.

Given this prompt:
${state.prompt}

Inputs:
${JSON.stringify(state.inputs)}

Expected outputs:
${JSON.stringify(state.expectedOutputs)}

Actual outputs:
${JSON.stringify(state.actualOutputs)}

Judge scores:
${JSON.stringify(state.judgeScores)}

Judge reasoning:
${JSON.stringify(state.judgeReasoning)}

Identify the main failure patterns.
`);

    return {
        failureAnalysis: response.content.toString(),
    };
}

async function improvePrompt(state: typeof GraphState.State) {
    const response = await model.invoke(`
You are a prompt engineering agent.

Original prompt:
${state.prompt}

Failure analysis:
${state.failureAnalysis}

Rewrite the prompt to address the failures.
Return only the improved prompt.
`);

    return {
        improvedPrompt: response.content.toString(),
    };
}

async function generateTests(state: typeof GraphState.State) {
    const response = await model.invoke(`
You are a test generation agent.

Original prompt:
${state.prompt}

Failure analysis:
${state.failureAnalysis}

Generate 5 new adversarial test inputs.
Return them as a numbered list.
`);

    return {
        newTestCases: response.content
            .toString()
            .split("\n")
            .filter(Boolean),
    };
}

async function recommend(state: typeof GraphState.State) {
    const response = await model.invoke(`
Summarize:
1. What failed
2. How the new prompt fixes it
3. What the user should do next

Failure analysis:
${state.failureAnalysis}

Improved prompt:
${state.improvedPrompt}

New tests:
${JSON.stringify(state.newTestCases)}
`);

    return {
        recommendation: response.content.toString(),
    };
}

export const improvePromptGraph = new StateGraph(GraphState)
    .addNode("analyzeFailures", analyzeFailures)
    .addNode("improvePrompt", improvePrompt)
    .addNode("generateTests", generateTests)
    .addNode("recommend", recommend)
    .addEdge(START, "analyzeFailures")
    .addEdge("analyzeFailures", "improvePrompt")
    .addEdge("improvePrompt", "generateTests")
    .addEdge("generateTests", "recommend")
    .addEdge("recommend", END)
    .compile();