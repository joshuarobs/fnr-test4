import { useState } from 'react';
import {
  Button,
  Separator,
  Label,
  InputClearable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';

// Page component for creating a new claim
export const CreateClaimPage = () => {
  // State for form fields
  const [claimNumber, setClaimNumber] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [blankItems, setBlankItems] = useState('');

  // Mock agents data - replace with actual data source
  const agents = ['John Smith', 'Jane Doe', 'Mike Johnson'];

  return (
    <div className="p-6 w-[800px] mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create a new claim</h1>
      <Separator className="mb-6" />

      <div className="space-y-6 max-w-2xl">
        {/* Claim Number */}
        <div className="space-y-2">
          <Label htmlFor="claimNumber">Claim number</Label>
          <InputClearable
            id="claimNumber"
            value={claimNumber}
            onChange={(e) => setClaimNumber(e.target.value)}
            onClear={() => setClaimNumber('')}
            className="w-[200px]"
            autoComplete="off"
          />
        </div>

        {/* Agent Assigned */}
        <div className="space-y-2">
          <Label>Agent assigned to</Label>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  {assignedAgent || 'Select an agent'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {agents.map((agent) => (
                  <DropdownMenuItem
                    key={agent}
                    onClick={() => setAssignedAgent(agent)}
                  >
                    {agent}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Blank Items */}
        <div className="space-y-2">
          <Label htmlFor="blankItems">Starting number of blank items</Label>
          <InputClearable
            id="blankItems"
            type="number"
            value={blankItems}
            onChange={(e) => setBlankItems(e.target.value)}
            onClear={() => setBlankItems('')}
            className="w-[120px]"
          />
          <p className="text-sm text-muted-foreground">
            The number of blank items to start with. You can easily edit those
            values.
          </p>
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-8 flex justify-end">
        <Button>Create new claim</Button>
      </div>
    </div>
  );
};
