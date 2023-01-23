<template>
  <b-tab
    :title="$t('record.label')"
  >
    <fieldset
      class="form-group"
    >
      <label>
        {{ $t('general.module') }}
      </label>
      <input
        v-if="module"
        v-model="module.name"
        class="form-control"
        type="text"
        readonly
      >
    </fieldset>

    <b-form-group
      :label="$t('module:general.fields')"
    >
      <field-picker
        v-if="module"
        :module="module"
        :fields.sync="options.fields"
        style="max-height: 52vh;"
      />
    </b-form-group>

    <hr>

    <div>
      <b-form-group
        label-size="lg"
      >
        <template #label>
          <div
            class="d-flex"
          >
            {{ $t('record.fieldConditions.label') }}

            <b-button
              variant="link"
              class="p-0 ml-1 mr-auto"
              @click="addCondition"
            >
              {{ $t('record.fieldConditions.action') }}
            </b-button>

            <b-button
              variant="link"
              :href="`${documentationURL}#value-sanitizers`"
              target="_blank"
              class="p-0"
            >
              {{ $t('record.fieldConditions.help') }}
            </b-button>
          </div>
        </template>
      </b-form-group>

      <b-table-simple
        v-if="block.options.fieldConditions.length"
        borderless
      >
        <b-tbody>
          <b-tr
            v-for="(condition, i) in block.options.fieldConditions"
            :key="i"
          >
            <b-td>
              <vue-select
                v-model="condition.field"
                :options="fieldOptions"
                :clearable="false"
                :selectable="option => !block.options.fieldConditions.find(c => c.field === option)"
                class="bg-white"
              />
            </b-td>

            <b-td>
              <b-input-group>
                <b-input-group-prepend>
                  <b-button variant="dark">
                    ƒ
                  </b-button>
                </b-input-group-prepend>
                <b-form-input
                  v-model="condition.condition"
                  :placeholder="$t('record.fieldConditions.placeholder')"
                />
              </b-input-group>
            </b-td>

            <b-td>
              <c-input-confirm
                size="lg"
                @confirmed="deleteCondition(i)"
              />
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </b-tab>
</template>
<script>
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/FieldPicker'
import { VueSelect } from 'vue-select'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'Record',

  components: {
    FieldPicker,
    VueSelect,
  },

  extends: base,

  computed: {
    documentationURL () {
      // eslint-disable-next-line no-undef
      const [year, month] = VERSION.split('.')
      return `https://docs.cortezaproject.org/corteza-docs/${year}.${month}/integrator-guide/compose-configuration/index.html`
    },

    fieldOptions () {
      return this.block.options.fields.filter(f => !f.isRequired).map(f => {
        return {
          name: f.name,
          label: f.label,
          fieldID: f.fieldID,
        }
      })
    },
  },

  methods: {
    addCondition () {
      if (this.options.fieldConditions.length >= this.fieldOptions.length) return
      this.options.fieldConditions.push({
        field: null,
        condition: '',
      })
    },

    deleteCondition (i) {
      this.options.fieldConditions.splice(i, 1)
    },
  },
}
</script>
