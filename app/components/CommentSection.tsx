"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  Edit2, 
  Trash2, 
  User,
  Clock
} from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface CommentSectionProps {
  updateId?: string;
  photoId?: string;
  outfitId?: string;
  messageId?: string;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentSection({ 
  updateId, 
  photoId, 
  outfitId, 
  messageId, 
  onCommentCountChange 
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (updateId) params.append('updateId', updateId);
      if (photoId) params.append('photoId', photoId);
      if (outfitId) params.append('outfitId', outfitId);
      if (messageId) params.append('messageId', messageId);

      const response = await fetch(`/api/comments?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        onCommentCountChange?.(data.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [updateId, photoId, outfitId, messageId, onCommentCountChange]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          updateId,
          photoId,
          outfitId,
          messageId,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [newCommentData, ...prev]);
        setNewComment("");
        onCommentCountChange?.(comments.length + 1);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId ? updatedComment : comment
          )
        );
        setEditingComment(null);
        setEditContent("");
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        onCommentCountChange?.(comments.length - 1);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Start editing
  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent("");
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-gold transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Comment Form */}
            {session?.user && (
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-uganda-gold flex items-center justify-center flex-shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <User className={`h-4 w-4 text-uganda-black ${session.user.image ? 'hidden' : ''}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-muted rounded-lg bg-background text-foreground placeholder-muted-foreground focus:border-uganda-gold focus:ring-2 focus:ring-uganda-gold/20 transition-all resize-none"
                      rows={3}
                      disabled={submitting}
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="flex items-center space-x-2 bg-uganda-gold text-uganda-black px-4 py-2 rounded-lg font-medium hover:bg-warm-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-uganda-black"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-uganda-gold flex items-center justify-center flex-shrink-0">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name || 'User'}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <User className={`h-4 w-4 text-uganda-black ${comment.user.image ? 'hidden' : ''}`} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {comment.user.name || comment.user.email}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                        
                        {session?.user?.id === comment.user.id && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => startEditing(comment)}
                              className="p-1 text-muted-foreground hover:text-uganda-gold transition-colors"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-muted-foreground hover:text-uganda-red transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border border-muted rounded bg-background text-foreground focus:border-uganda-gold focus:ring-2 focus:ring-uganda-gold/20 transition-all resize-none"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="px-3 py-1 bg-uganda-gold text-uganda-black rounded text-sm font-medium hover:bg-warm-gold transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 border border-muted text-muted-foreground rounded text-sm font-medium hover:bg-muted transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground">{comment.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
