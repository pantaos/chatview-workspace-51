interface Props {
  url: string;
  title?: string;
}

export default function PdfViewer({ url, title }: Props) {
  return (
    <div className="w-full h-[60vh] rounded-lg overflow-hidden border bg-muted">
      <iframe src={url} title={title || "PDF"} className="w-full h-full" />
    </div>
  );
}
