import { z } from "zod";

export const GenerateTranscriptReqSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine((val) => {
      try {
        const parsedUrl = new URL(val);
        const hostname = parsedUrl.hostname.toLowerCase();

        return (
          hostname === "www.youtube.com" ||
          hostname === "youtube.com" ||
          hostname === "youtu.be" ||
          hostname.endsWith(".youtube.com")
        );
      } catch (all) {
        return false;
      }
    }, "Please enter a valid YouTube URL"),
});

export const GenerateTranscriptResSchema = z.object({
  id: z.string(),
  transcript: z.string(),
});

export const GenerateQuestionReqSchema = z.object({
  id: z.string(),
  transcript: z.string().optional(),
});

export const QuestionSchema = z.object({
  question: z.string(),
  topic: z.string(),
});

export const PairsSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    pairs: z.array(itemSchema),
  });

export const GenerateQuestionResSchema = z.object({
  id: z.string(),
  questions: PairsSchema(QuestionSchema),
});
