import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';
import type { ApkApp } from '../types/index.ts';

interface ReviewModalProps {
  app: ApkApp;
  onClose: () => void;
  onReviewSubmitted: (updatedApp: ApkApp) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  app, 
  onClose, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback about your experience with this APK.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/apps/${app.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          userName: userName.trim() || 'Verified Android User',
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onReviewSubmitted(data.app);
        onClose();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200/90 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Write a Review</h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">{app.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-semibold text-slate-700">Your Rating</label>
            <div className="flex justify-center items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-amber-600 font-bold">
              {rating === 5 ? 'Exceptional 5/5' : rating === 4 ? 'Very Good 4/5' : rating === 3 ? 'Average 3/5' : rating === 2 ? 'Needs Work 2/5' : 'Poor 1/5'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name (optional)</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex or Galaxy S24 User"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback & Experience</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other users how this APK performs on your Android device..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00875a]"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#00875a] hover:bg-[#00744e] text-white text-xs font-bold rounded-full shadow-xs disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
