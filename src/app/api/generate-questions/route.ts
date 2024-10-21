import { apiClient } from "@/server/client";
import { GenerateQuestionReqSchema } from "@/server/schemas";
import { NextResponse } from "next/server";
import type { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const parsedReq = GenerateQuestionReqSchema.parse(req);

  const res = await apiClient.post<z.infer<typeof GenerateQuestionReqSchema>>(
    "/generate-questions",
    { ...parsedReq },
  );

  return NextResponse.json({ data: res.data });
}
