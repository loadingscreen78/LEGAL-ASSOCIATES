import { useEffect, useRef } from 'react';
import { useSiteContent } from '@/contexts/SiteContentContext';

/**
 * EditableText — renders a string from `site_content`. Visitors see plain
 * text. Inside the admin landing-editor (`isEditing` true) the text becomes
 * an inline contentEditable target with a dotted gold outline so admins can
 * click and type directly on the very same layout the public sees.
 *
 * Why contentEditable instead of an <input>:
 *   - keeps the original typography, color, gradient, line-height etc.
 *   - avoids layout shift because the element keeps its DOM position
 *   - works for spans inline inside a heading
 *
 * The element is read-only when `isEditing` is false, so the public page
 * has zero behavior change (and zero a11y change either).
 */

type Props = {
  /** Key into LANDING_DEFAULTS / site_content. */
  keyName: string;
  /** Visual element to render as. Defaults to a span so it inlines safely. */
  as?: keyof JSX.IntrinsicElements;
  /** Multi-line edits. When true the field accepts Enter for newlines. */
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const EditableText = ({
  keyName,
  as = 'span',
  multiline = false,
  className,
  style,
}: Props) => {
  const { t, isEditing, stage, isOverridden } = useSiteContent();
  const Tag = as as any;
  const ref = useRef<HTMLElement | null>(null);

  // Sync external value into the contentEditable element. We only rewrite
  // textContent when the value actually differs, otherwise the caret
  // jumps to the end on every keystroke.
  const value = t(keyName);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  if (!isEditing) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  // -- Editing mode --------------------------------------------------------

  const editingStyle: React.CSSProperties = {
    ...style,
    outline: '2px dashed rgba(212,175,55,0.85)',
    outlineOffset: '2px',
    borderRadius: 6,
    padding: '0 2px',
    cursor: 'text',
    background: isOverridden(keyName) ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.05)',
    transition: 'background 0.2s',
    minWidth: 4,
    display: 'inline-block',
  };

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const text = (e.currentTarget.textContent ?? '').replace(/\u00a0/g, ' ');
    stage(keyName, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Strip rich-text on paste so the page typography stays intact.
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={editingStyle}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={`Edit ${keyName}`}
      title={`Click to edit · ${keyName}`}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      spellCheck
    />
  );
};

export default EditableText;
