// vue mixin for conditional fields

export default {
  data () {
    return {
      fieldConditions: {},
      evaluating: false,
    }
  },

  methods: {
    evaluateExpressions () {
      if (!this.block.options.fieldConditions) return
      this.evaluating = true
      const { expressions, variables } = this.prepareFieldConditionsData()
      return this.$SystemAPI
        .expressionEvaluate({ variables, expressions })
        .then(res => {
          this.fieldConditions = res
          this.evaluating = false
          return res
        }).catch(err => {
          this.evaluating = false
          return err
        })
    },

    prepareFieldConditionsData () {
      const expressions = {}
      const variables = {
        record: {
          values: {
            ...this.record.values,
          },
        },

      }
      if (variables.record.values.toJSON) delete variables.record.values.toJSON
      this.block.options.fieldConditions.forEach(fc => {
        expressions[fc.field] = fc.condition
      })
      return { expressions, variables }
    },

    canDisplay (index) {
      let canDisplay
      // ToDO: check if fieldID can be used instead of index
      const similar = Object.keys(this.fieldConditions).find(k => k === this.fields[index].fieldID)
      similar ? canDisplay = this.fieldConditions[similar] : canDisplay = true

      return canDisplay
    },
  },
}
