import { cn } from '../lib/cn';
import { CopyToClipboard } from './CopyToClipboard';
import './CodeBlock.css';

export interface CodeBlockProps {
  code: string;
  /** 语言标签（Badge 展示；语法高亮由项目接入高亮库，→ 组件库全景专项层） */
  language?: string;
  className?: string;
}

/** 代码块：等宽 + 横向滚动 + 复制（→ CopyToClipboard）。 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div className={cn('ui-codeblock', className)}>
      <div className="ui-codeblock__bar">
        {language && <span className="ui-codeblock__lang">{language}</span>}
        <CopyToClipboard text={code}>
          <span className="ui-codeblock__copy">复制</span>
        </CopyToClipboard>
      </div>
      <pre className="ui-codeblock__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
