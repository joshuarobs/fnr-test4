import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentsTableWithToolbar } from '../components/contents-table/ContentsTable';
import { placeholderContentsData } from '../components/contents-table/placeholderContentsData';
import { randomItemsData } from '../components/contents-table/randomItemsData';
import { Item } from '../components/contents-table/item';
import { TestAddDeleteStuff } from '../components/contents-table/TestAddDeleteStuff';
import { TotalCalculatedPriceText } from '../components/contents-other/TotalCalculatedPriceText';
import { TotalProgressBar } from '../components/contents-other/TotalProgressBar';
import { SecondSidebar } from '../components/app-shell/SecondSidebar';
import { ItemStatus } from '../components/contents-table/ItemStatus';

const fetchClaimData = async (id: string) => {
  const response = await fetch(`http://localhost:3333/api/claims/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch claim data');
  }
  return response.json();
};

export const ClaimPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newItemName, setNewItemName] = React.useState('');
  const [updateItemId, setUpdateItemId] = React.useState<number | null>(null);
  const [updateItemName, setUpdateItemName] = React.useState('');
  const queryClient = useQueryClient();

  const {
    data: claimData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => fetchClaimData(id!),
    enabled: !!id,
  });

  // Transform API data to match our Item interface
  const tableData: Item[] = React.useMemo(() => {
    if (!claimData?.items) return placeholderContentsData;

    return claimData.items.map((item: any) => ({
      id: item.id,
      localId: claimData.localItemIds.indexOf(item.id) + 1,
      group: item.group || '',
      name: item.name,
      category: item.category,
      modelSerialNumber: item.modelSerialNumber,
      itemStatus: item.itemStatus || ItemStatus.NR,
      insuredsQuote: item.insuredsQuote,
      ourquote: item.ourQuote,
      receiptPhotoUrl: item.receiptPhotoUrl,
      ourquoteLink: item.ourQuoteLink,
      dateCreated: new Date(item.createdAt),
    }));
  }, [claimData]);

  const updateItemMutation = useMutation({
    mutationFn: async (updatedItem: Item) => {
      const response = await fetch(
        `http://localhost:3333/api/items/${updatedItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: updatedItem.name,
            ourQuote: updatedItem.ourquote,
            insuredsQuote: updatedItem.insuredsQuote,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    },
    onMutate: async (updatedItem) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['claim', id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['claim', id]);

      // Optimistically update the cache
      queryClient.setQueryData(['claim', id], (old: any) => ({
        ...old,
        items: old.items.map((item: any) =>
          item.id === updatedItem.id
            ? {
                ...item,
                name: updatedItem.name,
                ourQuote: updatedItem.ourquote,
                insuredsQuote: updatedItem.insuredsQuote,
              }
            : item
        ),
      }));

      // Return context with the previous data
      return { previousData };
    },
    onError: (err, newItem, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(['claim', id], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
    },
  });

  const calculateInsuredsTotal = (items: Item[]): number => {
    return items.reduce((total, item) => total + (item.insuredsQuote || 0), 0);
  };

  const calculateOurTotal = (items: Item[]): number => {
    return items.reduce((total, item) => total + (item.ourquote || 0), 0);
  };

  const calculateProgress = (
    items: Item[]
  ): { value: number; maxValue: number } => {
    const totalItems = items.length;
    const itemsWithOurQuote = items.filter(
      (item) => item.ourquote !== null
    ).length;
    return {
      value: itemsWithOurQuote,
      maxValue: totalItems,
    };
  };

  const getHighestId = (): number => {
    return tableData.reduce(
      (maxId: number, item: Item) => Math.max(maxId, item.id),
      0
    );
  };

  const addItem = (newItem: Item | Item[]) => {
    if (Array.isArray(newItem)) {
      const nextId = getHighestId() + 1;
      const itemsWithNewIds = newItem.map((item: Item, index) => ({
        ...item,
        id: nextId + index,
      }));
      if (claimData) {
        claimData.items = [...claimData.items, ...itemsWithNewIds];
        // Update localItemIds array
        claimData.localItemIds = [
          ...claimData.localItemIds,
          ...itemsWithNewIds.map((item) => item.id),
        ];
      }
    } else {
      const itemWithNewId = {
        ...newItem,
        id: getHighestId() + 1,
      };
      if (claimData) {
        claimData.items = [...claimData.items, itemWithNewId];
        // Update localItemIds array
        claimData.localItemIds = [...claimData.localItemIds, itemWithNewId.id];
      }
    }
  };

  const removeItem = (itemId: number) => {
    if (claimData) {
      const item = claimData.items.find((item: any) => item.id === itemId);
      if (item) {
        claimData.items = claimData.items.filter(
          (item: any) => item.id !== itemId
        );
        // Update localItemIds array
        claimData.localItemIds = claimData.localItemIds.filter(
          (id: number) => id !== itemId
        );
      }
    }
  };

  const updateItem = (updatedItem: Item) => {
    updateItemMutation.mutate(updatedItem);
  };

  const testGetRandomStatus =
    (): (typeof ItemStatus)[keyof typeof ItemStatus] => {
      const rand = Math.random();
      if (rand < 0.6) return ItemStatus.NR;
      if (rand < 0.8) return ItemStatus.RS;
      return ItemStatus.VPOL;
    };

  const testCreateRandomItem = (customName?: string) => {
    let randomItem =
      randomItemsData[Math.floor(Math.random() * randomItemsData.length)];
    let itemName = customName || randomItem.name;

    return {
      id: getHighestId() + 1,
      localId: (claimData?.localItemIds?.length || 0) + 1,
      group: randomItem.group,
      name: itemName,
      category: randomItem.category || null,
      modelSerialNumber: randomItem.modelSerialNumber || null,
      itemStatus: testGetRandomStatus(),
      insuredsQuote: randomItem.insuredsQuote || null,
      ourquote: randomItem.ourquote || null,
      receiptPhotoUrl: randomItem.receiptPhotoUrl || null,
      ourquoteLink: null,
      dateCreated: new Date(),
    };
  };

  const testHandleAddItem = () => {
    const newItem = testCreateRandomItem(newItemName);
    addItem(newItem);
    setNewItemName('');
  };

  const handleRemoveLastItem = () => {
    if (tableData.length > 0) {
      removeItem(tableData[tableData.length - 1].id);
    }
  };

  const handleUpdateItem = () => {
    if (updateItemId !== null && updateItemName) {
      const itemToUpdate = tableData.find((item) => item.id === updateItemId);
      if (itemToUpdate) {
        const updatedItem = { ...itemToUpdate, name: updateItemName };
        updateItem(updatedItem);
        setUpdateItemId(null);
        setUpdateItemName('');
      }
    }
  };

  if (isLoading) {
    return <div className="flex-1 min-w-0 p-4">Loading claim data...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 min-w-0 p-4 text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  const insuredsTotal = calculateInsuredsTotal(tableData);
  const ourTotal = calculateOurTotal(tableData);
  const progress = calculateProgress(tableData);

  return (
    <main className="flex-1 min-w-0 flex">
      <div className="flex-1 min-w-0 p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <TotalCalculatedPriceText
              title="Insured's total"
              value={insuredsTotal}
              insuredsQuote={insuredsTotal}
              ourquote={ourTotal}
              warningString="Insured has not provided quotes for all items yet."
            />
            <TotalCalculatedPriceText
              title="Our total"
              value={ourTotal}
              warningString="We don't have quotes for all items yet."
            />
            <TotalProgressBar
              value={progress.value}
              maxValue={progress.maxValue}
            />
          </div>
          <TestAddDeleteStuff
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            handleAddItem={testHandleAddItem}
            handleRemoveLastItem={handleRemoveLastItem}
            addItem={addItem}
          />
        </div>
        <ContentsTableWithToolbar
          data={tableData}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      </div>
      <SecondSidebar />
    </main>
  );
};
