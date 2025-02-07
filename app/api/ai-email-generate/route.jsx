import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  try {
    const result = await GenerateEmailTemplateAIModel.sendMessage(prompt);
    const aiResp = result.response.text();
    console.log(aiResp);
    return NextResponse(aiResp);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
  return NextResponse.json();
}
