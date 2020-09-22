import { schema } from 'nexus'

schema.objectType({
  name: 'Topic',            // <- Name of your type
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('title')      // <- Field named `title` of type `String`
    t.string('body')       // <- Field named `body` of type `String`
    t.int('nextTopicId')
    t.int('certificateId')
  },
})