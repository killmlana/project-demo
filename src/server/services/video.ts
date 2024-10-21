import axios from "axios";
import type { z } from "zod";
import type {
  GenerateQuestionReqSchema,
  GenerateQuestionResSchema,
  GenerateTranscriptReqSchema,
  GenerateTranscriptResSchema,
} from "../schemas";

export const generateQuestions = async (
  req: z.infer<typeof GenerateQuestionReqSchema>,
) => {
  const res = await axios.post<{
    data: z.infer<typeof GenerateQuestionResSchema>;
  }>("/generate-questions", {
    ...req,
  });

  return { data: res.data.data };
};

export const generateTranscript = async (
  req: z.infer<typeof GenerateTranscriptReqSchema>,
) => {
  const res = await axios.post<{
    data: z.infer<typeof GenerateTranscriptResSchema>;
  }>("/generate-transcript", {
    ...req,
  });

  return { data: res.data.data };
};
