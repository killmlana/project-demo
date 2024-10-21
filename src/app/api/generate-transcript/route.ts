import { apiClient } from "@/server/client";
import {
  type GenerateQuestionResSchema,
  GenerateTranscriptReqSchema,
} from "@/server/schemas";
import type { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const parsedReq = GenerateTranscriptReqSchema.parse(req);

  const res = await apiClient.post<z.infer<typeof GenerateQuestionResSchema>>(
    "/generate-transcript",
    {
      ...parsedReq,
    },
  );

  return { data: res.data };
}
