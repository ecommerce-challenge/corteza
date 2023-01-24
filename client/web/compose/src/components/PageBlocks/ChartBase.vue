<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
    @refreshBlock="refresh"
  >
    <chart-component
      v-if="chart"
      :key="key"
      :chart="chart"
      :record="record"
      :reporter="reporter"
      @click="foo"
    />
  </wrap>
</template>
<script>
import { mapActions } from 'vuex'
import base from './base'
import ChartComponent from '../Chart'
import { NoID } from '@cortezaproject/corteza-js'
import { evaluatePrefilter } from 'corteza-webapp-compose/src/lib/record-filter'

export default {
  i18nOptions: {
    namespaces: 'notification',
  },

  components: {
    ChartComponent,
  },
  extends: base,

  data () {
    return {
      chart: null,

      drillDownFilter: undefined,
    }
  },

  mounted () {
    this.fetchChart()
    this.refreshBlock(this.refresh)

    this.$root.$on('drill-down-chart', this.drillDown)
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
    }),

    async fetchChart (params = {}) {
      const { chartID } = this.options

      if (chartID === NoID) {
        return
      }

      const { namespaceID } = this.namespace

      return this.findChartByID({ chartID, namespaceID, ...params }).then((chart) => {
        this.chart = chart
      }).catch(this.toastErrorHandler(this.$t('chart.loadFailed')))
    },

    reporter (r) {
      const nr = { ...r }
      const filter = this.drillDownFilter || nr.filter

      if (nr.filter) {
        // If we use ${record} or ${ownerID} and there is no record, resolve empty
        /* eslint-disable no-template-curly-in-string */
        if (!this.record && (nr.filter.includes('${record') || nr.filter.includes('${ownerID}'))) {
          return new Promise((resolve) => resolve([]))
        }

        nr.filter = evaluatePrefilter(nr.filter, {
          record: this.record,
          recordID: (this.record || {}).recordID || NoID,
          ownerID: (this.record || {}).ownedBy || NoID,
          userID: (this.$auth.user || {}).userID || NoID,
        })
      }

      const { namespaceID } = this.namespace
      return this.$ComposeAPI.recordReport({ namespaceID, ...nr, filter })
    },

    refresh () {
      this.fetchChart({ force: true }).then(() => {
        this.key++
      })
    },

    drillDown (filter) {
      this.drillDownFilter = filter
      this.refresh()
    },

    foo ({ name }) {
      const { field } = this.chart.config.reports[0].dimensions[0]

      this.$root.$emit('drill-down-recordList', { name: field, kind: 'DateTime', value: name })
    },
  },

}
</script>
