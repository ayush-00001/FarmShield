import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types - matching the actual schema
export interface FarmRecord {
  id: number;
  Animal_Type: string;
  Quantity: number;
  Fodder: number;
  Deaths: number;
  Symptoms: string;
  Vaccinations: string;
  Date: string;
}

// Database operations
export const farmRecordsService = {
  // Get all farm records
  async getRecords(): Promise<FarmRecord[]> {
    const { data, error } = await supabase
      .from('FarmLogging')
      .select('*')
      .order('Date', { ascending: false });
    
    if (error) {
      console.error('Error fetching farm records:', error);
      throw error;
    }
    
    return data || [];
  },

  // Create a new farm record
  async createRecord(record: Omit<FarmRecord, 'id'>): Promise<FarmRecord> {
    // Ensure we don't send id field since it should be auto-generated
    const { id, ...recordWithoutId } = record as any;
    
    const { data, error } = await supabase
      .from('FarmLogging')
      .insert([recordWithoutId])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating farm record:', error);
      
      // Provide more helpful error messages for common issues
      if (error.code === '42501') {
        throw new Error('Permission denied: Row Level Security is blocking this operation. Please check your database policies or contact your administrator.');
      }
      
      if (error.code === '23502') {
        throw new Error('Database constraint violation: The ID column is not set up for auto-increment. Please run the fix-id-column.sql script in your Supabase SQL editor.');
      }
      
      throw error;
    }
    
    return data;
  },

  // Update a farm record
  async updateRecord(id: number, record: Partial<Omit<FarmRecord, 'id'>>): Promise<FarmRecord> {
    const { data, error } = await supabase
      .from('FarmLogging')
      .update(record)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating farm record:', error);
      
      if (error.code === '42501') {
        throw new Error('Permission denied: Row Level Security is blocking this operation. Please check your database policies or contact your administrator.');
      }
      
      throw error;
    }
    
    return data;
  },

  // Delete a farm record
  async deleteRecord(id: number): Promise<void> {
    const { error } = await supabase
      .from('FarmLogging')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting farm record:', error);
      
      if (error.code === '42501') {
        throw new Error('Permission denied: Row Level Security is blocking this operation. Please check your database policies or contact your administrator.');
      }
      
      throw error;
    }
  }
};
