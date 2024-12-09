import { KeyboardEvent } from 'react';
import {
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from '@react-monorepo/shared';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../../../../shared/src/lib/utils';
import { ItemCategory } from '../itemCategories';
import {
  ItemStatus,
  ItemStatusType,
  ORDERED_ITEM_STATUSES,
} from '../ItemStatus';
import { ItemStatusBadge } from '../ItemStatusBadge';
import { CategoryDropdown } from '../shared/CategoryDropdown';
import { RoomCategory } from '../roomCategories';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const labelMinWidthClass = 'min-w-[80px] text-right';

// Form schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
  room: z.string().optional(),
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
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
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
      room: selectedRoom,
      category: selectedCategory,
      status: selectedStatus,
      modelSerial: modelSerialInput,
    },
  });

  // Get room options from RoomCategory enum
  const rooms = Object.values(RoomCategory).map((room) => ({
    value: room.toLowerCase(),
    label: room
      .replace(/_/g, ' ')
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
  }));

  // Handle quantity input to allow any input but default to 1 if invalid on submit
  const handleQuantityChange = (value: string) => {
    setQuantityInput(value);
    const parsedValue = parseInt(value);
    // Only update form if it's a valid number
    if (!isNaN(parsedValue) && parsedValue > 0) {
      form.setValue('quantity', parsedValue);
    } else {
      form.setValue('quantity', 1);
    }
  };

  // Handle form submission
  const onSubmit = (data: FormSchema) => {
    // Ensure quantity is 1 if invalid
    if (isNaN(parseInt(quantityInput)) || parseInt(quantityInput) < 1) {
      setQuantityInput('1');
      form.setValue('quantity', 1);
    }
    // The parent component handles the actual submission via handleQuickAdd
    if (form.formState.isValid) {
      handleQuickAdd({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className={labelMinWidthClass}>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Shirt, Table, Shovel, etc..."
                  className="flex-1"
                  value={quickAddInput}
                  onChange={(e) => {
                    setQuickAddInput(e.target.value);
                    field.onChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && form.formState.isValid) {
                      handleQuickAdd(e);
                    }
                  }}
                  autoComplete="off"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
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
                    if (e.key === 'Enter' && form.formState.isValid) {
                      handleQuickAdd(e);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room Field */}
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className={labelMinWidthClass}>Room</FormLabel>
              <FormControl>
                <Popover
                  open={roomOpen}
                  onOpenChange={setRoomOpen}
                  modal={true}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={roomOpen}
                      className="flex-1 justify-between"
                    >
                      {selectedRoom
                        ? rooms.find((room) => room.value === selectedRoom)
                            ?.label
                        : 'Select room...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    style={{
                      ['--radix-popover-trigger-width' as any]:
                        'var(--radix-popover-trigger-width)',
                    }}
                  >
                    <Command>
                      <CommandInput placeholder="Search room..." />
                      <CommandList>
                        <CommandEmpty>No room found.</CommandEmpty>
                        <CommandGroup>
                          {rooms.map((room) => (
                            <CommandItem
                              key={room.value}
                              value={room.value}
                              onSelect={(currentValue) => {
                                setSelectedRoom(
                                  currentValue === selectedRoom
                                    ? ''
                                    : currentValue
                                );
                                field.onChange(currentValue);
                                setRoomOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedRoom === room.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {room.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className={labelMinWidthClass}>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  value={selectedStatus}
                  onValueChange={(value) => {
                    setSelectedStatus(value as ItemStatusType);
                    field.onChange(value);
                  }}
                  className="flex gap-3 flex-1"
                >
                  {ORDERED_ITEM_STATUSES.map((status) => (
                    <div
                      key={status}
                      className="flex items-center cursor-pointer rounded-md px-3 py-1.5 hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedStatus(status);
                        field.onChange(status);
                      }}
                    >
                      <Label
                        htmlFor={`status-${status}`}
                        className="flex items-center cursor-pointer"
                      >
                        <RadioGroupItem
                          value={status}
                          id={`status-${status}`}
                        />
                        <span className="ml-2">
                          <ItemStatusBadge itemStatus={status} />
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model/Serial Number Field */}
        <FormField
          control={form.control}
          name="modelSerial"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className={labelMinWidthClass}>Model/SN</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Model or Serial Number..."
                  className="flex-1"
                  value={modelSerialInput}
                  onChange={(e) => {
                    setModelSerialInput(e.target.value);
                    field.onChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && form.formState.isValid) {
                      handleQuickAdd(e);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
