import React from 'react';
import { useParams } from 'react-router-dom';
import { ContentsTableWithToolbar } from '../components/contents-table/ContentsTable';
import { placeholderContentsData } from '../components/contents-table/placeholderContentsData';
import { randomItemsData } from '../components/contents-table/randomItemsData';
import { Item } from '../components/contents-table/item';
import { ClaimPageHeaderActions } from '../components/contents-table/ClaimPageHeaderActions';
import { TotalCalculatedPriceText } from '../components/contents-other/TotalCalculatedPriceText';
import { TotalProgressBar } from '../components/contents-other/TotalProgressBar';
import { SecondSidebar } from '../components/app-shell/SecondSidebar';
import { ItemStatus } from '../components/contents-table/ItemStatus';
import { ITEM_KEYS } from '../components/contents-table/itemKeys';
import { useDispatch } from 'react-redux';
import { setSelectedCell } from '../store/features/selectedCellSlice';
import {
  useGetClaimQuery,
  useUpdateItemMutation,
  useAddItemMutation,
  useRemoveItemMutation,
  useRecordClaimViewMutation,
  useGetRecentlyViewedClaimsQuery,
  api,
} from '../store/services/api';

export const ClaimPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newItemName, setNewItemName] = React.useState('');
  const dispatch = useDispatch();

  const { data: claimData, isLoading, error } = useGetClaimQuery(id!);
  const { data: recentViews } = useGetRecentlyViewedClaimsQuery();
  const [updateItem] = useUpdateItemMutation();
  const [addItemMutation] = useAddItemMutation();
  const [removeItemMutation] = useRemoveItemMutation();
  const [recordView] = useRecordClaimViewMutation();

  // Reset selected cell when entering claim page or when claim ID changes
  React.useEffect(() => {
    dispatch(setSelectedCell({ rowId: '1', columnId: ITEM_KEYS.LOCAL_ID }));
  }, [dispatch, id]);

  // Record view when claim is loaded, but only if it's not the most recent view
  React.useEffect(() => {
    if (id && !isLoading && !error && recentViews) {
      const mostRecentView = recentViews[0];
      if (!mostRecentView || mostRecentView.claim.claimNumber !== id) {
        recordView(id);
      }
    }
  }, [id, isLoading, error, recordView, recentViews]);

  // Invalidate recent views on unmount to update UI when leaving the page
  React.useEffect(() => {
    return () => {
      if (!error) {
        dispatch(api.util.invalidateTags(['RecentViews']));
      }
    };
  }, [dispatch, error]);

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
      ourQuote: item.ourQuote, // Fixed casing
      receiptPhotoUrl: item.receiptPhotoUrl,
      ourQuoteProof: item.ourQuoteProof, // Fixed casing
      dateCreated: new Date(item.createdAt),
    }));
  }, [claimData]);

  const calculateInsuredsTotal = (items: Item[]): number => {
    return items.reduce((total, item) => total + (item.insuredsQuote || 0), 0);
  };

  const calculateOurTotal = (items: Item[]): number => {
    return items.reduce((total, item) => total + (item.ourQuote || 0), 0); // Fixed casing
  };

  const calculateProgress = (
    items: Item[]
  ): { value: number; maxValue: number } => {
    const totalItems = items.length;
    const itemsWithOurQuote = items.filter(
      (item) => item.ourQuote !== null // Fixed casing
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

  const addItem = async (newItem: Item | Item[]) => {
    if (!id) return;

    try {
      if (Array.isArray(newItem)) {
        // Handle bulk add
        for (const item of newItem) {
          await addItemMutation({
            claimId: id,
            item,
          }).unwrap();
        }
      } else {
        // Handle single item add
        await addItemMutation({
          claimId: id,
          item: newItem,
        }).unwrap();
      }
    } catch (err) {
      console.error('Failed to add item(s):', err);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!id) return;

    try {
      await removeItemMutation({
        claimId: id,
        itemId,
      }).unwrap();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleUpdateItem = async (updatedItem: Item) => {
    try {
      await updateItem(updatedItem).unwrap();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
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
      ourQuote: randomItem.ourQuote || null, // Fixed casing
      receiptPhotoUrl: randomItem.receiptPhotoUrl || null,
      ourQuoteProof: randomItem.ourQuoteProof || null, // Fixed casing
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

  if (isLoading) {
    return <div className="flex-1 min-w-0 p-4">Loading claim data...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 min-w-0 p-4 text-red-500">
        An error occurred while loading the claim
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
              ourQuote={ourTotal} // Fixed casing
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
          <ClaimPageHeaderActions addItem={addItem} />
        </div>
        <ContentsTableWithToolbar
          data={tableData}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={handleUpdateItem}
        />
      </div>
      <SecondSidebar />
    </main>
  );
};
