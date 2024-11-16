import { describe, test, expect, vi } from 'vitest';
import * as fs from 'node:fs';
import { getTeaByName, saveTea, generateNewTeaId } from './saver';

vi.mock('node:fs');

describe('getTeaByName', () => {
  test('should return the correct tea when name exists', () => {
    const teaData = [{ id: 1, name: 'Purple Tea', description: 'Delicious tea' }];
    
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(teaData));
    fs.existsSync.mockReturnValueOnce(true); 

    const tea = getTeaByName('Purple Tea');
    expect(tea).toEqual(teaData[0]); 
  });

  test('should return undefined when name does not exist', () => {
    const teaData = [{ id: 1, name: 'Purple Tea', description: 'Delicious tea' }];
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(teaData));
    fs.existsSync.mockReturnValueOnce(true); 

    const tea = getTeaByName('Black Tea');
    expect(tea).toBeUndefined(); 
  });

  test('should handle empty dataset gracefully', () => {
    fs.existsSync.mockReturnValueOnce(true);
    fs.readFileSync.mockReturnValueOnce('[]'); 

    const tea = getTeaByName('Purple Tea');
    expect(tea).toBeUndefined(); 
  });
});

describe('generateNewTeaId', () => {
  test('should return a unique id', () => {
    const now = 1632448800000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    const id = generateNewTeaId();
    expect(id).toBe(now);
  });
});

describe('saveTea', () => {
  test('should add a new tea with unique id and name', () => {
    const initialData = [];
    const newTea = { id: 1, name: 'Purple Tea', description: 'Delicious tea' };

    fs.readFileSync.mockReturnValue(JSON.stringify(initialData));
    fs.existsSync.mockReturnValue(true);

    saveTea(newTea);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'data.json',
      JSON.stringify([newTea], null, 2)
    );
  });

  test('should update tea if id matches an existing one', () => {
    const initialData = [{ id: 1, name: 'Purple Tea', description: 'Old desc' }];
    const updatedTea = { id: 1, name: 'Purple Tea', description: 'Updated desc' };

    fs.readFileSync.mockReturnValue(JSON.stringify(initialData));
    fs.existsSync.mockReturnValue(true);

    saveTea(updatedTea);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'data.json',
      JSON.stringify([updatedTea], null, 2)
    );
  });

  test('should throw an error if name exists with a different id', () => {
    const initialData = [{ id: 1, name: 'Purple Tea', description: 'Delicious tea' }];
    const conflictingTea = { id: 2, name: 'Purple Tea', description: 'New tea' };

    fs.readFileSync.mockReturnValue(JSON.stringify(initialData));
    fs.existsSync.mockReturnValue(true);

    expect(() => saveTea(conflictingTea)).toThrowError(
      'Tea with name Purple Tea already exists'
    );
  });

  test('should throw an error if id exists with a different name', () => {
    const initialData = [{ id: 1, name: 'Purple Tea', description: 'Delicious tea' }];
    const conflictingTea = { id: 1, name: 'Black Tea', description: 'New tea' };

    fs.readFileSync.mockReturnValue(JSON.stringify(initialData));
    fs.existsSync.mockReturnValue(true);

    expect(() => saveTea(conflictingTea)).toThrowError(
      'Tea with id 1 already exists'
    );
  });
});
