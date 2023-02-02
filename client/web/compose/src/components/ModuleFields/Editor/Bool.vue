<template>
  <b-form-group>
    <b-form-checkbox v-model="value">
      {{ field.label || field.name }}
      <hint
        :id="field.fieldID"
        :text="hint"
        class="d-inline-block text-primary"
      />

      <b-spinner
        v-if="evaluating"
        style="width: .85rem; height: .85rem;"
        type="grow"
        small
        variant="primary"
        class="mt-1 ml-1"
      />
    </b-form-checkbox>

    <small
      class="form-text font-weight-light text-muted"
    >
      {{ description }}
    </small>
    <errors :errors="errors" />
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,

  computed: {
    value: {
      get () {
        return this.record.values[this.field.name] === '1'
      },

      set (value) {
        this.record.values[this.field.name] = value ? '1' : '0'
      },
    },
  },
}
</script>
