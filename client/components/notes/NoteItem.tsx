'use client';

import { Note } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/notes/${note.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="pb-3" onClick={handleEdit}>
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {note.title || 'Untitled Note'}
          </h3>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent onClick={handleEdit}>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {note.content || 'No content yet...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {note.content ? `${note.content.length} chars` : '0 chars'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}