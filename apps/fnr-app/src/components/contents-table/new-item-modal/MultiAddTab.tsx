import { KeyboardEvent } from 'react';

interface MultiAddTabProps {
  multiAddInput: string;
  setMultiAddInput: (value: string) => void;
  handleMultiAdd: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function MultiAddTab({
  multiAddInput,
  setMultiAddInput,
  handleMultiAdd,
}: MultiAddTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Press Enter for new line, Shift+Enter to add all items
      </p>
      <textarea
        className="w-full min-h-[200px] p-2 rounded-md border border-input bg-transparent text-sm"
        placeholder="Enter multiple items, one per line"
        value={multiAddInput}
        onChange={(e) => setMultiAddInput(e.target.value)}
        onKeyDown={handleMultiAdd}
        autoFocus
      />
    </div>
  );
}
