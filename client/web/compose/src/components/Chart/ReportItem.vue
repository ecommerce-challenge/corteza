<template>
  <tr class="w-100 d-inline-block">
    <td
      v-b-tooltip.noninteractive.hover
      class="handle align-middle w-100 d-inline-block"
      :class="{ 'cursor-grab': !fixed }"
    >
      <font-awesome-icon
        v-if="!fixed"
        :icon="['fas', 'bars']"
        class="text-secondary mr-1"
      />
      <slot
        name="report-label"
        :report="report"
      />
      <b-btn
        variant="link"
        class="ml-1 float-right text-dark p-0"
        @click="$emit('edit', report)"
      >
        <font-awesome-icon :icon="['far', 'edit']" />
      </b-btn>

      <c-input-confirm
        show-icon
        class="float-right"
        @confirmed="$emit('remove', report)"
      />
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    // Specifies that this item can't be moved
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
  .cursor-grab {
    cursor: grab;
  }
</style>
