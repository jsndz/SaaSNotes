'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Note } from '@/types';
import { apiClient } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trash2, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NoteDetailPage() {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  useEffect(() => {
    loadNote();
  }, [noteId]);

  useEffect(() => {
    if (note) {
      const titleChanged = title !== note.title;
      const contentChanged = content !== note.content;
      setHasChanges(titleChanged || contentChanged);
    }
  }, [title, content, note]);

  const loadNote = async () => {
    try {
      const noteData = await apiClient.getNote(noteId);
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
    } catch (error) {
      console.error('Failed to load note:', error);
      router.push('/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note || !title.trim()) return;
    
    setIsSaving(true);
    try {
      const updatedNote = await apiClient.updateNote(note.id, { title, content });
      setNote(updatedNote);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      await apiClient.deleteNote(note.id);
      router.push('/notes');
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    router.push('/notes');
  };

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (!note) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Note not found</h2>
              <p className="mt-2 text-gray-600">The note you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/notes')} className="mt-4">
                Back to Notes
              </Button>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {content.length} characters
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!title.trim() || !hasChanges || isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Content</label>
                  <Textarea
                    placeholder="Start writing your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                    <span>{content.length} characters</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}