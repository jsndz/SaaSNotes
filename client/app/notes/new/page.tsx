'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      const note = await apiClient.createNote({ title, content });
      router.push(`/notes/${note.id}`);
    } catch (error: any) {
      console.error('Failed to create note:', error);
      
      // Check if it's a free plan limit error
      if (error.isFreePlanLimit) {
        setShowUpgradeModal(true);
      } else {
        alert('Failed to create note. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/notes');
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={handleCancel}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
                  <p className="text-sm text-gray-600">Write your thoughts and ideas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!title.trim() || isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Note'}
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
                  <div className="text-xs text-gray-500 text-right">
                    {content.length} characters
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </div>
    </RequireAuth>
  );
}