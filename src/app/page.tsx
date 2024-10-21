"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Loader2,
  Youtube,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { generateQuestions, generateTranscript } from "@/server/services/video";
import { GenerateTranscriptReqSchema } from "@/server/schemas";

const fetchQuestions = async (url: string): Promise<string[]> => {
  const {
    data: { id, transcript },
  } = await generateTranscript({ url });

  const {
    data: { questions },
  } = await generateQuestions({
    id,
    transcript,
  });

  const fetchedQuestions = questions.pairs.map((pair) => pair.question);

  return fetchedQuestions;
};

const answerSchema = z.object({
  answer: z.string().min(1, "Please fill in the answer 🥺."),
});

export const runtime = "edge";

const Page = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const linkForm = useForm<z.infer<typeof GenerateTranscriptReqSchema>>({
    resolver: zodResolver(GenerateTranscriptReqSchema),
    defaultValues: {
      url: "",
    },
  });

  const answerForm = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const onSubmitLink = async (
    values: z.infer<typeof GenerateTranscriptReqSchema>,
  ) => {
    setIsLoading(true);
    try {
      const fetchedQuestions = await fetchQuestions(values.url);
      setQuestions(fetchedQuestions);
      setAnswers(new Array(fetchedQuestions.length).fill(""));
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error(error); // Use console.error instead of console.log
      linkForm.setError("url", {
        message: "Something went wrong 😟",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAnswer = (values: z.infer<typeof answerSchema>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = values.answer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      answerForm.reset();
    } else {
      // Handle completion (e.g., submit answers)
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      answerForm.setValue("answer", answers[currentQuestionIndex - 1]!);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg border-t-4 border-indigo-500 shadow-lg">
        <CardHeader className="bg-white">
          <CardTitle className="inline-block bg-gradient-to-r from-indigo-200 via-indigo-500 to-indigo-700 bg-clip-text text-center text-3xl font-bold text-transparent">
            The Jungle Of Rights Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          {questions.length === 0 ? (
            <Form {...linkForm}>
              <form
                onSubmit={linkForm.handleSubmit(onSubmitLink)}
                className="space-y-6"
              >
                <FormField
                  control={linkForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Paste your YouTube link here"
                            {...field}
                            disabled={isLoading}
                            className="rounded-md border-2 border-indigo-200 py-2 pl-10 pr-4 text-base focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 transform text-indigo-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-base font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start Learning
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <Progress
                value={((currentQuestionIndex + 1) / questions.length) * 100}
                className="h-2 w-full rounded-full bg-indigo-100"
              />
              <div className="rounded-md bg-indigo-50 p-6 shadow-inner">
                <h3 className="mb-4 text-xl font-semibold text-indigo-800">
                  {questions[currentQuestionIndex]}
                </h3>
                <Form {...answerForm}>
                  <form
                    onSubmit={answerForm.handleSubmit(onSubmitAnswer)}
                    className="space-y-4"
                  >
                    <FormField
                      control={answerForm.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Type your answer here"
                              {...field}
                              className="rounded-md border-2 border-indigo-200 p-2 text-base focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                          </FormControl>
                          <FormMessage className="text-center text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-300"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        className="flex items-center rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Finish"
                          : "Next"}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
