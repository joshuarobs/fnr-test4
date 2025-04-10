import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentsTableWithToolbar } from '../components/contents-table/ContentsTable';
import { placeholderContentsData } from '../components/contents-table/placeholderContentsData';
import { Item } from '../components/contents-table/item';
import { ClaimPageHeaderActions } from '../components/contents-table/ClaimPageHeaderActions';
import { AddNewItemModalRef } from '../components/contents-table/new-item-modal/AddNewItemModal';
import { KeyboardKeys } from '../constants/keyboard-constants';
import {
  CLAIM_PAGE_KEYBOARD_SHORTCUTS_MAP,
  KeyboardShortcutId,
} from '../constants/keyboard-shortcuts';
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
  useUpdateClaimDescriptionMutation,
  api,
} from '../store/services/api';
import { Input, Separator } from '@react-monorepo/shared';
import { ContentsDataTableSection } from '../components/contents-table/ContentsDataTableSection';
import { ArchivedLabel } from '../components/contents-table/ArchivedLabel';
import { ClaimNotFoundErrorSection } from '../components/claims/ClaimNotFoundErrorSection';
import { ClaimPageDescription } from '../components/claims/ClaimPageDescription';

export const ClaimPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [claimInput, setClaimInput] = React.useState('');
  const tableRef = React.useRef<any>(null);
  const addItemModalRef = useRef<AddNewItemModalRef>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const addItemShortcut =
        CLAIM_PAGE_KEYBOARD_SHORTCUTS_MAP[
          KeyboardShortcutId.OPEN_ADD_ITEM_MODAL
        ];
      const shortcutKey = addItemShortcut.keybinds[0][0];
      if (e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        addItemModalRef.current?.openModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  console.log('Claim data from DB:', claimData);
  console.log('Latest activities:', claimData?.activities);
  const [updateItem] = useUpdateItemMutation();
  const [addItemMutation] = useAddItemMutation();
  const [removeItemMutation] = useRemoveItemMutation();
  const [recordView] = useRecordClaimViewMutation();
  const [updateDescription, { isError: isUpdateError }] =
    useUpdateClaimDescriptionMutation();

  // Record view when claim page is loaded
  React.useEffect(() => {
    if (id) {
      recordView(id);
    }
  }, [id, recordView]);

  // Initialize table state once when component mounts
  React.useEffect(() => {
    dispatch(setSelectedCell({ rowId: '1', columnId: ITEM_KEYS.LOCAL_ID }));
  }, [dispatch]);

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
              <Separator orientation="vertical" className="h-8" />
              <ClaimPageDescription
                description={claimData?.description || ''}
                onUpdate={async (newDescription) => {
                  try {
                    await updateDescription({
                      claimNumber: id,
                      description: newDescription,
                    }).unwrap();
                  } catch (error) {
                    console.error('Failed to update description:', error);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-4">
              {claimData?.isDeleted && <ArchivedLabel />}
              <ClaimPageHeaderActions
                ref={addItemModalRef}
                addItem={addItem}
                lastProgressUpdate={claimData?.lastProgressUpdate || null}
                isDeleted={claimData?.isDeleted}
                claimNumber={id}
                handler={claimData?.handler}
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
      <SecondSidebar
        assignedUser={
          claimData?.handler && {
            userInitials: `${claimData.handler.firstName[0]}${claimData.handler.lastName[0]}`,
            name: `${claimData.handler.firstName} ${claimData.handler.lastName}`,
            userId: claimData.handler.id,
            color: claimData.handler.avatarColour,
            employeeId: claimData.handler.staff?.employeeId,
          }
        }
        contributors={
          claimData?.contributors?.map((contributor) => {
            const { user } = contributor;
            return {
              userInitials: `${user.firstName[0]}${user.lastName[0]}`,
              name: `${user.firstName} ${user.lastName}`,
              userId: user.id,
              color: user.avatarColour,
              employeeId: user.staff?.employeeId,
            };
          }) || []
        }
        suppliers={claimData?.allocatedSuppliers?.map((allocated) => {
          const { supplier } = allocated;
          return {
            companyName: supplier.company,
            name: supplier.company,
            userId: supplier.baseUser.id,
            color: supplier.baseUser.avatarColour,
            isSupplier: true,
            supplierId: supplier.supplierId,
          };
        })}
        activities={claimData?.activities || []}
        totalActivitiesNumber={claimData?.activities?.length || 0}
        isLoading={isLoading}
        currentClaimNumber={id}
      />
    </main>
  );
};
