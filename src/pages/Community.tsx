import { useMemo, useState } from 'react';

export default function Community() {
  const articles = [
    {
      id: 'g1',
      title: 'The Smart Pet Bowl: Nutrition That Really Works',
      category: 'nutrition',
      summary: 'Build a feeding plan that supports energy, digestion, and long-term health for your dog.',
      readTime: '5 min read',
      author: 'Maya Collins',
      organization: 'PAWSYNC editorial board',
      excerpt: 'A healthy dog starts with nutrient-rich food and steady routines that support everyday vitality.',
      story: 'Nutrition is one of the biggest daily decisions that shapes your pet’s health. It is not only about what goes into the bowl, but also when, how much, and how consistently that food supports energy, digestion, and long-term wellness.',
      content: [
        'Start with a feeding schedule that matches your dog’s age, size, and activity level. Puppies and smaller dogs often do better with smaller meals spread across the day, while larger adult dogs usually thrive with two balanced meals at steady times. A predictable routine helps regulate appetite and digestive comfort.',
        'Look for food that offers a good balance of protein, healthy fats, vitamins, and fiber. Real ingredients matter more than flashy labels, and the best diet is one your pet can digest happily without digestive upsets or sudden energy crashes.',
        'Treats should stay intentional rather than frequent. They work best as a reward, not as a regular replacement for meals. Keep fresh water available at all times and adjust portions gradually if your dog’s weight or energy changes unexpectedly.',
        'Healthy feeding is not perfection—it is consistency. Small habits like measuring food, tracking calories, and watching energy levels can make a significant difference over time.'
      ],
      highlights: ['Balanced meals', 'Clean water', 'Smart portions']
    },
    {
      id: 'g2',
      title: 'Gentle Grooming for Happy Cats',
      category: 'grooming',
      summary: 'Create a simple grooming routine that keeps your cat clean, calm, and comfortable.',
      readTime: '4 min read',
      author: 'Rhea Patel',
      organization: 'PetCare Journal',
      excerpt: 'A little grooming goes a long way in maintaining coat quality, skin health, and stress-free care.',
      story: 'Cats are naturally clean animals, but they still need support when it comes to brushing, ear checks, paw care, and keeping their coat healthy. Grooming is one of the easiest ways to improve comfort while also catching small issues early.',
      content: [
        'Regular brushing helps remove loose fur and reduce hairballs, especially for long-haired breeds. Even short-haired cats benefit from a quick brush session to keep skin healthy and remove dead hair before it gets trapped around the house.',
        'Check ears, paws, and eyes during grooming sessions for redness, dirt, or signs of irritation. Gentle cleaning with pet-safe products can help prevent problems before they become painful or persistent.',
        'Create a calming routine instead of forcing a long grooming experience. Soft handling, a relaxed voice, and a few treats can turn a necessary routine into an easier bonding moment between you and your cat.',
        'Healthy grooming is not just about appearance. It is also a practical habit for spotting discomfort, monitoring skin changes, and keeping your pet content each day.'
      ],
      highlights: ['Brush weekly', 'Check ears', 'Keep sessions calm']
    },
    {
      id: 'g3',
      title: 'Puppy Training That Feels Positive',
      category: 'training',
      summary: 'Use reward-based routines and short lessons to build confidence, manners, and trust.',
      readTime: '6 min read',
      author: 'Noah Bradley',
      organization: 'PawWise Academy',
      excerpt: 'The most successful puppy routines are short, encouraging, and built around consistency.',
      story: 'Training is less about strict correction and more about helping a puppy understand what feels right. Positive reinforcement works because it creates clear expectations while reinforcing trust and confidence.',
      content: [
        'Start with very short sessions—five to ten minutes is often enough for a puppy to focus without becoming overwhelmed. Repetition and patience matter more than intensity, especially in the early stages.',
        'Use rewards the puppy genuinely enjoys: a favorite snack, toy play, or enthusiastic praise. When the reward matches the behavior, your puppy learns faster and feels more confident in the process.',
        'A consistent daily rhythm matters just as much as the command itself. Potty breaks, meal times, play periods, and training moments all work better when they happen on a predictable schedule.',
        'The goal is not perfection overnight. It is steady progress that turns into reliable manners, calm habits, and a much happier home life for both pet and owner.'
      ],
      highlights: ['Reward behavior', 'Short sessions', 'Daily routine']
    },
    {
      id: 'g4',
      title: 'How to Keep Senior Pets Comfortable',
      category: 'care',
      summary: 'Give older pets the support, softness, and gentle movement they need to thrive.',
      readTime: '6 min read',
      author: 'Ivy Morgan',
      organization: 'Senior Pet Care Collective',
      excerpt: 'Older pets do best when their routines slow down a little and their comfort becomes a daily priority.',
      story: 'Senior pets need a different rhythm from younger animals. They may rest more often, move more carefully, and feel the day’s activity in a deeper way, which means comfort and consistency become especially important.',
      content: [
        'Create easy resting spots with supportive bedding and avoid placing food or water in hard-to-reach places. Small changes in the environment can dramatically reduce strain on tired joints or older paws.',
        'Keep movement gentle but regular. Short walks, slow play, and a little stretching can help maintain mobility without overloading sore muscles or joints.',
        'Senior pets often need smaller, easier-to-digest meals and extra attention to hydration. Monitoring weight, appetite, and energy makes it easier to catch small changes early before they become bigger concerns.',
        'The best senior care is calm, observant, and consistent. It gives older pets more comfort while helping them stay connected and steady throughout their later years.'
      ],
      highlights: ['Soft bedding', 'Gentle movement', 'Hydration']
    },
    {
      id: 'g5',
      title: 'Dog Walk Safety Tips for Every Season',
      category: 'wellness',
      summary: 'Plan safer walks with weather awareness, hydration, and better leash habits.',
      readTime: '5 min read',
      author: 'Aidan Foster',
      organization: 'Urban Dog Club',
      excerpt: 'Good walks are about comfort, safety, and building a healthy routine rather than just covering distance.',
      story: 'Walks should feel energizing for both you and your dog, not stressful. When you plan with safety in mind, the outing shifts from a basic routine into a balanced and enjoyable part of the day.',
      content: [
        'Check the weather before heading outside. Hot pavement, intense humidity, and sudden rain can affect your dog’s comfort, especially for short-nosed breeds or pets with thick coats.',
        'Use a secure leash and keep identification tags current. A dog that feels safe and predictable is easier to manage, calmer in new spaces, and better prepared for busy streets or unfamiliar routes.',
        'Carry a small water bottle, especially on longer walks, and set a pace your dog can handle comfortably. A few rest breaks often make the outing healthier and more enjoyable for both of you.',
        'A great walk allows your pet to explore without becoming overwhelmed. The best routes are familiar, calm, and realistic enough to preserve your dog’s confidence and comfort.'
      ],
      highlights: ['Hydration', 'Leash safety', 'Weather awareness']
    },
    {
      id: 'g6',
      title: 'Simple Enrichment Ideas for Curious Pets',
      category: 'behavior',
      summary: 'Improve mood, focus, and confidence with smart home enrichment ideas.',
      readTime: '5 min read',
      author: 'Lena Brooks',
      organization: 'Happy Tails Studio',
      excerpt: 'Mental stimulation is just as important as physical activity for many pets, especially when life feels repetitive.',
      story: 'Boredom can show up in subtle ways—repetitive barking, over-grooming, restless pacing, or excessive attention-seeking. Enrichment keeps the mind engaged and can make daily life feel calmer and more satisfying for pets.',
      content: [
        'Interactive toys and puzzle feeders are a fantastic way to turn everyday feeding into a small challenge. They create excitement without needing a full training session or a huge amount of time.',
        'Scent games are especially useful for curious pets. Hiding treats, rotating toys, or creating a simple scent trail lets your pet explore in a way that feels rewarding and engaged.',
        'Even a few minutes of stimulation each day can reduce boredom and sharpen focus. A pet that has regular opportunities to think, sniff, and investigate usually feels more settled and balanced.',
        'The best enrichment is not complicated. It is thoughtful, regular, and adapted to the personality of the pet in front of you.'
      ],
      highlights: ['Puzzle toys', 'Scent games', 'Daily stimulation']
    }
  ];

  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0].id);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  const selectedArticle = useMemo(
    () => articles.find(article => article.id === selectedArticleId) || articles[0],
    [selectedArticleId]
  );

  const openArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsArticleOpen(true);
  };

  const funFacts = [
    'Dogs can recognize human emotions from facial expressions and voice tone.',
    'Cats have five toes on their front paws and usually four on the back, helping with soft landings.',
    'A dog’s nose print is as unique as a human fingerprint.',
    'Cats spend a large part of the day grooming themselves because it helps regulate body temperature and reduce stress.',
    'Many dogs can learn hand signals faster than spoken commands when trained consistently.',
    'Pets often benefit from routine-based care because predictable schedules reduce anxiety.'
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Community and Guides</h1>
        <p>Educational content, pet care guides, and interesting facts</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">Pet Facts & Insights</h2>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {funFacts.map((fact, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0.9rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7dd3fc, #a78bfa)', color: '#111827', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                {index + 1}
              </span>
              <p style={{ margin: 0, color: 'var(--text-primary)' }}>{fact}</p>
            </div>
          ))}
        </div>
      </div>

      {isArticleOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.68)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000
          }}
          onClick={() => setIsArticleOpen(false)}
        >
          <div
            className="card"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(960px, 100%)',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(148,163,184,0.25)',
              borderRadius: '1rem',
              boxShadow: '0 25px 70px rgba(15, 23, 42, 0.35)'
            }}
          >
            <div className="card-header" style={{ alignItems: 'flex-start', paddingBottom: '1rem' }}>
              <div>
                <h2 className="card-title" style={{ marginBottom: '0.3rem', fontSize: '2rem' }}>{selectedArticle.title}</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  By {selectedArticle.author} • {selectedArticle.organization} • {selectedArticle.readTime}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-info">{selectedArticle.category}</span>
                <button type="button" className="btn btn-secondary" onClick={() => setIsArticleOpen(false)}>
                  Close
                </button>
              </div>
            </div>

            <div style={{ padding: '0.5rem 0 0' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(125,211,252,0.12), rgba(167,139,250,0.12))',
                  borderRadius: '0.9rem',
                  padding: '1.2rem',
                  marginBottom: '1.2rem',
                  border: '1px solid rgba(125,211,252,0.2)'
                }}
              >
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.08rem', lineHeight: 1.8 }}>{selectedArticle.story}</p>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem' }}>{selectedArticle.excerpt}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.4rem' }}>
                {selectedArticle.highlights.map((item) => (
                  <span key={item} className="badge badge-success" style={{ margin: 0 }}>{item}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index} style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.9, fontSize: '1rem' }}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {articles.map(article => (
          <div
            key={article.id}
            style={{
              background: article.id === selectedArticle.id ? 'rgba(96, 165, 250, 0.08)' : 'var(--card-bg, #fff)',
              border: article.id === selectedArticle.id ? '1px solid rgba(96, 165, 250, 0.7)' : '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem' }}>{article.title}</h3>
                <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  By {article.author} • {article.organization}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openArticle(article.id)}
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                Explore
              </button>
            </div>

            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>{article.category}</span>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{article.summary}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>{article.readTime}</span>
              <span>{article.id === selectedArticle.id ? 'Open now' : 'Preview'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
