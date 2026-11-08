import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Ban,
  BadgeCheck,
  Bell,
  Bookmark,
  Briefcase,
  Bus,
  Check,
  Ellipsis,
  EyeOff,
  Flag,
  GraduationCap,
  Heart,
  KeyRound,
  Lightbulb,
  LifeBuoy,
  Lock,
  Megaphone,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import './Community.css';
import {
  CIRCLES,
  INITIAL_FRIEND_IDS,
  INITIAL_POSTS,
  INITIAL_REQUESTS,
  KINDS,
  LABELS,
  PEOPLE,
} from './communityData.js';

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const LABEL_META = {
  Harassment: { Icon: Megaphone, tone: 'lav' },
  'Public safety': { Icon: ShieldCheck, tone: 'sage' },
  'Facility issues': { Icon: Lightbulb, tone: 'butter' },
  Workplace: { Icon: Briefcase, tone: 'blush' },
  Housing: { Icon: KeyRound, tone: 'teal' },
  Transit: { Icon: Bus, tone: 'sky' },
};

const CIRCLE_ICONS = {
  'Night commuters': Moon,
  Renters: KeyRound,
  Workplace: Briefcase,
  Campus: GraduationCap,
};

const TABS = ['For you', 'Friends', 'Questions', 'Advice'];

