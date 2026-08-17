/** ページ見出し。bonobo の .mp-page-head / .mp-help-tip と対。
 *  help を渡すと右端に「？」のツールチップが出る（PC のみ表示）。 */
export default function PageHead({
  title,
  sub,
  help,
  children,
}: {
  title: string;
  sub?: string;
  help?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mp-page-head">
      <div>
        <div className="mp-page-title">{title}</div>
        {sub && <div className="mp-page-sub">{sub}</div>}
      </div>
      {children}
      {help && (
        <div className="mp-help-tip" tabIndex={0}>
          ？<span className="mp-help-tip-text">{help}</span>
        </div>
      )}
    </div>
  );
}
