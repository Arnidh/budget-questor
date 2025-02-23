
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Send } from "lucide-react";

const Advisor = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{ question: string; answer: string }[]>([]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-advice', {
        body: { question: question.trim() },
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message);
      }

      if (!data || !data.advice) {
        console.error('Invalid response:', data);
        throw new Error('Invalid response from AI advisor');
      }

      setConversation(prev => [...prev, { question, answer: data.advice }]);
      setQuestion("");
    } catch (error: any) {
      console.error('Error details:', error);
      toast.error(error.message || "Failed to get advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Advisor</h1>

        <Card>
          <CardHeader>
            <CardTitle>Ask for Financial Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {conversation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg">
                      {item.question}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start justify-end">
                    <div className="bg-muted px-3 py-2 rounded-lg">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a financial question..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Advisor;