// Words that suggest someone may need help right now.
const URGENT_PATTERN =
  /(following me|followed me|right now|help me|being chased|in danger|attacked|won't leave|waiting outside|scared for)/i;

const currentTime = () => Date.now();

function timeAgo(timestamp) {
  const minutes = Math.floor((currentTime() - timestamp) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/**
 * Decides how an author appears to the viewer.
 * - Your own content: "You"
 * - A friend who chose to show their name: their real name, avatar lit up
 * - Everyone else: "Anonymous"
 */
function describeAuthor(authorId, anonymous, friendIds) {
  if (authorId === 'me') {
    return {
      name: 'You',
      hint: anonymous ? 'Nobody sees your name' : 'Friends see your name',
      state: 'me',
    };
  }
  if (friendIds.has(authorId) && !anonymous) {
    return { name: PEOPLE[authorId].name, state: 'lit' };
  }
  return { name: 'Anonymous', state: 'dim' };
}

/* ------------------------------------------------------------------ */
/* Avatar: dim glow = anonymous, bright glow = a friend you know       */
/* ------------------------------------------------------------------ */

function Avatar({ name, state, size = 'md' }) {
  const initial = state === 'lit' || state === 'me' ? name.charAt(0) : '';
  return (
    <span className={`cm-avatar cm-avatar-${state} cm-avatar-${size}`} aria-hidden="true">
      {state === 'dim' ? <Moon size={size === 'sm' ? 13 : 17} /> : initial}
    </span>
  );
}

function LabelTag({ label }) {
  const meta = LABEL_META[label];
  if (!meta) return null;
  const { Icon, tone } = meta;
  return (
    <span className={`cm-tag cm-tag-${tone}`}>
      <Icon size={13} aria-hidden="true" />
      {label} hotspot
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Composer                                                            */
/* ------------------------------------------------------------------ */

function Composer({ onPost, onNavigate }) {
  const [text, setText] = useState('');
  const [kind, setKind] = useState('Experience');
  const [label, setLabel] = useState('');
  const [circle, setCircle] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [addWarning, setAddWarning] = useState(false);
  const [warning, setWarning] = useState('');

  const urgent = URGENT_PATTERN.test(text);
  const canPost = text.trim().length > 0;

  function submit() {
    if (!canPost) return;
    onPost({
      text: text.trim(),
      kind,
      label: label || null,
      circle: circle || null,
      anonymous,
      contentWarning: addWarning ? warning.trim() || 'Sensitive content' : null,
      urgent,
    });
    setText('');
    setLabel('');
    setCircle('');
    setAddWarning(false);
    setWarning('');
    setKind('Experience');
    // The anonymous setting stays as it was. It never silently flips to public.
  }

  return (
    <section className="cm-composer" aria-label="Create a post">
      {urgent && (
        <div className="cm-urgent" role="alert">
          <TriangleAlert size={20} aria-hidden="true" />
          <div>
            <strong>If you are in danger right now, call 911.</strong>
            <p>Firefly Chat can walk you through what to do next, one step at a time.</p>
          </div>
          <div className="cm-urgent-actions">
            <a className="cm-btn cm-btn-alert" href="tel:911">
              <Phone size={16} aria-hidden="true" /> Call 911
            </a>
            <button type="button" className="cm-btn cm-btn-ghost" onClick={() => onNavigate('Firefly Chat')}>
              Open Firefly Chat
            </button>
          </div>
        </div>
      )}

      <label htmlFor="cm-composer-text" className="cm-visually-hidden">
        Share an experience or ask a question
      </label>
      <textarea
        id="cm-composer-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share an experience or ask a question"
        rows={3}
        maxLength={1000}
      />

      <div className="cm-kind-row" role="radiogroup" aria-label="Post type">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            className={kind === k ? 'cm-chip is-on' : 'cm-chip'}
            onClick={() => setKind(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="cm-composer-fields">
        <label className="cm-select">
          <span>Label</span>
          <select value={label} onChange={(e) => setLabel(e.target.value)}>
            <option value="">None</option>
            {LABELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="cm-select">
          <span>Circle</span>
          <select value={circle} onChange={(e) => setCircle(e.target.value)}>
            <option value="">None</option>
            {CIRCLES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="cm-check">
          <input type="checkbox" checked={addWarning} onChange={(e) => setAddWarning(e.target.checked)} />
          <span>Add content warning</span>
        </label>
      </div>

      {addWarning && (
        <input
          className="cm-warning-input"
          type="text"
          value={warning}
          onChange={(e) => setWarning(e.target.value)}
          placeholder="What should people know first? For example: mentions stalking"
          maxLength={60}
          aria-label="Content warning text"
        />
      )}

      <div className="cm-composer-bottom">
        <button
          type="button"
          role="switch"
          aria-checked={anonymous}
          className={anonymous ? 'cm-switch is-on' : 'cm-switch'}
          onClick={() => setAnonymous((a) => !a)}
        >
          <span className="cm-switch-track">
            <span className="cm-switch-thumb" />
          </span>
          <span className="cm-switch-text">
            <strong>Post anonymously</strong>
            <small>
              {anonymous
                ? 'Nobody sees your name, not even friends.'
                : 'Friends see your name. Everyone else sees Anonymous.'}
            </small>
          </span>
        </button>

        <button type="button" className="cm-btn cm-btn-primary" onClick={submit} disabled={!canPost}>
          Post
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Post menu: report, hide, block (delete for your own posts)          */
/* ------------------------------------------------------------------ */

function PostMenu({ isMine, reported, onReport, onHide, onBlock, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape') return;
      if (e.type === 'mousedown' && ref.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const run = (fn) => () => {
    setOpen(false);
    fn();
  };

  return (
    <div className="cm-menu" ref={ref}>
      <button
        type="button"
        className="cm-icon-btn"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Ellipsis size={20} />
      </button>
      {open && (
        <div className="cm-menu-list" role="menu">
          {isMine ? (
            <button type="button" role="menuitem" onClick={run(onDelete)}>
              <Trash2 size={16} aria-hidden="true" /> Delete post
            </button>
          ) : (
            <>
              <button type="button" role="menuitem" onClick={run(onReport)} disabled={reported}>
                <Flag size={16} aria-hidden="true" /> {reported ? 'Reported' : 'Report post'}
              </button>
              <button type="button" role="menuitem" onClick={run(onHide)}>
                <EyeOff size={16} aria-hidden="true" /> Hide this post
              </button>
              <button type="button" role="menuitem" onClick={run(onBlock)}>
                <Ban size={16} aria-hidden="true" /> Block this person
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comments (anonymous by default, same name rules as posts)           */
/* ------------------------------------------------------------------ */

function Comments({ post, friendIds, onAdd }) {
  const [draft, setDraft] = useState('');

  function send() {
    if (!draft.trim()) return;
    onAdd(post.id, draft.trim());
    setDraft('');
  }

  return (
    <div className="cm-comments">
      {post.comments.length === 0 && (
        <p className="cm-comments-empty">No replies yet. Your reply will show as Anonymous.</p>
      )}
      <ul>
        {post.comments.map((c) => {
          const who = describeAuthor(c.authorId, c.anonymous, friendIds);
          return (
            <li key={c.id}>
              <Avatar name={who.name} state={who.state} size="sm" />
              <div className="cm-comment-body">
                <div className="cm-comment-head">
                  <strong>{who.name}</strong>
                  <span>{timeAgo(c.createdAt)}</span>
                </div>
                <p>{c.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cm-comment-form">
        <label htmlFor={`reply-${post.id}`} className="cm-visually-hidden">
          Reply anonymously
        </label>
        <input
          id={`reply-${post.id}`}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Reply anonymously"
          maxLength={500}
        />
        <button type="button" className="cm-icon-btn cm-send" onClick={send} disabled={!draft.trim()} aria-label="Send reply">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Post card                                                           */
/* ------------------------------------------------------------------ */

function PostCard({
  post,
  mine,
  friendIds,
  pendingIds,
  reported,
  isNew,
  onToggle,
  onConnect,
  onReport,
  onHide,
  onBlock,
  onDelete,
  onShare,
  onAddComment,
  onNavigate,
}) {
  const [showComments, setShowComments] = useState(false);
  const [warningLifted, setWarningLifted] = useState(false);

  const who = describeAuthor(post.authorId, post.anonymous, friendIds);
  const isMine = post.authorId === 'me';
  const canConnect = !isMine && !friendIds.has(post.authorId) && !post.anonymous;
  const pending = pendingIds.has(post.authorId);
  const hidden = post.contentWarning && !warningLifted && !isMine;

  return (
    <article className={isNew ? 'cm-post is-new' : 'cm-post'} id={`post-${post.id}`}>
      <header className="cm-post-head">
        <Avatar name={who.name} state={who.state} />
        <div className="cm-post-who">
          <strong>{who.name}</strong>
          <span>{who.hint ? `${timeAgo(post.createdAt)}. ${who.hint}.` : timeAgo(post.createdAt)}</span>
        </div>

        {canConnect &&
          (pending ? (
            <span className="cm-pending">
              <Check size={14} aria-hidden="true" /> Request sent
            </span>
          ) : (
            <button type="button" className="cm-btn cm-btn-soft" onClick={() => onConnect(post.authorId)}>
              <UserPlus size={15} aria-hidden="true" /> Connect
            </button>
          ))}

        <PostMenu
          isMine={isMine}
          reported={reported}
          onReport={() => onReport(post.id)}
          onHide={() => onHide(post.id)}
          onBlock={() => onBlock(post.authorId)}
          onDelete={() => onDelete(post.id)}
        />
      </header>

      <div className="cm-tags">
        <span className="cm-tag cm-tag-kind">{post.kind}</span>
        {post.label && <LabelTag label={post.label} />}
        {post.verified && (
          <span className="cm-tag cm-tag-verified">
            <BadgeCheck size={13} aria-hidden="true" /> Verified report
          </span>
        )}
        {post.circle && <span className="cm-tag cm-tag-circle">{post.circle}</span>}
      </div>

      {hidden ? (
        <div className="cm-cw">
          <TriangleAlert size={18} aria-hidden="true" />
          <div>
            <strong>Content warning</strong>
            <p>{post.contentWarning}</p>
          </div>
          <button type="button" className="cm-btn cm-btn-ghost" onClick={() => setWarningLifted(true)}>
            Show post
          </button>
        </div>
      ) : (
        <>
          <p className="cm-post-text">{post.text}</p>
          {post.checklist && (
            <ul className="cm-checklist">
              {post.checklist.map((item) => (
                <li key={item}>
                  <Check size={15} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {post.urgent && (
            <div className="cm-urgent cm-urgent-inline" role="note">
              <TriangleAlert size={18} aria-hidden="true" />
              <div>
                <strong>If this is happening to you now, call 911.</strong>
                <p>Firefly Chat can help you decide what to do next.</p>
              </div>
              <div className="cm-urgent-actions">
                <a className="cm-btn cm-btn-alert" href="tel:911">
                  <Phone size={15} aria-hidden="true" /> 911
                </a>
                <button type="button" className="cm-btn cm-btn-ghost" onClick={() => onNavigate('Firefly Chat')}>
                  Firefly Chat
                </button>
              </div>
            </div>
          )}

          {post.location && (
            <button type="button" className="cm-map-link" onClick={() => onNavigate('Heat Map')}>
              <MapPin size={15} aria-hidden="true" />
              <span>{post.location}</span>
              <strong>View on map</strong>
            </button>
          )}
        </>
      )}

      <div className="cm-actions">
        <div className="cm-actions-main">
          <button
            type="button"
            className={mine.support ? 'cm-action is-on' : 'cm-action'}
            aria-pressed={!!mine.support}
            onClick={() => onToggle(post.id, 'support')}
          >
            <Heart size={17} aria-hidden="true" fill={mine.support ? 'currentColor' : 'none'} />
            Support <span>{post.support + (mine.support ? 1 : 0)}</span>
          </button>
          <button
            type="button"
            className={mine.sameHere ? 'cm-action is-on' : 'cm-action'}
            aria-pressed={!!mine.sameHere}
            onClick={() => onToggle(post.id, 'sameHere')}
          >
            <Users size={17} aria-hidden="true" />
            Same here <span>{post.sameHere + (mine.sameHere ? 1 : 0)}</span>
          </button>
          <button
            type="button"
            className={showComments ? 'cm-action is-on' : 'cm-action'}
            aria-expanded={showComments}
            onClick={() => setShowComments((s) => !s)}
          >
            <MessageCircle size={17} aria-hidden="true" />
            Comment <span>{post.comments.length}</span>
          </button>
        </div>

        <div className="cm-actions-side">
          <button
            type="button"
            className={mine.follow ? 'cm-icon-btn is-on' : 'cm-icon-btn'}
            aria-pressed={!!mine.follow}
            aria-label={mine.follow ? 'Unfollow this post' : 'Follow this post for new replies'}
            onClick={() => onToggle(post.id, 'follow')}
          >
            <Bell size={18} fill={mine.follow ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className={mine.saved ? 'cm-icon-btn is-on' : 'cm-icon-btn'}
            aria-pressed={!!mine.saved}
            aria-label={mine.saved ? 'Remove from saved' : 'Save post'}
            onClick={() => onToggle(post.id, 'saved')}
          >
            <Bookmark size={18} fill={mine.saved ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="cm-icon-btn" aria-label="Copy link to post" onClick={() => onShare(post.id)}>
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {showComments && <Comments post={post} friendIds={friendIds} onAdd={onAddComment} />}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CommunityPage({ onNavigate = () => {} }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [friendIds, setFriendIds] = useState(() => new Set(INITIAL_FRIEND_IDS));
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const [hiddenPosts, setHiddenPosts] = useState(() => new Set());
  const [blockedAuthors, setBlockedAuthors] = useState(() => new Set());
  const [reportedPosts, setReportedPosts] = useState(() => new Set());
  const [myState, setMyState] = useState({}); // { [postId]: { support, sameHere, saved, follow } }
  const [newPostId, setNewPostId] = useState(null);
  const [tab, setTab] = useState('For you');
  const [circle, setCircle] = useState(null);
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);
  const connectTimers = useRef([]);

  useEffect(() => {
    const timers = connectTimers.current;
    return () => {
      clearTimeout(toastTimer.current);
      timers.forEach(clearTimeout);
    };
  }, []);

  function showToast(message, undo) {
    clearTimeout(toastTimer.current);
    setToast({ message, undo });
    toastTimer.current = setTimeout(() => setToast(null), undo ? 6000 : 3500);
  }

  /* ---- feed ---- */

  const feed = useMemo(() => {
    return [...posts]
      .filter((p) => !hiddenPosts.has(p.id) && !blockedAuthors.has(p.authorId))
      .filter((p) => !circle || p.circle === circle)
      .filter((p) => {
        if (tab === 'Questions') return p.kind === 'Question';
        if (tab === 'Advice') return p.kind === 'Advice';
        // Only posts where the friend chose to show their name. A friend's fully
        // anonymous post must not be identifiable by appearing in this tab.
        if (tab === 'Friends') return friendIds.has(p.authorId) && !p.anonymous;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, hiddenPosts, blockedAuthors, circle, tab, friendIds]);

  /* ---- posting and replying ---- */

  function handlePost(draft) {
    const now = currentTime();
    const id = `p${now}`;
    const post = { id, authorId: 'me', createdAt: now, support: 0, sameHere: 0, comments: [], ...draft };
    setPosts((prev) => [post, ...prev]);
    setNewPostId(id);
    // New posts always appear, even if a filter would hide them.
    setTab('For you');
    setCircle(null);
    showToast('Posted. It is live in the community now.');
  }

  function handleAddComment(postId, text) {
    const now = currentTime();
    const comment = { id: `c${now}`, authorId: 'me', anonymous: true, text, createdAt: now };
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)));
  }

  function handleDelete(postId) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post deleted.');
  }

  /* ---- reactions ---- */

  function handleToggle(postId, key) {
    setMyState((prev) => {
      const current = prev[postId] || {};
      return { ...prev, [postId]: { ...current, [key]: !current[key] } };
    });
    if (key === 'follow') {
      const nowOn = !(myState[postId] || {}).follow;
      showToast(nowOn ? 'Following. You will be notified of new replies.' : 'Unfollowed.');
    }
  }

  async function handleShare(postId) {
    const link = `${window.location.origin}${window.location.pathname}#post-${postId}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast('Link copied.');
    } catch {
      showToast('Could not copy the link. Copy it from the address bar instead.');
    }
  }

  /* ---- moderation ---- */

  function handleReport(postId) {
    setReportedPosts((prev) => new Set(prev).add(postId));
    // TODO: send to the moderation queue in Supabase.
    showToast('Thanks for flagging this. A moderator will review it.');
  }

  function handleHide(postId) {
    setHiddenPosts((prev) => new Set(prev).add(postId));
    showToast('Post hidden.', () =>
      setHiddenPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      }),
    );
  }

  function handleBlock(authorId) {
    // Blocking works on the author's hidden id, so an anonymous author is never identified.
    setBlockedAuthors((prev) => new Set(prev).add(authorId));
    showToast('Blocked. You will not see their posts.', () =>
      setBlockedAuthors((prev) => {
        const next = new Set(prev);
        next.delete(authorId);
        return next;
      }),
    );
  }

  /* ---- friends ---- */

  function handleConnect(authorId) {
    setPendingIds((prev) => new Set(prev).add(authorId));
    showToast('Request sent. Names stay hidden until she accepts.');
    // DEMO ONLY: pretend she accepts after a few seconds.
    // Replace with a Supabase realtime subscription on friendships.
    const timer = setTimeout(() => {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(authorId);
        return next;
      });
      setFriendIds((prev) => new Set(prev).add(authorId));
      showToast('You are now friends. You can see each other\u2019s names.');
    }, 3500);
    connectTimers.current.push(timer);
  }

  function handleAcceptRequest(id) {
    setRequests((prev) => prev.filter((r) => r !== id));
    setFriendIds((prev) => new Set(prev).add(id));
    showToast(`You and ${PEOPLE[id].name} are now friends.`);
  }

  function handleDeclineRequest(id) {
    setRequests((prev) => prev.filter((r) => r !== id));
  }

  const friendList = [...friendIds].filter((id) => id !== 'me');

  const emptyMessage =
    tab === 'Friends'
      ? 'No posts from friends yet. Posts from friends who choose to show their name will appear here.'
      : circle
        ? `Nothing in ${circle} yet. Be the first to post.`
        : 'Nothing here yet. Be the first to post.';

  return (
    <div className="cm-page">
      <header className="cm-header">
        <div>
          <h1>Your voice. Your community.</h1>
          <p>Share what happened, ask what you are unsure about, and help another woman feel less alone.</p>
        </div>
        <p className="cm-privacy-note">
          <Lock size={16} aria-hidden="true" />
          Everyone is anonymous. Only friends can see each other&rsquo;s names.
        </p>
      </header>

      <div className="cm-grid">
        {/* LEFT: where to look */}
        <aside className="cm-left" aria-label="Browse the feed">
          <nav className="cm-tabs" aria-label="Feed">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={tab === t ? 'cm-tab is-on' : 'cm-tab'}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </nav>

          <div className="cm-circles">
            <h2>Circles</h2>
            <ul>
              {CIRCLES.map((c) => {
                const Icon = CIRCLE_ICONS[c];
                const on = circle === c;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      className={on ? 'cm-circle is-on' : 'cm-circle'}
                      aria-pressed={on}
                      onClick={() => setCircle(on ? null : c)}
                    >
                      <span className="cm-circle-bubble">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="cm-circle-name">{c}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {circle && (
              <button type="button" className="cm-clear" onClick={() => setCircle(null)}>
                <X size={14} aria-hidden="true" /> Show all circles
              </button>
            )}
          </div>

          <div className="cm-help">
            <LifeBuoy size={22} aria-hidden="true" />
            <div>
              <strong>Need help now?</strong>
              <p>Firefly Chat gives calm, step-by-step guidance.</p>
            </div>
            <button type="button" className="cm-btn cm-btn-primary" onClick={() => onNavigate('Firefly Chat')}>
              Open chat
            </button>
          </div>
        </aside>

        {/* CENTRE: the feed */}
        <main className="cm-feed" aria-label="Community feed">
          <Composer onPost={handlePost} onNavigate={onNavigate} />

          {feed.length === 0 ? (
            <p className="cm-empty">{emptyMessage}</p>
          ) : (
            feed.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                mine={myState[post.id] || {}}
                friendIds={friendIds}
                pendingIds={pendingIds}
                reported={reportedPosts.has(post.id)}
                isNew={post.id === newPostId}
                onToggle={handleToggle}
                onConnect={handleConnect}
                onReport={handleReport}
                onHide={handleHide}
                onBlock={handleBlock}
                onDelete={handleDelete}
                onShare={handleShare}
                onAddComment={handleAddComment}
                onNavigate={onNavigate}
              />
            ))
          )}
        </main>

        {/* RIGHT: your people */}
        <aside className="cm-right" aria-label="Your people">
          <section className="cm-panel">
            <h2>Your friends</h2>
            {friendList.length === 0 ? (
              <p className="cm-muted">No friends yet. Tap Connect on a post to send a request.</p>
            ) : (
              <ul className="cm-people">
                {friendList.map((id) => (
                  <li key={id}>
                    <Avatar name={PEOPLE[id].name} state="lit" size="sm" />
                    <span>{PEOPLE[id].name}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="cm-panel">
            <h2>
              Friend requests
              {requests.length > 0 && <span className="cm-count">{requests.length}</span>}
            </h2>
            {requests.length === 0 ? (
              <p className="cm-muted">No requests waiting.</p>
            ) : (
              <ul className="cm-people cm-requests">
                {requests.map((id) => (
                  <li key={id}>
                    <Avatar name={PEOPLE[id].name} state="lit" size="sm" />
                    <span>{PEOPLE[id].name}</span>
                    <div className="cm-request-actions">
                      <button
                        type="button"
                        className="cm-icon-btn cm-accept"
                        aria-label={`Accept ${PEOPLE[id].name}`}
                        onClick={() => handleAcceptRequest(id)}
                      >
                        <Check size={17} />
                      </button>
                      <button
                        type="button"
                        className="cm-icon-btn"
                        aria-label={`Decline ${PEOPLE[id].name}`}
                        onClick={() => handleDeclineRequest(id)}
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="cm-guidelines">
            <h2>Community guidelines</h2>
            <ul>
              <li>Be kind. Everyone here is trying to stay safe.</li>
              <li>Share what you experienced. Do not name or accuse individuals.</li>
              <li>Never share another person&rsquo;s details.</li>
              <li>In an emergency, call 911 first.</li>
            </ul>
          </section>
        </aside>
      </div>

      {toast && (
        <div className="cm-toast" role="status" aria-live="polite">
          <span>{toast.message}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo();
                setToast(null);
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
