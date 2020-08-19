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
        return ctx.db.post.findMany({ where: { published: false } })
      }
    }),
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } })
      }
    })
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      nullable: false,
      args: {                                        // 1
        title: schema.stringArg({ required: true }), // 2
        body: schema.stringArg({ required: true }),  // 2
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title,                         // 3
          body: args.body,                           // 3
          published: false,
        }
        return ctx.db.post.create({ data: draft })
      },
    }),
    t.field('publish', {
      type: 'Post',
      args: {
        draftId: schema.intArg({ required: true}),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        });
      }
    })
  },
})