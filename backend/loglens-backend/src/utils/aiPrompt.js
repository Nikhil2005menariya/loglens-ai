exports.buildDebugPrompt = ({ parsedLog, matchedFiles }) => {
  return `
You are a senior backend engineer debugging a Node.js application.

ERROR DETAILS:
Type: ${parsedLog.errorType}
Message: ${parsedLog.message}
Location:
${parsedLog.files.map(f => `- ${f.filePath}:${f.line}`).join("\n")}

CODE CONTEXT:
${matchedFiles.map(
  f => `FILE: ${f.filePath}\n${f.snippet}`
).join("\n\n")}

TASK:
1. Identify the root cause.
2. Explain why the error occurs.
3. Provide a CLEAR, ACTIONABLE FIX as plain text.
4. Provide a PR checklist.
5. Give a confidence score between 0 and 1.

IMPORTANT RULES:
- "fix" MUST ALWAYS be present.
- If an exact code change is not possible, describe manual steps.
- DO NOT omit any field.

Respond ONLY in valid JSON with EXACT keys:
{
  "rootCause": string,
  "explanation": string,
  "fix": string,
  "checklist": string[],
  "confidence": number
}
`;
};
