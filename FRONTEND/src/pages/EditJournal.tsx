import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { journalAPI, Journal } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const journalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().optional(),
  tags: z.string(),
  isPublic: z.boolean(),
  image: z.string().url().optional().or(z.literal('')),
});

type JournalFormData = z.infer<typeof journalSchema>;

const EditJournal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJournal, setIsLoadingJournal] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      tags: '',
      isPublic: false,
      image: '',
    },
  });

  useEffect(() => {
    if (id) {
      fetchJournal(id);
    }
  }, [id]);

  const fetchJournal = async (journalId: string) => {
    try {
      const response = await journalAPI.getById(journalId);
      const journal = response.data;
      setJournal(journal);
      
      // Update form with journal data
      form.reset({
        title: journal.title,
        content: journal.content,
        summary: journal.summary || '',
        tags: journal.tags.join(', '),
        isPublic: journal.isPublic,
        image: journal.image || '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load journal entry.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setIsLoadingJournal(false);
    }
  };

  const onSubmit = async (data: JournalFormData) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const journalData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        image: data.image || undefined,
      };
      
      const response = await journalAPI.update(id, journalData);
      toast({
        title: 'Journal updated!',
        description: 'Your journal entry has been updated successfully.',
      });
      navigate(`/journal/${id}`);
    } catch (error: any) {
      toast({
        title: 'Failed to update journal',
        description: error.response?.data?.message || 'An error occurred while updating your journal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingJournal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Journal not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/journal/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Journal</h1>
              <p className="text-muted-foreground">
                Update your journal entry
              </p>
            </div>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <CardTitle>Edit "{journal.title}"</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your journal entry a title..."
                            {...field}
                            className="text-lg transition-all duration-300 focus:shadow-card"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your thoughts here..."
                            className="min-h-[300px] resize-none transition-all duration-300 focus:shadow-card"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="A brief summary of your entry..."
                            {...field}
                            className="transition-all duration-300 focus:shadow-card"
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown as a preview in your journal list
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add tags separated by commas (e.g., personal, travel, work)"
                            {...field}
                            className="transition-all duration-300 focus:shadow-card"
                          />
                        </FormControl>
                        <FormDescription>
                          Tags help you organize and find your journal entries later
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            className="transition-all duration-300 focus:shadow-card"
                          />
                        </FormControl>
                        <FormDescription>
                          Add an image to accompany your journal entry
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Make this entry public
                          </FormLabel>
                          <FormDescription>
                            Allow others to view this journal entry
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/journal/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="shadow-elegant"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Update Journal
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditJournal;