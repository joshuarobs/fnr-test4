import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentsTableWithToolbar } from '../components/contents-table/ContentsTable';
import { placeholderContentsData } from '../components/contents-table/placeholderContentsData';
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
import { Input } from '@react-monorepo/shared';
import { ContentsDataTableSection } from '../components/contents-table/ContentsDataTableSection';
import { ArchivedLabel } from '../components/contents-table/ArchivedLabel';
import { ClaimNotFoundErrorSection } from '../components/claims/ClaimNotFoundErrorSection';

export const ClaimPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [claimInput, setClaimInput] = React.useState('');
  const tableRef = React.useRef<any>(null);

  if (!id) {
    return (
      <div className="flex-1 min-w-0 p-4 flex flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold">No Claim Number Provided</div>
        <div className="text-muted-foreground">
          Please enter a claim number below
        </div>
        <div className="flex gap-2">
          <Input
            value={claimInput}
            onChange={(e) => setClaimInput(e.target.value)}
            placeholder="Enter claim number"
            className="w-64"
          />
          <button
            onClick={() => navigate(`/claims/${claimInput}`)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go
          </button>
        </div>
      </div>
    );
  }

  const { data: claimData, isLoading, error } = useGetClaimQuery(id);
  const { data: recentViews } = useGetRecentlyViewedClaimsQuery();
  const [updateItem] = useUpdateItemMutation();
  const [addItemMutation] = useAddItemMutation();
  const [removeItemMutation] = useRemoveItemMutation();
  const [recordView] = useRecordClaimViewMutation();

  // Reset selected cell and filters when entering claim page or when claim ID changes
  React.useEffect(() => {
    dispatch(setSelectedCell({ rowId: '1', columnId: ITEM_KEYS.LOCAL_ID }));
    // Reset filters if table reference exists
    if (tableRef.current?.table) {
      tableRef.current.table.getAllColumns().forEach((column: any) => {
        if (column.getCanFilter()) {
          column.setFilterValue(undefined);
        }
      });
      // Reset global filter
      tableRef.current.table.setGlobalFilter('');
    }
  }, [dispatch, id]);

  // Record view when claim is loaded, but only if it's not the most recent view
  React.useEffect(() => {
    if (!isLoading && !error && recentViews) {
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
      roomCategory: item.roomCategory,
      modelSerialNumber: item.modelSerialNumber,
      itemStatus: item.itemStatus || ItemStatus.NR,
      quantity: item.quantity || 1,
      insuredsQuote: item.insuredsQuote,
      ourQuote: item.ourQuote,
      receiptPhotoUrl: item.receiptPhotoUrl,
      ourQuoteProof: item.ourQuoteProof,
      dateCreated: new Date(item.createdAt),
    }));
  }, [claimData]);

  const calculateInsuredsTotal = (items: Item[]): number => {
    return items.reduce(
      (total, item) => total + (item.insuredsQuote || 0) * (item.quantity || 1),
      0
    );
  };

  const calculateOurTotal = (items: Item[]): number => {
    return items.reduce(
      (total, item) => total + (item.ourQuote || 0) * (item.quantity || 1),
      0
    );
  };

  const calculateProgress = (
    items: Item[]
  ): { value: number; maxValue: number } => {
    const totalItems = items.length;
    const itemsWithOurQuote = items.filter(
      (item) => item.ourQuote !== null
    ).length;
    return {
      value: itemsWithOurQuote,
      maxValue: totalItems,
    };
  };

  const addItem = async (newItem: Item | Item[]) => {
    try {
      if (Array.isArray(newItem)) {
        // Handle bulk add
        for (const item of newItem) {
          await addItemMutation({
            claimId: id,
            item: {
              name: item.name,
              category: item.category,
              itemStatus: item.itemStatus,
              modelSerialNumber: item.modelSerialNumber,
              roomCategory: item.roomCategory,
              quantity: item.quantity || 1,
            },
          }).unwrap();
        }
      } else {
        // Handle single item add
        await addItemMutation({
          claimId: id,
          item: {
            name: newItem.name,
            category: newItem.category,
            itemStatus: newItem.itemStatus,
            modelSerialNumber: newItem.modelSerialNumber,
            roomCategory: newItem.roomCategory,
            quantity: newItem.quantity || 1,
          },
        }).unwrap();
      }
    } catch (err) {
      console.error('Failed to add item(s):', err);
    }
  };

  const removeItem = async (itemId: number) => {
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
      await updateItem({ claimNumber: id, item: updatedItem }).unwrap();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  if (isLoading) {
    return <div className="flex-1 min-w-0 p-4">Loading claim data...</div>;
  }

  if (error) {
    return (
      <ClaimNotFoundErrorSection
        claimId={id}
        claimInput={claimInput}
        setClaimInput={setClaimInput}
        onNavigate={(claimNumber) => navigate(`/claims/${claimNumber}`)}
      />
    );
  }

  const insuredsTotal = calculateInsuredsTotal(tableData);
  const ourTotal = calculateOurTotal(tableData);
  const progress = calculateProgress(tableData);

  return (
    <main className="flex-1 min-w-0 flex">
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <div className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <div className="flex gap-8">
              <TotalCalculatedPriceText
                title="Insured's total"
                value={insuredsTotal}
                insuredsQuote={insuredsTotal}
                ourQuote={ourTotal}
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
            <div className="flex items-center gap-4">
              {claimData?.isDeleted && <ArchivedLabel />}
              <ClaimPageHeaderActions
                addItem={addItem}
                lastProgressUpdate={claimData?.lastProgressUpdate || null}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 px-4 pb-6">
          <ContentsTableWithToolbar
            ref={tableRef}
            data={tableData}
            addItem={addItem}
            removeItem={removeItem}
            updateItem={handleUpdateItem}
            claimNumber={id}
          />
        </div>
      </div>
      <SecondSidebar />
    </main>
  );
};
