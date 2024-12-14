import { KeyboardEvent } from 'react';
import {
  Label,
  Input,
  InputClearable,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from '@react-monorepo/shared';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../shared/src/lib/utils';
import { ItemCategory } from '../itemCategories';
import {
  ItemStatus,
  ItemStatusType,
  ORDERED_ITEM_STATUSES,
} from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { CategoryDropdown } from '../shared/CategoryDropdown';
import { RoomCategoryDropdown } from '../shared/RoomCategoryDropdown';
import { RoomCategory } from '../roomCategories';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWarningIcon } from '../../contents-other/FormWarningIcon';

const labelMinWidthClass =
  'min-w-[80px] text-right flex items-center justify-end';

// Form schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
  roomCategory: z.nativeEnum(RoomCategory).nullable(),
  category: z.nativeEnum(ItemCategory).nullable(),
  status: z.nativeEnum(ItemStatus),
  modelSerial: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface QuickAddTabProps {
  quickAddInput: string;
  setQuickAddInput: (value: string) => void;
  modelSerialInput: string;
  setModelSerialInput: (value: string) => void;
  quantityInput: string;
  setQuantityInput: (value: string) => void;
  selectedRoom: RoomCategory | null;
  setSelectedRoom: (value: RoomCategory | null) => void;
  roomOpen: boolean;
  setRoomOpen: (value: boolean) => void;
  handleQuickAdd: (e: KeyboardEvent<HTMLInputElement>) => void;
  selectedCategory: ItemCategory | null;
  setSelectedCategory: (category: ItemCategory | null) => void;
  categoryOpen: boolean;
  setCategoryOpen: (open: boolean) => void;
  selectedStatus: ItemStatusType;
  setSelectedStatus: (status: ItemStatusType) => void;
}

export function QuickAddTab({
  quickAddInput,
  setQuickAddInput,
  modelSerialInput,
  setModelSerialInput,
  quantityInput,
  setQuantityInput,
  selectedRoom,
  setSelectedRoom,
  roomOpen,
  setRoomOpen,
  handleQuickAdd,
  selectedCategory,
  setSelectedCategory,
  categoryOpen,
  setCategoryOpen,
  selectedStatus,
  setSelectedStatus,
}: QuickAddTabProps) {
  // Initialize form with default values
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: quickAddInput,
      quantity: parseInt(quantityInput) || 1,
      roomCategory: selectedRoom,
      category: selectedCategory,
      status: selectedStatus,
      modelSerial: modelSerialInput,
    },
  });

  // Validate and update quantity value
  // UX: Ensures even if user types a number with letters, that the number gets counted
  // If there's no number typed, it will default to 1
  const validateAndUpdateQuantity = (value: string) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantityInput(value);
      form.setValue('quantity', parsedValue);
    } else {
      setQuantityInput('1');
      form.setValue('quantity', 1);
    }
  };

  // Handle quantity input to allow any input but validate on change
  const handleQuantityChange = (value: string) => {
    setQuantityInput(value);
    const parsedValue = parseInt(value);
    // Only update form if it's a valid number
    if (!isNaN(parsedValue) && parsedValue > 0) {
      form.setValue('quantity', parsedValue);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormSchema) => {
    validateAndUpdateQuantity(quantityInput);
    // The parent component handles the actual submission via handleQuickAdd
    if (form.formState.isValid) {
      handleQuickAdd({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    }
  };

  // Helper component for form error message with icon
  const FormErrorMessage = ({ fieldName }: { fieldName: keyof FormSchema }) => {
    const error = form.formState.errors[fieldName];
    if (!error) return null;

    return (
      <div className="flex items-center gap-2">
        <FormWarningIcon />
        <FormMessage />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="[&_input]:mt-0 [&_button]:mt-0 [&_div]:mt-0 space-y-2"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Name</FormLabel>
                <FormControl>
                  <InputClearable
                    {...field}
                    placeholder="e.g. Shirt, Table, Shovel, etc..."
                    className="flex-1"
                    value={quickAddInput}
                    onChange={(e) => {
                      setQuickAddInput(e.target.value);
                      field.onChange(e);
                    }}
                    onClear={() => {
                      setQuickAddInput('');
                      field.onChange('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && form.formState.isValid) {
                        handleQuickAdd(e);
                      }
                    }}
                    autoComplete="off"
                    autoFocus
                    escapeKeyClears
                  />
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="name" />
              </div>
            </FormItem>
          )}
        />

        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter quantity..."
                    className="flex-1"
                    value={quantityInput}
                    onChange={(e) => {
                      handleQuantityChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        validateAndUpdateQuantity(quantityInput);
                        if (form.formState.isValid) {
                          handleQuickAdd(e);
                        }
                      }
                    }}
                    onBlur={() => validateAndUpdateQuantity(quantityInput)}
                    autoComplete="off"
                  />
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="quantity" />
              </div>
            </FormItem>
          )}
        />

        {/* Room Field */}
        <FormField
          control={form.control}
          name="roomCategory"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Room</FormLabel>
                <FormControl>
                  <div className="flex-1">
                    <RoomCategoryDropdown
                      selectedRoom={selectedRoom}
                      onRoomSelect={(room) => {
                        setSelectedRoom(room);
                        field.onChange(room);
                      }}
                      onOpenChange={setRoomOpen}
                      className="w-full"
                    />
                  </div>
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="roomCategory" />
              </div>
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Category</FormLabel>
                <FormControl>
                  <div className="flex-1">
                    <CategoryDropdown
                      selectedCategory={selectedCategory}
                      onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        field.onChange(category);
                      }}
                      onOpenChange={setCategoryOpen}
                      className="w-full"
                    />
                  </div>
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="category" />
              </div>
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={selectedStatus}
                    onValueChange={(value: ItemStatusType) => {
                      setSelectedStatus(value);
                      field.onChange(value);
                    }}
                    className="flex flex-1"
                    noGap
                  >
                    {ORDERED_ITEM_STATUSES.map((status) => (
                      <div
                        key={status}
                        className={cn(
                          'flex items-center gap-2 cursor-pointer rounded-md px-4 py-1.5 hover:bg-muted/50 transition-colors',
                          selectedStatus === status && 'bg-muted'
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedStatus(status);
                          field.onChange(status);
                        }}
                      >
                        <div className="aspect-square h-4 w-4 rounded-full border border-primary text-primary">
                          {selectedStatus === status && (
                            <DotFilledIcon className="h-3.5 w-3.5 fill-primary" />
                          )}
                        </div>
                        <ItemStatusBadge itemStatus={status} />
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="status" />
              </div>
            </FormItem>
          )}
        />

        {/* Model/Serial Number Field */}
        <FormField
          control={form.control}
          name="modelSerial"
          render={({ field }) => (
            <FormItem className="flex flex-col m-0">
              <div className="flex items-center gap-4">
                <FormLabel className={labelMinWidthClass}>Model/SN</FormLabel>
                <FormControl>
                  <InputClearable
                    {...field}
                    placeholder="Model or Serial Number..."
                    className="flex-1"
                    value={modelSerialInput}
                    onChange={(e) => {
                      setModelSerialInput(e.target.value);
                      field.onChange(e);
                    }}
                    onClear={() => {
                      setModelSerialInput('');
                      field.onChange('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && form.formState.isValid) {
                        handleQuickAdd(e);
                      }
                    }}
                    escapeKeyClears
                    autoComplete="off"
                  />
                </FormControl>
              </div>
              <div className="ml-[calc(80px+1rem)]">
                <FormErrorMessage fieldName="modelSerial" />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
