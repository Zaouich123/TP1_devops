
import { describe, test, expect, vi } from 'vitest';
import { addTea } from './index.js';
import { getTeaByName, saveTea, generateNewTeaId } from './saver.js';


vi.mock('./saver.js', () => ({
  getTeaByName: vi.fn(),
  saveTea: vi.fn(),
  generateNewTeaId: vi.fn(),
}));

describe('addTea', () => {
  

  test('should update an existing tea', async () => {
    const existingTea = { id: 1, name: 'Green Tea', description: 'Old description' };
    getTeaByName.mockReturnValue(existingTea);

    const teaDto = { name: 'Green Tea', description: 'Updated description' };
    const result = addTea(teaDto);

    expect(getTeaByName).toHaveBeenCalledWith('Green Tea');
    expect(saveTea).toHaveBeenCalledWith({
      id: 1,
      name: 'Green Tea',
      description: 'Updated description',
    });
    expect(result.success).toBe(true);
  });

  test('should create a new tea if it does not exist', async () => {
    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(1);

    const teaDto = { name: 'Green Tea', description: 'Some description' };
    const result = addTea(teaDto);

    expect(getTeaByName).toHaveBeenCalledWith('Green Tea');
    expect(saveTea).toHaveBeenCalledWith({
      id: 1,
      name: 'Green Tea',
      description: 'Some description',
    });
    expect(result.success).toBe(true);
  });

  test('should return success: false if saving fails', async () => {
    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(1);
    saveTea.mockImplementation(() => {
      throw new Error('Save failed');
    });

    const teaDto = { name: 'Green Tea', description: 'Some description' };
    const result = addTea(teaDto);

    expect(result.success).toBe(false);
  });
});
