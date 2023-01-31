const types = {
  loading: 'loading',
  loaded: 'loaded',
  pending: 'pending',
  completed: 'completed',
  setRecordPagination: 'setRecordPagination',
  clearRecordPagination: 'clearRecordPagination',
}

export default function (ComposeAPI) {
  return {
    namespaced: true,

    state: {
      loading: false,
      pending: false,
      recordPaginationIds: [],
    },

    getters: {
      loading: (state) => state.loading,

      pending: (state) => state.pending,

      recordPaginationIds (state) {
        return state.recordPaginationIds
      },

      getRecordNavigationIndex: (state) => (recordID) => {
        return state.recordPaginationIds.indexOf(recordID)
      },

      nextRecordNavigationPrev: ({ recordPaginationIds }, { getRecordNavigationIndex }) => (recordID) => {
        const recordIndex = getRecordNavigationIndex(recordID)
        const index = recordIndex !== undefined ? recordIndex : 1

        return recordPaginationIds[index - 1] !== undefined
      },

      nextRecordNavigationNext: ({ recordPaginationIds }, { getRecordNavigationIndex }) => (recordID) => {
        const recordIndex = getRecordNavigationIndex(recordID)
        const index = recordIndex !== undefined ? recordIndex : 1

        return recordPaginationIds[index + 1] !== undefined
      },

      getNextOrPrevRecordId: (state, { getRecordNavigationIndex }) => (recordID, value) => {
        let recordIndex = getRecordNavigationIndex(recordID)

        if (value === 'prev') {
          recordIndex -= 1
        } else if (value === 'next') {
          recordIndex += 1
        }

        return state.recordPaginationIds[recordIndex]
      },
    },

    actions: {
      loadPaginationRecords ({ commit }, { filter, moduleID, namespaceID, queries, incTotal, incPageNavigation } = {}) {
        commit(types.pending)

        return Promise.all(queries.map((query) => {
          return ComposeAPI.recordList({ ...filter, moduleID, namespaceID, query, incTotal, incPageNavigation })
            .then(({ set }) => {
              return set.map(({ recordID }) => recordID)
            })
        })).finally(() => {
          commit(types.completed)
        }).then(([prevRecords, nextRecords]) => {
          commit(types.setRecordPagination, [...prevRecords, ...nextRecords])
        })
      },

      clearRecordIds ({ commit }) {
        commit(types.clearRecordPagination)
      },
    },

    mutations: {
      [types.loading] (state) {
        state.loading = true
      },

      [types.loaded] (state) {
        state.loading = false
      },

      [types.pending] (state) {
        state.pending = true
      },

      [types.completed] (state) {
        state.pending = false
      },

      [types.setRecordPagination] (state, recordIds) {
        state.recordPaginationIds = recordIds
      },

      [types.clearRecordPagination] (state) {
        state.recordPaginationIds = []
      },
    },
  }
}
