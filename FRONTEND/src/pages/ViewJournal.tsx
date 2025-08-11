import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { journalAPI, Journal } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Calendar, Tag, Eye, Lock } from 'lucide-react';
import { format } from 'date-fns';

const ViewJournal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchJournal(id);
    }
  }, [id]);

  const fetchJournal = async (journalId: string) => {
    try {
      const response = await journalAPI.getById(journalId);
      setJournal(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load journal entry.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate(`/edit/${journal._id}`)}
              className="shadow-elegant"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Journal
            </Button>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-4">
                    {journal.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(journal.createdAt), 'MMMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      {journal.isPublic ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Private
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={journal.isPublic ? "default" : "outline"}
                  className="ml-4"
                >
                  {journal.isPublic ? "Public" : "Private"}
                </Badge>
              </div>

              {journal.summary && (
                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-lg italic text-muted-foreground">
                    {journal.summary}
                  </p>
                </div>
              )}

              {journal.tags && journal.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {journal.image && (
                <div className="w-full">
                  <img
                    src={journal.image}
                    alt={journal.title}
                    className="w-full max-h-96 object-cover rounded-lg shadow-card"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {journal.content}
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Created: {format(new Date(journal.createdAt), 'PPpp')}
                  </div>
                  {journal.updatedAt !== journal.createdAt && (
                    <div>
                      Last updated: {format(new Date(journal.updatedAt), 'PPpp')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewJournal;