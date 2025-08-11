import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { journalAPI, Journal } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Calendar, Tag, Trash2, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await journalAPI.getAll();
      setJournals(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load journals.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchJournals();
      return;
    }

    try {
      const response = await journalAPI.search(searchQuery);
      setJournals(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setJournals([]);
        toast({
          title: 'No results found',
          description: 'Try different search terms.',
        });
      } else {
        toast({
          title: 'Search failed',
          description: 'An error occurred while searching.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      await journalAPI.delete(id);
      setJournals(journals.filter(journal => journal._id !== id));
      toast({
        title: 'Deleted',
        description: 'Journal entry deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete journal entry.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your journals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your journaling journey
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search your journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="transition-all duration-300 focus:shadow-card"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/create">
            <Button className="shadow-elegant">
              <Plus className="mr-2 h-4 w-4" />
              New Journal
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                  <p className="text-2xl font-bold">{journals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Public Entries</p>
                  <p className="text-2xl font-bold">{journals.filter(j => j.isPublic).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Unique Tags</p>
                  <p className="text-2xl font-bold">
                    {[...new Set(journals.flatMap(j => j.tags))].length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Journal Grid */}
        {journals.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <Plus className="h-16 w-16 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No journals yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your journaling journey by creating your first entry.
              </p>
              <Link to="/create">
                <Button className="shadow-elegant">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Journal
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal) => (
              <Card key={journal._id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 mb-2">{journal.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {format(new Date(journal.createdAt), 'MMM dd, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/journal/${journal._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/edit/${journal._id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(journal._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {journal.image && (
                    <img
                      src={journal.image}
                      alt={journal.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {journal.summary || journal.content}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {journal.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {journal.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{journal.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={journal.isPublic ? "default" : "outline"} className="text-xs">
                      {journal.isPublic ? "Public" : "Private"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/journal/${journal._id}`)}
                    >
                      Read more
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;