"use server";
import type { Pairs, Question } from "@/lib/entities/question";
import { apiClient } from "@/server/client";

type GenerateTranscriptRes = {
  id: string;
  transcript: string;
};
export const generateTranscript = async (videoUrl: string) => {
  const res = await apiClient.post<GenerateTranscriptRes>(
    "/generate-transcript",
    {
      url: videoUrl,
    },
  );
  return { data: res.data };
};

export type GenerateQuestionReq = {
  id: string;
  transcript?: string;
};

export type GenerateQuestionRes = {
  id: string;
  questions: Pairs<Question>;
};

export const generateQuestions = async (req: GenerateQuestionReq) => {
  const res = await apiClient.post<GenerateQuestionRes>("/generate-questions", {
    id: req.id,
  });
  return { data: res.data };
};
