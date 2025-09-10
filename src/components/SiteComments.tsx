import React, { useMemo, useState } from 'react';
import { Star, Send, MessageCircle } from 'lucide-react';
import { toPersianNumbers } from '../utils/persianNumbers';

interface CommentItem {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
}

interface SiteCommentsProps {
  initialComments?: CommentItem[];
}

const SiteComments: React.FC<SiteCommentsProps> = ({ initialComments = [] }) => {
  const defaultComments: CommentItem[] = [
    {
      id: 's1',
      name: 'رضا محمدی',
      rating: 5,
      message: 'ارسال سریع بود و بسته‌بندی خیلی تمیز. کیفیت ماگ‌ها عالیه، حتماً دوباره خرید می‌کنم.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: 's2',
      name: 'نگار کریمی',
      rating: 4,
      message: 'طرح‌ها خیلی خاص و قشنگن. فقط ای کاش تنوع رنگ‌ها بیشتر باشه.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    {
      id: 's3',
      name: 'حمید رضاپور',
      rating: 5,
      message: 'برای هدیه خریدم، خیلی خوششون اومد. قیمت نسبت به کیفیت کاملاً مناسبه.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8)
    }
  ];

  const [comments, setComments] = useState<CommentItem[]>(() => {
    const stored = localStorage.getItem('siteComments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CommentItem[];
        return parsed.map(c => ({ ...c, createdAt: new Date(c.createdAt) }));
      } catch (_) {}
    }
    if (initialComments && initialComments.length > 0) {
      return initialComments;
    }
    return defaultComments;
  });
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return Math.round((sum / comments.length) * 10) / 10;
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      rating,
      message: message.trim(),
      createdAt: new Date()
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('siteComments', JSON.stringify(updated));
    setName('');
    setRating(5);
    setMessage('');
  };

  return (
    <section className="mt-8 sm:mt-12" aria-labelledby="site-comments-title">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id="site-comments-title" className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageCircle className="h-5 w-5" />
            دیدگاه‌های کاربران درباره mug.myy
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{toPersianNumbers(averageRating.toString())} / ۵</span>
            <span className="text-gray-400">•</span>
            <span>{toPersianNumbers(comments.length.toString())} دیدگاه</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام شما"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {[5,4,3,2,1].map(r => {
                const stars = '⭐️'.repeat(r);
                return (
                  <option key={r} value={r}>{stars} ({toPersianNumbers(r.toString())})</option>
                );
              })}
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Send className="h-4 w-4" /> ارسال دیدگاه
            </button>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="نظر خود را درباره تجربه خرید و کیفیت محصولات بنویسید..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </form>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">{c.name}</div>
                  <div className="flex items-center gap-1 text-yellow-500" aria-label={`امتیاز ${c.rating}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < c.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-7">{c.message}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(c.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SiteComments;


