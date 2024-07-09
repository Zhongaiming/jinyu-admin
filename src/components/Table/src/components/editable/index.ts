import type { BasicColumn } from '@/components/Table/src/types/table';
import { h, Ref } from 'vue';
import EditableCell from './EditableCell.vue';

export function renderEditCell(column: BasicColumn) {
  return (record, index) => {
    const _key = column.key;
    const value = __value(record, _key);
    record.onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        record.editable = edit;
      }

      if (!edit && submit) {
        const res = await record.onSubmitEdit?.();
        if (res) {
          record.editable = false;
          return true;
        }
        return false;
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.();
      }
      return true;
    };
    return h(EditableCell, {
      value,
      record,
      column,
      index,
    });
  };
}

function __value(options, key) {
  return key.split('.').reduce((o, i) => {
    if (o) return o[i];
  }, options);
}

export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Fn[];
    cancelCbs: Fn[];
    validCbs: Fn[];
    editValueRefs: Recordable<Ref>;
  } & T
>;
