import { schema } from 'nexus'
schema.objectType({
  name: 'Post',            // <- Name of your type
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('title')      // <- Field named `title` of type `String`
    t.string('body')       // <- Field named `body` of type `String`
    t.boolean('published') // <- Field named `published` of type `Boolean`
  },
})

schema.extendType({
  type: 'Query',            // 2
  definition(t) {
    t.field('drafts', {     // 3
      nullable: false,      // 4
      type: 'Post',         // 5
      list: true,           // 6
      resolve(_root, _args, ctx) { // 1
        return ctx.db.posts.filter(p => p.published === false)  // 2
      }
    }),
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.posts.filter(p => p.published === true)
      }
    })
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      args: {                                        // 1
        title: schema.stringArg({ required: true }), // 2
        body: schema.stringArg({ required: true }),  // 2
      },
      resolve(_root, args, ctx) {
        const draft = {
          id: ctx.db.posts.length + 1,
          title: args.title,                         // 3
          body: args.body,                           // 3
          published: false,
        }
        ctx.db.posts.push(draft)
        return draft
      },
    }),
    t.field('publish', {
      type: 'Post',
      args: {
        draftId: schema.intArg({ required: true}),
      },
      resolve(_root, args, ctx) {
        let draftToPublish = ctx.db.posts.find(p => p.id === args.draftId)

        if(!draftToPublish) {
          throw new Error('Could not find draft with id = ' + args.draftId)
        }

        draftToPublish.published = true

        return draftToPublish
      }
    })
  },
})