<template>
  <b-tab :title="$t('reverseReference.label')">
      <b-form-group
        class="form-group"
        :label="$t('general.module')"
      >
        <b-form-select
          v-model="options.moduleID"
          :options="moduleOptions"
          text-field="name"
          value-field="moduleID"
          required
        />
      </b-form-group>

  </b-tab>
</template>
<script>
import { NoID } from '@cortezaproject/corteza-js'
import { mapGetters } from 'vuex'
import base from '../base'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'ReverseReference',

  extends: base,

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    moduleOptions () {
      return [
        { moduleID: NoID, name: this.$t('general.label.none') },
        ...this.modules,
      ]
    },
  }
}
</script>
