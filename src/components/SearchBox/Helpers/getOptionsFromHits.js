function hitToOption({
  objectID,
  Title: title,
  'Console(s)': consoles,
  'Developer(s)': devs,
  _highlightResult,
}) {
  const highlightInTitle = _highlightResult.Title?.value;
  const label = highlightInTitle || title;

  const subtitle = devs.join(', ');

  return {
    key: objectID,
    label,
    title,
    subtitle,
    tags: consoles,
  };
}
function getOptionsFromHits(hits) {
  return hits.map(hitToOption);
}
export default getOptionsFromHits;
