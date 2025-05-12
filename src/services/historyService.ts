
import { supabase } from "@/integrations/supabase/client";

export type EntityType = 'non_conformance' | 'audit' | 'report';
type BasicValueType = string | number | boolean | null;
type ValueType = BasicValueType | Record<string, any>;

/**
 * Logs a change to the history table
 * @param entityType The type of entity being changed
 * @param entityId The ID of the entity
 * @param fieldName The name of the field that changed
 * @param oldValue The previous value
 * @param newValue The new value
 * @param userId The ID of the user who made the change (optional)
 */
export const logHistory = async (
  entityType: EntityType,
  entityId: string,
  fieldName: string,
  oldValue: ValueType,
  newValue: ValueType,
  userId?: string
) => {
  try {
    // Convert complex objects to JSON strings for storage
    const oldValueString = typeof oldValue === 'object' && oldValue !== null
      ? JSON.stringify(oldValue)
      : String(oldValue);
    
    const newValueString = typeof newValue === 'object' && newValue !== null
      ? JSON.stringify(newValue)
      : String(newValue);

    // Get the correct table name based on entity type
    const tableName = getHistoryTableName(entityType);

    const { data, error } = await supabase
      .from(tableName)
      .insert({
        entity_id: entityId,
        field_name: fieldName,
        old_value: oldValueString,
        new_value: newValueString,
        changed_by: userId || 'system',
        changed_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error logging history: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in logHistory:', error);
    return null;
  }
};

// Helper function to get the correct table name
const getHistoryTableName = (entityType: EntityType): string => {
  switch (entityType) {
    case 'non_conformance':
      return 'non_conformance_history';
    case 'audit':
      return 'audit_history';
    case 'report':
      return 'report_history';
    default:
      return 'non_conformance_history';
  }
};

/**
 * Gets the history for a specific entity
 * @param entityType The type of entity
 * @param entityId The ID of the entity
 * @returns Array of history records
 */
export const getEntityHistory = async (entityType: EntityType, entityId: string) => {
  try {
    // Get the correct table name based on entity type
    const tableName = getHistoryTableName(entityType);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('entity_id', entityId)
      .order('changed_at', { ascending: false });
    
    if (error) {
      console.error(`Error getting history: ${error.message}`);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getEntityHistory:', error);
    return [];
  }
};

// This is the function that HistoryList.tsx was trying to import
export const fetchHistory = getEntityHistory;
