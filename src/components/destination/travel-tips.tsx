interface TravelTipsProps {
  content: string;
}

export function TravelTips({ content }: TravelTipsProps) {
  if (!content) return null;
  return (
    <div className="prose prose-sm max-w-none text-muted-foreground">
      {content.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
