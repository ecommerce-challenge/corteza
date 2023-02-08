<template>
  <b-tab title="Tab">
    <div class="">
      <h5 class="text-primary">
        {{ $t('tabs.displayTitle') }}
      </h5>

      <b-row
        class="mb-3 mt-3 ml-0 mr-0 justify-content-between"
        no-gutters
      >
        <b-form-group label="Appearance">
          <b-form-radio-group
            id="appearance"
            v-model="block.options.style.appearance"
            buttons
            button-variant="outline-primary"
            size="sm"
            :options="style.appearance"
            name="display-options"
          />
        </b-form-group>

        <b-form-group label="Alignment">
          <b-form-radio-group
            id="alignment"
            v-model="block.options.style.alignment"
            buttons
            button-variant="outline-primary"
            size="sm"
            :options="style.alignment"
            name="display-options"
            @input="updateStyle"
          />
        </b-form-group>
        <b-form-group label="Fill or Justify">
          <b-form-radio-group
            id="fillJustify"
            v-model="block.options.style.fillJustify"
            buttons
            button-variant="outline-primary"
            size="sm"
            :options="style.fillJustify"
            name="display-options"
          />
        </b-form-group>
      </b-row>
    </div>

    <div
      class="d-flex"
    >
      <h5
        class="font-weight-light m-0 p-0 text-primary"
      >
        {{ $t('tabs.title') }}
      </h5>

      <b-button
        variant="link"
        size="md"
        :title="$t('tabs.tooltip.addTab')"
        :disabled="allSelected"
        class="p-0 ml-3 text-decoration-none"
        @click="Add"
      >
        {{ $t('tabs.addTab') }}
      </b-button>
    </div>

    <b-table-simple
      v-if="block.options.tabs.length"
      borderless
      small
    >
      <b-thead>
        <tr>
          <th />

          <th
            class="text-primary"
          >
            {{ $t('tabs.table.columns.title.label') }}
          </th>

          <th
            class="text-primary"
          >
            {{ $t('tabs.table.columns.block.label') }}
          </th>

          <th />
        </tr>
      </b-thead>

      <draggable
        v-model="block.options.tabs"
        tag="b-tbody"
      >
        <tr
          v-for="(tab, index) in block.options.tabs"
          :key="index"
        >
          <b-td class="align-middle">
            <b-button
              variant="link"
              :title="$t('tabs.tooltip.move')"
              class="p-0"
            >
              <font-awesome-icon
                :icon="['fas', 'bars']"
                class="grab m-0 text-light p-0"
              />
            </b-button>
          </b-td>

          <b-td
            class="align-middle"
            style="width: 50%"
          >
            <b-form-input
              v-model="tab.title"
              :title="$t('tabs.tooltip.title')"
              :disabled="tab.indexOnMain === null"
              :placeholder="$t('tabs.form.title')"
            />
          </b-td>

          <b-td
            class="align-middle"
            style="width: 50%"
          >
            <div
              class="d-flex"
            >
              <vue-select
                v-model="tab.indexOnMain"
                :title="$t('tabs.tooltip.selectBlock')"
                :options="options"
                :placeholder="$t('tabs.form.placeholder')"
                :selectable="option => isSelectable(option)"
                class="bg-white m-0"
                append-to-body
                style="min-width: 95%;"
                :reduce="option => option.value"
              >
                <template #option="{ label }">
                  <p class="mb-0">
                    {{ label | truncate(25) }}
                  </p>
                </template>

                <template #selected-option="{ label }">
                  <p class="mb-0">
                    {{ label | truncate(10) }}
                  </p>
                </template>
                <template #list-footer>
                  <b-button
                    id="CreateBlockSelectorTab"
                    variant="link"
                    size="sm"
                    class="text-decoration-none"
                    block
                    :title="$t('tabs.tooltip.newBlock')"
                    @click="makeNewBlock(index)"
                  >
                    {{ $t('tabs.addTab') }}
                  </b-button>
                </template>
              </vue-select>

              <b-button
                id="popover-edit"
                :disabled="(tab.indexOnMain === null)"
                :title="$t('tabs.tooltip.edit')"
                variant="light"
                class="border-rad"
                size="sm"
                @click="editBlock(tab.indexOnMain)"
              >
                <font-awesome-icon
                  :icon="['far', 'edit']"
                />
              </b-button>
            </div>
          </b-td>

          <td
            class="text-right align-middle pr-2"
            style="min-width: 100px;"
          >
            <c-input-confirm
              :title="$t('tabs.tooltip.delete')"
              @confirmed="deleteTab(index)"
            />
          </td>
        </tr>
      </draggable>
    </b-table-simple>

    <div
      v-else
      class="text-center pt-5 pb-5"
    >
      <p>
        {{ $t('tabs.noTabs') }}
      </p>
    </div>

    <b-modal
      id="createBlockSelectorTab"
      size="lg"
      scrollable
      hide-footer
      :title="$t('tabs.newBlockModal')"
    >
      <new-block-selector
        :record-page="!!module"
        @select="addBlock"
      />
    </b-modal>
  </b-tab>
