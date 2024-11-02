interface MultiAddTabProps {
  multiAddInput: string;
  setMultiAddInput: (value: string) => void;
}

export function MultiAddTab({
  multiAddInput,
  setMultiAddInput,
}: MultiAddTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Enter multiple items, one per line
      </p>
      <textarea
        className="w-full min-h-[200px] p-2 rounded-md border border-input bg-transparent text-sm"
        placeholder="Enter multiple items, one per line"
        value={multiAddInput}
        onChange={(e) => setMultiAddInput(e.target.value)}
        autoFocus
      />
    </div>
  );
}
