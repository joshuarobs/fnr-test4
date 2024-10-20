import React, { useState } from 'react';
import { Button, Input } from '@react-monorepo/shared';
import { ContentsTable } from './contents-table/ContentsTable';
import { placeholderContentsData } from './contents-table/placeholderContentsData';
import { randomItemsData } from './contents-table/randomItemsData';
import { Item } from './contents-table/item';

export const MainContents = () => {
  const [tableData, setTableData] = useState<Item[]>(placeholderContentsData);
  const [newItemName, setNewItemName] = useState('');
  const [updateItemId, setUpdateItemId] = useState<number | null>(null);
  const [updateItemName, setUpdateItemName] = useState('');

  const addItem = (newItem: Item) => {
    setTableData([...tableData, newItem]);
  };

  const removeItem = (itemId: number) => {
    setTableData(tableData.filter((item) => item.id !== itemId));
  };

  const updateItem = (updatedItem: Item) => {
    setTableData(
      tableData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const getHighestId = () => {
    return tableData.reduce((maxId, item) => Math.max(maxId, item.id), 0);
  };

  const getRandomStatus = (): 'RS' | 'NR' | 'VPOL' => {
    const rand = Math.random();
    if (rand < 0.6) return 'NR';
    if (rand < 0.8) return 'RS';
    return 'VPOL';
  };

  const handleAddItem = () => {
    let randomItem =
      randomItemsData[Math.floor(Math.random() * randomItemsData.length)];
    let itemName = newItemName || randomItem.name;

    const newItem: Item = {
      id: getHighestId() + 1,
      group: randomItem.group,
      name: itemName,
      category: randomItem.category,
      status: getRandomStatus(),
      oisquote: randomItem.oisquote || null,
      ourquote: randomItem.ourquote || 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      amount: randomItem.amount || 0,
      modelSerialNumber: randomItem.modelSerialNumber || '',
      receiptPhotoUrl: randomItem.receiptPhotoUrl || '',
    };
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

  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold mb-4">Main Contents</h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="New item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <Button onClick={handleAddItem}>Add Item</Button>
      </div>

      <div className="mb-4">
        <Button onClick={handleRemoveLastItem}>Remove Last Item</Button>
      </div>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Item ID to update"
          value={updateItemId !== null ? updateItemId.toString() : ''}
          onChange={(e) => setUpdateItemId(parseInt(e.target.value, 10))}
        />
        <Input
          type="text"
          placeholder="New item name"
          value={updateItemName}
          onChange={(e) => setUpdateItemName(e.target.value)}
        />
        <Button onClick={handleUpdateItem}>Update Item</Button>
      </div>

      <ContentsTable
        data={tableData}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
      />
    </main>
  );
};
