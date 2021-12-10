import React, { useState, useEffect } from 'react';
import SelectionArea from '@simonwep/selection-js';
import emitter from '@/helpers/mitt';

export const useSelection = ({ updateMulArr, doGroupApi, cancelGroupApi }) => {
  const [selectionGroupId, setState] = useState(null);

  useEffect(() => {
    const selection = new SelectionArea({
      selectables: ['#canvas > div'],
      boundaries: ['#canvas'],
    })
      .on('start', ({ store, event }) => {
        // Remove class if the user isn't pressing the control key or ⌘ key
        if (!event.ctrlKey && !event.metaKey) {
          // Unselect all elements
          for (const el of store.stored) {
            el.classList.remove('selected');
          }

          // Clear previous selection
          selection.clearSelection();
        }
      })
      .on(
        'move',
        ({
          store: {
            changed: { added, removed },
          },
          event,
        }) => {
          if (!event) {
            return;
          }
          for (const el of added) {
            emitter.emit(`${el.id}_selection_show`, el.id);
            updateMulArr({
              id: el.id,
            });
          }
        },
      )
      .on('stop', async e => {
        const {
          store: { selected },
        } = e;
        for (const v of selected) {
          emitter.emit(`${v.id}_selection_hidden`, v.id);
        }
        const groupId = await doGroupApi();
        if (groupId) {
          console.log('groupidgroupid', groupId);
          emitter.emit(`${groupId}_selection_show`, groupId);
          setState(groupId);
        }
      });
    const canvasEle = document.getElementById('canvas');
    canvasEle.addEventListener('click', e => {
      console.log('eeeeee', e);
      const targetId = e.target.id;
      if (!targetId.includes(selectionGroupId)) {
        cancelGroupApi({
          id: selectionGroupId,
        });
      }
      selection.disable();
    });
    canvasEle.addEventListener('mousemove', e => {
      selection.enable();
    });
  }, [updateMulArr, doGroupApi]);

  console.log('selectionGroupIdselectionGroupId', selectionGroupId);
};
