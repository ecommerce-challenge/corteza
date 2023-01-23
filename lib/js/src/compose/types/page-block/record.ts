import { PageBlock, PageBlockInput, Registry } from './base'

const kind = 'Record'

interface FieldConditions {
  field: {};
  condition: string;
}

interface Options {
  fields: unknown[];
  fieldConditions: FieldConditions[];
}

const defaults: Readonly<Options> = Object.freeze({
  fields: [],
  fieldConditions: [],
})

export class PageBlockRecord extends PageBlock {
  readonly kind = kind

  options: Options = { ...defaults }

  constructor (i?: PageBlockInput) {
    super(i)
    this.applyOptions(i?.options as Partial<Options>)
  }

  applyOptions (o?: Partial<Options>): void {
    if (!o) return

    if (o.fields) {
      this.options.fields = o.fields
    }

    if (o.fieldConditions) {
      this.options.fieldConditions = o.fieldConditions
    }
  }
}

Registry.set(kind, PageBlockRecord)
