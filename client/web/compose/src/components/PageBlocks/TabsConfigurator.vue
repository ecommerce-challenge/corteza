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

        <b-form-group label="Vertical or Horizontal">
          <b-form-radio-group
            id="verticalHorizontal"
            v-model="block.options.style.verticalHorizontal"
            buttons
            button-variant="outline-primary"
            size="sm"
            :options="style.verticalHorizontal"
            name="display-options"
          />
        </b-form-group>
      </b-row>
    </div>

    <div
      class="d-flex mt-5 pt-3 align-items-center"
    >
      <h5
        class="font-weight-light text-primary"
      >
        {{ $t('tabs.title') }}
      </h5>

      <b-button
        variant="link"
        size="md"
        :title="$t('tabs.tooltip.addTab')"
        class="h3 text-decoration-none"
        @click="Add"
      >
        {{ $t('tabs.addTab') }}
      </b-button>
    </div>

    <b-table-simple
      v-if="block.options.tabs.length"
      borderless
    >
      <draggable
        v-model="block.options.tabs"
        tag="b-tbody"
        :disabled="editFocused"
      >
        <tr
          v-for="(tab, index) in block.options.tabs"
          :key="index"
        >
          <td class="align-middle">
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
          </td>
          <td
            class="align-middle"
          >
            <b-input-group>
              <vue-select
                v-model="tab.indexOnMain"
                :title="$t('tabs.tooltip.selectBlock')"
                :options="options"
                class="bg-white"
                :reduce="option => option.value"
                @input="createTab(index)"
              >
                <template #list-footer>
                  <b-button
                    v-b-modal.createBlockSelectorTab
                    variant="primary"
                    size="sm"
                    class=" w-100"
                    :title="$t('tabs.tooltip.newBlock')"
                  >
                    {{ $t('tabs.newBlock') }}
                  </b-button>
                </template>
              </vue-select>

              <b-input-group-append>
                <b-button
                  id="popover-edit"
                  :disabled="(tab.indexOnMain === null)"
                  :title="$t('tabs.tooltip.edit')"
                  variant="primary"
                  @click="editBlock(tab.indexOnMain)"
                >
                  <font-awesome-icon
                    :icon="['far', 'edit']"
                  />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </td>
          <td class="align-middle">
            <c-input-confirm
              :title="$t('tabs.tooltip.delete')"
              size="lg"
              link
              @confirmed="deleteTab(index)"
            />
          </td>
        </tr>
      </draggable>
    </b-table-simple>

    <div
      v-else
      class="text-center tex-secondary pt-5 pb-5"
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
    //  Importing like this because configurator is recursive
    NewBlockSelector: () => import('corteza-webapp-compose/src/components/Admin/Page/Builder/Selector'),
    draggable,
    VueSelect,
  },

  extends: base,

  data () {
    return {
      alert: false,
      tabWarning: false,
      msg: '',
      editFocused: false,
      style: {
        appearance: [
          { text: this.$t('tabs.style.appearance.tabs'), value: 'tabs' },
          { text: this.$t('tabs.style.appearance.pills'), value: 'pills' },
          { text: this.$t('tabs.style.appearance.small'), value: 'small' },
        ],

        alignment: [
          { text: this.$t('tabs.style.alignment.left'), value: 'left' },
          { text: this.$t('tabs.style.alignment.center'), value: 'center' },
          { text: this.$t('tabs.style.alignment.right'), value: 'right' },
        ],

        fillJustify: [
          { text: this.$t('tabs.style.fillJustify.fill'), value: 'fill' },
          { text: this.$t('tabs.style.fillJustify.justified'), value: 'justified' },
          { text: this.$t('tabs.style.fillJustify.none'), value: 'none' },
        ],

        verticalHorizontal: [
          { text: this.$t('tabs.style.verticalHorizontal.vertical'), value: 'vertical' },
          { text: this.$t('tabs.style.verticalHorizontal.horizontal'), value: 'none' },
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
        block: {},
        indexOnMain: blockIndex || null,
      })
      // dragging while adding a new tab causes ui distortions
      this.editFocused = true
      // controls whether save and close button should be active
      this.$root.$emit('tab-checkState')
    },

    addBlock (block, index = undefined) {
      this.$bvModal.hide('createBlockSelectorTab')
      this.$root.$emit('tab-newBlockRequest', { block, index })
    },

    cancel () {
      this.retabBlock()
    },

    createTab (tabIndex) {
      const blockToTab = this.block.options.tabs[tabIndex].indexOnMain

      const newTab = {
        block: this.page.blocks[blockToTab],
        indexOnMain: blockToTab,
      }

      console.log({ newTab, tabIndex, tabs: this.block.options.tabs })
      this.updateTabs(newTab, tabIndex)
      this.$root.$emit('tab-checkState')
      this.editFocused = false
    },

    updateTabs (tab, tabIndex) {
      console.log({ tab, tabIndex, tabs: this.block.options.tabs })
      if (tab.block.kind === 'Tabs') {
        return
      }
      this.block.options.tabs[tabIndex] = tab
    },

    deleteTab (tabIndex) {
      const tab = this.block.options.tabs[tabIndex]
      if (tab.indexOnMain !== null) {
        this.untabBlock(tab)
      }
      this.block.options.tabs.splice(tabIndex, 1)
      this.$root.$emit('tab-checkState')
      this.editFocused = false
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
        this.alert = true
        this.msg = this.$t('tabs.alertSave')
        setTimeout(() => {
          this.alert = false
        }, 1500)
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
