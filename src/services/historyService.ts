
import { supabase } from "@/integrations/supabase/client";

/**
 * Logs a change to the history table
 * 
 * @param entityType The type of entity (non_conformance, audit_report, etc.)
 * @param entityId The ID of the entity that was changed
 * @param fieldName The field that was changed
 * @param oldValue The previous value
 * @param newValue The new value
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const logHistory = async (
  entityType: string,
  entityId: string,
  fieldName: string,
  oldValue: any,
  newValue: any
): Promise<boolean> => {
  try {
    // Determine which history table to use based on entity type
    let tableName: "non_conformance_history" | "audit_history";
    switch (entityType) {
      case 'non_conformance':
        tableName = 'non_conformance_history';
        break;
      case 'audit':
        tableName = 'non_conformance_history'; // We'll use the same table for now, can be expanded later
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    // Format values as strings for storage
    const oldValueStr = oldValue === null ? null : String(oldValue);
    const newValueStr = newValue === null ? null : String(newValue);

    // Insert the history record
    const { error } = await supabase
      .from(tableName)
      .insert({
        non_conformance_id: entityId,
        field_name: fieldName,
        old_value: oldValueStr,
        new_value: newValueStr,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error logging history:", error);
    return false;
  }
};

/**
 * Fetches history records for a specific entity
 * 
 * @param entityType The type of entity (non_conformance, audit_report, etc.)
 * @param entityId The ID of the entity
 * @returns A promise that resolves to the history records
 */
export const fetchHistory = async (entityType: string, entityId: string) => {
  try {
    // Determine which history table to query based on entity type
    let tableName: "non_conformance_history" | "audit_history";
    let idField: string;
    
    switch (entityType) {
      case 'non_conformance':
        tableName = 'non_conformance_history';
        idField = 'non_conformance_id';
        break;
      case 'audit':
        tableName = 'non_conformance_history'; // We'll use the same table for now
        idField = 'non_conformance_id'; // Using the same field for simplicity
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    // Fetch the history records
    const { data, error } = await supabase
      .from(tableName)
      .select(`
        id, 
        field_name, 
        old_value, 
        new_value, 
        changed_at,
        changed_by
      `)
      .eq(idField, entityId)
      .order('changed_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching ${entityType} history:`, error);
    throw error;
  }
};