</template>

<script>
import base from './base'
import draggable from 'vuedraggable'
import { VueSelect } from 'vue-select'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'TabConfigurator',

  components: {
    draggable,
    VueSelect,
    //  Importing like this because configurator is recursive
    NewBlockSelector: () => import('corteza-webapp-compose/src/components/Admin/Page/Builder/Selector'),
  },

  extends: base,

  data () {
    return {
      activeIndex: null,
      msg: '',
      style: {
        appearance: [
          { text: this.$t('tabs.style.appearance.tabs'), value: 'tabs', disabled: false },
          { text: this.$t('tabs.style.appearance.pills'), value: 'pills', disabled: false },
          { text: this.$t('tabs.style.appearance.small'), value: 'small', disabled: false },
        ],

        alignment: [
          { text: this.$t('tabs.style.alignment.left'), value: 'left', disabled: false },
          { text: this.$t('tabs.style.alignment.center'), value: 'center', disabled: false },
          { text: this.$t('tabs.style.alignment.right'), value: 'right', disabled: false },
        ],

        fillJustify: [
          { text: this.$t('tabs.style.fillJustify.fill'), value: 'fill', disabled: false },
          { text: this.$t('tabs.style.fillJustify.justified'), value: 'justified', disabled: false },
          { text: this.$t('tabs.style.fillJustify.none'), value: 'none', disabled: false },
        ],
      },
      untabbedBlock: [],
    }
  },

  computed: {

    options () {
      return this.page.blocks.flatMap((block, index) => {
        if (block.kind === 'Tabs') {
          return []
        }

        return { value: index, label: block.title || `Block-${block.kind}-${index}` }
      })
    },

    allSelected () {
      return this.block.options.tabs.length === this.options.length
    },
  },

  created () {
    this.$root.$on('builder-cancel', this.cancel)
  },

  destroyed () {
    this.$root.$off('builder-cancel', this.cancel)
  },

  methods: {

    Add (e, blockIndex) {
      // "e" is the event object
      this.block.options.tabs.push({
        block: undefined,
        indexOnMain: blockIndex || null,
        title: undefined,
      })
    },

    makeNewBlock (index) {
      this.$bvModal.show('createBlockSelectorTab')
      this.activeIndex = index
    },

    updateStyle (v) {
      if (v === 'center') {
        this.style.fillJustify.find(j => j.value === 'justified').disabled = true
        this.block.options.style.fillJustify = 'none'
      } else {
        this.style.fillJustify.find(j => j.value === 'justified').disabled = false
      }
    },

    isSelectable (option) {
      return !this.block.options.tabs.some(t => t.indexOnMain === option.value)
    },

    addBlock (block) {
      this.$bvModal.hide('createBlockSelectorTab')
      this.$root.$emit('tab-createRequest', { block, tabIndex: this.activeIndex })
    },

    cancel () {
      this.retabBlock()
    },

    deleteTab (tabIndex) {
      const tab = this.block.options.tabs[tabIndex]
      if (tab.indexOnMain !== null) {
        this.untabBlock(tab)
      }
      this.block.options.tabs.splice(tabIndex, 1)
    },

    untabBlock (tab) {
      const tabOccurrence = this.determineTabOccurrence(tab)
      if (tabOccurrence === 1) {
        this.page.blocks[tab.indexOnMain].options.tabbed = false
        this.untabbedBlock.push(tab.indexOnMain)
      }
    },

    retabBlock () {
      this.untabbedBlock.forEach((index) => {
        this.page.blocks[index].options.tabbed = true
      })
      this.untabbedBlock = []
    },

    editBlock (index = undefined) {
      const isTabAddedToPage = this.page.blocks.filter(({ kind }) => kind === 'Tabs')
        .find(({ options }) => options.blockIndex === this.block.options.blockIndex)
      if (!isTabAddedToPage) {
        this.msg = this.$t('tabs.alertSave')
        this.$bvToast.toast(this.msg, {
          title: this.$t('tabs.alertSaveTitle'),
          variant: 'danger',
          solid: true,
        })
        return
      }
      this.$root.$emit('tab-editRequest', index)
    },

    determineTabOccurrence (tab) {
      const allTabs = this.page.blocks.filter(({ kind, options }) => kind === 'Tabs' && options.blockIndex !== this.block.options.blockIndex)
        .concat(this.block)
        .map(({ options }) => options.tabs).flat().map(({ indexOnMain }) => indexOnMain)
      const tabOccurrence = allTabs.filter((t) => t === tab.indexOnMain).length
      return tabOccurrence
    },
  },
}
</script>

<style scoped>
.border-rad {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
